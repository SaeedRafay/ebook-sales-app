const express = require("express");
const keys = require("./config/keys");
const stripe = require("stripe")(keys.stripeSecretKey);
const bodyParser = require("body-parser");
const exphbs = require("express-handlebars");

const port = process.env.PORT || 5000;

const app = express();

// Handlebars Middleware
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Set Static Folder
app.use(express.static(`${__dirname}/public`));

// Index Route
app.get("/", (req, res) => {
  res.render("index", {
    stripePublishableKey: keys.stripePublishableKey,
  });
});

// Charge Route
app.post("/charge", async (req, res) => {
  // const app_url = process.env.APP_URL || `http://localhost:${port}/`;
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "eur",
          product_data: {
            name: "HackYourFuture Curriculum",
            images: [
              "https://avatars.githubusercontent.com/u/20858568?s=200&v=4",
            ],
          },
          unit_amount: 2500,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${app_url}success`,
    cancel_url: `${app_url}`,
  });

  res.json({ id: session.id });
});

app.get("/success", (req, res) => {
  res.render("success");
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

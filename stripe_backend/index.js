const express = require("express");
const cors = require("cors");
// Todo stripe key
require('dotenv').config();
const stripe = require("stripe")(
  `${process.env.API_KEY}`
);
const { v4: uuidv4 } = require("uuid");

const app = express();
//middlewere

app.use(express.json());
app.use(cors());

//routes
app.get("/", (req, res) => {
  res.send("hello");
});
app.post("/payment", async (req, res) => {
  const { product, token } = req.body;
  const idempotencyKey = uuidv4();
  return await stripe.customers
    .create({
      email: token.email,
      source: token.id,
    })
    .then((customer) => {
      stripe.paymentIntents.create(
        {
          amount: product.price * 100,
          currency: "usd",
          customer: customer.id,
          receipt_email: token.email,
          description: product.name,
          shipping: {
            name: token.card.name,
            address: {
              country: "USA",
            },
          },
        },
        { idempotencyKey: idempotencyKey }
      );
    })
    .then((result) => {
      res.json({ msg: "success" });
    })
    .catch((error) => console.log("error", error));
});

//listen

app.listen(8282, () => {
  console.log(`app listening on port:8282`);
});

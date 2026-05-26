const express = require("express");
const router = express.Router();
const PLAN_PRICES = Object.freeze({
  "Standard Support Plan": 499,
  "Premium Excellence Plan": 999,
  "Annual Premium Plan": 9999,
});

// POST /api/payment/create-order
router.post("/create-order", async (req, res) => {
  try {
    const Razorpay = require("razorpay");
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET
    });
    const amount = PLAN_PRICES[req.body.plan];
    if (!amount || Number(req.body.amount) !== amount) {
      return res.status(400).json({ message: "Invalid payment plan or amount" });
    }
    const options = {
      amount: amount * 100, // paise
      currency: "INR",
      receipt: "receipt_" + Date.now()
    };
    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: "Payment order creation failed" });
  }
});

module.exports = router;

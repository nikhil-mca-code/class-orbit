const Payment = require("../models/payment");

exports.bookDemo = async (req, res) => {
  res.json({ message: "Demo booked successfully" });
};

exports.createOrder = async (req, res) => {
  const { studentName, email, phone, plan, amount } = req.body;
  const allowedPrices = {
    "Standard Support Plan": 499,
    "Premium Excellence Plan": 999,
    "Annual Premium Plan": 9999,
  };
  if (!studentName || !allowedPrices[plan] || Number(amount) !== allowedPrices[plan]) {
    return res.status(400).json({ message: "Invalid payment plan or amount" });
  }

  const payment = new Payment({
    studentName,
    email,
    phone,
    plan,
    amount: allowedPrices[plan],
    status: "pending"
  });

  await payment.save();

  res.json({ message: "Order created", payment });
};

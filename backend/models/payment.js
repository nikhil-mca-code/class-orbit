const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  studentName: { type: String, required: true },
  email:       { type: String },
  phone:       { type: String },
  plan:        { type: String, required: true },
  amount:      { type: Number, required: true },
  razorpayOrderId:   { type: String },
  razorpayPaymentId: { type: String },
  razorpaySignature: { type: String },
  status: { type: String, enum: ["pending","success","failed"], default: "pending" }
}, { timestamps: true });

module.exports = mongoose.model("Payment", paymentSchema);

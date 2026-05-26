const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
  name:    { type: String, required: true, trim: true },
  email:   { type: String, trim: true },
  mobile:  { type: String, required: true },
  subject: { type: String },
  message: { type: String },
  status:  { type: String, enum: ["new","read","replied"], default: "new" }
}, { timestamps: true });

module.exports = mongoose.model("Contact", contactSchema);

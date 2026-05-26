const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  name:    { type: String, required: true, trim: true },
  class:   { type: String, required: true },
  school:  { type: String, trim: true },
  mobile:  { type: String, required: true },
  subject: { type: String },
  area:    { type: String },
  email:   { type: String, lowercase: true, trim: true },
  status:  { type: String, enum: ["pending","active","inactive"], default: "pending" },
  plan:    { type: String, default: "Essential" },
  teacher: { type: String, default: "" },
  attendance: { present: { type: Number, default: 0 }, absent: { type: Number, default: 0 } },
  payment:    { paid: { type: Number, default: 0 }, pending: { type: Number, default: 0 } }
}, { timestamps: true });

module.exports = mongoose.model("Student", studentSchema);

const mongoose = require("mongoose");

const teacherSchema = new mongoose.Schema({
  name:          { type: String, required: true, trim: true },
  mobile:        { type: String, required: true },
  subject:       { type: String, required: true },
  experience:    { type: String },
  qualification: { type: String },
  area:          { type: String },
  email:         { type: String, lowercase: true, trim: true },
  status:        { type: String, enum: ["pending","active","inactive"], default: "pending" },
  students:      [String],
  salary:        { paid: { type: Number, default: 0 }, pending: { type: Number, default: 0 } },
  schedule:      { type: String, default: "" }
}, { timestamps: true });

module.exports = mongoose.model("Teacher", teacherSchema);

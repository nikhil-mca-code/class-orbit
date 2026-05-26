const mongoose = require("mongoose");

const demoSchema = new mongoose.Schema({
  studentName: { type: String, required: true, trim: true },
  class:       { type: String, required: true },
  mobile:      { type: String, required: true },
  subject:     { type: String, required: true },
  area:        { type: String, required: true },
  timing:      { type: String },
  status:      { type: String, enum: ["pending","scheduled","completed"], default: "pending" }
}, { timestamps: true });

module.exports = mongoose.model("Demo", demoSchema);

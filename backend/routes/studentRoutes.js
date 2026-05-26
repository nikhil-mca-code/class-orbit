 const express = require("express");
const Student = require("../models/student");
const router = express.Router();

router.post("/apply-student", async (req, res) => {
  try {
    const student = new Student(req.body);
    await student.save();
    res.status(201).json({ success: true, message: "Student Registered" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error saving data" });
  }
});

module.exports = router;
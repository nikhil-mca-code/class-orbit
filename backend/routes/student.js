const express = require("express");
const router = express.Router();
const Student = require("../models/student");

router.post("/add", async (req, res) => {
  try {
    const student = new Student(req.body);
    await student.save();
    res.status(201).json({ message: "Student registered successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/all", async (req, res) => {
  const students = await Student.find();
  res.json(students);
});

module.exports = router;
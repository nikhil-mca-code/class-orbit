const express = require("express");
const router = express.Router();
const Teacher = require("../models/teacher");

router.post("/add", async (req, res) => {
  try {
    const teacher = new Teacher(req.body);
    await teacher.save();
    res.status(201).json({ message: "Teacher registered successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/all", async (req, res) => {
  const teachers = await Teacher.find();
  res.json(teachers);
});

module.exports = router;
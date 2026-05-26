 const express = require("express");
const router = express.Router();
const Teacher = require("../models/teacher");

router.post("/join", async (req, res) => {
  try {
    const teacher = new Teacher(req.body);
    await teacher.save();
    res.json({ success: true, message: "Teacher Registered Successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

router.get("/all", async (req, res) => {
  const data = await Teacher.find().sort({ createdAt: -1 });
  res.json(data);
});

module.exports = router;

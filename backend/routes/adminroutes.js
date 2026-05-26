 const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Admin = require("../models/admin"); // path check: models/Admin.js
require("dotenv").config();
const { getAllUsers } = require("../controllers/authcontroller");
const { protect, isAdmin } = require("../middleware/authmiddleware");

router.get("/users", protect, isAdmin, getAllUsers);

// ================= ADMIN LOGIN =================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check admin exists
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ msg: "Admin not found" });
    }

    // Compare password
    const match = await bcrypt.compare(password, admin.password);
    if (!match) {
      return res.status(401).json({ msg: "Wrong password" });
    }

    // Generate token
    const token = jwt.sign(
      { id: admin._id, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      success: true,
      token,
      admin: {
        id: admin._id,
        email: admin.email
      }
    });

  } catch (error) {
    console.error("Admin login error:", error);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;

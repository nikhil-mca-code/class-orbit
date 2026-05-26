const express = require("express");
const router = express.Router();
const auth = require("../controllers/authcontroller");
const { protect } = require("../middleware/authmiddleware");

// Unified login (handles admin/student/teacher based on role field)
router.post("/login", auth.login);
router.post("/register", auth.register);

// Legacy individual routes
router.post("/admin/login", auth.adminLogin);
router.post("/student/login", auth.studentLogin);
router.post("/teacher/login", auth.teacherLogin);

// Password reset
router.post("/forgot-password", auth.forgotPassword);
router.post("/reset-password", auth.resetPassword);
router.post("/change-password", protect, auth.changePassword);
router.get("/session", protect, auth.session);

module.exports = router;

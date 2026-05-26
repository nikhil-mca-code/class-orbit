const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config();

const authRoutes = require("./routes/authroutes");
const adminRoutes = require("./routes/adminroutes");
const studentRoutes = require("./routes/studentRoutes");
const teacherRoutes = require("./routes/teacherRoutes");
const contactRoutes = require("./routes/contactRoutes");
const paymentRoutes = require("./routes/payment");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../frontend")));

// DATABASE
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch(err => console.log("❌ MongoDB Error:", err));

// ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/teachers", teacherRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/payment", paymentRoutes);

// TEST ROUTE
app.get("/", (req, res) => {
  res.send("🚀 Era Of Education Backend Running Successfully");
});

module.exports = app;

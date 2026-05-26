const express  = require("express");
const dotenv   = require("dotenv");
const cors     = require("cors");
const helmet   = require("helmet");
const rateLimit = require("express-rate-limit");
const path     = require("path");
const connectDB = require("./config/db");
const { protect, isAdmin } = require("./middleware/authmiddleware");

dotenv.config();

const app = express();
const isProduction = process.env.NODE_ENV === "production";
const allowedOrigins = (process.env.CORS_ORIGINS || "")
  .split(",")
  .map(origin => origin.trim())
  .filter(Boolean);

app.disable("x-powered-by");
app.set("trust proxy", isProduction ? 1 : false);
app.use(helmet({ contentSecurityPolicy: false }));
if (!isProduction) {
  app.use(cors({ origin: "*", methods: ["GET","POST","PUT","DELETE"] }));
} else if (allowedOrigins.length) {
  app.use(cors({ origin: allowedOrigins, methods: ["GET","POST","PUT","DELETE"] }));
}
app.use(express.json({ limit: "10kb" }));
app.use(express.static(path.join(__dirname, "../frontend"), {
  etag: true,
  maxAge: 0,
  setHeaders: (res, filePath) => {
    if (isProduction && /\.(?:css|js|png|jpe?g|svg|ico|woff2?)$/i.test(filePath)) {
      res.setHeader("Cache-Control", "public, max-age=604800");
    }
  },
}));
app.use("/api", rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 120,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many requests. Please try again later." },
}));

const Student = require("./models/student");
const Teacher = require("./models/teacher");
const Contact = require("./models/contact");
const Payment = require("./models/payment");
const Demo    = require("./models/demo");
const PLAN_PRICES = Object.freeze({
  "Standard Support Plan": 499,
  "Premium Excellence Plan": 999,
  "Annual Premium Plan": 9999,
});
const paymentConfigured = () => (
  process.env.RAZORPAY_KEY_ID &&
  process.env.RAZORPAY_KEY_SECRET &&
  !/YOUR_|replace_me/i.test(`${process.env.RAZORPAY_KEY_ID}${process.env.RAZORPAY_KEY_SECRET}`)
);
const escapeHtml = (value) => String(value == null ? "" : value).replace(/[&<>"']/g, c => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
}[c]));
const safeTemplateData = (data) => Object.fromEntries(
  Object.entries(data).map(([key, value]) => [key, escapeHtml(value)])
);

const {
  sendAdminNotification, sendUserConfirmation,
  studentRegisteredAdmin, studentRegisteredUser,
  teacherRegisteredAdmin, teacherRegisteredUser,
  demoBookedAdmin,        demoBookedUser,
  contactFormAdmin,       paymentSuccessAdmin,
  paymentSuccessUser,
} = require("./config/emailService");

app.use("/api/auth", require("./routes/authroutes"));

// STUDENT REGISTRATION
app.post("/api/student/register", async (req, res) => {
  try {
    const { name, class: cls, school, mobile, subject, area, email } = req.body;
    if (!name || !cls || !mobile) return res.status(400).json({ success:false, message:"Name, class aur mobile zaroori hain!" });
    const student = new Student({ name, class:cls, school, mobile, subject, area, email });
    await student.save();
    sendAdminNotification(`New Student: ${name}`, studentRegisteredAdmin(safeTemplateData({name,class:cls,school,mobile,subject,area})));
    if(email) sendUserConfirmation(email, name, "Registration Successful - Era of Education", studentRegisteredUser(safeTemplateData({name,class:cls,subject,area})));
    res.json({ success:true, message:"Registration successful! Team jald contact karegi.", id:student._id });
  } catch(err) { console.error(err); res.status(500).json({ success:false, message:"Server error." }); }
});

// TEACHER REGISTRATION
app.post("/api/teacher/register", async (req, res) => {
  try {
    const { name, mobile, subject, experience, qualification, area, email } = req.body;
    if (!name || !mobile || !subject) return res.status(400).json({ success:false, message:"Name, mobile aur subject zaroori hain!" });
    const teacher = new Teacher({ name, mobile, subject, experience, qualification, area, email });
    await teacher.save();
    sendAdminNotification(`New Teacher: ${name}`, teacherRegisteredAdmin(safeTemplateData({name,mobile,subject,experience,qualification,area})));
    if(email) sendUserConfirmation(email, name, "Teacher Registration - Era of Education", teacherRegisteredUser(safeTemplateData({name,subject,experience,area})));
    res.json({ success:true, message:"Registration successful! Team 24 ghante mein contact karegi.", id:teacher._id });
  } catch(err) { console.error(err); res.status(500).json({ success:false, message:"Server error." }); }
});

// DEMO BOOKING
app.post("/api/demo/book", async (req, res) => {
  try {
    const { studentName, class:cls, mobile, subject, area, timing } = req.body;
    if (!studentName||!cls||!mobile||!subject||!area) return res.status(400).json({ success:false, message:"Sabhi fields zaroori hain!" });
    const demo = new Demo({ studentName, class:cls, mobile, subject, area, timing });
    await demo.save();
    sendAdminNotification(`New Demo Request: ${studentName}`, demoBookedAdmin(safeTemplateData({studentName,class:cls,mobile,subject,area,timing})));
    res.json({ success:true, message:"Demo book ho gayi! 2 ghante mein call aayegi.", id:demo._id });
  } catch(err) { console.error(err); res.status(500).json({ success:false, message:"Server error." }); }
});

// CONTACT FORM
app.post("/api/contact/send", async (req, res) => {
  try {
    const { name, mobile, email, subject, message } = req.body;
    if (!name||!mobile) return res.status(400).json({ success:false, message:"Name aur mobile zaroori hain!" });
    const contact = new Contact({ name, mobile, email, subject, message });
    await contact.save();
    sendAdminNotification(`New Contact: ${name}`, contactFormAdmin(safeTemplateData({name,mobile,email,subject,message})));
    res.json({ success:true, message:"Message bhej diya! Hum jald reply karenge." });
  } catch(err) { console.error(err); res.status(500).json({ success:false, message:"Server error." }); }
});

// PAYMENT CREATE ORDER
app.post("/api/payment/create-order", async (req, res) => {
  try {
    const Razorpay = require("razorpay");
    if (!paymentConfigured()) {
      return res.status(503).json({ success:false, message:"Payment service is not configured." });
    }
    const rzp = new Razorpay({ key_id:process.env.RAZORPAY_KEY_ID, key_secret:process.env.RAZORPAY_KEY_SECRET });
    const { amount, studentName, email, phone, plan } = req.body;
    const expectedAmount = PLAN_PRICES[plan];
    if (!studentName || !expectedAmount || Number(amount) !== expectedAmount) {
      return res.status(400).json({ success:false, message:"Invalid payment plan or amount." });
    }
    const order = await rzp.orders.create({ amount:expectedAmount*100, currency:"INR", receipt:`rcpt_${Date.now()}`, notes:{studentName,plan} });
    const payment = new Payment({ studentName, email, phone, plan, amount:expectedAmount, razorpayOrderId:order.id, status:"pending" });
    await payment.save();
    res.json({ ...order, dbId:payment._id, keyId:process.env.RAZORPAY_KEY_ID });
  } catch(err) { console.error(err); res.status(500).json({ success:false, message:"Payment order failed." }); }
});

// PAYMENT VERIFY
app.post("/api/payment/verify", async (req, res) => {
  try {
    const crypto = require("crypto");
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, dbId } = req.body;
    if (!process.env.RAZORPAY_KEY_SECRET || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !dbId) {
      return res.status(400).json({ success:false, message:"Payment verification data is incomplete." });
    }
    const expectedSig = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET).update(`${razorpay_order_id}|${razorpay_payment_id}`).digest("hex");
    if(expectedSig !== razorpay_signature) return res.status(400).json({ success:false, message:"Payment verification failed!" });
    const payment = await Payment.findOneAndUpdate(
      { _id: dbId, razorpayOrderId: razorpay_order_id, status: "pending" },
      { razorpayPaymentId:razorpay_payment_id, razorpaySignature:razorpay_signature, status:"success" },
      { new:true }
    );
    if (!payment) return res.status(400).json({ success:false, message:"Payment order not found or already processed." });
    if(payment) {
      const safePayment = safeTemplateData(payment.toObject());
      sendAdminNotification(`Payment Received: Rs.${payment.amount}`, paymentSuccessAdmin(safePayment));
      if(payment.email) sendUserConfirmation(payment.email, payment.studentName, "Payment Successful - Era of Education", paymentSuccessUser(safePayment));
    }
    res.json({ success:true, message:"Payment verified!" });
  } catch(err) { console.error(err); res.status(500).json({ success:false, message:"Verification error." }); }
});

// NEWSLETTER
app.post("/api/newsletter/subscribe", async (req, res) => {
  try {
    const { email } = req.body;
    if(!email||!email.includes("@")) return res.status(400).json({ success:false, message:"Valid email daalen!" });
    const safeEmail = escapeHtml(email);
    sendAdminNotification(`New Subscriber: ${email}`, `<p>New subscriber: <b>${safeEmail}</b> at ${new Date().toLocaleString("en-IN")}</p>`);
    res.json({ success:true, message:"Successfully subscribed!" });
  } catch(err) { res.status(500).json({ success:false }); }
});

// ADMIN STATS
app.use("/api/admin", protect, isAdmin);
app.get("/api/admin/stats", async (req, res) => {
  try {
    const [students, teachers, demos, payments] = await Promise.all([Student.countDocuments(), Teacher.countDocuments(), Demo.countDocuments({status:"pending"}), Payment.find({status:"success"})]);
    res.json({ success:true, students, teachers, pendingDemos:demos, revenue:payments.reduce((s,p)=>s+p.amount,0) });
  } catch(err) { res.status(500).json({ success:false }); }
});
app.get("/api/admin/students", async (req,res) => { try { res.json(await Student.find().sort({createdAt:-1})); } catch(e){ res.status(500).json([]); }});
app.get("/api/admin/teachers", async (req,res) => { try { res.json(await Teacher.find().sort({createdAt:-1})); } catch(e){ res.status(500).json([]); }});
app.get("/api/admin/demos",    async (req,res) => { try { res.json(await Demo.find().sort({createdAt:-1}));    } catch(e){ res.status(500).json([]); }});
app.get("/api/admin/contacts", async (req,res) => { try { res.json(await Contact.find().sort({createdAt:-1}));} catch(e){ res.status(500).json([]); }});
app.get("/api/admin/payments", async (req,res) => { try { res.json(await Payment.find({status:"success"}).sort({createdAt:-1})); } catch(e){ res.status(500).json([]); }});
app.put("/api/admin/student/:id", async (req,res) => { try { res.json(await Student.findByIdAndUpdate(req.params.id,req.body,{new:true})); } catch(e){ res.status(500).json({}); }});
app.delete("/api/admin/student/:id", async (req,res) => { try { await Student.findByIdAndDelete(req.params.id); res.json({ success:true }); } catch(e){ res.status(500).json({ success:false }); }});
app.put("/api/admin/teacher/:id", async (req,res) => { try { res.json(await Teacher.findByIdAndUpdate(req.params.id,req.body,{new:true})); } catch(e){ res.status(500).json({}); }});
app.put("/api/admin/demo/:id",    async (req,res) => { try { res.json(await Demo.findByIdAndUpdate(req.params.id,req.body,{new:true}));    } catch(e){ res.status(500).json({}); }});

app.get("/api/health", (req,res) => res.json({ status:"OK", message:"Era of Education Backend Running!" }));
app.get("*", (req,res) => res.sendFile(path.join(__dirname,"../frontend/index.html")));
app.use((err, req, res, next) => {
  if (err.type === "entity.too.large") {
    return res.status(413).json({ message: "Request body is too large." });
  }
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({ message: "Invalid JSON body." });
  }
  if (err.message === "Not allowed by CORS") {
    return res.status(403).json({ message: "Origin not allowed" });
  }
  console.error("Unhandled request error:", isProduction ? err.message : err);
  res.status(500).json({ message: "Server error." });
});

const PORT = process.env.PORT || 5000;
async function startServer() {
  const databaseConnected = await connectDB();
  if (!databaseConnected && isProduction) {
    console.error("Server startup aborted: database connection is required in production.");
    process.exitCode = 1;
    return;
  }
  app.listen(PORT, () => {
    console.log(`\nServer Running on http://localhost:${PORT}`);
    console.log(`Admin Panel: http://localhost:${PORT}/admin.html\n`);
  });
}
startServer();

// emailService.js — Sends email notifications for all form submissions
const nodemailer = require("nodemailer");
const isEmailConfigured = () => (
  process.env.EMAIL_USER &&
  process.env.EMAIL_APP_PASS &&
  !/xxxx|replace_with/i.test(process.env.EMAIL_APP_PASS)
);

// Create reusable transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,       // your Gmail:hello@classorbit.in
      pass: process.env.EMAIL_APP_PASS,   // Gmail App Password (16 chars)
    },
  });
};

// ── ADMIN NOTIFICATION EMAIL ──
const sendAdminNotification = async (subject, htmlContent) => {
  if (!isEmailConfigured()) return;
  try {
    const transporter = createTransporter();
    await transporter.sendMail({
      from: `"Class Orbit Website" <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
      subject: `[Class Orbit] ${subject}`,
      html: htmlContent,
    });
    console.log(`✅ Admin email sent: ${subject}`);
  } catch (err) {
    console.error(`❌ Email error: ${err.message}`);
    // Don't throw — email failure should not block form submission
  }
};

// ── USER CONFIRMATION EMAIL ──
const sendUserConfirmation = async (toEmail, toName, subject, htmlContent) => {
  if (!toEmail) return; // skip if no email
  if (!isEmailConfigured()) return;
  try {
    const transporter = createTransporter();
    await transporter.sendMail({
      from: `"Class Orbit" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject: subject,
      html: htmlContent,
    });
    console.log(`✅ User email sent to: ${toEmail}`);
  } catch (err) {
    console.error(`❌ User email error: ${err.message}`);
  }
};

// ════════════════════════════════
// EMAIL TEMPLATES
// ════════════════════════════════

// 1. STUDENT REGISTRATION
const studentRegisteredAdmin = (data) => `
<div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;border:1px solid #ddd;border-radius:10px;overflow:hidden;">
  <div style="background:#003366;padding:20px;text-align:center;">
    <h2 style="color:#fff;margin:0;">📚 New Student Registration</h2>
    <p style="color:#f4c430;margin:5px 0;">Class Orbit</p>
  </div>
  <div style="padding:24px;">
    <table style="width:100%;border-collapse:collapse;">
      <tr><td style="padding:8px;background:#f0f4ff;font-weight:bold;width:35%;">Student Name</td><td style="padding:8px;">${data.name}</td></tr>
      <tr><td style="padding:8px;font-weight:bold;">Class</td><td style="padding:8px;">${data.class}</td></tr>
      <tr><td style="padding:8px;background:#f0f4ff;font-weight:bold;">School</td><td style="padding:8px;">${data.school || "N/A"}</td></tr>
      <tr><td style="padding:8px;font-weight:bold;">Mobile</td><td style="padding:8px;">${data.mobile}</td></tr>
      <tr><td style="padding:8px;background:#f0f4ff;font-weight:bold;">Subject</td><td style="padding:8px;">${data.subject || "N/A"}</td></tr>
      <tr><td style="padding:8px;font-weight:bold;">Area</td><td style="padding:8px;">${data.area || "N/A"}</td></tr>
      <tr><td style="padding:8px;background:#f0f4ff;font-weight:bold;">Date & Time</td><td style="padding:8px;">${new Date().toLocaleString("en-IN")}</td></tr>
    </table>
    <div style="margin-top:16px;padding:12px;background:#e8f5e9;border-radius:6px;">
      <strong>Action Required:</strong> Please call the student within 2 hours to assign a teacher.
    </div>
  </div>
  <div style="background:#003366;padding:12px;text-align:center;color:#aaa;font-size:12px;">
    Class Orbit | +91 75180 07867 |hello@classorbit.in
  </div>
</div>`;

const studentRegisteredUser = (data) => `
<div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;border:1px solid #ddd;border-radius:10px;overflow:hidden;">
  <div style="background:#003366;padding:20px;text-align:center;">
    <h2 style="color:#fff;margin:0;">Registration Successful! 🎉</h2>
    <p style="color:#f4c430;">Class Orbit</p>
  </div>
  <div style="padding:24px;">
    <p>Dear <strong>${data.name}</strong>,</p>
    <p>Aapki registration Class Orbit mein successfully ho gayi hai! 🎓</p>
    <p>Hamari team aapko <strong>2 ghante mein call karegi</strong> ek verified teacher assign karne ke liye.</p>
    <div style="background:#f0f4ff;padding:16px;border-radius:8px;margin:16px 0;">
      <strong>Aapki Registration Details:</strong><br>
      Class: ${data.class} | Subject: ${data.subject || "N/A"} | Area: ${data.area || "N/A"}
    </div>
    <p>Koi bhi sawaal ho toh contact karo:</p>
    <p>📞 <a href="tel:+917518007867">+91 75180 07867</a> &nbsp;|&nbsp; 
       💬 <a href="https://wa.me/917518007867">WhatsApp</a></p>
  </div>
  <div style="background:#003366;padding:12px;text-align:center;color:#aaa;font-size:12px;">
    Class Orbit | Taramandal Road, Gorakhpur
  </div>
</div>`;

// 2. TEACHER REGISTRATION
const teacherRegisteredAdmin = (data) => `
<div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;border:1px solid #ddd;border-radius:10px;overflow:hidden;">
  <div style="background:#1a6b3c;padding:20px;text-align:center;">
    <h2 style="color:#fff;margin:0;">👨‍🏫 New Teacher Registration</h2>
    <p style="color:#f4c430;margin:5px 0;">Class Orbit</p>
  </div>
  <div style="padding:24px;">
    <table style="width:100%;border-collapse:collapse;">
      <tr><td style="padding:8px;background:#f0fff4;font-weight:bold;width:35%;">Teacher Name</td><td style="padding:8px;">${data.name}</td></tr>
      <tr><td style="padding:8px;font-weight:bold;">Mobile</td><td style="padding:8px;">${data.mobile}</td></tr>
      <tr><td style="padding:8px;background:#f0fff4;font-weight:bold;">Subject</td><td style="padding:8px;">${data.subject}</td></tr>
      <tr><td style="padding:8px;font-weight:bold;">Experience</td><td style="padding:8px;">${data.experience || "N/A"}</td></tr>
      <tr><td style="padding:8px;background:#f0fff4;font-weight:bold;">Qualification</td><td style="padding:8px;">${data.qualification || "N/A"}</td></tr>
      <tr><td style="padding:8px;font-weight:bold;">Area</td><td style="padding:8px;">${data.area || "N/A"}</td></tr>
      <tr><td style="padding:8px;background:#f0fff4;font-weight:bold;">Date & Time</td><td style="padding:8px;">${new Date().toLocaleString("en-IN")}</td></tr>
    </table>
    <div style="margin-top:16px;padding:12px;background:#e8f5e9;border-radius:6px;">
      <strong>Action Required:</strong> Verify teacher credentials and assign students.
    </div>
  </div>
  <div style="background:#1a6b3c;padding:12px;text-align:center;color:#aaa;font-size:12px;">
    Class Orbit | +91 75180 07867 |hello@classorbit.in
  </div>
</div>`;

const teacherRegisteredUser = (data) => `
<div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;border:1px solid #ddd;border-radius:10px;overflow:hidden;">
  <div style="background:#1a6b3c;padding:20px;text-align:center;">
    <h2 style="color:#fff;margin:0;">Welcome to Class Orbit! 🎉</h2>
  </div>
  <div style="padding:24px;">
    <p>Dear <strong>${data.name}</strong>,</p>
    <p>Aapki teacher registration successfully complete ho gayi hai!</p>
    <p>Hamari team aapko <strong>24 ghante mein call karegi</strong> verification aur student assignment ke liye.</p>
    <div style="background:#f0fff4;padding:16px;border-radius:8px;margin:16px 0;">
      Subject: ${data.subject} | Experience: ${data.experience || "N/A"} | Area: ${data.area || "N/A"}
    </div>
    <p>📞 <a href="tel:+917518007867">+91 75180 07867</a> &nbsp;|&nbsp; 
       💬 <a href="https://wa.me/917518007867">WhatsApp</a></p>
  </div>
  <div style="background:#1a6b3c;padding:12px;text-align:center;color:#aaa;font-size:12px;">
    Class Orbit | Taramandal Road, Gorakhpur
  </div>
</div>`;

// 3. DEMO BOOKING
const demoBookedAdmin = (data) => `
<div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;border:1px solid #ddd;border-radius:10px;overflow:hidden;">
  <div style="background:#dd2476;padding:20px;text-align:center;">
    <h2 style="color:#fff;margin:0;">🎯 New Demo Class Request</h2>
    <p style="color:#ffe;margin:5px 0;">Class Orbit</p>
  </div>
  <div style="padding:24px;">
    <table style="width:100%;border-collapse:collapse;">
      <tr><td style="padding:8px;background:#fff0f6;font-weight:bold;width:35%;">Student Name</td><td style="padding:8px;">${data.studentName}</td></tr>
      <tr><td style="padding:8px;font-weight:bold;">Class</td><td style="padding:8px;">${data.class}</td></tr>
      <tr><td style="padding:8px;background:#fff0f6;font-weight:bold;">Mobile</td><td style="padding:8px;">${data.mobile}</td></tr>
      <tr><td style="padding:8px;font-weight:bold;">Subject</td><td style="padding:8px;">${data.subject}</td></tr>
      <tr><td style="padding:8px;background:#fff0f6;font-weight:bold;">Area</td><td style="padding:8px;">${data.area}</td></tr>
      <tr><td style="padding:8px;font-weight:bold;">Preferred Timing</td><td style="padding:8px;">${data.timing || "Any"}</td></tr>
      <tr><td style="padding:8px;background:#fff0f6;font-weight:bold;">Date & Time</td><td style="padding:8px;">${new Date().toLocaleString("en-IN")}</td></tr>
    </table>
    <div style="margin-top:16px;padding:12px;background:#fce4ec;border-radius:6px;border-left:4px solid #dd2476;">
      <strong>⚡ Action Required:</strong> Call within 2 hours to schedule free demo class!
    </div>
  </div>
</div>`;

const demoBookedUser = (data) => `
<div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;border:1px solid #ddd;border-radius:10px;overflow:hidden;">
  <div style="background:linear-gradient(135deg,#ff512f,#dd2476);padding:20px;text-align:center;">
    <h2 style="color:#fff;margin:0;">Demo Class Booked! 🎉</h2>
  </div>
  <div style="padding:24px;">
    <p>Namaste <strong>${data.studentName}</strong>!</p>
    <p>Aapki <strong>FREE Demo Class</strong> successfully book ho gayi hai!</p>
    <p>Hamari team aapko <strong>2 ghante mein call karegi</strong> demo schedule karne ke liye.</p>
    <div style="background:#fff0f6;padding:16px;border-radius:8px;margin:16px 0;">
      Class: ${data.class} | Subject: ${data.subject} | Area: ${data.area}
    </div>
    <p>📞 <a href="tel:+917518007867">+91 75180 07867</a></p>
  </div>
</div>`;

// 4. CONTACT FORM
const contactFormAdmin = (data) => `
<div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;border:1px solid #ddd;border-radius:10px;overflow:hidden;">
  <div style="background:#003366;padding:20px;text-align:center;">
    <h2 style="color:#fff;margin:0;">📬 New Contact Form Message</h2>
  </div>
  <div style="padding:24px;">
    <table style="width:100%;border-collapse:collapse;">
      <tr><td style="padding:8px;background:#f0f4ff;font-weight:bold;width:30%;">Name</td><td style="padding:8px;">${data.name}</td></tr>
      <tr><td style="padding:8px;font-weight:bold;">Mobile</td><td style="padding:8px;">${data.mobile}</td></tr>
      <tr><td style="padding:8px;background:#f0f4ff;font-weight:bold;">Email</td><td style="padding:8px;">${data.email || "N/A"}</td></tr>
      <tr><td style="padding:8px;font-weight:bold;">Subject</td><td style="padding:8px;">${data.subject || "N/A"}</td></tr>
      <tr><td style="padding:8px;background:#f0f4ff;font-weight:bold;">Message</td><td style="padding:8px;">${data.message || "N/A"}</td></tr>
      <tr><td style="padding:8px;font-weight:bold;">Time</td><td style="padding:8px;">${new Date().toLocaleString("en-IN")}</td></tr>
    </table>
  </div>
</div>`;

// 5. PAYMENT SUCCESS
const paymentSuccessAdmin = (data) => `
<div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;border:1px solid #ddd;border-radius:10px;overflow:hidden;">
  <div style="background:#1a6b3c;padding:20px;text-align:center;">
    <h2 style="color:#fff;margin:0;">💰 Payment Received!</h2>
  </div>
  <div style="padding:24px;">
    <table style="width:100%;border-collapse:collapse;">
      <tr><td style="padding:8px;background:#f0fff4;font-weight:bold;width:35%;">Student Name</td><td style="padding:8px;">${data.studentName}</td></tr>
      <tr><td style="padding:8px;font-weight:bold;">Amount</td><td style="padding:8px;color:#1a6b3c;font-weight:bold;">₹${data.amount}</td></tr>
      <tr><td style="padding:8px;background:#f0fff4;font-weight:bold;">Plan</td><td style="padding:8px;">${data.plan}</td></tr>
      <tr><td style="padding:8px;font-weight:bold;">Payment ID</td><td style="padding:8px;">${data.razorpayPaymentId || "N/A"}</td></tr>
      <tr><td style="padding:8px;background:#f0fff4;font-weight:bold;">Mobile</td><td style="padding:8px;">${data.phone || "N/A"}</td></tr>
      <tr><td style="padding:8px;font-weight:bold;">Time</td><td style="padding:8px;">${new Date().toLocaleString("en-IN")}</td></tr>
    </table>
  </div>
</div>`;

const paymentSuccessUser = (data) => `
<div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;border:1px solid #ddd;border-radius:10px;overflow:hidden;">
  <div style="background:#1a6b3c;padding:20px;text-align:center;">
    <h2 style="color:#fff;margin:0;">Payment Successful! ✅</h2>
  </div>
  <div style="padding:24px;">
    <p>Dear <strong>${data.studentName}</strong>,</p>
    <p>Aapka payment successfully receive ho gaya hai!</p>
    <div style="background:#f0fff4;padding:16px;border-radius:8px;margin:16px 0;">
      <strong>Amount:</strong> ₹${data.amount}<br>
      <strong>Plan:</strong> ${data.plan}<br>
      <strong>Payment ID:</strong> ${data.razorpayPaymentId || "N/A"}
    </div>
    <p>Shukriya Class Orbit choose karne ke liye! 🎓</p>
    <p>📞 <a href="tel:+917518007867">+91 75180 07867</a></p>
  </div>
</div>`;

// 6. PASSWORD RESET
const passwordResetEmail = (name, resetLink) => `
<div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;border:1px solid #ddd;border-radius:10px;overflow:hidden;">
  <div style="background:#003366;padding:20px;text-align:center;">
    <h2 style="color:#fff;margin:0;">🔐 Password Reset Request</h2>
  </div>
  <div style="padding:24px;">
    <p>Dear <strong>${name}</strong>,</p>
    <p>Aapne password reset request ki hai. Neeche diye link pe click karo:</p>
    <div style="text-align:center;margin:24px 0;">
      <a href="${resetLink}" style="background:#003366;color:#fff;padding:14px 30px;border-radius:25px;text-decoration:none;font-weight:bold;">Reset Password</a>
    </div>
    <p style="color:#888;font-size:13px;">Yeh link 15 minutes mein expire ho jayega.</p>
    <p style="color:#888;font-size:13px;">Agar aapne yeh request nahi ki toh is email ko ignore karo.</p>
  </div>
</div>`;

module.exports = {
  sendAdminNotification,
  sendUserConfirmation,
  studentRegisteredAdmin,
  studentRegisteredUser,
  teacherRegisteredAdmin,
  teacherRegisteredUser,
  demoBookedAdmin,
  demoBookedUser,
  contactFormAdmin,
  paymentSuccessAdmin,
  paymentSuccessUser,
  passwordResetEmail,
};

const DEFAULT_ADMIN_EMAIL = "classorbit.nikhil@gmail.com";
const DEFAULT_FRONTEND_URL = "https://class-orbit.netlify.app";
const BREVO_API_BASE_URL = "https://api.brevo.com/v3";
const BREVO_REQUEST_TIMEOUT_MS = 30000;

const BRAND = {
  name: "Class Orbit",
  color: "#4F46E5",
  supportEmail: process.env.SUPPORT_EMAIL || process.env.ADMIN_EMAIL || DEFAULT_ADMIN_EMAIL,
  supportPhone: process.env.SUPPORT_PHONE || "+91 75180 07867",
};

const adminEmail = () => process.env.ADMIN_EMAIL || DEFAULT_ADMIN_EMAIL;
const frontendUrl = () => process.env.FRONTEND_URL || DEFAULT_FRONTEND_URL;
const brevoSenderEmail = () => process.env.BREVO_SENDER_EMAIL || process.env.ADMIN_EMAIL || DEFAULT_ADMIN_EMAIL;
const brevoConfigured = () => Boolean(process.env.BREVO_API_KEY);

console.log("[Email] Brevo API client initialized", {
  apiBaseUrl: BREVO_API_BASE_URL,
  senderEmail: brevoSenderEmail(),
});

const escapeHtml = (value) => String(value == null ? "" : value).replace(/[&<>"']/g, (char) => ({
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
}[char]));

const formatDate = (date = new Date()) => new Date(date).toLocaleString("en-IN", {
  dateStyle: "medium",
  timeStyle: "short",
});

const parseBrevoResponse = async (response) => {
  const text = await response.text();
  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch (err) {
    return text;
  }
};

const brevoFetch = async (path, options = {}) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), BREVO_REQUEST_TIMEOUT_MS);

  try {
    return await fetch(`${BREVO_API_BASE_URL}${path}`, {
      ...options,
      signal: controller.signal,
      headers: {
        accept: "application/json",
        "api-key": process.env.BREVO_API_KEY,
        ...(options.headers || {}),
      },
    });
  } finally {
    clearTimeout(timeout);
  }
};

const logBrevoError = (context, err) => {
  console.error(`[Email] ${context}`, {
    message: err.message,
    name: err.name,
    code: err.code,
    stack: err.stack,
  });
};

const validateBrevoApi = async () => {
  if (!brevoConfigured()) {
    console.warn("[Email] Brevo API is not configured. Email sending is disabled.", {
      status: "missing_api_key",
    });
    return false;
  }

  try {
    const response = await brevoFetch("/account", { method: "GET" });
    const responseBody = await parseBrevoResponse(response);

    console.log("[Email] Brevo API validation result", {
      status: response.status,
      ok: response.ok,
      responseBody,
    });

    return response.ok;
  } catch (err) {
    logBrevoError("Brevo API validation failed", err);
    return false;
  }
};

validateBrevoApi();

const button = (href, label) => `
  <table role="presentation" cellpadding="0" cellspacing="0" style="margin:24px 0;">
    <tr>
      <td style="border-radius:6px;background:${BRAND.color};">
        <a href="${escapeHtml(href)}" style="display:inline-block;padding:12px 22px;color:#ffffff;text-decoration:none;font-weight:700;border-radius:6px;">${escapeHtml(label)}</a>
      </td>
    </tr>
  </table>`;

const row = (label, value) => `
  <tr>
    <td style="padding:10px 12px;background:#F8FAFC;border-bottom:1px solid #E5E7EB;font-weight:700;color:#374151;width:38%;">${escapeHtml(label)}</td>
    <td style="padding:10px 12px;border-bottom:1px solid #E5E7EB;color:#111827;">${escapeHtml(value || "N/A")}</td>
  </tr>`;

const detailsTable = (items) => `
  <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border:1px solid #E5E7EB;border-radius:8px;border-collapse:separate;border-spacing:0;overflow:hidden;margin:18px 0;">
    ${items.map(([label, value]) => row(label, value)).join("")}
  </table>`;

const layout = ({ title, intro, body, cta }) => `
<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#F3F4F6;font-family:Arial,Helvetica,sans-serif;color:#111827;">
    <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;background:#F3F4F6;padding:24px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;max-width:640px;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #E5E7EB;">
            <tr>
              <td style="background:${BRAND.color};padding:24px;text-align:center;">
                <div style="font-size:24px;line-height:1.2;font-weight:800;color:#ffffff;">${BRAND.name}</div>
                <div style="font-size:13px;line-height:1.5;color:#EDE9FE;margin-top:6px;">Personalized learning support</div>
              </td>
            </tr>
            <tr>
              <td style="padding:28px 24px;">
                <h1 style="margin:0 0 14px;font-size:24px;line-height:1.3;color:#111827;">${escapeHtml(title)}</h1>
                ${intro ? `<p style="margin:0 0 18px;font-size:16px;line-height:1.6;color:#374151;">${escapeHtml(intro)}</p>` : ""}
                ${body}
                ${cta || ""}
              </td>
            </tr>
            <tr>
              <td style="background:#F8FAFC;padding:18px 24px;border-top:1px solid #E5E7EB;font-size:13px;line-height:1.6;color:#6B7280;">
                Need help? Contact ${escapeHtml(BRAND.supportEmail || "support")} or ${escapeHtml(BRAND.supportPhone)}.<br>
                This email was sent by ${BRAND.name}.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

const sendEmail = async ({ to, subject, html, text }) => {
  if (!to) {
    console.warn("[Email] Skipped send: missing recipient", { subject, success: false });
    return null;
  }
  if (!brevoConfigured()) {
    console.warn("[Email] Skipped send: Brevo API is not configured", { to, subject, success: false });
    return null;
  }

  const payload = {
    sender: {
      name: BRAND.name,
      email: brevoSenderEmail(),
    },
    to: Array.isArray(to)
      ? to.map((email) => ({ email }))
      : [{ email: to }],
    subject,
    htmlContent: html,
    textContent: text || subject,
  };

  try {
    const response = await brevoFetch("/smtp/email", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    const responseBody = await parseBrevoResponse(response);

    if (!response.ok) {
      console.error("[Email] Failed", {
        to,
        subject,
        status: response.status,
        responseBody,
        success: false,
      });
      return null;
    }

    console.log("[Email] Sent", {
      to,
      subject,
      status: response.status,
      responseBody,
      success: true,
    });
    return responseBody;
  } catch (err) {
    console.error("[Email] Failed", {
      to,
      subject,
      status: err.name === "AbortError" ? "timeout" : "network_error",
      errorBody: {
        name: err.name,
        message: err.message,
        code: err.code,
      },
      success: false,
      stack: err.stack,
    });
    logBrevoError("Failed to send email via Brevo API", err);
    return null;
  }
};

const sendAdminNotification = async ({ subject, title, intro, details = [], body }) => {
  const html = layout({
    title: title || subject,
    intro,
    body: body || detailsTable(details),
  });

  return sendEmail({
    to: adminEmail(),
    subject,
    html,
  });
};

const sendWelcomeEmail = async ({ to, name, role = "student", loginUrl }) => {
  const isTeacher = role === "teacher";
  const subject = isTeacher ? "Teacher Registration Received" : "Welcome to Class Orbit";
  const title = isTeacher ? "Teacher Registration Received" : "Welcome to Class Orbit";
  const body = isTeacher
    ? `
      <p style="font-size:15px;line-height:1.7;color:#374151;">Hi ${escapeHtml(name || "Teacher")},</p>
      <p style="font-size:15px;line-height:1.7;color:#374151;">Your teacher application has been received and is now under admin review.</p>
      <p style="font-size:15px;line-height:1.7;color:#374151;">Our team usually reviews applications within 24 to 48 hours. We will contact you after verification.</p>`
    : `
      <p style="font-size:15px;line-height:1.7;color:#374151;">Hi ${escapeHtml(name || "Student")},</p>
      <p style="font-size:15px;line-height:1.7;color:#374151;">Your account has been created successfully. You can now log in and continue with Class Orbit.</p>`;

  return sendEmail({
    to,
    subject,
    html: layout({
      title,
      intro: isTeacher ? "Thanks for applying to teach with Class Orbit." : "Your learning account is ready.",
      body,
      cta: button(loginUrl || `${frontendUrl()}/login.html`, "Login to Class Orbit"),
    }),
  });
};

const sendPasswordResetEmail = async ({ to, name, resetLink, expiresIn = "15 minutes" }) => sendEmail({
  to,
  subject: "Reset Your Class Orbit Password",
  html: layout({
    title: "Reset Your Class Orbit Password",
    intro: `Hi ${name || "there"}, we received a request to reset your password.`,
    body: `
      <p style="font-size:15px;line-height:1.7;color:#374151;">Use the button below to choose a new password.</p>
      ${button(resetLink, "Reset Password")}
      <p style="font-size:14px;line-height:1.7;color:#4B5563;">Reset link: <a href="${escapeHtml(resetLink)}" style="color:${BRAND.color};word-break:break-all;">${escapeHtml(resetLink)}</a></p>
      <p style="font-size:14px;line-height:1.7;color:#6B7280;">This link expires in ${escapeHtml(expiresIn)}. If you did not request this, you can safely ignore this email.</p>
      <p style="font-size:14px;line-height:1.7;color:#6B7280;">For your security, Class Orbit will never ask for your password by email or phone.</p>`,
  }),
});

const sendContactNotification = async ({ name, email, mobile, phone, message, subject }) => {
  const details = [
    ["Name", name],
    ["Email", email],
    ["Phone", phone || mobile],
    ["Subject", subject],
    ["Message", message],
  ];

  await sendAdminNotification({
    subject: "New Contact Form Submission",
    title: "New Contact Form Submission",
    intro: "A visitor submitted the contact form.",
    details,
  });

  if (email) {
    await sendEmail({
      to: email,
      subject: "We Received Your Message",
      html: layout({
        title: "We Received Your Message",
        intro: `Hi ${name || "there"}, thanks for contacting Class Orbit.`,
        body: `<p style="font-size:15px;line-height:1.7;color:#374151;">Our team has received your message and will respond as soon as possible, usually within one business day.</p>`,
      }),
    });
  }
};

const sendBookDemoNotification = async ({ studentName, name, class: cls, mobile, phone, email, subject, area, timing }) => {
  const displayName = studentName || name;
  await sendAdminNotification({
    subject: "New Demo Booking",
    title: "New Demo Booking",
    intro: "A new demo class request has been submitted.",
    details: [
      ["Student", displayName],
      ["Class", cls],
      ["Phone", phone || mobile],
      ["Email", email],
      ["Subject", subject],
      ["Area", area],
      ["Preferred Timing", timing],
    ],
  });

  if (email) {
    await sendEmail({
      to: email,
      subject: "Demo Request Received",
      html: layout({
        title: "Demo Request Received",
        intro: `Hi ${displayName || "there"}, your demo request has been received.`,
        body: `<p style="font-size:15px;line-height:1.7;color:#374151;">Our team will contact you shortly to confirm the schedule and explain the next steps.</p>`,
      }),
    });
  }
};

const sendStudentRegistrationEmail = async (student) => {
  await sendAdminNotification({
    subject: "New Student Registration",
    title: "New Student Registration",
    intro: "A new student registration has been submitted.",
    details: [
      ["Student", student.name],
      ["Class", student.class],
      ["School", student.school],
      ["Phone", student.mobile],
      ["Email", student.email],
      ["Subject", student.subject],
      ["Area", student.area],
    ],
  });

  if (student.email) {
    await sendWelcomeEmail({
      to: student.email,
      name: student.name,
      role: "student",
      loginUrl: `${frontendUrl()}/login.html`,
    });
  }
};

const sendTeacherRegistrationEmail = async (teacher) => {
  await sendAdminNotification({
    subject: "New Teacher Registration",
    title: "New Teacher Registration",
    intro: "A new teacher application has been submitted.",
    details: [
      ["Teacher", teacher.name],
      ["Phone", teacher.mobile],
      ["Email", teacher.email],
      ["Subject", teacher.subject],
      ["Experience", teacher.experience],
      ["Qualification", teacher.qualification],
      ["Area", teacher.area],
    ],
  });

  if (teacher.email) {
    await sendWelcomeEmail({
      to: teacher.email,
      name: teacher.name,
      role: "teacher",
      loginUrl: `${frontendUrl()}/login.html`,
    });
  }
};

const sendTeacherApprovalEmail = async ({ to, name, loginUrl }) => sendEmail({
  to,
  subject: "Teacher Application Approved",
  html: layout({
    title: "Teacher Application Approved",
    intro: `Congratulations ${name || "Teacher"}! Your Class Orbit teacher application has been approved.`,
    body: `<p style="font-size:15px;line-height:1.7;color:#374151;">You can now log in to access your dashboard, view assignments, and manage teaching details.</p>`,
    cta: button(loginUrl || `${frontendUrl()}/login.html`, "Open Dashboard"),
  }),
});

const sendTeacherRejectionEmail = async ({ to, name }) => sendEmail({
  to,
  subject: "Teacher Application Rejected",
  html: layout({
    title: "Teacher Application Rejected",
    intro: `Hi ${name || "Teacher"}, thank you for your interest in Class Orbit.`,
    body: `<p style="font-size:15px;line-height:1.7;color:#374151;">After review, your application was not approved at this time. You may reapply in the future with updated details or credentials.</p>`,
  }),
});

const sendPaymentSuccessEmail = async (payment) => {
  const details = [
    ["Student", payment.studentName],
    ["Plan Purchased", payment.plan],
    ["Amount", `Rs.${payment.amount}`],
    ["Date", formatDate(payment.updatedAt || payment.createdAt || new Date())],
    ["Transaction ID", payment.razorpayPaymentId],
    ["Phone", payment.phone],
    ["Email", payment.email],
  ];

  await sendAdminNotification({
    subject: "Successful Payment",
    title: "Successful Payment",
    intro: "A payment was verified successfully.",
    details,
  });

  if (payment.email) {
    await sendEmail({
      to: payment.email,
      subject: "Payment Successful",
      html: layout({
        title: "Payment Successful",
        intro: `Hi ${payment.studentName || "there"}, your payment has been received.`,
        body: detailsTable(details.slice(1, 5)),
      }),
    });
  }
};

module.exports = {
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendContactNotification,
  sendBookDemoNotification,
  sendStudentRegistrationEmail,
  sendTeacherRegistrationEmail,
  sendTeacherApprovalEmail,
  sendTeacherRejectionEmail,
  sendPaymentSuccessEmail,
  sendAdminNotification,
  validateBrevoApi,
};

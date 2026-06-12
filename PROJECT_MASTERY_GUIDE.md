# Class Orbit Project Mastery Guide

This guide explains the complete Class Orbit codebase from beginner level to job-ready level. It is based on the actual files in this project and does not require changing the code.

Important source-of-truth note: `backend/server.js` is the active backend entry point because `backend/package.json` uses `"start": "node server.js"` and `"dev": "nodemon server.js"`. `backend/app.js`, several route files, and `backend/payment/` look like older or alternate modular versions. They are still documented because they exist in the codebase, but the running app mainly depends on `server.js`.

---

## Table Of Contents

1. Project Overview
2. Complete Folder Structure
3. Complete Frontend Learning
4. Complete Backend Learning
5. Database Learning
6. Authentication System
7. Payment System
8. Email System
9. Security
10. Deployment
11. Bugs And Debugging
12. Interview Preparation
13. Project Defense
14. Rebuild Roadmap
15. Revision Material
16. Job Readiness

---

# 1. Project Overview

## What Is Class Orbit?

Class Orbit is a premium education platform for students, teachers, and administrators. It allows:

- Students to register, book demos, choose learning plans, pay fees, log in, and view a dashboard.
- Teachers to register and be reviewed by admins.
- Admins to log in, see students, teachers, demos, payments, and approve or reject teachers.
- The business owner to receive email notifications for leads, demos, contacts, and payments.

Technically, it is a Node.js, Express.js, MongoDB, Mongoose, Razorpay, Nodemailer, JWT, bcrypt, HTML, CSS, and vanilla JavaScript project.

## Why Was It Built?

It was built to turn an education/tutoring service into a structured digital platform. Instead of collecting student and teacher data manually through phone calls, notebooks, or WhatsApp only, Class Orbit stores user actions in a database and provides admin workflows.

## Who Are The Users?

- Student: wants tuition, demo class, teacher matching, plan purchase, and dashboard access.
- Teacher: wants to join Class Orbit and get students.
- Admin/business owner: wants to manage leads, teacher approvals, demo requests, payments, and revenue.
- Visitor/parent: wants to understand the service, contact support, or book a demo.

## What Problems Does It Solve?

- Lead collection: student, teacher, demo, and contact forms save data.
- Authentication: users can create accounts and log in.
- Role separation: student, teacher, and admin users see different areas.
- Admin control: admin can view and manage important records.
- Payments: Razorpay integration supports plan payment.
- Communication: email notifications inform admin and users.
- Deployment readiness: frontend can run on Netlify, backend on Render, database on MongoDB Atlas.

## Real-World Use Case

A parent visits the Class Orbit website, checks pricing, books a free demo, and enters student details. The backend stores the demo in MongoDB and sends an email notification to the admin. The admin logs in, views pending demo requests, calls the parent, assigns a teacher, and later the student pays through Razorpay.

## Business Perspective

Class Orbit is a lead generation and operations platform for a tutoring business. The business value is:

- Capture interested students.
- Build a database of teachers.
- Track demo requests.
- Accept online payments.
- Give the business owner a central dashboard.
- Reduce manual follow-up mistakes.

## SaaS Perspective

From a SaaS view, Class Orbit has the foundation of a vertical SaaS product for education services:

- Multi-role accounts.
- Admin dashboard.
- Subscription-like learning plans.
- Payment flow.
- Email notifications.
- Hosted frontend, hosted API, cloud database.

To become a stronger SaaS, it would need tenant/company separation, recurring billing, attendance, course management, analytics, notifications, and stronger audit logs.

## MVP Explanation

An MVP is the smallest useful version of a product. Class Orbit's MVP includes:

- Marketing pages.
- Student registration.
- Teacher registration.
- Demo booking.
- Login/register.
- Admin dashboard.
- Payment order and verification.
- Email notifications.

This is enough to test whether users are interested and whether the business can manage leads online.

## Interview Explanation

In interviews, explain it as:

"Class Orbit is a full-stack education platform I built using vanilla HTML/CSS/JavaScript on the frontend and Node.js/Express/MongoDB on the backend. It supports student and teacher registration, JWT-based authentication, role-based dashboards, admin management, Razorpay payments, email notifications using Nodemailer, and secure deployment using environment variables, CORS, Helmet, and rate limiting."

## 30-Second Explanation

Class Orbit is a full-stack education platform for connecting students with teachers. Students can register, book demos, choose plans, make payments, and access a dashboard. Teachers can apply, and admins can manage students, teachers, demos, and payments. I built it with HTML, CSS, JavaScript, Node.js, Express, MongoDB, JWT authentication, Razorpay, and Nodemailer.

## 2-Minute Explanation

Class Orbit is an education service platform designed for a tutoring business. The frontend is built with HTML, CSS, and vanilla JavaScript. It has pages for home, about, students, teachers, demo booking, contact, login, register, payment, and dashboards. The frontend communicates with an Express API using `fetch`.

The backend uses Node.js and Express. MongoDB stores users, students, teachers, contacts, demos, and payments through Mongoose models. Authentication uses bcrypt for password hashing and JWT for login sessions. Admin routes are protected with middleware that checks the JWT and admin role. Razorpay is used for payment order creation and signature verification. Nodemailer sends notifications for registrations, contacts, demos, payments, and password resets.

From a business perspective, the project helps collect leads, manage teacher approvals, accept fees, and operate a tutoring service digitally.

## 5-Minute Explanation

Class Orbit is a complete MVP for a premium tutoring platform. The product has four main parts: public marketing pages, user workflows, admin operations, and external integrations.

The frontend is static HTML/CSS/JavaScript. Pages like `index.html`, `student.html`, `teacher.html`, `book-demo.html`, `contact.html`, and `payment.html` collect user input and send requests to the backend API hosted at `window.API_BASE_URL`. Pages like `login.html`, `register.html`, `student-dashboard.html`, `teacher-dashboard.html`, and `admin.html` use `localStorage` to store authentication data and manage sessions.

The backend runs from `backend/server.js`. It loads environment variables using `dotenv`, connects to MongoDB using `config/db.js`, applies security middleware like Helmet, CORS, JSON body limits, static frontend hosting, and API rate limiting. It defines routes for authentication, student registration, teacher registration, demo booking, contact form, newsletter subscription, payments, and admin dashboard APIs.

Data is modeled with Mongoose. `User` stores login accounts and roles. `Student`, `Teacher`, `Demo`, `Contact`, and `Payment` store business data. Authentication is handled by `controllers/authcontroller.js`, which registers users, hashes passwords with bcrypt, logs users in, signs JWTs, handles password reset tokens, and supports password change. `middleware/authmiddleware.js` protects routes and checks roles.

Razorpay is integrated in the payment flow. The frontend asks the backend to create an order. The backend validates the plan amount, creates a Razorpay order, saves a pending payment, and returns the order. After checkout, the frontend sends Razorpay IDs and signature to the backend. The backend verifies the HMAC signature using the Razorpay secret, updates payment status to success, and sends confirmation emails.

Nodemailer sends admin and user emails. Email failures do not block the main form submission, which is good business behavior because a lead should not be lost just because email is temporarily unavailable.

The project demonstrates full-stack CRUD thinking, role-based authentication, API design, third-party integrations, security basics, deployment configuration, and real business problem solving.

---

# 2. Complete Folder Structure

## High-Level Structure

```text
output_site/
  .git/
  .gitignore
  README.md
  SETUP.md
  PROJECT_MASTERY_GUIDE.md
  frontend/
  backend/
```

## Dependency Flow Diagram

```text
Browser
  |
  v
frontend/*.html + shared.css + style.css + assets
  |
  | fetch(window.API_BASE_URL + "/api/...")
  v
backend/server.js
  |
  +--> routes/authroutes.js
  |       +--> controllers/authcontroller.js
  |       +--> middleware/authmiddleware.js
  |       +--> models/user.js
  |
  +--> inline student/teacher/demo/contact/payment/admin routes
  |       +--> models/student.js
  |       +--> models/teacher.js
  |       +--> models/demo.js
  |       +--> models/contact.js
  |       +--> models/payment.js
  |       +--> config/emailService.js
  |
  +--> config/db.js
  |       +--> MongoDB Atlas/local MongoDB
  |
  +--> Razorpay API
  +--> Gmail SMTP through Nodemailer
```

## Root Files

### `.git/`

Purpose: Stores Git version history.
Why it exists: Allows tracking code changes.
When it executes: It does not execute in the app.
Dependencies: Git.
What breaks if removed: Version history is lost, but the app can still run.
Interaction: Used by Git commands.

### `.gitignore`

Purpose: Tells Git which files to ignore.
Why it exists: Prevents committing unwanted files like `node_modules` or `.env`.
When it executes: Git reads it during status/add/commit operations.
Dependencies: Git.
What breaks if removed: Secrets and large dependency folders may accidentally be committed.
Interaction: Protects environment files and generated folders.

### `README.md`

Purpose: Describes project features, tech stack, API overview, and structure.
Why it exists: First documentation for developers or interviewers.
When it executes: Never; documentation only.
Dependencies: None.
What breaks if removed: App still runs, but project becomes harder to understand.
Interaction: Explains backend/frontend setup.

### `SETUP.md`

Purpose: Local setup guide.
Why it exists: Helps run the project with Node, MongoDB, env variables, and frontend server.
When it executes: Never; documentation only.
Dependencies: None.
What breaks if removed: No runtime break, but onboarding becomes harder.
Interaction: Lists required `.env` keys.

### `PROJECT_MASTERY_GUIDE.md`

Purpose: This learning guide.
Why it exists: Converts project knowledge into a beginner-to-job-ready study system.
When it executes: Never.
Dependencies: None.
What breaks if removed: No runtime break; learning documentation disappears.
Interaction: References all major project files.

## Frontend Folder

### `frontend/`

Purpose: Contains static website pages, CSS, images, and client-side JavaScript embedded in HTML.
Why it exists: It is the user interface.
When it executes: Browser loads these files when users visit pages.
Dependencies: Browser, Font Awesome CDN, Google Fonts, Razorpay checkout script on `payment.html`, backend API.
What breaks if removed: Users cannot view or use the website.
Interaction: Sends API calls to backend using `fetch`.

### `frontend/shared.css`

Purpose: Global styles used across pages.
Why it exists: Keeps navbar, footer, chatbot, form, dashboard, button, color, responsive, and common UI styling consistent.
When it executes: Browser loads it via `<link rel="stylesheet">`.
Dependencies: HTML class names and CSS variables.
What breaks if removed: Pages lose main styling, layout, responsiveness, and shared UI.
Interaction: Works with all frontend HTML pages.

### `frontend/style.css`

Purpose: Homepage-specific styling.
Why it exists: Styles hero, pricing, testimonials, feature grid, CTA, CEO section, and homepage responsiveness.
When it executes: Loaded by `index.html`.
Dependencies: `index.html` class names.
What breaks if removed: Homepage becomes visually incomplete.
Interaction: Complements `shared.css`.

### `frontend/index.html`

Purpose: Landing/home page.
Why it exists: Introduces Class Orbit, pricing, features, testimonials, CTA, newsletter, and chatbot.
When it executes: When user visits the root site or `/index.html`.
Dependencies: `shared.css`, `style.css`, logo assets, backend newsletter API.
What breaks if removed: Main entry page disappears.
Interaction: Links to student, teacher, demo, plan purchase, login, contact pages.

### `frontend/about.html`

Purpose: Explains company story and values.
Why it exists: Builds trust for parents/students/teachers.
When it executes: Browser loads it on About page.
Dependencies: `shared.css`, Instagram embed, newsletter API, chatbot logic.
What breaks if removed: About page missing.
Interaction: Uses newsletter API and navigation.

### `frontend/team.html`

Purpose: Team page.
Why it exists: Presents people behind the platform.
When it executes: Browser loads team page.
Dependencies: `shared.css`, newsletter API.
What breaks if removed: Team page missing.
Interaction: Uses shared navbar/footer.

### `frontend/student.html`

Purpose: Student registration/lead page.
Why it exists: Captures student details for tutoring.
When it executes: User opens student page and submits form.
Dependencies: `/api/student/register`, newsletter API, chatbot, form element IDs.
What breaks if removed: Student lead registration page disappears.
Interaction: Sends name, class, mobile, school, subject, area to backend.

### `frontend/teacher.html`

Purpose: Teacher application page.
Why it exists: Captures teacher leads.
When it executes: Teacher fills and submits registration form.
Dependencies: `/api/teacher/register`, `sessionStorage` from register page, newsletter API.
What breaks if removed: Teacher application workflow disappears.
Interaction: Sends teacher name, mobile, subject, experience, qualification, area, email.

### `frontend/book-demo.html`

Purpose: Free demo booking page.
Why it exists: Captures high-intent student leads.
When it executes: User submits demo form.
Dependencies: `/api/demo/book`, newsletter API.
What breaks if removed: Demo booking workflow disappears.
Interaction: Saves demo request in MongoDB and notifies admin.

### `frontend/contact.html`

Purpose: Contact page.
Why it exists: Allows general inquiries.
When it executes: User submits contact form.
Dependencies: `/api/contact/send`, chatbot, newsletter.
What breaks if removed: Contact support flow disappears.
Interaction: Saves contact message and emails admin.

### `frontend/login.html`

Purpose: Unified login page for student, teacher, and admin.
Why it exists: Authenticates users and redirects by role.
When it executes: User selects role, enters email/password, clicks login, or presses Enter.
Dependencies: `/api/auth/login`, `localStorage`.
What breaks if removed: Users cannot log in.
Interaction: Stores `authToken`, `role`, `user`, `userId`, then redirects to role dashboard.

### `frontend/register.html`

Purpose: Account registration page.
Why it exists: Creates login accounts for students or teachers.
When it executes: User fills name, email, phone, role, password.
Dependencies: `/api/auth/register`, `localStorage`, `sessionStorage`.
What breaks if removed: Users cannot self-register accounts.
Interaction: Students go to dashboard; teachers go to `teacher.html#form` with prefilled session data.

### `frontend/forgot-password.html`

Purpose: Password reset page.
Why it exists: Lets users request a reset link and set a new password using token.
When it executes: User enters email or opens page with `?token=...`.
Dependencies: `/api/auth/forgot-password`, `/api/auth/reset-password`, URLSearchParams, prompt.
What breaks if removed: Password reset workflow is unavailable.
Interaction: Backend generates reset token and sends reset email.

### `frontend/student-dashboard.html`

Purpose: Student dashboard.
Why it exists: Gives logged-in students a protected view of their profile/plan and password change.
When it executes: After student login/registration.
Dependencies: JWT in `localStorage`, `/api/auth/session`, `/api/auth/change-password`, local cached student data.
What breaks if removed: Student has no dashboard.
Interaction: Validates role and token before showing body.

### `frontend/teacher-dashboard.html`

Purpose: Teacher dashboard.
Why it exists: Gives teachers a protected account area.
When it executes: After teacher login.
Dependencies: JWT in `localStorage`, `/api/auth/session`, local cached approved teacher data.
What breaks if removed: Teacher has no dashboard.
Interaction: Validates teacher role.

### `frontend/admin.html`

Purpose: Admin dashboard.
Why it exists: Allows admin to view stats, students, teachers, pending approvals, demos, payments, and notifications.
When it executes: After admin login.
Dependencies: JWT in `localStorage`, `/api/auth/session`, `/api/admin/*`, localStorage cache.
What breaks if removed: Admin cannot manage platform through UI.
Interaction: Calls protected admin APIs with `Authorization: Bearer <token>`.

### `frontend/plan-purchase.html`

Purpose: Plan selection and student account creation flow.
Why it exists: Lets students choose plans and create account.
When it executes: User chooses a plan, fills details, creates login.
Dependencies: `/api/auth/register`, `/api/student/register`, `localStorage`.
What breaks if removed: Plan-based onboarding disappears.
Interaction: Creates auth account and student record.

### `frontend/payment.html`

Purpose: Razorpay payment page.
Why it exists: Accepts fee payments for selected plans.
When it executes: User selects plan, fills payment details, opens Razorpay checkout.
Dependencies: Razorpay checkout script, `/api/payment/create-order`, `/api/payment/verify`.
What breaks if removed: Online payment flow disappears.
Interaction: Creates pending payment, verifies signature, updates status.

### `frontend/privacy.html`

Purpose: Privacy policy.
Why it exists: Explains data handling and payment privacy.
When it executes: Static page load.
Dependencies: `shared.css`.
What breaks if removed: Legal/privacy page missing.
Interaction: Linked from footer/navigation.

### `frontend/terms.html`

Purpose: Terms and conditions page.
Why it exists: Explains service terms.
When it executes: Static page load.
Dependencies: `shared.css`.
What breaks if removed: Terms page missing.
Interaction: Linked from footer/navigation.

### Assets: `logo.jpg`, `logo-class-orbit.svg`, `favicon-class-orbit.svg`, `bck.jpg`, `images/akash.jpg`

Purpose: Visual branding and page images.
Why they exist: Improve brand recognition and UI quality.
When they execute: They do not execute; browser loads them as media.
Dependencies: HTML/CSS references.
What breaks if removed: Images/logos/backgrounds break or show missing assets.
Interaction: Used in navbar, login background, homepage/team sections, payment checkout logo.

## Backend Folder

### `backend/`

Purpose: Contains Express API server, database models, routes, middleware, config, and dependencies.
Why it exists: Handles business logic, security, data storage, payments, emails, and APIs.
When it executes: `npm start` or `npm run dev`.
Dependencies: Node.js, npm packages, MongoDB, env variables.
What breaks if removed: No backend API, auth, database, payment, or email.
Interaction: Receives frontend requests.

### `backend/package.json`

Purpose: Defines backend metadata, dependencies, and scripts.
Why it exists: npm uses it to install and run backend.
When it executes: `npm install`, `npm start`, `npm run dev`.
Dependencies: npm.
What breaks if removed: Cannot install or run backend normally.
Interaction: Points to `server.js` as main.

### `backend/package-lock.json`

Purpose: Locks exact installed package versions.
Why it exists: Reproducible installs.
When it executes: npm reads it during install.
Dependencies: npm.
What breaks if removed: App may still install, but versions can drift.
Interaction: Works with `package.json`.

### `backend/.env`

Purpose: Real secret configuration.
Why it exists: Stores local/production values like Mongo URI, JWT secret, Razorpay keys, email password.
When it executes: Loaded by `dotenv.config()`.
Dependencies: `dotenv`.
What breaks if removed: DB, JWT, email, payments, and CORS may fail.
Interaction: Read by `server.js`, `db.js`, auth, email, payment config.

Do not commit `.env`.

### `backend/.env.example`

Purpose: Template showing required environment variables.
Why it exists: Helps developers create `.env` safely.
When it executes: Never directly.
Dependencies: None.
What breaks if removed: App runs, but setup becomes unclear.
Interaction: Documents variables like `MONGO_URI`, `JWT_SECRET`, `FRONTEND_URL`, `RAZORPAY_KEY_ID`.

### `backend/server.js`

Purpose: Main active Express server.
Why it exists: Starts app, configures middleware, defines routes, connects DB, listens on port.
When it executes: `npm start` or `npm run dev`.
Dependencies: Express, dotenv, cors, helmet, rate-limit, path, Mongo models, auth middleware, email service, Razorpay, crypto.
What breaks if removed: Backend cannot start.
Interaction: Central hub for almost every runtime feature.

### `backend/app.js`

Purpose: Older/alternate modular Express app.
Why it exists: It shows an earlier structure with route modules.
When it executes: Only if another file imports it. Current `package.json` does not run it directly.
Dependencies: Express, cors, mongoose, dotenv, route modules.
What breaks if removed: Current `server.js` flow likely still works, but any tests/imports expecting `app.js` would break.
Interaction: Uses route files like `adminroutes`, `studentRoutes`, `teacherRoutes`, `payment`.

### `backend/config/db.js`

Purpose: Connects to MongoDB using Mongoose.
Why it exists: Keeps database connection logic separate.
When it executes: Called by `server.js` during startup.
Dependencies: `mongoose`, `MONGO_URI`.
What breaks if removed: Server cannot connect to database.
Interaction: Returns true/false connection result.

### `backend/config/emailService.js`

Purpose: Nodemailer transport and HTML email templates.
Why it exists: Sends admin notifications and user confirmations.
When it executes: Called after registrations, contacts, payments, password reset.
Dependencies: `nodemailer`, `EMAIL_USER`, `EMAIL_APP_PASS`, optional `ADMIN_EMAIL`.
What breaks if removed: Email notification features fail.
Interaction: Used by `server.js` and `authcontroller.js`.

### `backend/config/razorpay.js`

Purpose: Creates a Razorpay client instance.
Why it exists: Reusable Razorpay configuration.
When it executes: When imported.
Dependencies: `razorpay`, Razorpay env keys.
What breaks if removed: Any code importing it fails; current `server.js` creates Razorpay inline instead.
Interaction: Used by older/modular payment design if imported.

### `backend/config/admin/`

Purpose: Older/simple admin dashboard experiment.
Why it exists: Contains legacy static admin HTML/CSS/JS and an accidental Mongoose Admin model inside `admin.js`.
When it executes: Only if manually served/opened or imported.
Dependencies: Browser for HTML/CSS/JS; `mongoose` for `admin.js` if treated as Node file.
What breaks if removed: Current `frontend/admin.html` likely still works, but legacy admin files disappear.
Interaction: Not part of active `server.js` routes.

### `backend/controllers/authcontroller.js`

Purpose: Authentication controller.
Why it exists: Keeps register, login, reset password, change password, session, and user listing logic organized.
When it executes: Called by `routes/authroutes.js`.
Dependencies: `models/user.js`, `jsonwebtoken`, `bcryptjs`, `crypto`, `emailService`.
What breaks if removed: Auth routes stop working.
Interaction: Creates JWTs, hashes passwords, sends password reset email.

### `backend/middleware/authmiddleware.js`

Purpose: Protects routes and checks roles.
Why it exists: Prevents unauthorized access.
When it executes: Before protected route handlers.
Dependencies: `jsonwebtoken`, `JWT_SECRET`.
What breaks if removed: Protected admin/session/password routes cannot enforce auth.
Interaction: Adds `req.user` after JWT verification.

### `backend/models/*.js`

Purpose: Mongoose schemas and models.
Why they exist: Define database collections and field rules.
When they execute: When imported by routes/controllers.
Dependencies: `mongoose`.
What breaks if removed: Database operations for that collection fail.
Interaction: Used by `server.js`, route modules, controllers.

### `backend/routes/*.js`

Purpose: Express route modules.
Why they exist: Organize APIs into smaller files.
When they execute: When mounted by `server.js` or `app.js`.
Dependencies: Express, controllers, models, middleware.
What breaks if removed: Any route importing them fails.
Interaction: `authroutes.js` is active through `server.js`; others are mainly used by `app.js` or legacy flows.

### `backend/payment/`

Purpose: Older/modular payment controller/routes/Razorpay setup.
Why it exists: Earlier payment implementation.
When it executes: Only if mounted by another app; current `server.js` handles active payment routes inline.
Dependencies: Razorpay, Payment model.
What breaks if removed: Current inline payment likely still works, but legacy modular payment imports break.
Interaction: Similar concepts to active `/api/payment/create-order`.

### `backend/node_modules/`

Purpose: Installed third-party packages.
Why it exists: Contains code for Express, Mongoose, bcrypt, JWT, Razorpay, Nodemailer, etc.
When it executes: Node loads packages from here when `require()` is called.
Dependencies: `package.json` and npm install.
What breaks if removed: Backend cannot run until `npm install` is run again.
Interaction: Provides all npm libraries.

## Backend Route Flow Diagram

```text
server.js
  |
  +-- app.use("/api/auth", authroutes)
  |     +-- POST /login
  |     +-- POST /register
  |     +-- POST /forgot-password
  |     +-- POST /reset-password
  |     +-- POST /change-password
  |     +-- GET /session
  |
  +-- POST /api/student/register
  +-- POST /api/teacher/register
  +-- POST /api/demo/book
  +-- POST /api/contact/send
  +-- POST /api/payment/create-order
  +-- POST /api/payment/verify
  +-- POST /api/newsletter/subscribe
  |
  +-- app.use("/api/admin", protect, isAdmin)
        +-- GET /stats
        +-- GET /students
        +-- GET /teachers
        +-- GET /demos
        +-- GET /contacts
        +-- GET /payments
        +-- PUT /student/:id
        +-- DELETE /student/:id
        +-- PUT /teacher/:id
        +-- PUT /demo/:id
```

---

# 3. Complete Frontend Learning

## HTML Concepts Used

HTML gives structure to the page.

Important tags used in this project:

- `<!DOCTYPE html>` tells the browser to use modern HTML.
- `<html>` wraps the document.
- `<head>` contains metadata, title, CSS links, and icons.
- `<meta name="viewport">` makes responsive layout work on mobile.
- `<title>` controls browser tab text.
- `<link>` loads CSS, favicon, fonts, and icons.
- `<body>` contains visible content.
- `<nav>` represents navigation.
- `<section>` groups page content.
- `<form-like divs>` are used for inputs and buttons, though many pages use `onclick` instead of formal `<form onsubmit>`.
- `<input>`, `<select>`, `<textarea>` collect user input.
- `<button>` triggers JavaScript.
- `<script>` contains page-specific JavaScript.

Semantic tags improve meaning. This project uses sections, navigation, headings, and footer-like blocks to organize pages.

## Forms In This Project

Form examples:

- Student registration: `student.html`
- Teacher registration: `teacher.html`
- Demo booking: `book-demo.html`
- Contact form: `contact.html`
- Login: `login.html`
- Register: `register.html`
- Password reset: `forgot-password.html`
- Payment form: `payment.html`

Most forms work like this:

```text
User types into input
  |
  v
Button onclick calls JS function
  |
  v
JS reads values with document.getElementById(...).value
  |
  v
JS validates required fields
  |
  v
fetch sends JSON to backend
  |
  v
User sees alert/message/redirect
```

## CSS Concepts Used

CSS controls visual design.

Concepts used:

- Reset: `*, *::before, *::after` removes default spacing and uses `box-sizing: border-box`.
- CSS variables: `:root { --primary: ... }` stores reusable colors and shadows.
- Flexbox: navbar, hero sections, footer layout.
- Grid: cards, stats, pricing, dashboard layout.
- Responsive design: media queries at `768px`, `480px`, `425px`, etc.
- Hover states: buttons/cards move slightly.
- Focus states: `:focus-visible` improves accessibility.
- CSS animations: `@keyframes pulse`, `slideUp`.
- `clamp()` for responsive but controlled spacing/font sizing in some areas.
- Shared classes: `.btn`, `.submit-btn`, `.card`, `.navbar`, `.chatbot-box`.

## JavaScript Concepts Used

### Variables

Used with `const` and `let`.

- `const` means the variable reference should not be reassigned.
- `let` means the value can change.

Example from `payment.html`:

```js
let selectedAmount = 499;
let selectedPlanName = 'Standard Support Plan';
```

These values change when a user selects a different plan.

### Functions

Functions group reusable logic.

Examples:

- `loginUser()`
- `registerUser()`
- `submitStudentForm()`
- `submitTeacherForm()`
- `bookDemo()`
- `startPayment()`
- `validateAccess()`
- `logout()`

### Events

Events happen when users interact.

Examples:

- `onclick="loginUser()"`
- `oninput="filterStudents()"`
- `onkeypress="if(event.key==='Enter') sendChat()"`
- `document.addEventListener('keypress', ...)`
- `window.addEventListener('scroll', ...)`
- `window.addEventListener('load', ...)`

### DOM Manipulation

DOM means the browser's object version of HTML.

Common operations:

- Read input: `document.getElementById('email').value`
- Change text: `element.textContent = '...'`
- Change HTML: `tbody.innerHTML = rows`
- Add class: `classList.add('active')`
- Remove class: `classList.remove('active')`
- Toggle menu: `classList.toggle('open')`
- Create element: `document.createElement('div')`

### Async/Await And Promises

`fetch()` returns a Promise. `async/await` makes asynchronous code look sequential.

Example:

```js
const response = await fetch(url, options);
const data = await response.json();
```

Meaning:

1. Send request.
2. Wait for response.
3. Convert JSON response to JavaScript object.

### Fetch

`fetch` connects frontend to backend.

Common pattern:

```js
await fetch(window.API_BASE_URL + '/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password: pass, role })
});
```

### localStorage

`localStorage` stores data in the browser even after refresh.

Used for:

- `authToken`
- `role`
- `user`
- `userId`
- cached admin data like `era_students`

Risk: JWT in localStorage can be stolen if an XSS vulnerability exists.

### sessionStorage

`sessionStorage` stores data only for current browser tab/session.

Used in teacher onboarding:

- `reg_name`
- `reg_email`
- `reg_phone`

### Session Handling

This project checks sessions by:

1. Reading token from localStorage.
2. Sending it to `/api/auth/session` using `Authorization: Bearer <token>`.
3. Backend verifies JWT.
4. Frontend checks returned role.

### Form Validation

Validation examples:

- Required fields: `if (!email || !pass) ...`
- Email contains `@`.
- Password length minimum 6.
- Password confirmation matches.
- Payment plan amount must match expected plan.

Frontend validation improves UX. Backend validation is still required for security.

## Frontend File Logic

### `index.html`

Purpose: Homepage.
Logic:

- Defines `window.API_BASE_URL`.
- Hamburger menu toggles mobile nav.
- Scroll event adds navbar shadow.
- Testimonial slider cycles active testimonial.
- Newsletter sends email to `/api/newsletter/subscribe`.
- Chatbot replies based on keywords like student, teacher, fees, demo.

Inputs: newsletter email, chatbot text.
Outputs: subscription request, chatbot messages.

Execution flow:

```text
Page loads
  |
  user clicks menu / scrolls / subscribes / chats
  |
  JS updates DOM or calls backend
```

### `student.html`

Purpose: Student lead form.
Logic:

- Reads student details.
- Validates name, class, mobile.
- Sends POST `/api/student/register`.
- Shows success/error.
- Newsletter and chatbot are also available.

Inputs: name, class, school, mobile, subject, area.
Outputs: Student document in MongoDB, admin/user email.

### `teacher.html`

Purpose: Teacher application.
Logic:

- Loads prefill values from `sessionStorage` if teacher came from `register.html`.
- Validates name, mobile, subject.
- Sends POST `/api/teacher/register`.
- Clears sessionStorage after success.

Inputs: name, mobile, subject, experience, qualification, area, email.
Outputs: Teacher document in MongoDB and email notifications.

### `book-demo.html`

Purpose: Demo booking.
Logic:

- Reads demo fields.
- Validates required fields.
- Sends POST `/api/demo/book`.
- Shows loading state while request is running.

Inputs: studentName, class, mobile, subject, area, timing.
Outputs: Demo document and admin notification.

### `contact.html`

Purpose: Contact form.
Logic:

- Reads contact fields.
- Validates name and mobile.
- Sends POST `/api/contact/send`.
- Clears inputs after success.
- Includes chatbot and newsletter behavior.

Inputs: name, mobile, email, subject, message.
Outputs: Contact document and admin email.

### `login.html`

Purpose: Login.
Logic:

- Reads role, email, password.
- Validates fields.
- Sends POST `/api/auth/login`.
- If token is returned, stores token and role in localStorage.
- Redirects by role.

Inputs: role, email, password.
Outputs: localStorage session and dashboard redirect.

Line-by-line key logic:

- `window.API_BASE_URL = ...`: chooses backend URL.
- `document.addEventListener('keypress', ...)`: allows Enter key login.
- `const role = ...`: reads selected role.
- `fetch(.../api/auth/login...)`: sends credentials.
- `if (!response.ok || !data.token)`: rejects bad login.
- `localStorage.setItem(...)`: stores session.
- `window.location.href = ...`: navigates to correct dashboard.

### `register.html`

Purpose: Create auth account.
Logic:

- Reads name, email, phone, role, password.
- Validates required fields, email, password length, password match.
- Sends POST `/api/auth/register`.
- Saves token and role.
- Student goes to student dashboard.
- Teacher gets redirected to teacher application page with session prefill.

Inputs: name, email, phone, role, password.
Outputs: User document, localStorage session, redirect.

### `forgot-password.html`

Purpose: Password reset.
Logic:

- `sendReset()` sends email to `/api/auth/forgot-password`.
- `resetFromLink()` reads `token` from URL query string.
- Prompts user for new password.
- Sends POST `/api/auth/reset-password`.

Inputs: email, reset token, new password.
Outputs: reset email or updated password.

### `student-dashboard.html`

Purpose: Protected student view.
Logic:

- Hides/redirects if token missing or role is not student.
- Calls `/api/auth/session`.
- Displays student name and cached local student info if available.
- Allows password change through `/api/auth/change-password`.

Inputs: localStorage token, password fields.
Outputs: dashboard UI, password update.

### `teacher-dashboard.html`

Purpose: Protected teacher view.
Logic:

- Checks token and teacher role.
- Calls `/api/auth/session`.
- Displays teacher info from cached approved teacher data.
- Provides logout.

Inputs: localStorage token.
Outputs: teacher dashboard or redirect.

### `admin.html`

Purpose: Protected admin dashboard.
Logic:

- Hides body at first.
- Validates token and admin role.
- Calls `/api/admin/students`, `/teachers`, `/demos`, `/payments`, `/stats`.
- Maps Mongo `_id` to frontend `id`.
- Stores cache in localStorage.
- Renders tables.
- Allows student delete and teacher status update.

Inputs: admin token, search input, action button clicks.
Outputs: dashboard tables, updates to backend, localStorage cache.

Important functions:

- `validateAccess()`: checks admin session.
- `syncFromBackend()`: fetches backend data.
- `showPanel(name)`: switches dashboard panels.
- `renderStudentsTable(list)`: builds student table.
- `approveTeacher(id)`: updates teacher status to active.
- `rejectTeacher(id)`: updates teacher status to inactive.

### `plan-purchase.html`

Purpose: Plan onboarding.
Logic:

- User selects plan.
- Modal opens.
- Step 1 collects student details.
- Step 2 collects login details.
- Creates auth account.
- Creates student record.
- Redirects to dashboard.

Inputs: plan, student details, email, password.
Outputs: User document, Student document, login session.

### `payment.html`

Purpose: Fee payment.
Logic:

- User selects plan.
- `startPayment()` validates name/email/phone.
- Calls backend to create Razorpay order.
- Opens Razorpay checkout.
- Handler sends payment IDs and signature to backend.
- Backend verifies and marks payment success.

Inputs: plan, name, email, phone, Razorpay payment response.
Outputs: Payment document status success and receipt emails.

### Static/legal pages

- `privacy.html`: privacy policy.
- `terms.html`: terms.
- `about.html`, `team.html`: trust-building content.

They mainly load shared styles and minor nav scripts.

---

# 4. Complete Backend Learning

## Node.js

Node.js is a JavaScript runtime outside the browser. It lets you build servers with JavaScript.

In this project, Node runs:

- `server.js`
- Express routes
- Mongoose database operations
- Razorpay integration
- Nodemailer email sending
- JWT and bcrypt logic

## Event Loop

Node.js uses an event loop to handle many operations without blocking.

Example:

```text
Request arrives
  |
  route handler starts
  |
  await Student.find()
  |
  Node can handle other work while DB responds
  |
  DB result returns
  |
  response is sent
```

This is why async/await is used heavily.

## Express.js

Express is a Node framework for APIs.

Main ideas:

- `const app = express()` creates server app.
- `app.use(...)` adds middleware.
- `app.post('/path', handler)` defines POST route.
- `app.get('/path', handler)` defines GET route.
- `req` contains request data.
- `res` sends response.
- `next()` passes to next middleware.

## Request Lifecycle

```text
Browser sends request
  |
  Express receives request
  |
  Helmet/CORS/body parser/rate limit run
  |
  Matching route runs
  |
  Route validates input
  |
  Route uses model/service
  |
  MongoDB/Razorpay/email may be called
  |
  JSON response sent
```

## Backend File Explanations

### `server.js` Execution Order

1. Imports packages.
2. Loads environment variables with `dotenv.config()`.
3. Creates Express app.
4. Sets production flag.
5. Defines allowed CORS origins.
6. Disables `x-powered-by`.
7. Enables trust proxy in production.
8. Adds Helmet.
9. Adds CORS.
10. Adds JSON body parser with `10kb` limit.
11. Serves static frontend files.
12. Adds API rate limiting.
13. Imports models.
14. Defines plan prices and helper functions.
15. Imports email functions.
16. Mounts auth routes.
17. Defines student/teacher/demo/contact/payment/newsletter routes.
18. Protects all `/api/admin` routes with `protect` and `isAdmin`.
19. Defines admin APIs.
20. Adds health route.
21. Adds catch-all frontend fallback.
22. Adds error handler.
23. Connects to DB.
24. Starts listening on port.

### `server.js` Important Logic

`allowedOrigins` controls which frontend URLs can call the API.

`app.use(express.json({ limit: "10kb" }))` prevents huge JSON payloads.

`app.use("/api", rateLimit(...))` limits abuse.

`PLAN_PRICES` prevents frontend users from changing payment amount.

`paymentConfigured()` checks Razorpay keys before starting payment.

`escapeHtml()` prevents unsafe HTML injection into email templates.

`safeTemplateData()` escapes all fields before email rendering.

### Student Registration Route

Input: `name`, `class`, `school`, `mobile`, `subject`, `area`, `email`.

Logic:

1. Validate name, class, mobile.
2. Create `Student`.
3. Save to MongoDB.
4. Send admin email.
5. Send user email if email exists.
6. Return success JSON.

Output: Student document and response containing new ID.

### Teacher Registration Route

Input: `name`, `mobile`, `subject`, `experience`, `qualification`, `area`, `email`.

Logic:

1. Validate name, mobile, subject.
2. Save `Teacher`.
3. Email admin.
4. Email teacher if email exists.
5. Return success.

### Demo Booking Route

Input: `studentName`, `class`, `mobile`, `subject`, `area`, `timing`.

Logic:

1. Validate required fields.
2. Save `Demo`.
3. Email admin.
4. Return success.

Note: `demoBookedUser` template exists but active route currently does not send user demo email because the demo form does not collect email.

### Contact Route

Input: `name`, `mobile`, `email`, `subject`, `message`.

Logic:

1. Validate name and mobile.
2. Save `Contact`.
3. Email admin.
4. Return success.

### Payment Create Order Route

Input: `amount`, `studentName`, `email`, `phone`, `plan`.

Logic:

1. Check Razorpay config.
2. Find expected amount from `PLAN_PRICES`.
3. Reject if frontend amount does not match.
4. Create Razorpay order in paise.
5. Save `Payment` with status `pending`.
6. Return Razorpay order plus `dbId` and `keyId`.

### Payment Verify Route

Input: `razorpay_order_id`, `razorpay_payment_id`, `razorpay_signature`, `dbId`.

Logic:

1. Check required fields.
2. Generate expected HMAC signature using Razorpay secret.
3. Compare expected signature with received signature.
4. If match, find pending payment by dbId and order ID.
5. Update payment status to `success`.
6. Send admin and user emails.
7. Return success.

### Admin Routes

Before admin routes:

```js
app.use("/api/admin", protect, isAdmin);
```

This means all admin routes after this line require valid JWT and `role === "admin"`.

Admin APIs:

- `GET /api/admin/stats`: counts students, teachers, pending demos, revenue.
- `GET /api/admin/students`: list students.
- `GET /api/admin/teachers`: list teachers.
- `GET /api/admin/demos`: list demos.
- `GET /api/admin/contacts`: list contacts.
- `GET /api/admin/payments`: list successful payments.
- `PUT /api/admin/student/:id`: update student.
- `DELETE /api/admin/student/:id`: delete student.
- `PUT /api/admin/teacher/:id`: update teacher status/details.
- `PUT /api/admin/demo/:id`: update demo.

### `authcontroller.js`

Functions:

- `generateToken(user)`: creates JWT with user ID and role.
- `register(req,res)`: creates new user.
- `login(req,res)`: validates credentials and returns token.
- `adminLogin`, `studentLogin`, `teacherLogin`: legacy role-specific wrappers.
- `forgotPassword`: creates reset token and sends email.
- `resetPassword`: validates token and changes password.
- `changePassword`: requires logged-in user and old password.
- `session`: returns logged-in user's ID and role.
- `getAllUsers`: admin user list excluding password/reset fields.

Line-by-line learning example for register:

1. `const { name, email, password, role } = req.body;` reads input.
2. Required fields are checked.
3. Password length is checked.
4. `publicRole` prevents public registration as admin.
5. Email is normalized to lowercase.
6. Existing email is checked.
7. Password is hashed with bcrypt.
8. User is saved.
9. JWT is generated.
10. Token and role are returned.

### `authmiddleware.js`

Functions:

- `protect`: checks `Authorization` header.
- `isAdmin`: allows admin only.
- `isStudent`: allows student only.
- `isTeacher`: allows teacher only.

`protect` logic:

1. Split header into scheme and token.
2. Require `Bearer`.
3. Require `JWT_SECRET`.
4. Verify token.
5. Store decoded payload in `req.user`.
6. Call `next()`.

### `routes/authroutes.js`

Purpose: maps URL paths to auth controller functions.

Active because `server.js` mounts it:

```js
app.use("/api/auth", require("./routes/authroutes"));
```

### Other Route Files

These are mostly older/modular versions used by `app.js`:

- `adminroutes.js`: admin login using separate `Admin` model and protected `/users`.
- `studentRoutes.js`: POST `/add`, GET `/all`.
- `student.js`: POST `/apply-student`.
- `teacherRoutes.js`: POST `/add`, GET `/all`.
- `teacher.js`: POST `/join`, GET `/all`.
- `contactRoutes.js`: placeholder response only.
- `payment.js`: creates Razorpay order but does not save/verify like `server.js`.

Interview note: you can say the project evolved from modular route files to a consolidated `server.js`, and a production cleanup step would be to remove or reconnect legacy route files after testing.

---

# 5. Database Learning

## MongoDB

MongoDB is a NoSQL document database. Data is stored as JSON-like documents in collections.

Example:

```json
{
  "name": "Aman",
  "class": "Class 10",
  "mobile": "9999999999"
}
```

## Mongoose

Mongoose is an ODM, which means Object Data Modeling. It lets Node.js define schemas and interact with MongoDB using models.

Schema = structure.
Model = JavaScript object used to query/save documents.
Collection = MongoDB table-like group.

## Actual Models And Collections

### `User` collection

File: `backend/models/user.js`

Purpose: login accounts.

Fields:

- `name`: user's display name.
- `email`: unique login ID.
- `password`: bcrypt hashed password.
- `role`: `admin`, `student`, `teacher`, or `user`.
- `phone`: optional phone.
- `resetToken`: password reset token.
- `resetTokenExpiry`: reset token expiry time.
- timestamps: `createdAt`, `updatedAt`.

Relationship: connects login identity to role-specific dashboard access.

### `Student` collection

File: `backend/models/student.js`

Purpose: stores student registration/lead/business profile data.

Fields:

- `name`: required student name.
- `class`: required class/grade.
- `school`: optional school.
- `mobile`: required contact number.
- `subject`: requested subject.
- `area`: location.
- `email`: optional email.
- `status`: pending/active/inactive.
- `plan`: learning plan.
- `teacher`: assigned teacher name/string.
- `attendance.present`, `attendance.absent`: attendance summary.
- `payment.paid`, `payment.pending`: payment summary.

Relationship: may correspond to a `User` account by email/user intent, but no ObjectId relationship is defined.

### `Teacher` collection

File: `backend/models/teacher.js`

Purpose: stores teacher applications and status.

Fields:

- `name`: required.
- `mobile`: required.
- `subject`: required.
- `experience`: optional.
- `qualification`: optional.
- `area`: optional.
- `email`: optional.
- `status`: pending/active/inactive.
- `students`: array of strings.
- `salary.paid`, `salary.pending`: salary summary.
- `schedule`: string.

Relationship: admin can approve teacher by changing `status` to active.

### `Payment` collection

File: `backend/models/payment.js`

Purpose: stores payment orders and verification status.

Fields:

- `studentName`
- `email`
- `phone`
- `plan`
- `amount`
- `razorpayOrderId`
- `razorpayPaymentId`
- `razorpaySignature`
- `status`: pending/success/failed
- timestamps

Relationship: linked to Razorpay by order/payment IDs, linked to user by entered email/name.

### `Demo` collection

File: `backend/models/demo.js`

Purpose: stores demo class requests.

Fields:

- `studentName`
- `class`
- `mobile`
- `subject`
- `area`
- `timing`
- `status`: pending/scheduled/completed
- timestamps

Relationship: admin views pending demo requests.

### `Contact` collection

File: `backend/models/contact.js`

Purpose: stores contact form messages.

Fields:

- `name`
- `email`
- `mobile`
- `subject`
- `message`
- `status`: new/read/replied
- timestamps

Relationship: used by admin/support follow-up.

### `Admin` collection

File: `backend/models/admin.js`

Purpose: older separate admin account model.

Fields:

- `email`
- `password`
- `role` default admin

Relationship: used by `routes/adminroutes.js`, but the active frontend admin login uses `/api/auth/login`, which uses the `User` model.

## Relationship Diagram

```text
User
  | role: student/teacher/admin
  v
Dashboard Access

Student  <--- admin views/updates --->  Admin UI
Teacher  <--- admin approves/rejects --> Admin UI
Demo     <--- admin follows up --------> Admin UI
Contact  <--- admin replies -----------> Admin UI
Payment  <--- Razorpay verification ---> Admin UI
```

Current schema does not use Mongoose `ref` relationships. It uses separate collections connected by workflow and shared fields like email/name.

---

# 6. Authentication System

## JWT Beginner Explanation

JWT means JSON Web Token. It is a signed string that proves a user logged in.

In this project, token payload contains:

```js
{ id: user._id, role: user.role }
```

The backend signs it with `JWT_SECRET`. Later, protected routes verify it.

## bcrypt Beginner Explanation

bcrypt hashes passwords. A hash is a one-way transformed version of a password.

The project never stores plain passwords. During register:

```js
const hashedPassword = await bcrypt.hash(password, 10);
```

During login:

```js
const isMatch = await bcrypt.compare(password, user.password);
```

## Registration Flow

```text
User fills register.html
  |
  frontend validates fields
  |
  POST /api/auth/register
  |
  authcontroller.register
  |
  normalize email
  |
  check existing user
  |
  hash password
  |
  save User
  |
  generate JWT
  |
  send token/role/userId
  |
  frontend stores localStorage
  |
  redirect
```

Security detail: public registration only allows `teacher` or defaults to `student`; it does not let a user self-register as admin.

## Login Flow

```text
User fills login.html
  |
  POST /api/auth/login
  |
  find user by email
  |
  optional role check
  |
  bcrypt.compare password
  |
  generate JWT
  |
  return token and role
  |
  frontend saves localStorage
  |
  redirect by role
```

## Protected Routes

```text
Request
  |
  Authorization: Bearer token
  |
  protect middleware
  |
  jwt.verify(token, JWT_SECRET)
  |
  req.user = decoded payload
  |
  route handler runs
```

## Role-Based Access

Role middleware:

- `isAdmin`: only admin.
- `isStudent`: only student.
- `isTeacher`: only teacher.

Active admin protection:

```js
app.use("/api/admin", protect, isAdmin);
```

This protects all admin routes defined after it.

## Admin Protection

Frontend checks:

1. Token exists.
2. `localStorage.role === "admin"`.
3. `/api/auth/session` confirms backend token role.

Backend checks:

1. JWT is valid.
2. `req.user.role === "admin"`.

Backend check is the real security. Frontend check is for user experience.

## Password Reset

```text
User enters email
  |
  POST /api/auth/forgot-password
  |
  if user exists:
      create crypto random token
      store resetToken and resetTokenExpiry
      email reset link
  |
  always return generic message
```

Generic response prevents attackers from checking which emails are registered.

Reset:

```text
User opens forgot-password.html?token=...
  |
  frontend prompts new password
  |
  POST /api/auth/reset-password
  |
  backend finds valid non-expired token
  |
  hashes new password
  |
  clears token fields
  |
  returns success
```

## Change Password

```text
Logged-in user enters old and new password
  |
  POST /api/auth/change-password with Bearer token
  |
  protect middleware verifies token
  |
  backend compares current password
  |
  hashes and saves new password
```

---

# 7. Payment System

## Razorpay Integration

Razorpay is used to collect plan payments.

Active files:

- Frontend: `frontend/payment.html`
- Backend: payment routes inside `backend/server.js`
- Model: `backend/models/payment.js`

## Payment Flow

```text
User selects plan
  |
  startPayment()
  |
  POST /api/payment/create-order
  |
  backend validates plan and amount
  |
  Razorpay order created
  |
  Payment saved as pending
  |
  frontend opens Razorpay checkout
  |
  user pays
  |
  Razorpay returns payment_id/order_id/signature
  |
  frontend POST /api/payment/verify
  |
  backend verifies HMAC signature
  |
  Payment status becomes success
  |
  emails sent
```

## Order Creation

Backend validates:

- `studentName` exists.
- `plan` is one of:
  - Standard Support Plan: 499
  - Premium Excellence Plan: 999
  - Annual Premium Plan: 9999
- `amount` from frontend matches expected backend amount.

This prevents a user from editing frontend JavaScript and paying less.

## Verification

Backend uses:

```js
crypto
  .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
  .update(`${razorpay_order_id}|${razorpay_payment_id}`)
  .digest("hex");
```

If expected signature equals Razorpay signature, payment is real.

## Security Rules

- Never trust frontend amount.
- Never verify payment only on frontend.
- Never expose Razorpay secret key to browser.
- Store pending payment before checkout.
- Update only pending payments.
- Match `dbId` and `razorpayOrderId`.

## Common Mistakes

- Using wrong Razorpay key mode: test key with live secret or live key with test secret.
- Amount not converted to paise.
- Frontend plan name not matching backend `PLAN_PRICES`.
- Missing `RAZORPAY_KEY_SECRET`.
- Skipping signature verification.
- Not handling user closing payment modal.

---

# 8. Email System

## Nodemailer

Nodemailer sends emails from Node.js.

File: `backend/config/emailService.js`

It creates Gmail transporter:

```js
nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASS
  }
});
```

## SMTP

SMTP is the protocol used to send emails. Gmail requires an app password, not your normal Gmail password.

## Email Functions

- `sendAdminNotification(subject, htmlContent)`
- `sendUserConfirmation(toEmail, toName, subject, htmlContent)`

Email failures are logged but not thrown. That is good because a student registration should still succeed even if email is temporarily down.

## Templates

Templates include:

- `studentRegisteredAdmin`
- `studentRegisteredUser`
- `teacherRegisteredAdmin`
- `teacherRegisteredUser`
- `demoBookedAdmin`
- `demoBookedUser`
- `contactFormAdmin`
- `paymentSuccessAdmin`
- `paymentSuccessUser`
- `passwordResetEmail`

## Password Reset Email Flow

```text
forgotPassword()
  |
  create token
  |
  save token and expiry
  |
  build reset link using FRONTEND_URL
  |
  sendUserConfirmation(... passwordResetEmail ...)
```

## Demo Booking Email Flow

Active route sends admin notification:

```text
POST /api/demo/book
  |
  save Demo
  |
  sendAdminNotification("New Demo Request", demoBookedAdmin(...))
```

User demo email template exists, but active demo form does not collect email.

---

# 9. Security

## Helmet

Purpose: Adds secure HTTP headers.
How it works: `app.use(helmet({ contentSecurityPolicy: false }))`.
Prevents/reduces: clickjacking, MIME sniffing, some browser-level attacks.

Note: CSP is disabled, likely because frontend uses inline scripts and external CDNs. A future improvement is to move scripts to separate files and enable CSP.

## Rate Limiting

Purpose: Prevent API abuse.
How it works: limits `/api` routes to 120 requests per 15 minutes.
Prevents/reduces: brute force, spam, accidental overload.

## CORS

Purpose: Controls which frontend origins can call backend.
Allowed origins include local dev and Netlify production URL.
Prevents/reduces: unauthorized browser-based cross-origin calls.

Important: CORS is not authentication. It only controls browser access.

## JWT Security

Purpose: Authenticated sessions.
How it works: server signs token and verifies it on protected routes.
Prevents: unauthenticated admin access.

Best practices:

- Use long random `JWT_SECRET`.
- Use HTTPS.
- Shorter expiry for sensitive admin sessions.
- Avoid storing sensitive data in token payload.

## Password Hashing

Purpose: Protect passwords if database leaks.
How it works: bcrypt stores hashed password, not plain text.
Prevents/reduces: password theft impact.

## Role Escalation Prevention

Important line in register:

```js
const publicRole = role === "teacher" ? "teacher" : "student";
```

This means someone cannot register as admin through the public register API.

## HTML Escaping

`escapeHtml()` and `safeTemplateData()` sanitize data before inserting into email HTML.

Prevents/reduces: HTML injection in emails.

## Remaining Security Gaps To Know

- JWT stored in localStorage can be stolen by XSS.
- Inline scripts make strong CSP harder.
- Admin creation process is not documented in active flow.
- Some legacy files are confusing and should be cleaned after testing.
- Contact/demo endpoints are public and could need CAPTCHA.
- More validation should be added using a schema validator like Zod/Joi.

---

# 10. Deployment

## Deployment Architecture

```text
Browser
  |
  v
Netlify frontend
  |
  fetch API calls
  |
  v
Render backend
  |
  Mongoose
  |
  v
MongoDB Atlas
```

External services:

```text
Render backend --> Razorpay API
Render backend --> Gmail SMTP/Nodemailer
```

## Netlify

Hosts static frontend files.

Important:

- Frontend hardcodes `window.API_BASE_URL = "https://class-orbit-backend.onrender.com";`.
- If backend URL changes, every page with this line must be updated.

Better future approach: create one shared JS config file.

## Render

Hosts Node/Express backend.

Start command:

```bash
npm start
```

Working directory should be `backend`.

Required environment variables:

- `NODE_ENV`
- `PORT`
- `MONGO_URI`
- `JWT_SECRET`
- `FRONTEND_URL`
- `CORS_ORIGINS`
- `EMAIL_USER`
- `EMAIL_APP_PASS`
- `ADMIN_EMAIL`
- `RAZORPAY_KEY_ID`
- `RAZORPAY_KEY_SECRET`

## MongoDB Atlas

Cloud MongoDB database.

Need:

- Cluster.
- Database user.
- Password.
- Network access.
- Correct connection string in `MONGO_URI`.

## Production vs Development

Development:

- Frontend may run on `localhost:5500`.
- Backend on `localhost:5000`.
- MongoDB can be local or Atlas.
- Razorpay test mode.

Production:

- Frontend on Netlify.
- Backend on Render.
- MongoDB Atlas.
- Real env variables.
- Correct CORS origins.
- HTTPS.

---

# 11. Bugs And Debugging

## MongoDB Auth Issue

Cause:

- Wrong username/password in `MONGO_URI`.
- Password contains special characters not URL-encoded.
- Atlas IP not allowed.
- Wrong database user permissions.

Symptoms:

- Server logs `MongoDB Error`.
- Backend starts without DB in development, but data save fails.
- In production, server may abort if DB not connected.

Fix:

- Recheck Atlas username/password.
- URL-encode password.
- Add `0.0.0.0/0` temporarily or correct Render IP policy.
- Verify `MONGO_URI` env var.

Debug next time:

- Print only safe part of connection host, never full URI.
- Check Atlas logs.
- Test with MongoDB Compass.

## CORS Issue

Cause:

- Frontend origin not listed in `allowedOrigins`.
- Netlify URL changed.
- Using `www` vs non-`www`.

Symptoms:

- Browser console shows CORS error.
- API works in Postman but not browser.

Fix:

- Add exact frontend URL to `allowedOrigins`.
- Redeploy backend.

Debug next time:

- Check browser Network tab.
- Check `Origin` request header.
- Compare with backend allowed origins.

## API_BASE_URL Issue

Cause:

- Hardcoded `window.API_BASE_URL` points to wrong Render URL.
- Backend is sleeping/down.
- Local dev still points to production.

Symptoms:

- Forms do nothing or show failed request.
- Network tab shows failed fetch.

Fix:

- Update `window.API_BASE_URL`.
- Confirm `/api/health` works.

Debug next time:

- Open `https://your-backend/api/health`.
- Check every frontend page using `rg "API_BASE_URL" frontend`.

## Deployment Issue

Cause:

- Wrong Render root directory.
- Missing env variables.
- Build/start command wrong.
- Node version mismatch.

Symptoms:

- Render deploy fails.
- Backend returns 500.
- Logs show missing package or env.

Fix:

- Set root to `backend`.
- Run `npm install`.
- Start with `npm start`.
- Add all env vars.

## Environment Variable Issue

Cause:

- `.env` exists locally but Render env missing.
- Placeholder values still used.
- `JWT_SECRET` missing.

Symptoms:

- Login fails with authentication unavailable.
- Payment says service not configured.
- Email silently does not send.

Fix:

- Use `.env.example` as checklist.
- Replace placeholders.
- Redeploy/restart server.

---

# 12. Interview Preparation: 100 Questions With Answers

1. What is Class Orbit?  
Class Orbit is a full-stack education platform for student registration, teacher onboarding, demo booking, payments, authentication, and admin management.

2. What tech stack did you use?  
HTML, CSS, vanilla JavaScript, Node.js, Express.js, MongoDB, Mongoose, JWT, bcrypt, Razorpay, Nodemailer, Helmet, CORS, and rate limiting.

3. Why vanilla JavaScript instead of React?  
The project was an MVP and vanilla JS was enough for static pages, forms, fetch calls, and simple dashboards.

4. What is HTML?  
HTML provides the structure of web pages using tags like headings, inputs, buttons, sections, and links.

5. What semantic tags did you use?  
Sections, nav, headings, footer-like blocks, inputs, selects, buttons, and links.

6. What is CSS used for?  
CSS controls layout, colors, typography, responsiveness, spacing, and UI states.

7. What is Flexbox used for?  
Flexbox arranges items in rows or columns, used in navbar, hero, footer, and button groups.

8. What is CSS Grid used for?  
Grid creates card layouts, dashboard stats, pricing layouts, and responsive sections.

9. What are CSS variables?  
Reusable values stored in `:root`, such as `--primary`, `--text`, and `--border`.

10. How is responsive design handled?  
With media queries and flexible layouts using grid, flex, clamp, and max-width.

11. What is JavaScript used for in this project?  
Reading form values, validation, API calls, DOM updates, redirects, authentication storage, and dashboard rendering.

12. What is DOM manipulation?  
Changing page elements with JavaScript using methods like `getElementById`, `textContent`, `innerHTML`, and `classList`.

13. What is an event listener?  
A function that runs when an event happens, like click, keypress, load, or scroll.

14. What is `fetch`?  
Browser API used to make HTTP requests to the backend.

15. What is async/await?  
Syntax for writing asynchronous Promise code in a readable way.

16. What is localStorage used for?  
Storing token, role, user ID, and cached dashboard data in the browser.

17. What is sessionStorage used for?  
Temporarily storing teacher registration prefill data in the current tab.

18. What is Node.js?  
A JavaScript runtime that lets JavaScript run on the server.

19. What is Express.js?  
A Node.js web framework for building APIs and route handlers.

20. What is middleware?  
A function that runs before a route handler, often for parsing, authentication, CORS, or security.

21. What middleware is used?  
Helmet, CORS, JSON parser, static file serving, rate limiter, and auth middleware.

22. What is MongoDB?  
A NoSQL database that stores JSON-like documents in collections.

23. What is Mongoose?  
An ODM that defines schemas and models for MongoDB in Node.js.

24. What is a schema?  
A definition of fields, types, validation, and defaults for a MongoDB document.

25. What models exist?  
User, Student, Teacher, Payment, Demo, Contact, and Admin.

26. What is JWT?  
A signed token used to prove a logged-in user's identity and role.

27. What is bcrypt?  
A password hashing library used to store passwords securely.

28. How does registration work?  
Frontend sends user details, backend validates, hashes password, saves user, generates JWT, and returns token.

29. How does login work?  
Backend finds user, checks role, compares password using bcrypt, signs JWT, and returns token.

30. How are admin routes protected?  
`protect` verifies JWT, then `isAdmin` checks the role.

31. How do you prevent public admin registration?  
The register controller converts any non-teacher public role to student.

32. How does password reset work?  
Backend creates a random token, stores expiry, emails reset link, then validates token before saving new password.

33. What is Razorpay used for?  
Creating payment orders and verifying successful payments.

34. Why verify payment on backend?  
Frontend can be manipulated, so backend must verify Razorpay signature securely.

35. What is HMAC signature verification?  
Backend creates a hash using Razorpay secret and compares it with Razorpay's returned signature.

36. What is Nodemailer used for?  
Sending admin notifications, confirmations, payment emails, and password reset emails.

37. What is SMTP?  
Protocol used to send emails through services like Gmail.

38. What is Helmet?  
Security middleware that sets safer HTTP headers.

39. What is rate limiting?  
Restricting number of API requests per time window.

40. What is CORS?  
Browser security mechanism controlling which origins can call an API.

41. Why use environment variables?  
To keep secrets and environment-specific config out of source code.

42. What are key env variables?  
`MONGO_URI`, `JWT_SECRET`, `EMAIL_USER`, `EMAIL_APP_PASS`, `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `FRONTEND_URL`.

43. What is the active backend entry file?  
`backend/server.js`.

44. What is `app.js`?  
An older/modular app file not used by current package scripts.

45. What is the purpose of `connectDB`?  
Connects Mongoose to MongoDB and returns whether connection succeeded.

46. What happens if DB fails in production?  
`server.js` aborts startup by setting exit code.

47. What happens if DB fails in development?  
Server can still listen, but database routes will fail when used.

48. Why use `express.json({ limit: "10kb" })`?  
To parse JSON and prevent very large request bodies.

49. Why use `escapeHtml`?  
To prevent user input from becoming unsafe HTML in email templates.

50. Why is `PLAN_PRICES` on backend?  
To prevent users from manipulating plan price on frontend.

51. What if interviewer asks why MongoDB?  
It fits flexible lead/profile data and is fast to build MVP schemas with Mongoose.

52. What if interviewer asks why Express?  
Express is lightweight, popular, and gives direct control over routes and middleware.

53. What if interviewer asks why JWT?  
JWT is stateless, easy for separate frontend/backend deployments, and supports role claims.

54. What if interviewer asks why Razorpay?  
Razorpay is widely used in India and provides checkout, order creation, and secure signature verification.

55. What if interviewer asks why Nodemailer?  
It is simple for transactional emails and works with Gmail SMTP/app passwords.

56. What if interviewer asks about scalability?  
The current MVP can scale moderately; future work includes modular routes, service layer, queues, Redis rate limiting, and better indexing.

57. What if interviewer asks about security weakness?  
JWT in localStorage, inline scripts limiting CSP, and public forms needing CAPTCHA are improvement areas.

58. What if interviewer asks about testing?  
Manual testing is present through flows; future improvement is Jest/Supertest API tests and Playwright frontend tests.

59. What if interviewer asks about deployment?  
Frontend on Netlify, backend on Render, database on MongoDB Atlas, with env variables and CORS setup.

60. What if interviewer asks about payment failure?  
Pending payment remains pending if verification fails; user should contact support or retry.

61. What if interviewer asks why email failure does not block registration?  
Because losing a lead is worse than missing a notification; email errors are logged.

62. What is CRUD?  
Create, Read, Update, Delete. Admin routes perform read/update/delete; forms create records.

63. Which route creates students?  
`POST /api/student/register`.

64. Which route creates teachers?  
`POST /api/teacher/register`.

65. Which route books demos?  
`POST /api/demo/book`.

66. Which route sends contacts?  
`POST /api/contact/send`.

67. Which route creates payment order?  
`POST /api/payment/create-order`.

68. Which route verifies payment?  
`POST /api/payment/verify`.

69. Which route validates session?  
`GET /api/auth/session`.

70. Which route changes password?  
`POST /api/auth/change-password`.

71. What does `protect` do?  
Validates Bearer JWT and sets `req.user`.

72. What does `isAdmin` do?  
Rejects request unless `req.user.role` is admin.

73. What does `timestamps: true` do?  
Adds `createdAt` and `updatedAt` fields automatically.

74. What is `unique: true` on email?  
It creates a uniqueness constraint for user emails.

75. Why normalize email?  
To avoid duplicate accounts caused by different casing/spaces.

76. Why use bcrypt salt rounds 10?  
It balances security and performance for password hashing.

77. What status values do students have?  
pending, active, inactive.

78. What status values do teachers have?  
pending, active, inactive.

79. What status values do demos have?  
pending, scheduled, completed.

80. What status values do payments have?  
pending, success, failed.

81. What is `findOneAndUpdate` used for in payment verify?  
To update a matching pending payment after successful signature verification.

82. Why check payment status pending before update?  
To avoid processing the same payment twice.

83. Why use `Promise.all` in admin sync?  
To fetch students, teachers, demos, payments, and stats in parallel.

84. What is a 401 error?  
Unauthenticated request.

85. What is a 403 error?  
Authenticated but not authorized.

86. What is a 400 error?  
Bad request or invalid input.

87. What is a 500 error?  
Server-side failure.

88. What is a 503 error?  
Service unavailable, used when payment is not configured.

89. How do you debug frontend API failure?  
Open browser DevTools Network tab, check request URL, status, payload, response, and CORS messages.

90. How do you debug backend failure?  
Check terminal/Render logs, route path, env variables, and database connection.

91. How do you debug MongoDB issue?  
Check `MONGO_URI`, Atlas user/password/IP access, and Compass connection.

92. How do you debug login failure?  
Check user exists, role matches, bcrypt password compare, JWT_SECRET, and frontend storage.

93. How do you debug admin access failure?  
Check token exists, role is admin, `/api/auth/session` response, and admin route middleware.

94. What would you refactor first?  
Move inline `server.js` routes into route/controller/service files and remove legacy duplicates after testing.

95. What would you improve in frontend?  
Create shared JS config/utilities, reduce inline scripts, improve reusable components, and add stronger validation.

96. What would you improve in database design?  
Add ObjectId references between User, Student, Teacher, Payment, and Demo where appropriate.

97. What would you improve in payments?  
Add webhook handling, receipt generation, retry logic, and failed payment tracking.

98. What would you improve in admin?  
Add pagination, search on backend, audit logs, and better role management.

99. What makes this project job-ready?  
It demonstrates real full-stack flows: auth, protected APIs, database schemas, payments, emails, deployment, and security basics.

100. How would you explain your contribution?  
I designed and built the frontend pages, backend APIs, database models, authentication, admin workflows, payment verification, email notifications, and deployment configuration.

---

# 13. Project Defense

## Why This Architecture?

Because the project is an MVP. Static frontend plus Express API is simple, fast to deploy, and easy to understand. It separates UI from backend data/security logic while keeping development manageable.

## Why MongoDB?

Student leads, teacher applications, demos, and contacts have flexible document-like data. MongoDB with Mongoose makes it fast to model and iterate.

## Why JWT?

JWT works well when frontend and backend are deployed separately. The backend does not need server-side session storage, and roles can be included in token payload.

## Why Express?

Express is lightweight, widely used, and ideal for REST APIs. Middleware support makes auth, CORS, JSON parsing, and rate limiting straightforward.

## Why Razorpay?

The business is India-focused and Razorpay supports INR payments, checkout UI, orders, and signature verification.

## Why Node?

Node lets the whole project use JavaScript on both frontend and backend. It is strong for I/O-heavy apps like APIs, database calls, payments, and emails.

---

# 14. Rebuild Roadmap: Class Orbit From Zero

1. Create project folders: `frontend/` and `backend/`.
2. Build static pages: home, about, student, teacher, contact, login, register.
3. Add shared CSS variables, navbar, footer, responsive layout.
4. Add form JavaScript for reading inputs and validation.
5. Initialize backend with `npm init`.
6. Install Express, Mongoose, dotenv, cors, helmet, bcryptjs, jsonwebtoken, nodemailer, razorpay, express-rate-limit.
7. Create `server.js`.
8. Add middleware: JSON parser, CORS, Helmet, rate limiter.
9. Create `.env.example`.
10. Create MongoDB Atlas cluster and `MONGO_URI`.
11. Create `config/db.js`.
12. Create Mongoose models: User, Student, Teacher, Demo, Contact, Payment.
13. Build auth controller: register, login, session.
14. Add bcrypt hashing.
15. Add JWT signing and verification middleware.
16. Build student/teacher/demo/contact routes.
17. Connect frontend forms using `fetch`.
18. Build dashboards.
19. Protect dashboard pages on frontend.
20. Protect admin APIs on backend.
21. Build admin table rendering and backend sync.
22. Add password reset tokens and Nodemailer.
23. Add email templates.
24. Add Razorpay order creation.
25. Add Razorpay checkout frontend.
26. Add signature verification backend.
27. Add payment success emails.
28. Add CORS production origins.
29. Deploy backend to Render.
30. Deploy frontend to Netlify.
31. Test all flows end to end.
32. Write README, setup guide, and interview notes.

---

# 15. Revision Material

## Cheat Sheet: Frontend

```text
HTML = structure
CSS = design
JavaScript = behavior
DOM = HTML controlled by JS
fetch = browser API call
localStorage = persistent browser storage
sessionStorage = tab-only browser storage
```

## Cheat Sheet: Backend

```text
Node.js = JS runtime
Express = API framework
Middleware = function before route
Mongoose = MongoDB modeling
JWT = signed login token
bcrypt = password hashing
Nodemailer = email sending
Razorpay = payment gateway
```

## Auth Mind Map

```text
Auth
  |
  +-- Register
  |     +-- validate
  |     +-- hash password
  |     +-- save user
  |     +-- sign JWT
  |
  +-- Login
  |     +-- find user
  |     +-- compare password
  |     +-- sign JWT
  |
  +-- Protect
        +-- read Bearer token
        +-- verify token
        +-- check role
```

## Payment Mind Map

```text
Payment
  |
  +-- Plan selected
  +-- Backend validates amount
  +-- Razorpay order
  +-- Pending payment saved
  +-- Checkout opens
  +-- Signature returned
  +-- Backend verifies
  +-- Payment success
```

## Database Mind Map

```text
MongoDB
  |
  +-- User: login identity
  +-- Student: student profile/lead
  +-- Teacher: teacher application
  +-- Demo: demo request
  +-- Contact: inquiry
  +-- Payment: order/payment record
  +-- Admin: legacy separate admin model
```

## Common Mistakes

- Trusting frontend validation only.
- Forgetting `Authorization: Bearer <token>`.
- Missing `JWT_SECRET`.
- CORS origin mismatch.
- Wrong Render root directory.
- Razorpay amount mismatch.
- Storing plain passwords.
- Not checking payment signature.
- Forgetting to URL-encode MongoDB password.
- Confusing `server.js` active routes with older route files.

## Formula Sheets

JWT:

```js
jwt.sign({ id, role }, JWT_SECRET, { expiresIn: "7d" })
jwt.verify(token, JWT_SECRET)
```

bcrypt:

```js
hash = await bcrypt.hash(password, 10)
ok = await bcrypt.compare(password, hash)
```

fetch POST:

```js
fetch(API + "/path", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(data)
})
```

Protected fetch:

```js
fetch(API + "/api/admin/students", {
  headers: { Authorization: "Bearer " + token }
})
```

Mongoose save:

```js
const doc = new Model(req.body)
await doc.save()
```

---

# 16. Job Readiness

## Current Skill Level From This Project

This project shows strong beginner-to-intermediate full-stack ability. You can claim experience with:

- Building multi-page frontend UI.
- Handling forms and validation.
- Calling APIs with fetch.
- Creating Express routes.
- Designing Mongoose models.
- Implementing JWT auth.
- Hashing passwords.
- Protecting admin routes.
- Integrating payments.
- Sending emails.
- Deploying a full-stack app.

## Gaps That Still Exist

To become more job-ready, improve:

- React or Next.js frontend skills.
- Component-based architecture.
- API testing with Jest/Supertest.
- Frontend testing with Playwright.
- TypeScript.
- Stronger validation with Zod/Joi.
- Better error handling structure.
- Cleaner route/controller/service separation.
- MongoDB indexing and relationships.
- Webhooks for payments.
- Production logging and monitoring.
- CI/CD basics.

## What To Learn Next

1. JavaScript deeply: closures, promises, async, modules, array methods.
2. React: components, props, state, hooks, routing.
3. TypeScript basics.
4. Express architecture: routes, controllers, services, validators.
5. MongoDB advanced: indexes, aggregation, references.
6. Testing: unit, integration, end-to-end.
7. Deployment: Render, Netlify, Docker basics.
8. Security: OWASP Top 10, XSS, CSRF, rate limiting, validation.

## Roadmap After MCA

0-2 months:

- Strengthen JavaScript, Node, Express, MongoDB.
- Rebuild Class Orbit cleanly with modular backend.

2-4 months:

- Learn React and build a React version of Class Orbit admin dashboard.

4-6 months:

- Add TypeScript, tests, payment webhooks, file uploads, notifications.

6-9 months:

- Build 2 more production-style projects.
- Prepare DSA basics and interview stories.

## Projects To Build Next

- Learning Management System with courses, attendance, assignments.
- Appointment booking system with calendar and payments.
- CRM for coaching centers.
- Expense tracker with analytics.
- Job portal with admin moderation.
- Real-time chat app with Socket.IO.

## Expected Interview Level

With this project understood properly, you can target:

- Frontend intern/junior roles.
- Backend intern/junior roles.
- MERN stack fresher roles.
- Full-stack developer trainee roles.

You should be ready to answer project architecture, API, database, auth, payment, and deployment questions.

## Expected Package Range

This depends heavily on city, college, communication, DSA, internships, and interview performance. For a fresher in India with this level of project:

- Basic fresher/trainee: around 2.5-4 LPA.
- Strong project explanation plus good JS/React/Node: around 4-7 LPA.
- Strong DSA, TypeScript, testing, deployment, and polished portfolio: 7 LPA+ is possible.

Do not present the package as guaranteed. Present your project confidently and keep improving fundamentals.

## Final Project Pitch

"Class Orbit is a real-world full-stack education platform. I built a static responsive frontend with JavaScript-driven forms and dashboards, an Express/MongoDB backend with Mongoose models, JWT authentication, role-based admin protection, Razorpay payment verification, Nodemailer email workflows, and deployment-ready environment configuration. The project taught me how frontend, backend, database, authentication, security, payments, and deployment connect in a production-style application."


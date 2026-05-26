# Era of Education Platform

A full-stack education management platform built with Node.js, Express.js, MongoDB, and vanilla HTML/CSS/JavaScript.

The platform provides secure role-based access for students, teachers, and administrators with authentication, dashboard management, payment integration, and administrative controls.

---

## Features

### Authentication & Security

* JWT-based authentication
* Role-based authorization
* Protected admin APIs
* Password reset workflow
* Secure route middleware
* Helmet security headers
* API rate limiting
* Environment-based configuration

---

### Student Features

* Student registration and login
* Dashboard access
* Profile management
* Demo booking
* Course enrollment workflow

---

### Teacher Features

* Teacher registration
* Teacher dashboard
* Subject application workflow
* Approval process

---

### Admin Features

* Secure admin dashboard
* Student management
* Teacher management
* Demo request management
* Payment management
* Statistics overview

---

### Payment System

* Razorpay integration
* Secure order creation
* Server-side payment validation
* Payment verification workflow

---

### Communication System

* Contact form
* Newsletter subscription
* Email notifications
* Password reset emails

---

## Tech Stack

### Frontend

* HTML5
* CSS3
* JavaScript

### Backend

* Node.js
* Express.js

### Database

* MongoDB
* Mongoose

### Authentication

* JWT
* bcrypt

### Payments

* Razorpay

### Email Service

* Nodemailer

### Security

* Helmet
* Express Rate Limit

---

## Project Structure

```bash
output_site/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── payment/
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── images/
│   ├── index.html
│   ├── login.html
│   ├── register.html
│   ├── student-dashboard.html
│   ├── teacher-dashboard.html
│   └── admin.html
│
├── README.md
└── SETUP.md
```

---

## Architecture Flow

```text
User
↓
Frontend
↓
Express API
↓
Authentication Middleware
↓
MongoDB Database
↓
Payment + Email Services
↓
Admin Dashboard
```

---

## Installation

Clone repository:

```bash
git clone YOUR_REPOSITORY_URL
```

Go into project:

```bash
cd output_site
```

Install backend dependencies:

```bash
cd backend
npm install
```

Create environment variables:

```bash
cp .env.example .env
```

Start backend:

```bash
npm run dev
```

Run frontend using Live Server or local server.

---

## Environment Variables

Required variables:

```env
PORT=
MONGO_URI=
JWT_SECRET=

EMAIL_USER=
EMAIL_APP_PASS=

RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=

FRONTEND_URL=
CORS_ORIGINS=
```

---

## API Overview

Authentication:

```text
POST /api/auth/register
POST /api/auth/login
POST /api/auth/forgot-password
POST /api/auth/change-password
```

Student:

```text
POST /api/student/register
```

Teacher:

```text
POST /api/teacher/register
```

Demo:

```text
POST /api/demo/book
```

Contact:

```text
POST /api/contact/send
```

Payment:

```text
POST /api/payment/create-order
POST /api/payment/verify
```

Admin:

```text
GET /api/admin/students
GET /api/admin/teachers
GET /api/admin/payments
```

---

## Security Measures

* JWT Authentication
* Password hashing
* Role-based access control
* Secure payment verification
* Helmet protection
* Rate limiting
* Protected admin routes

---

## Future Improvements

* Course management module
* Attendance system
* Notifications
* Live classes
* Chat system
* Analytics dashboard
* Mobile application

---

## License

This project is intended for educational and portfolio purposes.

---

## Author

Developed by Nikhil

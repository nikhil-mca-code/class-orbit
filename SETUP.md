# Setup Guide

This document explains how to run Class Orbit, a premium education platform, locally.

---

## Prerequisites

Install:

* Node.js (v18+ recommended)
* MongoDB
* Git
* VS Code

---

## Step 1: Clone Repository

```bash
git clone YOUR_REPOSITORY_URL
```

Move into project:

```bash
cd output_site
```

---

## Step 2: Install Backend Dependencies

Move into backend:

```bash
cd backend
```

Install packages:

```bash
npm install
```

---

## Step 3: Configure Environment Variables

Create:

```text
backend/.env
```

Add:

```env
PORT=5000

MONGO_URI=your_mongodb_connection

JWT_SECRET=your_secret_key

EMAIL_USER=your_email

EMAIL_APP_PASS=your_email_app_password

RAZORPAY_KEY_ID=your_key

RAZORPAY_KEY_SECRET=your_secret

FRONTEND_URL=http://localhost:5500

CORS_ORIGINS=http://localhost:5500
```

---

## Step 4: Start Backend

```bash
npm run dev
```

Expected output:

```bash
Server running on port 5000
MongoDB Connected
```

---

## Step 5: Run Frontend

Open:

```text
frontend/
```

Start with Live Server in VS Code:

Right click:

```text
index.html
↓
Open with Live Server
```

Or use:

```bash
npx serve .
```

---

## Step 6: Test Application

Check:

* Registration
* Login
* Dashboard access
* Contact form
* Demo booking
* Password reset
* Payment workflow
* Admin dashboard

---

## Troubleshooting

### MongoDB connection error

Verify:

```env
MONGO_URI
```

---

### Email not working

Verify:

```env
EMAIL_USER
EMAIL_APP_PASS
```

For Gmail:

* Enable Two Factor Authentication
* Generate App Password

---

### Payment not working

Verify:

```env
RAZORPAY_KEY_ID
RAZORPAY_KEY_SECRET
```

Use Razorpay Test Mode during development.

---

### Port already in use

Change:

```env
PORT=5001
```

---

## Production Deployment

Frontend:

* Netlify
* Vercel

Backend:

* Render
* Railway

Database:

* MongoDB Atlas

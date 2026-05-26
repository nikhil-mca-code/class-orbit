# Era of Education — Complete Setup Guide
## Step 1: MongoDB Setup

### Option A: Local MongoDB (Computer pe)
1. Download MongoDB: https://www.mongodb.com/try/download/community
2. Install karke start karo
3. .env mein yeh rakho: `MONGO_URI=mongodb://127.0.0.1:27017/eraeducation`

### Option B: MongoDB Atlas (Cloud — Free)
1. https://cloud.mongodb.com pe jaao
2. Free account banao → New Project → Build Database → Free Tier
3. Username/Password set karo
4. "Connect" → "Compass" → Connection string copy karo
5. .env mein daalo: `MONGO_URI=mongodb+srv://user:pass@cluster.xxxxx.mongodb.net/eraeducation`

---

## Step 2: Gmail Email Setup

1. Gmail account pe jaao (eraofedu@gmail.com)
2. Google Account → Security → 2-Step Verification → ON karo
3. Phir: Security → App Passwords
4. "Select App" = Mail, "Select Device" = Windows/Mac
5. Generate karo → 16 character password milega
6. .env mein daalo:
   ```
   EMAIL_USER=eraofedu@gmail.com
   EMAIL_APP_PASS=abcd efgh ijkl mnop
   ADMIN_EMAIL=eraofedu@gmail.com
   ```

---

## Step 3: Razorpay Payment Setup

1. https://razorpay.com pe account banao
2. Dashboard → Settings → API Keys → Generate Test Key
3. Key ID aur Secret copy karo
4. .env mein daalo:
   ```
   RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxxxxxx
   RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxxxxxx
   ```
5. payment.html mein bhi key daalo:
   `key: 'rzp_test_YOUR_KEY_ID_HERE'`  →  apni actual key

---

## Step 4: Backend Start Karo

```bash
cd backend
npm install
node server.js
```

Yeh dikhega:
```
✅ Server Running on http://localhost:5000
✅ MongoDB Connected: localhost
📊 Admin Panel: http://localhost:5000/admin.html
```

---

## Step 5: Website Kholna

Browser mein kholna hai:
- `http://localhost:5000` — Home page
- `http://localhost:5000/admin.html` — Admin Dashboard
- `http://localhost:5000/login.html` — Login

---

## Data Flow — Form Submit Hone Pe:

```
User Form Submit
      ↓
Frontend (HTML) → API Call → Backend (Node.js)
      ↓
MongoDB mein Save (Student/Teacher/Demo/Contact)
      ↓
Email aapko aayegi (Gmail via Nodemailer)
      ↓
Admin Dashboard mein dikhega (Live Data)
```

---

## Demo Login Credentials:
| Role    | Email                | Password |
|---------|----------------------|----------|
| Admin   | admin@gmail.com      | 123      |
| Student | student@gmail.com    | 123      |
| Teacher | teacher@gmail.com    | 123      |

---

## Koi Problem Aaye:
📞 Call/WhatsApp: +91 72890 53560
✉ Email: eraofedu@gmail.com

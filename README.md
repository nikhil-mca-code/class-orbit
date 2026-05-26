# Era of Education — Fixed Website

## What Was Fixed

### Frontend Bugs Fixed:
1. **Broken Google Font link** — `<!<link>` typo fixed, Poppins now loads correctly
2. **No hamburger menu** — Added responsive hamburger for all pages (mobile friendly)
3. **"forgot password.html" with space** — Renamed to `forgot-password.html` (works on all servers)
4. **"book-demo.html" missing** — Created the page (was only `demo.html` before)
5. **"student dashboard.html" / "teacher dashboard.html" with spaces** — Renamed to `student-dashboard.html` / `teacher-dashboard.html`
6. **Footer links not clickable** — All Quick Links, Services, Legal now have real `<a>` tags
7. **Social icons not linked** — Facebook, Instagram, YouTube, WhatsApp now all properly linked
8. **Chatbot "Guru Ji" missing** — Built from scratch, works on every page, speaks Hindi/English
9. **Broken `fetch()` calls** — Removed fetch to `localhost:3000` that caused visible errors
10. **Payment page had no header/footer** — Fully styled with plan selection and fallback demo mode
11. **Login page missing header/footer** — Added proper navbar and footer
12. **`ceo.jpg` missing** — Added fallback to online image
13. **CSS `<link>` tags placed inside `<section>`** — Moved to `<head>` where they belong
14. **Duplicate FontAwesome CDN imports** — Cleaned up
15. **Register page missing header/footer** — Added
16. **Footer had no real links** — All footer columns now properly linked

### New Pages Created:
- `book-demo.html` — Free demo class booking form
- `forgot-password.html` — Forgot password page
- `student-dashboard.html` — Student dashboard (after login)
- `teacher-dashboard.html` — Teacher dashboard (after login)
- `admin.html` — Admin dashboard with sidebar
- `terms.html` — Terms & Conditions
- `privacy.html` — Privacy Policy

### New Files:
- `shared.css` — Common CSS for navbar, footer, chatbot, hamburger, WhatsApp button
- `components.js` — Reusable chatbot and newsletter logic

## Demo Login Credentials
| Role | Email | Password |
|------|-------|----------|
| Admin | admin@gmail.com | 123 |
| Student | student@gmail.com | 123 |
| Teacher | teacher@gmail.com | 123 |

## How to Run Frontend
Just open `frontend/index.html` in any browser — no server needed for frontend.

## How to Run Backend (Node.js)
```bash
cd backend
npm install
# Edit .env with your MongoDB URI and Razorpay keys
node server.js
```

## Payment Setup
1. Get your Razorpay key from https://razorpay.com
2. Replace `rzp_test_YOUR_KEY_HERE` in `payment.html` with your actual key
3. Make sure backend is running on port 5000

## Contact
📞 +91 72890 53560
✉ eraofedu@gmail.com
🌐 Taramandal Road, Gorakhpur, UP

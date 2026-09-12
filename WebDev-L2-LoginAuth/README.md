# Task 4: Login Authentication System — VaultAuth

**Track:** Web Development & Designing  
**Level:** Level 2  
**Project Name:** `WebDev-L2-LoginAuth`  
**Internship:** Oasis Infobyte SIP

---

## 🌟 Overview
VaultAuth is a client-side authentication and session management system utilizing the **Web Crypto API (SHA-256)** for cryptographic password digest hashing, input complexity validation, duplicate user prevention, unauthorized route interception, and a protected dashboard member portal.

---

## ✨ Features Checklist
- [x] **Registration Module:** Inputs for Full Name, Username, Email, Password, and Password Confirmation with live strength feedback.
- [x] **Password Validation:** Enforces minimum 8 characters, at least 1 number, and uppercase character checks with live visual checkmarks and strength meter.
- [x] **Duplicate User & Email Prevention:** Verifies whether a username or email is already registered before creating new records.
- [x] **Cryptographic Password Storage:** Passwords are never saved in plain text; instead, they are digested into SHA-256 hex strings using `crypto.subtle.digest('SHA-256', ...)`.
- [x] **Login Module:** Supports sign-in with either username or email and verified hash comparison.
- [x] **Security-Conscious Error Handling:** Displays generic `"Invalid username/email or password"` upon authentication failure to prevent credential/account harvesting.
- [x] **Protected Member Dashboard (`dashboard.html`):** Route-guarded page that verifies active session tokens and automatically redirects unauthorized direct URL attempts back to `index.html`.
- [x] **Session Persistence & Invalidation:** Maintains active session status in storage, displaying user metrics, and cleanly purges session tokens on Logout.
- [x] **Full Client-side Validation:** Blocks empty submissions, checks matching passwords, and handles input edge-cases.

---

## 🔒 Security Architecture
```
User Enters Plaintext Password
              │
              ▼
Web Crypto API (SubtleCrypto: SHA-256)
              │
              ▼
Hex Digest Hash String (e.g. 5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8)
              │
              ▼
Persisted in Local Storage (Plaintext is never stored or logged)
```

---

## 🚀 How to Run Locally
1. Navigate to directory:
   ```bash
   cd OIBSIP/WebDev-L2-LoginAuth
   ```
2. Open `index.html` in any browser.
3. Test registering a user account, then sign in to access the protected dashboard (`dashboard.html`). Test logging out and attempting to access `dashboard.html` directly to verify route protection.

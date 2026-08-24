<div align="center">

# 🏥 HMS — Hospital Management System
### *A full-stack doctor appointment booking platform with separate patient & admin experiences*

<img width="1507" height="632" alt="Payment" src="https://github.com/user-attachments/assets/bdbe3e14-eac7-4b58-a51c-cf2bdc7cfc18" />
<img width="1600" height="595" alt="Book Appointment" src="https://github.com/user-attachments/assets/9034cec6-cefa-40ef-81d0-0066ffce88b0" />
<img width="1600" height="624" alt="Add doctors" src="https://github.com/user-attachments/assets/71b6dfb4-8ff3-412c-b2ac-6cb4009a2bca" />
<img width="1600" height="535" alt="Appointments" src="https://github.com/user-attachments/assets/c2d6896c-5ec9-4652-a2c9-77276e0a5c95" />
<img width="1600" height="574" alt="Admin Dashboard" src="https://github.com/user-attachments/assets/4f1ebd47-e118-49fb-a552-ee7e57607157" />
<img width="1600" height="612" alt="create account" src="https://github.com/user-attachments/assets/8a5b300f-1f83-429a-865b-29310fb1b3f8" />
<img width="1536" height="626" alt="Login" src="https://github.com/user-attachments/assets/b155d2fe-4a74-4d39-acfb-fb7a6134e302" />
<img width="1600" height="624" alt="Homescreen" src="https://github.com/user-attachments/assets/c1f40464-3a60-4d60-ae16-afd4587ea3a8" />


**Patients book. Doctors manage. Admins oversee. One MongoDB backend powers all three.**

</div>

---

## 📌 Overview

HMS is a **three-application MERN system** built around a single shared backend:

- 🧑‍⚕️ **Patient-facing app** — browse doctors by specialty, book/cancel appointments, pay online
- 🛠️ **Admin panel** — manage doctors, view/cancel all appointments, dashboard analytics
- ⚙️ **Backend API** — auth, appointments, payments, and image uploads, all behind JWT-protected routes

> Think of it as three independent React apps talking to one Express + MongoDB core — a realistic split for how hospital software is actually structured in production (separate portals, shared data layer).

---

## 🧩 Tech Stack — Backend-First Breakdown

The backend is the heart of this system — it owns **all business logic**, while both frontends are largely thin, presentation-focused clients.

### ⚙️ Backend (Core Logic Layer)

| Tool | Role | Why It's Used |
|---|---|---|
| **Node.js + Express** | API server | Lightweight, fast to iterate on, handles all three route groups (`/api/user`, `/api/doctor`, `/api/admin`) |
| **MongoDB Atlas + Mongoose** | Database | Flexible schema fits the appointment/doctor/user data model; free M0 tier is enough for a full deployment |
| **JWT (`jsonwebtoken`)** | Authentication | Three separate token scopes — patient, doctor, admin — each middleware-gated |
| **bcrypt** | Password hashing | Patient & doctor passwords never stored in plaintext |
| **Multer + Cloudinary** | Image handling | Doctor profile photos uploaded via Multer, stored & served from Cloudinary (no local file storage needed) |
| **Razorpay** | Payments | Online appointment payment + server-side signature verification |
| **validator** | Input sanitization | Email/password format validation on signup |
| **dotenv** | Config management | Keeps all secrets (Mongo URI, JWT secret, API keys) out of source code |

### 💻 Frontend (Patient App) & 🛠️ Admin Panel

| Tool | Role |
|---|---|
| **React 18 + Vite** | Fast dev server, component-based UI for both apps |
| **React Router v6** | Client-side routing (doctor listing, booking flow, profile, admin dashboard) |
| **Tailwind CSS** | Utility-first styling, consistent design system across both apps |
| **Axios** | All REST communication with the backend |
| **React Toastify** | Success/error notifications on booking, login, cancellation |
| **React Icons / Lucide React** | Icon sets used across UI |

---

## 🏗️ Architecture

```
┌─────────────────┐     ┌─────────────────┐
│  frontend/       │     │  admin/          │
│  (Patient App)   │     │  (Admin Panel)   │
│  React + Vite    │     │  React + Vite    │
└────────┬─────────┘     └────────┬─────────┘
         │                        │
         │      REST API (Axios)   │
         └───────────┬────────────┘
                      ▼
         ┌────────────────────────┐
         │      backend/           │
         │   Node.js + Express     │
         │                          │
         │  /api/user   (patient)  │
         │  /api/doctor (doctor)   │
         │  /api/admin  (admin)    │
         └────────────┬────────────┘
                      │
        ┌─────────────┼─────────────┐
        ▼             ▼             ▼
  ┌───────────┐ ┌───────────┐ ┌───────────┐
  │ MongoDB   │ │ Cloudinary│ │ Razorpay  │
  │ Atlas     │ │ (images)  │ │ (payments)│
  └───────────┘ └───────────┘ └───────────┘
```

---

## ✨ Core Features

| Feature | Details |
|---|---|
| 🔐 **Multi-role Auth** | Separate JWT-protected flows for patients, doctors, and admin |
| 📅 **Appointment Booking** | Real-time slot availability checked against `slots_booked` per doctor |
| 💳 **Online Payments** | Razorpay integration with server-side payment verification |
| 🖼️ **Image Uploads** | Doctor profile photos via Multer → Cloudinary |
| 📊 **Admin Dashboard** | View/manage all doctors and appointments in one place |
| ❌ **Cancellations** | Patients and admin can both cancel; slot is released back to availability |
| ✅ **Appointment Completion** | Doctor marks appointments complete, tracked via `isCompleted` flag |
| ⏰ **Automated Reminders** | Patients get emailed 24h and 1h before their appointment — no manual follow-up |
| 🧠 **No-Show Risk Prediction** | Each upcoming appointment gets a 🟢/🟡/🔴 risk badge in the admin panel, computed from booking patterns |

---

## ⏰ Reminders & No-Show Prediction

This module turns the booking system from a passive CRUD app into something that proactively manages appointment reliability — a real, everyday pain point for clinics.

### How It Works

| Stage | What Happens |
|---|---|
| **Reminder Job** | A `node-cron` job runs every 15 minutes, finds appointments 24h or 1h out, and emails the patient via Nodemailer |
| **Duplicate Prevention** | `reminder24hSent` / `reminder1hSent` flags on the appointment ensure each reminder only fires once |
| **Risk Scoring** | A rule-based JS function scores each upcoming appointment using lead time, payment status, and the patient's past no-show count |
| **Admin Visibility** | Risk badges (🟢 Low / 🟡 Medium / 🔴 High) render next to each appointment in `AllAppointments.jsx`, so staff can call high-risk patients or double-book that slot |

### Tech Stack for This Module

| Tool | Role | Cost |
|---|---|---|
| **node-cron** | Schedules the reminder + scoring jobs inside the existing Express server | Free & open source |
| **Nodemailer + Brevo SMTP** | Sends reminder emails (300/day free tier) | Free |
| **Plain JavaScript rule engine** | Computes no-show risk — no external ML service needed | Free |
| **MongoDB (existing)** | Just a few new fields on `appointmentModel` — no new database | Free (already provisioned) |

### Schema Additions

```js
// Reminder tracking
reminder24hSent: { type: Boolean, default: false },
reminder1hSent:  { type: Boolean, default: false },

// No-show prediction signals
bookedAt:       { type: Number },
leadTimeHours:  { type: Number },
noShow:         { type: Boolean, default: false },
riskLevel:      { type: String, default: "unknown" }
```

### Risk Scoring Logic

```js
function calculateNoShowRisk(appointment, patientHistory) {
  let score = 0;

  if (appointment.leadTimeHours < 3) score += 30;
  if (!appointment.payment) score += 25;
  if (patientHistory.pastNoShowCount >= 2) score += 20;
  if (isMondayMorning(appointment.slotDate)) score += 15;

  if (score >= 50) return "high";
  if (score >= 25) return "medium";
  return "low";
}
```

> Everything here runs inside the existing Node/Express backend — no separate microservice, no paid ML API, no new hosting required.

---

## 📁 Project Structure

```
hms-fullstack-main/
├── backend/
│   ├── config/          # MongoDB & Cloudinary connection setup
│   ├── controllers/      # Business logic for user/doctor/admin routes
│   ├── middleware/        # JWT auth guards + Multer config
│   ├── model/            # Mongoose schemas (User, Doctor, Appointment)
│   ├── routes/            # Express routers
│   ├── server.js          # App entry point
│   └── .env.example
│
├── admin/
│   ├── src/
│   │   ├── components/    # Navbar, Sidebar, shared UI
│   │   ├── context/        # Global state (auth token, doctor/appointment data)
│   │   └── pages/          # Dashboard, All Appointments, Add Doctor, etc.
│   └── .env.example
│
└── frontend/
    ├── src/
    │   ├── components/     # Header, DoctorCard, Banner, etc.
    │   ├── context/         # Global state (auth, doctors list, user profile)
    │   └── pages/           # Home, Doctors, Appointment, MyProfile, etc.
    └── .env.example
```

---

## 🚀 Getting Started

### 1️⃣ Backend Setup

```bash
cd backend
npm install
cp .env.example .env   # fill in your own values
npm run server
```

**Required environment variables:**
```env
PORT=4000
MONGODB_URI=your_mongodb_atlas_connection_string
CLOUDINARY_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_SECRET_KEY=your_api_secret
ADMIN_EMAIL=your_admin_login_email
ADMIN_PASSWORD=your_admin_login_password
JWT_SECRET=any_long_random_string
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
CURRENCY=INR
```

### 2️⃣ Admin Panel Setup

```bash
cd admin
npm install
cp .env.example .env   # set VITE_BACKEND_URL
npm run dev
```

### 3️⃣ Patient Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env   # set VITE_BACKEND_URL + VITE_RAZORPAY_KEY_ID
npm run dev
```

> All three apps run independently on separate ports (`4000` for backend, Vite defaults for the other two) — run each in its own terminal.

---

## 🔑 Default Admin Access

Admin login isn't a signup flow — it's hardcoded via environment variables (`ADMIN_EMAIL` / `ADMIN_PASSWORD`), so whatever you set in `backend/.env` is your admin login for the admin panel.

---

## 💸 Cost to Run

Every service used has a genuinely free tier sufficient for full local development and even a small production deployment:

| Service | Free Tier |
|---|---|
| MongoDB Atlas | 512MB (M0 cluster) |
| Cloudinary | 25GB storage/bandwidth per month |
| Razorpay | Free test mode, pay-per-transaction only in live mode |
| Render / Railway (hosting) | Free tier available for all three apps |

---

<div align="center">

### 🛠️ Built with the MERN stack — MongoDB, Express, React, Node.js

</div>

<div align="center">

<img src="./Images/tech.png" alt="eDoc Tech Stack" width="100%"/>

# eDoc Healthcare Platform

**A modern, full-stack medical channelling and consultation management system**

*Bridging patients, specialist doctors, and hospital administrators through a seamless digital experience*

[![Django](https://img.shields.io/badge/Django-3.1.6-092E20?style=flat-square&logo=django&logoColor=white)](https://www.djangoproject.com/)
[![DRF](https://img.shields.io/badge/Django%20REST%20Framework-3.12-red?style=flat-square)](https://www.django-rest-framework.org/)
[![React](https://img.shields.io/badge/React-17.0-61DAFB?style=flat-square&logo=react&logoColor=black)](https://reactjs.org/)
[![Redux](https://img.shields.io/badge/Redux-4.0-764ABC?style=flat-square&logo=redux&logoColor=white)](https://redux.js.org/)
[![Python](https://img.shields.io/badge/Python-3.8+-3776AB?style=flat-square&logo=python&logoColor=white)](https://www.python.org/)
[![License](https://img.shields.io/badge/License-ISC-blue?style=flat-square)](LICENSE)

[Features](#-features) · [Architecture](#-architecture) · [Tech Stack](#-tech-stack) · [Quick Start](#-quick-start) · [API Reference](#-api-reference) · [Screenshots](#-screenshots)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Architecture](#-architecture)
- [Data Model](#-data-model)
- [Auth Flow](#-authentication-flow)
- [Tech Stack](#-tech-stack)
- [Quick Start](#-quick-start)
- [API Reference](#-api-reference)
- [Project Structure](#-project-structure)
- [Configuration](#-configuration)
- [Deployment](#-deployment)
- [Contributing](#-contributing)

---

## 🏥 Overview

eDoc is a production-ready healthcare channelling platform that digitises the end-to-end appointment lifecycle — from a patient discovering a specialist to the doctor writing a post-consultation prescription. It is built as a Django + React monolith: Django serves the bundled React SPA at `localhost:8000` and exposes a RESTful API on the same origin, eliminating CORS complexity in development.

The system supports three distinct user roles — **Patients**, **Doctors**, and **Hospital Staff** — each with a dedicated, purpose-built portal and permission scope.

https://github.com/user-attachments/assets/3c1502e9-6aac-496e-8613-0cc4af936df7
---

## ✨ Features

### 👤 Patient Portal
- Browse specialist doctors by specialisation, qualifications, and consultation fee
- Book appointments by selecting a doctor's available time slot
- View and manage upcoming appointments with one-click cancellation
- Full channelling history with status tracking (Pending / Completed / No-Show)
- Edit personal profile including NIC/Passport, nationality, and contact details

### 🩺 Doctor Portal
- Real-time overview of today's schedule and pending appointments
- Accept or reject appointment requests from patients
- Write and print digital prescriptions per consultation
- Record treatment plans (presenting complaint, investigation results, medical advice)
- Manage weekly work schedule with granular time-slot control
- Earnings dashboard with date-range filtering and bar chart analytics

### 🏢 Staff Portal
- Platform-wide statistics dashboard (total patients, doctors, appointments, daily count)
- Full CRUD management for doctor, patient, and staff accounts
- Appointment oversight with search and filter across all records
- Register new doctors and staff accounts directly from the portal

### 🔧 Platform-Wide
- Token-based authentication with automatic session persistence via `localStorage`
- Role-specific login endpoints with flag validation — a patient token cannot access the doctor portal
- Skeleton loading states and smooth transitions throughout
- Responsive layout across desktop and tablet viewports
- Print-ready prescription preview via `react-to-print`

---

## 🏗 Architecture

<img src="./Images/architecture.png" alt="eDoc System Architecture" width="100%"/>

The platform follows a **monolithic full-stack** architecture:

- **Django** serves the single-page application shell at the root URL and handles all API routes under `/api/`
- **React** runs entirely client-side after the initial page load, routing via `HashRouter`
- **Redux** manages global state with `redux-thunk` for async API calls via Axios
- **Knox** handles token lifecycle — tokens are issued on login, stored in `localStorage`, and invalidated on logout
- **WhiteNoise** serves static assets (the bundled JS/CSS) directly from Django in both development and production

```
Browser (React SPA)
    │
    ├── Patient Portal  /home/:page
    ├── Doctor Portal   /doctor_home/:page
    └── Staff Portal    /staff_home/:page
            │
            │  Axios + Knox Authorization header
            ▼
Django REST Framework API
    │
    ├── /api/auth/*         (accounts app — knox)
    ├── /api/appointment/*  (reservations app — router)
    ├── /api/doctor/*
    ├── /api/prescription/*
    ├── /api/treatmentPlan/*
    └── /api/stats/
            │
            ▼
    SQLite (dev) / PostgreSQL (prod)
```

---

## 🗄 Data Model

<img src="./Images/relationship.png" alt="eDoc Entity Relationship Diagram" width="100%"/>

The schema centres on a custom `User` model with three boolean role flags. Each role extends `User` via a `OneToOneField` profile:

| Model | Primary Key | Key Relations |
|---|---|---|
| `User` | `id` (auto) | Base auth model — `is_patient`, `is_doctor`, `is_hospStaff` |
| `Patient` | `user` (1:1 → User) | Extended profile fields, image upload |
| `Doctor` | `user` (1:1 → User) | Specialization, Qualifications, chargePerSession |
| `Staff` | `user` (1:1 → User) | Designation, admin access |
| `Appointment` | `ReferenceID` (6-char) | FK → Patient, FK → Doctor |
| `TreatmentPlan` | `ReferenceID` (1:1 → Appointment) | Clinical notes per consultation |
| `Prescription` | `ID` (auto) | FK → Appointment, one row per drug |
| `WorkSchedule` | `ID` (auto) | FK → Doctor, day + time slot |

---

## 🔐 Authentication Flow

<img src="./Images/software%20flow.png" alt="eDoc Authentication Flow" width="100%"/>

eDoc uses **django-rest-knox** for stateless token authentication:

1. User submits credentials to a role-specific endpoint (`/api/auth/patient_login`, `/api/auth/doctor_login`, or `/api/auth/staff_login`)
2. Django validates credentials **and** checks the corresponding role flag (`is_patient`, `is_doctor`, `is_hospStaff`)
3. Knox generates a cryptographically secure token and returns it alongside the user object
4. The React frontend stores the token in `localStorage` and includes it as `Authorization: Token <token>` on every subsequent API request
5. On logout, Knox invalidates (destroys) the token server-side — it cannot be reused

---

## 🛠 Tech Stack

| Layer | Technology | Version |
|---|---|---|
| **Backend Framework** | Django | 3.1.6 |
| **REST API** | Django REST Framework | 3.12.2 |
| **Authentication** | django-rest-knox | 4.1.0 |
| **Frontend Framework** | React | 17.0.1 |
| **State Management** | Redux + redux-thunk | 4.0.5 |
| **HTTP Client** | Axios | 0.21.1 |
| **UI Components** | Material UI | 4.11.3 |
| **Data Tables** | mui-datatables | 3.7.6 |
| **Charts** | react-chartjs-2 | 2.11.1 |
| **Date Picker** | react-date-range | 1.1.3 |
| **Bundler** | Webpack | 5.25.0 |
| **Transpiler** | Babel | 7.13 |
| **Database (dev)** | SQLite | built-in |
| **Database (prod)** | PostgreSQL | via dj-database-url |
| **File Storage** | Local `/media/` or AWS S3 | django-storages |
| **Static Files** | WhiteNoise | 5.2.0 |
| **Phone Validation** | django-phonenumber-field | 5.0.0 |

---

## 🚀 Quick Start

### Prerequisites

- Python 3.8+
- Node.js 12+ (Node 17+ requires an extra flag — see step 5)
- npm 6+
- Git

### 1. Clone the repository

```bash
git clone https://github.com/MuhammadHamzaSajjad274/django-react-medical-booking.git
cd django-react-medical-booking
```

### 2. Set up Python environment

```bash
python -m venv venv

# macOS / Linux
source venv/bin/activate

# Windows
.\venv\Scripts\activate

pip install -r requirements.txt
```

### 3. Configure environment variables

```bash
cp .env.example .env
# Edit .env and set your SECRET_KEY (and optionally DATABASE_URL, AWS credentials)
```

### 4. Run database migrations

```bash
python manage.py migrate
```

### 5. Seed sample doctors (optional)

```bash
python manage.py seed_doctors
# Creates 6 specialist doctors across Cardiology, Neurology, Dermatology,
# Orthopaedics, Gynaecology, and General Medicine
# Password for all seeded doctors: Doctor@1234
```

### 6. Install frontend dependencies

```bash
npm install
```

### 7. Start both servers

Open **two terminal windows** and run one command in each:

**Terminal 1 — Django backend:**
```bash
python manage.py runserver
```

**Terminal 2 — React frontend watcher:**
```bash
# Node 12-16
npm run dev

# Node 17+ (Windows PowerShell)
$env:NODE_OPTIONS="--openssl-legacy-provider"
npm run dev

# Node 17+ (macOS / Linux)
NODE_OPTIONS=--openssl-legacy-provider npm run dev
```

### 8. Open the app

```
http://localhost:8000
```

> **Note:** Wait for Webpack to finish its first compilation before loading the browser. You'll see `webpack compiled successfully` in Terminal 2.

---

## 📡 API Reference

All endpoints are prefixed with `/api/`. Authenticated endpoints require the header:
```
Authorization: Token <your_token>
```

### Auth endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/auth/patient_register` | None | Register a new patient account |
| `POST` | `/api/auth/doctor_register` | None | Register a new doctor account |
| `POST` | `/api/auth/patient_login` | None | Patient login — returns Knox token |
| `POST` | `/api/auth/doctor_login` | None | Doctor login — returns Knox token |
| `POST` | `/api/auth/staff_login` | None | Staff login — returns Knox token |
| `GET` | `/api/auth/user` | ✅ | Get current authenticated user |
| `POST` | `/api/auth/logout` | ✅ | Invalidate current token |
| `POST` | `/api/auth/password/change` | ✅ | Change password |

### Resource endpoints

Each resource follows standard DRF router conventions (`GET /list`, `POST /list`, `GET /:id`, `PATCH /:id`, `DELETE /:id`).

| Resource | Authenticated | Public (NonAuth) |
|---|---|---|
| Patients | `/api/patient/` | `/api/patientNonAuth/` |
| Doctors | `/api/doctor/` | `/api/doctorNonAuth/` |
| Staff | `/api/staff/` | `/api/staffNonAuth/` |
| Appointments | `/api/appointment/` | `/api/appointmentNonAuth/` |
| Work Schedules | `/api/workSchedule/` | `/api/workScheduleNonAuth/` |
| Prescriptions | `/api/prescription/` | `/api/prescriptionNonAuth/` |
| Treatment Plans | `/api/treatmentPlan/` | `/api/treatmentPlanNonAuth/` |
| Platform Stats | `/api/stats/` | Public | Staff dashboard aggregate counts |

> The interactive API browser is available at `http://localhost:8000/api/` when `DEBUG=True`.

---

## 📁 Project Structure

```
django-react-medical-booking/
│
├── hospitalReservation/        # Django project settings & root URLs
│   ├── settings.py             # Environment-aware config (DB, S3, Knox)
│   ├── urls.py                 # Root URL dispatcher
│   └── wsgi.py
│
├── accounts/                   # Authentication app
│   ├── api.py                  # Register / Login / PasswordChange views
│   ├── serializers.py          # Role-aware register & login serializers
│   └── urls.py                 # /api/auth/* routes
│
├── reservations/               # Core data app
│   ├── models.py               # User, Patient, Doctor, Staff, Appointment,
│   │                           # WorkSchedule, TreatmentPlan, Prescription
│   ├── api.py                  # DRF ViewSets + PlatformStatsView
│   ├── serializers.py          # Model serializers
│   ├── urls.py                 # Router + /api/stats/
│   └── management/
│       └── commands/
│           └── seed_doctors.py # python manage.py seed_doctors
│
├── frontend/                   # React SPA app
│   ├── src/
│   │   ├── components/
│   │   │   ├── patientMode/    # Patient portal components
│   │   │   ├── doctorMode/     # Doctor portal components
│   │   │   ├── staffMode/      # Staff portal components
│   │   │   ├── guestUserMode/  # Homepage / landing
│   │   │   ├── accounts/       # Sign-in / Sign-up forms
│   │   │   ├── layout/         # Navbar, Alerts
│   │   │   └── design-system.css
│   │   ├── actions/            # Redux action creators (one file per resource)
│   │   ├── reducers/           # Redux reducers + combineReducers
│   │   └── store.js
│   ├── templates/frontend/
│   │   └── index.html          # Django template — React mount point
│   └── static/frontend/        # Webpack output (gitignored build artefacts)
│
├── images/                     # README assets
│   ├── architechture.png
│   ├── tech.png
│   ├── software flow.png
│   └── relationship.png
│
├── requirements.txt
├── package.json
├── webpack.config.js
├── manage.py
├── Procfile                    # Heroku process definition
└── .env.example
```

---

## ⚙ Configuration

All runtime configuration is driven by environment variables. Copy `.env.example` to `.env` and fill in the values:

```env
# Django
SECRET_KEY=your-secret-key-here
DEBUG=True

# Database (leave blank to use SQLite)
DATABASE_URL=postgres://USER:PASSWORD@HOST:PORT/DB_NAME

# AWS S3 (leave blank to use local /media/ folder)
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_STORAGE_BUCKET_NAME=
```

---

## 🌐 Deployment

### Heroku (one-click)

The repo ships with a `Procfile` and `runtime.txt` for Heroku:

```bash
heroku create your-app-name
heroku config:set SECRET_KEY=$(python -c "import secrets; print(secrets.token_urlsafe(50))")
heroku config:set DEBUG=False
heroku config:set DATABASE_URL=$(heroku config:get DATABASE_URL)
git push heroku main
heroku run python manage.py migrate
heroku run python manage.py seed_doctors
```

### Production checklist

- [ ] Set `DEBUG=False` in environment
- [ ] Set a strong, unique `SECRET_KEY`
- [ ] Switch to PostgreSQL via `DATABASE_URL`
- [ ] Configure `ALLOWED_HOSTS` with your domain
- [ ] Run `npm run build` (production Webpack bundle) before deploying
- [ ] Run `python manage.py collectstatic`
- [ ] Configure AWS S3 for media file storage
- [ ] Enable HTTPS and set `SECURE_SSL_REDIRECT=True`
- [ ] Review `NonAuth` viewsets and restrict open write access as needed

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome.

1. Fork the repository
2. Create a feature branch — `git checkout -b feature/your-feature`
3. Commit your changes — `git commit -m "feat: add your feature"`
4. Push to the branch — `git push origin feature/your-feature`
5. Open a Pull Request

---

## 🔒 Security Notice

This project is configured for **development use**. Before any production deployment:

- Never commit `.env` files or secret keys to version control
- Set `DEBUG = False` in production
- Restrict open `NonAuth` API endpoints to read-only where applicable
- Use a production-grade database (PostgreSQL)
- Serve over HTTPS only

---

<div align="center">

Built with ❤ using Django & React

</div>

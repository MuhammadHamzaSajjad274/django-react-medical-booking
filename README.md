# eDoc Healthcare Platform

A modern, full-stack medical channelling and consultation management platform built with Django and React. Designed to bridge the gap between patients, specialist doctors, and hospital administrators with a seamless digital experience.

## 🚀 Features

- **Multi-Role Dashboards**: Dedicated portals for Patients, Doctors, and Staff (Admins).
- **Patient Portal**: Book appointments, view channelling history, manage upcoming visits, and explore doctor profiles.
- **Doctor Portal**: Manage upcoming appointments, view patient details, and track daily schedules.
- **Staff Portal**: Comprehensive overview of platform statistics, managing doctors, and system configuration.
- **Modern UI/UX**: Built with a custom, premium design system featuring smooth animations, responsive layouts, and skeleton loading states.
- **RESTful API**: Robust backend API powered by Django REST Framework.

## 🛠️ Tech Stack

- **Backend**: Django, Django REST Framework, SQLite (Development)
- **Frontend**: React.js, Webpack, Babel
- **Styling**: Custom CSS (Vanilla + CSS Variables) Design System
- **Authentication**: Token-based Auth (django-rest-knox)

## 💻 Local Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/MuhammadHamzaSajjad274/django-react-medical-booking.git
   cd django-react-medical-booking
   ```

2. **Set up Python Virtual Environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows use: .\venv\Scripts\activate
   pip install -r requirements.txt
   ```

3. **Install Frontend Dependencies**
   ```bash
   npm install
   ```

4. **Run Database Migrations & Seed Data**
   ```bash
   python manage.py migrate
   python manage.py seed_doctors  # Optional: Adds dummy doctor data for testing
   ```

5. **Start Development Servers**
   You need two terminal windows running simultaneously.
   
   *Terminal 1 (Django Backend):*
   ```bash
   python manage.py runserver
   ```
   
   *Terminal 2 (React Frontend Watcher):*
   ```bash
   # On Windows Node 17+, you may need to set NODE_OPTIONS:
   # $env:NODE_OPTIONS="--openssl-legacy-provider"
   npm run dev
   ```

6. **Access the Application**
   Visit `http://localhost:8000` in your browser.

## 🔒 Security Note
This project is configured for development. If deploying to production, ensure you set strong environment variables for `SECRET_KEY`, set `DEBUG = False`, and switch to a production-grade database like PostgreSQL.

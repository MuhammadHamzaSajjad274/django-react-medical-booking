import React, { useState, useEffect, useRef } from "react";
import "../guestUserMode/css/guestUserMode.css";
import "../../components/design-system.css";
import PatientSignUp from "../accounts/PatientSignUp";
import PatientSignIn from "../accounts/PatientSignIn";
import DoctorSignIn from "../accounts/DoctorSignIn";
import StaffSignIn from "../accounts/StaffSignIn";
import { Link } from "react-router-dom";
import companyLogo from "../layout/images/logo5.png";
import axios from "axios";

/* ── Scroll Reveal Hook ────────────────────────────── */
function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".ds-reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            observer.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  });
}

/* ── Count-Up Hook ─────────────────────────────────── */
function CountUp({ target, suffix = "" }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const animated = useRef(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animated.current) {
          animated.current = true;
          const duration = 1800;
          const steps = 50;
          const step = target / steps;
          let current = 0;
          const interval = setInterval(() => {
            current += step;
            if (current >= target) { setCount(target); clearInterval(interval); }
            else { setCount(Math.floor(current)); }
          }, duration / steps);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);
  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

/* ── SERVICES DATA ─────────────────────────────────── */
const SERVICES = [
  { icon: "🫀", title: "Cardiology", desc: "Expert heart care with advanced diagnostics and personalised treatment plans." },
  { icon: "🧠", title: "Neurology", desc: "Comprehensive neurological care from stroke to epilepsy management." },
  { icon: "🦷", title: "Dental Care", desc: "Complete oral health services from preventive care to complex procedures." },
  { icon: "🩺", title: "General Medicine", desc: "Primary care consultations and routine health check-ups for all ages." },
  { icon: "👁️", title: "Ophthalmology", desc: "Full spectrum of eye care including LASIK, cataracts, and retina services." },
  { icon: "🦴", title: "Orthopaedics", desc: "Joint replacements, sports injuries, and bone & muscle care." },
];

/* ── SPECIALTY ICON MAP ────────────────────────────── */
const SPECIALTY_ICONS = {
  "Cardiology":       "❤️",
  "Neurology":        "🧠",
  "Dermatology":      "🩹",
  "Orthopaedics":     "🦴",
  "Gynaecology":      "👶",
  "General Medicine": "🩺",
  "Dentistry":        "🦷",
  "Ophthalmology":    "👁️",
  "Psychiatry":       "💭",
  "ENT":              "👂",
};
const getSpecialtyIcon = (s) => SPECIALTY_ICONS[s] || "🏥";

/* ── useDoctors hook — fetches real doctors from DB ── */
function useDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    axios.get("/api/doctorNonAuth/")
      .then((res) => setDoctors(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);
  return { doctors, loading };
}

/* ── WHY US DATA ───────────────────────────────────── */
const WHY_US = [
  { icon: "🏥", title: "Accredited Facility", desc: "Internationally accredited with the highest standards of patient safety and clinical excellence." },
  { icon: "⚡", title: "Fast Appointments", desc: "Book a same-day or next-day appointment online in under 2 minutes." },
  { icon: "👨‍💻", title: "Digital Records", desc: "All your health records securely stored and accessible from any device." },
  { icon: "💬", title: "24/7 Support", desc: "Round-the-clock patient support via chat, call, or in-person care." },
];

/* ── TESTIMONIALS DATA ─────────────────────────────── */
const TESTIMONIALS = [
  { stars: "★★★★★", text: "Booking my appointment was incredibly easy. The doctor was thorough and the whole experience was reassuring.", name: "Amira K.", role: "Patient", avatar: "👩" },
  { stars: "★★★★★", text: "eDoc has transformed how I manage my follow-ups. I can see my full history at a glance — brilliant system.", name: "Daniel T.", role: "Patient", avatar: "👨" },
  { stars: "★★★★☆", text: "Genuinely impressed by the professionalism. Reminded me that going to the doctor doesn't have to be stressful.", name: "Priya M.", role: "Patient", avatar: "👩" },
];

/* ── MAIN COMPONENT ────────────────────────────────── */
class Homepage extends React.Component {
  constructor(props) {
    super(props);
    // Determine initial view from props (e.g. if App.js already has a mode set)
    this.state = {
      view: Homepage._viewFromProps(props),
    };
    this.goLanding = this.goLanding.bind(this);
    this.goRoleSelect = this.goRoleSelect.bind(this);
  }

  // Derive view from App.js props
  static _viewFromProps(props) {
    if (props.showSignUpComponent) return "patient-signup";
    if (props.isDoctorMode && props.showSignInComponent) return "doctor-login";
    if (props.isStaffMode) return "staff-login";
    if (props.showSignInComponent) return "role-select";
    return "landing";
  }

  componentDidUpdate(prevProps) {
    // React to Navbar Login / Register button clicks (they update App.js state → new props)
    const p = this.props;
    const pp = prevProps;

    if (p.showSignUpComponent !== pp.showSignUpComponent && p.showSignUpComponent) {
      this.setState({ view: "patient-signup" });
      return;
    }
    if (p.isDoctorMode !== pp.isDoctorMode && p.isDoctorMode && p.showSignInComponent) {
      this.setState({ view: "doctor-login" });
      return;
    }
    if (p.isStaffMode !== pp.isStaffMode && p.isStaffMode) {
      this.setState({ view: "staff-login" });
      return;
    }
    if (p.showSignInComponent !== pp.showSignInComponent && p.showSignInComponent && !p.isDoctorMode && !p.isStaffMode) {
      // Navbar "Login" clicked → go to role-select so user picks their portal
      this.setState({ view: "role-select" });
      return;
    }
  }

  goLanding() {
    // Reset App.js state AND local view
    window.location.href = "/";
  }
  goRoleSelect() { this.setState({ view: "role-select" }); }


  render() {
    const { view } = this.state;

    /* ── Auth / Role-select views ── */
    if (view === "role-select") {
      return <RoleSelectScreen
        onPatient={() => this.setState({ view: "patient-login" })}
        onDoctor={() => this.setState({ view: "doctor-login" })}
        onStaff={() => this.setState({ view: "staff-login" })}
        onBack={this.goLanding}
      />;
    }
    if (view === "patient-login") {
      return <AuthWrapper role="patient" onBack={this.goRoleSelect}>
        <PatientSignIn signUpSwitch={() => this.setState({ view: "patient-signup" })} />
      </AuthWrapper>;
    }
    if (view === "patient-signup") {
      return <AuthWrapper role="patient" onBack={() => this.setState({ view: "patient-login" })}>
        <PatientSignUp signInOutSwitch={() => this.setState({ view: "patient-login" })} />
      </AuthWrapper>;
    }
    if (view === "doctor-login") {
      return <AuthWrapper role="doctor" onBack={this.goRoleSelect}>
        <DoctorSignIn />
      </AuthWrapper>;
    }
    if (view === "staff-login") {
      return <AuthWrapper role="staff" onBack={this.goRoleSelect}>
        <StaffSignIn />
      </AuthWrapper>;
    }

    /* ── Landing page ── */
    return <LandingPage onGetStarted={this.goRoleSelect} />;
  }
}

/* ── LANDING PAGE ──────────────────────────────────── */
function LandingPage({ onGetStarted }) {
  useScrollReveal();
  const { doctors, loading: doctorsLoading } = useDoctors();

  /* unique specialties from real data */
  const departments = [...new Set(doctors.map((d) => d.Specialization).filter(Boolean))];

  return (
    <React.Fragment>
      {/* HERO */}
      <section className="hero" id="home">
        <div className="hero__bg" aria-hidden="true" />
        <div className="hero__gradient" aria-hidden="true" />
        <div className="hero__content">
          <div className="hero__text">
            <div className="hero__badge">
              <span className="hero__badge-dot" aria-hidden="true" />
              Trusted Healthcare Platform
            </div>
            <h1 className="hero__title">
              Your Health,<br />
              Our <em>Priority</em>
            </h1>
            <p className="hero__subtitle">
              Connect with specialist doctors, book appointments instantly, and
              manage your entire healthcare journey — all in one place.
            </p>
            <div className="hero__actions">
              <button
                id="hero-book-btn"
                className="ds-btn ds-btn-primary ds-btn-lg"
                onClick={onGetStarted}
              >
                Book an Appointment
              </button>
              <a href="#doctors" className="ds-btn ds-btn-secondary ds-btn-lg" style={{ color: "#fff", borderColor: "rgba(255,255,255,0.5)" }}>
                Find a Doctor
              </a>
            </div>
          </div>

          {/* 3D Pulse Graphic */}
          <div className="hero__visual" aria-hidden="true">
            <div className="pulse-graphic">
              <div className="pulse-graphic__ring" />
              <div className="pulse-graphic__ring" />
              <div className="pulse-graphic__ring" />
              <div className="pulse-graphic__center">
                <svg className="pulse-graphic__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
              </div>
              <div className="pulse-graphic__stat">
                <span className="pulse-graphic__stat-number">500+</span>
                <span className="pulse-graphic__stat-label">Patients</span>
              </div>
              <div className="pulse-graphic__stat">
                <span className="pulse-graphic__stat-number">20+</span>
                <span className="pulse-graphic__stat-label">Specialists</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS STRIP */}
      <section className="stats-strip" aria-label="Platform statistics">
        <div className="stats-strip__grid">
          <div className="stats-strip__item ds-reveal">
            <span className="stats-strip__number"><CountUp target={500} suffix="+" /></span>
            <span className="stats-strip__label">Patients Treated</span>
          </div>
          <div className="stats-strip__item ds-reveal ds-reveal-delay-1">
            <span className="stats-strip__number"><CountUp target={20} suffix="+" /></span>
            <span className="stats-strip__label">Specialist Doctors</span>
          </div>
          <div className="stats-strip__item ds-reveal ds-reveal-delay-2">
            <span className="stats-strip__number"><CountUp target={10} suffix="+" /></span>
            <span className="stats-strip__label">Years of Care</span>
          </div>
          <div className="stats-strip__item ds-reveal ds-reveal-delay-3">
            <span className="stats-strip__number"><CountUp target={98} suffix="%" /></span>
            <span className="stats-strip__label">Patient Satisfaction</span>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="services ds-section" id="services" aria-labelledby="services-title">
        <div className="services__header ds-reveal">
          <p className="ds-section-label">What We Offer</p>
          <h2 className="ds-section-title" id="services-title">Our Medical Specialties</h2>
          <p className="ds-section-subtitle" style={{ margin: "0 auto" }}>
            From routine check-ups to complex specialist care — we cover every aspect of your health.
          </p>
        </div>
        <div className="services__grid">
          {SERVICES.map((s, i) => (
            <article
              key={s.title}
              className={`service-card ds-reveal ds-reveal-delay-${Math.min(i, 4)}`}
              aria-label={s.title}
            >
              <div className="service-card__icon-wrap" aria-hidden="true">{s.icon}</div>
              <h3 className="service-card__title">{s.title}</h3>
              <p className="service-card__desc">{s.desc}</p>
            </article>
          ))}
        </div>
      </section>

      {/* DEPARTMENTS — driven by real doctor data */}
      <section className="services ds-section" id="departments" aria-labelledby="dept-title">
        <div className="services__header ds-reveal">
          <p className="ds-section-label">Departments</p>
          <h2 className="ds-section-title" id="dept-title">Our Specialties</h2>
          <p className="ds-section-subtitle" style={{ margin: "0 auto" }}>
            Our multi-specialty clinic covers a comprehensive range of medical disciplines.
          </p>
        </div>
        <div className="services__grid">
          {doctorsLoading
            ? [1,2,3,4,5,6].map((n) => (
                <div key={n} className="service-card ds-reveal" style={{ minHeight: 140 }}>
                  <div className="ds-skeleton" style={{ width: 48, height: 48, borderRadius: "50%", margin: "0 auto 1rem" }} />
                  <div className="ds-skeleton" style={{ height: 18, width: "60%", margin: "0 auto" }} />
                </div>
              ))
            : departments.map((spec, i) => (
                <article
                  key={spec}
                  className={`service-card ds-reveal ds-reveal-delay-${Math.min(i, 4)}`}
                  aria-label={spec}
                >
                  <div className="service-card__icon-wrap" aria-hidden="true">{getSpecialtyIcon(spec)}</div>
                  <h3 className="service-card__title">{spec}</h3>
                  <p className="service-card__desc">
                    {doctors.filter((d) => d.Specialization === spec).length} specialist{doctors.filter((d) => d.Specialization === spec).length > 1 ? "s" : ""} available
                  </p>
                </article>
              ))
          }
        </div>
      </section>

      {/* DOCTORS — real data from DB */}
      <section className="doctors ds-section" id="doctors" aria-labelledby="doctors-title">
        <div className="doctors__header ds-reveal">
          <p className="ds-section-label">Meet Our Team</p>
          <h2 className="ds-section-title" id="doctors-title">Our Specialist Doctors</h2>
          <p className="ds-section-subtitle" style={{ margin: "0 auto" }}>
            Experienced, compassionate specialists committed to delivering the best outcomes for you.
          </p>
        </div>
        <div className="doctors__grid">
          {doctorsLoading
            ? [1,2,3].map((n) => (
                <div key={n} className="doctor-profile-card ds-reveal">
                  <div className="ds-skeleton" style={{ height: 180, borderRadius: "18px 18px 0 0" }} />
                  <div style={{ padding: "1.25rem" }}>
                    <div className="ds-skeleton" style={{ height: 20, width: "70%", marginBottom: 10 }} />
                    <div className="ds-skeleton" style={{ height: 14, width: "50%" }} />
                  </div>
                </div>
              ))
            : doctors.map((d, i) => {
                const imgSrc = d.doctorImage
                  ? (d.doctorImage.startsWith("http") ? d.doctorImage : `/${d.doctorImage}`)
                  : null;
                return (
                  <article key={d.user} className={`doctor-profile-card ds-reveal ds-reveal-delay-${(i % 4) + 1}`}>
                    <div className="doctor-profile-card__img-wrap">
                      {imgSrc
                        ? <img
                            src={imgSrc}
                            alt={`Dr. ${d.doctorFName} ${d.doctorLName}`}
                            className="doctor-profile-card__img"
                            onError={(e) => { e.target.style.display = "none"; }}
                          />
                        : <span style={{ fontSize: "4rem" }}>{getSpecialtyIcon(d.Specialization)}</span>
                      }
                    </div>
                    <div className="doctor-profile-card__body">
                      <h3 className="doctor-profile-card__name">Dr. {d.doctorFName} {d.doctorLName}</h3>
                      <p className="doctor-profile-card__specialty">{d.Specialization}</p>
                      <p style={{ fontSize: "0.8125rem", color: "var(--color-text-muted)", marginBottom: "0.75rem", lineHeight: 1.5 }}>
                        {d.Qualifications ? d.Qualifications.split(",")[0] : ""}
                      </p>
                      <div className="doctor-profile-card__footer">
                        {d.chargePerSession && (
                          <span style={{ fontWeight: 700, color: "var(--color-text-heading)", fontSize: "0.9375rem" }}>
                            Rs. {parseFloat(d.chargePerSession).toLocaleString()} <span style={{ fontSize: "0.75rem", fontWeight: 400, color: "var(--color-text-muted)" }}>/session</span>
                          </span>
                        )}
                        <button
                          className="ds-btn ds-btn-primary ds-btn-sm"
                          onClick={onGetStarted}
                          id={`book-doctor-${d.user}`}
                        >
                          Book
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })
          }
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="why-us" id="about" aria-labelledby="why-title">
        <div className="why-us__header ds-reveal">
          <p className="ds-section-label">Why eDoc</p>
          <h2 className="ds-section-title" id="why-title">Healthcare, Simplified</h2>
          <p className="ds-section-subtitle" style={{ margin: "0 auto", color: "rgba(255,255,255,0.65)" }}>
            We've reimagined every touchpoint of your healthcare experience to make it effortless.
          </p>
        </div>
        <div className="why-us__grid">
          {WHY_US.map((w, i) => (
            <article key={w.title} className={`why-card ds-reveal ds-reveal-delay-${i % 2 + 1}`}>
              <div className="why-card__icon" aria-hidden="true">{w.icon}</div>
              <div>
                <h3 className="why-card__title">{w.title}</h3>
                <p className="why-card__desc">{w.desc}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="testimonials" aria-labelledby="testimonials-title">
        <div className="testimonials__header ds-reveal">
          <p className="ds-section-label">Patient Stories</p>
          <h2 className="ds-section-title" id="testimonials-title">What Our Patients Say</h2>
        </div>
        <div className="testimonials__grid">
          {TESTIMONIALS.map((t, i) => (
            <article key={t.name} className={`testimonial-card ds-reveal ds-reveal-delay-${i + 1}`}>
              <div className="testimonial-card__stars" aria-label="5 stars">{t.stars}</div>
              <p className="testimonial-card__text">"{t.text}"</p>
              <div className="testimonial-card__author">
                <div className="testimonial-card__avatar" aria-hidden="true">{t.avatar}</div>
                <div>
                  <p className="testimonial-card__name">{t.name}</p>
                  <p className="testimonial-card__role">{t.role}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="cta-banner" id="contact" aria-labelledby="cta-title">
        <h2 className="cta-banner__title" id="cta-title">Ready to book your visit?</h2>
        <p className="cta-banner__sub">Join hundreds of patients who trust eDoc for their healthcare needs.</p>
        <button id="cta-book-btn" className="ds-btn ds-btn-primary ds-btn-lg" onClick={onGetStarted}>
          Get Started Today
        </button>
      </section>

      {/* FOOTER */}
      <footer className="footer" aria-label="Site footer">
        <div className="footer__grid">
          <div>
            <div className="footer__brand-name">eDoc</div>
            <p className="footer__brand-desc">
              A modern digital healthcare platform connecting patients with world-class specialists for exceptional, compassionate care.
            </p>
            <div className="footer__social" aria-label="Social media links">
              {["f", "t", "in", "yt"].map((s) => (
                <a key={s} href="#" className="footer__social-link" aria-label={s}>{s}</a>
              ))}
            </div>
          </div>
          <div>
            <p className="footer__col-title">Services</p>
            <ul className="footer__links" role="list">
              {["Cardiology", "Neurology", "Dental Care", "Orthopaedics", "General Medicine"].map((l) => (
                <li key={l}><a href="#services" className="footer__link">{l}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <p className="footer__col-title">Patient</p>
            <ul className="footer__links" role="list">
              {["Book Appointment", "My Profile", "Health Records", "Upcoming Visits", "Billing"].map((l) => (
                <li key={l}><button className="footer__link" style={{background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontFamily: 'inherit'}} onClick={(e) => { e.preventDefault(); onGetStarted(); }}>{l}</button></li>
              ))}
            </ul>
          </div>
          <div>
            <p className="footer__col-title">Contact</p>
            <ul className="footer__links" role="list">
              <li><a href="tel:+0800123456" className="footer__link">+0800 123 456</a></li>
              <li><a href="mailto:care@edoc.health" className="footer__link">care@edoc.health</a></li>
              <li><span className="footer__link">123 Medical Centre Dr.</span></li>
              <li><span className="footer__link">Mon–Sat: 8am – 8pm</span></li>
            </ul>
          </div>
        </div>
        <div className="footer__bottom">
          <span>© {new Date().getFullYear()} eDoc Medical Platform. All rights reserved.</span>
          <span>Privacy Policy · Terms of Use</span>
        </div>
      </footer>
    </React.Fragment>
  );
}

/* ── ROLE SELECT SCREEN ────────────────────────────── */
function RoleSelectScreen({ onPatient, onDoctor, onStaff, onBack }) {
  return (
    <div className="role-select navbar-offset">
      <button className="auth-card__back" onClick={onBack} aria-label="Back to home">
        ← Back to Home
      </button>
      <div className="role-select__logo">
        <span className="role-select__brand">eDoc</span>
      </div>
      <h1 className="role-select__title">Choose Your Portal</h1>
      <p className="role-select__subtitle">Select your role to continue to the sign-in page</p>
      <div className="role-cards" role="list">
        <button
          id="role-patient-btn"
          className="role-card role-card--patient"
          onClick={onPatient}
          role="listitem"
        >
          <div className="role-card__icon" aria-hidden="true">🧑‍💼</div>
          <span className="role-card__name">Patient</span>
          <span className="role-card__desc">Book appointments, view your health records, and manage your upcoming visits.</span>
        </button>
        <button
          id="role-doctor-btn"
          className="role-card role-card--doctor"
          onClick={onDoctor}
          role="listitem"
        >
          <div className="role-card__icon" aria-hidden="true">👨‍⚕️</div>
          <span className="role-card__name">Doctor</span>
          <span className="role-card__desc">View your schedule, manage patient appointments, and update treatment plans.</span>
        </button>
        <button
          id="role-staff-btn"
          className="role-card role-card--staff"
          onClick={onStaff}
          role="listitem"
        >
          <div className="role-card__icon" aria-hidden="true">🏥</div>
          <span className="role-card__name">Staff</span>
          <span className="role-card__desc">Manage clinic operations, patient records, and day-to-day administration.</span>
        </button>
      </div>
      <p style={{ marginTop: "2rem", fontSize: "0.875rem", color: "var(--color-text-muted)" }}>
        Admin?{" "}
        <Link to="/admin" style={{ color: "var(--color-primary)", fontWeight: 600 }}>
          Access the Admin Panel →
        </Link>
      </p>
    </div>
  );
}

/* ── AUTH WRAPPER (wraps each login form) ──────────── */
function AuthWrapper({ role, onBack, children }) {
  const labels = {
    patient: { badge: "Patient Portal", badgeClass: "", title: "Welcome back", subtitle: "Sign in to access your health dashboard." },
    doctor: { badge: "Doctor Portal", badgeClass: "auth-card__portal-badge--doctor", title: "Doctor Sign In", subtitle: "Access your schedule and patient records." },
    staff: { badge: "Staff Portal", badgeClass: "auth-card__portal-badge--staff", title: "Staff Sign In", subtitle: "Access clinic management and patient records." },
  };
  const cfg = labels[role] || labels.patient;
  return (
    <div className="auth-screen navbar-offset">
      <div className="auth-card">
        <button className="auth-card__back" onClick={onBack}>
          ← Back
        </button>
        <div className="auth-card__logo">
          <div className="auth-card__logo-name">eDoc</div>
          <div className={`auth-card__portal-badge ${cfg.badgeClass}`}>
            {cfg.badge}
          </div>
        </div>
        <h2 className="auth-card__title">{cfg.title}</h2>
        <p className="auth-card__subtitle">{cfg.subtitle}</p>
        {children}
      </div>
    </div>
  );
}

export default Homepage;

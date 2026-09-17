import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

const QUICK_ACTIONS = [
  {
    icon: "👤",
    title: "My Profile",
    desc: "View and update your personal and medical information.",
    link: "/home/profile",
    color: "#EFF6FF",
    id: "overview-profile-link",
  },
  {
    icon: "📅",
    title: "Book Appointment",
    desc: "Schedule a visit with one of our specialist doctors.",
    link: "/home/book_appointment",
    color: "#E0F7F5",
    id: "overview-book-link",
  },
  {
    icon: "🕐",
    title: "Upcoming Visits",
    desc: "View and manage your scheduled appointments.",
    link: "/home/upcoming_appointments",
    color: "#F3EFFF",
    id: "overview-upcoming-link",
  },
  {
    icon: "📋",
    title: "Visit History",
    desc: "Browse your past consultations and treatment records.",
    link: "/home/channelling_history",
    color: "#FFF7ED",
    id: "overview-history-link",
  },
];

export function PatientOverview({ auth }) {
  const name = auth && auth.user ? auth.user.first_name : "there";

  return (
    <Fragment>
      <div className="patient-overview">
        {/* Welcome banner */}
        <div className="patient-overview__welcome">
          <div className="patient-overview__welcome-text">
            <h1 className="patient-overview__greeting">
              Good day, {name}! 👋
            </h1>
            <p className="patient-overview__greeting-sub">
              Here's a quick overview of your health dashboard. What would you like to do today?
            </p>
          </div>
          <div className="patient-overview__welcome-badge">
            <span>🏥</span>
            <div>
              <strong>eDoc Patient Portal</strong>
              <p>Your health journey, simplified.</p>
            </div>
          </div>
        </div>

        {/* Quick action cards */}
        <div className="patient-overview__grid">
          {QUICK_ACTIONS.map((a) => (
            <Link
              key={a.title}
              to={a.link}
              id={a.id}
              className="patient-action-card"
              style={{ "--card-icon-bg": a.color }}
            >
              <div className="patient-action-card__icon">{a.icon}</div>
              <div className="patient-action-card__body">
                <h3 className="patient-action-card__title">{a.title}</h3>
                <p className="patient-action-card__desc">{a.desc}</p>
              </div>
              <span className="patient-action-card__arrow">→</span>
            </Link>
          ))}
        </div>

        {/* Health tip banner */}
        <div className="patient-overview__tip">
          <span className="patient-overview__tip-icon" aria-hidden="true">💡</span>
          <p>
            <strong>Tip:</strong> Regular health check-ups help catch conditions early.
            Book a general consultation if you haven't had one this year.
          </p>
          <Link to="/home/book_appointment" id="overview-tip-book" className="ds-btn ds-btn-primary ds-btn-sm">
            Book Now
          </Link>
        </div>
      </div>
    </Fragment>
  );
}

const mapStateToProps = (state) => ({ auth: state.auth });
export default connect(mapStateToProps)(PatientOverview);

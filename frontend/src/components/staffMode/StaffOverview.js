import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { connect } from "react-redux";
import "../../components/design-system.css";

export class StaffOverview extends Component {
  constructor(props) {
    super(props);
    this._isMounted = false;
    this.state = {
      stats: null,
      loading: true,
    };
  }

  async componentDidMount() {
    this._isMounted = true;
    try {
      const res = await axios.get("/api/stats/");
      this._isMounted && this.setState({ stats: res.data, loading: false });
    } catch {
      this._isMounted && this.setState({ loading: false });
    }
  }

  componentWillUnmount() { this._isMounted = false; }

  render() {
    const { stats, loading } = this.state;
    const firstName = this.props.auth?.user?.first_name || "Staff";

    const STAT_CARDS = [
      { icon: "🧑‍🤝‍🧑", label: "Total Patients",         value: stats?.total_patients,         bg: "var(--color-primary-light)" },
      { icon: "👨‍⚕️",  label: "Total Doctors",           value: stats?.total_doctors,           bg: "var(--color-secondary-light)" },
      { icon: "📋",   label: "Total Appointments",      value: stats?.total_appointments,      bg: "#F3EFFF" },
      { icon: "📅",   label: "Appointments Today",      value: stats?.appointments_today,      bg: "#FFF7ED" },
      { icon: "⏳",   label: "Pending Appointments",    value: stats?.pending_appointments,    bg: "#FEF3C7" },
    ];

    return (
      <Fragment>
        <div className="ds-dashboard">
          {/* Welcome header */}
          <div className="ds-page-header">
            <h1>Admin Dashboard 🏥</h1>
            <p>Welcome, {firstName}. Here's a live snapshot of the clinic.</p>
          </div>

          {/* Live stat cards */}
          <div className="ds-stat-grid">
            {STAT_CARDS.map((s) => (
              <div className="ds-stat-card" key={s.label}>
                <div className="ds-stat-card__icon" style={{ background: s.bg }}>
                  {s.icon}
                </div>
                <div>
                  {loading
                    ? <div className="ds-skeleton" style={{ height: 36, width: 56, borderRadius: 8, marginBottom: 6 }} />
                    : <div className="ds-stat-card__value">{s.value ?? "—"}</div>
                  }
                  <div className="ds-stat-card__label">{s.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick actions */}
          <h2 style={{ fontFamily: "var(--font-body)", fontWeight: 700, fontSize: "1.125rem", color: "var(--color-text-heading)", marginBottom: "1.25rem" }}>
            Quick Actions
          </h2>
          <div className="ds-quick-grid">
            <Link to="/staff_home/doctor_info" className="ds-quick-card">
              <div className="ds-quick-card__icon" style={{ background: "var(--color-secondary-light)" }}>👨‍⚕️</div>
              <div className="ds-quick-card__title">Doctor Management</div>
              <div className="ds-quick-card__desc">Add, view, and manage doctor profiles and credentials</div>
            </Link>
            <Link to="/staff_home/patient_info" className="ds-quick-card">
              <div className="ds-quick-card__icon" style={{ background: "var(--color-primary-light)" }}>🧑‍🤝‍🧑</div>
              <div className="ds-quick-card__title">Patient Management</div>
              <div className="ds-quick-card__desc">Browse patient records and account information</div>
            </Link>
            <Link to="/staff_home/book_appointment" className="ds-quick-card">
              <div className="ds-quick-card__icon" style={{ background: "#FFF7ED" }}>📋</div>
              <div className="ds-quick-card__title">Book Appointment</div>
              <div className="ds-quick-card__desc">Schedule an appointment on behalf of a patient</div>
            </Link>
            <Link to="/staff_home/upcoming_appointments" className="ds-quick-card">
              <div className="ds-quick-card__icon" style={{ background: "#F3EFFF" }}>📅</div>
              <div className="ds-quick-card__title">Upcoming Appointments</div>
              <div className="ds-quick-card__desc">View all pending and scheduled appointments</div>
            </Link>
            <Link to="/staff_home/completed_appointments" className="ds-quick-card">
              <div className="ds-quick-card__icon" style={{ background: "#DCFCE7" }}>✅</div>
              <div className="ds-quick-card__title">Completed Appointments</div>
              <div className="ds-quick-card__desc">Audit and review past completed sessions</div>
            </Link>
            <Link to="/staff_home/profile" className="ds-quick-card">
              <div className="ds-quick-card__icon" style={{ background: "#FEF3C7" }}>👤</div>
              <div className="ds-quick-card__title">My Profile</div>
              <div className="ds-quick-card__desc">Manage your staff account and preferences</div>
            </Link>
          </div>
        </div>
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(StaffOverview);

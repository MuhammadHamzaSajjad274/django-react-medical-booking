import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { getAppointmentsNoToken } from "../../actions/appointments";
import "../../components/design-system.css";
import "./css/doctorMode.css";

export class Overview extends Component {
  constructor(props) {
    super(props);
    this._isMounted = false;
    this.state = {
      todayCount: 0,
      pendingCount: 0,
      completedCount: 0,
    };
  }

  static propTypes = {
    appointments: PropTypes.array.isRequired,
    auth: PropTypes.object.isRequired,
  };

  async componentDidMount() {
    this._isMounted = true;
    await this.props.getAppointmentsNoToken();
    if (!this._isMounted) return;

    const all = this.props.appointments;
    const myId = this.props.auth.user.id;
    const todayStr = new Date().toISOString().slice(0, 10);

    let todayCount = 0, pendingCount = 0, completedCount = 0;
    for (let i = 0; i < all.length; i++) {
      const a = all[i];
      if (String(a.doctorID) !== String(myId)) continue;
      if (a.status === "PENDING") {
        pendingCount++;
        if (a.date && a.date.slice(0, 10) === todayStr) todayCount++;
      }
      if (a.status === "COMPLETED") completedCount++;
    }

    this._isMounted && this.setState({ todayCount, pendingCount, completedCount });
  }

  componentWillUnmount() { this._isMounted = false; }

  render() {
    const { todayCount, pendingCount, completedCount } = this.state;
    const firstName = this.props.auth.user?.first_name || "Doctor";

    return (
      <Fragment>
        <div className="ds-dashboard">
          {/* Welcome header */}
          <div className="ds-page-header">
            <h1>Welcome back, Dr. {firstName} 👋</h1>
            <p>Here's a summary of your clinic activity for today.</p>
          </div>

          {/* Stat cards */}
          <div className="ds-stat-grid">
            <div className="ds-stat-card">
              <div className="ds-stat-card__icon">📅</div>
              <div>
                <div className="ds-stat-card__value">{todayCount}</div>
                <div className="ds-stat-card__label">Appointments Today</div>
              </div>
            </div>
            <div className="ds-stat-card">
              <div className="ds-stat-card__icon ds-stat-card__icon--orange">⏳</div>
              <div>
                <div className="ds-stat-card__value">{pendingCount}</div>
                <div className="ds-stat-card__label">Pending Appointments</div>
              </div>
            </div>
            <div className="ds-stat-card">
              <div className="ds-stat-card__icon ds-stat-card__icon--teal">✅</div>
              <div>
                <div className="ds-stat-card__value">{completedCount}</div>
                <div className="ds-stat-card__label">Completed</div>
              </div>
            </div>
          </div>

          {/* Quick actions */}
          <h2 style={{ fontFamily: "var(--font-body)", fontWeight: 700, fontSize: "1.125rem", color: "var(--color-text-heading)", marginBottom: "1.25rem" }}>
            Quick Actions
          </h2>
          <div className="ds-quick-grid">
            <Link to="/doctor_home/pending_appointments" className="ds-quick-card">
              <div className="ds-quick-card__icon" style={{ background: "#FFF7ED" }}>⏳</div>
              <div className="ds-quick-card__title">Pending Appointments</div>
              <div className="ds-quick-card__desc">Review and manage patient appointment requests</div>
            </Link>
            <Link to="/doctor_home/completed_appointments" className="ds-quick-card">
              <div className="ds-quick-card__icon" style={{ background: "#DCFCE7" }}>✅</div>
              <div className="ds-quick-card__title">Completed Appointments</div>
              <div className="ds-quick-card__desc">View past consultations and treatment plans</div>
            </Link>
            <Link to="/doctor_home/work_schedule" className="ds-quick-card">
              <div className="ds-quick-card__icon" style={{ background: "var(--color-primary-light)" }}>🗓️</div>
              <div className="ds-quick-card__title">Work Schedule</div>
              <div className="ds-quick-card__desc">Manage your available time slots and days</div>
            </Link>
            <Link to="/doctor_home/earnings" className="ds-quick-card">
              <div className="ds-quick-card__icon" style={{ background: "#F3EFFF" }}>💰</div>
              <div className="ds-quick-card__title">Earnings</div>
              <div className="ds-quick-card__desc">Review your consultation fees and income summary</div>
            </Link>
            <Link to="/doctor_home/profile" className="ds-quick-card">
              <div className="ds-quick-card__icon" style={{ background: "var(--color-secondary-light)" }}>👤</div>
              <div className="ds-quick-card__title">My Profile</div>
              <div className="ds-quick-card__desc">Update your bio, qualifications, and contact info</div>
            </Link>
          </div>
        </div>
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  appointments: state.appointments.appointments,
});

export default connect(mapStateToProps, { getAppointmentsNoToken })(Overview);

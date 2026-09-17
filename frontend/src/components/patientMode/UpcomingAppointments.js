import React, { Component, Fragment } from "react";
import "./css/patientMode.css";
import "../../components/design-system.css";
import axios from "axios";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  updateAppointmentNoToken,
  getAppointmentsNoToken,
} from "../../actions/appointments";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { withAlert } from "react-alert";
import { compose } from "redux";

export class UpcomingAppointments extends Component {
  constructor(props) {
    super(props);
    this._isMounted = false;
    this.state = {
      pendingAppointmentsList: [],
      loading: true,
      patientID: this.props.auth.user.id,
      patientName: `${this.props.auth.user.first_name} ${this.props.auth.user.last_name}`,
    };
  }

  static propTypes = {
    updateAppointmentNoToken: PropTypes.func.isRequired,
    appointments: PropTypes.array.isRequired,
  };

  fetchPendingAppointments = async () => {
    this._isMounted && this.setState({ loading: true });
    await this.props.getAppointmentsNoToken();
    const appointments = this.props.appointments;
    const list = [];

    for (let i = 0; i < appointments.length; i++) {
      if (
        String(appointments[i].patientID) === String(this.state.patientID) &&
        appointments[i].status === "PENDING"
      ) {
        try {
          const res = await axios.get("/api/doctorNonAuth/" + appointments[i].doctorID);
          const d = res.data;
          list.unshift({
            ReferenceID:       appointments[i].ReferenceID,
            PatientName:       this.state.patientName,
            doctorImage:       d.doctorImage,
            doctorName:        `${d.doctorFName} ${d.doctorLName}`,
            doctorSpecialty:   d.Specialization,
            appointmentDate:   new Date(appointments[i].date),
            appointmentTime:   appointments[i].time,
            appointmentNumber: appointments[i].AppointmentNo,
            channellingFee:    appointments[i].ChannellingFee,
          });
        } catch (err) {
          /* skip if doctor fetch fails */
        }
      }
    }

    this._isMounted && this.setState({ pendingAppointmentsList: list, loading: false });
  };

  componentDidMount() {
    this._isMounted = true;
    this.fetchPendingAppointments();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  confirmationAlert = (RefID) => {
    const alert = this.props.alert;
    confirmAlert({
      title: "Cancel Appointment",
      message: "Are you sure you want to cancel this appointment?",
      buttons: [
        {
          label: "Yes, cancel it",
          onClick: async () => {
            const cancel = new FormData();
            cancel.append("status", "CANCELLED");
            this._isMounted && (await this.props.updateAppointmentNoToken(RefID, cancel));
            this.fetchPendingAppointments();
            alert.success("Appointment cancelled successfully.");
          },
        },
        { label: "No, keep it", onClick: () => {} },
      ],
    });
  };

  render() {
    const { pendingAppointmentsList, loading } = this.state;

    const formatDate = (d) => {
      if (!d) return "—";
      const date = d instanceof Date ? d : new Date(d);
      return date.toLocaleDateString("en-GB", {
        weekday: "short", day: "2-digit", month: "short", year: "numeric",
      });
    };

    return (
      <Fragment>
        <div className="ds-dashboard">
          <div className="ds-page-header">
            <h1>Upcoming Appointments</h1>
            <p>
              {loading
                ? "Loading your appointments…"
                : `You have ${pendingAppointmentsList.length} upcoming appointment${pendingAppointmentsList.length !== 1 ? "s" : ""}.`}
            </p>
          </div>

          {/* Loading skeletons */}
          {loading && [1, 2, 3].map((n) => (
            <div key={n} className="ds-skeleton-card" style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
              <div className="ds-skeleton" style={{ width: 56, height: 56, borderRadius: "50%", flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div className="ds-skeleton" style={{ height: 18, width: "50%", marginBottom: 10 }} />
                <div className="ds-skeleton" style={{ height: 14, width: "70%" }} />
              </div>
            </div>
          ))}

          {/* Empty state */}
          {!loading && pendingAppointmentsList.length === 0 && (
            <div className="ds-empty-state">
              <div className="ds-empty-state__icon">📅</div>
              <div className="ds-empty-state__title">No upcoming appointments</div>
              <div className="ds-empty-state__desc">
                You don't have any pending appointments right now. Book one to see a specialist.
              </div>
            </div>
          )}

          {/* Appointment cards */}
          {!loading && pendingAppointmentsList.map((appt, idx) => {
            const raw = appt.doctorImage;
            const imgSrc = raw
              ? (raw.startsWith("http") ? raw : raw.startsWith("/") ? raw : "/" + raw)
              : null;

            return (
              <div key={appt.ReferenceID || idx} className="ds-appt-card">
                {imgSrc
                  ? <img src={imgSrc} alt={`Dr. ${appt.doctorName}`} className="ds-appt-card__avatar"
                         onError={(e) => { e.target.style.display = "none"; }} />
                  : <div className="ds-appt-card__avatar-placeholder">👨‍⚕️</div>
                }
                <div className="ds-appt-card__body">
                  <div className="ds-appt-card__doctor">Dr. {appt.doctorName}</div>
                  <div className="ds-appt-card__meta">
                    <span className="ds-appt-card__meta-item">🩺 {appt.doctorSpecialty}</span>
                    <span className="ds-appt-card__meta-item">📅 {formatDate(appt.appointmentDate)}</span>
                    <span className="ds-appt-card__meta-item">🕐 {appt.appointmentTime}</span>
                    <span className="ds-appt-card__meta-item">🔢 #{appt.appointmentNumber}</span>
                    <span className="ds-appt-card__meta-item">💵 Rs. {appt.channellingFee}</span>
                  </div>
                  <div style={{ marginTop: "0.25rem" }}>
                    <span className="ds-badge ds-badge--pending">PENDING</span>
                    <span className="ds-appt-card__ref" style={{ marginLeft: "0.75rem" }}>
                      Ref: {appt.ReferenceID}
                    </span>
                  </div>
                </div>
                <div className="ds-appt-card__actions">
                  <button
                    type="button"
                    className="ds-btn ds-btn-sm"
                    style={{ background: "#FEE2E2", color: "#991B1B", border: "1px solid #FECACA" }}
                    onClick={() => this.confirmationAlert(appt.ReferenceID)}
                  >
                    ✖ Cancel
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  auth:         state.auth,
  appointments: state.appointments.appointments,
});

export default compose(
  withAlert(),
  connect(mapStateToProps, {
    updateAppointmentNoToken,
    getAppointmentsNoToken,
  })
)(UpcomingAppointments);

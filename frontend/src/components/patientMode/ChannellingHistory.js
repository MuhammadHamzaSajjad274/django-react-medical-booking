import React, { Component, Fragment } from "react";
import "./css/patientMode.css";
import "../../components/design-system.css";
import PrintPreview from "../doctorMode/PrintPreview";
import PrintPrescription from "../doctorMode/PrintPrescription";
import DropDownOptions from "./DropDownOptions";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getAppointmentsNoToken } from "../../actions/appointments";
import { getPatients } from "../../actions/patients";
import { getPrescriptionsNoToken } from "../../actions/prescriptions";
import { getDoctorsNoToken } from "../../actions/doctors";
import { getTreatmentPlansNoToken } from "../../actions/treatmentPlans";

export class ChannellingHistory extends Component {
  constructor(props) {
    super(props);
    this._isMounted = false;
    this.state = {
      pastAppointmentsList: [],
      loading: true,
      patientID: this.props.auth.user.id,
      patientName: `${this.props.auth.user.first_name} ${this.props.auth.user.last_name}`,
      bookDoctorSpecialization: "",
    };
  }

  static propTypes = {
    appointments:   PropTypes.array.isRequired,
    patients:       PropTypes.array.isRequired,
    auth:           PropTypes.object.isRequired,
    prescriptions:  PropTypes.array.isRequired,
    doctors:        PropTypes.array.isRequired,
    treatmentPlans: PropTypes.array.isRequired,
  };

  async componentDidMount() {
    this._isMounted = true;
    await this.fetchPastAppointments();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  bookDoctorSpecialization = (specialization) => {
    this.setState({
      bookDoctorSpecialization: specialization ? specialization.label : "",
    });
  };

  fetchPastAppointments = async () => {
    this._isMounted && this.setState({ loading: true });
    await this.props.getAppointmentsNoToken();
    await this.props.getPatients();
    await this.props.getPrescriptionsNoToken();
    await this.props.getDoctorsNoToken();
    await this.props.getTreatmentPlansNoToken();

    const appointments    = this.props.appointments;
    const prescriptionInfo= this.props.prescriptions;
    const patientInfo     = this.props.patients[0];
    const doctorsInfo     = this.props.doctors;
    const treatmentPlansInfo = this.props.treatmentPlans;

    const list = [];

    for (let i = 0; i < appointments.length; i++) {
      const appt = appointments[i];
      if (
        String(appt.patientID) !== String(this.state.patientID) ||
        (appt.status !== "COMPLETED" && appt.status !== "DID NOT ATTEND")
      ) continue;

      const doctorInfo = doctorsInfo.find((d) => d.user === appt.doctorID) || {};
      const isCompleted = appt.status === "COMPLETED";

      let treatmentPlanInfo = {};
      let prescripRows = [];

      if (isCompleted) {
        treatmentPlanInfo = treatmentPlansInfo.find((t) => t.ReferenceID === appt.ReferenceID) || {};
        for (let p = 0; p < prescriptionInfo.length; p++) {
          if (prescriptionInfo[p].ReferenceID === appt.ReferenceID) {
            prescripRows.push({
              drugName:     prescriptionInfo[p].DrugName,
              duration:     { howMany: prescriptionInfo[p].DurationCount, DWM: prescriptionInfo[p].DurationType },
              dosage:       { morn: prescriptionInfo[p].DosageMorn, aft: prescriptionInfo[p].DosageAft, eve: prescriptionInfo[p].DosageEve, night: prescriptionInfo[p].DosageNight },
              instructions: prescriptionInfo[p].Instructions,
              notes:        prescriptionInfo[p].Notes,
            });
          }
        }
      }

      list.unshift({
        ReferenceID:          appt.ReferenceID,
        PatientName:          patientInfo ? `${patientInfo.title} ${this.state.patientName}` : this.state.patientName,
        PatientAge:           patientInfo ? new Date().getFullYear() - new Date(patientInfo.dob).getFullYear() : "",
        doctorImage:          doctorInfo.doctorImage || null,
        doctorName:           `${doctorInfo.doctorFName || ""} ${doctorInfo.doctorLName || ""}`.trim(),
        doctorSpecialty:      doctorInfo.Specialization || "",
        doctorQualifications: doctorInfo.Qualifications || "",
        appointmentDate:      new Date(appt.date),
        appointmentTime:      appt.time,
        channellingFee:       appt.ChannellingFee,
        status:               isCompleted ? "Visited" : "Did not Attend",
        didPatientVisit:      isCompleted,
        treatDate:            isCompleted ? treatmentPlanInfo.treatDate : "",
        presentingComplaint:  isCompleted ? treatmentPlanInfo.presentingComplaint : "",
        testsToBeDone:        isCompleted ? treatmentPlanInfo.testsToBeDone : "",
        medicalAdvices:       isCompleted ? treatmentPlanInfo.medicalAdvices : "",
        prescripRows:         isCompleted ? prescripRows : [],
      });
    }

    if (this._isMounted) this.setState({ pastAppointmentsList: list, loading: false });
  };

  render() {
    const { pastAppointmentsList, loading, bookDoctorSpecialization } = this.state;

    const formatDate = (d) => {
      if (!d) return "—";
      const date = d instanceof Date ? d : new Date(d);
      return date.toLocaleDateString("en-GB", { weekday: "short", day: "2-digit", month: "short", year: "numeric" });
    };

    const filtered = bookDoctorSpecialization
      ? pastAppointmentsList.filter((a) => a.doctorSpecialty === bookDoctorSpecialization)
      : pastAppointmentsList;

    return (
      <Fragment>
        <div className="ds-dashboard">
          <div className="ds-page-header">
            <h1>Visit History</h1>
            <p>Your complete record of past consultations and prescriptions.</p>
          </div>

          {/* Filter */}
          <div style={{ marginBottom: "1.5rem", maxWidth: 480 }}>
            <DropDownOptions
              viewSpecializationSuggests={true}
              channelHistory={true}
              bookDoctorSpecialization={this.bookDoctorSpecialization}
              doctorSpecDefault={bookDoctorSpecialization}
            />
          </div>

          {/* Loading skeletons */}
          {loading && [1, 2, 3].map((n) => (
            <div key={n} className="ds-skeleton-card" style={{ display: "flex", gap: "1rem", alignItems: "center", marginBottom: "1rem" }}>
              <div className="ds-skeleton" style={{ width: 56, height: 56, borderRadius: "50%", flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div className="ds-skeleton" style={{ height: 18, width: "50%", marginBottom: 10 }} />
                <div className="ds-skeleton" style={{ height: 14, width: "70%" }} />
              </div>
            </div>
          ))}

          {/* Empty state */}
          {!loading && filtered.length === 0 && (
            <div className="ds-empty-state">
              <div className="ds-empty-state__icon">📋</div>
              <div className="ds-empty-state__title">No visit history found</div>
              <div className="ds-empty-state__desc">
                {bookDoctorSpecialization
                  ? `No completed visits for ${bookDoctorSpecialization}. Try clearing the filter.`
                  : "You haven't completed any appointments yet."}
              </div>
            </div>
          )}

          {/* History cards */}
          {!loading && filtered.map((appt, idx) => {
            const raw    = appt.doctorImage;
            const imgSrc = raw ? (raw.startsWith("http") ? raw : raw.startsWith("/") ? raw : "/" + raw) : null;
            const modalId = `PrescriptionModal_${appt.ReferenceID}`;

            return (
              <div key={appt.ReferenceID || idx} className="ds-appt-card" style={{ flexWrap: "wrap", alignItems: "flex-start", marginBottom: "1.25rem" }}>
                {/* Doctor avatar */}
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
                    <span className="ds-appt-card__meta-item">💵 Rs. {appt.channellingFee}</span>
                  </div>
                  <div style={{ marginTop: "0.4rem" }}>
                    {appt.didPatientVisit
                      ? <span className="ds-badge ds-badge--done">COMPLETED</span>
                      : <span className="ds-badge" style={{ background: "#FEE2E2", color: "#991B1B" }}>DID NOT ATTEND</span>
                    }
                    <span className="ds-appt-card__ref" style={{ marginLeft: "0.75rem" }}>Ref: {appt.ReferenceID}</span>
                  </div>
                </div>

                {/* View prescription button */}
                <div className="ds-appt-card__actions">
                  <button
                    type="button"
                    className="ds-btn ds-btn-sm ds-btn-secondary"
                    data-toggle="modal"
                    data-target={`#${modalId}`}
                    disabled={!appt.didPatientVisit}
                    style={{ whiteSpace: "nowrap" }}
                  >
                    {appt.didPatientVisit ? "📄 Prescription" : "No Prescription"}
                  </button>
                </div>

                {/* Prescription modal */}
                <div
                  className="modal fade"
                  id={modalId}
                  tabIndex="-1"
                  role="dialog"
                  aria-labelledby="prescriptionModalTitle"
                  aria-hidden="true"
                >
                  <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
                    <div className="modal-content">
                      <div className="modal-header" style={{ backgroundColor: "var(--color-primary)", color: "#fff" }}>
                        <h5 className="modal-title"><b>Prescription</b></h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close" style={{ color: "#fff", opacity: 1 }}>
                          <span aria-hidden="true">&times;</span>
                        </button>
                      </div>
                      <div className="modal-body">
                        <PrintPreview
                          treatRefID={appt.ReferenceID}
                          treatDate={appt.treatDate}
                          treatPID={this.state.patientID}
                          treatName={appt.PatientName}
                          treatAge={appt.PatientAge}
                          presentingComplaint={appt.presentingComplaint}
                          testsToBeDone={appt.testsToBeDone}
                          medicalAdvices={appt.medicalAdvices}
                          prescripRows={appt.prescripRows}
                          treatDocName={`Dr. ${appt.doctorName}`}
                          treatDocQualify={appt.doctorQualifications}
                          treatDocSpec={appt.doctorSpecialty}
                        />
                      </div>
                      <div className="modal-footer">
                        <div data-dismiss="modal">
                          <PrintPrescription
                            treatRefID={appt.ReferenceID}
                            treatDate={appt.treatDate}
                            treatPID={this.state.patientID}
                            treatName={appt.PatientName}
                            treatAge={appt.PatientAge}
                            presentingComplaint={appt.presentingComplaint}
                            testsToBeDone={appt.testsToBeDone}
                            medicalAdvices={appt.medicalAdvices}
                            prescripRows={appt.prescripRows}
                            treatDocName={`Dr. ${appt.doctorName}`}
                            treatDocQualify={appt.doctorQualifications}
                            treatDocSpec={appt.doctorSpecialty}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
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
  auth:          state.auth,
  appointments:  state.appointments.appointments,
  patients:      state.patients.patients,
  prescriptions: state.prescriptions.prescriptions,
  doctors:       state.doctors.doctors,
  treatmentPlans:state.treatmentPlans.treatmentPlans,
});

export default connect(mapStateToProps, {
  getAppointmentsNoToken,
  getPatients,
  getPrescriptionsNoToken,
  getDoctorsNoToken,
  getTreatmentPlansNoToken,
})(ChannellingHistory);

import React, { useState, Fragment } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { patientRegister } from "../../actions/auth";
import { createMessage } from "../../actions/messages";

const EyeOpen = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
  </svg>
);
const EyeOff = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);
const AlertIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);

/* ── Password strength helper ──────────────────────── */
const getStrength = (pwd) => {
  if (!pwd) return { score: 0, label: "", color: "" };
  let score = 0;
  if (pwd.length >= 8)  score++;
  if (pwd.length >= 12) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  const labels = ["", "Very Weak", "Weak", "Fair", "Strong", "Very Strong"];
  const colors = ["", "#DC2626", "#F97316", "#EAB308", "#16A34A", "#15803D"];
  return { score, label: labels[score] || "", color: colors[score] || "" };
};

const PatientSignUp = (props) => {
  const [fields, setFields] = useState({
    first_name: "", last_name: "", email: "", password: "", password2: "",
  });
  const [showPwd, setShowPwd]   = useState(false);
  const [showPwd2, setShowPwd2] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [errors, setErrors]     = useState({});
  const [serverError, setServerError] = useState("");

  const update = (key) => (e) => {
    setFields((f) => ({ ...f, [key]: e.target.value }));
    setServerError("");
  };

  const validate = () => {
    const e = {};
    if (!fields.first_name.trim()) e.first_name = "First name is required.";
    if (!fields.last_name.trim())  e.last_name  = "Last name is required.";
    if (!fields.email)             e.email      = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(fields.email)) e.email = "Enter a valid email.";
    if (!fields.password)          e.password   = "Password is required.";
    else if (fields.password.length < 8) e.password = "Password must be at least 8 characters.";
    if (fields.password !== fields.password2) e.password2 = "Passwords do not match.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    if (!validate()) return;
    setLoading(true);
    try {
      const { first_name, last_name, email, password } = fields;
      await props.patientRegister({ first_name, last_name, email, password });
    } catch {
      setServerError("Registration failed. This email may already be in use.");
    } finally {
      setLoading(false);
    }
  };

  if (props.isAuthenticated) return <Redirect to="/home" />;

  const pwdStrength = getStrength(fields.password);

  return (
    <Fragment>
      <form id="patient-signup-form" onSubmit={onSubmit} noValidate>

        {serverError && (
          <div className="ds-auth-error">
            <AlertIcon />
            {serverError}
          </div>
        )}

        {/* Name row */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <div className="ds-form-group">
            <label className="ds-label" htmlFor="signup-fname">First Name</label>
            <input
              id="signup-fname"
              type="text"
              className={`ds-input${errors.first_name ? " ds-input--error" : ""}`}
              placeholder="Jane"
              value={fields.first_name}
              onChange={update("first_name")}
              autoComplete="given-name"
              disabled={loading}
            />
            {errors.first_name && <p className="ds-field-error">{errors.first_name}</p>}
          </div>
          <div className="ds-form-group">
            <label className="ds-label" htmlFor="signup-lname">Last Name</label>
            <input
              id="signup-lname"
              type="text"
              className={`ds-input${errors.last_name ? " ds-input--error" : ""}`}
              placeholder="Smith"
              value={fields.last_name}
              onChange={update("last_name")}
              autoComplete="family-name"
              disabled={loading}
            />
            {errors.last_name && <p className="ds-field-error">{errors.last_name}</p>}
          </div>
        </div>

        <div className="ds-form-group">
          <label className="ds-label" htmlFor="signup-email">Email Address</label>
          <input
            id="signup-email"
            type="email"
            className={`ds-input${errors.email ? " ds-input--error" : ""}`}
            placeholder="jane@example.com"
            value={fields.email}
            onChange={update("email")}
            autoComplete="email"
            disabled={loading}
          />
          {errors.email && <p className="ds-field-error">{errors.email}</p>}
        </div>

        <div className="ds-form-group">
          <label className="ds-label" htmlFor="signup-password">Password</label>
          <div className="ds-input-wrap">
            <input
              id="signup-password"
              type={showPwd ? "text" : "password"}
              className={`ds-input${errors.password ? " ds-input--error" : ""}`}
              placeholder="Min. 8 characters"
              value={fields.password}
              onChange={update("password")}
              autoComplete="new-password"
              disabled={loading}
            />
            <button type="button" className="ds-pwd-toggle" onClick={() => setShowPwd((v) => !v)} aria-label={showPwd ? "Hide" : "Show"}>
              {showPwd ? <EyeOff /> : <EyeOpen />}
            </button>
          </div>
          {/* Password strength bar */}
          {fields.password && (
            <>
              <div className="ds-pwd-strength">
                <div className="ds-pwd-strength__bar" style={{ width: `${(pwdStrength.score / 5) * 100}%`, background: pwdStrength.color }} />
              </div>
              <p className="ds-pwd-label" style={{ color: pwdStrength.color }}>{pwdStrength.label}</p>
            </>
          )}
          {errors.password && <p className="ds-field-error">{errors.password}</p>}
        </div>

        <div className="ds-form-group">
          <label className="ds-label" htmlFor="signup-password2">Confirm Password</label>
          <div className="ds-input-wrap">
            <input
              id="signup-password2"
              type={showPwd2 ? "text" : "password"}
              className={`ds-input${errors.password2 ? " ds-input--error" : ""}`}
              placeholder="Repeat password"
              value={fields.password2}
              onChange={update("password2")}
              autoComplete="new-password"
              disabled={loading}
            />
            <button type="button" className="ds-pwd-toggle" onClick={() => setShowPwd2((v) => !v)} aria-label={showPwd2 ? "Hide" : "Show"}>
              {showPwd2 ? <EyeOff /> : <EyeOpen />}
            </button>
          </div>
          {errors.password2 && <p className="ds-field-error">{errors.password2}</p>}
        </div>

        <button
          id="patient-signup-submit"
          type="submit"
          className="auth-submit-btn"
          disabled={loading}
          style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", marginTop: "0.5rem" }}
        >
          {loading ? <><span className="ds-spinner" /> Creating account…</> : "Create Account"}
        </button>

        <p className="auth-card__footer-link">
          Already have an account?{" "}
          <a href="#" onClick={(e) => { e.preventDefault(); props.signInOutSwitch(); }}>
            Sign In
          </a>
        </p>
      </form>
    </Fragment>
  );
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, { patientRegister, createMessage })(PatientSignUp);

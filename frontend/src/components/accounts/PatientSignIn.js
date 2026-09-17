import React, { useState, Fragment } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { patientLogin } from "../../actions/auth";

/* ── Eye icon SVGs ─────────────────────────────────── */
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

const PatientSignIn = (props) => {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd]   = useState(false);
  const [loading, setLoading]   = useState(false);
  const [errors, setErrors]     = useState({});
  const [serverError, setServerError] = useState("");

  const validate = () => {
    const e = {};
    if (!email)                          e.email    = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(email)) e.email   = "Enter a valid email.";
    if (!password)                       e.password = "Password is required.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    if (!validate()) return;
    setLoading(true);
    try {
      await props.patientLogin(email, password);
    } catch (err) {
      setServerError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Listen to redux auth errors coming in after previous successful validation
  const { authError } = props;
  const displayServerError = serverError || (authError && !loading ? "Incorrect email or password." : "");

  if (props.isAuthenticated) return <Redirect to="/home" />;

  return (
    <Fragment>
      <form id="patient-signin-form" onSubmit={onSubmit} noValidate>

        {/* Backend error banner */}
        {displayServerError && (
          <div className="ds-auth-error">
            <AlertIcon />
            {displayServerError}
          </div>
        )}

        <div className="ds-form-group">
          <label className="ds-label" htmlFor="patient-email">Email Address</label>
          <input
            id="patient-email"
            type="email"
            className={`ds-input${errors.email ? " ds-input--error" : ""}`}
            placeholder="you@example.com"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setServerError(""); }}
            autoComplete="email"
            disabled={loading}
          />
          {errors.email && <p className="ds-field-error">{errors.email}</p>}
        </div>

        <div className="ds-form-group">
          <label className="ds-label" htmlFor="patient-password">Password</label>
          <div className="ds-input-wrap">
            <input
              id="patient-password"
              type={showPwd ? "text" : "password"}
              className={`ds-input${errors.password ? " ds-input--error" : ""}`}
              placeholder="••••••••"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setServerError(""); }}
              autoComplete="current-password"
              disabled={loading}
            />
            <button
              type="button"
              className="ds-pwd-toggle"
              onClick={() => setShowPwd((v) => !v)}
              aria-label={showPwd ? "Hide password" : "Show password"}
            >
              {showPwd ? <EyeOff /> : <EyeOpen />}
            </button>
          </div>
          {errors.password && <p className="ds-field-error">{errors.password}</p>}
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "1.25rem" }}>
          <a href="#" style={{ fontSize: "0.875rem", color: "var(--color-primary)" }}>
            Forgot password?
          </a>
        </div>

        <button
          id="patient-signin-submit"
          type="submit"
          className="auth-submit-btn"
          disabled={loading}
          style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}
        >
          {loading ? <><span className="ds-spinner" /> Signing in…</> : "Sign In"}
        </button>

        <p className="auth-card__footer-link">
          Don't have an account?{" "}
          <a href="#" onClick={(e) => { e.preventDefault(); props.signUpSwitch(); }}>
            Create account
          </a>
        </p>
      </form>
    </Fragment>
  );
};

PatientSignIn.propTypes = {
  patientLogin:    PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
  authError:       PropTypes.bool,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  authError:       !state.auth.isAuthenticated && state.auth.isLoading === false,
});

export default connect(mapStateToProps, { patientLogin })(PatientSignIn);

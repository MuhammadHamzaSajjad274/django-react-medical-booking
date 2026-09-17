import React, { useState, Fragment } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { patientLogin } from "../../actions/auth";

const PatientSignIn = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!email) e.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = "Enter a valid email.";
    if (!password) e.password = "Password is required.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (validate()) props.patientLogin(email, password);
  };

  if (props.isAuthenticated) return <Redirect to="/home" />;

  return (
    <Fragment>
      <form id="patient-signin-form" onSubmit={onSubmit} noValidate>
        <div className="ds-form-group">
          <label className="ds-label" htmlFor="patient-email">Email Address</label>
          <input
            id="patient-email"
            type="email"
            className="ds-input"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
          {errors.email && (
            <p style={{ color: "var(--color-error)", fontSize: "0.8125rem", marginTop: "4px" }}>
              {errors.email}
            </p>
          )}
        </div>
        <div className="ds-form-group">
          <label className="ds-label" htmlFor="patient-password">Password</label>
          <input
            id="patient-password"
            type="password"
            className="ds-input"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
          {errors.password && (
            <p style={{ color: "var(--color-error)", fontSize: "0.8125rem", marginTop: "4px" }}>
              {errors.password}
            </p>
          )}
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "0.5rem" }}>
          <a href="#" style={{ fontSize: "0.875rem", color: "var(--color-primary)" }}>
            Forgot password?
          </a>
        </div>
        <button
          id="patient-signin-submit"
          type="submit"
          className="auth-submit-btn"
        >
          Sign In
        </button>
        <p className="auth-card__footer-link">
          Don't have an account?{" "}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              props.signUpSwitch();
            }}
          >
            Create account
          </a>
        </p>
      </form>
    </Fragment>
  );
};

PatientSignIn.propTypes = {
  patientLogin: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, { patientLogin })(PatientSignIn);

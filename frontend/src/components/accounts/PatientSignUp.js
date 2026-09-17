import React, { useState, Fragment } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { patientRegister } from "../../actions/auth";
import { createMessage } from "../../actions/messages";

const PatientSignUp = (props) => {
  const [fields, setFields] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    password2: "",
  });
  const [errors, setErrors] = useState({});

  const update = (key) => (e) => setFields({ ...fields, [key]: e.target.value });

  const validate = () => {
    const e = {};
    if (!fields.first_name.trim()) e.first_name = "First name is required.";
    if (!fields.last_name.trim()) e.last_name = "Last name is required.";
    if (!fields.email) e.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(fields.email)) e.email = "Enter a valid email.";
    if (!fields.password) e.password = "Password is required.";
    else if (fields.password.length < 8) e.password = "Password must be at least 8 characters.";
    if (fields.password !== fields.password2) e.password2 = "Passwords do not match.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      const { first_name, last_name, email, password } = fields;
      props.patientRegister({ first_name, last_name, email, password });
    }
  };

  if (props.isAuthenticated) return <Redirect to="/home" />;

  return (
    <Fragment>
      <form id="patient-signup-form" onSubmit={onSubmit} noValidate>
        {/* Name row */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <div className="ds-form-group">
            <label className="ds-label" htmlFor="signup-fname">First Name</label>
            <input
              id="signup-fname"
              type="text"
              className="ds-input"
              placeholder="Jane"
              value={fields.first_name}
              onChange={update("first_name")}
              autoComplete="given-name"
            />
            {errors.first_name && (
              <p style={{ color: "var(--color-error)", fontSize: "0.8rem", marginTop: "4px" }}>
                {errors.first_name}
              </p>
            )}
          </div>
          <div className="ds-form-group">
            <label className="ds-label" htmlFor="signup-lname">Last Name</label>
            <input
              id="signup-lname"
              type="text"
              className="ds-input"
              placeholder="Doe"
              value={fields.last_name}
              onChange={update("last_name")}
              autoComplete="family-name"
            />
            {errors.last_name && (
              <p style={{ color: "var(--color-error)", fontSize: "0.8rem", marginTop: "4px" }}>
                {errors.last_name}
              </p>
            )}
          </div>
        </div>
        <div className="ds-form-group">
          <label className="ds-label" htmlFor="signup-email">Email Address</label>
          <input
            id="signup-email"
            type="email"
            className="ds-input"
            placeholder="jane@example.com"
            value={fields.email}
            onChange={update("email")}
            autoComplete="email"
          />
          {errors.email && (
            <p style={{ color: "var(--color-error)", fontSize: "0.8rem", marginTop: "4px" }}>
              {errors.email}
            </p>
          )}
        </div>
        <div className="ds-form-group">
          <label className="ds-label" htmlFor="signup-password">Password</label>
          <input
            id="signup-password"
            type="password"
            className="ds-input"
            placeholder="Min. 8 characters"
            value={fields.password}
            onChange={update("password")}
            autoComplete="new-password"
          />
          {errors.password && (
            <p style={{ color: "var(--color-error)", fontSize: "0.8rem", marginTop: "4px" }}>
              {errors.password}
            </p>
          )}
        </div>
        <div className="ds-form-group">
          <label className="ds-label" htmlFor="signup-password2">Confirm Password</label>
          <input
            id="signup-password2"
            type="password"
            className="ds-input"
            placeholder="Repeat password"
            value={fields.password2}
            onChange={update("password2")}
            autoComplete="new-password"
          />
          {errors.password2 && (
            <p style={{ color: "var(--color-error)", fontSize: "0.8rem", marginTop: "4px" }}>
              {errors.password2}
            </p>
          )}
        </div>
        <button id="patient-signup-submit" type="submit" className="auth-submit-btn" style={{ marginTop: "0.5rem" }}>
          Create Account
        </button>
        <p className="auth-card__footer-link">
          Already have an account?{" "}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              props.signInOutSwitch();
            }}
          >
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

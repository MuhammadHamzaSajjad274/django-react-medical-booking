import React, { useState, Fragment } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { staffLogin } from "../../actions/auth";

const StaffSignIn = (props) => {
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
    if (validate()) props.staffLogin(email, password);
  };

  if (props.isAuthenticated) return <Redirect to="/staff_home" />;

  return (
    <Fragment>
      <form id="staff-signin-form" onSubmit={onSubmit} noValidate>
        <div className="ds-form-group">
          <label className="ds-label" htmlFor="staff-email">Email Address</label>
          <input
            id="staff-email"
            type="email"
            className="ds-input"
            placeholder="staff@edoc.health"
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
          <label className="ds-label" htmlFor="staff-password">Password</label>
          <input
            id="staff-password"
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
          <a href="#" style={{ fontSize: "0.875rem", color: "#7C3AED" }}>
            Forgot password?
          </a>
        </div>
        <button
          id="staff-signin-submit"
          type="submit"
          className="auth-submit-btn auth-submit-btn--staff"
        >
          Sign In as Staff
        </button>
      </form>
    </Fragment>
  );
};

StaffSignIn.propTypes = {
  staffLogin: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, { staffLogin })(StaffSignIn);

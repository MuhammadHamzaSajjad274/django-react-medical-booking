import React, { useState, useEffect } from "react";
import "../layout/css/NavbarStyle.css";
import companyLogo from "../layout/images/logo5.png";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { logout } from "../../actions/auth";

const Navbar = (props) => {
  const { isAuthenticated, user } = props.auth;
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // On the homepage (not authenticated), start transparent; turn white on scroll
  const isHomepage = !isAuthenticated;
  const navClass = [
    "edoc-navbar",
    isHomepage && !scrolled ? "edoc-navbar--transparent" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const authLinks = (
    <div className="edoc-navbar__actions">
      <span className="edoc-navbar__user-greeting">
        {user ? `Hi, ${user.first_name}` : ""}
      </span>
      <button
        className="ds-btn ds-btn-secondary ds-btn-sm"
        onClick={() => {
          props.logout();
          window.location.href = "/";
        }}
      >
        Logout
      </button>
    </div>
  );

  const guestLinks = (
    <div className="edoc-navbar__actions">
      <button
        className="ds-btn ds-btn-secondary ds-btn-sm"
        onClick={() => props.signInOutSwitch()}
      >
        Login
      </button>
      <button
        className="ds-btn ds-btn-primary ds-btn-sm"
        onClick={() => props.signUpSwitch()}
      >
        Register
      </button>
    </div>
  );

  return (
    <nav className={navClass} role="navigation" aria-label="Main navigation">
      <div className="edoc-navbar__inner">
        {/* Brand */}
        <a className="edoc-navbar__brand" href="/" aria-label="eDoc Home">
          <img
            src={companyLogo}
            alt="eDoc Logo"
            className="edoc-navbar__brand-logo"
          />
          <span className="edoc-navbar__brand-name">eDoc</span>
        </a>

        {/* Nav links — only show on homepage (guest) */}
        {!isAuthenticated && (
          <ul className="edoc-navbar__nav" role="list">
            <li>
              <a href="#services" className="edoc-navbar__link">
                Services
              </a>
            </li>
            <li>
              <a href="#doctors" className="edoc-navbar__link">
                Our Doctors
              </a>
            </li>
            <li>
              <a href="#about" className="edoc-navbar__link">
                About
              </a>
            </li>
            <li>
              <a href="#contact" className="edoc-navbar__link">
                Contact
              </a>
            </li>
          </ul>
        )}

        {/* Auth actions */}
        {!props.isDoctorMode && !props.isStaffMode
          ? isAuthenticated
            ? authLinks
            : guestLinks
          : null}
      </div>
    </nav>
  );
};

Navbar.propTypes = {
  auth: PropTypes.object.isRequired,
  logout: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { logout })(Navbar);

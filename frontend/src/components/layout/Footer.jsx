import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import {
  MapPin,
  Phone,
  Mail,
  ArrowRight,
  Building2,
  CheckCircle,
} from "lucide-react";
import { SITE, whatsappLink } from "../../config/site";
import "../../styles/components/layout/Footer.css";

const socialLinks = [
  {
    label: "Instagram",
    href: "https://instagram.com",
    hoverColor: "#E1306C",
    icon: (
      <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069z" />
      </svg>
    ),
  },
  {
    label: "Facebook",
    href: "https://facebook.com",
    hoverColor: "#1877F2",
    icon: (
      <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12S0 5.446 0 12.073c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    label: "YouTube",
    href: "https://youtube.com",
    hoverColor: "#FF0000",
    icon: (
      <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
        <path d="M23.495 6.205a3.007 3.007 0 0 0-2.088-2.088C19.537 3.616 12 3.616 12 3.616s-7.507 0-9.396.501A3.007 3.007 0 0 0 .516 6.205 31.247 31.247 0 0 0 0 12a31.247 31.247 0 0 0 .516 5.795 3.007 3.007 0 0 0 2.088 2.088C4.493 20.384 12 20.384 12 20.384s7.537 0 9.407-.501a3.007 3.007 0 0 0 2.088-2.088A31.247 31.247 0 0 0 24 12a31.247 31.247 0 0 0-.505-5.795zM9.75 15.568V8.432L15.818 12 9.75 15.568z" />
      </svg>
    ),
  },
  {
    label: "WhatsApp",
    href: whatsappLink("Hi, I am interested in a verified property. Please share details."),
    hoverColor: "#25D366",
    icon: (
      <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.52 3.48A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892a11.9 11.9 0 0 0 1.588 5.945L0 24l6.305-1.654a11.88 11.88 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.82 11.82 0 0 0 20.52 3.48z" />
      </svg>
    ),
  },
];

const Footer = () => {
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  if (
    location.pathname.startsWith("/admin") ||
    location.pathname.startsWith("/login")
  ) {
    return null;
  }

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setEmail("");
  };

  return (
    <footer className="footer-section text-white">
      {/* TOP CTA */}
      <div className="footer-cta-bar">
        <Container fluid className="px-lg-5">
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-4">
            <div className="d-flex align-items-center gap-3">
              <Building2 size={32} className="text-white" />
              <div>
                <h5 className="fw-bold mb-1 text-white">
                  Ready to find your dream property?
                </h5>
                <p className="mb-0 small" style={{ color: "rgba(255,255,255,0.65)" }}>
                  Talk to our experts today for FREE consultation.
                </p>
              </div>
            </div>

            <div className="d-flex gap-3 flex-wrap">
              <a
                href={`tel:${SITE.phoneHref}`}
                className="btn btn-light fw-bold rounded-pill px-4"
                style={{ color: "var(--primary)" }}
              >
                <Phone size={16} className="me-2" />
                Call Now
              </a>

              <Link
                to="/contact"
                className="btn btn-outline-light fw-bold rounded-pill px-4"
              >
                Get Callback
              </Link>
            </div>
          </div>
        </Container>
      </div>

      {/* MAIN FOOTER */}
      <Container fluid className="px-lg-5 py-5">
        <Row className="g-5">
          {/* COMPANY */}
          <Col lg={4}>
            <h3 className="fw-bold mb-3" style={{ fontFamily: "var(--font-heading)" }}>
              <span style={{ color: "var(--accent)" }}>EASY</span>
              <span className="text-white">COLONIZER</span>
            </h3>

            <div className="mb-4">
              <span
                className="badge px-3 py-2 rounded-pill"
                style={{ background: "rgba(158,231,221,0.16)", color: "var(--accent)", border: "1px solid rgba(158,231,221,0.32)" }}
              >
                RERA VERIFIED
              </span>
            </div>

            <p className="mb-4" style={{ color: "rgba(232,251,248,0.74)", lineHeight: 1.8 }}>
              Bhopal's trusted real estate partner for plots, villas,
              apartments, row houses &amp; commercial investments.
            </p>

            {/* TRUST BADGES */}
            <div className="d-flex flex-column gap-2 mb-4">
              {["RERA Approved Projects", "5000+ Happy Families", "12+ Years Experience"].map(
                (item, i) => (
                  <div key={i} className="d-flex align-items-center gap-2">
                    <CheckCircle size={16} className="text-success" />
                    <span style={{ color: "rgba(232,251,248,0.82)" }}>{item}</span>
                  </div>
                )
              )}
            </div>

            {/* SOCIALS */}
            <div className="d-flex gap-3 flex-wrap">
              {socialLinks.map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  title={social.label}
                  className="footer-social-icon"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = social.hoverColor;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(158,231,221,0.12)";
                  }}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </Col>

          {/* PROPERTY TYPES */}
          <Col lg={4} md={6}>
            <h5 className="fw-bold mb-4 text-uppercase" style={{ color: "white", letterSpacing: "1px" }}>
              Property Types
            </h5>

            <ul className="list-unstyled d-flex flex-column gap-3">
              {["Plots", "Flats / Apartments", "Villas", "Row Houses", "Commercial", "Buildings"].map(
                (item, i) => (
                  <li key={i}>
                    <Link to="/projects" className="footer-link">
                      <ArrowRight size={14} className="me-2" />
                      {item}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </Col>

          {/* CONTACT */}
          <Col lg={4} md={6}>
            <h5 className="fw-bold mb-4 text-uppercase" style={{ color: "white", letterSpacing: "1px" }}>
              Contact Info
            </h5>

            <div className="d-flex flex-column gap-4">
              <div className="d-flex gap-3">
                <MapPin size={20} style={{ color: "var(--accent)" }} className="flex-shrink-0 mt-1" />
                <span style={{ color: "rgba(232,251,248,0.82)" }}>{SITE.address}</span>
              </div>

              <div className="d-flex gap-3 align-items-center">
                <Phone size={20} style={{ color: "var(--accent)" }} />
                <a href={`tel:${SITE.phoneHref}`} style={{ color: "rgba(232,251,248,0.82)", textDecoration: "none" }}>
                  {SITE.phoneDisplay}
                </a>
              </div>

              <div className="d-flex gap-3 align-items-center">
                <Mail size={20} style={{ color: "var(--accent)" }} />
                <a href={`mailto:${SITE.email}`} style={{ color: "rgba(232,251,248,0.82)", textDecoration: "none" }}>
                  {SITE.email}
                </a>
              </div>
            </div>

            {/* NEWSLETTER */}
            <div className="mt-5">
              <h6 className="fw-bold mb-3 text-white">Subscribe for Updates</h6>

              {subscribed ? (
                <div className="d-flex align-items-center gap-2 text-success">
                  <CheckCircle size={18} />
                  <span>Subscribed Successfully!</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="d-flex">
                  <input
                    type="email"
                    className="form-control footer-newsletter-input"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <button type="submit" className="btn footer-newsletter-btn">
                    Join
                  </button>
                </form>
              )}
            </div>
          </Col>
        </Row>

        {/* BOTTOM */}
        <div className="mt-5 pt-4 d-flex flex-wrap justify-content-between align-items-center gap-3 footer-divider">
          <p className="mb-0" style={{ color: "rgba(232,251,248,0.65)", fontSize: "0.88rem" }}>
            © 2026 <strong className="text-white">Easy Colonizer</strong>. All rights reserved.
          </p>

          <div className="d-flex gap-4 flex-wrap">
            {["Privacy Policy", "Terms of Service", "RERA Disclosure"].map((item, i) => (
              <span key={i} style={{ color: "rgba(232,251,248,0.65)", cursor: "pointer", fontSize: "0.88rem" }}>
                {item}
              </span>
            ))}
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;

import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import {
  MapPin,
  Phone,
  Mail,
  ArrowRight,
  Building2
} from "lucide-react";
import { FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn, FaWhatsapp } from "react-icons/fa";
import { SITE, whatsappLink } from "../../config/site";
import { useTenant } from "../../context/TenantContext";
import "../../styles/components/layout/Footer.css";

const Footer = () => {
  const location = useLocation();
  const { tenant } = useTenant();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  if (
    location.pathname.startsWith("/admin") ||
    location.pathname.startsWith("/login")
  ) {
    return null;
  }

  const footerStyle = tenant?.settings?.layout?.footerStyle || "classic";
  const brandName = tenant?.name || "Easy Colonizer";
  const contactInfo = tenant?.contactInfo || SITE;
  const socialLinks = tenant?.socialLinks || {};
  const footerBg = tenant?.theme?.footerBgColor || "#0a0d27";

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setEmail("");
  };

  const renderSocialLinks = () => {
    const links = [];
    if (socialLinks.facebook) links.push({ icon: <FaFacebookF size={18} />, href: socialLinks.facebook });
    if (socialLinks.instagram) links.push({ icon: <FaInstagram size={18} />, href: socialLinks.instagram });
    if (socialLinks.twitter) links.push({ icon: <FaTwitter size={18} />, href: socialLinks.twitter });
    if (socialLinks.linkedin) links.push({ icon: <FaLinkedinIn size={18} />, href: socialLinks.linkedin });
    
    // Default WhatsApp if no social links
    if (links.length === 0) {
      links.push({ 
        icon: <FaWhatsapp size={18} />, 
        href: whatsappLink("Hi, I'm interested in your properties.") 
      });
    }

    return links.map((social, i) => (
      <a key={i} href={social.href} target="_blank" rel="noopener noreferrer" className="footer-social-icon">
        {social.icon}
      </a>
    ));
  };

  // --- STYLE 1: CLASSIC ---
  if (footerStyle === "classic") {
    return (
      <footer className="footer-section text-white" style={{ "--footer-bg": footerBg }}>
        <div className="footer-cta-bar" style={{ background: `linear-gradient(90deg, var(--primary) 0%, ${footerBg} 100%)` }}>
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
                <a href={`tel:${contactInfo.phone || SITE.phoneHref}`} className="btn btn-light fw-bold rounded-pill px-4" style={{ color: "var(--primary)" }}>
                  <Phone size={16} className="me-2" /> Call Now
                </a>
                <Link to="/contact" className="btn btn-outline-light fw-bold rounded-pill px-4">
                  Get Callback
                </Link>
              </div>
            </div>
          </Container>
        </div>

        <Container fluid className="px-lg-5 py-5">
          <Row className="g-5">
            <Col lg={4}>
              <h3 className="fw-bold mb-3" style={{ fontFamily: "var(--font-heading)" }}>
                <span style={{ color: "var(--secondary)" }}>{brandName.split(" ")[0]}</span>
                {" "}
                <span className="text-white">{brandName.split(" ").slice(1).join(" ")}</span>
              </h3>
              <p className="mb-4" style={{ color: "rgba(232,251,248,0.74)", lineHeight: 1.8 }}>
                Your trusted real estate partner for plots, villas, apartments & commercial investments.
              </p>
              <div className="d-flex gap-3 flex-wrap">
                {renderSocialLinks()}
              </div>
            </Col>
            <Col lg={4} md={6}>
              <h5 className="fw-bold mb-4 text-uppercase">Property Types</h5>
              <ul className="list-unstyled d-flex flex-column gap-3">
                {["Plots", "Flats", "Villas", "Commercial"].map((item, i) => (
                  <li key={i}><Link to="/projects" className="footer-link"><ArrowRight size={14} className="me-2" />{item}</Link></li>
                ))}
              </ul>
            </Col>
            <Col lg={4} md={6}>
              <h5 className="fw-bold mb-4 text-uppercase">Contact Info</h5>
              <div className="d-flex flex-column gap-3">
                <div className="d-flex gap-3"><MapPin size={20} style={{ color: "var(--secondary)" }} /><span>{contactInfo.address || SITE.address}</span></div>
                <div className="d-flex gap-3"><Phone size={20} style={{ color: "var(--secondary)" }} /><span>{contactInfo.phone || SITE.phoneDisplay}</span></div>
                <div className="d-flex gap-3"><Mail size={20} style={{ color: "var(--secondary)" }} /><span>{contactInfo.email || SITE.email}</span></div>
              </div>
            </Col>
          </Row>
          <div className="mt-5 pt-4 d-flex justify-content-between align-items-center footer-divider">
            <p className="mb-0 small">© 2026 <strong>{brandName}</strong>. All rights reserved.</p>
          </div>
        </Container>
      </footer>
    );
  }

  // --- STYLE 2: MODERN MINIMAL ---
  if (footerStyle === "modern") {
    return (
      <footer className="footer-section py-5 text-white text-center" style={{ "--footer-bg": footerBg }}>
        <Container>
          <h3 className="fw-bold mb-4" style={{ fontFamily: "var(--font-heading)" }}>
            <span style={{ color: "var(--secondary)" }}>{brandName}</span>
          </h3>
          <div className="d-flex justify-content-center gap-4 mb-4 flex-wrap">
            <Link to="/" className="text-white text-decoration-none">Home</Link>
            <Link to="/projects" className="text-white text-decoration-none">Projects</Link>
            <Link to="/about" className="text-white text-decoration-none">About</Link>
            <Link to="/contact" className="text-white text-decoration-none">Contact</Link>
          </div>
          <div className="d-flex justify-content-center gap-3 mb-4">
            {renderSocialLinks()}
          </div>
          <hr style={{ opacity: 0.1 }} />
          <p className="mb-0 small opacity-50">© 2026 {brandName}. Built with Trust.</p>
        </Container>
      </footer>
    );
  }

  // --- STYLE 3: CORPORATE ---
  return (
    <footer className="footer-section text-white py-5 border-top border-secondary border-opacity-25" style={{ "--footer-bg": footerBg }}>
      <Container fluid className="px-lg-5">
        <Row className="g-4 mb-5">
          <Col lg={3}>
            <div className="p-4 rounded-4" style={{ background: "rgba(255,255,255,0.03)" }}>
              <h5 className="fw-bold mb-3 text-white">Call Us</h5>
              <p className="h5 mb-0" style={{ color: "var(--secondary)" }}>{contactInfo.phone || SITE.phoneDisplay}</p>
            </div>
          </Col>
          <Col lg={6}>
            <div className="p-4 rounded-4 text-center" style={{ background: "rgba(255,255,255,0.03)" }}>
              <h5 className="fw-bold mb-2 text-white">Visit Our Office</h5>
              <p className="mb-0 opacity-75">{contactInfo.address || SITE.address}</p>
            </div>
          </Col>
          <Col lg={3}>
            <div className="p-4 rounded-4 text-end" style={{ background: "rgba(255,255,255,0.03)" }}>
              <h5 className="fw-bold mb-3 text-white">Email Us</h5>
              <p className="h6 mb-0 opacity-75">{contactInfo.email || SITE.email}</p>
            </div>
          </Col>
        </Row>
        <div className="d-flex justify-content-center gap-3 mb-4">
          {renderSocialLinks()}
        </div>
        <div className="text-center pt-4 border-top border-white border-opacity-10">
          <p className="mb-0 small opacity-50">© 2026 {brandName} | Authorized RERA Channel Partner</p>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;

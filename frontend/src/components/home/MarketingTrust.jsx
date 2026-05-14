import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import {
  ShieldCheck,
  Zap,
  HeartHandshake,
  BadgePercent,
  Clock,
  Headphones,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import "../../styles/components/home/MarketingTrust.css";

const features = [
  {
    icon: <ShieldCheck size={28} />,
    title: "100% Verified Properties",
    description:
      "Every listing undergoes a multi-step verification process for legal and physical accuracy.",
  },
  {
    icon: <BadgePercent size={28} />,
    title: "Lowest Price Guarantee",
    description:
      "We negotiate directly with builders to ensure you get the absolute best market price.",
  },
  {
    icon: <Zap size={28} />,
    title: "Instant Site Visits",
    description:
      "Book a visit today and our expert advisors will arrange a personalized tour within 24 hours.",
  },
  {
    icon: <HeartHandshake size={28} />,
    title: "Zero Brokerage",
    description:
      "Buy your dream home or plot without paying any brokerage fees — ever.",
  },
  {
    icon: <Clock size={28} />,
    title: "Hassle-free Documentation",
    description:
      "From registry to home loans, our legal team handles all the paperwork.",
  },
  {
    icon: <Headphones size={28} />,
    title: "Expert Assistance",
    description:
      "Our dedicated relationship managers are available 24/7 for your queries.",
  },
];

const MarketingTrust = () => {
  const navigate = useNavigate();

  return (
    <section className="marketing-trust-section">
      <Container fluid className="px-lg-5">
        {/* Header */}
        <div className="text-center mb-5" data-aos="fade-up">
          <span className="section-badge">Our Promise</span>

          <h2 className="section-heading mt-3">
            Your Most <span className="text-gradient">Trusted Partner</span>
          </h2>

          <p className="section-subheading mt-3">
            Helping families discover verified properties with complete
            transparency, zero brokerage and expert guidance.
          </p>
        </div>

        {/* Feature Cards */}
        <Row className="g-4">
          {features.map((feature, index) => (
            <Col
              key={index}
              lg={4} md={6}
              data-aos="fade-up"
              data-aos-delay={index * 80}
            >
              <div className="trust-card">
                <div className="trust-icon-wrap">{feature.icon}</div>
                <h5 className="trust-title">{feature.title}</h5>
                <p className="trust-desc">{feature.description}</p>
              </div>
            </Col>
          ))}
        </Row>

        {/* CTA Banner */}
        <div className="trust-cta-banner mt-5 text-center" data-aos="zoom-in">
          <h2 className="fw-bold text-white mb-3">
            Ready To Find Your Dream Property?
          </h2>

          <p className="text-white mb-4" style={{ opacity: 0.8, maxWidth: 600, margin: "0 auto 24px" }}>
            Join thousands of happy families who trusted Easy Colonizer
            for verified plots, flats, villas and premium projects.
          </p>

          <div className="d-flex justify-content-center gap-3 flex-wrap">
            <Button
              size="lg"
              variant="light"
              className="rounded-pill px-5 fw-bold"
              style={{ color: "var(--primary)" }}
              onClick={() => navigate("/contact")}
            >
              Contact Sales
            </Button>

            <Button
              size="lg"
              variant="outline-light"
              className="rounded-pill px-5 fw-bold d-flex align-items-center gap-2"
              onClick={() => navigate("/projects")}
            >
              View Projects
              <ArrowRight size={18} />
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default MarketingTrust;

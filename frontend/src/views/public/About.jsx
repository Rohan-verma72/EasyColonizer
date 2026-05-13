import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Shield, Target, Users, CheckCircle } from "lucide-react";

const About = () => {
  return (
    <div className="page-wrapper bg-white text-dark min-vh-100">
      {/* HERO SECTION */}
      <div className="bg-light pt-5 pb-4 mb-5 border-bottom">
        <Container>
          <Row className="justify-content-center text-center">
            <Col lg={8}>
              <h1 className="display-3 fw-bold mb-3">
                About <span className="text-primary">Us</span>
              </h1>

              <p className="lead text-secondary">
                We are dedicated to revolutionizing the real estate industry in
                Bhopal by providing transparency, efficiency, and trust in every
                property transaction.
              </p>
            </Col>
          </Row>
        </Container>
      </div>

      <Container className="pb-5">
        {/* VALUES SECTION */}
        <Row className="g-4 mb-5">
          <Col md={4}>
            <div className="p-4 bg-white rounded-4 h-100 border shadow-sm">
              <div className="bg-primary bg-opacity-10 p-3 rounded-circle d-inline-flex mb-3">
                <Shield className="text-primary" size={32} />
              </div>

              <h3 className="h4 fw-bold mb-3">Our Mission</h3>

              <p className="text-secondary mb-0">
                To provide high-quality plots and commercial spaces that empower
                people to build their dreams on solid foundations.
              </p>
            </div>
          </Col>

          <Col md={4}>
            <div className="p-4 bg-white rounded-4 h-100 border shadow-sm">
              <div className="bg-warning bg-opacity-10 p-3 rounded-circle d-inline-flex mb-3">
                <Target className="text-warning" size={32} />
              </div>

              <h3 className="h4 fw-bold mb-3">Our Vision</h3>

              <p className="text-secondary mb-0">
                To become Central India's most trusted real estate platform
                known for transparency and verified property listings.
              </p>
            </div>
          </Col>

          <Col md={4}>
            <div className="p-4 bg-white rounded-4 h-100 border shadow-sm">
              <div className="bg-success bg-opacity-10 p-3 rounded-circle d-inline-flex mb-3">
                <Users className="text-success" size={32} />
              </div>

              <h3 className="h4 fw-bold mb-3">Our Values</h3>

              <p className="text-secondary mb-0">
                Integrity, Customer-Centricity, and Innovation are at the core
                of everything we do at Easy Colonizer.
              </p>
            </div>
          </Col>
        </Row>

        {/* MAIN SECTION */}
        <Row className="align-items-center g-5">
          <Col lg={6}>
            <div className="position-relative">
              <img
                src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                alt="Real Estate"
                className="img-fluid rounded-4 shadow-lg w-100"
                style={{
                  height: "500px",
                  objectFit: "cover",
                }}
              />

              <div
                className="position-absolute bg-primary text-white p-4 rounded-4 shadow"
                style={{
                  bottom: "20px",
                  right: "20px",
                }}
              >
                <h2 className="fw-bold mb-0">15+</h2>
                <p className="small fw-bold mb-0">Years of Trust</p>
              </div>
            </div>
          </Col>

          <Col lg={6}>
            <h6 className="text-primary fw-bold text-uppercase mb-2">
              Since 2008
            </h6>

            <h2 className="display-6 fw-bold mb-4">
              Why Bhopal Trusts <br />
              Easy Colonizer?
            </h2>

            <p className="text-secondary fs-5 mb-4">
              With years of experience in the real estate market, we understand
              that buying a property is one of the most significant decisions of
              your life.
            </p>

            <Row className="g-3">
              {[
                "100% Verified Properties",
                "Legal Assistance & Documentation",
                "Transparent Pricing",
                "Prime Locations",
                "Fast Track Possession",
                "Expert Consultation Services",
              ].map((item, index) => (
                <Col sm={6} key={index}>
                  <div className="d-flex align-items-start gap-2">
                    <CheckCircle
                      size={18}
                      className="text-success mt-1"
                    />

                    <span className="text-secondary fw-medium">
                      {item}
                    </span>
                  </div>
                </Col>
              ))}
            </Row>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default About;
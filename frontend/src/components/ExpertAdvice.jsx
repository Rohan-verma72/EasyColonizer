import React from "react";
import { Container, Row, Col, Card, Button, Badge } from "react-bootstrap";
import {
  Phone,
  MessageCircle,
  Star,
  UserCheck,
} from "lucide-react";
import { SITE, whatsappLink } from "../config/site";
const ExpertAdvice = () => {
  const experts = [
    {
      name: "Rajesh Sharma",
      role: "Investment Specialist",
      exp: "12+ Years",
      rating: 4.9,
      phone: SITE.phoneHref,
      image:
        "https://images.unsplash.com/photo-1560250097-0b93528c311a?fit=crop&w=200&h=200&q=80",
      tags: ["Luxury Plots", "RERA Expert"],
    },
    {
      name: "Priya Verma",
      role: "Residential Advisor",
      exp: "8+ Years",
      rating: 4.8,
      phone: SITE.phoneHref,
      image:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?fit=crop&w=200&h=200&q=80",
      tags: ["Apartments", "Home Loans"],
    },
    {
      name: "Anil Gupta",
      role: "Commercial Consultant",
      exp: "15+ Years",
      rating: 5.0,
      phone: SITE.phoneHref,
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?fit=crop&w=200&h=200&q=80",
      tags: ["Retail Space", "High ROI"],
    },
  ];

  const handleCall = (phone) => {
    window.open(`tel:${phone}`, "_self");
  };

  const handleWhatsApp = (expert) => {
    const text = `Hi ${expert.name}, I need expert advice regarding property investment. Please guide me.`;

    window.open(whatsappLink(text), "_blank");
  };

  return (
    <section className="py-5 bg-light overflow-hidden">
      <Container fluid className="px-lg-5">
        {/* Heading */}
        <Row className="align-items-center mb-5 g-4">
          <Col lg={6} data-aos="fade-right">
            <Badge
              bg="warning"
              text="dark"
              className="mb-3 px-3 py-2 rounded-pill fw-semibold"
            >
              <UserCheck size={16} className="me-2" />
              EXPERT GUIDANCE
            </Badge>

            <h2 className="display-6 fw-bold text-dark mb-3">
              Consult with{" "}
              <span className="text-primary">Professionals</span>
            </h2>

            <p className="text-muted fs-5 mb-0">
              Get personalized advice from certified real estate experts
              to make smarter investment decisions with confidence.
            </p>
          </Col>

          <Col
            lg={6}
            className="text-lg-end"
            data-aos="fade-left"
          >
            <Button
              variant="outline-primary"
              size="lg"
              className="rounded-pill px-4 fw-semibold"
            >
              View All Experts
            </Button>
          </Col>
        </Row>

        {/* Experts */}
        <Row className="g-4 justify-content-center">
          {experts.map((expert, index) => (
            <Col
              key={index}
              xl={4}
              lg={4}
              md={6}
              sm={12}
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <Card className="expert-card border-0 shadow-sm rounded-4 overflow-hidden h-100">
                <Card.Body className="p-4 d-flex flex-column">
                  {/* Top */}
                  <div className="d-flex align-items-center gap-3 mb-4">
                    <div className="expert-image-container">
                      <img
                        src={expert.image}
                        alt={expert.name}
                        className="expert-image rounded-circle border border-3 border-white shadow-sm"
                        loading="lazy"
                      />

                      <span className="online-indicator"></span>
                    </div>

                    <div className="flex-grow-1">
                      <h5 className="fw-bold mb-1 text-dark">
                        {expert.name}
                      </h5>

                      <p className="text-primary small fw-bold mb-1">
                        {expert.role}
                      </p>

                      <div className="d-flex align-items-center gap-1 small">
                        <Star
                          size={14}
                          fill="currentColor"
                          className="text-warning"
                        />

                        <span className="fw-bold text-dark">
                          {expert.rating}
                        </span>

                        <span className="text-muted">
                          ({expert.exp} Exp)
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="d-flex flex-wrap gap-2 mb-4">
                    {expert.tags.map((tag) => (
                      <Badge
                        key={tag}
                        bg="light"
                        text="dark"
                        className="px-3 py-2 rounded-pill border fw-medium"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {/* Buttons */}
                  <div className="d-flex gap-2 mt-auto">
                    <Button
                      variant="primary"
                      className="flex-grow-1 rounded-3 py-2 fw-semibold d-flex align-items-center justify-content-center gap-2"
                      onClick={() => handleCall(expert.phone)}
                    >
                      <Phone size={18} />
                      Call Now
                    </Button>

                    <Button
                      variant="outline-success"
                      className="rounded-3 px-3 d-flex align-items-center justify-content-center"
                      onClick={() => handleWhatsApp(expert)}
                    >
                      <MessageCircle size={20} />
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      {/* Styles */}
      <style>{`
        .expert-card {
          transition: all 0.35s ease;
          border: 1px solid rgba(0,0,0,0.05);
        }

        .expert-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 18px 40px rgba(0,0,0,0.10) !important;
          border-color: rgba(13,110,253,0.15);
        }

        .expert-image-container {
          position: relative;
          flex-shrink: 0;
        }

        .expert-image {
          width: 80px;
          height: 80px;
          object-fit: cover;
        }

        .online-indicator {
          position: absolute;
          bottom: 6px;
          right: 6px;
          width: 15px;
          height: 15px;
          background: #22c55e;
          border: 3px solid #fff;
          border-radius: 50%;
        }

        @media (max-width: 768px) {
          .expert-card {
            padding: 0.5rem;
          }

          .expert-image {
            width: 70px;
            height: 70px;
          }
        }
      `}</style>
    </section>
  );
};

export default ExpertAdvice;
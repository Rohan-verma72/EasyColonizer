// MarketTrends.jsx

import React from "react";
import { Container, Row, Col, Card, Badge } from "react-bootstrap";
import { TrendingUp, ArrowUpRight, MapPin } from "lucide-react";

const MarketTrends = () => {
  const trends = [
    {
      location: "Kolar Road, Bhopal",
      growth: "+18.5%",
      avgPrice: "Rs 3,200/sqft",
      color: "primary",
    },
    {
      location: "Arera Colony, Bhopal",
      growth: "+6.2%",
      avgPrice: "Rs 8,500/sqft",
      color: "dark",
    },
    {
      location: "Hoshangabad Rd, Bhopal",
      growth: "+14.1%",
      avgPrice: "Rs 3,800/sqft",
      color: "secondary",
    },
    {
      location: "Ayodhya Bypass, Bhopal",
      growth: "+12.4%",
      avgPrice: "Rs 4,500/sqft",
      color: "success",
    },
  ];

  return (
    <section className="py-5 bg-white overflow-hidden">
      <Container>
        <div className="text-center mb-5" data-aos="fade-up">
          <Badge bg="primary" className="mb-2 px-3 py-2 rounded-pill">
            <TrendingUp size={16} className="me-1" />
            REAL-TIME INSIGHTS
          </Badge>

          <h2 className="display-6 fw-bold">
            Market <span className="text-primary">Trends</span>
          </h2>

          <p className="text-muted">
            Stay ahead with property price appreciation data in top locations.
          </p>
        </div>

        <Row className="g-4">
          {trends.map((trend, index) => (
            <Col
              key={index}
              lg={3}
              md={6}
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <Card className="border-0 shadow-sm rounded-4 h-100 hover-lift bg-light">
                <Card.Body className="p-4">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div className="icon-box p-2 bg-white rounded-3 shadow-sm text-primary">
                      <MapPin size={24} />
                    </div>

                    <Badge
                      bg={trend.color}
                      className="rounded-pill px-3 py-1"
                    >
                      <ArrowUpRight size={14} /> {trend.growth}
                    </Badge>
                  </div>

                  <h5 className="fw-bold mb-1">{trend.location}</h5>

                  <p className="text-muted small mb-3">
                    Average Appreciation
                  </p>

                  <div className="d-flex align-items-baseline gap-2">
                    <h4 className="fw-bold text-dark mb-0">
                      {trend.avgPrice}
                    </h4>

                    <span className="small text-muted">avg.</span>
                  </div>

                  <div
                    className="trend-line mt-4 position-relative"
                    style={{ height: "40px" }}
                  >
                    <svg
                      viewBox="0 0 100 40"
                      className="w-100 h-100 overflow-visible"
                    >
                      <path
                        d="M0 35 Q 25 35, 50 20 T 100 5"
                        fill="none"
                        stroke={`var(--bs-${trend.color})`}
                        strokeWidth="3"
                        strokeLinecap="round"
                      />

                      <circle
                        cx="100"
                        cy="5"
                        r="3"
                        fill={`var(--bs-${trend.color})`}
                      />
                    </svg>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        <div
          className="mt-5 p-4 bg-primary bg-opacity-10 rounded-4 text-center"
          data-aos="zoom-in"
        >
          <p className="mb-0 fw-medium">
            <span className="badge bg-primary me-2">PRO TIP</span>

            Investing in{" "}
            <span className="fw-bold">
              Plots on Kolar Road, Bhopal
            </span>{" "}
            has shown the highest ROI of 22% in the last 24 months.

            <a
              href="#properties-section"
              className="text-primary ms-2 fw-bold text-decoration-none"
            >
              View Bhopal Plots <ArrowUpRight size={16} />
            </a>
          </p>
        </div>
      </Container>

      <style>{`
        .hover-lift {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .hover-lift:hover {
          transform: translateY(-8px);
          box-shadow: 0 15px 30px rgba(0,0,0,0.1) !important;
        }

        .trend-line path {
          filter: drop-shadow(0 4px 4px rgba(0,0,0,0.1));
          stroke-dasharray: 200;
          stroke-dashoffset: 200;
          animation: drawTrend 2s ease forwards;
        }

        @keyframes drawTrend {
          to {
            stroke-dashoffset: 0;
          }
        }
      `}</style>
    </section>
  );
};

export default MarketTrends;
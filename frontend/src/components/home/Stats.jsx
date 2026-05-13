import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Building2, Users, MapPin, Award } from "lucide-react";
import "../../styles/components/home/Stats.css";

const Stats = () => {
  const stats = [
    { icon: <Building2 size={34} />, value: "150+", label: "Verified Projects" },
    { icon: <Users size={34} />,     value: "5000+", label: "Happy Families" },
    { icon: <MapPin size={34} />,    value: "25+",   label: "Prime Locations" },
    { icon: <Award size={34} />,     value: "12+",   label: "Years of Trust" },
  ];

  return (
    <section className="stats-section">
      <Container fluid className="px-lg-5">
        <Row className="g-4 justify-content-center">
          {stats.map((stat, index) => (
            <Col
              key={index}
              lg={3} md={6} sm={6} xs={12}
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <div className="stat-card">
                <div className="stat-icon">{stat.icon}</div>
                <div className="stat-number">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

export default Stats;

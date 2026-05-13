import { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Badge,
  Button,
  Spinner,
} from "react-bootstrap";
import {
  TrendingUp,
  MapPin,
  ArrowUpRight,
  Maximize,
  Home as HomeIcon,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../../styles/components/home/TrendingProjects.css";

const TrendingProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const res = await axios.get("/api/properties");
        const data = Array.isArray(res.data) ? res.data : [];
        setProjects(data.slice(0, 4));
      } catch (err) {
        console.error("Error fetching projects:", err);
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const getTag = (property) => {
    if (property.status === "Sold") {
      return {
        label: "SOLD OUT",
        color: "danger",
      };
    }

    if (property.type === "Villa") {
      return {
        label: "LUXURY",
        color: "warning",
      };
    }

    if (property.type === "Plot") {
      return {
        label: "HOT DEAL",
        color: "success",
      };
    }

    return {
      label: "TRENDING",
      color: "primary",
    };
  };

  return (
    <>
      <section className="trending-section py-5 overflow-hidden">
        <Container fluid className="px-lg-5">
          {/* Header */}
          <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-end mb-5 gap-4">
            <div data-aos="fade-right">
              <Badge className="trending-badge px-4 py-2 rounded-pill mb-3">
                <TrendingUp size={16} className="me-2" />
                Trending Properties
              </Badge>

              <h2 className="trending-heading">
                Most Popular{" "}
                <span className="text-primary">Projects</span>
              </h2>

              <p className="trending-subtitle">
                Explore high-demand properties with excellent investment
                potential and verified documentation.
              </p>
            </div>

            <Link
              to="/projects"
              className="view-all-link"
            >
              View All Projects
              <ArrowUpRight size={18} />
            </Link>
          </div>

          {/* Loading */}
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
              <p className="text-muted mt-3 mb-0">
                Loading trending projects...
              </p>
            </div>
          ) : (
            <Row className="g-4">
              {projects.map((project, index) => {
                const tag = getTag(project);

                return (
                  <Col
                    key={project._id}
                    xl={4}
                    lg={4}
                    md={6}
                    xs={12}
                    data-aos="fade-up"
                    data-aos-delay={index * 100}
                  >
                    <Card className="trending-card border-0 h-100">
                      {/* Image */}
                      <div className="trending-image-wrapper">
                        <img
                          src={
                            project.images?.[0] ||
                            "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1200&auto=format&fit=crop"
                          }
                          alt={project.title}
                          className="trending-image"
                          loading="lazy"
                        />

                        {/* Overlay */}
                        <div className="trending-overlay"></div>

                        {/* Tag */}
                        <Badge
                          bg={tag.color}
                          className="project-tag"
                        >
                          <Sparkles size={12} className="me-1" />
                          {tag.label}
                        </Badge>

                        {/* Price */}
                        <div className="project-price">
                          Rs{" "}
                          {project.price
                            ? (project.price / 100000).toFixed(1)
                            : "0"}{" "}
                          L
                        </div>
                      </div>

                      {/* Body */}
                      <Card.Body className="p-4 d-flex flex-column">
                        <h5 className="fw-bold text-dark mb-2 project-title">
                          {project.title}
                        </h5>

                        <p className="project-location">
                          <MapPin size={15} className="text-primary" />
                          {project.location}
                        </p>

                        {/* Specs */}
                        <div className="project-specs">
                          <div className="spec-item">
                            <Maximize size={14} />
                            {project.area} sqft
                          </div>

                          <div className="spec-item">
                            <HomeIcon size={14} />
                            {project.type}
                          </div>
                        </div>

                        {/* Footer */}
                        <div className="d-flex justify-content-between align-items-center mt-auto pt-3">
                          <div>
                            <span className="price-label">
                              Starting From
                            </span>

                            <h5 className="price-text mb-0">
                              Rs{" "}
                              {project.price
                                ? (project.price / 100000).toFixed(2)
                                : "0"}{" "}
                              L
                            </h5>
                          </div>

                          <Link
                            to={`/property/${project._id}`}
                            className="btn btn-primary rounded-pill px-4 fw-semibold"
                          >
                            Details
                          </Link>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                );
              })}
            </Row>
          )}

          {/* Bottom CTA */}
          {!loading && projects.length > 0 && (
            <div className="text-center mt-5" data-aos="zoom-in">
              <Link to="/projects">
                <Button className="explore-btn rounded-pill px-5 py-3 fw-bold border-0">
                  Explore All Projects
                  <ArrowUpRight size={20} className="ms-2" />
                </Button>
              </Link>
            </div>
          )}
        </Container>
      </section>
    </>
  );
};

export default TrendingProjects;
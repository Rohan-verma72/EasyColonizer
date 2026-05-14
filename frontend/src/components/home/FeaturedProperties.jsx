import { useState, useEffect } from "react";
import { Container, Row, Col, Button, Spinner } from "react-bootstrap";
import api from "../../utils/api";
import PropertyCard from "../property/PropertyCard";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import "../../styles/components/home/FeaturedProperties.css";

const FeaturedProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const res = await api.get("/api/properties/featured");
        const data = Array.isArray(res.data) ? res.data : [];
        const cleanData = data.filter((p) => p && p.type !== "Machinery");
        setProperties(cleanData);
      } catch (err) {
        console.error("Error fetching featured properties:", err);
        setProperties([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  return (
    <section id="properties-section" className="featured-properties-section py-5">
      <Container fluid className="px-lg-4">
        {/* Header */}
        <div className="text-center mb-5">
          <span className="section-badge">Premium Collection</span>

          <h2 className="featured-title mt-3">
            Latest <span className="text-gradient">New Projects</span>
          </h2>

          <p className="featured-subtitle mx-auto mt-2">
            Explore premium plots, luxury villas, row houses, and
            investment-ready apartments in Bhopal.
          </p>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
            <p className="mt-3 text-muted fw-semibold">Loading premium projects...</p>
          </div>
        ) : properties.length > 0 ? (
          <>
            <Row className="g-4">
              {properties.map((property) => (
                <Col key={property._id} xl={4} lg={4} md={6} sm={12}>
                  <PropertyCard property={property} />
                </Col>
              ))}
            </Row>

            <div className="text-center mt-5">
              <Link to="/projects" className="text-decoration-none">
                <Button className="view-projects-btn">
                  View All Projects
                  <ArrowUpRight size={20} className="ms-2" />
                </Button>
              </Link>
            </div>
          </>
        ) : (
          <div className="empty-projects-state text-center py-5">
            <h4 className="fw-bold text-dark mb-2">No Projects Found</h4>
            <p className="text-muted mb-0">Check back soon for new listings.</p>
          </div>
        )}
      </Container>
    </section>
  );
};

export default FeaturedProperties;

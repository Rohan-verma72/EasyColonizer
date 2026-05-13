import React, { useState, useEffect } from "react";
import { Container, Row, Col, Spinner } from "react-bootstrap";
import axios from "axios";
import PropertyCard from "../property/PropertyCard";
import { Clock } from "lucide-react";

const RecentlyViewed = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentProperties = async () => {
      try {
        const viewedIds = JSON.parse(
          localStorage.getItem("recentlyViewed") || "[]"
        );

        if (!viewedIds.length) {
          setLoading(false);
          return;
        }

        const response = await axios.get("/api/properties");

        const allProperties = Array.isArray(response.data)
          ? response.data
          : response.data.properties || [];

        const recentProperties = viewedIds
          .map((id) =>
            allProperties.find((property) => property._id === id)
          )
          .filter(Boolean);

        setProperties(recentProperties);
      } catch (error) {
        console.error(
          "Error fetching recently viewed properties:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRecentProperties();
  }, []);

  if (loading) {
    return (
      <section className="py-5 bg-light">
        <Container className="text-center py-5">
          <Spinner animation="border" variant="primary" />
        </Container>
      </section>
    );
  }

  if (!properties.length) {
    return null;
  }

  return (
    <section className="py-5 bg-light">
      <Container fluid className="px-lg-4">
        {/* Section Heading */}
        <div
          className="d-flex align-items-center gap-2 mb-4"
          data-aos="fade-right"
        >
          <Clock size={28} className="text-primary" />

          <h2 className="fw-bold mb-0">
            Recently <span className="text-primary">Viewed</span>
          </h2>
        </div>

        {/* Properties */}
        <Row className="g-4 flex-nowrap overflow-auto pb-3 custom-scrollbar">
          {properties.map((property) => (
            <Col
              key={property._id}
              xs={10}
              sm={6}
              md={4}
              lg={3}
              className="flex-shrink-0"
            >
              <PropertyCard property={property} />
            </Col>
          ))}
        </Row>
      </Container>

      {/* Custom Scrollbar */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          height: 6px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </section>
  );
};

export default RecentlyViewed;
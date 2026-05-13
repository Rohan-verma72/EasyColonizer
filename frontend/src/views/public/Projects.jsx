import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  InputGroup,
  Button,
  Card,
  Offcanvas,
  Spinner,
} from "react-bootstrap";

import {
  MapPin,
  Filter,
  SlidersHorizontal,
  Grid,
  Map as MapIcon,
  X,
  CheckCircle,
} from "lucide-react";

import axios from "axios";
import PropertyCard from "../../components/property/PropertyCard";
import { demoProperties } from "../../data/demoProperties";

const Projects = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  const [viewMode, setViewMode] = useState("grid");

  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const [filters, setFilters] = useState({
    location: "",
    type: "All Types",
    minPrice: "",
    maxPrice: "",
    minArea: "",
    maxArea: "",
    gym: false,
    pool: false,
    parking: false,
    security: false,
    park: false,
  });

  const amenityOptions = [
    "gym",
    "pool",
    "parking",
    "security",
    "park",
  ];

  const applyLocalFilters = (items) => {
    return items
      .filter((p) => p.type !== "Machinery")
      .filter((p) =>
        filters.location
          ? `${p.location} ${p.title}`
              .toLowerCase()
              .includes(filters.location.toLowerCase())
          : true
      )
      .filter((p) =>
        filters.type !== "All Types" ? p.type === filters.type : true
      )
      .filter((p) =>
        filters.minPrice ? Number(p.price) >= Number(filters.minPrice) : true
      )
      .filter((p) =>
        filters.maxPrice ? Number(p.price) <= Number(filters.maxPrice) : true
      )
      .filter((p) =>
        filters.minArea ? Number(p.area) >= Number(filters.minArea) : true
      )
      .filter((p) =>
        filters.maxArea ? Number(p.area) <= Number(filters.maxArea) : true
      )
      .filter((p) => {
        if (filters.gym && !p?.amenities?.gym) return false;
        if (filters.pool && !p?.amenities?.pool) return false;
        if (filters.parking && !p?.amenities?.parking) return false;
        if (filters.security && !p?.amenities?.security) return false;
        if (filters.park && !p?.amenities?.park) return false;

        return true;
      });
  };

  const fetchProperties = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams();

      if (filters.location)
        params.append("location", filters.location);

      if (filters.type !== "All Types")
        params.append("type", filters.type);

      if (filters.minPrice)
        params.append("minPrice", filters.minPrice);

      if (filters.maxPrice)
        params.append("maxPrice", filters.maxPrice);

      if (filters.minArea)
        params.append("minArea", filters.minArea);

      if (filters.maxArea)
        params.append("maxArea", filters.maxArea);

      const res = await axios.get(
        `/api/properties?${params.toString()}`
      );

      const rawData = res.data;
      let filtered = Array.isArray(rawData)
        ? rawData
        : Array.isArray(rawData?.properties)
        ? rawData.properties
        : [];

      const cleanData = applyLocalFilters(filtered);
      setProperties(cleanData.length ? cleanData : applyLocalFilters(demoProperties));

    } catch (err) {
      console.log("Property Fetch Error", err);
      setProperties(applyLocalFilters(demoProperties));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [filters]);

  const resetFilters = () => {
    setFilters({
      location: "",
      type: "All Types",
      minPrice: "",
      maxPrice: "",
      minArea: "",
      maxArea: "",
      gym: false,
      pool: false,
      parking: false,
      security: false,
      park: false,
    });
  };

  const renderFilterControls = () => (
    <Form>
      {/* LOCATION */}
      <Form.Group className="mb-4 pt-2">
        <Form.Label className="fw-bold small text-uppercase">
          Location
        </Form.Label>

        <InputGroup>
          <InputGroup.Text>
            <MapPin size={16} />
          </InputGroup.Text>

          <Form.Control
            placeholder="Search location"
            value={filters.location}
            onChange={(e) =>
              setFilters({
                ...filters,
                location: e.target.value,
              })
            }
          />
        </InputGroup>
      </Form.Group>

      {/* TYPE */}
      <Form.Group className="mb-4">
        <Form.Label className="fw-bold small text-uppercase">
          Property Type
        </Form.Label>

        <Form.Select
          value={filters.type}
          onChange={(e) =>
            setFilters({
              ...filters,
              type: e.target.value,
            })
          }
        >
          <option>All Types</option>
          <option value="Plot">Plot</option>
          <option value="Flat">Flat</option>
          <option value="Villa">Villa</option>
          <option value="Row House">Row House</option>
          <option value="Building">Building</option>
        </Form.Select>
      </Form.Group>

      {/* PRICE */}
      <Form.Group className="mb-4">
        <Form.Label className="fw-bold small text-uppercase">
          Budget
        </Form.Label>

        <div className="d-flex gap-2">
          <Form.Control
            placeholder="Min"
            value={filters.minPrice}
            onChange={(e) =>
              setFilters({
                ...filters,
                minPrice: e.target.value,
              })
            }
          />

          <Form.Control
            placeholder="Max"
            value={filters.maxPrice}
            onChange={(e) =>
              setFilters({
                ...filters,
                maxPrice: e.target.value,
              })
            }
          />
        </div>
      </Form.Group>

      {/* AREA */}
      <Form.Group className="mb-4">
        <Form.Label className="fw-bold small text-uppercase">
          Area (sqft)
        </Form.Label>

        <div className="d-flex gap-2">
          <Form.Control
            placeholder="Min"
            value={filters.minArea}
            onChange={(e) =>
              setFilters({
                ...filters,
                minArea: e.target.value,
              })
            }
          />

          <Form.Control
            placeholder="Max"
            value={filters.maxArea}
            onChange={(e) =>
              setFilters({
                ...filters,
                maxArea: e.target.value,
              })
            }
          />
        </div>
      </Form.Group>

      {/* AMENITIES */}
      <Form.Group className="mb-4">
        <Form.Label className="fw-bold small text-uppercase">
          Amenities
        </Form.Label>

        {amenityOptions.map((item) => (
          <Form.Check
            key={item}
            type="checkbox"
            label={item.charAt(0).toUpperCase() + item.slice(1)}
            checked={filters[item]}
            onChange={(e) =>
              setFilters({
                ...filters,
                [item]: e.target.checked,
              })
            }
            className="mb-2"
          />
        ))}
      </Form.Group>

      {/* HELP BOX */}
      <div className="bg-primary bg-opacity-10 p-3 rounded-4">
        <h6 className="fw-bold text-primary d-flex align-items-center gap-2">
          <CheckCircle size={16} />
          Need Help?
        </h6>

        <small className="text-muted">
          Our team will help you find the best property.
        </small>
      </div>
    </Form>
  );

  return (
    <div className="page-wrapper projects-page min-vh-100">

      {/* HEADER */}
      <div className="projects-page-hero py-5 mb-4">
        <Container>
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">

            <div>
              <span className="section-badge">Verified Inventory</span>
              <h1 className="fw-bold mb-1 mt-3">
                Explore Properties
              </h1>

              <p className="text-muted mb-0">
                Find your dream property in prime locations.
              </p>
            </div>

            {/* VIEW MODE */}
            <div className="d-flex gap-2">

              <Button
                variant={
                  viewMode === "grid"
                    ? "primary"
                    : "outline-primary"
                }
                onClick={() => setViewMode("grid")}
              >
                <Grid size={16} className="me-2" />
                Grid
              </Button>

              <Button
                variant={
                  viewMode === "map"
                    ? "primary"
                    : "outline-primary"
                }
                onClick={() => setViewMode("map")}
              >
                <MapIcon size={16} className="me-2" />
                Map
              </Button>

            </div>
          </div>
        </Container>
      </div>

      {/* CONTENT */}
      <Container fluid className="px-lg-5 pb-5">

        <Row className="g-4">

          {/* DESKTOP FILTER */}
          <Col lg={3} className="d-none d-lg-block">

            <Card className="filter-sidebar border-0 sticky-top">
              <Card.Body className="p-4">

                <div className="d-flex justify-content-between align-items-center mb-3">

                  <h5 className="fw-bold mb-0">
                    Filters
                  </h5>

                  <Button
                    size="sm"
                    variant="link"
                    onClick={resetFilters}
                  >
                    Reset
                  </Button>

                </div>

                {renderFilterControls()}

              </Card.Body>
            </Card>

          </Col>

          {/* PROPERTY SECTION */}
          <Col lg={9}>

            <div className="d-flex justify-content-between align-items-center mb-4">

              <h5 className="fw-bold mb-0">
                {loading
                  ? "Loading..."
                  : `${properties.length} Properties Found`}
              </h5>

              <Button
                className="d-lg-none"
                onClick={() => setShowMobileFilters(true)}
              >
                <Filter size={16} className="me-2" />
                Filters
              </Button>

            </div>

            {/* GRID */}
            {viewMode === "grid" ? (

              <Row className="g-4">

                {loading ? (

                  <div className="text-center py-5">
                    <Spinner animation="border" />
                  </div>

                ) : properties.length > 0 ? (

                  properties.map((property) => (
                    <Col key={property._id} lg={4} md={6}>
                      <PropertyCard property={property} />
                    </Col>
                  ))

                ) : (

                  <Col xs={12}>
                    <div className="empty-state-card">

                      <X
                        size={50}
                        className="text-muted opacity-25 mb-3"
                      />

                      <h4 className="fw-bold">
                        No Properties Found
                      </h4>

                      <p className="text-muted">
                        Try changing your filters.
                      </p>

                      <Button
                        variant="primary"
                        onClick={resetFilters}
                      >
                        Clear Filters
                      </Button>

                    </div>
                  </Col>

                )}

              </Row>

            ) : (

              // MAP VIEW
              <div
                className="rounded-4 overflow-hidden shadow-sm border"
                style={{ height: "700px" }}
              >
                <iframe
                  title="map"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(
                    filters.location || "Bhopal"
                  )}&output=embed`}
                ></iframe>
              </div>

            )}
          </Col>
        </Row>
      </Container>

      {/* MOBILE FILTERS */}
      <Offcanvas
        show={showMobileFilters}
        onHide={() => setShowMobileFilters(false)}
        placement="bottom"
        className="rounded-top-4"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title className="fw-bold">
            Filters
          </Offcanvas.Title>
        </Offcanvas.Header>

        <Offcanvas.Body>
          {renderFilterControls()}

          <Button
            className="w-100 mt-4"
            onClick={() => setShowMobileFilters(false)}
          >
            Show Properties
          </Button>
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  );
};

export default Projects;

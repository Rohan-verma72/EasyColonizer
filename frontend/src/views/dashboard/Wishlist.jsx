import { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Card,
  Badge,
  Spinner,
} from "react-bootstrap";

import axios from "axios";
import { demoProperties } from "../../data/demoProperties";
import {
  getPropertyImage,
  normalizePropertiesResponse,
} from "../../utils/propertyData";

import {
  ShoppingCart,
  Home,
  Trash2,
  Heart,
  MapPin,
  Phone,
  Send,
} from "lucide-react";

import EnquiryModal from "../../components/modals/EnquiryModal";

import { Link } from "react-router-dom";

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEnquiry, setShowEnquiry] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);


  const fetchWishlist = async () => {
    try {
      setLoading(true);

      const savedWishlist =
        JSON.parse(localStorage.getItem("wishlist")) || [];

      const savedIds = savedWishlist.map((item) =>
        typeof item === "object" ? item._id : item,
      );

      if (savedIds.length === 0) {
        setWishlistItems([]);
        setLoading(false);
        return;
      }

      const res = await axios.get("/api/properties");
      const source = normalizePropertiesResponse(res.data);
      const allPossible = [...source, ...demoProperties];

      const filtered = allPossible.filter((p) =>
        savedIds.includes(p._id)
      );

      const unique = Array.from(new Map(filtered.map(p => [p._id, p])).values());
      setWishlistItems(unique);
    } catch (err) {
      console.log("Wishlist Error:", err);
      const savedWishlist =
        JSON.parse(localStorage.getItem("wishlist")) || [];
      const savedIds = savedWishlist.map((item) =>
        typeof item === "object" ? item._id : item,
      );
      setWishlistItems(
        demoProperties.filter((property) => savedIds.includes(property._id))
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();

    window.addEventListener(
      "wishlistUpdated",
      fetchWishlist,
    );

    return () => {
      window.removeEventListener(
        "wishlistUpdated",
        fetchWishlist,
      );
    };
  }, []);

 
  const removeWishlist = (id) => {
    const current =
      JSON.parse(localStorage.getItem("wishlist")) || [];

    const updated = current.filter((item) => {
      if (typeof item === "object") {
        return item._id !== id;
      }

      return item !== id;
    });

    localStorage.setItem(
      "wishlist",
      JSON.stringify(updated),
    );

    setWishlistItems((prev) =>
      prev.filter((p) => p._id !== id),
    );

    window.dispatchEvent(
      new Event("wishlistUpdated"),
    );
  };

  
  if (loading) {
    return (
      <div className="min-vh-100 d-flex justify-content-center align-items-center">
        <div className="text-center">
          <Spinner animation="border" />
          <h5 className="mt-3">Loading Wishlist...</h5>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper bg-light min-vh-100 py-5">

      <Container>

        {/* HEADER */}
        <div className="text-center mb-5">

          <div className="mb-3">
            <Heart
              size={60}
              className="text-danger"
              fill="rgba(255,0,0,0.1)"
            />
          </div>

          <div className="d-flex justify-content-between align-items-center mb-5">
            <div>
              <h2 className="fw-bold mb-1">My Wishlist</h2>
              <p className="text-muted mb-0">Properties you are interested in</p>
            </div>
            <Button
              as={Link}
              to="/projects"
              variant="outline-primary"
              className="rounded-pill fw-bold"
            >
              Explore More Projects
            </Button>
          </div>

        </div>

        {/* PROPERTY LIST */}
        {wishlistItems.length > 0 ? (

          <Row className="g-4">

            {wishlistItems.map((property) => (

              <Col lg={4} md={6} key={property._id}>

                <Card className="border-0 shadow-sm h-100 overflow-hidden rounded-4 property-card-hover">

                  {/* IMAGE */}
                  <div className="position-relative overflow-hidden">
                    <Link to={`/property/${property._id}`}>
                      <img
                        src={getPropertyImage(property)}
                        alt={property.title}
                        className="w-100 property-zoom-img"
                        style={{
                          height: "240px",
                          objectFit: "cover",
                          transition: "0.5s"
                        }}
                      />
                    </Link>

                    <Badge
                      bg="primary"
                      className="position-absolute top-0 end-0 m-3 px-3 py-2"
                    >
                      {property.type || "Property"}
                    </Badge>
                  </div>

                  {/* BODY */}
                  <Card.Body className="p-4 d-flex flex-column">

                    <h5 className="fw-bold mb-2">
                      <Link to={`/property/${property._id}`} className="text-decoration-none text-dark hover-text-primary">
                        {property.title}
                      </Link>
                    </h5>

                    <div className="d-flex align-items-center gap-2 text-muted mb-3">
                      <MapPin size={16} />
                      {property.location}
                    </div>

                    <h4 className="text-primary fw-bold mb-4">
                      ₹
                      {property.price
                        ? Number(property.price).toLocaleString()
                        : "Price On Request"}
                    </h4>

                    <div className="mt-auto d-flex flex-wrap gap-2">
                      <Button
                        as={Link}
                        to={`/property/${property._id}`}
                        variant="primary"
                        className="flex-grow-1 rounded-pill fw-bold btn-sm"
                      >
                        View
                      </Button>

                      <Button
                        variant="outline-primary"
                        className="flex-grow-1 rounded-pill fw-bold btn-sm"
                        onClick={() => {
                          setSelectedProperty(property);
                          setShowEnquiry(true);
                        }}
                      >
                        Enquire
                      </Button>

                      <Button
                        variant="success"
                        className="rounded-circle btn-sm p-2 d-flex align-items-center justify-content-center"
                        onClick={() => window.open(`https://wa.me/+919999999999?text=Interested in ${property.title}`, "_blank")}
                      >
                        <Phone size={16} />
                      </Button>

                      <Button
                        variant="light"
                        className="border rounded-circle btn-sm p-2 d-flex align-items-center justify-content-center"
                        onClick={() => removeWishlist(property._id)}
                      >
                        <Trash2 size={16} className="text-danger" />
                      </Button>
                    </div>

                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        ) : (

          // EMPTY
          <div className="text-center py-5">

            <div className="bg-white p-5 rounded-5 shadow-sm d-inline-block">

              <ShoppingCart
                size={70}
                className="text-muted mb-4"
              />

              <h3 className="fw-bold">
                Wishlist is Empty
              </h3>

              <p className="text-muted mb-4">
                Explore premium projects and save your
                favorite properties here.
              </p>

              <Button
                as={Link}
                to="/projects"
                variant="primary"
                className="rounded-pill px-5 py-3 fw-bold"
              >
                Explore Projects
              </Button>

            </div>
          </div>
        )}
      </Container>

      {selectedProperty && (
        <EnquiryModal
          show={showEnquiry}
          handleClose={() => {
            setShowEnquiry(false);
            setSelectedProperty(null);
          }}
          property={selectedProperty}
        />
      )}
      <style>{`
        .property-zoom-img:hover {
          transform: scale(1.1);
        }
        .hover-text-primary:hover {
          color: var(--bs-primary) !important;
        }
        .property-card-hover {
          transition: 0.3s;
        }
        .property-card-hover:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(0,0,0,0.1) !important;
        }
      `}</style>
    </div>
  );
};

export default Wishlist;

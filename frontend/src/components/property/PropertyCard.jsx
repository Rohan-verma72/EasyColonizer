import React, { useEffect, useState } from "react";
import { Card, Badge, Button } from "react-bootstrap";
import {
  MapPin,
  Maximize,
  Home as HomeIcon,
  ArrowRight,
  Shield,
  Heart,
  Scale,
  Check,
  Phone,
  Package,
} from "lucide-react";
import { Link } from "react-router-dom";
import EnquiryModal from "../modals/EnquiryModal";
import { whatsappLink } from "../../config/site";
import { getPropertyImage, getSavedWishlistIds, saveWishlistIds } from "../../utils/propertyData";

const PropertyCard = ({ property }) => {
  const [showModal, setShowModal] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    const checkWishlist = () => {
      const wishlist = JSON.parse(
        localStorage.getItem("wishlist") || "[]"
      );

      setIsWishlisted(
        wishlist
          .map((item) => (typeof item === "object" ? item._id : item))
          .includes(property._id)
      );
    };

    checkWishlist();

    window.addEventListener(
      "wishlistUpdated",
      checkWishlist
    );

    return () => {
      window.removeEventListener(
        "wishlistUpdated",
        checkWishlist
      );
    };
  }, [property._id]);

  const toggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();

    let wishlist = getSavedWishlistIds();

    if (wishlist.includes(property._id)) {
      wishlist = wishlist.filter(
        (id) => id !== property._id
      );
    } else {
      wishlist.push(property._id);
    }

    saveWishlistIds(wishlist);
    setIsWishlisted(wishlist.includes(property._id));
  };

  const propertyPrice = Number(property.price) || 0;
  const propertyArea = Number(property.area) || 1;

  return (
    <>
      <Card className="property-card h-100 border-0 shadow-sm rounded-4 overflow-hidden">
        {/* IMAGE */}
        <div className="position-relative overflow-hidden">
          <Link to={`/property/${property._id}`}>
            <Card.Img
              variant="top"
              src={
                getPropertyImage(property)
              }
              className="property-img"
              style={{
                height: "250px",
                objectFit: "cover",
              }}
              loading="lazy"
            />
          </Link>

          {/* VERIFIED */}
          <div className="position-absolute top-0 start-0 m-3">
            <Badge
              bg="light"
              className="text-dark px-3 py-2 rounded-pill shadow-sm d-flex align-items-center gap-1"
            >
              <Shield
                size={14}
                className="text-primary"
              />
              VERIFIED
            </Badge>
          </div>

          {/* STATUS */}
          <div className="position-absolute top-0 end-0 m-3">
            <Badge bg="primary" className="px-3 py-2">
              {property.status || "Available"}
            </Badge>
          </div>

          {/* PRICE */}
          <div
            className="position-absolute bottom-0 end-0 m-3 px-3 py-2 rounded-3 text-white fw-bold"
            style={{
              background: "rgba(0,0,0,0.7)",
              backdropFilter: "blur(10px)",
            }}
          >
            {propertyPrice
              ? `₹ ${(propertyPrice / 100000).toFixed(
                  2
                )} L`
              : "Price on Request"}
          </div>

          {/* INVENTORY */}
          <div className="position-absolute bottom-0 start-0 m-3">
            <Badge
              bg="light"
              className="text-dark border d-flex align-items-center gap-1 px-2 py-1"
            >
              <Package
                size={12}
                className="text-primary"
              />
              Inventory Managed
            </Badge>
          </div>
        </div>

        {/* BODY */}
        <Card.Body className="p-4">
          {/* TITLE */}
          <div className="d-flex justify-content-between align-items-start mb-2">
            <Card.Title className="fw-bold mb-0 text-truncate">
              <Link
                to={`/property/${property._id}`}
                className="text-decoration-none text-dark"
              >
                {property.title}
              </Link>
            </Card.Title>

            {/* WISHLIST */}
            <button
              onClick={toggleWishlist}
              className="border-0 bg-transparent"
            >
              <Heart
                size={22}
                className={
                  isWishlisted
                    ? "text-danger"
                    : "text-muted"
                }
                fill={
                  isWishlisted
                    ? "currentColor"
                    : "none"
                }
              />
            </button>
          </div>

          {/* LOCATION */}
          <div className="text-muted small d-flex align-items-center gap-1 mb-3">
            <MapPin
              size={14}
              className="text-primary"
            />
            {property.location}
          </div>

          <div className="d-flex justify-content-between mb-3 small">
            <span className="fw-semibold text-secondary">
              ₹{" "}
              {Math.round(
                propertyPrice / propertyArea
              ).toLocaleString()}
              /sq.ft
            </span>

            <span className="text-success fw-semibold">
              {property.possessionStatus ||
                "Ready to Move"}
            </span>
          </div>

          {/* META */}
          <div className="d-flex gap-3 border-top pt-3 small">
            <span className="d-flex align-items-center gap-1">
              <Maximize size={16} />
              {property.area} sqft
            </span>

            <span className="d-flex align-items-center gap-1">
              <HomeIcon size={16} />
              {property.type}
            </span>
          </div>

          {/* RERA */}
          {property.reraId && (
            <div className="mt-3 text-success small fw-bold d-flex align-items-center gap-1">
              <Check size={14} />
              RERA: {property.reraId}
            </div>
          )}
        </Card.Body>

        {/* FOOTER */}
        <Card.Footer className="bg-white border-0 px-4 pb-4">
          <div className="d-flex gap-2">
            {/* COMPARE */}
            <Button
              variant="light"
              className="border"
              onClick={() =>
                window.dispatchEvent(
                  new CustomEvent(
                    "add-to-compare",
                    {
                      detail: property,
                    }
                  )
                )
              }
            >
              <Scale size={18} />
            </Button>

            {/* ENQUIRY */}
            <Button
              variant="outline-primary"
              className="flex-grow-1 fw-bold"
              onClick={() => setShowModal(true)}
            >
              Enquire
            </Button>

            {/* WHATSAPP */}
            <Button
              variant="success"
              onClick={(e) => {
                e.stopPropagation();

                window.open(
                  whatsappLink(
                    `Hi, I am interested in ${property.title} at ${property.location}`
                  ),
                  "_blank"
                );
              }}
            >
              <Phone size={18} />
            </Button>

            {/* DETAILS */}
            <Button
              as={Link}
              to={`/property/${property._id}`}
              variant="primary"
            >
              <ArrowRight size={18} />
            </Button>
          </div>
        </Card.Footer>
      </Card>

      {/* MODAL */}
      <EnquiryModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        property={property}
      />
    </>
  );
};

export default PropertyCard;

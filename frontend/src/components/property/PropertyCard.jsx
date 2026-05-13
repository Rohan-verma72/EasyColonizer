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
import axios from "axios";
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

  const toggleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    const isRealUser = userId && token && !token.startsWith("local-token-");

    let wishlist = getSavedWishlistIds();
    const alreadyInWishlist = wishlist.includes(property._id);

    try {
      if (alreadyInWishlist) {
        if (isRealUser) {
          await axios.delete(`/api/users/${userId}/wishlist/${property._id}`);
        }
        wishlist = wishlist.filter((id) => id !== property._id);
      } else {
        if (isRealUser) {
          await axios.post(`/api/users/${userId}/wishlist`, {
            propertyId: property._id,
          });
        }
        wishlist.push(property._id);
      }

      saveWishlistIds(wishlist);
      setIsWishlisted(wishlist.includes(property._id));
      
      // Dispatch event to update other components
      window.dispatchEvent(new Event("wishlistUpdated"));
    } catch (err) {
      console.error("Wishlist Sync Error:", err);
      // Fallback to local only if server fails
      if (!alreadyInWishlist) {
        wishlist.push(property._id);
      } else {
        wishlist = wishlist.filter((id) => id !== property._id);
      }
      saveWishlistIds(wishlist);
      setIsWishlisted(wishlist.includes(property._id));
      window.dispatchEvent(new Event("wishlistUpdated"));
    }
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

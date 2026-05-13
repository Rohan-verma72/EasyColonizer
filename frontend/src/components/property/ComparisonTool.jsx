import { useState, useEffect } from "react";
import { Modal, Table, Button, Badge } from "react-bootstrap";
import {
  Scale,
  X,
  Check,
  ArrowRight,
  Home,
  MapPin,
  Maximize,
  Shield,
} from "lucide-react";
import { Link } from "react-router-dom";
import "../../styles/components/property/ComparisonTool.css";

const ComparisonTool = () => {
  const [show, setShow] = useState(false);
  const [compareItems, setCompareItems] = useState([]);

  useEffect(() => {
    const handleAdd = (e) => {
      const item = e.detail;
      setCompareItems((prev) => {
        if (prev.find((i) => i._id === item._id)) return prev;
        if (prev.length >= 3) {
          return prev;
        }
        return [...prev, item];
      });
      setShow(true);
    };

    window.addEventListener("add-to-compare", handleAdd);
    return () => window.removeEventListener("add-to-compare", handleAdd);
  }, []);

  const removeItem = (id) => {
    setCompareItems((prev) => prev.filter((i) => i._id !== id));
  };

  if (compareItems.length === 0) return null;

  return (
    <>
      {/* Floating Compare Bar */}
      {!show && (
        <div
          className="position-fixed bottom-0 start-50 translate-middle-x mb-4 z-3"
          style={{ pointerEvents: "none" }}
        >
          <div
            className="text-white rounded-pill px-4 py-2 shadow-lg d-flex align-items-center gap-3 floating-compare-bar"
            style={{
              pointerEvents: "auto",
              backdropFilter: "blur(10px)",
              background:
                "linear-gradient(135deg, var(--dark), var(--primary-dark))",
              border: "1px solid rgba(201, 151, 53, 0.45)",
            }}
          >
            <div className="d-flex align-items-center gap-2">
              <Scale size={20} className="text-accent" />
              <span className="fw-bold">
                {compareItems.length} Property Selected
              </span>
            </div>
            <div className="vr bg-white opacity-25"></div>
            <Button
              variant="warning"
              size="sm"
              className="rounded-pill px-3 fw-bold text-white"
              onClick={() => setShow(true)}
            >
              Compare Now <ArrowRight size={14} className="ms-1" />
            </Button>
            <button
              className="btn btn-link text-white p-0"
              onClick={() => setCompareItems([])}
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}

      <Modal
        show={show}
        onHide={() => setShow(false)}
        size="xl"
        centered
        scrollable
        className="comparison-modal"
      >
        <Modal.Header closeButton className="bg-white border-bottom py-3">
          <Modal.Title className="fw-bold h4 mb-0">
            Smart <span className="text-primary">Property Comparison</span>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-light p-0">
          <div className="table-responsive">
            <Table className="mb-0 comparison-table bg-white">
              <thead>
                <tr className="bg-white">
                  <th
                    style={{ width: "220px", verticalAlign: "middle" }}
                    className="p-4 border-0"
                  >
                    <div className="text-secondary small fw-bold text-uppercase letter-spacing-1">
                      Features
                    </div>
                  </th>
                  {compareItems.map((item) => (
                    <th
                      key={item._id}
                      className="text-center p-4 border-0"
                      style={{ minWidth: "280px" }}
                    >
                      <div className="position-relative mb-3 group">
                        <img
                          src={item.images?.[0]}
                          alt={item.title}
                          className="rounded-4 w-100 shadow-sm"
                          style={{ height: "180px", objectFit: "cover" }}
                        />
                        <button
                          onClick={() => removeItem(item._id)}
                          className="btn btn-danger btn-sm position-absolute top-0 end-0 m-2 rounded-circle shadow"
                        >
                          <X size={14} />
                        </button>
                      </div>
                      <h5 className="fw-bold mb-1 text-dark text-truncate">
                        {item.title}
                      </h5>
                      <div className="text-primary fw-bold fs-5 mb-2">
                        Rs {(item.price / 100000).toFixed(2)} Lacs
                      </div>
                      <Badge
                        bg="primary"
                        className="bg-opacity-10 text-primary px-3 py-2 rounded-pill border border-primary border-opacity-25"
                      >
                        {item.type}
                      </Badge>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="bg-light">
                  <td
                    colSpan={compareItems.length + 1}
                    className="py-2 px-4 small fw-bold text-muted text-uppercase"
                  >
                    Core Specifications
                  </td>
                </tr>
                <tr>
                  <td className="p-4 fw-bold text-secondary d-flex align-items-center gap-2">
                    <MapPin size={18} className="text-primary" /> Location
                  </td>
                  {compareItems.map((item) => (
                    <td key={item._id} className="p-4 text-center fw-medium">
                      {item.location}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-4 fw-bold text-secondary d-flex align-items-center gap-2">
                    <Maximize size={18} className="text-primary" /> Plot Area
                  </td>
                  {compareItems.map((item) => (
                    <td key={item._id} className="p-4 text-center fw-medium">
                      {item.area} sqft
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-4 fw-bold text-secondary d-flex align-items-center gap-2">
                    <Shield size={18} className="text-primary" /> Status
                  </td>
                  {compareItems.map((item) => (
                    <td key={item._id} className="p-4 text-center">
                      <Badge
                        bg={item.status === "Available" ? "success" : "warning"}
                        className="px-3 py-2 rounded-pill"
                      >
                        {item.status}
                      </Badge>
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-4 fw-bold text-secondary d-flex align-items-center gap-2">
                    <Home size={18} className="text-primary" /> Project Name
                  </td>
                  {compareItems.map((item) => (
                    <td key={item._id} className="p-4 text-center text-muted">
                      {item.project}
                    </td>
                  ))}
                </tr>
                <tr className="bg-light">
                  <td
                    colSpan={compareItems.length + 1}
                    className="py-2 px-4 small fw-bold text-muted text-uppercase"
                  >
                    Amenities & Security
                  </td>
                </tr>
                <tr>
                  <td className="p-4 fw-bold text-secondary">
                    Community Features
                  </td>
                  {compareItems.map((item) => (
                    <td key={item._id} className="p-4 text-center">
                      <div className="d-flex flex-wrap justify-content-center gap-2">
                        {["security", "parking", "gym", "pool", "park"].map(
                          (ami) =>
                            item.amenities?.[ami] ? (
                              <Badge
                                key={ami}
                                bg="white"
                                className="text-success border border-success border-opacity-25 px-2 py-1 small"
                              >
                                <Check size={10} className="me-1" />{" "}
                                {ami.charAt(0).toUpperCase() + ami.slice(1)}
                              </Badge>
                            ) : (
                              <Badge
                                key={ami}
                                bg="white"
                                className="text-muted border border-light px-2 py-1 small opacity-50"
                              >
                                <X size={10} className="me-1" />{" "}
                                {ami.charAt(0).toUpperCase() + ami.slice(1)}
                              </Badge>
                            ),
                        )}
                      </div>
                    </td>
                  ))}
                </tr>
                <tr className="border-0">
                  <td className="border-0"></td>
                  {compareItems.map((item) => (
                    <td key={item._id} className="p-4 text-center border-0">
                      <Button
                        as={Link}
                        to={`/property/${item._id}`}
                        variant="primary"
                        className="w-100 rounded-pill py-2 fw-bold shadow-sm"
                        onClick={() => setShow(false)}
                      >
                        View Full Details
                      </Button>
                    </td>
                  ))}
                </tr>
              </tbody>
            </Table>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ComparisonTool;

import { useState, useEffect } from "react";
import { Modal, Button, Form, Alert, Row, Col } from "react-bootstrap";
import api from "../../utils/api";
import {
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  CheckCircle,
} from "lucide-react";

const SiteVisitModal = ({ show, handleClose, property }) => {
  const initialFormData = {
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    visitDate: "",
    visitTime: "",
    notes: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [status, setStatus] = useState({ type: "", msg: "" });
  const [phoneError, setPhoneError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (show) {
      setFormData(initialFormData);
      setIsSubmitted(false);
      setStatus({ type: "", msg: "" });
      setPhoneError("");
      setLoading(false);
    }
  }, [show]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "customerPhone") {
      const onlyNums = value.replace(/\D/g, "");

      if (onlyNums.length <= 10) {
        setFormData((prev) => ({
          ...prev,
          [name]: onlyNums,
        }));
      }

      setPhoneError("");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validatePhone = () => {
    if (formData.customerPhone.length !== 10) {
      setPhoneError("Mobile number must be exactly 10 digits.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setStatus({ type: "", msg: "" });

    if (!validatePhone()) return;

    try {
      setLoading(true);

      await api.post("/api/site-visits", {
        ...formData,
        propertyId: property?._id,
      });

      setIsSubmitted(true);

      setTimeout(() => {
        handleClose();
      }, 4000);
    } catch (err) {
      console.warn("Site visit API unavailable, saved locally.", err?.message);
      const savedVisits = JSON.parse(localStorage.getItem("localSiteVisits") || "[]");
      localStorage.setItem(
        "localSiteVisits",
        JSON.stringify([
          { ...formData, propertyId: property?._id, createdAt: new Date().toISOString() },
          ...savedVisits,
        ])
      );
      setIsSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
      className="site-visit-modal"
    >
      <Modal.Header closeButton className="border-0 pt-4 px-4">
        <Modal.Title className="fw-bold h4">
          Schedule a <span className="text-primary">Site Visit</span>
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="px-4 pb-4">
        {isSubmitted ? (
          <div className="text-center py-5">
            <div className="mb-4 d-inline-flex bg-primary bg-opacity-10 p-4 rounded-circle">
              <CheckCircle size={60} className="text-primary" />
            </div>

            <h3 className="fw-bold text-dark mb-2">Visit Scheduled!</h3>

            <p className="text-muted">
              Your visit for{" "}
              <strong>{property?.title || "this property"}</strong> is
              requested for <strong>{formData.visitDate}</strong> at{" "}
              <strong>{formData.visitTime}</strong>.
              <br />
              Our team will contact you shortly.
            </p>

            <Button
              variant="outline-primary"
              className="mt-3 rounded-pill px-4"
              onClick={handleClose}
            >
              Awesome
            </Button>
          </div>
        ) : (
          <>
            <p className="text-muted small mb-4">
              Select your preferred date and time to visit{" "}
              <strong>{property?.title}</strong>.
            </p>

            {status.msg && (
              <Alert variant={status.type} className="rounded-3">
                {status.msg}
              </Alert>
            )}

            <Form onSubmit={handleSubmit}>
              {/* Full Name */}
              <Form.Group className="mb-3">
                <Form.Label className="small fw-bold text-secondary">
                  Full Name
                </Form.Label>

                <div className="input-group">
                  <span className="input-group-text bg-light border-0">
                    <User size={18} className="text-muted" />
                  </span>

                  <Form.Control
                    type="text"
                    name="customerName"
                    required
                    placeholder="Enter your full name"
                    className="bg-light border-0 py-2 shadow-none"
                    value={formData.customerName}
                    onChange={handleChange}
                  />
                </div>
              </Form.Group>

              {/* Phone + Email */}
              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="small fw-bold text-secondary">
                      Phone Number
                    </Form.Label>

                    <div className="input-group">
                      <span className="input-group-text bg-light border-0">
                        <Phone size={18} className="text-muted" />
                      </span>

                      <Form.Control
                        type="tel"
                        name="customerPhone"
                        required
                        placeholder="10-digit mobile number"
                        className="bg-light border-0 py-2 shadow-none"
                        value={formData.customerPhone}
                        onChange={handleChange}
                        isInvalid={!!phoneError}
                      />

                      <Form.Control.Feedback type="invalid">
                        {phoneError}
                      </Form.Control.Feedback>
                    </div>
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="small fw-bold text-secondary">
                      Email (Optional)
                    </Form.Label>

                    <div className="input-group">
                      <span className="input-group-text bg-light border-0">
                        <Mail size={18} className="text-muted" />
                      </span>

                      <Form.Control
                        type="email"
                        name="customerEmail"
                        placeholder="your@email.com"
                        className="bg-light border-0 py-2 shadow-none"
                        value={formData.customerEmail}
                        onChange={handleChange}
                      />
                    </div>
                  </Form.Group>
                </Col>
              </Row>

              {/* Date + Time */}
              <Row className="mb-4">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="small fw-bold text-secondary">
                      Visit Date
                    </Form.Label>

                    <div className="input-group">
                      <span className="input-group-text bg-light border-0">
                        <Calendar size={18} className="text-muted" />
                      </span>

                      <Form.Control
                        type="date"
                        name="visitDate"
                        required
                        className="bg-light border-0 py-2 shadow-none"
                        value={formData.visitDate}
                        onChange={handleChange}
                        min={new Date().toISOString().split("T")[0]}
                      />
                    </div>
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="small fw-bold text-secondary">
                      Preferred Time
                    </Form.Label>

                    <div className="input-group">
                      <span className="input-group-text bg-light border-0">
                        <Clock size={18} className="text-muted" />
                      </span>

                      <Form.Select
                        name="visitTime"
                        required
                        className="bg-light border-0 py-2 shadow-none"
                        value={formData.visitTime}
                        onChange={handleChange}
                      >
                        <option value="">Select Time</option>

                        {[
                          { value: "Morning (10 AM - 1 PM)", hour: 13 },
                          { value: "Afternoon (1 PM - 4 PM)", hour: 16 },
                          { value: "Evening (4 PM - 7 PM)", hour: 19 }
                        ].map((slot) => {
                          const isToday = formData.visitDate === new Date().toISOString().split("T")[0];
                          const currentHour = new Date().getHours();
                          const isPast = isToday && currentHour >= slot.hour;
                          
                          if (isPast) return null;
                          
                          return (
                            <option key={slot.value} value={slot.value}>
                              {slot.value}
                            </option>
                          );
                        })}
                      </Form.Select>
                    </div>
                  </Form.Group>
                </Col>
              </Row>

              {/* Notes */}
              <Form.Group className="mb-4">
                <Form.Label className="small fw-bold text-secondary">
                  Additional Notes (Optional)
                </Form.Label>

                <Form.Control
                  as="textarea"
                  rows={3}
                  name="notes"
                  placeholder="Any specific requirement..."
                  className="bg-light border-0 shadow-none"
                  value={formData.notes}
                  onChange={handleChange}
                />
              </Form.Group>

              {/* Submit */}
              <Button
                variant="primary"
                type="submit"
                disabled={loading}
                className="w-100 fw-bold py-3 rounded-3 shadow-sm border-0"
                style={{
                  background:
                    "linear-gradient(135deg, var(--primary), var(--primary-dark))",
                }}
              >
                {loading ? "Scheduling..." : "Request Site Visit"}
              </Button>
            </Form>
          </>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default SiteVisitModal;

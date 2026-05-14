import { useState } from "react";
import { Container, Row, Col, Form, Button, Card, Alert } from "react-bootstrap";
import { MapPin, Phone, Mail, Send } from "lucide-react";
import api from "../../utils/api";
import { SITE } from "../../config/site";
import { useTenant } from "../../context/TenantContext";

const Contact = () => {
  const { tenant } = useTenant();
  const contactInfo = tenant?.contactInfo || SITE;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [status, setStatus] = useState({
    type: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setStatus({ type: "", message: "" });

    try {
      // Strip non-digits from phone before submitting
      const cleanPhone = formData.phone.replace(/\D/g, "").slice(-10);
      await api.post("/api/leads", {
        ...formData,
        phone: cleanPhone,
        source: "Website",
      });

      setStatus({
        type: "success",
        message: "Message sent successfully! We will contact you soon.",
      });

      setFormData({
        name: "",
        email: "",
        phone: "",
        message: "",
      });
    } catch (err) {
      console.error("Contact Form Error:", err);
      const savedLeads = JSON.parse(localStorage.getItem("localLeads") || "[]");
      localStorage.setItem(
        "localLeads",
        JSON.stringify([
          { ...formData, source: "Contact Page", createdAt: new Date().toISOString() },
          ...savedLeads,
        ])
      );
      setStatus({
        type: "success",
        message: "Message saved successfully! Our team will contact you soon.",
      });
      setFormData({
        name: "",
        email: "",
        phone: "",
        message: "",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper bg-light min-vh-100 py-5">
      <Container className="py-5">
        {/* Header */}
        <Row className="justify-content-center text-center mb-5">
          <Col lg={8}>
            <h1 className="display-4 fw-bold mb-3">
              Contact <span className="text-primary">Us</span>
            </h1>

            <p className="lead text-muted">
              Have questions or want to schedule a property visit? Our team is
              here to help you.
            </p>
          </Col>
        </Row>

        <Row className="g-5">
          {/* Left Info */}
          <Col lg={4}>
            <div className="d-flex flex-column gap-4">
              {/* Address */}
              <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
                <Card.Body className="p-4 d-flex align-items-start gap-3">
                  <div className="contact-icon">
                    <MapPin size={22} />
                  </div>

                  <div>
                    <h5 className="fw-bold mb-1">Office Address</h5>

                    <p className="text-muted mb-0 small">
                      {SITE.address}
                    </p>
                  </div>
                </Card.Body>
              </Card>

              {/* Phone */}
              <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
                <Card.Body className="p-4 d-flex align-items-start gap-3">
                  <div className="contact-icon">
                    <Phone size={22} />
                  </div>

                  <div>
                    <h5 className="fw-bold mb-1">Phone Number</h5>

                    <p className="text-muted mb-0 small">
                      {SITE.phoneDisplay}
                    </p>
                  </div>
                </Card.Body>
              </Card>

              {/* Email */}
              <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
                <Card.Body className="p-4 d-flex align-items-start gap-3">
                  <div className="contact-icon">
                    <Mail size={22} />
                  </div>

                  <div>
                    <h5 className="fw-bold mb-1">Email Address</h5>

                    <p className="text-muted mb-0 small">
                      {contactInfo.email}
                    </p>
                  </div>
                </Card.Body>
              </Card>

              {/* Google Map */}
              <div
                className="rounded-4 overflow-hidden shadow-sm border"
                style={{ height: "280px" }}
              >
                <iframe
                  title="Google Map"
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(
                    SITE.shortAddress
                  )}&output=embed`}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          </Col>

          {/* Right Form */}
          <Col lg={8}>
            <Card className="border-0 shadow-sm rounded-4">
              <Card.Body className="p-4 p-md-5">
                <h3 className="fw-bold mb-4">Send Us a Message</h3>

                {status.message && (
                  <Alert
                    variant={status.type}
                    className="rounded-3 border-0"
                  >
                    {status.message}
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  <Row className="g-4">
                    {/* Name */}
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="fw-semibold small text-muted">
                          Full Name
                        </Form.Label>

                        <Form.Control
                          type="text"
                          name="name"
                          placeholder="Enter your name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="py-3 rounded-3 border-light bg-light"
                        />
                      </Form.Group>
                    </Col>

                    {/* Email */}
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="fw-semibold small text-muted">
                          Email Address
                        </Form.Label>

                        <Form.Control
                          type="email"
                          name="email"
                          placeholder="Enter your email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="py-3 rounded-3 border-light bg-light"
                        />
                      </Form.Group>
                    </Col>

                    {/* Phone */}
                    <Col md={12}>
                      <Form.Group>
                        <Form.Label className="fw-semibold small text-muted">
                          Phone Number
                        </Form.Label>

                        <Form.Control
                          type="tel"
                          name="phone"
                          placeholder="+91 9876543210"
                          value={formData.phone}
                          onChange={handleChange}
                          required
                          className="py-3 rounded-3 border-light bg-light"
                        />
                      </Form.Group>
                    </Col>

                    {/* Message */}
                    <Col md={12}>
                      <Form.Group>
                        <Form.Label className="fw-semibold small text-muted">
                          Message
                        </Form.Label>

                        <Form.Control
                          as="textarea"
                          rows={6}
                          name="message"
                          placeholder="Write your message here..."
                          value={formData.message}
                          onChange={handleChange}
                          required
                          className="rounded-3 border-light bg-light"
                        />
                      </Form.Group>
                    </Col>

                    {/* Submit */}
                    <Col md={12}>
                      <Button
                        type="submit"
                        variant="primary"
                        disabled={loading}
                        className="w-100 py-3 rounded-3 fw-bold d-flex align-items-center justify-content-center gap-2 shadow-sm"
                      >
                        {loading ? (
                          "Sending..."
                        ) : (
                          <>
                            <Send size={18} />
                            Send Message
                          </>
                        )}
                      </Button>
                    </Col>
                  </Row>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      <style>{`
        .contact-icon {
          width: 50px;
          height: 50px;
          min-width: 50px;
          border-radius: 14px;
          background: rgba(13, 110, 253, 0.1);
          color: #0d6efd;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .form-control:focus {
          box-shadow: none;
          border-color: #0d6efd;
          background: #fff !important;
        }

        .card {
          transition: all 0.3s ease;
        }

        .card:hover {
          transform: translateY(-3px);
        }
      `}</style>
    </div>
  );
};

export default Contact;

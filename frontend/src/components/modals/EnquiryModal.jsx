import { useState, useEffect } from "react";
import {
  Modal,
  Button,
  Form,
  Row,
  Col,
  Alert,
  Spinner,
} from "react-bootstrap";
import api from "../../utils/api";
import {
  Send,
  Phone,
  CheckCircle,
  CreditCard,
  Smartphone,
  X,
} from "lucide-react";
import { whatsappLink } from "../../config/site";

const EnquiryModal = ({
  show,
  handleClose,
  property,
  unit,
  onSuccess,
}) => {
  const initialMessage = unit
    ? `I am interested in ${unit.unitNumber} of ${property?.title}. Please provide more details.`
    : `I am interested in ${property?.title || "this property"}. Please provide more details.`;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: initialMessage,
  });

  const [showPayment, setShowPayment] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("upi");

  const [isSubmitted, setIsSubmitted] = useState(false);

  const [status, setStatus] = useState({
    type: "",
    msg: "",
  });

  const [phoneError, setPhoneError] = useState("");

  useEffect(() => {
    if (show) {
      const localUser = JSON.parse(localStorage.getItem("user") || "{}");
      setFormData({
        name: localUser.name || "",
        email: localUser.email || "",
        phone: localUser.phone || "",
        message: initialMessage,
      });

      setShowPayment(false);
      setPaymentLoading(false);
      setPaymentSuccess(false);
      setPaymentMethod("upi");
      setIsSubmitted(false);
      setStatus({ type: "", msg: "" });
      setPhoneError("");
    }
  }, [show, property, unit]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone") {
      const clean = value.replace(/\D/g, "");

      setFormData({
        ...formData,
        [name]: clean,
      });

      if (clean.length !== 10) {
        setPhoneError("Enter valid 10 digit mobile number");
      } else {
        setPhoneError("");
      }

      return;
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setStatus({ type: "", msg: "" });

    if (formData.phone.length !== 10) {
      setPhoneError("Enter valid 10 digit mobile number");
      return;
    }

    try {
      await api.post("/api/leads", {
        ...formData,
        propertyId: property?._id,
      });

      setIsSubmitted(true);

      if (onSuccess) {
        onSuccess();
      }

      setTimeout(() => {
        handleClose();
      }, 3000);
    } catch (err) {
      console.warn("Lead API unavailable, saved locally.", err?.message);
      const savedLeads = JSON.parse(localStorage.getItem("localLeads") || "[]");
      localStorage.setItem(
        "localLeads",
        JSON.stringify([
          { ...formData, propertyId: property?._id, createdAt: new Date().toISOString() },
          ...savedLeads,
        ])
      );
      setIsSubmitted(true);
      if (onSuccess) onSuccess();
      setTimeout(() => {
        handleClose();
      }, 3000);
    }
  };

  const openWhatsApp = () => {
    const unitText = unit
      ? `\n*Unit:* ${unit.unitNumber}\n*Size:* ${unit.size} sqft`
      : "";

    const text = `
*New Property Inquiry*

*Property:* ${property?.title}
${unitText}
*Project:* ${property?.project}
*Location:* ${property?.location}
*Price:* Rs ${(property?.price / 100000).toFixed(2)} L

*Customer Details*
*Name:* ${formData.name || "Interested Buyer"}
*Phone:* ${formData.phone || "N/A"}

Please share more details and schedule a site visit.
`;

    window.open(whatsappLink(text), "_blank");
  };

  const forceClose = () => {
    setShowPayment(false);
    setPaymentSuccess(false);
    setIsSubmitted(false);

    handleClose();
  };

  const handleBooking = async () => {
    if (!formData.name || formData.phone.length !== 10) {
      setPhoneError("Please enter valid details first");
      return;
    }

    setPaymentLoading(true);

    try {
      const userId = localStorage.getItem("userId");

      await axios.post(`/api/inventory/${unit._id}/book`, {
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        bookedBy: userId,
        bookingAmount: 21000,
        paymentMethod,
        notes: `Online booking using ${paymentMethod}`,
      });

      // Update local booked units for UI consistency
      const localBookedUnits = JSON.parse(localStorage.getItem("localBookedUnits") || "[]");
      if (!localBookedUnits.includes(unit._id)) {
        localStorage.setItem("localBookedUnits", JSON.stringify([...localBookedUnits, unit._id]));
      }

      setPaymentLoading(false);
      setPaymentSuccess(true);
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error("Booking Error:", err);
      const errorMsg = err.response?.data?.message || err.message || "Booking failed. Please try again.";
      
      // If it's a 409 (Already Booked), we should definitely not show success
      if (err.response?.status === 409 || err.response?.status === 400) {
        alert(errorMsg);
        setPaymentLoading(false);
        return;
      }

      // Only fallback to local success if server is totally unreachable (for demo/offline mode)
      if (!err.response) {
        console.warn("Server unreachable, falling back to local state.");
        const localBookedUnits = JSON.parse(localStorage.getItem("localBookedUnits") || "[]");
        localStorage.setItem("localBookedUnits", JSON.stringify([...localBookedUnits, unit._id]));
        
        setPaymentLoading(false);
        setPaymentSuccess(true);
        if (onSuccess) onSuccess();
      } else {
        alert(errorMsg);
        setPaymentLoading(false);
      }
    }
  };

  return (
    <>
      {/* MAIN MODAL */}
      <Modal
        show={show}
        onHide={handleClose}
        centered
        backdrop="static"
        keyboard={false}
        className="ec-form-modal"
      >
        <Modal.Header className="border-0 pb-0">
          <Modal.Title className="fw-bold">
            {unit
              ? `Enquire About ${unit.unitNumber}`
              : `Enquire About ${property?.title}`}
          </Modal.Title>

          <Button
            variant="light"
            className="rounded-circle border-0 p-2 ms-auto"
            onClick={handleClose}
          >
            <X size={18} />
          </Button>
        </Modal.Header>

        <Modal.Body className="p-4">
          {/* SUCCESS */}
          {isSubmitted ? (
            <div className="text-center py-5">
              <div className="bg-success bg-opacity-10 d-inline-flex p-4 rounded-circle mb-4">
                <CheckCircle size={60} className="text-success" />
              </div>

              <h3 className="fw-bold mb-3">
                Request Submitted Successfully
              </h3>

              <p className="text-muted">
                Our team will contact you shortly on{" "}
                <strong>{formData.phone}</strong>
              </p>

              <Button
                variant="outline-primary"
                className="rounded-pill px-4 mt-3"
                onClick={forceClose}
              >
                Close
              </Button>
            </div>
          ) : (
            <>
              {/* ALERT */}
              {status.msg && (
                <Alert variant={status.type}>{status.msg}</Alert>
              )}

              {/* UNIT INFO */}
              {unit && (
                <div className="bg-primary bg-opacity-10 rounded-4 p-4 mb-4 border">
                  <Row className="g-3">
                    <Col xs={6}>
                      <small className="text-muted fw-bold">
                        Unit Number
                      </small>

                      <div className="fw-bold text-primary fs-5">
                        {unit.unitNumber}
                      </div>
                    </Col>

                    <Col xs={6}>
                      <small className="text-muted fw-bold">Size</small>

                      <div className="fw-bold text-primary fs-5">
                        {unit.size} sqft
                      </div>
                    </Col>

                    {unit.price && (
                      <Col xs={12}>
                        <small className="text-muted fw-bold">Price</small>

                        <div className="fw-bold text-primary fs-4">
                          Rs {(unit.price / 100000).toFixed(2)} L
                        </div>
                      </Col>
                    )}
                  </Row>
                </div>
              )}

              {/* FORM */}
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">
                    Full Name
                  </Form.Label>

                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="py-2"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">
                    Phone Number
                  </Form.Label>

                  <Form.Control
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    maxLength={10}
                    required
                    className="py-2"
                  />

                  {phoneError && (
                    <small className="text-danger">
                      {phoneError}
                    </small>
                  )}
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">
                    Email Address
                  </Form.Label>

                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="py-2"
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label className="fw-semibold">
                    Message
                  </Form.Label>

                  <Form.Control
                    as="textarea"
                    rows={4}
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                  />
                </Form.Group>

                {/* BUTTONS */}
                <div className="d-grid gap-3">
                  <Button
                    type="submit"
                    variant="primary"
                    className="fw-bold py-3 rounded-3"
                  >
                    <Send size={18} className="me-2" />
                    Send Enquiry
                  </Button>

                  {unit && (
                    <Button
                      variant="dark"
                      className="fw-bold py-3 rounded-3"
                      onClick={() => {
                        if (
                          !formData.name ||
                          formData.phone.length !== 10
                        ) {
                          setPhoneError(
                            "Please enter valid details first",
                          );
                          return;
                        }

                        setShowPayment(true);
                      }}
                    >
                      <CreditCard size={18} className="me-2" />
                      Book Now (Rs 21,000)
                    </Button>
                  )}

                  <Button
                    variant="outline-success"
                    className="fw-bold py-3 rounded-3"
                    onClick={openWhatsApp}
                  >
                    <Phone size={18} className="me-2" />
                    Chat on WhatsApp
                  </Button>
                </div>
              </Form>
            </>
          )}
        </Modal.Body>
      </Modal>

      {/* PAYMENT MODAL */}
      <Modal
        show={showPayment}
        onHide={() =>
          !paymentLoading && setShowPayment(false)
        }
        centered
        backdrop="static"
        className="ec-form-modal"
      >
        <Modal.Header closeButton={!paymentLoading}>
          <Modal.Title className="fw-bold">
            Complete Booking
          </Modal.Title>
        </Modal.Header>

        <Modal.Body className="p-4">
          {paymentSuccess ? (
            <div className="text-center py-4">
              <div className="bg-success bg-opacity-10 d-inline-flex p-4 rounded-circle mb-4">
                <CheckCircle size={60} className="text-success" />
              </div>

              <h3 className="fw-bold mb-2">
                Booking Successful
              </h3>

              <p className="text-muted">
                Unit <strong>{unit?.unitNumber}</strong> has
                been reserved for you.
              </p>

              <Button
                variant="primary"
                className="rounded-pill px-5 mt-3"
                onClick={forceClose}
              >
                Awesome
              </Button>
            </div>
          ) : (
            <>
              <div className="bg-light rounded-4 p-4 text-center mb-4">
                <small className="text-muted fw-bold">
                  Booking Amount
                </small>

                <h2 className="fw-bold text-primary mb-0">
                  Rs 21,000
                </h2>
              </div>

              <div className="d-grid gap-3 mb-4">
                <Button
                  variant={
                    paymentMethod === "upi"
                      ? "primary"
                      : "outline-secondary"
                  }
                  className="text-start py-3 rounded-3"
                  onClick={() => setPaymentMethod("upi")}
                >
                  <Smartphone size={20} className="me-2" />
                  UPI / GPay / PhonePe
                </Button>

                <Button
                  variant={
                    paymentMethod === "card"
                      ? "primary"
                      : "outline-secondary"
                  }
                  className="text-start py-3 rounded-3"
                  onClick={() => setPaymentMethod("card")}
                >
                  <CreditCard size={20} className="me-2" />
                  Debit / Credit Card
                </Button>
              </div>

              <Button
                variant="dark"
                className="w-100 py-3 fw-bold rounded-pill"
                onClick={handleBooking}
                disabled={paymentLoading}
              >
                {paymentLoading ? (
                  <>
                    <Spinner
                      animation="border"
                      size="sm"
                      className="me-2"
                    />
                    Processing Payment...
                  </>
                ) : (
                  `Pay Rs 21,000`
                )}
              </Button>
            </>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
};

export default EnquiryModal;

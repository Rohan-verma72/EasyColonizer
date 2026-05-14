import { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Alert,
  Nav,
} from "react-bootstrap";
import { ArrowRight, LayoutGrid } from "lucide-react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import {
  loginLocalUser,
  persistSession,
  registerLocalUser,
} from "../../utils/authFallback";
import { useTenant } from "../../context/TenantContext";

const AdminLogin = ({ onLogin }) => {
  const { tenant } = useTenant();
  const [isSignup, setIsSignup] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    name: "",
    email: "",
    phone: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const primaryColor = tenant?.theme?.primaryColor || "#1a237e";
  const secondaryColor = tenant?.theme?.secondaryColor || "#ffd700";
  const brandName = tenant?.name || "EASY COLONIZER";

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const resetMessages = () => {
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    resetMessages();
    setLoading(true);

    try {
      const endpoint = isSignup
        ? "/api/auth/register"
        : "/api/auth/login";

      let response;

      try {
        response = await axios.post(endpoint, formData, {
          timeout: 10000,
        });
      } catch (apiErr) {
        try {
          response = {
            data: isSignup
              ? registerLocalUser(formData)
              : loginLocalUser(formData),
          };
        } catch {
          if (apiErr?.response) throw apiErr;
          throw apiErr;
        }
      }

      if (isSignup) {
        setSuccess("Account created successfully!");

        setFormData({
          username: "",
          password: "",
          name: "",
          email: "",
          phone: "",
        });

        setTimeout(() => {
          setIsSignup(false);
          setSuccess("");
        }, 1500);

        return;
      }

      const data = response.data;
      const { username, role } = persistSession(data);

      if (role === "admin" || role === "manager") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("AUTH ERROR:", err);

      const message =
        err.response?.data?.message ||
        err.message ||
        "Something went wrong";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center py-5"
      style={{
        background: `linear-gradient(135deg, ${primaryColor} 0%, #111827 100%)`,
      }}
    >
      <style>
        {`
          .custom-input:focus {
            border-color: ${secondaryColor} !important;
            box-shadow: 0 0 0 0.25rem ${primaryColor}40 !important;
            background-color: rgba(255,255,255,0.05) !important;
          }
          .nav-link.active {
            background-color: ${primaryColor} !important;
            color: white !important;
          }
          .btn-primary-custom {
            background-color: ${primaryColor} !important;
            border: none !important;
            transition: all 0.3s ease;
          }
          .btn-primary-custom:hover {
            filter: brightness(1.2);
            transform: translateY(-2px);
            box-shadow: 0 10px 20px rgba(0,0,0,0.2);
          }
        `}
      </style>

      <Link
        to="/"
        className="position-fixed top-0 end-0 m-4 btn btn-light fw-bold shadow-sm rounded-pill px-4"
        style={{ zIndex: 2, color: primaryColor }}
      >
        Back to Website
      </Link>

      <Container>
        <Row className="justify-content-center">
          <Col md={7} lg={5}>
            <Card
              className="border-0 shadow-lg rounded-4 overflow-hidden"
              style={{
                background: "rgba(255,255,255,0.05)",
                backdropFilter: "blur(25px)",
                border: "1px solid rgba(255,255,255,0.1) !important"
              }}
            >
              <Card.Body className="p-4 p-md-5">
                {/* HEADER */}
                <div className="text-center mb-4">
                   <div className="d-flex justify-content-center mb-3">
                    {tenant?.logo ? (
                      <img src={tenant.logo} alt="Logo" style={{ maxHeight: '70px', width: 'auto' }} />
                    ) : (
                      <div className="p-3 rounded-circle bg-white bg-opacity-10">
                        <LayoutGrid size={40} color="white" />
                      </div>
                    )}
                  </div>
                  
                  <h2 className="fw-bold text-white mb-2" style={{ letterSpacing: '-0.5px' }}>
                    {brandName.split(" ")[0]}
                    {" "}
                    <span style={{ color: secondaryColor }}>
                      {brandName.split(" ").slice(1).join(" ")}
                    </span>
                  </h2>

                  <p className="text-light opacity-75 small">
                    {isSignup
                      ? "Join the premium real estate network"
                      : "Welcome back to your portal"}
                  </p>
                </div>

                {/* TABS */}
                <div className="bg-dark bg-opacity-25 rounded-pill p-1 mb-4 d-flex">
                  <Button
                    className={`flex-fill rounded-pill border-0 py-2 fw-bold transition-all ${!isSignup ? "" : "text-light opacity-50"}`}
                    style={{
                      backgroundColor: !isSignup ? primaryColor : "transparent",
                      color: "white"
                    }}
                    onClick={() => {
                      setIsSignup(false);
                      resetMessages();
                    }}
                  >
                    Login
                  </Button>
                  <Button
                    className={`flex-fill rounded-pill border-0 py-2 fw-bold transition-all ${isSignup ? "" : "text-light opacity-50"}`}
                    style={{
                      backgroundColor: isSignup ? primaryColor : "transparent",
                      color: "white"
                    }}
                    onClick={() => {
                      setIsSignup(true);
                      resetMessages();
                    }}
                  >
                    Sign Up
                  </Button>
                </div>

                {/* ALERTS */}
                {error && (
                  <Alert variant="danger" className="border-0 shadow-sm bg-danger bg-opacity-75 text-white">
                    {error}
                  </Alert>
                )}

                {success && (
                  <Alert variant="success" className="border-0 shadow-sm bg-success bg-opacity-75 text-white">
                    {success}
                  </Alert>
                )}

                {/* FORM */}
                <Form onSubmit={handleSubmit}>
                  {isSignup && (
                    <>
                      <Form.Group className="mb-3">
                        <Form.Control
                          type="text"
                          name="name"
                          placeholder="Full Name"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          className="bg-white bg-opacity-10 border-white border-opacity-25 text-white py-3 custom-input"
                        />
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Control
                          type="email"
                          name="email"
                          placeholder="Email Address"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          className="bg-white bg-opacity-10 border-white border-opacity-25 text-white py-3 custom-input"
                        />
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Control
                          type="tel"
                          name="phone"
                          placeholder="Phone Number"
                          required
                          value={formData.phone}
                          onChange={handleChange}
                          className="bg-white bg-opacity-10 border-white border-opacity-25 text-white py-3 custom-input"
                        />
                      </Form.Group>
                    </>
                  )}

                  <Form.Group className="mb-3">
                    <Form.Control
                      type="text"
                      name="username"
                      placeholder="Username"
                      required
                      value={formData.username}
                      onChange={handleChange}
                      className="bg-white bg-opacity-10 border-white border-opacity-25 text-white py-3 custom-input"
                    />
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Control
                      type="password"
                      name="password"
                      placeholder="Password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className="bg-white bg-opacity-10 border-white border-opacity-25 text-white py-3 custom-input"
                    />
                  </Form.Group>

                  {/* BUTTON */}
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-100 py-3 fw-bold border-0 d-flex align-items-center justify-content-center gap-2 shadow-lg btn-primary-custom"
                  >
                    {loading
                      ? "Please wait..."
                      : isSignup
                        ? "Create Account"
                        : "Login Now"}

                    {!loading && (
                      <ArrowRight size={18} />
                    )}
                  </Button>
                </Form>

                <div className="text-center mt-4 text-light opacity-50 small">
                  {isSignup ? "Already have an account? Login above" : "Access your secure real estate portal"}
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AdminLogin;

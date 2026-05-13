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
import { ArrowRight } from "lucide-react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import {
  loginLocalUser,
  persistSession,
  registerLocalUser,
} from "../../utils/authFallback";

const AdminLogin = ({ onLogin }) => {
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
        background:
          "linear-gradient(135deg, #101827 0%, #22314d 56%, #3b2f1b 100%)",
      }}
    >
      <Link
        to="/"
        className="position-fixed top-0 end-0 m-4 btn btn-light fw-bold"
        style={{ zIndex: 2, color: "#0b4f49" }}
      >
        Back to Website
      </Link>
      <Container>
        <Row className="justify-content-center">
          <Col md={7} lg={5}>
            <Card
              className="border-0 shadow-lg rounded-4 overflow-hidden"
              style={{
                background: "rgba(255,255,255,0.08)",
                backdropFilter: "blur(20px)",
              }}
            >
              <Card.Body className="p-4 p-md-5">
                {/* HEADER */}
                <div className="text-center mb-4">
                  <h2 className="fw-bold text-white">
                    EASY{" "}
                    <span style={{ color: "#14b8a6" }}>
                      COLONIZER
                    </span>
                  </h2>

                  <p className="text-light opacity-75 small">
                    {isSignup
                      ? "Create your account"
                      : "Welcome back"}
                  </p>
                  <p className="text-light opacity-75 small mb-0">
                    Demo: admin/admin123 or customer/customer123
                  </p>
                </div>

                {/* TABS */}
                <Nav
                  variant="pills"
                  activeKey={isSignup ? "signup" : "login"}
                  className="bg-dark bg-opacity-25 rounded-pill p-1 mb-4"
                >
                  <Nav.Item className="flex-fill">
                    <Nav.Link
                      eventKey="login"
                      className="rounded-pill text-center"
                      onClick={() => {
                        setIsSignup(false);
                        resetMessages();
                      }}
                    >
                      Login
                    </Nav.Link>
                  </Nav.Item>

                  <Nav.Item className="flex-fill">
                    <Nav.Link
                      eventKey="signup"
                      className="rounded-pill text-center"
                      onClick={() => {
                        setIsSignup(true);
                        resetMessages();
                      }}
                    >
                      Sign Up
                    </Nav.Link>
                  </Nav.Item>
                </Nav>

                {/* ALERTS */}
                {error && (
                  <Alert variant="danger">
                    {error}
                  </Alert>
                )}

                {success && (
                  <Alert variant="success">
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
                          className="bg-dark bg-opacity-25 border-secondary text-white py-3"
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
                          className="bg-dark bg-opacity-25 border-secondary text-white py-3"
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
                          className="bg-dark bg-opacity-25 border-secondary text-white py-3"
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
                      className="bg-dark bg-opacity-25 border-secondary text-white py-3"
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
                      className="bg-dark bg-opacity-25 border-secondary text-white py-3"
                    />
                  </Form.Group>

                  {/* BUTTON */}
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-100 py-3 fw-bold border-0 d-flex align-items-center justify-content-center gap-2"
                    style={{
                      background:
                        "linear-gradient(135deg, #0f766e, #0b4f49)",
                    }}
                  >
                    {loading
                      ? "Please wait..."
                      : isSignup
                        ? "Create Account"
                        : "Login"}

                    {!loading && (
                      <ArrowRight size={18} />
                    )}
                  </Button>
                </Form>

                <div className="text-center mt-4 text-light opacity-75 small">
                  Secure admin and customer access
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

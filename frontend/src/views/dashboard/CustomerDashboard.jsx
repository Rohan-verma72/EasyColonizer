

import { useState, useEffect } from "react";
import {
  Container,
  Table,
  Button,
  Badge,
  Card,
  Modal,
  Form,
  Row,
  Col,
  Spinner,
} from "react-bootstrap";

import {
  Package,
  User,
  MapPin,
  LogOut,
  Edit3,
  ShieldCheck,
  Calendar,
  Menu,
  X,
  Heart,
  ExternalLink,
  XCircle,
} from "lucide-react";

import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import {
  getPropertyImage,
  normalizePropertiesResponse,
  resolveWishlistProperties,
} from "../../utils/propertyData";
import {
  getLocalUserProfile,
  updateLocalUserProfile,
} from "../../utils/authFallback";
import { demoProperties } from "../../utils/demoData";

// Use relative URLs so Next.js proxy handles routing to backend
const API = axios.create({
  baseURL: "",
});

const CustomerDashboard = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("portfolio");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  const [bookings, setBookings] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  const [loading, setLoading] = useState(true);

  const [user, setUser] = useState(null);

  const [showEditModal, setShowEditModal] = useState(false);

  const [editData, setEditData] = useState({
    name: "",
    phone: "",
    email: "",
  });

  // ADD PROJECT MODAL - removed (admin only feature)
  // ADD EMPLOYEE MODAL - removed (admin only feature)

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    if (!token || !userId) {
      navigate("/");
      return;
    }

    if (window.innerWidth < 992) {
      setIsSidebarOpen(false);
      setIsMobile(true);
    }

    fetchData();
    loadWishlist();

    const handleResize = () => {
      setIsMobile(window.innerWidth < 992);
    };

    window.addEventListener("wishlistUpdated", loadWishlist);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("wishlistUpdated", loadWishlist);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const loadWishlist = () => {
    const savedIds = JSON.parse(localStorage.getItem("wishlist") || "[]");
    const ids = savedIds.map((item) =>
      typeof item === "object" ? item._id : item
    );

    axios
      .get("/api/properties")
      .then((res) => {
        const source = normalizePropertiesResponse(res.data);
        setWishlist(resolveWishlistProperties(source.length ? source : demoProperties));
      })
      .catch(() => {
        setWishlist(resolveWishlistProperties(demoProperties));
      });

    if (!ids.length) setWishlist([]);
  };

  const fetchData = async () => {
    try {
      const userId = localStorage.getItem("userId");

      const [bookingRes, userRes] = await Promise.all([
        API.get(`/api/inventory/customer/${userId}`).catch(() => ({
          data: { data: [] },
        })),

        API.get(`/api/users/profile/${userId}`).catch(() => ({
          data: {},
        })),
      ]);

      // inventory/customer returns { success, count, data: [...] }
      const bookingData = Array.isArray(bookingRes.data)
        ? bookingRes.data
        : Array.isArray(bookingRes.data?.data)
        ? bookingRes.data.data
        : [];

      // MERGE WITH LOCAL BOOKINGS
      const localBookings = JSON.parse(localStorage.getItem("localBookings") || "[]");
      const mergedBookings = [...bookingData];

      localBookings.forEach(lb => {
        if (!mergedBookings.find(b => b._id === lb._id)) {
          mergedBookings.unshift(lb);
        }
      });

      setBookings(mergedBookings);
      setUser(userRes.data || {});
      
      if (!userRes.data?._id) {
        setUser(getLocalUserProfile(userId) || {});
      }

      setEditData({
        name: userRes.data?.name || getLocalUserProfile(userId)?.name || "",
        phone: userRes.data?.phone || getLocalUserProfile(userId)?.phone || "",
        email: userRes.data?.email || getLocalUserProfile(userId)?.email || "",
      });
    } catch (err) {
      console.log(err);
      const localProfile = getLocalUserProfile(localStorage.getItem("userId"));
      setBookings([]);
      setUser(localProfile || {});
      setEditData({
        name: localProfile?.name || "",
        phone: localProfile?.phone || "",
        email: localProfile?.email || "",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (unitId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;

    try {
      await API.post(`/api/inventory/${unitId}/cancel`);
      
      // Update local storage for demo sync
      const localBooked = JSON.parse(localStorage.getItem("localBookedUnits") || "[]");
      const updatedLocal = localBooked.filter(id => id !== unitId);
      localStorage.setItem("localBookedUnits", JSON.stringify(updatedLocal));

      // Refresh data
      fetchData();
      alert("Booking cancelled successfully");
    } catch (err) {
      console.warn("Cancel API failed, using local fallback", err);
      
      // Local fallback
      const localBooked = JSON.parse(localStorage.getItem("localBookedUnits") || "[]");
      const updatedLocal = localBooked.filter(id => id !== unitId);
      localStorage.setItem("localBookedUnits", JSON.stringify(updatedLocal));
      
      setBookings(prev => prev.filter(b => b._id !== unitId));
      alert("Booking cancelled locally");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  // ===========================
  // LOADING
  // ===========================

  if (loading) {
    return (
      <div className="vh-100 d-flex justify-content-center align-items-center">
        <Spinner animation="border" />
      </div>
    );
  }

  return (
    <div className="bg-light min-vh-100">

      {/* MOBILE OVERLAY */}
      {isSidebarOpen && isMobile && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.4)",
            zIndex: 1040,
          }}
        />
      )}

      {/* SIDEBAR */}
      <div
        className="bg-white shadow"
        style={{
          width: "280px",
          height: "100vh",
          position: "fixed",
          top: 0,
          left: isSidebarOpen ? 0 : "-280px",
          transition: "0.3s",
          zIndex: 1050,
        }}
      >
        <div className="p-4 border-bottom d-flex justify-content-between align-items-center">
          <Link to="/" className="text-decoration-none">
            <h4 className="fw-bold mb-0">
              <span className="text-primary">EASY</span>COLONIZER
            </h4>
          </Link>

          <X
            className="d-lg-none"
            style={{ cursor: "pointer" }}
            onClick={() => setIsSidebarOpen(false)}
          />
        </div>

        <div className="p-3">

          <SidebarItem
            id="portfolio"
            label="My Assets"
            icon={Package}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />

          <SidebarItem
            id="wishlist"
            label="Wishlist"
            icon={Heart}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />

          <SidebarItem
            id="profile"
            label="Profile"
            icon={User}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />

          {/* LOGOUT */}
          <div
            className="mt-4 text-danger fw-bold"
            style={{ cursor: "pointer" }}
            onClick={handleLogout}
          >
            <LogOut size={18} className="me-2" />
            Logout
          </div>

          <div className="mt-auto pt-4 border-top">
            <Link
              to="/"
              className="p-3 rounded fw-bold d-flex align-items-center gap-2 text-decoration-none text-primary bg-primary bg-opacity-10 hover-bg-opacity-20"
              style={{ transition: "0.2s" }}
            >
              <ExternalLink size={18} />
              Back to Website
            </Link>
          </div>
        </div>
      </div>

      {/* MAIN */}
      <div
        style={{
          marginLeft: isSidebarOpen && !isMobile ? "280px" : "0",
          transition: "0.3s",
        }}
      >

        {/* TOPBAR */}
        <div className="bg-white shadow-sm p-3 d-flex justify-content-between align-items-center sticky-top">
          <div className="d-flex align-items-center gap-3">

            <Menu
              style={{ cursor: "pointer" }}
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            />

            <h5 className="mb-0 text-capitalize">
              {activeTab}
            </h5>

          </div>

          <div className="d-flex align-items-center gap-2">
            <span className="fw-bold">{user?.name || "Customer"}</span>
          </div>
        </div>

        <Container fluid className="p-4">

          {/* PORTFOLIO */}
          {activeTab === "portfolio" && (
            <>
              <Row className="g-4 mb-4">

                <StatCard
                  title="Total Properties"
                  value={bookings.length}
                  icon={Package}
                />

                <StatCard
                  title="Status"
                  value="Verified"
                  icon={ShieldCheck}
                />

                <StatCard
                  title="Member Since"
                  value={
                    user?.createdAt
                      ? new Date(user.createdAt).getFullYear()
                      : "2024"
                  }
                  icon={Calendar}
                />

              </Row>

              <Card className="border-0 shadow-sm">
                <Table responsive hover>

                  <thead>
                    <tr>
                      <th>Project</th>
                      <th>Unit</th>
                      <th>Size</th>
                      <th>Price</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>

                  <tbody>

                    {bookings.map((b) => (
                      <tr key={b._id}>

                        <td>{b.propertyId?.title}</td>

                        <td>
                          <Badge bg="dark">
                            {b.block}-{b.unitNumber}
                          </Badge>
                        </td>

                        <td>{b.size} sqft</td>

                        <td className="fw-bold text-primary">
                          ₹{Number(b.price).toLocaleString()}
                        </td>

                        <td>
                          <Badge
                            bg={
                              b.status === "Sold"
                                ? "success"
                                : "warning"
                            }
                          >
                            {b.status}
                          </Badge>
                        </td>

                        <td>
                          {b.status === "Booked" && (
                            <Button 
                              variant="outline-danger" 
                              size="sm"
                              className="d-flex align-items-center gap-1"
                              onClick={() => handleCancelBooking(b._id.replace("booking-", ""))}
                            >
                              <XCircle size={14} />
                              Cancel
                            </Button>
                          )}
                        </td>

                      </tr>
                    ))}

                  </tbody>
                </Table>
              </Card>
            </>
          )}

          {/* WISHLIST */}
          {activeTab === "wishlist" && (
            <Row className="g-4">
              {wishlist.length > 0 ? (
                wishlist.map((item) => (
                  <Col md={4} key={item._id}>
                    <Card className="border-0 shadow-sm h-100 overflow-hidden property-card-hover">
                      <Link to={`/property/${item._id}`} className="text-decoration-none">
                        <div className="position-relative overflow-hidden">
                          <img
                            src={getPropertyImage(item)}
                            alt={item.title}
                            className="w-100 property-zoom-img"
                            style={{
                              height: "220px",
                              objectFit: "cover",
                              transition: "0.5s"
                            }}
                          />
                        </div>
                      </Link>

                      <Card.Body>
                        <h5 className="fw-bold mb-1">
                          <Link to={`/property/${item._id}`} className="text-decoration-none text-dark hover-text-primary">
                            {item.title}
                          </Link>
                        </h5>

                        <p className="text-muted small mb-2">
                          <MapPin size={14} className="text-primary me-1" />
                          {item.location}
                        </p>

                        <h6 className="text-primary fw-bold mb-0">
                          ₹{Number(item.price).toLocaleString()}
                        </h6>
                      </Card.Body>
                    </Card>
                  </Col>
                ))
              ) : (
                <Col xs={12} className="text-center py-5">
                  <div className="bg-white p-5 rounded-4 shadow-sm d-inline-block">
                    <Heart size={50} className="text-muted mb-3" />
                    <h4>Your wishlist is empty</h4>
                    <p className="text-muted mb-4">Start exploring projects to add them here.</p>
                    <Button as={Link} to="/projects" variant="primary" className="rounded-pill px-4">
                      Explore Projects
                    </Button>
                  </div>
                </Col>
              )}
            </Row>
          )}

          {/* PROFILE */}
          {activeTab === "profile" && (
            <Card className="border-0 shadow-sm p-4">

              <div className="d-flex justify-content-between align-items-center mb-4">

                <h3 className="fw-bold">
                  My Profile
                </h3>

                <Button
                  onClick={() => setShowEditModal(true)}
                >
                  <Edit3 size={16} className="me-2" />
                  Edit
                </Button>

              </div>

              <Row className="g-4">

                <Col md={6}>
                  <small className="text-muted">Name</small>
                  <h5>{user?.name}</h5>
                </Col>

                <Col md={6}>
                  <small className="text-muted">Email</small>
                  <h5>{user?.email}</h5>
                </Col>

                <Col md={6}>
                  <small className="text-muted">Phone</small>
                  <h5>{user?.phone}</h5>
                </Col>

              </Row>

            </Card>
          )}

        </Container>
      </div>

      {/* EDIT PROFILE MODAL */}
      <Modal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Profile</Modal.Title>
        </Modal.Header>

        <Modal.Body>

          <Form
            onSubmit={async (e) => {
              e.preventDefault();

              try {
                await API.put(
                  `/api/users/profile/${user._id}`,
                  editData
                );

                fetchData();

                setShowEditModal(false);

                alert("Profile Updated");
              } catch (err) {
                const updatedProfile = updateLocalUserProfile(user._id, editData);
                setUser(updatedProfile);
                setShowEditModal(false);
              }
            }}
          >

            <Form.Control
              className="mb-3"
              placeholder="Name"
              value={editData.name}
              onChange={(e) =>
                setEditData({
                  ...editData,
                  name: e.target.value,
                })
              }
            />

            <Form.Control
              className="mb-3"
              placeholder="Email"
              value={editData.email}
              onChange={(e) =>
                setEditData({
                  ...editData,
                  email: e.target.value,
                })
              }
            />

            <Form.Control
              className="mb-3"
              placeholder="Phone"
              value={editData.phone}
              onChange={(e) =>
                setEditData({
                  ...editData,
                  phone: e.target.value,
                })
              }
            />

            <Button type="submit" className="w-100">
              Save Changes
            </Button>

          </Form>

        </Modal.Body>
      </Modal>
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

const SidebarItem = ({
  id,
  label,
  icon: Icon,
  activeTab,
  setActiveTab,
}) => {
  return (
    <div
      onClick={() => setActiveTab(id)}
      className={`p-3 rounded mb-2 fw-bold d-flex align-items-center gap-2 ${
        activeTab === id
          ? "bg-primary text-white"
          : "bg-light"
      }`}
      style={{ cursor: "pointer" }}
    >
      <Icon size={18} />
      {label}
    </div>
  );
};

const StatCard = ({ title, value, icon: Icon }) => {
  return (
    <Col md={4}>
      <Card className="border-0 shadow-sm">
        <Card.Body className="d-flex align-items-center gap-3">

          <div className="bg-primary bg-opacity-10 p-3 rounded-circle">
            <Icon className="text-primary" size={22} />
          </div>

          <div>
            <small className="text-muted">{title}</small>
            <h5 className="fw-bold mb-0">{value}</h5>
          </div>

        </Card.Body>
      </Card>
    </Col>
  );
};

export default CustomerDashboard;

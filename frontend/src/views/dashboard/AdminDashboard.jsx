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
  Users,
  Home,
  Trash2,
  Edit,
  Plus,
  LogOut,
  DollarSign,
  Activity,
  LayoutGrid,
  Package,
  Settings,
  ShieldCheck,
  Menu,
  X,
  ExternalLink,
} from "lucide-react";

import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  getPropertyImage,
  normalizePropertiesResponse,
} from "../../utils/propertyData";
import {
  demoInventory,
  demoProperties,
  demoLeads,
  demoUsers,
  demoVisits,
} from "../../utils/demoData";

const API = axios.create({
  baseURL: "",
});

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("leads");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 992);
  const [loading, setLoading] = useState(true);

  const [leads, setLeads] = useState([]);
  const [properties, setProperties] = useState([]);
  const [siteVisits, setSiteVisits] = useState([]);
  const [users, setUsers] = useState([]);

  const [showPropertyModal, setShowPropertyModal] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);
  const [propertyImagePreview, setPropertyImagePreview] = useState(null);

  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const [showInventoryModal, setShowInventoryModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [currentInventoryProperty, setCurrentInventoryProperty] = useState(null);
  const [inventoryList, setInventoryList] = useState([]);
  const [selectedBlock, setSelectedBlock] = useState("All");
  const [inventorySearch, setInventorySearch] = useState("");

  const [showUnitEditModal, setShowUnitEditModal] = useState(false);
  const [editingUnit, setEditingUnit] = useState(null);

  useEffect(() => {
    const resize = () => {
      setIsMobile(window.innerWidth < 992);
    };
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/");
      return;
    }
    // ADD TOKEN TO API
    API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    
    fetchData();
    if (window.innerWidth < 992) {
      setIsSidebarOpen(false);
    }
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [leadsRes, propsRes, visitsRes, usersRes] = await Promise.all([
        API.get("/api/leads").catch(() => ({ data: [] })),
        API.get("/api/properties").catch(() => ({ data: { properties: [] } })),
        API.get("/api/site-visits").catch(() => ({ data: [] })),
        API.get("/api/users").catch(() => ({ data: [] })),
      ]);

      const leadsList = Array.isArray(leadsRes.data) ? leadsRes.data : [];
      setLeads(leadsList);

      const propsList = normalizePropertiesResponse(propsRes.data);
      setProperties(propsList);

      const visitsList = Array.isArray(visitsRes.data) ? visitsRes.data : [];
      setSiteVisits(visitsList);

      setUsers(
        Array.isArray(usersRes.data)
          ? usersRes.data.filter((u) => u.role !== "customer")
          : []
      );
    } catch (err) {
      console.log("Fetch Error, using fallbacks:", err);
      setLeads(demoLeads);
      setProperties(demoProperties);
      setSiteVisits(demoVisits);
      setUsers(demoUsers);
    } finally {
      setLoading(false);
    }
  };

  const fetchInventory = async (propertyId) => {
    try {
      const res = await API.get(`/api/inventory/property/${propertyId}`);
      const list = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data?.data)
        ? res.data.data
        : [];
      setInventoryList(list.length ? list : demoInventory);
    } catch (err) {
      console.log(err);
      setInventoryList(demoInventory);
    }
  };

  const handleOpenInventory = (prop) => {
    setCurrentInventoryProperty(prop);
    fetchInventory(prop._id);
    setShowInventoryModal(true);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const filteredUnits = Array.isArray(inventoryList)
    ? inventoryList.filter(
        (u) =>
          (selectedBlock === "All" || u.block === selectedBlock) &&
          ((u.unitNumber || "").toLowerCase().includes(inventorySearch.toLowerCase()) ||
            (u.customerName || "").toLowerCase().includes(inventorySearch.toLowerCase()))
      )
    : [];

  const stats = {
    totalLeads: leads.length,
    newLeads: leads.filter((l) => l.status === "New").length,
    activeProperties: properties.length,
    inventoryValue: properties.reduce((acc, p) => acc + (Number(p.price) || 0), 0),
  };

  const generateReceipt = (unit) => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text("EASY COLONIZER", 20, 20);
    autoTable(doc, {
      startY: 40,
      head: [["Field", "Value"]],
      body: [
        ["Customer", unit.customerName || "N/A"],
        ["Phone", unit.customerPhone || "N/A"],
        ["Unit", unit.unitNumber],
        ["Status", unit.status],
      ],
    });
    doc.save(`Receipt-${unit.unitNumber}.pdf`);
  };

  if (loading) {
    return (
      <div className="vh-100 d-flex justify-content-center align-items-center">
        <div className="text-center">
          <Spinner animation="border" />
          <h5 className="mt-3">Loading Dashboard...</h5>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-light min-vh-100">
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

      <div
        className="bg-white shadow"
        style={{
          width: "280px",
          height: "100vh",
          position: "fixed",
          left: isSidebarOpen ? 0 : "-280px",
          top: 0,
          transition: "0.3s",
          zIndex: 1050,
        }}
      >
        <div className="p-4 border-bottom d-flex justify-content-between">
          <Link to="/" className="text-decoration-none">
            <h4 className="fw-bold text-primary mb-0">EASY COLONIZER</h4>
          </Link>
          {isMobile && (
            <X style={{ cursor: "pointer" }} onClick={() => setIsSidebarOpen(false)} />
          )}
        </div>

        <div className="p-3">
          <SidebarItem
            id="leads"
            label="CRM Leads"
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            icon={Users}
          />
          <SidebarItem
            id="properties"
            label="Projects"
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            icon={Package}
          />
          <SidebarItem
            id="visits"
            label="Site Visits"
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            icon={Activity}
          />
          <SidebarItem
            id="team"
            label="Staff"
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            icon={ShieldCheck}
          />
          <SidebarItem
            id="settings"
            label="Settings"
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            icon={Settings}
          />
          <div
            onClick={handleLogout}
            className="mt-4 text-danger fw-bold"
            style={{ cursor: "pointer" }}
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

      <div
        style={{
          marginLeft: isSidebarOpen && !isMobile ? "280px" : "0",
          transition: "0.3s",
        }}
      >
        <div className="bg-white shadow-sm p-3 d-flex justify-content-between align-items-center sticky-top">
          <div className="d-flex align-items-center gap-3">
            <Menu
              style={{ cursor: "pointer" }}
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            />
            <h5 className="mb-0 text-capitalize">{activeTab} Management</h5>
          </div>

          <div className="d-flex gap-2 ms-auto">
            {activeTab === "properties" && (
              <Button
                variant="primary"
                className="rounded-pill px-4 shadow-sm"
                onClick={() => {
                  setEditingProperty(null);
                  setPropertyImagePreview(null);
                  setShowPropertyModal(true);
                }}
              >
                <Plus size={16} className="me-2" />
                Add Project
              </Button>
            )}

            {activeTab === "team" && (
              <Button
                variant="primary"
                className="rounded-pill px-4 shadow-sm"
                onClick={() => {
                  setEditingUser(null);
                  setShowUserModal(true);
                }}
              >
                <Plus size={16} className="me-2" />
                Add Employee
              </Button>
            )}
          </div>
        </div>

        <Container fluid className="p-4">
          <Row className="g-4 mb-4">
            <StatCard title="Total Leads" value={stats.totalLeads} icon={Users} />
            <StatCard title="Total Projects" value={stats.activeProperties} icon={Home} />
            <StatCard title="New Leads" value={stats.newLeads} icon={Activity} />
            <StatCard
              title="Value"
              value={`₹${(stats.inventoryValue / 100000).toFixed(2)}L`}
              icon={DollarSign}
            />
          </Row>

          {activeTab === "leads" && (
            <Card className="border-0 shadow-sm">
              <Table responsive hover>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Name</th>
                    <th>Phone</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map((l) => (
                    <tr key={l._id}>
                      <td>{new Date(l.createdAt).toLocaleDateString("en-IN")}</td>
                      <td>{l.name}</td>
                      <td>{l.phone}</td>
                      <td>
                        <Badge bg="primary">{l.status}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card>
          )}

          {activeTab === "properties" && (
            <Card className="border-0 shadow-sm">
              <Table responsive hover>
                <thead>
                  <tr>
                    <th>Project Name</th>
                    <th>Location</th>
                    <th>Price</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {properties.map((p) => (
                    <tr key={p._id}>
                      <td>{p.title}</td>
                      <td>{p.location}</td>
                      <td>₹{p.price}</td>
                      <td>
                        <div className="d-flex gap-2">
                          <Button size="sm" onClick={() => handleOpenInventory(p)}>
                            <LayoutGrid size={15} />
                          </Button>
                          <Button
                            size="sm"
                            variant="warning"
                            onClick={() => {
                              setEditingProperty(p);
                              setPropertyImagePreview(getPropertyImage(p));
                              setShowPropertyModal(true);
                            }}
                          >
                            <Edit size={15} />
                          </Button>
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={async () => {
                              if (!window.confirm(`Are you sure you want to delete project "${p.title}"? This will also delete all its inventory units.`)) return;
                              
                              if (String(p._id).startsWith("demo-")) {
                                setProperties((prev) =>
                                  prev.filter((item) => item._id !== p._id)
                                );
                                return;
                              }
                              await API.delete(`/api/properties/${p._id}`);
                              fetchData();
                            }}
                          >
                            <Trash2 size={15} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card>
          )}

          {activeTab === "visits" && (
            <Card className="border-0 shadow-sm">
              <Table responsive hover>
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Phone</th>
                    <th>Property</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {siteVisits.map((v) => (
                    <tr key={v._id}>
                      <td>{v.customerName}</td>
                      <td>{v.customerPhone}</td>
                      <td>{v.propertyId?.title || "—"}</td>
                      <td>
                        {v.visitDate
                          ? new Date(v.visitDate).toLocaleDateString("en-IN")
                          : "—"}
                      </td>
                      <td>{v.visitTime}</td>
                      <td>
                        <Badge
                          bg={
                            v.status === "Confirmed"
                              ? "success"
                              : v.status === "Completed"
                              ? "primary"
                              : v.status === "Cancelled"
                              ? "danger"
                              : "warning"
                          }
                        >
                          {v.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card>
          )}

          {activeTab === "team" && (
            <Card className="border-0 shadow-sm">
              <Table responsive hover>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Username</th>
                    <th>Role</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u._id}>
                      <td>{u.name}</td>
                      <td>{u.username}</td>
                      <td>
                        <Badge bg="dark">{u.role}</Badge>
                      </td>
                      <td>
                        <div className="d-flex gap-2">
                          <Button
                            size="sm"
                            variant="warning"
                            onClick={() => {
                              setEditingUser(u);
                              setShowUserModal(true);
                            }}
                          >
                            <Edit size={15} />
                          </Button>
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={async () => {
                              if (!window.confirm(`Are you sure you want to delete employee "${u.name}"?`)) return;

                              if (String(u._id).startsWith("staff-")) {
                                setUsers((prev) =>
                                  prev.filter((item) => item._id !== u._id)
                                );
                                return;
                              }
                              await API.delete(`/api/users/${u._id}`);
                              fetchData();
                            }}
                          >
                            <Trash2 size={15} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card>
          )}

          {activeTab === "settings" && (
            <Card className="border-0 shadow-sm">
              <Card.Body className="p-4">
                <h4 className="fw-bold mb-2">System Status</h4>
                <p className="text-muted mb-4">
                  Admin panel uses the same dynamic `/api` routes as the public
                  website. When backend data is unavailable, demo records keep
                  the workflow testable.
                </p>
              </Card.Body>
            </Card>
          )}
        </Container>
      </div>

      <Modal
        show={showPropertyModal}
        onHide={() => {
          setShowPropertyModal(false);
          setPropertyImagePreview(null);
        }}
        centered
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {editingProperty ? "Edit Project" : "Add Project"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form
            onSubmit={async (e) => {
              e.preventDefault();
              const fd = new FormData(e.target);
              const data = {
                title: fd.get("title"),
                location: fd.get("location"),
                price: Number(fd.get("price")) || 0,
                type: fd.get("type"),
                description: fd.get("description") || fd.get("title") || "New Property",
                project: fd.get("project") || fd.get("title") || "Default Project",
                area: Number(fd.get("area")) || 1000,
                status: fd.get("status") || "Available",
                isFeatured: fd.get("isFeatured") === "on",
                amenities: {
                  parking: fd.get("parking") === "on",
                  security: fd.get("security") === "on",
                  park: fd.get("park") === "on",
                  gym: fd.get("gym") === "on",
                  pool: fd.get("pool") === "on",
                },
              };

              const imageLink = fd.get("imageLink");
              if (imageLink) {
                data.images = [imageLink];
                data.featuredImage = imageLink;
              }

              try {
                if (editingProperty && String(editingProperty._id).startsWith("demo-")) {
                  setProperties((prev) =>
                    prev.map((item) =>
                      item._id === editingProperty._id
                        ? { ...item, ...data }
                        : item
                    )
                  );
                  setShowPropertyModal(false);
                  setPropertyImagePreview(null);
                  return;
                }
                if (editingProperty) {
                  await API.put(`/api/properties/${editingProperty._id}`, data);
                } else {
                  await API.post("/api/properties", data);
                }
                fetchData();
                setShowPropertyModal(false);
                setPropertyImagePreview(null);
                alert(editingProperty ? "Project updated successfully!" : "Project added successfully!");
              } catch (err) {
                console.error("Submission Error:", err);
                const errorMsg = err.response?.data?.message || err.message;
                alert("Failed to save project: " + errorMsg);
              }
            }}
          >
            <Form.Control
              name="title"
              placeholder="Project Name"
              defaultValue={editingProperty?.title}
              className="mb-3"
              required
            />
            <Form.Control
              name="project"
              placeholder="Society / Colony Name"
              defaultValue={editingProperty?.project || editingProperty?.title}
              className="mb-3"
              required
            />
            <Form.Control
              name="location"
              placeholder="Location"
              defaultValue={editingProperty?.location}
              className="mb-3"
              required
            />
            <Form.Control
              name="price"
              type="number"
              placeholder="Price (₹)"
              defaultValue={editingProperty?.price}
              className="mb-3"
              required
            />
            <Form.Control
              name="area"
              type="number"
              placeholder="Area (sqft)"
              defaultValue={editingProperty?.area}
              className="mb-3"
            />
            <Form.Control
              as="textarea"
              rows={2}
              name="description"
              placeholder="Description"
              defaultValue={editingProperty?.description}
              className="mb-3"
            />
            <Form.Select
              name="type"
              defaultValue={editingProperty?.type || "Plot"}
              className="mb-3"
            >
              <option value="Plot">Plot</option>
              <option value="Villa">Villa</option>
              <option value="Flat">Flat</option>
              <option value="Commercial">Commercial</option>
              <option value="Building">Building</option>
              <option value="Row House">Row House</option>
            </Form.Select>

            <Form.Select
              name="status"
              defaultValue={editingProperty?.status || "Available"}
              className="mb-3"
            >
              <option value="Available">Available</option>
              <option value="Booked">Booked</option>
              <option value="Sold">Sold</option>
              <option value="On Hold">On Hold</option>
            </Form.Select>

            <div className="d-flex flex-wrap gap-3 mb-3">
              {["parking", "security", "park", "gym", "pool"].map((item) => (
                <Form.Check
                  key={item}
                  name={item}
                  type="checkbox"
                  label={item.charAt(0).toUpperCase() + item.slice(1)}
                  defaultChecked={Boolean(editingProperty?.amenities?.[item])}
                />
              ))}
              <Form.Check
                name="isFeatured"
                type="checkbox"
                label="Featured"
                defaultChecked={Boolean(editingProperty?.isFeatured)}
              />
            </div>

            <Form.Group className="mb-3">
              <Form.Label>Image URL</Form.Label>
              <Form.Control
                name="imageLink"
                type="text"
                placeholder="https://example.com/image.jpg"
                defaultValue={getPropertyImage(editingProperty)}
                onChange={(e) => setPropertyImagePreview(e.target.value)}
                className="mb-2"
              />
              {propertyImagePreview && (
                <img
                  src={propertyImagePreview}
                  alt="Preview"
                  style={{
                    maxWidth: "100%",
                    maxHeight: "200px",
                    borderRadius: "5px",
                  }}
                />
              )}
            </Form.Group>

            <Button type="submit" className="w-100">
              Save Project
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal show={showUserModal} onHide={() => setShowUserModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {editingUser ? "Edit Employee" : "Add Employee"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form
            onSubmit={async (e) => {
              e.preventDefault();
              const fd = new FormData(e.target);
              const data = {
                name: fd.get("name"),
                username: fd.get("username"),
                role: fd.get("role"),
              };
              if (fd.get("password")) {
                data.password = fd.get("password");
              }
              try {
                if (editingUser) {
                  await API.put(`/api/users/${editingUser._id}`, data);
                } else {
                  await API.post("/api/users", data);
                }
                fetchData();
                setShowUserModal(false);
              } catch (err) {
                if (!editingUser) {
                  setUsers((prev) => [
                    { ...data, _id: `staff-${Date.now()}` },
                    ...prev,
                  ]);
                  setShowUserModal(false);
                  return;
                }
                alert("Error: " + err.message);
              }
            }}
          >
            <Form.Control
              name="name"
              placeholder="Employee Name"
              defaultValue={editingUser?.name}
              className="mb-3"
              required
            />
            <Form.Control
              name="username"
              placeholder="Username"
              defaultValue={editingUser?.username}
              className="mb-3"
              required
            />
            <Form.Control
              name="password"
              type="password"
              placeholder="Password"
              className="mb-3"
              required={!editingUser}
            />
            <Form.Select
              name="role"
              defaultValue={editingUser?.role || "sales"}
              className="mb-3"
            >
              <option value="sales">Sales</option>
              <option value="manager">Manager</option>
              <option value="admin">Admin</option>
            </Form.Select>
            <Button type="submit" className="w-100">
              Save Employee
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal
        show={showInventoryModal}
        onHide={() => setShowInventoryModal(false)}
        size="xl"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Inventory - {currentInventoryProperty?.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex gap-3 mb-4">
            <Form.Control
              placeholder="Search Unit..."
              value={inventorySearch}
              onChange={(e) => setInventorySearch(e.target.value)}
            />
            <Form.Select
              value={selectedBlock}
              onChange={(e) => setSelectedBlock(e.target.value)}
            >
              <option value="All">All Blocks</option>
              {[...new Set(inventoryList.map((u) => u.block))].map((b) => (
                <option key={b}>{b}</option>
              ))}
            </Form.Select>
            <Button
              variant="primary"
              className="text-nowrap"
              onClick={() => setShowBulkModal(true)}
            >
              <Plus size={16} className="me-1" />
              Bulk Generate
            </Button>
          </div>
          <Row className="g-3">
            {filteredUnits.map((u) => (
              <Col md={2} key={u._id}>
                <Card
                  className="p-3 text-center"
                  style={{
                    cursor: "pointer",
                    background:
                      u.status === "Sold"
                        ? "#fee2e2"
                        : u.status === "Booked"
                        ? "#fef3c7"
                        : "#dcfce7",
                  }}
                  onClick={() => {
                    setEditingUnit(u);
                    setShowUnitEditModal(true);
                  }}
                >
                  <h6>{u.unitNumber}</h6>
                  <small>{u.status}</small>
                </Card>
              </Col>
            ))}
          </Row>
        </Modal.Body>
      </Modal>

      <Modal show={showUnitEditModal} onHide={() => setShowUnitEditModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Unit</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form
            onSubmit={async (e) => {
              e.preventDefault();
              const fd = new FormData(e.target);
              try {
                await API.put(`/api/inventory/${editingUnit._id}`, {
                  status: fd.get("status"),
                  customerName: fd.get("customerName"),
                  customerPhone: fd.get("customerPhone"),
                });
                fetchInventory(currentInventoryProperty._id);
                setShowUnitEditModal(false);
              } catch (err) {
                alert("Error: " + err.message);
              }
            }}
          >
            <Form.Select
              name="status"
              defaultValue={editingUnit?.status}
              className="mb-3"
            >
              <option>Available</option>
              <option>Booked</option>
              <option>Sold</option>
            </Form.Select>
            <Form.Control
              name="customerName"
              placeholder="Customer Name"
              defaultValue={editingUnit?.customerName}
              className="mb-3"
            />
            <Form.Control
              name="customerPhone"
              placeholder="Customer Phone"
              defaultValue={editingUnit?.customerPhone}
              className="mb-3"
            />
            <Button type="submit" className="w-100">
              Update Unit
            </Button>
            {(editingUnit?.status === "Booked" || editingUnit?.status === "Sold") && (
              <Button
                variant="success"
                className="w-100 mt-2"
                onClick={() => generateReceipt(editingUnit)}
              >
                Download Receipt
              </Button>
            )}
          </Form>
        </Modal.Body>
      </Modal>

      {/* BULK GENERATE MODAL */}
      <Modal
        show={showBulkModal}
        onHide={() => setShowBulkModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title className="d-flex align-items-center gap-2">
            Bulk Generate Units
            <Badge bg="info" className="fs-6 fw-normal">
              {currentInventoryProperty?.type}
            </Badge>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <p className="text-muted mb-4">
            Automatically generate multiple units with sequential numbers.
          </p>
          <Form
            onSubmit={async (e) => {
              e.preventDefault();
              const fd = new FormData(e.target);
              const data = {
                propertyId: currentInventoryProperty._id,
                prefix: fd.get("prefix"),
                startNumber: Number(fd.get("startNumber")),
                count: Number(fd.get("count")),
                block: fd.get("block"),
                phase: fd.get("phase"),
                floor: fd.get("floor") ? Number(fd.get("floor")) : 0,
                size: Number(fd.get("size")),
                price: Number(fd.get("price")),
              };

              try {
                await API.post("/api/inventory/bulk", data);
                fetchInventory(currentInventoryProperty._id);
                setShowBulkModal(false);
                alert("Units generated successfully!");
              } catch (err) {
                alert("Error: " + (err.response?.data?.message || err.message));
              }
            }}
          >
            <Row className="g-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="small fw-bold text-uppercase">Unit Prefix</Form.Label>
                  <Form.Control
                    name="prefix"
                    placeholder="e.g. A-"
                    defaultValue={`${currentInventoryProperty?.type}-`}
                    readOnly
                    className="bg-light"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="small fw-bold text-uppercase">Start Number</Form.Label>
                  <Form.Control
                    name="startNumber"
                    type="number"
                    placeholder="101"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="small fw-bold text-uppercase">Total Units</Form.Label>
                  <Form.Control
                    name="count"
                    type="number"
                    placeholder="10"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="small fw-bold text-uppercase">Block</Form.Label>
                  <Form.Control name="block" placeholder="A" defaultValue="A" />
                </Form.Group>
              </Col>
              {(currentInventoryProperty?.type === "Building" ||
                currentInventoryProperty?.type === "Flat" ||
                currentInventoryProperty?.type === "Commercial") && (
                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="small fw-bold text-uppercase">Floor Number</Form.Label>
                    <Form.Control
                      name="floor"
                      type="number"
                      placeholder="0"
                      defaultValue="0"
                    />
                  </Form.Group>
                </Col>
              )}
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="small fw-bold text-uppercase">Phase</Form.Label>
                  <Form.Control
                    name="phase"
                    placeholder="Phase 1"
                    defaultValue="Phase 1"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="small fw-bold text-uppercase">Size (sqft)</Form.Label>
                  <Form.Control name="size" type="number" placeholder="1000" />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group>
                  <Form.Label className="small fw-bold text-uppercase">Base Price (₹)</Form.Label>
                  <Form.Control name="price" type="number" placeholder="2500000" />
                </Form.Group>
              </Col>
            </Row>
            <Button type="submit" className="w-100 mt-4 py-2 fw-bold">
              Generate Units
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

const SidebarItem = ({ id, label, icon: Icon, activeTab, setActiveTab }) => {
  return (
    <div
      onClick={() => setActiveTab(id)}
      className={`p-3 rounded mb-2 fw-bold d-flex align-items-center gap-2 ${
        activeTab === id ? "bg-primary text-white" : "bg-light"
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
    <Col md={3}>
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

export default AdminDashboard;



import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Button,
  Badge,
  Card,
  Form,
  Spinner,
} from "react-bootstrap";

import {
  MapPin,
  CheckCircle,
  Layers,
  Calendar,
  ChevronDown,
  ChevronUp,
  Home,
  Maximize,
  Calculator,
  Shield,
  Download,
} from "lucide-react";

import axios from "axios";

import EnquiryModal from "../../components/modals/EnquiryModal";
import SiteVisitModal from "../../components/modals/SiteVisitModal";

const EMICalculator = ({ price = 0 }) => {
  const [loanAmount, setLoanAmount] = useState(price * 0.8);
  const [interest, setInterest] = useState(8.5);
  const [tenure, setTenure] = useState(20);
  const [emi, setEmi] = useState(0);

  useEffect(() => {
    const P = Number(loanAmount);
    const r = Number(interest) / 12 / 100;
    const n = Number(tenure) * 12;

    if (!P || !r || !n) {
      setEmi(0);
      return;
    }

    const emiCalc =
      (P * r * Math.pow(1 + r, n)) /
      (Math.pow(1 + r, n) - 1);

    setEmi(Math.round(emiCalc));
  }, [loanAmount, interest, tenure]);

  return (
    <Row className="g-4">
      <Col md={6}>
        <Form.Group className="mb-3">
          <Form.Label>Loan Amount</Form.Label>
          <Form.Control
            type="number"
            value={loanAmount}
            onChange={(e) => setLoanAmount(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Interest %</Form.Label>
          <Form.Control
            type="number"
            value={interest}
            step="0.1"
            onChange={(e) => setInterest(e.target.value)}
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Tenure (Years)</Form.Label>
          <Form.Control
            type="number"
            value={tenure}
            onChange={(e) => setTenure(e.target.value)}
          />
        </Form.Group>
      </Col>

      <Col md={6}>
        <div className="bg-primary bg-opacity-10 rounded-4 p-4 h-100 d-flex flex-column justify-content-center text-center">
          <h6 className="text-muted">Monthly EMI</h6>

          <h2 className="fw-bold text-primary">
            ₹ {Number(emi).toLocaleString()}
          </h2>

          <small className="text-muted">
            Total Interest :
            ₹{" "}
            {(
              emi * tenure * 12 -
              loanAmount
            ).toLocaleString()}
          </small>
        </div>
      </Col>
    </Row>
  );
};

const PropertyDetails = () => {
  const { id } = useParams();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);

  const [mainImage, setMainImage] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [showVisitModal, setShowVisitModal] = useState(false);

  const [inventory, setInventory] = useState([]);

  const [selectedPhase, setSelectedPhase] = useState("");
  const [selectedBlock, setSelectedBlock] = useState("");

  const [expandedBlock, setExpandedBlock] = useState(null);

  const [selectedUnit, setSelectedUnit] = useState(null);

  useEffect(() => {
    fetchProperty();
    fetchInventory();
  }, [id]);

  const fetchProperty = async () => {
    try {
      const res = await axios.get(`/api/properties/${id}`);
      const data = res.data;
      setProperty(data);
      setMainImage(data?.images?.[0] || "");
      setLoading(false);
    } catch (err) {
      console.log(err);
      setProperty(null);
      setLoading(false);
    }
  };

  const fetchInventory = async () => {
    try {
      const res = await axios.get(
        `/api/inventory/property/${id}`,
      );

      const rawData = res.data;
      const data = Array.isArray(rawData)
        ? rawData
        : Array.isArray(rawData?.data)
        ? rawData.data
        : [];

      const localBooked = JSON.parse(localStorage.getItem("localBookedUnits") || "[]");
      const mergedData = data.map(u => 
        localBooked.includes(u._id) ? { ...u, status: "Booked" } : u
      );

      setInventory(mergedData);

      if (mergedData.length > 0) {
        setSelectedPhase(mergedData[0]?.phase || "Phase 1");
        setSelectedBlock(mergedData[0]?.block || "A");
      }
    } catch (err) {
      console.log(err);
      setInventory([]);
    }
  };

  const handleUnitClick = (unit) => {
    if (unit.status === "Available") {
      setSelectedUnit(unit);
      setShowModal(true);
    }
  };

  const filteredInventory = inventory.filter(
    (u) =>
      (selectedPhase
        ? u.phase === selectedPhase
        : true) &&
      (selectedBlock
        ? u.block === selectedBlock
        : true),
  );

  const groupedFloors = filteredInventory.reduce(
    (acc, item) => {
      const floor =
        item.floor !== undefined
          ? `Floor ${item.floor}`
          : "Units";

      if (!acc[floor]) acc[floor] = [];

      acc[floor].push(item);

      return acc;
    },
    {},
  );

  const stats = {
    total: inventory.length,
    available: inventory.filter(
      (i) => i.status === "Available",
    ).length,
    sold: inventory.filter(
      (i) => i.status === "Sold",
    ).length,
    booked: inventory.filter(
      (i) => i.status === "Booked",
    ).length,
  };

  if (loading) {
    return (
      <div className="vh-100 d-flex justify-content-center align-items-center">
        <Spinner animation="border" />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="vh-100 d-flex justify-content-center align-items-center">
        Property Not Found
      </div>
    );
  }

  return (
    <div className="page-wrapper bg-light min-vh-100 py-5">
      <Container fluid className="px-lg-5">

        <Row className="g-4">

          {/* LEFT */}
          <Col lg={8}>

            {/* IMAGE */}
            <Card className="border-0 shadow-sm rounded-4 overflow-hidden mb-4">
              <img
                src={mainImage}
                alt=""
                className="w-100"
                style={{
                  height: "500px",
                  objectFit: "cover",
                }}
              />

              <Card.Body>
                <Row className="g-2">
                  {(property.images || []).map(
                    (img, idx) => (
                      <Col xs={3} key={idx}>
                        <img
                          src={img}
                          alt=""
                          className={`w-100 rounded ${
                            mainImage === img
                              ? "border border-primary border-3"
                              : ""
                          }`}
                          style={{
                            height: "90px",
                            objectFit: "cover",
                            cursor: "pointer",
                          }}
                          onClick={() =>
                            setMainImage(img)
                          }
                        />
                      </Col>
                    ),
                  )}
                </Row>
              </Card.Body>
            </Card>

            {/* DESCRIPTION */}
            <Card className="border-0 shadow-sm rounded-4 p-4 mb-4">
              <h3 className="fw-bold mb-3">
                Description
              </h3>

              <p className="text-muted">
                {property.description}
              </p>
            </Card>

            {/* FEATURES */}
            <Card className="border-0 shadow-sm rounded-4 p-4 mb-4">
              <h3 className="fw-bold mb-4">
                Features
              </h3>

              <Row className="g-3">
                {(property.features || []).map(
                  (f, i) => (
                    <Col md={6} key={i}>
                      <div className="d-flex align-items-center gap-2">
                        <CheckCircle
                          size={18}
                          className="text-success"
                        />

                        {f}
                      </div>
                    </Col>
                  ),
                )}
              </Row>
            </Card>

            {/* EMI */}
            <Card className="border-0 shadow-sm rounded-4 p-4 mb-4">
              <h3 className="fw-bold mb-4 d-flex align-items-center gap-2">
                <Calculator className="text-primary" />
                EMI Calculator
              </h3>

              <EMICalculator
                price={property.price}
              />
            </Card>

            {/* INVENTORY */}
            {inventory.length > 0 && (
              <Card className="border-0 shadow-sm rounded-4 overflow-hidden">

                <Card.Header className="bg-white p-4">
                  <div className="d-flex justify-content-between flex-wrap gap-3">

                    <h4 className="fw-bold mb-0">
                      Inventory Map
                    </h4>

                    <div className="d-flex gap-3 flex-wrap">

                      <Badge bg="success">
                        Available {stats.available}
                      </Badge>

                      <Badge bg="warning">
                        Booked {stats.booked}
                      </Badge>

                      <Badge bg="danger">
                        Sold {stats.sold}
                      </Badge>

                    </div>
                  </div>
                </Card.Header>

                <Card.Body className="p-4">

                  {/* PHASE */}
                  <div className="d-flex gap-2 flex-wrap mb-3">
                    {[
                      ...new Set(
                        inventory.map(
                          (u) =>
                            u.phase ||
                            "Phase 1",
                        ),
                      ),
                    ].map((phase) => (
                      <Button
                        key={phase}
                        size="sm"
                        variant={
                          selectedPhase === phase
                            ? "dark"
                            : "outline-dark"
                        }
                        onClick={() =>
                          setSelectedPhase(phase)
                        }
                      >
                        {phase}
                      </Button>
                    ))}
                  </div>

                  {/* BLOCK */}
                  <div className="d-flex gap-2 flex-wrap mb-4">
                    {[
                      ...new Set(
                        inventory
                          .filter(
                            (u) =>
                              u.phase ===
                              selectedPhase,
                          )
                          .map((u) => u.block),
                      ),
                    ].map((block) => (
                      <Button
                        key={block}
                        size="sm"
                        variant={
                          selectedBlock === block
                            ? "primary"
                            : "outline-primary"
                        }
                        onClick={() =>
                          setSelectedBlock(block)
                        }
                      >
                        Block {block}
                      </Button>
                    ))}
                  </div>

                  {/* FLOORS */}
                  {Object.entries(groupedFloors).map(
                    ([floor, units]) => (
                      <div
                        key={floor}
                        className="mb-4"
                      >
                        <div
                          className="d-flex justify-content-between align-items-center mb-3 cursor-pointer"
                          onClick={() =>
                            setExpandedBlock(
                              expandedBlock === floor
                                ? null
                                : floor,
                            )
                          }
                        >
                          <h6 className="fw-bold mb-0">
                            {floor}
                          </h6>

                          {expandedBlock === floor ? (
                            <ChevronUp />
                          ) : (
                            <ChevronDown />
                          )}
                        </div>

                        {expandedBlock === floor && (
                          <div className="d-flex flex-wrap gap-2">

                            {units.map((u) => (
                              <div
                                key={u._id}
                                onClick={() =>
                                  handleUnitClick(
                                    u,
                                  )
                                }
                                className={`unit-box ${u.status.toLowerCase()}`}
                              >
                                {u.unitNumber}
                              </div>
                            ))}

                          </div>
                        )}
                      </div>
                    ),
                  )}
                </Card.Body>
              </Card>
            )}
          </Col>

          {/* RIGHT */}
          <Col lg={4}>

            <Card
              className="border-0 shadow-sm rounded-4 sticky-top"
              style={{ top: "100px" }}
            >
              <Card.Body className="p-4">

                <Badge
                  bg="primary"
                  className="mb-3"
                >
                  {property.status}
                </Badge>

                <h2 className="fw-bold">
                  {property.title}
                </h2>

                <p className="text-muted d-flex align-items-center gap-2">
                  <MapPin size={16} />
                  {property.location}
                </p>

                <h3 className="text-primary fw-bold mb-4">
                  ₹{" "}
                  {Number(
                    property.price,
                  ).toLocaleString()}
                </h3>

                <div className="mb-4">

                  <div className="d-flex justify-content-between mb-3">
                    <span>Type</span>
                    <strong>
                      {property.type}
                    </strong>
                  </div>

                  <div className="d-flex justify-content-between mb-3">
                    <span>Area</span>
                    <strong>
                      {property.area}
                    </strong>
                  </div>

                  <div className="d-flex justify-content-between">
                    <span>Project</span>
                    <strong>
                      {property.project}
                    </strong>
                  </div>

                </div>

                <div className="d-grid gap-3">

                  <Button
                    size="lg"
                    onClick={() =>
                      setShowModal(true)
                    }
                  >
                    Enquire Now
                  </Button>

                  <Button
                    size="lg"
                    variant="outline-primary"
                    onClick={() =>
                      setShowVisitModal(true)
                    }
                  >
                    Book Site Visit
                  </Button>

                  {property.brochureUrl && (
                    <Button
                      size="lg"
                      variant="dark"
                      href={property.brochureUrl}
                      target="_blank"
                    >
                      <Download
                        size={18}
                        className="me-2"
                      />
                      Download Brochure
                    </Button>
                  )}

                </div>

              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* MODALS */}

      <EnquiryModal
        show={showModal}
        handleClose={() => {
          setShowModal(false);
          setSelectedUnit(null);
        }}
        property={property}
        unit={selectedUnit}
        onSuccess={fetchInventory}
      />

      <SiteVisitModal
        show={showVisitModal}
        handleClose={() =>
          setShowVisitModal(false)
        }
        property={property}
      />

      {/* STYLE */}
      <style>{`

        .unit-box{
          width:70px;
          height:40px;
          border-radius:8px;
          display:flex;
          align-items:center;
          justify-content:center;
          font-size:12px;
          font-weight:700;
          cursor:pointer;
          transition:0.2s;
        }

        .unit-box:hover{
          transform:translateY(-2px);
        }

        .unit-box.available{
          background:#dcfce7;
          color:#166534;
        }

        .unit-box.booked{
          background:#fef3c7;
          color:#92400e;
        }

        .unit-box.sold{
          background:#fee2e2;
          color:#991b1b;
        }

      `}</style>
    </div>
  );
};

export default PropertyDetails;

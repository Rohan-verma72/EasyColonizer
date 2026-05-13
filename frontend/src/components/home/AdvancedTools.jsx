"use client";

import { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Tabs,
  Tab,
} from "react-bootstrap";
import {
  Calculator,
  TrendingUp,
  Maximize,
  Landmark,
} from "lucide-react";

const ROICalculator = () => {
  const [price, setPrice] = useState(5000000);
  const [appreciation, setAppreciation] = useState(8);
  const [rental, setRental] = useState(15000);

  const calculateReturns = (years) => {
    const futureValue =
      price * Math.pow(1 + appreciation / 100, years);

    const totalRental = rental * 12 * years;

    return {
      growth: (futureValue - price).toFixed(0),
      totalValue: (futureValue + totalRental).toFixed(0),
      rentalTotal: totalRental.toFixed(0),
    };
  };

  const fiveYear = calculateReturns(5);

  return (
    <Card className="border-0 shadow-sm rounded-4 p-4">
      <h4 className="fw-bold mb-4 d-flex align-items-center gap-2">
        <TrendingUp className="text-primary" />
        Investment ROI Projection
      </h4>

      <Row className="g-4">
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label className="small fw-bold">
              Property Value (Rs)
            </Form.Label>

            <Form.Control
              type="number"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="bg-light border-0 py-2"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="small fw-bold">
              Expected Annual Appreciation (%)
            </Form.Label>

            <Form.Control
              type="number"
              value={appreciation}
              onChange={(e) =>
                setAppreciation(Number(e.target.value))
              }
              className="bg-light border-0 py-2"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="small fw-bold">
              Monthly Rental Income (Rs)
            </Form.Label>

            <Form.Control
              type="number"
              value={rental}
              onChange={(e) => setRental(Number(e.target.value))}
              className="bg-light border-0 py-2"
            />
          </Form.Group>
        </Col>

        <Col
          md={6}
          className="bg-primary bg-opacity-10 rounded-4 p-4 text-center d-flex flex-column justify-content-center"
        >
          <p className="text-uppercase small fw-bold text-primary mb-1">
            Projected Returns (5 Years)
          </p>

          <h2 className="display-6 fw-bold text-dark mb-0">
            Rs{" "}
            {Number(fiveYear.totalValue).toLocaleString()}
          </h2>

          <hr className="my-3 opacity-10" />

          <div className="d-flex justify-content-around text-start">
            <div>
              <p className="small text-muted mb-0">
                Capital Gain
              </p>

              <p className="fw-bold text-success mb-0">
                +Rs{" "}
                {Number(fiveYear.growth).toLocaleString()}
              </p>
            </div>

            <div>
              <p className="small text-muted mb-0">
                Rental Income
              </p>

              <p className="fw-bold text-primary mb-0">
                Rs{" "}
                {Number(
                  fiveYear.rentalTotal
                ).toLocaleString()}
              </p>
            </div>
          </div>
        </Col>
      </Row>
    </Card>
  );
};

const AreaConverter = () => {
  const [sqft, setSqft] = useState(1000);

  return (
    <Card className="border-0 shadow-sm rounded-4 p-4">
      <h4 className="fw-bold mb-4 d-flex align-items-center gap-2">
        <Maximize className="text-primary" />
        Area Conversion Tool
      </h4>

      <Row className="g-4">
        <Col md={12}>
          <Form.Group className="mb-4">
            <Form.Label className="small fw-bold">
              Enter Area in Square Feet (Sq.Ft)
            </Form.Label>

            <Form.Control
              type="number"
              value={sqft}
              onChange={(e) =>
                setSqft(Number(e.target.value))
              }
              className="bg-light border-0 py-3 fs-4 fw-bold text-primary text-center"
            />
          </Form.Group>

          <Row className="g-3 text-center">
            <Col sm={4}>
              <div className="p-3 bg-light rounded-3 border">
                <p className="small text-muted mb-1">
                  Sq. Meter
                </p>

                <h5 className="fw-bold mb-0">
                  {(sqft * 0.0929).toFixed(2)}
                </h5>
              </div>
            </Col>

            <Col sm={4}>
              <div className="p-3 bg-light rounded-3 border">
                <p className="small text-muted mb-1">
                  Square Yards
                </p>

                <h5 className="fw-bold mb-0">
                  {(sqft / 9).toFixed(2)}
                </h5>
              </div>
            </Col>

            <Col sm={4}>
              <div className="p-3 bg-light rounded-3 border">
                <p className="small text-muted mb-1">
                  Gajara/Decimal
                </p>

                <h5 className="fw-bold mb-0">
                  {(sqft / 435.6).toFixed(2)}
                </h5>
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
    </Card>
  );
};

const LoanEligibility = () => {
  const [income, setIncome] = useState(500000);
  const [emi, setEmi] = useState(0);

  const calculateEligibility = () => {
    const monthlyIncome = income / 12;
    const availableEmi = monthlyIncome * 0.5 - emi;

    return (availableEmi * 100).toFixed(0);
  };

  return (
    <Card className="border-0 shadow-sm rounded-4 p-4">
      <h4 className="fw-bold mb-4 d-flex align-items-center gap-2">
        <Calculator className="text-primary" />
        Home Loan Eligibility
      </h4>

      <Row className="g-4">
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label className="small fw-bold">
              Gross Annual Income (Rs)
            </Form.Label>

            <Form.Control
              type="number"
              value={income}
              onChange={(e) =>
                setIncome(Number(e.target.value))
              }
              className="bg-light border-0 py-2"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="small fw-bold">
              Existing Monthly EMIs (Rs)
            </Form.Label>

            <Form.Control
              type="number"
              value={emi}
              onChange={(e) =>
                setEmi(Number(e.target.value))
              }
              className="bg-light border-0 py-2"
            />
          </Form.Group>
        </Col>

        <Col
          md={6}
          className="bg-success bg-opacity-10 rounded-4 p-4 text-center d-flex flex-column justify-content-center"
        >
          <p className="text-uppercase small fw-bold text-success mb-1">
            Estimated Loan Eligibility
          </p>

          <h2 className="display-6 fw-bold text-dark mb-0">
            Rs{" "}
            {Number(
              calculateEligibility()
            ).toLocaleString()}
          </h2>

          <p className="text-muted small mt-2">
            *Based on standard 20-year tenure at 8.5%
            ROI
          </p>
        </Col>
      </Row>
    </Card>
  );
};

const AdvancedTools = () => {
  return (
    <section className="py-5 bg-white" id="tools">
      <Container>
        <div className="text-center mb-5">
          <h2 className="display-6 fw-bold">
            Smart{" "}
            <span className="text-primary">
              Investment Tools
            </span>
          </h2>

          <p className="text-muted">
            Take informed decisions with our
            data-driven calculators.
          </p>
        </div>

        <Tabs
          defaultActiveKey="roi"
          className="mb-4 justify-content-center custom-tabs border-0"
        >
          <Tab
            eventKey="roi"
            title={
              <span className="d-flex align-items-center gap-2">
                <Landmark size={18} />
                ROI Calculator
              </span>
            }
          >
            <div className="py-3">
              <ROICalculator />
            </div>
          </Tab>

          <Tab
            eventKey="area"
            title={
              <span className="d-flex align-items-center gap-2">
                <Maximize size={18} />
                Area Converter
              </span>
            }
          >
            <div className="py-3">
              <AreaConverter />
            </div>
          </Tab>

          <Tab
            eventKey="loan"
            title={
              <span className="d-flex align-items-center gap-2">
                <Calculator size={18} />
                Loan Eligibility
              </span>
            }
          >
            <div className="py-3">
              <LoanEligibility />
            </div>
          </Tab>
        </Tabs>
      </Container>
    </section>
  );
};

export default AdvancedTools;
import React from "react";
import { Container } from "react-bootstrap";
import "../../styles/components/home/BankPartners.css";

const banks = ["HDFC BANK", "SBI", "ICICI BANK", "AXIS BANK", "LIC HOUSING"];

const BankPartners = () => {
  return (
    <section className="bank-partners-section">
      <Container>
        <div className="text-center mb-4">
          <span className="bank-partners-label">Official Banking Partners</span>
        </div>

        <div className="d-flex flex-wrap justify-content-center align-items-center gap-3">
          {banks.map((bank, index) => (
            <div key={index} className="bank-partner-card">
              {bank}
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default BankPartners;

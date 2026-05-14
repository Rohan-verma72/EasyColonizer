import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Star } from "lucide-react";
import "../../styles/components/home/Testimonials.css";

const reviews = [
  {
    name: "Rajesh Khandelwal",
    role: "Verified Buyer",
    text: "Buying a plot through Easy Colonizer was the easiest decision of my life. The transparency in documentation and zero brokerage saved me lakhs. Highly recommended for any serious investor!",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43b?fit=crop&w=300&h=300",
  },
  {
    name: "Priya Sharma",
    role: "Happy Resident",
    text: "We were looking for our dream home for 2 years. The team here understood our needs and found us a perfect 3BHK row house in a gated community. Their site visits are so professional.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?fit=crop&w=300&h=300",
  },
  {
    name: "Amitabh Verma",
    role: "NRI Client",
    text: "As an NRI, I was worried about legal verification and physical status. The verification badge gave me confidence. I bought 2 commercial plots and the experience was seamless.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?fit=crop&w=300&h=300",
  },
];

const Testimonials = () => {
  return (
    <section className="testimonials-section">
      <Container fluid className="px-lg-5">
        {/* Header */}
        <div className="text-center mb-5" data-aos="fade-up">
          <span className="section-badge">Client Testimonials</span>

          <h2 className="section-heading mt-3">
            What Our <span className="text-gradient">Happy Families</span> Say
          </h2>

          <p className="section-subheading mt-3">
            Trusted by thousands of families and investors for
            verified properties, transparent deals, and expert assistance.
          </p>
        </div>

        {/* Cards */}
        <Row className="g-4 justify-content-center">
          {reviews.map((rev, index) => (
            <Col
              key={index}
              lg={4} md={6} xs={12}
              data-aos="fade-up"
              data-aos-delay={index * 120}
            >
              <div className="testimonial-card">
                {/* Stars */}
                <div className="testimonial-stars">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={15} fill="currentColor" strokeWidth={1} />
                  ))}
                </div>

                {/* Quote */}
                <div className="testimonial-quote">"</div>

                {/* Text */}
                <p className="testimonial-text">"{rev.text}"</p>

                {/* Author */}
                <div className="d-flex align-items-center gap-3 pt-3 border-top">
                  <img
                    src={rev.image}
                    alt={rev.name}
                    className="testimonial-avatar"
                  />
                  <div>
                    <div className="testimonial-author-name">{rev.name}</div>
                    <div className="testimonial-author-role">{rev.role}</div>
                  </div>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

export default Testimonials;

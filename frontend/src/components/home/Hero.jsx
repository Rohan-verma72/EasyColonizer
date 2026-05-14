import { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { ArrowRight, MapPin } from "lucide-react";
import { useTenant } from "../../context/TenantContext";
import "../../styles/components/home/Hero.css";

const slides = [
  {
    image: "https://wallpaperaccess.com/full/1126773.jpg",
    label: "Luxury Villas",
  },
  {
    image: "https://thumbs.dreamstime.com/z/modern-real-estate-evening-outdoor-urban-view-homes-40083842.jpg",
    label: "Premium Apartments",
  },
  {
    image: "https://vastuhouse.in/wp-content/uploads/2025/04/Row-house-Architects.jpg",
    label: "Row Houses",
  },
  {
    image: "https://flowphotos.com/wp-content/uploads/Commercial-Real-Estate-Photography-1080x675.jpg",
    label: "Commercial Spaces",
  },
];

const Hero = () => {
  const [current, setCurrent] = useState(0);
  const { tenant } = useTenant();

  useEffect(() => {
    const timer = setInterval(
      () => setCurrent((prev) => (prev + 1) % slides.length),
      5500
    );
    return () => clearInterval(timer);
  }, []);

  const heroData = tenant?.hero || {
    title: "Find Your <br /> <span class='hero-title-accent'>Dream Property</span> <br /> in Bhopal",
    subtitle: "Verified plots, villas, apartments & commercial spaces with complete transparency and zero brokerage.",
    location: "Bhopal, Madhya Pradesh"
  };

  return (
    <section className="hero-section" aria-label="Hero">
      {/* Slides */}
      <div className="hero-slider">
        {slides.map((slide, i) => (
          <div
            key={i}
            className={`hero-slide ${i === current ? "active" : ""}`}
            style={{ backgroundImage: `url(${slide.image})` }}
            aria-hidden={i !== current}
          />
        ))}
      </div>

      {/* Overlay */}
      <div className="hero-overlay" />

      {/* Content */}
      <Container className="hero-content">
        <Row className="justify-content-start">
          <Col xl={7} lg={8} md={10}>
            <div data-aos="fade-up">
              {/* Location pill */}
              <div className="hero-location-pill">
                <MapPin size={14} />
                {heroData.location}
              </div>

              {/* Headline */}
              <h4 
                className="hero-title" 
                dangerouslySetInnerHTML={{ __html: heroData.title }}
              />

              {/* Subtext */}
              <p className="hero-subtitle">
                {heroData.subtitle}
              </p>

              {/* CTAs */}
              <div className="hero-cta-group">
                <Link to="/projects" className="hero-btn-primary">
                  Explore Properties
                  <ArrowRight size={18} />
                </Link>

                <Link to="/contact" className="hero-btn-secondary">
                  Free Consultation
                </Link>
              </div>

              {/* Stats row */}
              <div className="hero-stats">
                {[
                  { value: "150+", label: "Projects" },
                  { value: "5000+", label: "Families" },
                  { value: "0%", label: "Brokerage" },
                ].map((s, i) => (
                  <div key={i} className="hero-stat">
                    <span className="hero-stat-value">{s.value}</span>
                    <span className="hero-stat-label">{s.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </Col>
        </Row>
      </Container>

      {/* Slide indicators */}
      <div className="hero-indicators">
        {slides.map((slide, i) => (
          <button
            key={i}
            className={`hero-dot ${i === current ? "active" : ""}`}
            onClick={() => setCurrent(i)}
            aria-label={slide.label}
          />
        ))}
      </div>

      {/* Current slide label */}
      <div className="hero-slide-label">
        <span>{slides[current].label}</span>
      </div>
    </section>
  );
};

export default Hero;

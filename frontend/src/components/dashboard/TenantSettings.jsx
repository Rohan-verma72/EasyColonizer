import React, { useState, useEffect } from "react";
import { Card, Row, Col, Form, Button, Spinner, Nav } from "react-bootstrap";
import { Save, Palette, Globe, Mail, Phone, Layout, Info, Share2, Image as ImageIcon, MapPin } from "lucide-react";
import api from "../../utils/api";
import { useTenant } from "../../context/TenantContext";
import Swal from "sweetalert2";

const TenantSettings = () => {
  const { tenant, refreshTenant } = useTenant();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("general");

  const [formData, setFormData] = useState({
    name: "",
    logo: "",
    theme: {
      primaryColor: "#1a237e",
      secondaryColor: "#ffd700",
      footerBgColor: "#0a0d27",
    },
    contactInfo: {
      address: "",
      phone: "",
      email: "",
      website: ""
    },
    socialLinks: {
      facebook: "",
      instagram: "",
      twitter: "",
      linkedin: ""
    },
    hero: {
      title: "Find Your Dream Property",
      subtitle: "Verified plots, villas, apartments...",
      location: "Bhopal, Madhya Pradesh",
      images: [""]
    },
    settings: {
      enableBookings: true,
      layout: {
        showHero: true,
        showBankPartners: true,
        showMarketTrends: true,
        showFeatured: true,
        showMarketingTrust: true,
        showExpertAdvice: true,
        showTrending: true,
        showAdvancedTools: true,
        showRecentlyViewed: true,
        showStats: true,
        showTestimonials: true,
        showFooter: true,
        footerStyle: "classic"
      },
    },
    about: {
      title: "About Our Company",
      content: "We are leaders in real estate experts with over 12 years of experience.",
      image: ""
    }
  });

  useEffect(() => {
    if (tenant) {
      setFormData({
        name: tenant.name || "",
        logo: tenant.logo || "",
        theme: {
          primaryColor: tenant.theme?.primaryColor || "#1a237e",
          secondaryColor: tenant.theme?.secondaryColor || "#ffd700",
          footerBgColor: tenant.theme?.footerBgColor || "#0a0d27",
        },
        contactInfo: {
          address: tenant.contactInfo?.address || "",
          phone: tenant.contactInfo?.phone || "",
          email: tenant.contactInfo?.email || "",
          website: tenant.contactInfo?.website || ""
        },
        socialLinks: {
          facebook: tenant.socialLinks?.facebook || "",
          instagram: tenant.socialLinks?.instagram || "",
          twitter: tenant.socialLinks?.twitter || "",
          linkedin: tenant.socialLinks?.linkedin || ""
        },
        hero: {
          title: tenant.hero?.title || "Find Your Dream Property",
          subtitle: tenant.hero?.subtitle || "Verified plots, villas, apartments...",
          location: tenant.hero?.location || "Bhopal, Madhya Pradesh",
          images: (tenant.hero?.images?.length ? tenant.hero.images : [""])
        },
        settings: {
          enableBookings: tenant.settings?.enableBookings !== false,
          layout: {
            ...formData.settings.layout,
            ...tenant.settings?.layout
          },
        },
        about: {
          title: tenant.about?.title || "About Our Company",
          content: tenant.about?.content || "We are leaders in real estate...",
          image: tenant.about?.image || ""
        }
      });
    }
  }, [tenant]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.put("/api/tenants/settings", formData, {
        headers: { "x-tenant-id": tenant._id },
      });

      await refreshTenant();

      Swal.fire({
        icon: 'success',
        title: 'Settings Saved!',
        text: 'Platform configuration updated successfully.',
        timer: 2000,
        showConfirmButton: false
      });
    } catch (error) {
      console.error("Error updating settings:", error);
      Swal.fire({
        icon: 'error',
        title: 'Save Failed',
        text: error.response?.data?.message || 'Something went wrong.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tenant-settings-page p-2">
      <div className="d-flex align-items-center justify-content-between mb-4 pb-3 border-bottom">
        <div>
          <h2 className="h4 fw-bold mb-1">Platform Customization</h2>
          <p className="text-secondary small mb-0">Manage your branding, layout, and content</p>
        </div>
        <Button 
          variant="primary" 
          onClick={handleSubmit} 
          disabled={loading}
          className="rounded-pill px-4 shadow-sm"
        >
          {loading ? <Spinner size="sm" className="me-2" /> : <Save size={18} className="me-2" />}
          Save Changes
        </Button>
      </div>

      <Nav variant="pills" className="mb-4 gap-2 custom-nav-pills overflow-auto flex-nowrap">
        <Nav.Item>
          <Nav.Link active={activeTab === "general"} onClick={() => setActiveTab("general")} className="rounded-pill">
            <Globe size={18} className="me-2" /> General
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link active={activeTab === "hero"} onClick={() => setActiveTab("hero")} className="rounded-pill">
            <ImageIcon size={18} className="me-2" /> Hero Content
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link active={activeTab === "layout"} onClick={() => setActiveTab("layout")} className="rounded-pill">
            <Layout size={18} className="me-2" /> Layout
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link active={activeTab === "about"} onClick={() => setActiveTab("about")} className="rounded-pill">
            <Info size={18} className="me-2" /> About Us
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link active={activeTab === "contact"} onClick={() => setActiveTab("contact")} className="rounded-pill">
            <Mail size={18} className="me-2" /> Contact & Social
          </Nav.Link>
        </Nav.Item>
      </Nav>

      <Form onSubmit={handleSubmit}>
        {/* TAB 1: GENERAL */}
        {activeTab === "general" && (
          <Row className="g-4">
            <Col lg={8}>
              <Card className="border-0 shadow-sm rounded-4 p-3">
                <Card.Body>
                  <h5 className="fw-bold mb-4 text-primary">Core Branding</h5>
                  <Form.Group className="mb-3">
                    <Form.Label className="small fw-bold">Company Name</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="rounded-3 border-light bg-light"
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label className="small fw-bold">Logo URL</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.logo}
                      onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                      placeholder="https://example.com/logo.png"
                      className="rounded-3 border-light bg-light"
                    />
                  </Form.Group>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={4}>
              <Card className="border-0 shadow-sm rounded-4 p-3 h-100">
                <Card.Body>
                  <h5 className="fw-bold mb-4 text-primary">Brand Colors</h5>
                  <Form.Group className="mb-4">
                    <Form.Label className="small fw-bold">Primary Color</Form.Label>
                    <div className="d-flex gap-3 align-items-center p-2 rounded-3 border bg-light">
                      <Form.Control
                        type="color"
                        value={formData.theme.primaryColor}
                        onChange={(e) => setFormData({
                          ...formData,
                          theme: { ...formData.theme, primaryColor: e.target.value }
                        })}
                        className="p-1 border-0 rounded"
                        style={{ width: '45px', height: '40px' }}
                      />
                      <span className="text-secondary small font-monospace">{formData.theme.primaryColor}</span>
                    </div>
                  </Form.Group>
                  <Form.Group>
                    <Form.Label className="small fw-bold">Secondary Color</Form.Label>
                    <div className="d-flex gap-3 align-items-center p-2 rounded-3 border bg-light">
                      <Form.Control
                        type="color"
                        value={formData.theme.secondaryColor}
                        onChange={(e) => setFormData({
                          ...formData,
                          theme: { ...formData.theme, secondaryColor: e.target.value }
                        })}
                        className="p-1 border-0 rounded"
                        style={{ width: '45px', height: '40px' }}
                      />
                      <span className="text-secondary small font-monospace">{formData.theme.secondaryColor}</span>
                    </div>
                  </Form.Group>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}

        {/* TAB: HERO CONTENT */}
        {activeTab === "hero" && (
          <Card className="border-0 shadow-sm rounded-4 p-4">
            <h5 className="fw-bold mb-4 text-primary d-flex align-items-center gap-2">
              <ImageIcon size={20} /> Hero Section Customization
            </h5>
            <Row className="g-4">
              <Col md={12}>
                <Form.Group>
                  <Form.Label className="small fw-bold text-secondary">Main Headline</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    value={formData.hero.title}
                    onChange={(e) => setFormData({
                      ...formData,
                      hero: { ...formData.hero, title: e.target.value }
                    })}
                    placeholder="e.g. Find Your Dream Property in Bhopal"
                    className="rounded-3 border-light bg-light fw-bold h5"
                  />
                  <Form.Text className="text-muted">Use &lt;br /&gt; for line breaks if needed.</Form.Text>
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group>
                  <Form.Label className="small fw-bold text-secondary">Subtitle Text</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={formData.hero.subtitle}
                    onChange={(e) => setFormData({
                      ...formData,
                      hero: { ...formData.hero, subtitle: e.target.value }
                    })}
                    placeholder="Describe your offerings..."
                    className="rounded-3 border-light bg-light"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="small fw-bold text-secondary">Location Tag</Form.Label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-light"><MapPin size={16} /></span>
                    <Form.Control
                      type="text"
                      value={formData.hero.location}
                      onChange={(e) => setFormData({
                        ...formData,
                        hero: { ...formData.hero, location: e.target.value }
                      })}
                      placeholder="e.g. Bhopal, MP"
                      className="rounded-3 border-start-0 border-light bg-light"
                    />
                  </div>
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group>
                  <Form.Label className="small fw-bold text-secondary d-flex align-items-center justify-content-between">
                    <span>Hero Slider Images <span className="text-muted fw-normal">({formData.hero.images.length}/5)</span></span>
                    {formData.hero.images.length < 5 && (
                      <Button
                        size="sm"
                        variant="outline-primary"
                        className="rounded-pill px-3"
                        onClick={() => setFormData({
                          ...formData,
                          hero: { ...formData.hero, images: [...formData.hero.images, ""] }
                        })}
                      >
                        + Add Image
                      </Button>
                    )}
                  </Form.Label>
                  <div className="d-flex flex-column gap-3 mt-2">
                    {formData.hero.images.map((img, idx) => (
                      <div key={idx}>
                        <div className="d-flex gap-2 align-items-center">
                          <div className="fw-bold text-muted" style={{ minWidth: 24 }}>#{idx + 1}</div>
                          <Form.Control
                            type="text"
                            value={img}
                            onChange={(e) => {
                              const updated = [...formData.hero.images];
                              updated[idx] = e.target.value;
                              setFormData({ ...formData, hero: { ...formData.hero, images: updated } });
                            }}
                            placeholder="https://images.unsplash.com/photo-..."
                            className="rounded-3 border-light bg-light"
                          />
                          {formData.hero.images.length > 1 && (
                            <Button
                              size="sm"
                              variant="outline-danger"
                              className="rounded-circle px-2"
                              onClick={() => {
                                const updated = formData.hero.images.filter((_, i) => i !== idx);
                                setFormData({ ...formData, hero: { ...formData.hero, images: updated } });
                              }}
                            >
                              ✕
                            </Button>
                          )}
                        </div>
                        {img && (
                          <div className="mt-2 ms-4">
                            <img
                              src={img}
                              alt={`preview-${idx}`}
                              className="rounded-3 shadow-sm"
                              style={{ width: '100%', maxHeight: '120px', objectFit: 'cover' }}
                              onError={(e) => { e.target.style.display = 'none'; }}
                              onLoad={(e) => { e.target.style.display = 'block'; }}
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <Form.Text className="text-muted">Aap 1 se 5 tak images add kar sakte hain. High-quality landscape (1920x1080) best hoti hain.</Form.Text>
                </Form.Group>
              </Col>
            </Row>
          </Card>
        )}

        {/* TAB: LAYOUT */}
        {activeTab === "layout" && (
          <Card className="border-0 shadow-sm rounded-4 p-4">
            <h5 className="fw-bold mb-4 text-primary">Homepage Section Visibility</h5>
            <Row className="g-3">
              {Object.keys(formData.settings.layout).filter(k => k.startsWith('show')).map((key) => (
                <Col md={4} key={key}>
                  <Form.Check
                    type="switch"
                    id={key}
                    label={key.replace('show', '').replace(/([A-Z])/g, ' $1').trim()}
                    checked={formData.settings.layout[key]}
                    onChange={(e) => setFormData({
                      ...formData,
                      settings: {
                        ...formData.settings,
                        layout: { ...formData.settings.layout, [key]: e.target.checked }
                      }
                    })}
                    className="custom-switch"
                  />
                </Col>
              ))}
            </Row>

            <div className="mt-5 pt-4 border-top">
              <h5 className="fw-bold mb-4 text-primary">Footer Customization</h5>
              <Row className="g-4">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="small fw-bold">Footer Style</Form.Label>
                    <Form.Select
                      value={formData.settings.layout.footerStyle}
                      onChange={(e) => setFormData({
                        ...formData,
                        settings: {
                          ...formData.settings,
                          layout: { ...formData.settings.layout, footerStyle: e.target.value }
                        }
                      })}
                      className="rounded-3 border-light bg-light"
                    >
                      <option value="classic">Classic Premium</option>
                      <option value="modern">Modern Minimal</option>
                      <option value="corporate">Corporate Detailed</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="small fw-bold">Footer Background Color</Form.Label>
                    <div className="d-flex gap-3 align-items-center p-2 rounded-3 border bg-light">
                      <Form.Control
                        type="color"
                        value={formData.theme.footerBgColor}
                        onChange={(e) => setFormData({
                          ...formData,
                          theme: { ...formData.theme, footerBgColor: e.target.value }
                        })}
                        className="p-1 border-0 rounded"
                        style={{ width: '45px', height: '40px' }}
                      />
                      <span className="text-secondary small font-monospace">{formData.theme.footerBgColor}</span>
                    </div>
                  </Form.Group>
                </Col>
              </Row>
            </div>
          </Card>
        )}

        {/* TAB 3: ABOUT */}
        {activeTab === "about" && (
          <Card className="border-0 shadow-sm rounded-4 p-4">
            <h5 className="fw-bold mb-4 text-primary">About Us Page Content</h5>
            <Row className="g-4">
              <Col md={12}>
                <Form.Group>
                  <Form.Label className="small fw-bold">Headline Title</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.about.title}
                    onChange={(e) => setFormData({
                      ...formData,
                      about: { ...formData.about, title: e.target.value }
                    })}
                    className="rounded-3 border-light bg-light"
                  />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group>
                  <Form.Label className="small fw-bold">Page Content / Story</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={8}
                    value={formData.about.content}
                    onChange={(e) => setFormData({
                      ...formData,
                      about: { ...formData.about, content: e.target.value }
                    })}
                    className="rounded-3 border-light bg-light"
                  />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group>
                  <Form.Label className="small fw-bold">About Header Image URL</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.about.image}
                    onChange={(e) => setFormData({
                      ...formData,
                      about: { ...formData.about, image: e.target.value }
                    })}
                    className="rounded-3 border-light bg-light"
                  />
                </Form.Group>
              </Col>
            </Row>
          </Card>
        )}

        {/* TAB 4: CONTACT & SOCIAL */}
        {activeTab === "contact" && (
          <Card className="border-0 shadow-sm rounded-4 p-4">
            <h5 className="fw-bold mb-4 d-flex align-items-center gap-2 text-primary">
              <Mail size={20} /> Contact Details
            </h5>
            <Row className="g-3 mb-5">
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="small fw-bold">Support Email</Form.Label>
                  <Form.Control
                    type="email"
                    value={formData.contactInfo.email}
                    onChange={(e) => setFormData({
                      ...formData,
                      contactInfo: { ...formData.contactInfo, email: e.target.value }
                    })}
                    className="rounded-3 border-light bg-light"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="small fw-bold">Phone Number</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.contactInfo.phone}
                    onChange={(e) => setFormData({
                      ...formData,
                      contactInfo: { ...formData.contactInfo, phone: e.target.value }
                    })}
                    className="rounded-3 border-light bg-light"
                  />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group>
                  <Form.Label className="small fw-bold">Office Address</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    value={formData.contactInfo.address}
                    onChange={(e) => setFormData({
                      ...formData,
                      contactInfo: { ...formData.contactInfo, address: e.target.value }
                    })}
                    className="rounded-3 border-light bg-light"
                  />
                </Form.Group>
              </Col>
            </Row>

            <h5 className="fw-bold mb-4 d-flex align-items-center gap-2 text-primary border-top pt-4">
              <Share2 size={20} /> Social Media Profiles
            </h5>
            <Row className="g-3">
              {[
                { id: "facebook", label: "Facebook URL", icon: "https://facebook.com/..." },
                { id: "instagram", label: "Instagram URL", icon: "https://instagram.com/..." },
                { id: "twitter", label: "Twitter/X URL", icon: "https://twitter.com/..." },
                { id: "linkedin", label: "LinkedIn URL", icon: "https://linkedin.com/..." },
              ].map((social) => (
                <Col md={6} key={social.id}>
                  <Form.Group>
                    <Form.Label className="small fw-bold">{social.label}</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.socialLinks[social.id]}
                      onChange={(e) => setFormData({
                        ...formData,
                        socialLinks: { ...formData.socialLinks, [social.id]: e.target.value }
                      })}
                      placeholder={social.icon}
                      className="rounded-3 border-light bg-light"
                    />
                  </Form.Group>
                </Col>
              ))}
            </Row>
          </Card>
        )}
      </Form>
    </div>
  );
};

export default TenantSettings;

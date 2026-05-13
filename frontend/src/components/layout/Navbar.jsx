"use client";

import { useState, useEffect } from "react";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";

import {
  Home,
  Info,
  Phone,
  LayoutGrid,
  User,
  Menu,
  X,
} from "lucide-react";

import AuthModal from "../modals/AuthModal";

import "../../styles/components/layout/Navbar.css";

const AppNavbar = () => {
  const location = useLocation();

  const [, setCartCount] = useState(0);

  const [showAuthModal, setShowAuthModal] = useState(false);

  const [expanded, setExpanded] = useState(false);

  const [scrolled, setScrolled] = useState(false);

  // Wishlist Count
  useEffect(() => {
    const updateCount = () => {
      const wishlist = JSON.parse(
        localStorage.getItem("wishlist") || "[]"
      );

      setCartCount(wishlist.length);
    };

    updateCount();

    window.addEventListener(
      "wishlistUpdated",
      updateCount
    );

    return () =>
      window.removeEventListener(
        "wishlistUpdated",
        updateCount
      );
  }, []);

  // Auth
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("token")
  );

  const [userRole, setUserRole] = useState(
    localStorage.getItem("userRole")
  );

  useEffect(() => {
    const checkAuth = () => {
      setIsLoggedIn(!!localStorage.getItem("token"));
      setUserRole(localStorage.getItem("userRole"));
    };

    checkAuth();

    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, [location.pathname, showAuthModal]);

  // Scroll Effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };

    window.addEventListener(
      "scroll",
      handleScroll
    );

    return () =>
      window.removeEventListener(
        "scroll",
        handleScroll
      );
  }, []);

  // Nav Items
  const navItems = [
    {
      path: "/",
      label: "Home",
      icon: <Home size={18} />,
    },
    {
      path: "/projects",
      label: "Projects",
      icon: <LayoutGrid size={18} />,
    },
    {
      path: "/about",
      label: "About",
      icon: <Info size={18} />,
    },
    {
      path: "/contact",
      label: "Contact",
      icon: <Phone size={18} />,
    },
  ];

  return (
    <>
      <Navbar
        expand="lg"
        fixed="top"
        expanded={expanded}
        onToggle={(value) => setExpanded(value)}
        className={`custom-navbar ${
          scrolled ? "navbar-scrolled" : ""
        }`}
      >
        <Container fluid className="px-lg-4">
          {/* LOGO */}
          <Navbar.Brand
            as={Link}
            to="/"
            className="brand-logo"
          >
            <span className="brand-highlight">
              EASY
            </span>
            COLONIZER
          </Navbar.Brand>

          {/* MOBILE TOGGLE */}
          <Navbar.Toggle
            aria-controls="navbar"
            className="navbar-toggle border-0 shadow-none"
          >
            {expanded ? (
              <X size={24} />
            ) : (
              <Menu size={24} />
            )}
          </Navbar.Toggle>

          {/* NAVBAR */}
          <Navbar.Collapse id="navbar">
            <Nav className="ms-auto align-items-lg-center navbar-links">
              {navItems.map((item) => (
                <Nav.Link
                  key={item.path}
                  as={Link}
                  to={item.path}
                  onClick={() =>
                    setExpanded(false)
                  }
                  className={`nav-item-custom ${
                    location.pathname === item.path
                      ? "active-nav"
                      : ""
                  }`}
                >
                  {item.icon}

                  <span>{item.label}</span>
                </Nav.Link>
              ))}

              {/* LOGIN BUTTON */}
              <div className="auth-section">
                {isLoggedIn ? (
                  <Button
                    as={Link}
                    to={
                      userRole === "admin" || userRole === "manager"
                        ? "/admin"
                        : "/dashboard"
                    }
                    className="btn-premium"
                    onClick={() => setExpanded(false)}
                  >
                    <User size={18} />

                    {userRole === "admin" || userRole === "manager"
                      ? "Admin Panel"
                      : "Dashboard"}
                  </Button>
                ) : (
                  <Button
                    className="btn-premium"
                    onClick={() => {
                      setShowAuthModal(true);

                      setExpanded(false);
                    }}
                  >
                    <User size={18} />

                    Login / Signup
                  </Button>
                )}
              </div>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* AUTH MODAL */}
      <AuthModal
        show={showAuthModal}
        handleClose={() => {
          setShowAuthModal(false);
          // Re-check auth state after modal closes
          setIsLoggedIn(!!localStorage.getItem("token"));
          setUserRole(localStorage.getItem("userRole"));
        }}
        onLoginSuccess={(username) => {
          setIsLoggedIn(true);
          setUserRole(localStorage.getItem("userRole"));
          setShowAuthModal(false);
        }}
      />
    </>
  );
};

export default AppNavbar;
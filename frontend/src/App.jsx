"use client";

import { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import AOS from "aos";
import "aos/dist/aos.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/main.css";

import AppNavbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";

import Hero from "./components/home/Hero";
import FeaturedProperties from "./components/home/FeaturedProperties";
import TrendingProjects from "./components/home/TrendingProjects";
import Stats from "./components/home/Stats";
import Testimonials from "./components/home/Testimonials";
import MarketingTrust from "./components/home/MarketingTrust";
import BankPartners from "./components/home/BankPartners";
import AdvancedTools from "./components/home/AdvancedTools";
import MarketTrends from "./components/home/MarketTrends";
import RecentlyViewed from "./components/home/RecentlyViewed";
import ChatBot from "./components/home/ChatBot";

import ExpertAdvice from "./components/ExpertAdvice";
import SEO from "./components/seo/SEO";
import ComparisonTool from "./components/property/ComparisonTool";
import { useTenant } from "./context/TenantContext";

import About from "./views/public/About";
import Contact from "./views/public/Contact";
import Projects from "./views/public/Projects";
import PropertyDetails from "./views/public/PropertyDetails";

import Wishlist from "./views/dashboard/Wishlist";
import CustomerDashboard from "./views/dashboard/CustomerDashboard";
import AdminDashboard from "./views/dashboard/AdminDashboard";

import AdminLogin from "./views/auth/AdminLogin";

const AppLayout = () => {
  const location = useLocation();
  const { tenant } = useTenant();
  const layout = tenant?.settings?.layout || {};



  const isPortal =
    location.pathname.startsWith("/admin") ||
    location.pathname.startsWith("/dashboard") ||
    location.pathname.startsWith("/login");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="app-container">
      {/* Navbar */}
      {!isPortal && <AppNavbar />}

      <main>
        <Routes>
          {/* HOME */}
          <Route
            path="/"
            element={
              <>
                <SEO
                  title="Easy Colonizer | Verified Real Estate Projects"
                  description="Explore verified plots, villas, flats and commercial properties with transparent pricing and expert support."
                />

                {layout.showHero !== false && <Hero />}

                {layout.showBankPartners !== false && <BankPartners />}

                {layout.showMarketTrends !== false && <MarketTrends />}

                {layout.showFeatured !== false && <FeaturedProperties />}

                {layout.showMarketingTrust !== false && <MarketingTrust />}

                {layout.showExpertAdvice !== false && <ExpertAdvice />}

                {layout.showTrending !== false && <TrendingProjects />}

                {layout.showAdvancedTools !== false && <AdvancedTools />}

                {layout.showRecentlyViewed !== false && <RecentlyViewed />}

                {layout.showStats !== false && <Stats />}

                {layout.showTestimonials !== false && <Testimonials />}
              </>
            }
          />

          {/* ABOUT */}
          <Route
            path="/about"
            element={
              <>
                <SEO
                  title="About Us | Easy Colonizer"
                  description="Learn why Easy Colonizer is trusted for verified real estate projects, transparent deals and expert consultation."
                />

                <About />
              </>
            }
          />

          {/* CONTACT */}
          <Route
            path="/contact"
            element={
              <>
                <SEO
                  title="Contact Us | Easy Colonizer"
                  description="Contact Easy Colonizer for verified property deals, expert consultation and site visits."
                />

                <Contact />
              </>
            }
          />

          {/* PROJECTS */}
          <Route
            path="/projects"
            element={
              <>
                <SEO
                  title="Search Properties | Easy Colonizer"
                  description="Search verified plots, apartments, villas, row houses and commercial properties in prime locations."
                />

                <Projects />
              </>
            }
          />

          {/* PROPERTY DETAILS */}
          <Route
            path="/property/:id"
            element={
              <>
                <SEO
                  title="Property Details | Easy Colonizer"
                  description="Explore property details, pricing, inventory map, amenities and booking options."
                />

                <PropertyDetails />
              </>
            }
          />

          {/* WISHLIST */}
          <Route
            path="/wishlist"
            element={
              <>
                <SEO
                  title="Wishlist | Easy Colonizer"
                  description="Review your shortlisted properties and compare projects before booking."
                />

                <Wishlist />
              </>
            }
          />

          {/* CUSTOMER DASHBOARD */}
          <Route
            path="/dashboard"
            element={
              <>
                <SEO
                  title="Customer Dashboard"
                  description="Manage your property portfolio, profile and wishlist."
                />

                <CustomerDashboard />
              </>
            }
          />

          {/* ADMIN DASHBOARD */}
          <Route
            path="/admin"
            element={
              <>
                <SEO
                  title="Admin Dashboard"
                  description="Manage properties, users and bookings."
                />

                <AdminDashboard />
              </>
            }
          />

          {/* LOGIN */}
          <Route
            path="/login"
            element={
              <>
                <SEO
                  title="Admin Login"
                  description="Secure admin login portal."
                />

                <AdminLogin />
              </>
            }
          />
        </Routes>
      </main>

      {/* Footer */}
      {!isPortal && <Footer />}

      {/* ChatBot */}
      {!isPortal && <ChatBot />}

      {/* Comparison Tool — global, listens for add-to-compare events */}
      {!isPortal && <ComparisonTool />}
    </div>
  );
};

function App() {
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      easing: "ease-in-out",
    });
  }, []);

  return (
    <Router>
      <AppLayout />
    </Router>
  );
}

export default App;

const mongoose = require("mongoose");

const tenantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, "Slug/Subdomain is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    logo: {
      type: String,
      trim: true,
    },
    theme: {
      primaryColor: {
        type: String,
        default: "#1a237e",
      },
      secondaryColor: {
        type: String,
        default: "#ffd700",
      },
      fontFamily: {
        type: String,
        default: "'Inter', sans-serif",
      },
      footerBgColor: {
        type: String,
        default: "#0a0d27",
      },
    },
    contactInfo: {
      email: String,
      phone: String,
      address: String,
      website: String,
    },
    socialLinks: {
      facebook: String,
      instagram: String,
      twitter: String,
      linkedin: String,
    },
    settings: {
      enableBookings: {
        type: Boolean,
        default: true,
      },
      enableSiteVisits: {
        type: Boolean,
        default: true,
      },
      currency: {
        type: String,
        default: "INR",
      },
      layout: {
        showHero: { type: Boolean, default: true },
        showBankPartners: { type: Boolean, default: true },
        showMarketTrends: { type: Boolean, default: true },
        showFeatured: { type: Boolean, default: true },
        showMarketingTrust: { type: Boolean, default: true },
        showExpertAdvice: { type: Boolean, default: true },
        showTrending: { type: Boolean, default: true },
        showAdvancedTools: { type: Boolean, default: true },
        showRecentlyViewed: { type: Boolean, default: true },
        showStats: { type: Boolean, default: true },
        showTestimonials: { type: Boolean, default: true },
        showFooter: { type: Boolean, default: true },
        footerStyle: { 
          type: String, 
          enum: ["classic", "modern", "corporate"], 
          default: "classic" 
        },
      },
    },
    about: {
      title: { type: String, default: "About Our Company" },
      content: { type: String, default: "We are leaders in real estate experts with over 12 years of experience." },
      image: { type: String }
    },
    hero: {
      title: { type: String, default: "Find Your Dream Property in Your City" },
      subtitle: { type: String, default: "Verified plots, villas, apartments & commercial spaces with complete transparency." },
      location: { type: String, default: "Your City, State" }
    },
    active: {
      type: Boolean,
      default: true,
    },
    subscription: {
      plan: {
        type: String,
        enum: ["free", "pro", "enterprise"],
        default: "free",
      },
      expiresAt: Date,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Tenant", tenantSchema);

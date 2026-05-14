const express = require("express");
const router = express.Router();
const Tenant = require("../models/Tenant");

// Get current tenant settings (Public)
// Identified by slug in header
router.get("/config", async (req, res) => {
  try {
    if (!req.tenant) {
      return res.status(404).json({ message: "Tenant not found or not specified" });
    }
    res.json(req.tenant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin: Update tenant settings
router.put("/settings", async (req, res) => {
  try {
    console.log("Updating Tenant Settings for:", req.tenant?._id);
    
    if (!req.tenant) {
      return res.status(404).json({ message: "Tenant context missing" });
    }

    const tenant = await Tenant.findById(req.tenant._id);
    if (!tenant) {
      return res.status(404).json({ message: "Tenant not found in DB" });
    }

    // Update basic fields
    if (req.body.name) tenant.name = req.body.name;
    if (req.body.logo !== undefined) tenant.logo = req.body.logo;
    
    // Update Theme
    if (req.body.theme) {
      tenant.theme = { ...tenant.theme, ...req.body.theme };
      tenant.markModified("theme");
    }

    // Update Contact Info
    if (req.body.contactInfo) {
      tenant.contactInfo = { ...tenant.contactInfo, ...req.body.contactInfo };
      tenant.markModified("contactInfo");
    }

    // Update Social Links
    if (req.body.socialLinks) {
      tenant.socialLinks = { ...tenant.socialLinks, ...req.body.socialLinks };
      tenant.markModified("socialLinks");
    }

    // Update Layout Settings (CRITICAL)
    if (req.body.settings && req.body.settings.layout) {
      tenant.settings = {
        ...tenant.settings,
        layout: { ...tenant.settings?.layout, ...req.body.settings.layout }
      };
      // Mark as modified for Mongoose
      tenant.markModified("settings");
    }

    // Update About Content
    if (req.body.about) {
      tenant.about = { ...tenant.about, ...req.body.about };
      tenant.markModified("about");
    }

    // Update Hero Content
    if (req.body.hero) {
      tenant.hero = { ...tenant.hero, ...req.body.hero };
      tenant.markModified("hero");
    }

    const updatedTenant = await tenant.save();
    console.log("Tenant saved successfully.");
    
    res.json(updatedTenant);
  } catch (error) {
    console.error("SERVER ERROR:", error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

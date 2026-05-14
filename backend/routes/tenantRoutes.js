const express = require("express");
const router = express.Router();
const Tenant = require("../models/Tenant");


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

    if (req.body.name) tenant.name = req.body.name;
    if (req.body.logo !== undefined) tenant.logo = req.body.logo;
    
    if (req.body.theme) {
      tenant.theme = { ...tenant.theme, ...req.body.theme };
      tenant.markModified("theme");
    }

    if (req.body.contactInfo) {
      tenant.contactInfo = { ...tenant.contactInfo, ...req.body.contactInfo };
      tenant.markModified("contactInfo");
    }

    if (req.body.socialLinks) {
      tenant.socialLinks = { ...tenant.socialLinks, ...req.body.socialLinks };
      tenant.markModified("socialLinks");
    }

    if (req.body.settings && req.body.settings.layout) {
      tenant.settings = {
        ...tenant.settings,
        layout: { ...tenant.settings?.layout, ...req.body.settings.layout }
      };

      tenant.markModified("settings");
    }

    if (req.body.about) {
      tenant.about = { ...tenant.about, ...req.body.about };
      tenant.markModified("about");
    }

    if (req.body.hero) {
      tenant.hero = {
        ...tenant.hero.toObject ? tenant.hero.toObject() : tenant.hero,
        ...req.body.hero,
        images: Array.isArray(req.body.hero.images)
          ? req.body.hero.images.filter(Boolean)
          : tenant.hero.images
      };
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

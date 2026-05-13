const express = require("express");
const router = express.Router();
const SiteVisit = require("../models/SiteVisit");
const Lead = require("../models/Lead");

router.get("/", async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    await SiteVisit.updateMany(
      {
        visitDate: { $lt: today },
        status: { $in: ["Pending", "Confirmed"] },
      },
      { $set: { status: "Missed" } }
    );

    const visits = await SiteVisit.find()
      .sort({ createdAt: -1 })
      .populate("propertyId", "title location");
    res.json(visits);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const visit = await SiteVisit.findById(req.params.id).populate(
      "propertyId",
      "title location"
    );
    if (!visit) return res.status(404).json({ message: "Visit not found" });
    res.json(visit);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const visit = new SiteVisit(req.body);
    const saved = await visit.save();

    await Lead.create({
      name: saved.customerName,
      email: saved.customerEmail,
      phone: saved.customerPhone,
      propertyId: saved.propertyId,
      message:
        saved.notes ||
        `Site visit requested for ${saved.visitDate?.toDateString()} at ${saved.visitTime}`,
      source: "Website",
      inquiryType: "Site Visit",
      status: "Site Visit Scheduled",
      priority: "High",
    });

    res.status(201).json({
      success: true,
      message: "Site visit scheduled successfully",
      data: saved,
    });
  } catch (err) {
    console.error("CREATE SITE VISIT ERROR:", err.message);
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updated = await SiteVisit.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ message: "Visit not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await SiteVisit.findByIdAndDelete(req.params.id);
    res.json({ message: "Visit deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

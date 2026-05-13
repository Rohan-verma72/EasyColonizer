const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();

const Property = require("../models/Property");
const Inventory = require("../models/Inventory");

const ALLOWED_TYPES = [
  "Plot",
  "Flat",
  "Villa",
  "Commercial",
  "Industrial",
  "Machinery",
  "Row House",
  "Building",
];

const verifySyncKey = (req, res, next) => {
  try {
    const syncKey = req.headers["x-sync-key"];

    if (!syncKey) {
      return res.status(401).json({
        message: "Sync key missing",
      });
    }

    if (syncKey !== process.env.SYNC_SECRET_KEY) {
      return res.status(401).json({
        message: "Unauthorized sync attempt",
      });
    }

    next();
  } catch (err) {
    console.error("Sync auth error:", err);

    return res.status(500).json({
      message: "Authorization failed",
    });
  }
};

router.post("/push", verifySyncKey, async (req, res) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const {
      externalId,
      title,
      location,
      price,
      type,
      area,
      status,
      images,
      description,
      project,
      inventory,
      amenities,
      features,
      reraId,
      possessionStatus,
    } = req.body;


    if (!externalId) {
      return res.status(400).json({
        message: "externalId is required",
      });
    }

    if (!title || !location || !price || !type || !area) {
      return res.status(400).json({
        message: "Missing required property fields",
      });
    }

    if (!ALLOWED_TYPES.includes(type)) {
      return res.status(400).json({
        message: "Invalid property type",
      });
    }


    const cleanPayload = {
      externalId: String(externalId).trim(),
      title: String(title).trim(),
      location: String(location).trim(),
      price: Number(price),
      type,
      area: Number(area),
      status: status || "Available",
      description: description || "",
      project: project || "Default Project",
      images: Array.isArray(images) ? images : [],
      amenities: amenities || {},
      features: Array.isArray(features) ? features : [],
      reraId: reraId || "",
      possessionStatus:
        possessionStatus || "Ready to Move",
      lastSynced: new Date(),
    };


    const property = await Property.findOneAndUpdate(
      {
        externalId: cleanPayload.externalId,
      },
      {
        $set: cleanPayload,
      },
      {
        upsert: true,
        new: true,
        runValidators: true,
        session,
      }
    );


    let inventorySynced = 0;

    if (Array.isArray(inventory) && inventory.length) {
      for (const item of inventory) {
        if (!item.unitNumber) continue;

        await Inventory.findOneAndUpdate(
          {
            propertyId: property._id,
            unitNumber: item.unitNumber,
          },
          {
            $set: {
              propertyId: property._id,
              unitNumber: item.unitNumber,
              block: item.block || "A",
              phase: item.phase || "Phase 1",
              floor: item.floor || 0,
              size: Number(item.size || 0),
              price: Number(item.price || 0),
              dimensions: item.dimensions || "",
              facing: item.facing,
              roadWidth: item.roadWidth,
              unitType: item.unitType || type,
              images: item.images || [],
              status: item.status || "Available",
              updatedAt: new Date(),
            },
          },
          {
            upsert: true,
            new: true,
            runValidators: true,
            session,
          }
        );

        inventorySynced++;
      }
    }

    await session.commitTransaction();

    res.status(200).json({
      success: true,
      message: "Property synced successfully",
      propertyId: property._id,
      inventorySynced,
      syncedAt: new Date(),
    });
  } catch (err) {
    await session.abortTransaction();

    console.error("SYNC ERROR:", err);

    res.status(500).json({
      success: false,
      message: "Sync failed",
      error: err.message,
    });
  } finally {
    session.endSession();
  }
});

module.exports = router;
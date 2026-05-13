const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();

const Inventory = require("../models/Inventory");
const Lead = require("../models/Lead");

router.get("/customer/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    const inventory = await Inventory.find({
      bookedBy: userId,
    })
      .populate("propertyId")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: inventory.length,
      data: inventory,
    });
  } catch (err) {
    console.error("GET CUSTOMER INVENTORY ERROR:", err);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch inventory",
    });
  }
});


router.get("/property/:propertyId", async (req, res) => {
  try {
    const { propertyId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(propertyId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid property ID",
      });
    }

    const inventory = await Inventory.find({
      propertyId,
    }).sort({
      phase: 1,
      block: 1,
      floor: 1,
      unitNumber: 1,
    });

    return res.status(200).json({
      success: true,
      count: inventory.length,
      data: inventory,
    });
  } catch (err) {
    console.error("GET PROPERTY INVENTORY ERROR:", err);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch property inventory",
    });
  }
});


router.post("/", async (req, res) => {
  try {
    const item = new Inventory(req.body);

    const savedItem = await item.save();

    return res.status(201).json({
      success: true,
      message: "Inventory item created successfully",
      data: savedItem,
    });
  } catch (err) {
    console.error("CREATE INVENTORY ERROR:", err);

    if (err.code === 11000) {
      return res.status(400).json({
        success: false,
        message:
          "This unit already exists in the selected property/block/floor",
      });
    }

    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
});

router.post("/bulk", async (req, res) => {
  try {
    const {
      propertyId,
      prefix,
      startNumber,
      count,
      size,
      price,
      block,
      phase,
      floor,
      unitType,
      facing,
      dimensions,
      roadWidth,
    } = req.body;

    if (!propertyId || !prefix || !startNumber || !count) {
      return res.status(400).json({
        success: false,
        message:
          "propertyId, prefix, startNumber and count are required",
      });
    }

    const items = [];

    for (let i = 0; i < Number(count); i++) {
      items.push({
        propertyId,

        unitNumber: `${prefix}${Number(startNumber) + i}`,

        block: block || "A",

        phase: phase || "Phase 1",

        floor: floor || 0,

        size,

        price,

        unitType,

        facing,

        dimensions,

        roadWidth,

        status: "Available",
      });
    }

    const insertedItems = await Inventory.insertMany(items, {
      ordered: false,
    });

    return res.status(201).json({
      success: true,
      message: `${insertedItems.length} units created successfully`,
      count: insertedItems.length,
      data: insertedItems,
    });
  } catch (err) {
    console.error("BULK INVENTORY ERROR:", err);

    if (err.code === 11000 || err.name === "BulkWriteError") {
      const insertedCount =
        err.result?.result?.nInserted ||
        err.result?.nInserted ||
        0;

      if (insertedCount > 0) {
        return res.status(201).json({
          success: true,
          message: `${insertedCount} units added successfully. Duplicate units skipped.`,
          count: insertedCount,
        });
      }

      return res.status(400).json({
        success: false,
        message:
          "All units already exist for this property/block/floor",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to bulk create inventory",
    });
  }
});


router.post("/:id/book", async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      phone,
      email,
      bookedBy,
      paymentMethod = "upi",
      bookingAmount = 21000,
      notes,
    } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid inventory ID",
      });
    }

    if (!name || !phone || !/^[0-9]{10}$/.test(phone)) {
      return res.status(400).json({
        success: false,
        message: "Name and valid 10-digit phone number are required",
      });
    }

    console.log(`Attempting to book unit ${id} for ${name}`);
    const item = await Inventory.findById(id);

    if (!item) {
      console.error(`Unit ${id} not found`);
      return res.status(404).json({
        success: false,
        message: "Inventory item not found",
      });
    }

    if (item.status !== "Available") {
      console.warn(`Unit ${id} is already ${item.status}`);
      return res.status(409).json({
        success: false,
        message: `This unit is already ${item.status.toLowerCase()}`,
      });
    }

    item.status = "Booked";
    item.customerName = name;
    item.customerPhone = phone;
    item.customerEmail = email || "";
    item.bookingPrice = Number(bookingAmount) || item.price || 0;
    item.bookingDate = new Date();
    item.notes =
      notes || `Online booking initiated using ${paymentMethod}`;

    if (bookedBy && mongoose.Types.ObjectId.isValid(bookedBy)) {
      item.bookedBy = bookedBy;
    }

    const savedItem = await item.save();

    try {
      await Lead.create({
        name,
        email,
        phone,
        propertyId: item.propertyId,
        inventoryId: item._id,
        message: `Booking request for unit ${item.unitNumber}`,
        source: "Website",
        inquiryType: "Booking",
        status: "Booked",
        priority: "High",
      });
    } catch (leadErr) {
      console.error("LEAD CREATION ERROR:", leadErr);
    }

    return res.status(200).json({
      success: true,
      message: "Unit booked successfully",
      data: savedItem,
    });
  } catch (err) {
    console.error("BOOK INVENTORY ERROR:", err);

    return res.status(500).json({
      success: false,
      message: "An error occurred while processing your booking. Please try again later.",
      error: err.message
    });
  }
});


router.post("/:id/cancel", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid inventory ID",
      });
    }

    const item = await Inventory.findById(id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Inventory item not found",
      });
    }

    item.status = "Available";
    item.bookedBy = undefined;
    item.customerName = "";
    item.customerPhone = "";
    item.customerEmail = "";
    item.bookingDate = undefined;
    item.bookingPrice = 0;
    
    item.notes = `${item.notes || ""}\n[Cancelled on ${new Date().toLocaleDateString()}]`.trim();

    const savedItem = await item.save();

    return res.status(200).json({
      success: true,
      message: "Booking cancelled and unit is now Available",
      data: savedItem,
    });
  } catch (err) {
    console.error("CANCEL BOOKING ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to cancel booking",
    });
  }
});


router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid inventory ID",
      });
    }

    const updatedItem = await Inventory.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedItem) {
      return res.status(404).json({
        success: false,
        message: "Inventory item not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Inventory updated successfully",
      data: updatedItem,
    });
  } catch (err) {
    console.error("UPDATE INVENTORY ERROR:", err);

    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
});


router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid inventory ID",
      });
    }

    const deletedItem = await Inventory.findByIdAndDelete(id);

    if (!deletedItem) {
      return res.status(404).json({
        success: false,
        message: "Inventory item not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Inventory item deleted successfully",
    });
  } catch (err) {
    console.error("DELETE INVENTORY ERROR:", err);

    return res.status(500).json({
      success: false,
      message: "Failed to delete inventory item",
    });
  }
});

module.exports = router;

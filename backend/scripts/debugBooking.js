const mongoose = require('mongoose');
require('dotenv').config();
const Inventory = require('../models/Inventory');

async function findAndTest() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to DB");

    const unit = await Inventory.findOne({ status: "Available" });
    if (!unit) {
      console.log("No available units found to test");
      process.exit(0);
    }

    console.log(`Found unit: ${unit.unitNumber} (${unit._id})`);
    
    // Now simulate the booking logic locally to see where it crashes
    const name = "Test User";
    const phone = "9999999999";
    const email = "test@example.com";
    
    unit.status = "Booked";
    unit.customerName = name;
    unit.customerPhone = phone;
    unit.customerEmail = email;
    unit.bookingPrice = unit.price || 0;
    unit.bookingDate = new Date();
    
    console.log("Attempting to save...");
    await unit.save();
    console.log("Save successful!");
    
    process.exit(0);
  } catch (err) {
    console.error("CRASH DETECTED:");
    console.error(err);
    process.exit(1);
  }
}

findAndTest();

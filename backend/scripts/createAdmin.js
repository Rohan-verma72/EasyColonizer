const mongoose = require("mongoose");
require("dotenv").config();
const User = require("../models/User");

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    const ADMIN_USERNAME = "rohan123";
    const ADMIN_PASSWORD = "Rohan@1234";
    const ADMIN_EMAIL = "admin@easycolonizer.com";
    const ADMIN_PHONE = "9999999999";

    const existingUser = await User.findOne({
      username: ADMIN_USERNAME,
    }).select("+password");

    if (existingUser) {
      existingUser.password = ADMIN_PASSWORD;
      existingUser.name = "Super Admin";
      existingUser.email = ADMIN_EMAIL;
      existingUser.phone = ADMIN_PHONE;
      existingUser.role = "admin";
      existingUser.active = true;
      await existingUser.save();
    } else {
      await User.create({
        username: ADMIN_USERNAME,
        password: ADMIN_PASSWORD,
        name: "Super Admin",
        email: ADMIN_EMAIL,
        phone: ADMIN_PHONE,
        role: "admin",
        active: true,
      });
    }

    console.log("Admin user created successfully!");
    console.log("===================================");
    console.log("Username: " + ADMIN_USERNAME);
    console.log("Password: " + ADMIN_PASSWORD);
    console.log("Email: " + ADMIN_EMAIL);
    console.log("===================================");

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("Error:", err.message);
    await mongoose.disconnect();
    process.exit(1);
  }
}

createAdmin();

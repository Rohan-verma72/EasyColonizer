const mongoose = require("mongoose");
const Tenant = require("../models/Tenant");
const Property = require("../models/Property");
const User = require("../models/User");
const Lead = require("../models/Lead");
const Inventory = require("../models/Inventory");
const SiteVisit = require("../models/SiteVisit");
require("dotenv").config();

const seedSaaS = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    // 1. Create Default Tenant
    let defaultTenant = await Tenant.findOne({ slug: "default" });
    if (!defaultTenant) {
      defaultTenant = await Tenant.create({
        name: "Easy Colonizer",
        slug: "default",
        theme: {
          primaryColor: "#2fb8aa",
          secondaryColor: "#0f766e",
        },
        contactInfo: {
          email: "info@easycolonizer.com",
          phone: "9123456789",
        },
      });
      console.log("Default tenant created");
    } else {
      console.log("Default tenant already exists");
    }

    const tenantId = defaultTenant._id;

    // 2. Update existing records to link with default tenant
    const updateResult = await Promise.all([
      Property.updateMany({ tenantId: { $exists: false } }, { $set: { tenantId } }),
      User.updateMany({ tenantId: { $exists: false } }, { $set: { tenantId } }),
      Lead.updateMany({ tenantId: { $exists: false } }, { $set: { tenantId } }),
      Inventory.updateMany({ tenantId: { $exists: false } }, { $set: { tenantId } }),
      SiteVisit.updateMany({ tenantId: { $exists: false } }, { $set: { tenantId } }),
    ]);

    console.log("Migration complete:", updateResult);
    process.exit(0);
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
};

seedSaaS();

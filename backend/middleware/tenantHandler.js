const Tenant = require("../models/Tenant");

const tenantHandler = async (req, res, next) => {
  try {
    // 1. Identify tenant from header or slug
    const tenantId = req.headers["x-tenant-id"] || req.headers["X-Tenant-Id"];
    const tenantSlug = req.headers["x-tenant-slug"] || req.headers["X-Tenant-Slug"];

    let tenant;

    if (tenantId && tenantId !== "undefined") {
      tenant = await Tenant.findById(tenantId);
    } else if (tenantSlug) {
      tenant = await Tenant.findOne({ slug: tenantSlug });
    }

    // 2. Fallback to default if on localhost and no tenant found
    if (!tenant && (req.hostname === "localhost" || req.hostname === "127.0.0.1")) {
      tenant = await Tenant.findOne({ slug: "default" });
    }

    // If no tenant found and it's not a public/super-admin route, we might want to handle it
    // For now, we'll just attach it to the request if found
    if (tenant) {
      req.tenant = tenant;
    }

    next();
  } catch (error) {
    console.error("Tenant Handler Error:", error);
    res.status(500).json({ message: "Internal server error in tenant identification" });
  }
};

module.exports = tenantHandler;

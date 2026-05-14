const Tenant = require("../models/Tenant");

const tenantHandler = async (req, res, next) => {
  try {

    const tenantId = req.headers["x-tenant-id"] || req.headers["X-Tenant-Id"];
    const tenantSlug = req.headers["x-tenant-slug"] || req.headers["X-Tenant-Slug"];

    let tenant;

    if (tenantId && tenantId !== "undefined") {
      tenant = await Tenant.findById(tenantId);
    } else if (tenantSlug) {
      tenant = await Tenant.findOne({ slug: tenantSlug });
    }

    if (!tenant && (req.hostname === "localhost" || req.hostname === "127.0.0.1")) {
      tenant = await Tenant.findOne({ slug: "default" });
    }

    
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

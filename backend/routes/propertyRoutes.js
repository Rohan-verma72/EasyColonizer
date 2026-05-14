const express = require("express");
const router = express.Router();

const Property = require("../models/Property");
const Inventory = require("../models/Inventory");



router.get("/", async (req, res) => {
  try {
    const {
      location,
      type,
      status,
      project,

      minPrice,
      maxPrice,

      minArea,
      maxArea,

      gym,
      pool,
      parking,
      security,
      park,

      page = 1,
      limit = 12,
      sort = "newest",
    } = req.query;

    const query = {};
    if (req.tenant) {
      query.tenantId = req.tenant._id;
    }

    
    if (location?.trim()) {
      query.location = {
        $regex: location.trim(),
        $options: "i",
      };
    }

    if (
      type &&
      type !== "All Types" &&
      type !== "Property Type"
    ) {
      query.type = type;
    }

    if (status) {
      query.status = status;
    }

    if (project) {
      query.project = {
        $regex: project,
        $options: "i",
      };
    }

    
    if (minPrice || maxPrice) {
      query.price = {};

      if (minPrice) {
        query.price.$gte = Number(minPrice);
      }

      if (maxPrice) {
        query.price.$lte = Number(maxPrice);
      }
    }

   
    if (minArea || maxArea) {
      query.area = {};

      if (minArea) {
        query.area.$gte = Number(minArea);
      }

      if (maxArea) {
        query.area.$lte = Number(maxArea);
      }
    }


    const amenityMap = {
      gym: "amenities.gym",
      pool: "amenities.pool",
      parking: "amenities.parking",
      security: "amenities.security",
      park: "amenities.park",
    };

    Object.entries(amenityMap).forEach(([key, field]) => {
      if (req.query[key] === "true") {
        query[field] = true;
      }
    });

   

    let sortOption = {};

    switch (sort) {
      case "priceLow":
        sortOption.price = 1;
        break;

      case "priceHigh":
        sortOption.price = -1;
        break;

      case "areaLow":
        sortOption.area = 1;
        break;

      case "areaHigh":
        sortOption.area = -1;
        break;

      default:
        sortOption.createdAt = -1;
    }

    

    const pageNumber = Math.max(Number(page), 1);
    const limitNumber = Math.min(Number(limit), 50);

    const skip = (pageNumber - 1) * limitNumber;

   

    const [properties, total] = await Promise.all([
      Property.find(query)
        .sort(sortOption)
        .skip(skip)
        .limit(limitNumber)
        .lean(),

      Property.countDocuments(query),
    ]);

   

    if (!properties.length) {
      return res.json({
        success: true,
        properties: [],
        total: 0,
        page: pageNumber,
        totalPages: 0,
      });
    }

    res.json({
      success: true,
      properties,
      total,
      page: pageNumber,
      totalPages: Math.ceil(total / limitNumber),
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: "Failed to fetch properties",
    });
  }
});



router.get("/featured", async (req, res) => {
  try {
    const query = { status: "Available" };
    if (req.tenant) {
      query.tenantId = req.tenant._id;
    }
    const properties = await Property.find(query)
      .sort({ createdAt: -1 })
      .limit(6)
      .lean();

    res.json(properties);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Failed to fetch featured properties",
    });
  }
});



router.get("/:id", async (req, res) => {
  try {
    const property = await Property.findById(
      req.params.id,
    ).lean();

    if (!property) {
      return res.status(404).json({
        message: "Property not found",
      });
    }

    res.json(property);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});



router.post("/", async (req, res) => {
  try {
    const propertyData = { ...req.body };
    if (req.tenant) {
      propertyData.tenantId = req.tenant._id;
    }
    const property = new Property(propertyData);

    const saved = await property.save();

    res.status(201).json(saved);
  } catch (err) {
    console.error("Property Creation Error:", err);
    // Return the specific validation error message
    const errorMsg = err.name === 'ValidationError' 
      ? Object.values(err.errors).map(e => e.message).join(', ')
      : err.message;
      
    res.status(400).json({
      success: false,
      message: errorMsg,
    });
  }
});



router.put("/:id", async (req, res) => {
  try {
    const query = { _id: req.params.id };
    if (req.tenant) {
      query.tenantId = req.tenant._id;
    }
    const updated = await Property.findOneAndUpdate(
      query,
      req.body,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updated) {
      return res.status(404).json({
        message: "Property not found",
      });
    }

    res.json(updated);
  } catch (err) {
    console.error(err);

    res.status(400).json({
      message: err.message,
    });
  }
});


router.delete("/:id", async (req, res) => {
  try {
    const query = { _id: req.params.id };
    if (req.tenant) {
      query.tenantId = req.tenant._id;
    }
    const property = await Property.findOne(query);

    if (!property) {
      return res.status(404).json({
        message: "Property not found",
      });
    }

  
    await Inventory.deleteMany({
      propertyId: property._id,
    });

    await property.deleteOne();

    res.json({
      success: true,
      message: "Property deleted successfully",
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: err.message,
    });
  }
});


router.post("/sync", async (req, res) => {
  const { properties } = req.body;

  if (!Array.isArray(properties)) {
    return res.status(400).json({
      message: "properties must be array",
    });
  }

  const results = {
    created: 0,
    updated: 0,
    inventoryUpdated: 0,
    errors: [],
  };

  try {
    for (const propData of properties) {
      try {
        const {
          externalId,
          inventory = [],
          ...rest
        } = propData;

        if (!externalId) {
          results.errors.push(
            `Missing externalId: ${rest.title}`,
          );
          continue;
        }

        

        const property =
          await Property.findOneAndUpdate(
            { externalId },
            {
              ...rest,
              externalId,
              lastSynced: new Date(),
            },
            {
              new: true,
              upsert: true,
              runValidators: true,
              setDefaultsOnInsert: true,
            },
          );

        if (property.createdAt.getTime() === property.updatedAt.getTime()) {
          results.created++;
        } else {
          results.updated++;
        }


        if (Array.isArray(inventory)) {
          for (const item of inventory) {
            await Inventory.findOneAndUpdate(
              {
                propertyId: property._id,
                unitNumber: item.unitNumber,
              },
              {
                ...item,
                propertyId: property._id,
              },
              {
                upsert: true,
                new: true,
                runValidators: true,
              },
            );

            results.inventoryUpdated++;
          }
        }
      } catch (innerErr) {
        console.error(innerErr);

        results.errors.push(innerErr.message);
      }
    }

    res.json({
      success: true,
      results,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
      results,
    });
  }
});

module.exports = router;
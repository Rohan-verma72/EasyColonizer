const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
      index: true,
    },

    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 10000,
    },

    shortDescription: {
      type: String,
      trim: true,
      maxlength: 300,
    },

    type: {
      type: String,
      required: true,
      enum: [
        "Plot",
        "Flat",
        "Villa",
        "Commercial",
        "Industrial",
        "Machinery",
        "Row House",
        "Building",
      ],
      index: true,
    },

    category: {
      type: String,
      enum: ["Residential", "Commercial", "Industrial"],
      default: "Residential",
    },

    project: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
      index: true,
    },

    developer: {
      type: String,
      trim: true,
      maxlength: 200,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
      index: true,
    },

    pricePerSqft: {
      type: Number,
      min: 0,
    },

    bookingAmount: {
      type: Number,
      min: 0,
      default: 0,
    },

    location: {
      type: String,
      required: true,
      trim: true,
      maxlength: 300,
      index: true,
    },

    city: {
      type: String,
      trim: true,
      default: "Bhopal",
      index: true,
    },

    state: {
      type: String,
      trim: true,
      default: "Madhya Pradesh",
    },

    pincode: {
      type: String,
      trim: true,
      match: [/^[0-9]{6}$/, "Invalid pincode"],
    },

    coordinates: {
      latitude: {
        type: Number,
      },

      longitude: {
        type: Number,
      },
    },

    area: {
      type: Number,
      required: true,
      min: 1,
      index: true,
    },

    areaUnit: {
      type: String,
      enum: ["sqft", "sqyd", "acre"],
      default: "sqft",
    },

    bedrooms: {
      type: Number,
      min: 0,
    },

    bathrooms: {
      type: Number,
      min: 0,
    },

    balconies: {
      type: Number,
      min: 0,
    },

    furnishing: {
      type: String,
      enum: ["Unfurnished", "Semi Furnished", "Fully Furnished"],
    },

    facing: {
      type: String,
      enum: [
        "North",
        "South",
        "East",
        "West",
        "North-East",
        "North-West",
        "South-East",
        "South-West",
      ],
    },

    totalFloors: {
      type: Number,
      min: 0,
    },

    floorNumber: {
      type: Number,
      min: 0,
    },

    status: {
      type: String,
      enum: ["Available", "Booked", "Sold", "On Hold"],
      default: "Available",
      index: true,
    },

    possessionStatus: {
      type: String,
      enum: [
        "Ready to Move",
        "Under Construction",
        "Immediate Possession",
        "New Launch",
      ],
      default: "Ready to Move",
      index: true,
    },

    features: [
      {
        type: String,
        trim: true,
      },
    ],

    amenities: {
      gym: {
        type: Boolean,
        default: false,
      },

      pool: {
        type: Boolean,
        default: false,
      },

      parking: {
        type: Boolean,
        default: false,
      },

      security: {
        type: Boolean,
        default: false,
      },

      park: {
        type: Boolean,
        default: false,
      },

      clubhouse: {
        type: Boolean,
        default: false,
      },

      lift: {
        type: Boolean,
        default: false,
      },

      powerBackup: {
        type: Boolean,
        default: false,
      },

      cctv: {
        type: Boolean,
        default: false,
      },
    },

    images: [
      {
        type: String,
        trim: true,
      },
    ],

    featuredImage: {
      type: String,
      trim: true,
    },

    videoTourUrl: {
      type: String,
      trim: true,
    },

    brochureUrl: {
      type: String,
      trim: true,
    },

    floorPlans: [
      {
        title: {
          type: String,
          trim: true,
        },

        image: {
          type: String,
          trim: true,
        },
      },
    ],

    reraId: {
      type: String,
      trim: true,
      uppercase: true,
      index: true,
    },

    isVerified: {
      type: Boolean,
      default: true,
      index: true,
    },

    isFeatured: {
      type: Boolean,
      default: false,
      index: true,
    },

    isTrending: {
      type: Boolean,
      default: false,
    },

    views: {
      type: Number,
      default: 0,
    },

    inquiries: {
      type: Number,
      default: 0,
    },

    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    tags: [
      {
        type: String,
        trim: true,
      },
    ],

    seoTitle: {
      type: String,
      trim: true,
      maxlength: 70,
    },

    seoDescription: {
      type: String,
      trim: true,
      maxlength: 160,
    },

    externalId: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },

    lastSynced: {
      type: Date,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

propertySchema.index({
  title: "text",
  description: "text",
  location: "text",
  project: "text",
});

propertySchema.index({
  city: 1,
  type: 1,
  status: 1,
});

propertySchema.index({
  price: 1,
  area: 1,
});

propertySchema.index({
  isFeatured: 1,
  isTrending: 1,
});

propertySchema.pre("save", async function () {
  if (this.price && this.area) {
    this.pricePerSqft = Math.round(this.price / this.area);
  }

  // Generate slug if missing
  if (!this.slug && this.title) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^\w ]+/g, "")
      .replace(/ +/g, "-");
  }
});

module.exports = mongoose.model("Property", propertySchema);
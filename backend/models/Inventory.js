const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema(
  {
    propertyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      required: true,
      index: true,
    },

    unitNumber: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },

    block: {
      type: String,
      default: "A",
      trim: true,
      uppercase: true,
    },

    phase: {
      type: String,
      default: "Phase 1",
      trim: true,
    },

    size: {
      type: Number,
      min: 0,
    },

    price: {
      type: Number,
      min: 0,
    },

    dimensions: {
      type: String,
      trim: true,
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

    roadWidth: {
      type: Number,
      min: 0,
    },

    unitType: {
      type: String,
      trim: true,
      enum: [
        "Plot",
        "Flat",
        "Villa",
        "Commercial",
        "Office",
        "Shop",
        "Penthouse",
        "Studio",
      ],
    },

    floor: {
      type: Number,
      min: 0,
    },

    images: [
      {
        type: String,
        trim: true,
      },
    ],

    status: {
      type: String,
      enum: ["Available", "Booked", "Sold", "On Hold"],
      default: "Available",
      index: true,
    },

    bookedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    bookingPrice: {
      type: Number,
      min: 0,
    },

    bookingDate: {
      type: Date,
    },

    notes: {
      type: String,
      trim: true,
      maxlength: 2000,
    },

    customerName: {
      type: String,
      trim: true,
      maxlength: 120,
    },

    customerPhone: {
      type: String,
      trim: true,
      match: [/^[0-9]{10}$/, "Invalid phone number"],
    },

    customerEmail: {
      type: String,
      trim: true,
      lowercase: true,
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

inventorySchema.index(
  {
    propertyId: 1,
    phase: 1,
    block: 1,
    floor: 1,
    unitNumber: 1,
  },
  {
    unique: true,
  },
);

inventorySchema.index({
  propertyId: 1,
  status: 1,
});

inventorySchema.index({
  unitType: 1,
  status: 1,
});

inventorySchema.index({
  price: 1,
});

inventorySchema.pre("save", async function () {
  if (this.status === "Booked" || this.status === "Sold") {
    if (!this.bookingDate) {
      this.bookingDate = new Date();
    }

    if (!this.bookingPrice) {
      this.bookingPrice = this.price;
    }
  }
});

module.exports = mongoose.model("Inventory", inventorySchema);
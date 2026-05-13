const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please enter a valid email address",
      ],
      index: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
      match: [/^[0-9]{10}$/, "Phone number must be 10 digits"],
      index: true,
    },

    propertyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      index: true,
    },

    inventoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Inventory",
    },

    message: {
      type: String,
      trim: true,
      maxlength: 5000,
    },

    source: {
      type: String,
      enum: [
        "Website",
        "WhatsApp",
        "Facebook",
        "Instagram",
        "Google Ads",
        "Referral",
        "Walk-In",
        "Phone Call",
      ],
      default: "Website",
      index: true,
    },

    inquiryType: {
      type: String,
      enum: [
        "General",
        "Site Visit",
        "Booking",
        "Call Back",
        "Investment",
        "Home Loan",
      ],
      default: "General",
    },

    budget: {
      type: Number,
      min: 0,
    },

    preferredLocation: {
      type: String,
      trim: true,
    },

    status: {
      type: String,
      enum: [
        "New",
        "Contacted",
        "Qualified",
        "Site Visit Scheduled",
        "Negotiation",
        "Booked",
        "Closed",
        "Lost",
      ],
      default: "New",
      index: true,
    },

    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    followUpDate: {
      type: Date,
    },

    lastContactedAt: {
      type: Date,
    },

    notes: [
      {
        text: {
          type: String,
          trim: true,
        },

        addedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },

        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    isArchived: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

leadSchema.index({
  status: 1,
  source: 1,
});

leadSchema.index({
  assignedTo: 1,
  status: 1,
});

leadSchema.index({
  createdAt: -1,
});

leadSchema.index({
  followUpDate: 1,
});

leadSchema.index(
  {
    phone: 1,
    propertyId: 1,
    createdAt: 1,
  },
  {
    background: true,
  },
);

leadSchema.pre("save", async function () {
  if (this.status !== "New") {
    this.lastContactedAt = new Date();
  }
});

module.exports = mongoose.model("Lead", leadSchema);
const mongoose = require("mongoose");

const siteVisitSchema = new mongoose.Schema(
  {
    propertyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      required: [true, "Property is required"],
      index: true,
    },

    customerName: {
      type: String,
      required: [true, "Customer name is required"],
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    customerPhone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
      match: [/^[0-9]{10}$/, "Enter valid 10-digit mobile number"],
    },

    customerEmail: {
      type: String,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Enter valid email address"],
    },

    visitDate: {
      type: Date,
      required: [true, "Visit date is required"],
      validate: {
        validator: function (value) {
          return value >= new Date().setHours(0, 0, 0, 0);
        },
        message: "Visit date cannot be in the past",
      },
    },

    visitTime: {
      type: String,
      required: [true, "Visit time is required"],
      trim: true,
      enum: [
        "Morning (10 AM - 1 PM)",
        "Afternoon (1 PM - 4 PM)",
        "Evening (4 PM - 7 PM)",
      ],
    },

    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Completed", "Cancelled"],
      default: "Pending",
      index: true,
    },

    notes: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("SiteVisit", siteVisitSchema);
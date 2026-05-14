const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
      lowercase: true,
      minlength: 3,
      maxlength: 30,
      index: true,
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
      select: false,
    },

    name: {
      type: String,
      trim: true,
      maxlength: 100,
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      sparse: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter valid email"],
    },

    phone: {
      type: String,
      trim: true,
      set: v => (v === "" ? undefined : v),
      match: [/^[0-9]{10}$/, "Please enter valid 10-digit phone number"],
    },

    role: {
      type: String,
      enum: ["super-admin", "admin", "manager", "sales", "customer"],
      default: "customer",
      index: true,
    },

    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
      index: true,
    },

    active: {
      type: Boolean,
      default: true,
    },

    lastLogin: {
      type: Date,
    },

    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Property",
      },
    ],
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (err) {
    throw err;
  }
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

module.exports = mongoose.model("User", userSchema);
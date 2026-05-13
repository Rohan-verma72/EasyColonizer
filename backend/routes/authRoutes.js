const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

const normalizeUser = (user) => ({
  id: user._id,
  username: user.username,
  name: user.name || user.username,
  email: user.email || "",
  phone: user.phone || "",
  role: user.role,
  wishlist: user.wishlist || [],
});


router.post("/register", async (req, res) => {
  try {
    const {
      username,
      password,
      name,
      email,
      phone,
      role,
    } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username and password are required",
      });
    }

    const existingUsername = await User.findOne({
      username: username.toLowerCase(),
    });

    if (existingUsername) {
      return res.status(400).json({
        success: false,
        message: "Username already exists",
      });
    }

    if (email) {
      const existingEmail = await User.findOne({
        email: email.toLowerCase(),
      });

      if (existingEmail) {
        return res.status(400).json({
          success: false,
          message: "Email already registered",
        });
      }
    }

    const allowedRole =
      role && ["customer", "sales"].includes(role)
        ? role
        : "customer";

    const user = new User({
      username,
      password,
      name,
      email,
      phone,
      role: allowedRole,
    });

    await user.save();

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: normalizeUser(user),
    });
  } catch (err) {
    console.error("REGISTER ERROR:", err);

    return res.status(500).json({
      success: false,
      message: "Registration failed",
    });
  }
});


router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username and password are required",
      });
    }

    const user = await User.findOne({
      username: username.toLowerCase(),
    }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    if (!user.active) {
      return res.status(403).json({
        success: false,
        message: "Your account has been disabled",
      });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    user.lastLogin = new Date();
    await user.save();

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    return res.status(200).json({
      success: true,
      message: "Login successful",

      token,

      userId: user._id,
      username: user.username,
      name: user.name || user.username,
      role: user.role,

      user: normalizeUser(user),
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

module.exports = router;

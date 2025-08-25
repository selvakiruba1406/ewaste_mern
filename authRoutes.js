import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

// Generate JWT token
const genToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

// REGISTER route
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check missing fields
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Missing fields" });
    }

    // Check if email already exists
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(409).json({ message: "Email already used" });
    }

    // Create new user
    const user = await User.create({ name, email, password, role: role || "user" });

    // Respond with user info and token
    res.status(201).json({
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
      token: genToken(user._id)
    });

  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// LOGIN route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.json({
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
      token: genToken(user._id)
    });

  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

export default router;

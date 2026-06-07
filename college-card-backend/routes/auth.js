const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Student = require("../models/Student");
const Otp = require("../models/Otp");
const { sendOTP } = require("../services/emailService");
const router = express.Router();

// Generate 6-digit OTP
const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

// Step 1 — Request OTP
router.post("/request-otp", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) return res.status(400).json({ message: "Email is required" });

    // Check user exists
    const user = await User.findOne({ where: { email } });
    if (!user)
      return res
        .status(404)
        .json({ message: "No account found with this email" });

    // Invalidate old OTPs
    await Otp.update({ used: true }, { where: { email, used: false } });

    // Generate new OTP
    const code = generateOTP();
    const expires_at = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    await Otp.create({ email, code, expires_at });

    // Send email
    await sendOTP(email, code);

    res.json({ message: "OTP sent to your email" });
  } catch (err) {
    console.error("OTP error:", err);
    res.status(500).json({ message: "Failed to send OTP", error: err.message });
  }
});

// Step 2 — Verify OTP
router.post("/verify-otp", async (req, res) => {
  try {
    const { email, code } = req.body;

    const otp = await Otp.findOne({
      where: { email, code, used: false },
    });

    if (!otp) return res.status(400).json({ message: "Invalid OTP code" });

    if (new Date() > otp.expires_at) {
      return res
        .status(400)
        .json({ message: "OTP has expired. Please request a new one." });
    }

    // Mark OTP as used
    await otp.update({ used: true });

    // Get user
    const user = await User.findOne({ where: { email } });
    let studentData = null;
    if (user.role === "student") {
      studentData = await Student.findOne({ where: { email } });
    }

    // Issue JWT
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
        studentId: studentData?.id,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        studentId: studentData?.id,
      },
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Verification failed", error: err.message });
  }
});

// Keep old login for testing
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const bcrypt = require("bcryptjs");
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(401).json({ message: "Invalid credentials" });
    let studentData = null;
    if (user.role === "student") {
      studentData = await Student.findOne({ where: { email } });
    }
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
        studentId: studentData?.id,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );
    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        studentId: studentData?.id,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

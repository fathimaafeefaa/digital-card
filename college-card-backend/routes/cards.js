const express = require("express");
const Card = require("../models/Card");
const Student = require("../models/Student");
const Department = require("../models/Department");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

// Get card by student ID
router.get(
  "/student/:studentId",
  authMiddleware(["admin", "student"]),
  async (req, res) => {
    try {
      const card = await Card.findOne({
        where: { student_id: req.params.studentId },
        include: [
          {
            model: Student,
            include: [Department],
          },
        ],
      });
      if (!card) return res.status(404).json({ message: "Card not found" });
      res.json(card);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
);

// Get card by QR token (public — for scanning)
router.get("/scan/:token", async (req, res) => {
  try {
    const card = await Card.findOne({
      where: { qr_token: req.params.token },
      include: [
        {
          model: Student,
          include: [Department],
        },
      ],
    });
    if (!card) return res.status(404).json({ message: "Invalid QR code" });
    res.json(card);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

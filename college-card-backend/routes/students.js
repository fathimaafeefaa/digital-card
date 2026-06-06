const express = require("express");
const Student = require("../models/Student");
const Department = require("../models/Department");
const Card = require("../models/Card");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

// Get all students (admin only)
router.get("/", authMiddleware(["admin"]), async (req, res) => {
  try {
    const students = await Student.findAll({
      include: [Department, Card],
    });
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single student
router.get("/:id", authMiddleware(["admin", "student"]), async (req, res) => {
  try {
    const student = await Student.findByPk(req.params.id, {
      include: [Department, Card],
    });
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create student (admin only)
router.post("/", authMiddleware(["admin"]), async (req, res) => {
  try {
    const student = await Student.create(req.body);
    res.status(201).json(student);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update student (admin only)
router.patch("/:id", authMiddleware(["admin"]), async (req, res) => {
  try {
    await Student.update(req.body, { where: { id: req.params.id } });
    const updated = await Student.findByPk(req.params.id, {
      include: [Department],
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete student (admin only)
router.delete("/:id", authMiddleware(["admin"]), async (req, res) => {
  try {
    await Student.destroy({ where: { id: req.params.id } });
    res.json({ message: "Student deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

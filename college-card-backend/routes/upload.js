const express = require("express");
const multer = require("multer");
const path = require("path");
const Student = require("../models/Student");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `student-${req.params.id}-${Date.now()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB max
  fileFilter: (req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/jpg"];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only JPG and PNG images are allowed"));
    }
  },
});

router.post(
  "/:id",
  authMiddleware(["admin"]),
  upload.single("photo"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const photoUrl = `http://localhost:5000/uploads/${req.file.filename}`;

      await Student.update(
        { photo_url: photoUrl },
        { where: { id: req.params.id } },
      );

      res.json({ message: "Photo uploaded successfully", photo_url: photoUrl });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
);

module.exports = router;

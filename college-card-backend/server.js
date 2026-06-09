const express = require("express");
const cors = require("cors");
require("dotenv").config();

const sequelize = require("./config/database");
require("./models/Department");
require("./models/Student");
require("./models/Card");
require("./models/User");
require("./models/Otp");

const authRoutes = require("./routes/auth");
const studentRoutes = require("./routes/students");
const cardRoutes = require("./routes/cards");

const app = express();
const uploadRoute = require("./routes/upload");

app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001"],
    credentials: true,
  }),
);
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/cards", cardRoutes);
app.use("/uploads", express.static("uploads"));
app.use("/api/upload", uploadRoute);

app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "College Card API running" });
});

const PORT = process.env.PORT || 5000;

sequelize
  .authenticate()
  .then(() => {
    console.log("MySQL connected...");
    return sequelize.sync({ alter: true });
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("DB connection failed:", err);
  });

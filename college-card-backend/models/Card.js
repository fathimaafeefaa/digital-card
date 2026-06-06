const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Student = require("./Student");

const Card = sequelize.define("Card", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  qr_token: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  issued_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  expires_at: {
    type: DataTypes.DATE,
  },
  status: {
    type: DataTypes.ENUM("active", "expired", "revoked"),
    defaultValue: "active",
  },
});

Card.belongsTo(Student, { foreignKey: "student_id" });
Student.hasOne(Card, { foreignKey: "student_id" });

module.exports = Card;

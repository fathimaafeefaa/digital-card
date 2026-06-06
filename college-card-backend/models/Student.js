const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Department = require("./Department");

const Student = sequelize.define("Student", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  student_id: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  full_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  phone: {
    type: DataTypes.STRING,
  },
  year: {
    type: DataTypes.INTEGER,
  },
  photo_url: {
    type: DataTypes.STRING,
    defaultValue: null,
  },
  status: {
    type: DataTypes.ENUM("active", "inactive", "graduated"),
    defaultValue: "active",
  },
});

Student.belongsTo(Department, { foreignKey: "department_id" });
Department.hasMany(Student, { foreignKey: "department_id" });

module.exports = Student;

const bcrypt = require("bcryptjs");
const sequelize = require("../config/database");
const User = require("../models/User");
const Department = require("../models/Department");
const Student = require("../models/Student");
const Card = require("../models/Card");
const { v4: uuidv4 } = require("uuid");

const seed = async () => {
  await sequelize.sync({ force: true });
  console.log("Database synced...");

  // Create departments
  const departments = await Department.bulkCreate([
    { name: "Computer Science", code: "CS", faculty: "Engineering" },
    { name: "Business Administration", code: "BA", faculty: "Business" },
    { name: "Electrical Engineering", code: "EE", faculty: "Engineering" },
    { name: "Medicine", code: "MED", faculty: "Health Sciences" },
    { name: "Architecture", code: "ARCH", faculty: "Design" },
  ]);
  console.log("Departments created...");

  // Create admin user
  const adminPassword = await bcrypt.hash("admin123", 10);
  await User.create({
    email: "admin@college.edu",
    password_hash: adminPassword,
    role: "admin",
  });
  console.log("Admin user created...");

  // Create students with users
  const studentsData = [
    {
      student_id: "CS2021001",
      full_name: "Ahmed Al Rashidi",
      email: "ahmed@college.edu",
      phone: "+971501234567",
      year: 3,
      department_id: departments[0].id,
    },
    {
      student_id: "CS2021002",
      full_name: "Sara Al Mansoori",
      email: "sara@college.edu",
      phone: "+971502345678",
      year: 3,
      department_id: departments[0].id,
    },
    {
      student_id: "BA2022001",
      full_name: "Mohammed Al Zaabi",
      email: "mohammed@college.edu",
      phone: "+971503456789",
      year: 2,
      department_id: departments[1].id,
    },
    {
      student_id: "BA2022002",
      full_name: "Fatima Al Hashimi",
      email: "fatima@college.edu",
      phone: "+971504567890",
      year: 2,
      department_id: departments[1].id,
    },
    {
      student_id: "EE2020001",
      full_name: "Omar Al Shamsi",
      email: "omar@college.edu",
      phone: "+971505678901",
      year: 4,
      department_id: departments[2].id,
    },
    {
      student_id: "MED2021001",
      full_name: "Layla Al Nuaimi",
      email: "layla@college.edu",
      phone: "+971506789012",
      year: 3,
      department_id: departments[3].id,
    },
    {
      student_id: "ARCH2023001",
      full_name: "Khalid Al Marzouqi",
      email: "khalid@college.edu",
      phone: "+971507890123",
      year: 1,
      department_id: departments[4].id,
    },
    {
      student_id: "CS2023001",
      full_name: "Noor Al Kaabi",
      email: "noor@college.edu",
      phone: "+971508901234",
      year: 1,
      department_id: departments[0].id,
    },
  ];

  for (const s of studentsData) {
    const student = await Student.create(s);

    // Create a login user for each student
    const pass = await bcrypt.hash("student123", 10);
    await User.create({
      email: s.email,
      password_hash: pass,
      role: "student",
    });

    // Create a card for each student
    await Card.create({
      student_id: student.id,
      qr_token: uuidv4(),
      issued_at: new Date(),
      expires_at: new Date(
        new Date().setFullYear(new Date().getFullYear() + 1),
      ),
      status: "active",
    });
  }

  console.log("Students and cards created...");
  console.log("Seed complete!");
  process.exit();
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});

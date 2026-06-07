const bcrypt = require("bcryptjs");
const sequelize = require("../config/database");
const User = require("../models/User");
const Department = require("../models/Department");
const Student = require("../models/Student");
const Card = require("../models/Card");
const Otp = require("../models/Otp");
const { v4: uuidv4 } = require("uuid");

const seed = async () => {
  await sequelize.sync({ force: true });
  console.log("Database synced...");

  const departments = await Department.bulkCreate([
    { name: "Aviation Management", code: "AVM", faculty: "Business Aviation" },
    {
      name: "Air Traffic Control",
      code: "ATC",
      faculty: "Aviation Operations",
    },
    { name: "Airport Operations", code: "APO", faculty: "Aviation Operations" },
    { name: "Aerospace Engineering", code: "ASE", faculty: "Engineering" },
    { name: "Aviation Safety", code: "AVS", faculty: "Aviation Operations" },
  ]);
  console.log("Departments created...");

  // Admin user
  const adminPassword = await bcrypt.hash("admin123", 10);
  await User.create({
    email: "admin@eau.ac.ae",
    password_hash: adminPassword,
    role: "admin",
  });
  console.log("Admin created: admin@eau.ac.ae");

  // Students with EAU emails
  const studentsData = [
    {
      student_id: "EAU-AVM-2021-001",
      full_name: "Ahmed Al Rashidi",
      email: "ahmed.rashidi@eau.ac.ae",
      phone: "+971501234567",
      year: 3,
      department_id: departments[0].id,
    },
    {
      student_id: "EAU-AVM-2021-002",
      full_name: "Sara Al Mansoori",
      email: "sara.mansoori@eau.ac.ae",
      phone: "+971502345678",
      year: 3,
      department_id: departments[0].id,
    },
    {
      student_id: "EAU-ATC-2022-001",
      full_name: "Mohammed Al Zaabi",
      email: "mohammed.zaabi@eau.ac.ae",
      phone: "+971503456789",
      year: 2,
      department_id: departments[1].id,
    },
    {
      student_id: "EAU-ATC-2022-002",
      full_name: "Fatima Al Hashimi",
      email: "fatima.hashimi@eau.ac.ae",
      phone: "+971504567890",
      year: 2,
      department_id: departments[1].id,
    },
    {
      student_id: "EAU-APO-2020-001",
      full_name: "Omar Al Shamsi",
      email: "omar.shamsi@eau.ac.ae",
      phone: "+971505678901",
      year: 4,
      department_id: departments[2].id,
    },
    {
      student_id: "EAU-ASE-2021-001",
      full_name: "Layla Al Nuaimi",
      email: "layla.nuaimi@eau.ac.ae",
      phone: "+971506789012",
      year: 3,
      department_id: departments[3].id,
    },
    {
      student_id: "EAU-AVS-2023-001",
      full_name: "Khalid Al Marzouqi",
      email: "khalid.marzouqi@eau.ac.ae",
      phone: "+971507890123",
      year: 1,
      department_id: departments[4].id,
    },
    {
      student_id: "EAU-AVM-2023-001",
      full_name: "Noor Al Kaabi",
      email: "noor.kaabi@eau.ac.ae",
      phone: "+971508901234",
      year: 1,
      department_id: departments[0].id,
    },
  ];

  for (const s of studentsData) {
    const student = await Student.create(s);

    const pass = await bcrypt.hash("student123", 10);
    await User.create({
      email: s.email,
      password_hash: pass,
      role: "student",
    });

    await Card.create({
      student_id: student.id,
      qr_token: uuidv4(),
      issued_at: new Date(),
      expires_at: new Date(
        new Date().setFullYear(new Date().getFullYear() + 1),
      ),
      status: "active",
    });

    console.log(`Created: ${s.full_name} — ${s.email}`);
  }

  console.log("\nSeed complete!");
  console.log("─────────────────────────────");
  console.log("Admin login:   admin@eau.ac.ae");
  console.log("Student login: ahmed.rashidi@eau.ac.ae");
  console.log("─────────────────────────────");
  process.exit();
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});

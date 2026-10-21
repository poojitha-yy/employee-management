require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
async function create() {
  await mongoose.connect(process.env.MONGO_URI);
  const coll = mongoose.connection.db.collection("employees");
  const hash = await bcrypt.hash("Admin@123", 10);
  await coll.deleteMany({ employeeId: "EMP001" });
  await coll.insertOne({
    employeeId: "EMP001",
    name: "Admin",
    email: "admin@test.com",
    password: hash,
    role: "admin",
  });
  console.log("SUCCESS - Now login with EMP001 / Admin@123");
  process.exit();
}
create();

require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Admin = require("./models/Admin");

mongoose.connect(process.env.MONGO_URI);

async function createAdmin() {
  const hashed = await bcrypt.hash("apass", 10);

  await Admin.create({
    email: "owner@gmail.com",   // <-- change this
    password: hashed
  });

  console.log("Admin created");
  process.exit();
}

createAdmin();
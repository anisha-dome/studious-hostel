require("dotenv").config();
const jwt = require("jsonwebtoken");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const crypto = require("crypto");
const sendEmail = require("./utils/mailer");

const app = express();
const PORT = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// routes
const contactRoute = require("./routes/contact");
const adminRoute = require("./routes/admin");

app.use("/contact", contactRoute);
app.use("/admin", adminRoute);

// admin login
const Admin = require("./models/Admin");
const bcrypt = require("bcrypt");

app.post("/admin/login", async (req, res) => {

  const { email, password } = req.body;

  try {

    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const match = await bcrypt.compare(password, admin.password);

    if (!match) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: admin._id },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.json({ token });

  } catch (error) {

    console.error(error);
    res.status(500).json({ message: "Server error" });

  }

});

// Change password 
app.put("/admin/change-password", async (req, res) => {
  const { email, currentPassword, newPassword } = req.body;

  const admin = await Admin.findOne({ email });

  if (!admin) return res.status(404).json({ message: "Admin not found" });

  const match = await bcrypt.compare(currentPassword, admin.password);

  if (!match) {
    return res.status(401).json({ message: "Wrong current password" });
  }

  const hashed = await bcrypt.hash(newPassword, 10);

  admin.password = hashed;
  await admin.save();

  res.json({ message: "Password changed successfully" });
});




// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.error("MongoDB error:", err));

// test route
app.get("/", (req, res) => {
  res.send("Studious Hostel Backend Running");
});

// start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
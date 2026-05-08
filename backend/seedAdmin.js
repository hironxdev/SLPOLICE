import mongoose from "mongoose";
import bcrypt from "bcrypt";
import User from "./models/User.js";

const MONGO_URI = "mongodb://127.0.0.1:27017/ccid_portal";

async function seedAdmin() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB for seeding...");

    const email = "admin@slpoliceccid.lk";
    const password = "AdminPassword123";
    const nic = "000000000V";

    const existingAdmin = await User.findOne({ email });
    if (existingAdmin) {
      console.log("Admin already exists!");
      process.exit(0);
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const newAdmin = new User({
      name: "CSEU Administrator",
      email,
      password_hash,
      nic,
      role: "admin"
    });

    await newAdmin.save();
    console.log("Admin account created successfully!");
    console.log("Email:", email);
    console.log("Password:", password);
    process.exit(0);
  } catch (error) {
    console.error("Error seeding admin:", error);
    process.exit(1);
  }
}

seedAdmin();

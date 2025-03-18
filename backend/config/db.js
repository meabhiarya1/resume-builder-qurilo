const mongoose = require("mongoose");
const User = require("../models/User");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected");

    const adminExists = await User.findOne({ email: "admin@gmail.com" });

    if (!adminExists) {
      // Create a new user instance
      const admin = new User({
        name: "Admin",
        email: "admin@gmail.com",
        password: "123456",
        role: "admin",
      });

      await admin.save();
      console.log("✅ Admin user created successfully");
    } else {
      console.log("✅ Admin user already exists");
    }
  } catch (error) {
    console.error("❌ MongoDB Connection Failed", error);
    process.exit(1);
  }
};

module.exports = connectDB;

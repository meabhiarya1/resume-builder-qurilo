const mongoose = require("mongoose");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log("MongoDB Connected");

        // Check if admin exists
        const adminExists = await User.findOne({ email: "admin@gmail.com" });

        if (!adminExists) {
            const hashedPassword = await bcrypt.hash("123456", 10);
            await User.create({
                name: "Admin",
                email: "admin@gmail.com",
                password: hashedPassword,
                role: "admin"
            });

            console.log("Admin user created successfully");
        } else {
            console.log("Admin user already exists");
        }
    } catch (error) {
        console.error("MongoDB Connection Failed", error);
        process.exit(1);
    }
};

module.exports = connectDB;

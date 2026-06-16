import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js";
import connectDB from "./config/db.js";

dotenv.config();

const testAuth = async () => {
  await connectDB();
  const user = await User.findOne({ email: "admin@patilcybershield.com" });
  if (!user) {
    console.log("User not found!");
  } else {
    console.log("User found:", user);
    const isMatch = await user.matchPassword("P@tilcybershield1207");
    console.log("Password match:", isMatch);
  }
  process.exit(0);
};

testAuth();

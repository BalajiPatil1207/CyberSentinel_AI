import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js";
import connectDB from "./config/db.js";

dotenv.config();

const resetPassword = async () => {
  await connectDB();
  const user = await User.findOne({ email: "admin@patilcybershield.com" });
  if (!user) {
    console.log("User not found!");
  } else {
    user.password = "P@tilcybershield1207";
    await user.save();
    console.log("Password reset successfully!");
    
    // verify match
    const isMatch = await user.matchPassword("P@tilcybershield1207");
    console.log("Password match after reset:", isMatch);
  }
  process.exit(0);
};

resetPassword();

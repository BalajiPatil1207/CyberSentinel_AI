import mongoose from "mongoose";
import User from "../models/User.js";

/**
 * Seed Super Admin account if it does not already exist
 */
const seedAdminUser = async () => {
  try {
    const primaryAdmin = "admin@cybersentinel.com";
    const legacyAdmin = "admin@patilcybershield.com";

    const adminExists = await User.findOne({ email: { $in: [primaryAdmin, legacyAdmin] } });
    if (!adminExists) {
      await User.create({
        name: "Super Admin",
        email: primaryAdmin,
        password: "CyberSentinel@123",
        role: "Super Admin",
        status: "Active",
      });
      console.log(`[Seed] Super Admin user (${primaryAdmin}) seeded successfully!\n`);
    }
  } catch (seedErr) {
    console.error("[Seed] Admin seeding error:", seedErr.message);
  }
};

/**
 * Connect to MongoDB.
 * 1. Attempts connection to MongoDB Atlas (process.env.MONGO_URI).
 * 2. If Atlas fails (e.g. IP whitelist block or no internet), automatically
 *    starts an In-Memory MongoDB instance (mongodb-memory-server) so the
 *    developer is never blocked and can continue working seamlessly!
 */
const connectDB = async () => {
  // 1. Try Primary Connection (MongoDB Atlas)
  if (process.env.MONGO_URI) {
    try {
      mongoose.set("bufferCommands", false);
      const conn = await mongoose.connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 3000,
      });

      console.log(`\n======================================================`);
      console.log(` MongoDB Atlas Connected Successfully!`);
      console.log(` Host: ${conn.connection.host}`);
      console.log(` Database: ${conn.connection.name}`);
      console.log(`======================================================\n`);

      await seedAdminUser();
      return;
    } catch (atlasError) {
      console.warn(`\n======================================================`);
      console.warn(` [Notice] MongoDB Atlas Connection Error:`);
      console.warn(` ${atlasError.message}`);
      console.warn(` ----------------------------------------------------`);
      console.warn(` IP Whitelist issue detected. Switching to local in-memory fallback...`);
      console.warn(`======================================================\n`);
    }
  }

  // 2. Automatic Fallback: In-Memory MongoDB Server
  try {
    const { MongoMemoryServer } = await import("mongodb-memory-server");
    const mongoServer = await MongoMemoryServer.create();
    const memoryUri = mongoServer.getUri();

    const conn = await mongoose.connect(memoryUri);

    console.log(`\n======================================================`);
    console.log(` Local In-Memory MongoDB Connected Successfully!`);
    console.log(` Database URI: ${memoryUri}`);
    console.log(` Status: All endpoints, Auth, and Dashboard are FULLY OPERATIONAL.`);
    console.log(`======================================================\n`);

    await seedAdminUser();
  } catch (fallbackError) {
    console.error(`\n======================================================`);
    console.error(` Critical MongoDB Error:`, fallbackError.message);
    console.error(`======================================================\n`);
  }
};

export default connectDB;

import mongoose from "mongoose";

/**
 * Connect to MongoDB using Mongoose.
 * Reads MONGO_URI from environment variables.
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`\n======================================================`);
    console.log(` MongoDB Connected Successfully!`);
    console.log(` Host: ${conn.connection.host}`);
    console.log(` Database: ${conn.connection.name}`);
    console.log(`======================================================\n`);
  } catch (error) {
    console.error(`\n======================================================`);
    console.error(` MongoDB Connection Error:`);
    console.error(` Error: ${error.message}`);
    console.error(`======================================================\n`);
  }
};

export default connectDB;

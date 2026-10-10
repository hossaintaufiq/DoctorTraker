import mongoose from "mongoose";

export async function connectDB(): Promise<void> {
  const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/doctor_tracker";

  try {
    mongoose.set("strictQuery", true);
    await mongoose.connect(uri);
    console.log(`[Database] MongoDB Connected successfully to ${mongoose.connection.host}`);
  } catch (error) {
    console.warn(`[Database Warning] Could not establish MongoDB connection: ${(error as Error).message}`);
    console.warn(`[Database Note] Server will still operate; check your local MongoDB service (e.g. mongod) or MONGODB_URI in .env.`);
  }
}

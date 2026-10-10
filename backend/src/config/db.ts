import mongoose from "mongoose";
import dns from "node:dns";

// Fix Windows Node.js querySrv ECONNREFUSED on local ISP DNS
try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch {
  // Ignore if custom DNS cannot be set
}

export async function connectDB(): Promise<void> {
  const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/doctor_tracker";

  try {
    mongoose.set("strictQuery", true);
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`[Database] MongoDB Connected successfully to ${mongoose.connection.host}`);
  } catch (error) {
    console.warn(`[Database Warning] Could not establish MongoDB connection: ${(error as Error).message}`);
    console.warn(`[Database Note] Verify your Atlas IP Whitelist (Network Access -> Allow Access from Anywhere 0.0.0.0/0) or check MONGODB_URI in .env.`);
  }
}

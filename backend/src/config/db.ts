import mongoose from "mongoose";
import dns from "node:dns";
import { env } from "./env.js";

// Fix Windows Node.js querySrv ECONNREFUSED on local ISP DNS
try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch {
  // Ignore if custom DNS cannot be set
}

export async function connectDB(): Promise<typeof mongoose | null> {
  const uri = env.MONGODB_URI;

  try {
    mongoose.set("strictQuery", true);
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`[Database] MongoDB Connected successfully: ${conn.connection.host}`);

    // Auto-ensure default Administrator accounts exist for instant out-of-the-box login
    try {
      const { User } = await import("../models/User.js");
      const adminEmails = ["admin@doctortracker.com", "admin@medcare.com"];
      for (const email of adminEmails) {
        const adminExists = await User.findOne({ email });
        if (!adminExists) {
          await User.create({
            name: "Doctor Tracker Admin",
            email,
            password: "password123",
            role: "admin",
          });
          console.log(`[Database] Initialized default Admin credentials: ${email} / password123`);
        }
      }
    } catch {
      // Ignore if user collection check fails
    }

    return conn;
  } catch (error) {
    console.error(`[Database Error] Failed to connect to MongoDB: ${(error as Error).message}`);
    if (env.NODE_ENV === "production") {
      process.exit(1);
    }
    return null;
  }
}

export async function disconnectDB(): Promise<void> {
  try {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
      console.log("[Database] MongoDB connection closed cleanly.");
    }
  } catch (err) {
    console.error("[Database Error] Error during disconnection:", err);
  }
}

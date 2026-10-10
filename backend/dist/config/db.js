"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = connectDB;
const mongoose_1 = __importDefault(require("mongoose"));
const node_dns_1 = __importDefault(require("node:dns"));
// Fix Windows Node.js querySrv ECONNREFUSED on local ISP DNS
try {
    node_dns_1.default.setServers(["8.8.8.8", "1.1.1.1"]);
}
catch {
    // Ignore if custom DNS cannot be set
}
async function connectDB() {
    const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/doctor_tracker";
    try {
        mongoose_1.default.set("strictQuery", true);
        await mongoose_1.default.connect(uri, {
            serverSelectionTimeoutMS: 5000,
        });
        console.log(`[Database] MongoDB Connected successfully to ${mongoose_1.default.connection.host}`);
        // Auto-ensure default Administrator exists for instant out-of-the-box login
        try {
            const { User } = await import("../models/User.js");
            const adminExists = await User.findOne({ email: "admin@medcare.com" });
            if (!adminExists) {
                await User.create({
                    name: "Sullivan (Master Admin)",
                    email: "admin@medcare.com",
                    password: "password123",
                    role: "admin",
                });
                console.log("[Database] Initialized default Admin credentials: admin@medcare.com / password123");
            }
        }
        catch (e) {
            // Ignore if user collection check fails
        }
    }
    catch (error) {
        console.warn(`[Database Warning] Could not establish MongoDB connection: ${error.message}`);
        console.warn(`[Database Note] Verify your Atlas IP Whitelist (Network Access -> Allow Access from Anywhere 0.0.0.0/0) or check MONGODB_URI in .env.`);
    }
}

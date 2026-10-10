"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = connectDB;
const mongoose_1 = __importDefault(require("mongoose"));
async function connectDB() {
    const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/doctor_tracker";
    try {
        mongoose_1.default.set("strictQuery", true);
        await mongoose_1.default.connect(uri);
        console.log(`[Database] MongoDB Connected successfully to ${mongoose_1.default.connection.host}`);
    }
    catch (error) {
        console.warn(`[Database Warning] Could not establish MongoDB connection: ${error.message}`);
        console.warn(`[Database Note] Server will still operate; check your local MongoDB service (e.g. mongod) or MONGODB_URI in .env.`);
    }
}

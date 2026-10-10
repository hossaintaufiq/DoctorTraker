"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_js_1 = require("./config/db.js");
const index_js_1 = __importDefault(require("./routes/index.js"));
const errorHandler_js_1 = require("./middleware/errorHandler.js");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:3000";
// Connect to MongoDB
(0, db_js_1.connectDB)();
// Middlewares
app.use((0, cors_1.default)({
    origin: [CORS_ORIGIN, "http://localhost:3000", "http://127.0.0.1:3000"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
if (process.env.NODE_ENV !== "production") {
    app.use((0, morgan_1.default)("dev"));
}
// API Routes
app.use("/api", index_js_1.default);
// 404 Handler
app.use("*", (req, res) => {
    res.status(404).json({
        success: false,
        message: `The requested endpoint ${req.originalUrl} does not exist on Doctor Tracker API.`,
    });
});
// Centralized Error Handling Middleware
app.use(errorHandler_js_1.errorHandler);
// Start Server
app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`  🩺 Doctor Tracker REST API Server Active`);
    console.log(`  🌐 URL: http://localhost:${PORT}`);
    console.log(`  🚀 Health: http://localhost:${PORT}/api/health`);
    console.log(`  🏥 Mode: ${process.env.NODE_ENV || "development"}`);
    console.log(`====================================================`);
});
exports.default = app;

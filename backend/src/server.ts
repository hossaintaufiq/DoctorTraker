import express, { Express } from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import routes from "./routes/index.js";
import { errorHandler } from "./middleware/errorHandler.js";

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 5000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:3000";

// Connect to MongoDB
connectDB();

// Middlewares
app.use(
  cors({
    origin: [CORS_ORIGIN, "http://localhost:3000", "http://127.0.0.1:3000"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

// API Routes
app.use("/api", routes);

// 404 Handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: `The requested endpoint ${req.originalUrl} does not exist on Doctor Tracker API.`,
  });
});

// Centralized Error Handling Middleware
app.use(errorHandler);

// Start Server
app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`  🩺 Doctor Tracker REST API Server Active`);
  console.log(`  🌐 URL: http://localhost:${PORT}`);
  console.log(`  🚀 Health: http://localhost:${PORT}/api/health`);
  console.log(`  🏥 Mode: ${process.env.NODE_ENV || "development"}`);
  console.log(`====================================================`);
});

export default app;

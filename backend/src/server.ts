import express, { Express, Request, Response, NextFunction } from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import routes from "./routes/index.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { helmetSecurity, sanitizeNoSql, apiLimiter } from "./middleware/security.js";

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 5000;
const rawCorsOrigin = process.env.CORS_ORIGIN || "https://frontend-two-beta-95.vercel.app,http://localhost:3000";
const CORS_ORIGIN = rawCorsOrigin;
const allowedOrigins = rawCorsOrigin
  .split(",")
  .map((o) => o.trim().replace(/\/$/, ""));

// 1. Global Security Headers & Protection (Helmet)
app.use(helmetSecurity);

// 2. Disable ETag caching to prevent 304 Not Modified responses on dynamic database data
app.set("etag", false);
app.disable("etag");

// 3. Strip conditional headers and enforce no-cache so all responses are fresh 200 OK
app.use((req: Request, res: Response, next: NextFunction) => {
  delete req.headers["if-none-match"];
  delete req.headers["if-modified-since"];
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  res.setHeader("Surrogate-Control", "no-store");
  next();
});

// 4. Connect to MongoDB
connectDB();

// 5. Dynamic & Robust CORS Configuration for Vercel & Production
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, server-to-server)
      if (!origin) return callback(null, true);

      const normalizedOrigin = origin.replace(/\/$/, "");
      if (
        allowedOrigins.includes(normalizedOrigin) ||
        normalizedOrigin === "https://frontend-two-beta-95.vercel.app" ||
        normalizedOrigin.endsWith(".vercel.app") ||
        normalizedOrigin.includes("localhost") ||
        normalizedOrigin.includes("127.0.0.1")
      ) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cache-Control", "Pragma", "Expires"],
  })
);

// 6. Request Body Parsing with Strict Size Limits (DoS mitigation)
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

// 7. NoSQL Injection & Query Sanitization
app.use(sanitizeNoSql);

// 8. Global API Rate Limiting
app.use("/api", apiLimiter);

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

// Root Index Route
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    service: "Doctor Tracker Medical REST API Server",
    version: "2.4.0",
    status: "online",
    database: "MongoDB Atlas Cloud",
    frontendUrl: CORS_ORIGIN,
    documentation: {
      health: "/api/health",
      doctors: "/api/doctors",
      patients: "/api/patients",
      departments: "/api/departments",
      appointments: "/api/appointments",
      invoices: "/api/invoices",
      logs: "/api/logs",
      analytics: "/api/analytics/dashboard",
    },
    message: "Doctor Tracker REST API is running. Access frontend portal at " + CORS_ORIGIN,
  });
});

// Mount Main API Routes
app.use("/api", routes);

// 404 Handler
app.use("*", (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `The requested endpoint ${req.originalUrl} does not exist on Doctor Tracker API. Use /api routes.`,
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

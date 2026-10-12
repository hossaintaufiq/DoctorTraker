import express, { Express, Request, Response } from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { env } from "./config/env.js";
import { connectDB, disconnectDB } from "./config/db.js";
import routes from "./routes/index.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { helmetSecurity, sanitizeNoSql, apiLimiter } from "./middleware/security.js";

const app: Express = express();
const PORT = env.PORT;

// Trust reverse proxy (e.g. Render, AWS, Heroku) for HTTPS cookies & rate limiting
app.set("trust proxy", 1);

// 1. API-appropriate Security Headers via Helmet (no web CSP)
app.use(helmetSecurity);

// 2. Cookie Parser for secure httpOnly refresh tokens
app.use(cookieParser());

// 3. Strict CORS Configuration from CORS_ORIGIN allowlist only
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, server-to-server)
      if (!origin) return callback(null, true);

      const normalizedOrigin = origin.replace(/\/$/, "");
      if (env.ALLOWED_ORIGINS.includes(normalizedOrigin)) {
        return callback(null, true);
      }
      return callback(new Error(`Origin ${origin} is not allowed by CORS.`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Cache-Control",
      "Pragma",
      "Expires",
      "If-None-Match",
      "If-Modified-Since",
    ],
  })
);

// 4. Request Body Parsing with strict limits
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

// 5. NoSQL Injection Sanitizer
app.use(sanitizeNoSql);

// 6. Global API Rate Limiter
app.use("/api", apiLimiter);

// 7. Request logging
if (env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

// 8. Connect to MongoDB (skip auto-connection in test environment)
if (process.env.NODE_ENV !== "test") {
  connectDB();
}

// 9. Root Index Route
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    service: "Doctor Tracker Medical REST API Server",
    version: "2.4.0",
    status: "online",
    endpoints: {
      health: "/api/health",
      auth: "/api/auth",
      doctors: "/api/doctors",
      patients: "/api/patients",
      departments: "/api/departments",
      appointments: "/api/appointments",
      invoices: "/api/invoices",
      logs: "/api/logs",
      analytics: "/api/analytics/dashboard",
    },
  });
});

// 10. Mount Main API Routes
app.use("/api", routes);

// 11. 404 Handler
app.use("*", (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `Endpoint ${req.originalUrl} not found on Doctor Tracker API.`,
  });
});

// 12. Centralized Error Handler
app.use(errorHandler);

// 13. Start Server & Graceful Shutdown
let server: ReturnType<typeof app.listen> | undefined;

if (process.env.NODE_ENV !== "test") {
  server = app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`  🩺 Doctor Tracker REST API Server Active`);
    console.log(`  🌐 Port: ${PORT}`);
    console.log(`  🏥 Mode: ${env.NODE_ENV}`);
    console.log(`====================================================`);
  });

  const handleShutdown = async (signal: string) => {
    console.log(`[Server] Received ${signal}. Commencing graceful shutdown...`);
    if (server) {
      server.close(async () => {
        console.log("[Server] HTTP server stopped.");
        await disconnectDB();
        process.exit(0);
      });
    } else {
      await disconnectDB();
      process.exit(0);
    }
  };

  process.on("SIGINT", () => handleShutdown("SIGINT"));
  process.on("SIGTERM", () => handleShutdown("SIGTERM"));
}

export default app;

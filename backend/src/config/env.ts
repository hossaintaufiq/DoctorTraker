import dotenv from "dotenv";

dotenv.config();

export interface EnvConfig {
  PORT: number;
  NODE_ENV: string;
  MONGODB_URI: string;
  JWT_SECRET: string;
  JWT_REFRESH_SECRET: string;
  JWT_ACCESS_EXPIRES_IN: string;
  JWT_REFRESH_EXPIRES_IN: string;
  CORS_ORIGIN: string;
  ALLOWED_ORIGINS: string[];
  ALLOW_DB_RESET: boolean;
  COOKIE_SECURE: boolean;
  COOKIE_SAME_SITE: "lax" | "strict" | "none";
}

export function validateEnv(): EnvConfig {
  const NODE_ENV = process.env.NODE_ENV || "development";
  const PORT = parseInt(process.env.PORT || "5000", 10);
  const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/doctor_tracker";

  const JWT_SECRET = process.env.JWT_SECRET;
  if (!JWT_SECRET || JWT_SECRET.trim().length < 32) {
    throw new Error(
      "[Security Startup Error] JWT_SECRET must be defined and at least 32 characters long. Set a high-entropy secret in your environment."
    );
  }

  const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
  if (!JWT_REFRESH_SECRET || JWT_REFRESH_SECRET.trim().length < 32) {
    throw new Error(
      "[Security Startup Error] JWT_REFRESH_SECRET must be defined and at least 32 characters long. Set a high-entropy secret in your environment."
    );
  }

  const JWT_ACCESS_EXPIRES_IN = process.env.JWT_ACCESS_EXPIRES_IN || "15m";
  const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || "7d";

  const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:3000";
  const ALLOWED_ORIGINS = CORS_ORIGIN.split(",")
    .map((o) => o.trim().replace(/\/$/, ""))
    .filter(Boolean);

  const ALLOW_DB_RESET = process.env.ALLOW_DB_RESET === "true";
  const COOKIE_SECURE =
    process.env.COOKIE_SECURE === "true" || NODE_ENV === "production";

  const defaultSameSite = NODE_ENV === "production" ? "none" : "lax";
  const sameSiteRaw = (process.env.COOKIE_SAME_SITE || defaultSameSite).toLowerCase();
  const COOKIE_SAME_SITE: "lax" | "strict" | "none" =
    sameSiteRaw === "none" ? "none" : sameSiteRaw === "strict" ? "strict" : "lax";

  return {
    PORT,
    NODE_ENV,
    MONGODB_URI,
    JWT_SECRET,
    JWT_REFRESH_SECRET,
    JWT_ACCESS_EXPIRES_IN,
    JWT_REFRESH_EXPIRES_IN,
    CORS_ORIGIN,
    ALLOWED_ORIGINS,
    ALLOW_DB_RESET,
    COOKIE_SECURE,
    COOKIE_SAME_SITE,
  };
}

export const env = validateEnv();

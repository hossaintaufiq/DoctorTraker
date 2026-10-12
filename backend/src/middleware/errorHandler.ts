import { Request, Response, NextFunction } from "express";
import { env } from "../config/env.js";

export interface CustomError extends Error {
  statusCode?: number;
  code?: number;
  errors?: Record<string, { message: string }>;
}

export function errorHandler(
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  let error = { ...err };
  error.message = err.message;

  if (env.NODE_ENV !== "production") {
    console.error(`[Server Error] ${err.name}: ${err.message}`, err.stack);
  } else {
    console.error(`[Server Error] ${err.name}: ${err.message}`);
  }

  // Mongoose bad ObjectId
  if (err.name === "CastError") {
    const message = "Resource not found with specified identifier format.";
    error = new Error(message) as CustomError;
    error.statusCode = 400; // Invalid ObjectId format should be 400 Bad Request
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const message = "Duplicate field value entered. A record with this unique attribute already exists.";
    error = new Error(message) as CustomError;
    error.statusCode = 400;
  }

  // Mongoose validation error
  if (err.name === "ValidationError" && err.errors) {
    const message = Object.values(err.errors)
      .map((val) => val.message)
      .join(", ");
    error = new Error(message) as CustomError;
    error.statusCode = 400;
  }

  const statusCode = error.statusCode || 500;
  const isProd = env.NODE_ENV === "production";

  res.status(statusCode).json({
    success: false,
    message: error.message || "Internal Server Error in Healthcare API Layer",
    ...(isProd ? {} : { stack: err.stack }),
  });
}

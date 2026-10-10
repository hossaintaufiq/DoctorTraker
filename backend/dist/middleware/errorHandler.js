"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
function errorHandler(err, req, res, next) {
    let error = { ...err };
    error.message = err.message;
    console.error(`[Server Error] ${err.name}: ${err.message}`, err.stack);
    // Mongoose bad ObjectId
    if (err.name === "CastError") {
        const message = "Resource not found with specified identifier format.";
        error = new Error(message);
        error.statusCode = 404;
    }
    // Mongoose duplicate key error
    if (err.code === 11000) {
        const message = "Duplicate field value entered. A record with this unique attribute already exists.";
        error = new Error(message);
        error.statusCode = 400;
    }
    // Mongoose validation error
    if (err.name === "ValidationError" && err.errors) {
        const message = Object.values(err.errors)
            .map((val) => val.message)
            .join(", ");
        error = new Error(message);
        error.statusCode = 400;
    }
    res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Internal Server Error in Healthcare API Layer",
    });
}

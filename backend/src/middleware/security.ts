import { Request, Response, NextFunction } from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";

/**
 * Global Security & Hardening Suite for Doctor Tracker API
 */

// 1. Recursive NoSQL Injection Sanitizer
export function sanitizeNoSql(req: Request, res: Response, next: NextFunction): void {
  const clean = (obj: any): any => {
    if (!obj || typeof obj !== "object") return obj;

    if (Array.isArray(obj)) {
      return obj.map(clean);
    }

    const sanitized: Record<string, any> = {};
    for (const key of Object.keys(obj)) {
      // Strip dangerous MongoDB query operator keys starting with '$' or containing '.'
      if (!key.startsWith("$") && !key.includes(".")) {
        sanitized[key] = clean(obj[key]);
      }
    }
    return sanitized;
  };

  if (req.body) req.body = clean(req.body);
  if (req.query) req.query = clean(req.query);
  if (req.params) req.params = clean(req.params);

  next();
}

// 2. Global API Rate Limiter: 400 requests per 15 minutes per IP
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 400,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests from this IP address. Rate limit exceeded. Please try again in 15 minutes.",
  },
});

// 3. Strict Authentication Rate Limiter: 20 login attempts per 15 minutes per IP
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many authentication attempts. Please wait 15 minutes before retrying.",
  },
});

// 4. API-appropriate Helmet Security Headers Config
// Since this is a JSON REST API, disable HTML-specific Content-Security-Policy
// and enforce strict transport, sniffing, frame, and referrer protections.
export const helmetSecurity = helmet({
  contentSecurityPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" },
  dnsPrefetchControl: { allow: false },
  frameguard: { action: "deny" },
  hidePoweredBy: true,
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
  ieNoOpen: true,
  noSniff: true,
  referrerPolicy: { policy: "no-referrer" },
  xssFilter: true,
});

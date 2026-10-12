import { Router, Request, Response, NextFunction } from "express";
import {
  register,
  login,
  refresh,
  logout,
  getMe,
} from "../controllers/authController.js";
import { protect, authorizeRoles } from "../middleware/auth.js";
import { authLimiter } from "../middleware/security.js";

const router = Router();

// Enforce no-store on all auth endpoints
router.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0");
  res.setHeader("Pragma", "no-cache");
  next();
});

router.post("/login", authLimiter, login);
router.post("/refresh", authLimiter, refresh);
router.post("/logout", logout);
router.get("/me", protect, getMe);
router.post("/register", protect, authorizeRoles("admin"), register);

export default router;

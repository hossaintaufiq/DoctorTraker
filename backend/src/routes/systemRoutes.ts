import { Router } from "express";
import { resetDatabase } from "../controllers/systemController.js";

const router = Router();

router.post("/reset-database", resetDatabase);

export default router;

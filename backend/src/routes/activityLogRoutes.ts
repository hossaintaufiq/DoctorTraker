import { Router } from "express";
import {
  getActivityLogs,
  createActivityLog,
  clearActivityLogs,
} from "../controllers/activityLogController.js";

const router = Router();

router.route("/")
  .get(getActivityLogs)
  .post(createActivityLog)
  .delete(clearActivityLogs);

export default router;

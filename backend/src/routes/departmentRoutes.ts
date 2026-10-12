import { Router } from "express";
import {
  getDepartments,
  getDepartmentById,
  createDepartment,
} from "../controllers/departmentController.js";
import { authorizeRoles } from "../middleware/auth.js";

const router = Router();

router.route("/")
  .get(getDepartments)
  .post(authorizeRoles("admin"), createDepartment);

router.route("/:id")
  .get(getDepartmentById);

export default router;

import { Router } from "express";
import {
  getDepartments,
  getDepartmentById,
  createDepartment,
} from "../controllers/departmentController.js";

const router = Router();

router.route("/")
  .get(getDepartments)
  .post(createDepartment);

router.route("/:id")
  .get(getDepartmentById);

export default router;

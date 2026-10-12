import { Router } from "express";
import {
  getPatients,
  getPatientById,
  createPatient,
  updatePatient,
  deletePatient,
} from "../controllers/patientController.js";
import { authorizeRoles } from "../middleware/auth.js";

const router = Router();

router.route("/")
  .get(getPatients)
  .post(authorizeRoles("admin", "doctor"), createPatient);

router.route("/:id")
  .get(getPatientById)
  .put(authorizeRoles("admin", "doctor"), updatePatient)
  .patch(authorizeRoles("admin", "doctor"), updatePatient)
  .delete(authorizeRoles("admin"), deletePatient);

export default router;

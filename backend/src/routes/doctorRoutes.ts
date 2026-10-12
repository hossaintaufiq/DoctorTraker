import { Router } from "express";
import {
  getDoctors,
  getDoctorById,
  createDoctor,
  updateDoctor,
  deleteDoctor,
  addPatientUnderDoctor,
  removePatientFromDoctor,
} from "../controllers/doctorController.js";
import { authorizeRoles } from "../middleware/auth.js";

const router = Router();

router.route("/")
  .get(getDoctors)
  .post(authorizeRoles("admin"), createDoctor);

router.route("/:id")
  .get(getDoctorById)
  .put(authorizeRoles("admin"), updateDoctor)
  .patch(authorizeRoles("admin"), updateDoctor)
  .delete(authorizeRoles("admin"), deleteDoctor);

router.route("/:id/patients")
  .post(authorizeRoles("admin", "doctor"), addPatientUnderDoctor);

router.route("/:id/patients/:patientId")
  .delete(authorizeRoles("admin", "doctor"), removePatientFromDoctor);

export default router;

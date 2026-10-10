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

const router = Router();

router.route("/")
  .get(getDoctors)
  .post(createDoctor);

router.route("/:id")
  .get(getDoctorById)
  .put(updateDoctor)
  .patch(updateDoctor)
  .delete(deleteDoctor);

router.route("/:id/patients")
  .post(addPatientUnderDoctor);

router.route("/:id/patients/:patientId")
  .delete(removePatientFromDoctor);

export default router;

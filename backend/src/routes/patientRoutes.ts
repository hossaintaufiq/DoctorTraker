import { Router } from "express";
import {
  getPatients,
  getPatientById,
  createPatient,
  updatePatient,
  deletePatient,
} from "../controllers/patientController.js";

const router = Router();

router.route("/")
  .get(getPatients)
  .post(createPatient);

router.route("/:id")
  .get(getPatientById)
  .put(updatePatient)
  .delete(deletePatient);

export default router;

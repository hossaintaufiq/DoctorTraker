"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const patientController_js_1 = require("../controllers/patientController.js");
const router = (0, express_1.Router)();
router.route("/")
    .get(patientController_js_1.getPatients)
    .post(patientController_js_1.createPatient);
router.route("/:id")
    .get(patientController_js_1.getPatientById)
    .put(patientController_js_1.updatePatient)
    .patch(patientController_js_1.updatePatient)
    .delete(patientController_js_1.deletePatient);
exports.default = router;

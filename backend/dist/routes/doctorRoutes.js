"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const doctorController_js_1 = require("../controllers/doctorController.js");
const router = (0, express_1.Router)();
router.route("/")
    .get(doctorController_js_1.getDoctors)
    .post(doctorController_js_1.createDoctor);
router.route("/:id")
    .get(doctorController_js_1.getDoctorById)
    .put(doctorController_js_1.updateDoctor)
    .patch(doctorController_js_1.updateDoctor)
    .delete(doctorController_js_1.deleteDoctor);
router.route("/:id/patients")
    .post(doctorController_js_1.addPatientUnderDoctor);
router.route("/:id/patients/:patientId")
    .delete(doctorController_js_1.removePatientFromDoctor);
exports.default = router;

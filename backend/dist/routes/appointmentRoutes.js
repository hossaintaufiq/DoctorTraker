"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const appointmentController_js_1 = require("../controllers/appointmentController.js");
const router = (0, express_1.Router)();
router.route("/")
    .get(appointmentController_js_1.getAppointments)
    .post(appointmentController_js_1.createAppointment);
router.route("/:id/status")
    .patch(appointmentController_js_1.updateAppointmentStatus);
router.route("/:id")
    .delete(appointmentController_js_1.cancelAppointment);
exports.default = router;

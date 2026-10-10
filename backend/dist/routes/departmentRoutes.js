"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const departmentController_js_1 = require("../controllers/departmentController.js");
const router = (0, express_1.Router)();
router.route("/")
    .get(departmentController_js_1.getDepartments)
    .post(departmentController_js_1.createDepartment);
router.route("/:id")
    .get(departmentController_js_1.getDepartmentById);
exports.default = router;

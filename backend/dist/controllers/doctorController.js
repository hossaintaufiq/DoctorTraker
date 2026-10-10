"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDoctors = getDoctors;
exports.getDoctorById = getDoctorById;
exports.createDoctor = createDoctor;
exports.updateDoctor = updateDoctor;
exports.deleteDoctor = deleteDoctor;
exports.addPatientUnderDoctor = addPatientUnderDoctor;
exports.removePatientFromDoctor = removePatientFromDoctor;
const Doctor_js_1 = require("../models/Doctor.js");
const Patient_js_1 = require("../models/Patient.js");
// @desc    Get all doctors with search, filtering, and pagination
// @route   GET /api/doctors
// @access  Public or Protected
async function getDoctors(req, res, next) {
    try {
        const { search, specialty, status, hospital, page = 1, limit = 10, sortBy = "createdAt", order = "desc", startDate, endDate, } = req.query;
        const query = {};
        // Search query
        if (search && typeof search === "string" && search.trim() !== "") {
            const searchRegex = new RegExp(search.trim(), "i");
            query.$or = [
                { name: searchRegex },
                { specialty: searchRegex },
                { email: searchRegex },
                { roomNumber: searchRegex },
                { phone: searchRegex },
                { hospital: searchRegex },
            ];
        }
        // Filter by Specialty
        if (specialty && specialty !== "All") {
            query.specialty = specialty;
        }
        // Filter by Status
        if (status && status !== "All") {
            query.status = status;
        }
        // Filter by Hospital
        if (hospital && hospital !== "All") {
            query.hospital = hospital;
        }
        // Date range filter
        if (startDate || endDate) {
            query.createdAt = {};
            if (startDate)
                query.createdAt.$gte = new Date(startDate);
            if (endDate)
                query.createdAt.$lte = new Date(endDate);
        }
        const pageNum = Math.max(1, parseInt(page) || 1);
        const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 10));
        const skip = (pageNum - 1) * limitNum;
        const sortOption = {
            [sortBy]: order === "asc" ? 1 : -1,
        };
        const [doctors, total] = await Promise.all([
            Doctor_js_1.Doctor.find(query).sort(sortOption).skip(skip).limit(limitNum).lean(),
            Doctor_js_1.Doctor.countDocuments(query),
        ]);
        // Recalculate dynamic patient count for each doctor
        const doctorIds = doctors.map((d) => d._id);
        const patientCounts = await Patient_js_1.Patient.aggregate([
            { $match: { assignedDoctor: { $in: doctorIds } } },
            { $group: { _id: "$assignedDoctor", count: { $sum: 1 } } },
        ]);
        const countMap = new Map(patientCounts.map((pc) => [pc._id.toString(), pc.count]));
        const enrichedDoctors = doctors.map((doc) => ({
            ...doc,
            patientCount: countMap.get(doc._id.toString()) || doc.patientCount || 0,
        }));
        res.status(200).json({
            success: true,
            count: enrichedDoctors.length,
            total,
            totalPages: Math.ceil(total / limitNum),
            currentPage: pageNum,
            data: enrichedDoctors,
        });
    }
    catch (error) {
        next(error);
    }
}
// @desc    Get single doctor by ID with corresponding patients
// @route   GET /api/doctors/:id
// @access  Public or Protected
async function getDoctorById(req, res, next) {
    try {
        const doctor = await Doctor_js_1.Doctor.findById(req.params.id);
        if (!doctor) {
            res.status(404).json({
                success: false,
                message: "Doctor not found with the requested identifier.",
            });
            return;
        }
        // Fetch corresponding patients for this doctor
        const patients = await Patient_js_1.Patient.find({ assignedDoctor: doctor._id })
            .sort({ createdAt: -1 })
            .lean();
        const enrichedDoctor = {
            ...doctor.toObject(),
            patientCount: patients.length,
            patients,
        };
        res.status(200).json({
            success: true,
            data: enrichedDoctor,
        });
    }
    catch (error) {
        next(error);
    }
}
// @desc    Create a new doctor
// @route   POST /api/doctors
// @access  Protected (Admin)
async function createDoctor(req, res, next) {
    try {
        const { name, specialty, email, phone, roomNumber, hospital, maxPatients, experienceYears, status, biography, avatar, } = req.body;
        const existingDoctor = await Doctor_js_1.Doctor.findOne({ email });
        if (existingDoctor) {
            res.status(400).json({
                success: false,
                message: "A physician record with this email address already exists.",
            });
            return;
        }
        const doctor = await Doctor_js_1.Doctor.create({
            name,
            specialty,
            email,
            phone,
            roomNumber,
            hospital: hospital || "Doctor Tracker Medical Center",
            maxPatients: maxPatients || 300,
            experienceYears: experienceYears || 5,
            status: status || "Active",
            biography: biography ||
                `${specialty} specialist with ${experienceYears || 5} years clinical experience.`,
            avatar,
        });
        res.status(201).json({
            success: true,
            message: "Doctor record created successfully.",
            data: doctor,
        });
    }
    catch (error) {
        next(error);
    }
}
// @desc    Update a doctor
// @route   PUT /api/doctors/:id
// @access  Protected (Admin)
async function updateDoctor(req, res, next) {
    try {
        const doctor = await Doctor_js_1.Doctor.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!doctor) {
            res.status(404).json({
                success: false,
                message: "Doctor not found.",
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: "Doctor updated successfully.",
            data: doctor,
        });
    }
    catch (error) {
        next(error);
    }
}
// @desc    Delete a doctor
// @route   DELETE /api/doctors/:id
// @access  Protected (Admin)
async function deleteDoctor(req, res, next) {
    try {
        const doctor = await Doctor_js_1.Doctor.findById(req.params.id);
        if (!doctor) {
            res.status(404).json({
                success: false,
                message: "Doctor not found.",
            });
            return;
        }
        // Check if doctor has assigned patients
        const patientCount = await Patient_js_1.Patient.countDocuments({ assignedDoctor: doctor._id });
        if (patientCount > 0) {
            // Reassign patients or handle accordingly
            console.log(`[Doctor Deletion] Reassigning/archiving ${patientCount} patients.`);
        }
        await doctor.deleteOne();
        res.status(200).json({
            success: true,
            message: "Doctor record deleted successfully from directory.",
        });
    }
    catch (error) {
        next(error);
    }
}
// @desc    Add a patient under a specific doctor
// @route   POST /api/doctors/:id/patients
// @access  Protected
async function addPatientUnderDoctor(req, res, next) {
    try {
        const doctor = await Doctor_js_1.Doctor.findById(req.params.id);
        if (!doctor) {
            res.status(404).json({
                success: false,
                message: "Target doctor not found.",
            });
            return;
        }
        const { name, age, gender, condition, bloodGroup, phone, email, notes, status, } = req.body;
        const patient = await Patient_js_1.Patient.create({
            name,
            age,
            gender,
            assignedDoctor: doctor._id,
            assignedDoctorName: doctor.name,
            condition: condition || "General",
            bloodGroup: bloodGroup || "O+",
            phone,
            email,
            notes,
            status: status || "Outpatient",
        });
        // Increment doctor patientCount
        await Doctor_js_1.Doctor.findByIdAndUpdate(doctor._id, { $inc: { patientCount: 1 } });
        res.status(201).json({
            success: true,
            message: `Patient registered under ${doctor.name} successfully.`,
            data: patient,
        });
    }
    catch (error) {
        next(error);
    }
}
// @desc    Delete/Remove a patient from doctor's patient list
// @route   DELETE /api/doctors/:id/patients/:patientId
// @access  Protected
async function removePatientFromDoctor(req, res, next) {
    try {
        const { id: doctorId, patientId } = req.params;
        const patient = await Patient_js_1.Patient.findOne({
            _id: patientId,
            assignedDoctor: doctorId,
        });
        if (!patient) {
            res.status(404).json({
                success: false,
                message: "Patient not found under this physician.",
            });
            return;
        }
        await patient.deleteOne();
        // Decrement doctor patient count
        await Doctor_js_1.Doctor.findByIdAndUpdate(doctorId, { $inc: { patientCount: -1 } });
        res.status(200).json({
            success: true,
            message: "Patient removed from doctor list successfully.",
        });
    }
    catch (error) {
        next(error);
    }
}

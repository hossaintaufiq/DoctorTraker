import { Request, Response, NextFunction } from "express";
import { Patient } from "../models/Patient.js";
import { Doctor } from "../models/Doctor.js";
import { escapeRegex, buildDateRangeQuery } from "../validations/common.js";

// Allowed sort fields for patient listing
const ALLOWED_PATIENT_SORTS = new Set([
  "createdAt",
  "registrationDate",
  "name",
  "age",
  "lastVisit",
  "condition",
  "status",
]);

// @desc    Get all patients with search, filtering, and pagination
// @route   GET /api/patients
// @access  Protected
export async function getPatients(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const {
      search,
      condition,
      status,
      bloodGroup,
      doctorId,
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      order = "desc",
      startDate,
      endDate,
    } = req.query as Record<string, any>;

    const query: Record<string, any> = {};

    // Safe escaped regex search by name, patientCode, phone, email, doctor name
    if (search && typeof search === "string" && search.trim() !== "") {
      const escaped = escapeRegex(search.trim());
      const searchRegex = new RegExp(escaped, "i");
      query.$or = [
        { name: searchRegex },
        { patientCode: searchRegex },
        { phone: searchRegex },
        { email: searchRegex },
        { assignedDoctorName: searchRegex },
      ];
    }

    // Filter by Condition
    if (condition && condition !== "All") {
      query.condition = condition;
    }

    // Filter by Status
    if (status && status !== "All") {
      query.status = status;
    }

    // Filter by Blood Group
    if (bloodGroup && bloodGroup !== "All") {
      query.bloodGroup = bloodGroup;
    }

    // Filter by Doctor
    if (doctorId && doctorId !== "All") {
      query.assignedDoctor = doctorId;
    }

    // Inclusive UTC Date-wise filtering on registrationDate
    const dateRange = buildDateRangeQuery(startDate, endDate);
    if (dateRange) {
      query.registrationDate = dateRange;
    }

    const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit as string, 10) || 10));
    const skip = (pageNum - 1) * limitNum;

    const validatedSort = ALLOWED_PATIENT_SORTS.has(sortBy as string)
      ? (sortBy as string)
      : "createdAt";

    const sortOption: Record<string, 1 | -1> = {
      [validatedSort]: order === "asc" ? 1 : -1,
    };

    const [patients, total] = await Promise.all([
      Patient.find(query)
        .populate("assignedDoctor", "name specialty roomNumber email hospital")
        .sort(sortOption)
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Patient.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      count: patients.length,
      total,
      totalPages: Math.ceil(total / limitNum) || 1,
      currentPage: pageNum,
      data: patients,
    });
  } catch (error) {
    next(error);
  }
}

// @desc    Get single patient chart by ID
// @route   GET /api/patients/:id
// @access  Protected
export async function getPatientById(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const patient = await Patient.findById(req.params.id)
      .populate("assignedDoctor", "name specialty email phone roomNumber hospital")
      .lean();

    if (!patient) {
      res.status(404).json({
        success: false,
        message: "Patient chart not found.",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: patient,
    });
  } catch (error) {
    next(error);
  }
}

// @desc    Create/Register a new patient
// @route   POST /api/patients
// @access  Protected (Admin, Doctor)
export async function createPatient(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const {
      name,
      age,
      gender,
      assignedDoctorId,
      condition,
      status,
      bloodGroup,
      phone,
      email,
      notes,
    } = req.body;

    // Strict validation: Verify assigned doctor exists
    const doctor = await Doctor.findById(assignedDoctorId);
    if (!doctor) {
      res.status(400).json({
        success: false,
        message: "Assigned doctor with specified ID does not exist in the directory.",
      });
      return;
    }

    const patient = await Patient.create({
      name: name.trim(),
      age,
      gender,
      assignedDoctor: doctor._id,
      assignedDoctorName: doctor.name,
      condition: condition || "General",
      status: status || "Outpatient",
      bloodGroup: bloodGroup || "O+",
      phone: phone.trim(),
      email: email ? email.trim().toLowerCase() : `${name.toLowerCase().replace(/\s+/g, ".")}@example.com`,
      notes: notes || "Initial clinical evaluation completed.",
    });

    // Atomically increment doctor's patient count
    await Doctor.findByIdAndUpdate(doctor._id, { $inc: { patientCount: 1 } });

    res.status(201).json({
      success: true,
      message: "Patient registered successfully.",
      data: patient,
    });
  } catch (error) {
    next(error);
  }
}

// @desc    Edit/Update patient information
// @route   PUT /api/patients/:id
// @access  Protected (Admin, Doctor)
export async function updatePatient(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const patient = await Patient.findById(req.params.id);

    if (!patient) {
      res.status(404).json({
        success: false,
        message: "Patient record not found.",
      });
      return;
    }

    // Handle doctor reassignment atomically
    if (
      req.body.assignedDoctorId &&
      req.body.assignedDoctorId !== patient.assignedDoctor.toString()
    ) {
      const newDoctor = await Doctor.findById(req.body.assignedDoctorId);
      if (!newDoctor) {
        res.status(400).json({
          success: false,
          message: "New assigned doctor does not exist.",
        });
        return;
      }

      // Decrement previous doctor & increment new doctor
      await Promise.all([
        Doctor.findByIdAndUpdate(patient.assignedDoctor, { $inc: { patientCount: -1 } }),
        Doctor.findByIdAndUpdate(newDoctor._id, { $inc: { patientCount: 1 } }),
      ]);

      req.body.assignedDoctor = newDoctor._id;
      req.body.assignedDoctorName = newDoctor.name;
    }

    const updatedPatient = await Patient.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "Patient chart updated successfully.",
      data: updatedPatient,
    });
  } catch (error) {
    next(error);
  }
}

// @desc    Delete patient record
// @route   DELETE /api/patients/:id
// @access  Protected (Admin only)
export async function deletePatient(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const patient = await Patient.findById(req.params.id);

    if (!patient) {
      res.status(404).json({
        success: false,
        message: "Patient record not found.",
      });
      return;
    }

    const doctorId = patient.assignedDoctor;
    await patient.deleteOne();

    // Atomically decrement doctor's patient count
    if (doctorId) {
      await Doctor.findByIdAndUpdate(doctorId, { $inc: { patientCount: -1 } });
    }

    res.status(200).json({
      success: true,
      message: "Patient record deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
}

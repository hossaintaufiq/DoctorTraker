import { Request, Response, NextFunction } from "express";
import { Patient } from "../models/Patient.js";
import { Doctor } from "../models/Doctor.js";

// @desc    Get all patients with search, filtering, and pagination
// @route   GET /api/patients
// @access  Public or Protected
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
    } = req.query;

    const query: Record<string, any> = {};

    // Search by name, patientCode, phone, email, doctor name
    if (search && typeof search === "string" && search.trim() !== "") {
      const searchRegex = new RegExp(search.trim(), "i");
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

    // Date-wise filtering
    if (startDate || endDate) {
      query.registrationDate = {};
      if (startDate) query.registrationDate.$gte = new Date(startDate as string);
      if (endDate) query.registrationDate.$lte = new Date(endDate as string);
    }

    const pageNum = Math.max(1, parseInt(page as string) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit as string) || 10));
    const skip = (pageNum - 1) * limitNum;

    const sortOption: Record<string, 1 | -1> = {
      [sortBy as string]: order === "asc" ? 1 : -1,
    };

    const [patients, total] = await Promise.all([
      Patient.find(query)
        .populate("assignedDoctor", "name specialty roomNumber email")
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
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      data: patients,
    });
  } catch (error) {
    next(error);
  }
}

// @desc    Get single patient chart by ID
// @route   GET /api/patients/:id
// @access  Public or Protected
export async function getPatientById(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const patient = await Patient.findById(req.params.id).populate(
      "assignedDoctor",
      "name specialty email phone roomNumber hospital"
    );

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
// @access  Protected
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

    // Resolve assigned doctor
    let doctor = await Doctor.findById(assignedDoctorId);
    if (!doctor) {
      // Fallback to first available doctor
      doctor = await Doctor.findOne();
      if (!doctor) {
        res.status(400).json({
          success: false,
          message: "Cannot register patient without an active physician in the system.",
        });
        return;
      }
    }

    const patient = await Patient.create({
      name,
      age,
      gender,
      assignedDoctor: doctor._id,
      assignedDoctorName: doctor.name,
      condition: condition || "General",
      status: status || "Outpatient",
      bloodGroup: bloodGroup || "O+",
      phone,
      email: email || `${name.toLowerCase().replace(/\s+/g, ".")}@example.com`,
      notes: notes || "Initial clinical evaluation completed.",
    });

    // Update doctor's patient count
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
// @access  Protected
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

    // Check if doctor reassignment occurred
    if (
      req.body.assignedDoctorId &&
      req.body.assignedDoctorId !== patient.assignedDoctor.toString()
    ) {
      const newDoctor = await Doctor.findById(req.body.assignedDoctorId);
      if (newDoctor) {
        // Decrement previous doctor
        await Doctor.findByIdAndUpdate(patient.assignedDoctor, {
          $inc: { patientCount: -1 },
        });
        // Increment new doctor
        await Doctor.findByIdAndUpdate(newDoctor._id, {
          $inc: { patientCount: 1 },
        });

        req.body.assignedDoctor = newDoctor._id;
        req.body.assignedDoctorName = newDoctor.name;
      }
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
// @access  Protected
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

    // Decrement doctor's patient count
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

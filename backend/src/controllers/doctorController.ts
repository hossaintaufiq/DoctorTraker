import { Request, Response, NextFunction } from "express";
import { Doctor } from "../models/Doctor.js";
import { Patient } from "../models/Patient.js";
import { escapeRegex, buildDateRangeQuery } from "../validations/common.js";

// Allowed sort fields for doctor listing
const ALLOWED_DOCTOR_SORTS = new Set([
  "createdAt",
  "name",
  "specialty",
  "patientCount",
  "experienceYears",
  "status",
]);

// @desc    Get all doctors with search, filtering, and pagination
// @route   GET /api/doctors
// @access  Protected
export async function getDoctors(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const {
      search,
      specialty,
      status,
      hospital,
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      order = "desc",
      startDate,
      endDate,
    } = req.query as Record<string, any>;

    const query: Record<string, any> = {};

    // Safe escaped regex search across core doctor fields
    if (search && typeof search === "string" && search.trim() !== "") {
      const escaped = escapeRegex(search.trim());
      const searchRegex = new RegExp(escaped, "i");
      query.$or = [
        { name: searchRegex },
        { specialty: searchRegex },
        { email: searchRegex },
        { hospital: searchRegex },
        { roomNumber: searchRegex },
        { phone: searchRegex },
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

    // Inclusive UTC Date range filter
    const dateRange = buildDateRangeQuery(startDate, endDate);
    if (dateRange) {
      query.createdAt = dateRange;
    }

    const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit as string, 10) || 10));
    const skip = (pageNum - 1) * limitNum;

    const validatedSort = ALLOWED_DOCTOR_SORTS.has(sortBy as string)
      ? (sortBy as string)
      : "createdAt";

    const sortOption: Record<string, 1 | -1> = {
      [validatedSort]: order === "asc" ? 1 : -1,
    };

    const [doctors, total] = await Promise.all([
      Doctor.find(query)
        .sort(sortOption)
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Doctor.countDocuments(query),
    ]);

    // Recalculate dynamic patient count for each returned doctor to maintain consistency
    const doctorIds = doctors.map((d) => d._id);
    const patientCounts = await Patient.aggregate([
      { $match: { assignedDoctor: { $in: doctorIds } } },
      { $group: { _id: "$assignedDoctor", count: { $sum: 1 } } },
    ]);

    const countMap = new Map(
      patientCounts.map((pc) => [pc._id.toString(), pc.count])
    );

    const enrichedDoctors = doctors.map((doc) => ({
      ...doc,
      id: doc._id.toString(),
      patientCount: countMap.get(doc._id.toString()) ?? doc.patientCount ?? 0,
    }));

    res.status(200).json({
      success: true,
      count: enrichedDoctors.length,
      total,
      totalPages: Math.ceil(total / limitNum) || 1,
      currentPage: pageNum,
      data: enrichedDoctors,
    });
  } catch (error) {
    next(error);
  }
}

// @desc    Get single doctor by ID with corresponding patients
// @route   GET /api/doctors/:id
// @access  Protected
export async function getDoctorById(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const doctor = await Doctor.findById(req.params.id).lean();

    if (!doctor) {
      res.status(404).json({
        success: false,
        message: "Doctor not found with the requested identifier.",
      });
      return;
    }

    // Fetch corresponding patients for this doctor
    const patients = await Patient.find({ assignedDoctor: doctor._id })
      .sort({ createdAt: -1 })
      .lean();

    const enrichedDoctor = {
      ...doctor,
      patientCount: patients.length,
      patients,
    };

    res.status(200).json({
      success: true,
      data: enrichedDoctor,
    });
  } catch (error) {
    next(error);
  }
}

// @desc    Create a new doctor
// @route   POST /api/doctors
// @access  Protected (Admin)
export async function createDoctor(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const {
      name,
      specialty,
      specialization,
      email,
      phone,
      roomNumber,
      hospital,
      maxPatients,
      experienceYears,
      status,
      biography,
      avatar,
    } = req.body;

    const normalizedEmail = String(email).trim().toLowerCase();
    const existingDoctor = await Doctor.findOne({ email: normalizedEmail });
    if (existingDoctor) {
      res.status(400).json({
        success: false,
        message: "A physician record with this email address already exists.",
      });
      return;
    }

    const doctorSpecialty = (specialty || specialization || "").trim();

    const doctor = await Doctor.create({
      name: name.trim(),
      specialty: doctorSpecialty,
      email: normalizedEmail,
      phone: phone.trim(),
      roomNumber: (roomNumber || "Room 101").trim(),
      hospital: hospital || "Doctor Tracker Medical Center",
      maxPatients: maxPatients || 300,
      experienceYears: experienceYears ?? 5,
      status: status || "Active",
      biography:
        biography ||
        `${doctorSpecialty} specialist with ${experienceYears ?? 5} years clinical experience.`,
      avatar: avatar || "",
    });

    res.status(201).json({
      success: true,
      message: "Doctor record created successfully.",
      data: doctor,
    });
  } catch (error) {
    next(error);
  }
}

// @desc    Update a doctor
// @route   PUT /api/doctors/:id
// @access  Protected (Admin)
export async function updateDoctor(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (req.body.email) {
      req.body.email = String(req.body.email).trim().toLowerCase();
    }

    const doctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, {
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
  } catch (error) {
    next(error);
  }
}

// @desc    Delete a doctor
// @route   DELETE /api/doctors/:id
// @access  Protected (Admin)
export async function deleteDoctor(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const doctor = await Doctor.findById(req.params.id);

    if (!doctor) {
      res.status(404).json({
        success: false,
        message: "Doctor not found.",
      });
      return;
    }

    // Delete associated patients under this doctor
    await Patient.deleteMany({ assignedDoctor: doctor._id });
    await doctor.deleteOne();

    res.status(200).json({
      success: true,
      message: "Doctor record and assigned patient relationships removed successfully.",
    });
  } catch (error) {
    next(error);
  }
}

// @desc    Add a patient under a specific doctor
// @route   POST /api/doctors/:id/patients
// @access  Protected (Admin, Doctor)
export async function addPatientUnderDoctor(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      res.status(404).json({
        success: false,
        message: "Target physician not found.",
      });
      return;
    }

    const {
      name,
      age,
      gender,
      condition,
      bloodGroup,
      phone,
      email,
      notes,
      status,
    } = req.body;

    const patient = await Patient.create({
      name: name.trim(),
      age,
      gender,
      assignedDoctor: doctor._id,
      assignedDoctorName: doctor.name,
      condition: condition || "General",
      bloodGroup: bloodGroup || "O+",
      phone: phone.trim(),
      email: email ? email.trim().toLowerCase() : `${name.toLowerCase().replace(/\s+/g, ".")}@example.com`,
      notes: notes || "Initial clinical evaluation completed.",
      status: status || "Outpatient",
    });

    // Atomically increment doctor patientCount
    await Doctor.findByIdAndUpdate(doctor._id, { $inc: { patientCount: 1 } });

    res.status(201).json({
      success: true,
      message: `Patient registered under ${doctor.name} successfully.`,
      data: patient,
    });
  } catch (error) {
    next(error);
  }
}

// @desc    Delete/Remove a patient from doctor's patient list
// @route   DELETE /api/doctors/:id/patients/:patientId
// @access  Protected (Admin, Doctor)
export async function removePatientFromDoctor(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id: doctorId, patientId } = req.params;

    const patient = await Patient.findOne({
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

    // Atomically decrement doctor patientCount
    await Doctor.findByIdAndUpdate(doctorId, { $inc: { patientCount: -1 } });

    res.status(200).json({
      success: true,
      message: "Patient removed from doctor list successfully.",
    });
  } catch (error) {
    next(error);
  }
}

// @desc    Get paginated patients under a specific doctor
// @route   GET /api/doctors/:id/patients
// @access  Protected
export async function getDoctorPatients(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      res.status(404).json({
        success: false,
        message: "Doctor not found.",
      });
      return;
    }

    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 10));
    const skip = (page - 1) * limit;

    const query: any = { assignedDoctor: doctor._id };
    if (req.query.search && typeof req.query.search === "string" && req.query.search.trim()) {
      const q = req.query.search.trim();
      const escaped = escapeRegex(q);
      query.$or = [
        { name: { $regex: escaped, $options: "i" } },
        { patientCode: { $regex: escaped, $options: "i" } },
        { condition: { $regex: escaped, $options: "i" } },
      ];
    }
    if (req.query.condition && req.query.condition !== "All") {
      query.condition = req.query.condition;
    }
    if (req.query.status && req.query.status !== "All") {
      query.status = req.query.status;
    }

    const [patients, total] = await Promise.all([
      Patient.find(query)
        .sort({ registrationDate: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Patient.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      data: patients,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    });
  } catch (error) {
    next(error);
  }
}

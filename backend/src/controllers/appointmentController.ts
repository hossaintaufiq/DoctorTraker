import { Request, Response, NextFunction } from "express";
import { Appointment } from "../models/Appointment.js";

// @desc    Get appointments with search, date filter, status filter, and pagination
// @route   GET /api/appointments
export async function getAppointments(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { search, status, doctorId, date, page = 1, limit = 50 } = req.query;

    const query: Record<string, any> = {};

    if (search && typeof search === "string" && search.trim() !== "") {
      const searchRegex = new RegExp(search.trim(), "i");
      query.$or = [
        { patientName: searchRegex },
        { doctorName: searchRegex },
        { appointmentCode: searchRegex },
        { roomNumber: searchRegex },
        { doctorSpecialty: searchRegex },
      ];
    }

    if (status && status !== "All") {
      query.status = status;
    }

    if (doctorId && doctorId !== "All") {
      query.doctorId = doctorId;
    }

    if (date) {
      query.date = date;
    }

    const pageNum = Math.max(1, parseInt(page as string) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit as string) || 50));
    const skip = (pageNum - 1) * limitNum;

    const [appointments, total] = await Promise.all([
      Appointment.find(query).sort({ date: 1, timeSlot: 1 }).skip(skip).limit(limitNum).lean(),
      Appointment.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      count: appointments.length,
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      data: appointments,
    });
  } catch (error) {
    next(error);
  }
}

// @desc    Create appointment
// @route   POST /api/appointments
export async function createAppointment(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const appointment = await Appointment.create(req.body);
    res.status(201).json({
      success: true,
      message: "Appointment scheduled successfully.",
      data: appointment,
    });
  } catch (error) {
    next(error);
  }
}

// @desc    Update appointment status
// @route   PATCH /api/appointments/:id/status
export async function updateAppointmentStatus(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { status } = req.body;
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!appointment) {
      res.status(404).json({ success: false, message: "Appointment not found." });
      return;
    }

    res.status(200).json({
      success: true,
      message: `Appointment status updated to ${status}.`,
      data: appointment,
    });
  } catch (error) {
    next(error);
  }
}

// @desc    Cancel appointment
// @route   DELETE /api/appointments/:id
export async function cancelAppointment(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status: "Cancelled" },
      { new: true }
    );

    if (!appointment) {
      res.status(404).json({ success: false, message: "Appointment not found." });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Appointment cancelled successfully.",
      data: appointment,
    });
  } catch (error) {
    next(error);
  }
}

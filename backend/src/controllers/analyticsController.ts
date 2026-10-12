import { Request, Response, NextFunction } from "express";
import { Doctor } from "../models/Doctor.js";
import { Patient } from "../models/Patient.js";
import { Appointment } from "../models/Appointment.js";
import { Invoice } from "../models/Invoice.js";

// In-memory TTL cache keyed by query parameters (30 seconds)
const analyticsCache = new Map<string, { timestamp: number; data: any }>();
const CACHE_TTL_MS = 30 * 1000;

// Helper to calculate date boundaries based on period or custom from/to
function resolveDateRange(from?: string, to?: string, period?: string): {
  fromDate: Date;
  toDate: Date;
  prevFromDate: Date;
  prevToDate: Date;
  periodLabel: string;
} {
  const now = new Date();
  let toDate = to ? new Date(to) : new Date(now);
  toDate.setUTCHours(23, 59, 59, 999);

  let fromDate: Date;
  let periodLabel = period || "30d";

  if (from) {
    fromDate = new Date(from);
    fromDate.setUTCHours(0, 0, 0, 0);
  } else {
    switch (period?.toLowerCase()) {
      case "7d":
        fromDate = new Date(toDate.getTime() - 7 * 86400000);
        periodLabel = "7d";
        break;
      case "90d":
        fromDate = new Date(toDate.getTime() - 90 * 86400000);
        periodLabel = "90d";
        break;
      case "ytd":
        fromDate = new Date(Date.UTC(now.getUTCFullYear(), 0, 1, 0, 0, 0, 0));
        periodLabel = "YTD";
        break;
      case "30d":
      default:
        fromDate = new Date(toDate.getTime() - 30 * 86400000);
        periodLabel = "30d";
        break;
    }
    fromDate.setUTCHours(0, 0, 0, 0);
  }

  // Calculate previous equal duration for period-over-period comparison
  const durationMs = toDate.getTime() - fromDate.getTime();
  const prevToDate = new Date(fromDate.getTime() - 1);
  const prevFromDate = new Date(prevToDate.getTime() - durationMs);

  return { fromDate, toDate, prevFromDate, prevToDate, periodLabel };
}

// @desc    Get real aggregated dashboard analytics and insights
// @route   GET /api/analytics/dashboard
// @access  Protected
export async function getDashboardAnalytics(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { from, to, hospital, specialty, period } = req.query as Record<string, string>;

    const cacheKey = `${from || ""}_${to || ""}_${hospital || ""}_${specialty || ""}_${period || ""}`;
    const cached = analyticsCache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      res.status(200).json({
        success: true,
        data: cached.data,
        cached: true,
      });
      return;
    }

    const { fromDate, toDate, prevFromDate, prevToDate, periodLabel } =
      resolveDateRange(from, to, period);

    // Build Doctor filter criteria
    const doctorFilter: Record<string, any> = {};
    if (hospital && hospital !== "All") doctorFilter.hospital = hospital;
    if (specialty && specialty !== "All") doctorFilter.specialty = specialty;

    // Concurrently execute core metrics
    const [
      totalDoctors,
      activeDoctorsCount,
      totalPatients,
      admittedPatientsCount,
      criticalPatientsCount,
      currentPatientsInRange,
      prevPatientsInRange,
      currentRevenueAgg,
      prevRevenueAgg,
      appointmentsInRange,
      appointmentsToday,
      patientsPerDoctorData,
      conditionBreakdownRaw,
      statusBreakdownRaw,
      specialtyBreakdownRaw,
      arrivalsSeriesRaw,
    ] = await Promise.all([
      Doctor.countDocuments(doctorFilter),
      Doctor.countDocuments({ ...doctorFilter, status: "Active" }),
      Patient.countDocuments(),
      Patient.countDocuments({ status: "Admitted" }),
      Patient.countDocuments({ condition: "Critical" }),

      // New patient registrations in current range
      Patient.countDocuments({
        registrationDate: { $gte: fromDate, $lte: toDate },
      }),

      // New patient registrations in previous equal period
      Patient.countDocuments({
        registrationDate: { $gte: prevFromDate, $lte: prevToDate },
      }),

      // Real revenue in current range (Paid invoices)
      Invoice.aggregate([
        {
          $match: {
            status: "Paid",
            createdAt: { $gte: fromDate, $lte: toDate },
          },
        },
        { $group: { _id: null, total: { $sum: "$total" } } },
      ]),

      // Real revenue in previous equal period
      Invoice.aggregate([
        {
          $match: {
            status: "Paid",
            createdAt: { $gte: prevFromDate, $lte: prevToDate },
          },
        },
        { $group: { _id: null, total: { $sum: "$total" } } },
      ]),

      // Appointments in range
      Appointment.countDocuments({
        createdAt: { $gte: fromDate, $lte: toDate },
      }),

      // Appointments today
      Appointment.countDocuments({
        date: new Date().toISOString().slice(0, 10),
      }),

      // Patients per doctor real aggregation
      Patient.aggregate([
        {
          $group: {
            _id: "$assignedDoctor",
            doctorName: { $first: "$assignedDoctorName" },
            count: { $sum: 1 },
          },
        },
        {
          $lookup: {
            from: "doctors",
            localField: "_id",
            foreignField: "_id",
            as: "doc",
          },
        },
        { $unwind: { path: "$doc", preserveNullAndEmptyArrays: true } },
        {
          $project: {
            doctorId: "$_id",
            doctorName: { $ifNull: ["$doctorName", "$doc.name"] },
            specialty: "$doc.specialty",
            patientCount: "$count",
            maxPatients: { $ifNull: ["$doc.maxPatients", 300] },
          },
        },
        { $sort: { patientCount: -1 } },
        { $limit: 10 },
      ]),

      // Condition Distribution
      Patient.aggregate([
        { $group: { _id: "$condition", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),

      // Status Distribution
      Patient.aggregate([
        { $group: { _id: "$status", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),

      // Specialty Breakdown
      Doctor.aggregate([
        { $match: doctorFilter },
        { $group: { _id: "$specialty", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),

      // Real date-bucketed registrations/arrivals within the range
      Patient.aggregate([
        {
          $match: {
            registrationDate: { $gte: fromDate, $lte: toDate },
          },
        },
        {
          $group: {
            _id: {
              $dateToString: {
                format: "%Y-%m-%d",
                date: "$registrationDate",
              },
            },
            inPatients: {
              $sum: { $cond: [{ $eq: ["$status", "Admitted"] }, 1, 0] },
            },
            outPatients: {
              $sum: { $cond: [{ $ne: ["$status", "Admitted"] }, 1, 0] },
            },
            total: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),
    ]);

    // Format revenue figures
    const currentRevenue = currentRevenueAgg[0]?.total || 0;
    const prevRevenue = prevRevenueAgg[0]?.total || 0;

    // Calculate real period-over-period percentage changes
    const arrivalsChangePercent =
      prevPatientsInRange > 0
        ? Number(
            (((currentPatientsInRange - prevPatientsInRange) / prevPatientsInRange) * 100).toFixed(1)
          )
        : currentPatientsInRange > 0
        ? 100
        : 0;

    const revenueChangePercent =
      prevRevenue > 0
        ? Number((((currentRevenue - prevRevenue) / prevRevenue) * 100).toFixed(1))
        : currentRevenue > 0
        ? 100
        : 0;

    const avgPatientsPerDoctor =
      totalDoctors > 0 ? Number((totalPatients / totalDoctors).toFixed(1)) : 0;

    // Format condition breakdown with percentage
    const conditionBreakdown = conditionBreakdownRaw.map((c) => ({
      name: c._id || "Unspecified",
      value: c.count,
      percentage: totalPatients > 0 ? Number(((c.count / totalPatients) * 100).toFixed(1)) : 0,
    }));

    // Format status breakdown
    const statusBreakdown = statusBreakdownRaw.map((s) => ({
      name: s._id || "Outpatient",
      value: s.count,
      percentage: totalPatients > 0 ? Number(((s.count / totalPatients) * 100).toFixed(1)) : 0,
    }));

    // Format arrival series with continuous date formatting
    const arrivalTrends = arrivalsSeriesRaw.map((item) => ({
      date: item._id,
      label: item._id.slice(5), // MM-DD
      inPatients: item.inPatients,
      outPatients: item.outPatients,
      total: item.total,
    }));

    const responseData = {
      summary: {
        totalDoctors,
        totalPatients,
        activeDoctorsCount,
        admittedPatientsCount,
        criticalPatientsCount,
        avgPatientsPerDoctor,
        totalRevenue: currentRevenue,
        appointmentsInRange,
        appointmentsToday,
        period: periodLabel,
        range: {
          from: fromDate.toISOString(),
          to: toDate.toISOString(),
        },
      },
      changes: {
        arrivalsChangePercent,
        revenueChangePercent,
        prevPatientsInRange,
        currentPatientsInRange,
      },
      patientsPerDoctor: patientsPerDoctorData,
      conditionBreakdown,
      statusBreakdown,
      specialtyBreakdown: specialtyBreakdownRaw.map((s) => ({
        name: s._id,
        count: s.count,
        value: s.count,
      })),
      arrivalTrends,
    };

    // Store in short-lived TTL cache
    analyticsCache.set(cacheKey, { timestamp: Date.now(), data: responseData });

    res.status(200).json({
      success: true,
      data: responseData,
    });
  } catch (error) {
    next(error);
  }
}

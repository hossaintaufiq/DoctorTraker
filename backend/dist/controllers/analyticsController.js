"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboardAnalytics = getDashboardAnalytics;
const Doctor_js_1 = require("../models/Doctor.js");
const Patient_js_1 = require("../models/Patient.js");
// @desc    Get aggregated dashboard analytics and insights
// @route   GET /api/analytics/dashboard
// @access  Public or Protected
async function getDashboardAnalytics(req, res, next) {
    try {
        const [totalDoctors, totalPatients, activeDoctorsCount, admittedPatientsCount, criticalPatientsCount, patientsPerDoctorData, conditionBreakdown, specialtyBreakdown,] = await Promise.all([
            Doctor_js_1.Doctor.countDocuments(),
            Patient_js_1.Patient.countDocuments(),
            Doctor_js_1.Doctor.countDocuments({ status: "Active" }),
            Patient_js_1.Patient.countDocuments({ status: "Admitted" }),
            Patient_js_1.Patient.countDocuments({ condition: "Critical" }),
            // Patients per doctor aggregation
            Patient_js_1.Patient.aggregate([
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
                        as: "doctorDetails",
                    },
                },
                { $unwind: { path: "$doctorDetails", preserveNullAndEmptyArrays: true } },
                {
                    $project: {
                        doctorId: "$_id",
                        doctorName: { $ifNull: ["$doctorName", "$doctorDetails.name"] },
                        specialty: "$doctorDetails.specialty",
                        patientCount: "$count",
                        maxPatients: { $ifNull: ["$doctorDetails.maxPatients", 300] },
                    },
                },
                { $sort: { patientCount: -1 } },
            ]),
            // Condition Distribution
            Patient_js_1.Patient.aggregate([
                { $group: { _id: "$condition", count: { $sum: 1 } } },
            ]),
            // Specialty Breakdown
            Doctor_js_1.Doctor.aggregate([
                { $group: { _id: "$specialty", count: { $sum: 1 } } },
            ]),
        ]);
        // Average patient load per doctor
        const avgPatientsPerDoctor = totalDoctors > 0 ? (totalPatients / totalDoctors).toFixed(1) : 0;
        // Date-based arrival trend simulation/aggregation
        const arrivalTrends = [
            { month: "Jan", arrivals: 1200, followups: 420 },
            { month: "Feb", arrivals: 1450, followups: 510 },
            { month: "Mar", arrivals: 1800, followups: 630 },
            { month: "Apr", arrivals: 2100, followups: 740 },
            { month: "May", arrivals: 2400, followups: 890 },
            { month: "Jun", arrivals: 2900, followups: 1050 },
            { month: "Jul", arrivals: 3200, followups: 1200 },
            { month: "Aug", arrivals: 3600, followups: 1350 },
            { month: "Sep", arrivals: 4100, followups: 1520 },
            { month: "Oct", arrivals: 4600, followups: 1710 },
            { month: "Nov", arrivals: 5100, followups: 1940 },
            { month: "Dec", arrivals: 5642, followups: 2180 },
        ];
        res.status(200).json({
            success: true,
            data: {
                summary: {
                    totalDoctors,
                    totalPatients,
                    activeDoctorsCount,
                    admittedPatientsCount,
                    criticalPatientsCount,
                    avgPatientsPerDoctor: Number(avgPatientsPerDoctor),
                    estimatedMonthlyRevenue: 32450,
                    appointmentsToday: 24,
                },
                patientsPerDoctor: patientsPerDoctorData,
                conditionBreakdown,
                specialtyBreakdown,
                arrivalTrends,
            },
        });
    }
    catch (error) {
        next(error);
    }
}

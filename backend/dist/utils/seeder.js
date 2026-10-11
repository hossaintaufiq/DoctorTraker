"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedDatabase = seedDatabase;
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const node_dns_1 = __importDefault(require("node:dns"));
const User_js_1 = require("../models/User.js");
const Doctor_js_1 = require("../models/Doctor.js");
const Patient_js_1 = require("../models/Patient.js");
const Department_js_1 = require("../models/Department.js");
const Appointment_js_1 = require("../models/Appointment.js");
const Invoice_js_1 = require("../models/Invoice.js");
const ActivityLog_js_1 = require("../models/ActivityLog.js");
try {
    node_dns_1.default.setServers(["8.8.8.8", "1.1.1.1"]);
}
catch {
    // Ignore
}
dotenv_1.default.config();
const departmentsSeed = [
    {
        name: "Cardiology",
        code: "CARD-01",
        headName: "Dr. Salman Hossain",
        specialistsCount: 14,
        activeCasesCount: 342,
        totalBeds: 45,
        occupiedBeds: 39,
        occupancyPercentage: 88,
        floor: "3rd Floor, West Wing",
        emergencyReady: true,
        topServices: ["Cardiac Catheterization", "Echocardiography", "Angioplasty", "Coronary Care Unit (CCU)"],
        equipmentSummary: "Siemens Artis Zee Angiography, Philips EPIQ 7 Ultrasound, 16-Bed CCU Telemetry",
        rating: 4.9,
        colorTheme: "blue",
    },
    {
        name: "Neurology & Neurosurgery",
        code: "NEUR-02",
        headName: "Dr. Michael Chen",
        specialistsCount: 11,
        activeCasesCount: 286,
        totalBeds: 38,
        occupiedBeds: 28,
        occupancyPercentage: 74,
        floor: "4th Floor, North Wing",
        emergencyReady: true,
        topServices: ["Stroke Thrombolysis", "Digital EEG Monitoring", "Stereotactic Neurosurgery", "Neuro-ICU"],
        equipmentSummary: "Natus Nicolet EEG/EMG Suite, Carl Zeiss OPMI Pentero Microscope, 3T MRI Suite",
        rating: 4.8,
        colorTheme: "purple",
    },
    {
        name: "Oncology & Hematology",
        code: "ONC-03",
        headName: "Dr. Mahmudul Haque",
        specialistsCount: 10,
        activeCasesCount: 310,
        totalBeds: 40,
        occupiedBeds: 33,
        occupancyPercentage: 82,
        floor: "5th Floor, Oncology Tower",
        emergencyReady: false,
        topServices: ["Immunotherapy Infusions", "Bone Marrow Biopsy", "Chemotherapy Day Care", "Tumor Board"],
        equipmentSummary: "Varian TrueBeam Linear Accelerator, Class 100 Isolation Wards, Automated Compounder",
        rating: 4.9,
        colorTheme: "amber",
    },
    {
        name: "Orthopedics & Joint Trauma",
        code: "ORTH-04",
        headName: "Dr. Rafiqul Islam",
        specialistsCount: 12,
        activeCasesCount: 198,
        totalBeds: 35,
        occupiedBeds: 24,
        occupancyPercentage: 68,
        floor: "2nd Floor, South Wing",
        emergencyReady: true,
        topServices: ["Total Knee/Hip Arthroplasty", "Arthroscopic Surgery", "Complex Fracture Reduction", "Rehab Physio"],
        equipmentSummary: "Stryker Mako Robotic Arm, Mobile C-Arm Fluoroscopy, Hydrotherapy Rehabilitation Tank",
        rating: 4.7,
        colorTheme: "emerald",
    },
    {
        name: "Pediatrics & Child Health",
        code: "PED-05",
        headName: "Dr. Nusrat Jahan",
        specialistsCount: 9,
        activeCasesCount: 245,
        totalBeds: 30,
        occupiedBeds: 28,
        occupancyPercentage: 93,
        floor: "1st Floor, East Wing",
        emergencyReady: true,
        topServices: ["Neonatal Intensive Care (NICU)", "Pediatric Pulmonology", "Developmental Screening", "Vaccinations"],
        equipmentSummary: "Dräger Babylog VN500 Ventilators, GE Giraffe Omnibed Incubators, Phototherapy Arrays",
        rating: 4.9,
        colorTheme: "orange",
    },
    {
        name: "Emergency & Trauma Medicine",
        code: "EMER-06",
        headName: "Dr. David Kim",
        specialistsCount: 16,
        activeCasesCount: 520,
        totalBeds: 25,
        occupiedBeds: 24,
        occupancyPercentage: 96,
        floor: "Ground Floor, Entrance A",
        emergencyReady: true,
        topServices: ["Level 1 Trauma Resuscitation", "Acute STEMI Protocol", "Stroke Fast Track", "Triage Telemetry"],
        equipmentSummary: "Dedicated Trauma CT Scanner, Rapid Blood Infusers, Crash Cart telemetry with Defib",
        rating: 5.0,
        colorTheme: "rose",
    },
];
const doctorsSeed = [
    {
        name: "Dr. Sarah Ahmed",
        specialty: "Cardiology",
        email: "sarah.ahmed@medcare.com",
        phone: "+880 1711-234567",
        roomNumber: "Room 304 - Wing B",
        hospital: "Doctor Tracker Medical Center",
        patientCount: 42,
        maxPatients: 300,
        experienceYears: 12,
        status: "Active",
        biography: "Lead Cardiologist specializing in ischemic heart disease management and diagnostic echocardiography.",
    },
    {
        name: "Dr. Tanvir Hasan",
        specialty: "Neurology",
        email: "tanvir.hasan@medcare.com",
        phone: "+880 1819-345678",
        roomNumber: "Room 210 - Wing A",
        hospital: "Doctor Tracker Medical Center",
        patientCount: 38,
        maxPatients: 250,
        experienceYears: 9,
        status: "Active",
        biography: "Consultant Neurologist focusing on neurovascular disorders, stroke rehabilitation, and clinical EEG interpretation.",
    },
    {
        name: "Dr. Nusrat Jahan",
        specialty: "Pediatrics",
        email: "nusrat.jahan@medcare.com",
        phone: "+880 1912-456789",
        roomNumber: "Room 105 - Pediatric Wing",
        hospital: "Doctor Tracker Medical Center",
        patientCount: 65,
        maxPatients: 400,
        experienceYears: 7,
        status: "Active",
        biography: "Specialist Pediatrician dedicated to neonatal development, immunizations, and chronic childhood asthma protocols.",
    },
    {
        name: "Dr. Rafiqul Islam",
        specialty: "Orthopedics",
        email: "rafiqul.islam@medcare.com",
        phone: "+880 1613-567890",
        roomNumber: "Room 402 - Wing C",
        hospital: "Doctor Tracker Medical Center",
        patientCount: 29,
        maxPatients: 200,
        experienceYears: 15,
        status: "In Surgery",
        biography: "Chief Orthopedic Surgeon with extensive expertise in arthroscopic joint reconstruction and complex trauma reduction.",
    },
    {
        name: "Dr. Farzana Karim",
        specialty: "Dermatology",
        email: "farzana.karim@medcare.com",
        phone: "+880 1714-678901",
        roomNumber: "Room 118 - Clinic A",
        hospital: "Doctor Tracker Medical Center",
        patientCount: 34,
        maxPatients: 280,
        experienceYears: 6,
        status: "Active",
        biography: "Clinical Dermatologist with focus on autoimmune dermatoses, cutaneous pharmacology, and non-invasive laser therapeutics.",
    },
    {
        name: "Dr. Mahmudul Haque",
        specialty: "Oncology",
        email: "mahmudul.haque@medcare.com",
        phone: "+880 1815-789012",
        roomNumber: "Room 501 - Oncology Tower",
        hospital: "Doctor Tracker Medical Center",
        patientCount: 22,
        maxPatients: 150,
        experienceYears: 14,
        status: "On Leave",
        biography: "Medical Oncologist leading clinical immunotherapy trials and multidisciplinary tumor board care protocols.",
    },
];
async function seedDatabase() {
    const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/doctor_tracker";
    try {
        if (mongoose_1.default.connection.readyState !== 1) {
            await mongoose_1.default.connect(uri);
            console.log("[Seeder] Connected to MongoDB Atlas for comprehensive seeding...");
        }
        // Clear existing collections
        await Promise.all([
            User_js_1.User.deleteMany({}),
            Doctor_js_1.Doctor.deleteMany({}),
            Patient_js_1.Patient.deleteMany({}),
            Department_js_1.Department.deleteMany({}),
            Appointment_js_1.Appointment.deleteMany({}),
            Invoice_js_1.Invoice.deleteMany({}),
            ActivityLog_js_1.ActivityLog.deleteMany({}),
        ]);
        // 1. Create Admin User
        const adminUser = await User_js_1.User.create({
            name: "Sullivan (Master Admin)",
            email: "admin@medcare.com",
            password: "password123",
            role: "admin",
        });
        console.log(`[Seeder] Created Admin User: ${adminUser.email}`);
        // 2. Create Departments
        const createdDepts = await Department_js_1.Department.insertMany(departmentsSeed);
        console.log(`[Seeder] Created ${createdDepts.length} Clinical Departments.`);
        // 3. Create Doctors
        const createdDoctors = await Doctor_js_1.Doctor.insertMany(doctorsSeed);
        console.log(`[Seeder] Created ${createdDoctors.length} Attending Doctors.`);
        // 4. Create Patients
        const patientsSeed = [
            {
                patientCode: "PT-1042",
                name: "Olivia Bennett",
                age: 34,
                gender: "Female",
                assignedDoctor: createdDoctors[0]._id,
                assignedDoctorName: createdDoctors[0].name,
                condition: "Chronic",
                status: "Outpatient",
                bloodGroup: "A+",
                phone: "+880 1812-345678",
                email: "olivia.bennett@example.com",
                notes: "Hypertension follow-up; vital signs stable on current ACE-inhibitor regimen.",
            },
            {
                patientCode: "PT-1043",
                name: "James Rodriguez",
                age: 48,
                gender: "Male",
                assignedDoctor: createdDoctors[0]._id,
                assignedDoctorName: createdDoctors[0].name,
                condition: "Follow-up",
                status: "Outpatient",
                bloodGroup: "O+",
                phone: "+880 1712-987654",
                email: "james.r@example.com",
                notes: "Post-angioplasty 6-month routine review. Exercise tolerance satisfactory.",
            },
            {
                patientCode: "PT-1044",
                name: "Sophia Chen",
                age: 27,
                gender: "Female",
                assignedDoctor: createdDoctors[1]._id,
                assignedDoctorName: createdDoctors[1].name,
                condition: "Recovering",
                status: "Outpatient",
                bloodGroup: "B+",
                phone: "+880 1913-456789",
                email: "sophia.chen@example.com",
                notes: "Migraine prophylaxis protocol initiated. Headache frequency down by 70%.",
            },
            {
                patientCode: "PT-1045",
                name: "Marcus Vance",
                age: 62,
                gender: "Male",
                assignedDoctor: createdDoctors[3]._id,
                assignedDoctorName: createdDoctors[3].name,
                condition: "Critical",
                status: "Admitted",
                bloodGroup: "AB-",
                phone: "+880 1614-567890",
                email: "m.vance@example.com",
                notes: "Post-op femur fixation. DVT prophylaxis active. Pain well controlled on PCA pump.",
            },
            {
                patientCode: "PT-1046",
                name: "Amina Begum",
                age: 51,
                gender: "Female",
                assignedDoctor: createdDoctors[2]._id,
                assignedDoctorName: createdDoctors[2].name,
                condition: "General",
                status: "Outpatient",
                bloodGroup: "O+",
                phone: "+880 1715-678901",
                email: "amina.b@example.com",
                notes: "Routine health screening and metabolic panel review. Fasting blood sugar normal.",
            },
        ];
        const createdPatients = await Patient_js_1.Patient.insertMany(patientsSeed);
        console.log(`[Seeder] Created ${createdPatients.length} Patients.`);
        // 5. Create Appointments
        const appointmentsSeed = [
            {
                appointmentCode: "APT-8821",
                patientId: createdPatients[0]._id.toString(),
                patientName: createdPatients[0].name,
                patientPhone: createdPatients[0].phone,
                doctorId: createdDoctors[0]._id.toString(),
                doctorName: createdDoctors[0].name,
                doctorSpecialty: createdDoctors[0].specialty,
                roomNumber: createdDoctors[0].roomNumber,
                date: new Date().toISOString().slice(0, 10),
                timeSlot: "10:00 AM",
                type: "Consultation",
                status: "In-Consultation",
                notes: "Chest discomfort and ECG review.",
            },
            {
                appointmentCode: "APT-8822",
                patientId: createdPatients[1]._id.toString(),
                patientName: createdPatients[1].name,
                patientPhone: createdPatients[1].phone,
                doctorId: createdDoctors[0]._id.toString(),
                doctorName: createdDoctors[0].name,
                doctorSpecialty: createdDoctors[0].specialty,
                roomNumber: createdDoctors[0].roomNumber,
                date: new Date().toISOString().slice(0, 10),
                timeSlot: "11:30 AM",
                type: "Follow-up",
                status: "Confirmed",
                notes: "Post-stent regular ultrasound follow-up.",
            },
            {
                appointmentCode: "APT-8823",
                patientId: createdPatients[2]._id.toString(),
                patientName: createdPatients[2].name,
                patientPhone: createdPatients[2].phone,
                doctorId: createdDoctors[1]._id.toString(),
                doctorName: createdDoctors[1].name,
                doctorSpecialty: createdDoctors[1].specialty,
                roomNumber: createdDoctors[1].roomNumber,
                date: new Date().toISOString().slice(0, 10),
                timeSlot: "02:15 PM",
                type: "General Checkup",
                status: "Confirmed",
                notes: "Migraine medication evaluation.",
            },
        ];
        const createdAppointments = await Appointment_js_1.Appointment.insertMany(appointmentsSeed);
        console.log(`[Seeder] Created ${createdAppointments.length} Appointments.`);
        // 6. Create Invoices
        const invoicesSeed = [
            {
                invoiceCode: "INV-9921",
                patientId: createdPatients[0]._id.toString(),
                patientName: createdPatients[0].name,
                patientCode: createdPatients[0].patientCode,
                doctorId: createdDoctors[0]._id.toString(),
                doctorName: createdDoctors[0].name,
                issueDate: new Date().toISOString().slice(0, 10),
                dueDate: new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10),
                status: "Paid",
                paymentMethod: "Insurance",
                subtotal: 350.00,
                tax: 17.50,
                discount: 0,
                total: 367.50,
                items: [
                    { description: "Cardiology Specialist Consultation", department: "Cardiology", quantity: 1, unitPrice: 150, totalPrice: 150 },
                    { description: "Echocardiogram Diagnostic (Color Doppler)", department: "Cardiology", quantity: 1, unitPrice: 200, totalPrice: 200 },
                ],
            },
            {
                invoiceCode: "INV-9920",
                patientId: createdPatients[1]._id.toString(),
                patientName: createdPatients[1].name,
                patientCode: createdPatients[1].patientCode,
                doctorId: createdDoctors[0]._id.toString(),
                doctorName: createdDoctors[0].name,
                issueDate: new Date().toISOString().slice(0, 10),
                dueDate: new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10),
                status: "Pending",
                paymentMethod: "Credit Card",
                subtotal: 120.00,
                tax: 6.00,
                discount: 0,
                total: 126.00,
                items: [
                    { description: "Routine Post-Op Consultation", department: "Cardiology", quantity: 1, unitPrice: 120, totalPrice: 120 },
                ],
            },
        ];
        const createdInvoices = await Invoice_js_1.Invoice.insertMany(invoicesSeed);
        console.log(`[Seeder] Created ${createdInvoices.length} Invoices.`);
        // 7. Create Activity Logs
        const activityLogsSeed = [
            {
                timestamp: "10:45 AM",
                category: "Clinical",
                user: "Dr. Sarah Ahmed",
                action: "Consultation Session Started",
                ipAddress: "192.168.1.42",
                status: "Success",
                details: "Patient Olivia Bennett admitted to Chamber 304.",
            },
            {
                timestamp: "09:30 AM",
                category: "Billing",
                user: "Billing Desk 01",
                action: "Insurance Claim Settled",
                ipAddress: "192.168.1.10",
                status: "Success",
                details: "MetLife pre-authorization approved for INV-9921 ($367.50).",
            },
            {
                timestamp: "08:15 AM",
                category: "Security",
                user: "System Daemon",
                action: "Database Telemetry Synchronized",
                ipAddress: "127.0.0.1",
                status: "Info",
                details: "MongoDB Atlas Cloud replica set synced with zero latency.",
            },
        ];
        const createdLogs = await ActivityLog_js_1.ActivityLog.insertMany(activityLogsSeed);
        console.log(`[Seeder] Created ${createdLogs.length} Activity Logs.`);
        console.log("[Seeder] Full Database Seeding Complete into MongoDB Atlas Cloud!");
        const counts = {
            users: 1,
            doctors: createdDoctors.length,
            patients: createdPatients.length,
            departments: createdDepts.length,
            appointments: createdAppointments.length,
            invoices: createdInvoices.length,
            activityLogs: createdLogs.length,
        };
        if (process.argv[1]?.includes("seeder")) {
            await mongoose_1.default.connection.close();
            process.exit(0);
        }
        return counts;
    }
    catch (error) {
        console.error("[Seeder Error]", error);
        if (process.argv[1]?.includes("seeder")) {
            process.exit(1);
        }
        throw error;
    }
}
if (process.argv[1]?.includes("seeder")) {
    seedDatabase();
}

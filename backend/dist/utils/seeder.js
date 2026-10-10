"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedDatabase = seedDatabase;
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const User_js_1 = require("../models/User.js");
const Doctor_js_1 = require("../models/Doctor.js");
const Patient_js_1 = require("../models/Patient.js");
dotenv_1.default.config();
const doctorsSeed = [
    {
        name: "Dr. Sarah Ahmed",
        specialty: "Cardiology",
        email: "sarah.ahmed@medcare.com",
        phone: "+880 1711-234567",
        roomNumber: "Room 304 - Wing B",
        hospital: "Care Guide BD Medical Center",
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
        hospital: "Care Guide BD Medical Center",
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
        hospital: "Care Guide BD Medical Center",
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
        hospital: "Care Guide BD Medical Center",
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
        hospital: "Care Guide BD Medical Center",
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
        hospital: "Care Guide BD Medical Center",
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
        await mongoose_1.default.connect(uri);
        console.log("[Seeder] Connected to MongoDB for seeding...");
        // Clear existing data
        await Promise.all([
            User_js_1.User.deleteMany({}),
            Doctor_js_1.Doctor.deleteMany({}),
            Patient_js_1.Patient.deleteMany({}),
        ]);
        // Create Admin User
        const adminUser = await User_js_1.User.create({
            name: "Dr. Sullivan Robert",
            email: "admin@medcare.com",
            password: "password123",
            role: "admin",
        });
        console.log(`[Seeder] Created Admin User: ${adminUser.email}`);
        // Create Doctors
        const createdDoctors = await Doctor_js_1.Doctor.insertMany(doctorsSeed);
        console.log(`[Seeder] Created ${createdDoctors.length} Doctors.`);
        // Create Sample Patients
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
        console.log("[Seeder] Database Seeding Complete!");
        await mongoose_1.default.connection.close();
        process.exit(0);
    }
    catch (error) {
        console.error("[Seeder Error]", error);
        process.exit(1);
    }
}
// Run direct script execution if executed standalone
if (process.argv[1]?.includes("seeder")) {
    seedDatabase();
}

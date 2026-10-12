import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { Doctor } from "../models/Doctor.js";
import { Patient } from "../models/Patient.js";
import { Appointment } from "../models/Appointment.js";

interface ExplainStageResult {
  queryName: string;
  queryFilter: any;
  sortFilter: any;
  winningStage: string;
  inputStage?: string;
  indexName?: string;
  totalDocsExamined: number;
  nReturned: number;
  executionTimeMillis: number;
}

export async function runExplainAudit(): Promise<ExplainStageResult[]> {
  const mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();

  await mongoose.connect(uri);

  // Sync and ensure compound indexes exist
  await Promise.all([
    Doctor.syncIndexes(),
    Patient.syncIndexes(),
    Appointment.syncIndexes(),
  ]);

  // Seed sample data
  const sampleDoctor = await Doctor.create({
    name: "Dr. Sarah Ahmed",
    specialty: "Cardiology",
    email: "sarah.ahmed@doctortracker.com",
    phone: "+880 1711-234567",
    roomNumber: "Room 304",
    hospital: "Doctor Tracker Medical Center",
    status: "Active",
    patientCount: 1,
  });

  await Patient.create({
    name: "Olivia Bennett",
    age: 34,
    gender: "Female",
    assignedDoctor: sampleDoctor._id,
    assignedDoctorName: sampleDoctor.name,
    condition: "Chronic",
    status: "Outpatient",
    bloodGroup: "A+",
    phone: "+880 1812-345678",
    email: "olivia@example.com",
    registrationDate: new Date(),
  });

  await Appointment.create({
    patientId: "patient-1",
    patientName: "Olivia Bennett",
    doctorId: sampleDoctor._id.toString(),
    doctorName: sampleDoctor.name,
    doctorSpecialty: sampleDoctor.specialty,
    roomNumber: sampleDoctor.roomNumber,
    date: "2026-10-12",
    timeSlot: "10:00 AM",
    status: "Confirmed",
  });

  const results: ExplainStageResult[] = [];

  // Helper to extract stage and index details
  const extractDetails = (
    queryName: string,
    filter: any,
    sort: any,
    explain: any
  ): ExplainStageResult => {
    const stats = explain.executionStats;
    const winningPlan = explain.queryPlanner?.winningPlan || {};
    
    // Find scan stage in plan hierarchy
    let stage = winningPlan.stage;
    let inputStage = winningPlan.inputStage?.stage;
    let indexName = winningPlan.inputStage?.indexName || winningPlan.indexName;

    // Check deeper nested input stages
    let curr = winningPlan.inputStage;
    while (curr) {
      if (curr.stage === "IXSCAN") {
        inputStage = "IXSCAN";
        indexName = curr.indexName;
        break;
      }
      curr = curr.inputStage;
    }

    return {
      queryName,
      queryFilter: filter,
      sortFilter: sort,
      winningStage: stage,
      inputStage,
      indexName,
      totalDocsExamined: stats.totalDocsExamined,
      nReturned: stats.nReturned,
      executionTimeMillis: stats.executionTimeMillis,
    };
  };

  // 1. Doctor Filter by Status + Specialty + Sort createdAt
  const q1 = { status: "Active", specialty: "Cardiology" };
  const s1 = { createdAt: -1 as const };
  const exp1 = await Doctor.find(q1).sort(s1).explain("executionStats");
  results.push(extractDetails("Doctors Filter & Sort", q1, s1, exp1));

  // 2. Doctor Filter by Hospital + Status
  const q2 = { hospital: "Doctor Tracker Medical Center", status: "Active" };
  const s2 = { createdAt: -1 as const };
  const exp2 = await Doctor.find(q2).sort(s2).explain("executionStats");
  results.push(extractDetails("Doctors by Hospital", q2, s2, exp2));

  // 3. Patients Filter by Assigned Doctor + Sort createdAt
  const q3 = { assignedDoctor: sampleDoctor._id };
  const s3 = { createdAt: -1 as const };
  const exp3 = await Patient.find(q3).sort(s3).explain("executionStats");
  results.push(extractDetails("Patients by Assigned Doctor", q3, s3, exp3));

  // 4. Patients Filter by Condition + Status + Sort registrationDate
  const q4 = { condition: "Chronic", status: "Outpatient" };
  const s4 = { registrationDate: -1 as const };
  const exp4 = await Patient.find(q4).sort(s4).explain("executionStats");
  results.push(extractDetails("Patients by Condition & Status", q4, s4, exp4));

  // 5. Appointments Filter by Doctor ID + Sort date
  const q5 = { doctorId: sampleDoctor._id.toString() };
  const s5 = { date: -1 as const };
  const exp5 = await Appointment.find(q5).sort(s5).explain("executionStats");
  results.push(extractDetails("Appointments by Doctor & Date", q5, s5, exp5));

  await mongoose.disconnect();
  await mongod.stop();

  return results;
}

if (process.argv[1]?.includes("explainQueries")) {
  runExplainAudit()
    .then((res) => {
      console.log("\n=================== EXPLAIN('EXECUTIONSTATS') AUDIT RESULTS ===================");
      for (const r of res) {
        console.log(`\nQuery: ${r.queryName}`);
        console.log(`Filter: ${JSON.stringify(r.queryFilter)}`);
        console.log(`Sort: ${JSON.stringify(r.sortFilter)}`);
        console.log(`Execution Stage: ${r.winningStage} -> InputStage: ${r.inputStage || "N/A"}`);
        console.log(`Index Used: ${r.indexName || "N/A"}`);
        console.log(`Docs Examined: ${r.totalDocsExamined}, Returned: ${r.nReturned}`);
        console.log(`Time: ${r.executionTimeMillis} ms`);
      }
      console.log("\n===============================================================================");
      process.exit(0);
    })
    .catch((err) => {
      console.error("Explain audit failed:", err);
      process.exit(1);
    });
}

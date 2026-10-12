import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import app from "../src/server.js";
import { Doctor } from "../src/models/Doctor.js";
import { Patient } from "../src/models/Patient.js";
import { createTestUser } from "./testHelpers.js";

describe("Analytics Dashboard Aggregation Suite", () => {
  let adminToken: string;

  beforeEach(async () => {
    const admin = await createTestUser("admin");
    adminToken = admin.token;

    // Seed 2 doctors: 1 Active Cardiology, 1 Active Neurology
    const doc1 = await Doctor.create({
      name: "Dr. Gregory House",
      specialty: "Cardiology",
      roomNumber: "Room 101",
      hospital: "Doctor Tracker Medical Center",
      phone: "+1 555-0101",
      email: "house@dt.org",
      status: "Active",
      patientCount: 3,
    });

    const doc2 = await Doctor.create({
      name: "Dr. James Wilson",
      specialty: "Neurology",
      roomNumber: "Room 102",
      hospital: "Doctor Tracker Medical Center",
      phone: "+1 555-0102",
      email: "wilson@dt.org",
      status: "Active",
      patientCount: 1,
    });

    // Seed 4 patients with specific conditions and dates in 2026-03
    await Patient.create([
      {
        name: "Patient One",
        age: 30,
        gender: "Male",
        assignedDoctor: doc1._id,
        assignedDoctorName: doc1.name,
        condition: "Chronic",
        status: "Admitted",
        bloodGroup: "O+",
        phone: "+1 555-0001",
        email: "p1@test.com",
        registrationDate: new Date("2026-03-05T12:00:00Z"),
      },
      {
        name: "Patient Two",
        age: 40,
        gender: "Female",
        assignedDoctor: doc1._id,
        assignedDoctorName: doc1.name,
        condition: "Chronic",
        status: "Outpatient",
        bloodGroup: "A+",
        phone: "+1 555-0002",
        email: "p2@test.com",
        registrationDate: new Date("2026-03-05T14:00:00Z"),
      },
      {
        name: "Patient Three",
        age: 50,
        gender: "Male",
        assignedDoctor: doc1._id,
        assignedDoctorName: doc1.name,
        condition: "General",
        status: "Outpatient",
        bloodGroup: "B+",
        phone: "+1 555-0003",
        email: "p3@test.com",
        registrationDate: new Date("2026-03-10T10:00:00Z"),
      },
      {
        name: "Patient Four",
        age: 60,
        gender: "Female",
        assignedDoctor: doc2._id,
        assignedDoctorName: doc2.name,
        condition: "Critical",
        status: "Admitted",
        bloodGroup: "AB+",
        phone: "+1 555-0004",
        email: "p4@test.com",
        registrationDate: new Date("2026-03-15T09:00:00Z"),
      },
    ]);
  });

  it("aggregates dashboard KPIs accurately from real MongoDB documents", async () => {
    const res = await request(app)
      .get("/api/analytics/dashboard?from=2026-03-01&to=2026-03-31")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);

    const { summary, arrivalTrends, conditionBreakdown, specialtyBreakdown, patientsPerDoctor } =
      res.body.data;

    // Summary counts
    expect(summary.totalDoctors).toBe(2);
    expect(summary.totalPatients).toBe(4);
    expect(summary.activeDoctorsCount).toBe(2);
    expect(summary.avgPatientsPerDoctor).toBe(2);

    // Condition breakdown: Chronic = 2, General = 1, Critical = 1
    const chronicItem = conditionBreakdown.find((c: any) => c.name === "Chronic");
    expect(chronicItem).toBeDefined();
    expect(chronicItem.value).toBe(2);

    // Specialty breakdown: Cardiology = 1 doctor, Neurology = 1 doctor
    const cardioItem = specialtyBreakdown.find((s: any) => s.name === "Cardiology");
    expect(cardioItem).toBeDefined();
    expect(cardioItem.value).toBe(1);

    // Patients per doctor distribution
    const doc1Item = patientsPerDoctor.find((d: any) => d.doctorName === "Dr. Gregory House");
    expect(doc1Item).toBeDefined();
    expect(doc1Item.patientCount).toBe(3);

    // Arrival trends should reflect the real dates
    expect(Array.isArray(arrivalTrends)).toBe(true);
    expect(arrivalTrends.length).toBeGreaterThan(0);
    const day5 = arrivalTrends.find((t: any) => t.date === "2026-03-05");
    expect(day5).toBeDefined();
    expect(day5.inPatients).toBe(1);
    expect(day5.outPatients).toBe(1);
    expect(day5.total).toBe(2);
  });
});

import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import app from "../src/server.js";
import { Doctor, IDoctor } from "../src/models/Doctor.js";
import { Patient } from "../src/models/Patient.js";
import { createTestUser } from "./testHelpers.js";
import mongoose from "mongoose";

describe("Patients API Integration & Query Suite", () => {
  let adminToken: string;
  let testDoctor: IDoctor;

  beforeEach(async () => {
    const admin = await createTestUser("admin");
    adminToken = admin.token;

    testDoctor = await Doctor.create({
      name: "Dr. Gregory House",
      specialty: "Diagnostics",
      roomNumber: "Room 404",
      hospital: "Princeton Plainsboro",
      phone: "+1 555-0404",
      email: "house@ppth.org",
      status: "Active",
      patientCount: 0,
    });
  });

  describe("Patient Creation & Doctor Validation", () => {
    it("creates a patient and atomically increments assigned doctor's patientCount", async () => {
      const res = await request(app)
        .post("/api/patients")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          name: "James Wilson",
          age: 48,
          gender: "Male",
          assignedDoctorId: testDoctor._id.toString(),
          condition: "Chronic",
          status: "Outpatient",
          bloodGroup: "O+",
          phone: "+1 555-0777",
          email: "wilson@ppth.org",
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.name).toBe("James Wilson");
      expect(res.body.data.assignedDoctorName).toBe("Dr. Gregory House");

      const docAfter = await Doctor.findById(testDoctor._id);
      expect(docAfter?.patientCount).toBe(1);
    });

    it("rejects patient creation when assigned doctor does not exist", async () => {
      const nonExistentId = new mongoose.Types.ObjectId().toString();
      const res = await request(app)
        .post("/api/patients")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          name: "Ghost Patient",
          age: 30,
          gender: "Female",
          assignedDoctorId: nonExistentId,
          phone: "+1 555-0000",
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/does not exist/i);
    });

    it("returns 400 when invalid ObjectId is passed in params", async () => {
      const res = await request(app)
        .get("/api/patients/not-a-valid-id")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(400);
      expect(res.body.errors).toBeDefined();
    });
  });

  describe("Patient Deletion & Atomic Decrement", () => {
    it("deletes a patient and atomically decrements doctor patientCount", async () => {
      const patient = await Patient.create({
        name: "Allison Cameron",
        age: 32,
        gender: "Female",
        assignedDoctor: testDoctor._id,
        assignedDoctorName: testDoctor.name,
        condition: "Recovering",
        status: "Outpatient",
        bloodGroup: "A+",
        phone: "+1 555-0888",
        email: "cameron@ppth.org",
      });

      // Initially set doctor's patientCount to 1
      await Doctor.findByIdAndUpdate(testDoctor._id, { patientCount: 1 });

      const delRes = await request(app)
        .delete(`/api/patients/${patient._id}`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(delRes.status).toBe(200);

      const docAfter = await Doctor.findById(testDoctor._id);
      expect(docAfter?.patientCount).toBe(0);

      const deletedRecord = await Patient.findById(patient._id);
      expect(deletedRecord).toBeNull();
    });
  });

  describe("Server-driven Search, Filter & Pagination", () => {
    beforeEach(async () => {
      await Patient.create([
        {
          name: "Patient Alpha",
          age: 25,
          gender: "Male",
          assignedDoctor: testDoctor._id,
          assignedDoctorName: testDoctor.name,
          condition: "Critical",
          status: "Admitted",
          bloodGroup: "A+",
          phone: "+1 555-1001",
          email: "alpha@hospital.org",
          registrationDate: new Date("2026-01-05T10:00:00Z"),
          createdAt: new Date("2026-01-05T10:00:00Z"),
        },
        {
          name: "Patient Beta",
          age: 35,
          gender: "Female",
          assignedDoctor: testDoctor._id,
          assignedDoctorName: testDoctor.name,
          condition: "Chronic",
          status: "Outpatient",
          bloodGroup: "B+",
          phone: "+1 555-1002",
          email: "beta@hospital.org",
          registrationDate: new Date("2026-02-10T10:00:00Z"),
          createdAt: new Date("2026-02-10T10:00:00Z"),
        },
        {
          name: "Patient Gamma",
          age: 45,
          gender: "Male",
          assignedDoctor: testDoctor._id,
          assignedDoctorName: testDoctor.name,
          condition: "Recovering",
          status: "Discharged",
          bloodGroup: "O+",
          phone: "+1 555-1003",
          email: "gamma@hospital.org",
          registrationDate: new Date("2026-03-15T10:00:00Z"),
          createdAt: new Date("2026-03-15T10:00:00Z"),
        },
      ]);
    });

    it("paginates patients properly", async () => {
      const res = await request(app)
        .get("/api/patients?page=1&limit=2")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.length).toBe(2);
      expect(res.body.total).toBe(3);
    });

    it("filters patients by condition and status", async () => {
      const res = await request(app)
        .get("/api/patients?condition=Critical&status=Admitted")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.length).toBe(1);
      expect(res.body.data[0].name).toBe("Patient Alpha");
    });

    it("searches patients safely without crashing", async () => {
      const res = await request(app)
        .get("/api/patients?search=Beta")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.length).toBe(1);
      expect(res.body.data[0].name).toBe("Patient Beta");
    });

    it("filters patients by date range", async () => {
      const res = await request(app)
        .get("/api/patients?startDate=2026-01-01&endDate=2026-01-31")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.length).toBe(1);
      expect(res.body.data[0].name).toBe("Patient Alpha");
    });
  });
});

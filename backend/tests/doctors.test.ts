import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import app from "../src/server.js";
import { Doctor } from "../src/models/Doctor.js";
import { Patient } from "../src/models/Patient.js";
import { createTestUser } from "./testHelpers.js";

describe("Doctors API Integration & Query Suite", () => {
  let adminToken: string;

  beforeEach(async () => {
    const admin = await createTestUser("admin");
    adminToken = admin.token;
  });

  describe("Doctor Creation & Validation", () => {
    it("allows admin to create a valid doctor with specialization", async () => {
      const res = await request(app)
        .post("/api/doctors")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          name: "Dr. Sarah Mitchell",
          specialization: "Cardiology",
          hospital: "Metropolitan General",
          phone: "+1 555-0199",
          email: "sarah.mitchell@metrogeneral.org",
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.name).toBe("Dr. Sarah Mitchell");
      expect(res.body.data.specialty).toBe("Cardiology");
      expect(res.body.data.email).toBe("sarah.mitchell@metrogeneral.org");
    });

    it("rejects doctor creation with invalid email or missing fields with 400", async () => {
      const res = await request(app)
        .post("/api/doctors")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          name: "Dr. Incomplete",
          email: "not-an-email",
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.errors).toBeDefined();
    });

    it("rejects duplicate doctor email with 400", async () => {
      const payload = {
        name: "Dr. Duplicate First",
        specialization: "Neurology",
        hospital: "City Central",
        phone: "+1 555-0123",
        email: "duplicate@careguide.org",
      };

      await request(app)
        .post("/api/doctors")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(payload);

      const res = await request(app)
        .post("/api/doctors")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ ...payload, name: "Dr. Duplicate Second" });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/already exists/i);
    });

    it("returns 400 for malformed ObjectId param", async () => {
      const res = await request(app)
        .get("/api/doctors/invalid-object-id")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.errors).toBeDefined();
    });
  });

  describe("Server-driven List, Search, Filter & Pagination", () => {
    beforeEach(async () => {
      // Seed 5 doctors
      await Doctor.create([
        {
          name: "Dr. Alice Smith",
          specialty: "Cardiology",
          roomNumber: "Room 101",
          hospital: "City Hospital",
          phone: "+1 555-0101",
          email: "alice@city.org",
          status: "Active",
          createdAt: new Date("2026-01-10T12:00:00Z"),
        },
        {
          name: "Dr. Bob Jones",
          specialty: "Neurology",
          roomNumber: "Room 102",
          hospital: "Metro Care",
          phone: "+1 555-0102",
          email: "bob@metro.org",
          status: "Active",
          createdAt: new Date("2026-02-15T12:00:00Z"),
        },
        {
          name: "Dr. Charlie Brown",
          specialty: "Cardiology",
          roomNumber: "Room 103",
          hospital: "Metro Care",
          phone: "+1 555-0103",
          email: "charlie@metro.org",
          status: "Off Duty",
          createdAt: new Date("2026-03-20T12:00:00Z"),
        },
        {
          name: "Dr. Diana Prince",
          specialty: "Pediatrics",
          roomNumber: "Room 104",
          hospital: "City Hospital",
          phone: "+1 555-0104",
          email: "diana@city.org",
          status: "Active",
          createdAt: new Date("2026-04-05T12:00:00Z"),
        },
        {
          name: "Dr. Evan Wright",
          specialty: "Orthopedics",
          roomNumber: "Room 105",
          hospital: "St. Jude Clinic",
          phone: "+1 555-0105",
          email: "evan@stjude.org",
          status: "Active",
          createdAt: new Date("2026-05-12T12:00:00Z"),
        },
      ]);
    });

    it("paginates doctors list correctly", async () => {
      const res = await request(app)
        .get("/api/doctors?page=1&limit=2")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.length).toBe(2);
      expect(res.body.total).toBe(5);
      expect(res.body.totalPages).toBe(3);
    });

    it("filters doctors by specialty and status", async () => {
      const res = await request(app)
        .get("/api/doctors?specialty=Cardiology&status=Active")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.length).toBe(1);
      expect(res.body.data[0].name).toBe("Dr. Alice Smith");
    });

    it("searches doctors safely without regex injection crash", async () => {
      const res = await request(app)
        .get("/api/doctors?search=Alice")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.length).toBe(1);
      expect(res.body.data[0].name).toBe("Dr. Alice Smith");

      // Test with special regex characters
      const regexRes = await request(app)
        .get("/api/doctors?search=.*+?^${}()|[]\\")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(regexRes.status).toBe(200);
      expect(regexRes.body.data.length).toBe(0);
    });

    it("filters doctors by date range", async () => {
      const res = await request(app)
        .get("/api/doctors?startDate=2026-01-01&endDate=2026-02-28")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.length).toBe(2);
    });
  });

  describe("Doctor's Patients Sub-resource Operations", () => {
    it("supports adding a patient under a doctor and viewing the list", async () => {
      const doctor = await Doctor.create({
        name: "Dr. Primary Physician",
        specialty: "General Practice",
        roomNumber: "Room 101",
        hospital: "Metro Care",
        phone: "+1 555-0999",
        email: "primary@metro.org",
        status: "Active",
      });

      // Add patient under this doctor
      const addRes = await request(app)
        .post(`/api/doctors/${doctor._id}/patients`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          name: "John Patient",
          age: 45,
          gender: "Male",
          phone: "+1 555-1111",
          email: "john@patient.org",
          condition: "Chronic",
        });

      expect(addRes.status).toBe(201);
      expect(addRes.body.success).toBe(true);
      const patientId = addRes.body.data._id;

      // Doctor's patientCount should now be 1
      const updatedDoc = await Doctor.findById(doctor._id);
      expect(updatedDoc?.patientCount).toBe(1);

      // View doctor's patients
      const listRes = await request(app)
        .get(`/api/doctors/${doctor._id}/patients`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(listRes.status).toBe(200);
      expect(listRes.body.data.length).toBe(1);
      expect(listRes.body.data[0].name).toBe("John Patient");

      // Delete patient from doctor's list
      const delRes = await request(app)
        .delete(`/api/doctors/${doctor._id}/patients/${patientId}`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(delRes.status).toBe(200);

      // Verify patient is deleted and counter decremented
      const docAfterDel = await Doctor.findById(doctor._id);
      expect(docAfterDel?.patientCount).toBe(0);

      const patientRecord = await Patient.findById(patientId);
      expect(patientRecord).toBeNull();
    });
  });
});

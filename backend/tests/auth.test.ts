import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import app from "../src/server.js";
import { User } from "../src/models/User.js";
import { createTestUser } from "./testHelpers.js";

describe("Authentication & Authorization Security Suite", () => {
  describe("Protected Routes Lockdown (401 without token)", () => {
    const protectedRoutes = [
      { method: "get", path: "/api/doctors" },
      { method: "get", path: "/api/patients" },
      { method: "get", path: "/api/departments" },
      { method: "get", path: "/api/appointments" },
      { method: "get", path: "/api/invoices" },
      { method: "get", path: "/api/logs" },
      { method: "get", path: "/api/analytics/dashboard" },
      { method: "post", path: "/api/system/reset-database" },
      { method: "get", path: "/api/auth/me" },
    ];

    for (const route of protectedRoutes) {
      it(`blocks unauthenticated ${route.method.toUpperCase()} ${route.path} with 401`, async () => {
        let req;
        if (route.method === "get") {
          req = request(app).get(route.path);
        } else {
          req = request(app).post(route.path);
        }
        const res = await req;
        expect(res.status).toBe(401);
        expect(res.body.success).toBe(false);
      });
    }
  });

  describe("Role-Based Authorization (403 for non-admin)", () => {
    it("returns 403 when a staff user attempts admin-only doctor creation", async () => {
      const { token } = await createTestUser("staff");
      const res = await request(app)
        .post("/api/doctors")
        .set("Authorization", `Bearer ${token}`)
        .send({
          name: "Dr. Hacker",
          specialization: "Cardiology",
          hospital: "City Hospital",
          phone: "+1 555-0100",
          email: "hacker@hospital.com",
        });

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
    });

    it("returns 403 when a staff user attempts user registration", async () => {
      const { token } = await createTestUser("staff");
      const res = await request(app)
        .post("/api/auth/register")
        .set("Authorization", `Bearer ${token}`)
        .send({
          name: "New Admin",
          email: "escalate@test.com",
          password: "Password123!",
          role: "admin",
        });

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
    });

    it("returns 403 when a staff user attempts system reset", async () => {
      const { token } = await createTestUser("staff");
      const res = await request(app)
        .post("/api/system/reset-database")
        .set("Authorization", `Bearer ${token}`)
        .send({ confirm: "CONFIRM_RESET_DATABASE" });

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
    });
  });

  describe("Login Endpoint Security", () => {
    beforeEach(async () => {
      await User.create({
        name: "Admin User",
        email: "testadmin@doctortracker.com",
        password: "SecretPassword123!",
        role: "admin",
      });
    });

    it("returns identical error message for nonexistent email vs incorrect password", async () => {
      const resWrongEmail = await request(app)
        .post("/api/auth/login")
        .send({ email: "nonexistent@test.com", password: "SecretPassword123!" });

      const resWrongPassword = await request(app)
        .post("/api/auth/login")
        .send({ email: "testadmin@doctortracker.com", password: "WrongPassword!" });

      expect(resWrongEmail.status).toBe(401);
      expect(resWrongPassword.status).toBe(401);
      expect(resWrongEmail.body.message).toBe("Invalid work email or password.");
      expect(resWrongPassword.body.message).toBe("Invalid work email or password.");
    });

    it("supports case-insensitive email login", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({ email: "TESTADMIN@doctortracker.com", password: "SecretPassword123!" });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.token).toBeDefined();
      expect(res.body.data.email).toBe("testadmin@doctortracker.com");

      // Verify refreshToken cookie is set
      const cookies = res.headers["set-cookie"];
      expect(cookies).toBeDefined();
      expect(cookies.some((c: string) => c.includes("refreshToken="))).toBe(true);
    });
  });

  describe("Token Refresh & Logout Flow", () => {
    it("handles silent refresh rotation via httpOnly cookie", async () => {
      const { user } = await createTestUser("admin");
      
      // Perform login to receive initial refresh cookie
      const loginRes = await request(app)
        .post("/api/auth/login")
        .send({ email: user.email, password: "Password123!" });

      const cookies = loginRes.headers["set-cookie"];
      expect(cookies).toBeDefined();

      // Hit /auth/refresh using cookie
      const refreshRes = await request(app)
        .post("/api/auth/refresh")
        .set("Cookie", cookies);

      expect(refreshRes.status).toBe(200);
      expect(refreshRes.body.success).toBe(true);
      expect(refreshRes.body.data.token).toBeDefined();

      // Logout should clear cookie
      const logoutRes = await request(app)
        .post("/api/auth/logout")
        .set("Cookie", refreshRes.headers["set-cookie"] || cookies);

      expect(logoutRes.status).toBe(200);
      expect(logoutRes.body.success).toBe(true);
    });
  });

  describe("Database Reset Endpoint Safeguards", () => {
    it("refuses reset without explicit confirmation body", async () => {
      const { token } = await createTestUser("admin");
      const res = await request(app)
        .post("/api/system/reset-database")
        .set("Authorization", `Bearer ${token}`)
        .send({});

      expect(res.status).toBe(400);
      expect(res.body.errors).toBeDefined();
    });

    it("refuses reset when ALLOW_DB_RESET is false even for admin", async () => {
      const { token } = await createTestUser("admin");
      const res = await request(app)
        .post("/api/system/reset-database")
        .set("Authorization", `Bearer ${token}`)
        .send({ confirm: "CONFIRM_RESET_DATABASE" });

      expect(res.status).toBe(403);
      expect(res.body.message).toMatch(/disabled/i);
    });
  });
});

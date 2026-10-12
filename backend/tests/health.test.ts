import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../src/server.js";

describe("Health API", () => {
  it("GET /api/health should return 200 with status ok", async () => {
    const res = await request(app).get("/api/health");
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.status).toBe("healthy");
  });
});

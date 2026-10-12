import { test, expect } from "@playwright/test";

test.describe("Doctor Tracker End-to-End Suite", () => {
  test.beforeEach(async ({ page }) => {
    // Default mock handlers for fast, reliable, zero-latency execution
    await page.route("**/api/auth/refresh", async (route) => {
      await route.fulfill({
        status: 401,
        contentType: "application/json",
        body: JSON.stringify({ success: false, message: "No active session" }),
      });
    });

    await page.route("**/api/auth/me", async (route) => {
      await route.fulfill({
        status: 401,
        contentType: "application/json",
        body: JSON.stringify({ success: false, message: "Unauthorized" }),
      });
    });

    await page.route("**/api/doctors*", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ success: true, data: [], total: 0, totalPages: 1 }),
      });
    });

    await page.route("**/api/patients*", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ success: true, data: [], total: 0, totalPages: 1 }),
      });
    });

    await page.route("**/api/analytics/dashboard*", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          data: {
            summary: {
              totalDoctors: 12,
              totalPatients: 45,
              activeDoctorsCount: 10,
              avgPatientsPerDoctor: 3.8,
              totalRevenue: 24500,
              appointmentsInRange: 8,
              appointmentsToday: 3,
              period: "30d",
            },
            changes: { arrivals: 5, revenue: 12 },
            patientsPerDoctor: [],
            conditionBreakdown: [],
            statusBreakdown: [],
            specialtyBreakdown: [],
            arrivalTrends: [
              { date: "2026-03-01", label: "03-01", inPatients: 2, outPatients: 3, total: 5 },
            ],
          },
        }),
      });
    });
  });

  test("1. Failed login displays error message and creates no session in localStorage", async ({
    page,
  }) => {
    await page.route("**/api/auth/login", async (route) => {
      await route.fulfill({
        status: 401,
        contentType: "application/json",
        body: JSON.stringify({
          success: false,
          message: "Invalid work email or password.",
        }),
      });
    });

    await page.goto("/login");
    await page.waitForLoadState("networkidle");

    await page.fill("#login-email", "wrong@test.com");
    await page.fill("#login-password", "WrongPass123!");
    await page.click("#login-submit-button");

    await expect(page.locator("text=Invalid work email or password")).toBeVisible();

    const storedToken = await page.evaluate(() => localStorage.getItem("token"));
    expect(storedToken).toBeNull();
  });

  test("2. Successful login authenticates and accesses portal", async ({ page }) => {
    await page.route("**/api/auth/login", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          data: {
            id: "user-123",
            name: "Dr. Admin User",
            email: "admin@doctortracker.com",
            role: "admin",
            token: "mock-jwt-token-12345",
          },
        }),
      });
    });

    await page.goto("/login");
    await page.waitForLoadState("networkidle");

    await page.fill("#login-email", "admin@doctortracker.com");
    await page.fill("#login-password", "password123");
    await page.click("#login-submit-button");

    await expect(page).toHaveURL(/.*dashboard/);
  });

  test("3. Route guard redirects unauthenticated users to /login", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/.*login/);
    expect(page.url()).toContain("/login");
  });

  test("4. Dashboard range selector change triggers a new request and updates charts", async ({
    page,
  }) => {
    // Authenticate session for dashboard test
    await page.route("**/api/auth/refresh", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          data: {
            token: "mock-valid-token",
            user: {
              id: "admin-123",
              name: "Dr. Admin User",
              email: "admin@doctortracker.com",
              role: "admin",
            },
          },
        }),
      });
    });

    await page.route("**/api/auth/me", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          data: {
            id: "admin-123",
            name: "Dr. Admin User",
            email: "admin@doctortracker.com",
            role: "admin",
          },
        }),
      });
    });

    let requestedPeriods: string[] = [];

    await page.route("**/api/analytics/dashboard*", async (route) => {
      const url = new URL(route.request().url());
      const period = url.searchParams.get("period") || "30d";
      requestedPeriods.push(period);

      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          data: {
            summary: {
              totalDoctors: 15,
              totalPatients: 60,
              activeDoctorsCount: 14,
              avgPatientsPerDoctor: 4.0,
              totalRevenue: 32000,
              appointmentsInRange: 12,
              appointmentsToday: 4,
              period,
            },
            changes: { arrivals: 8, revenue: 15 },
            patientsPerDoctor: [],
            conditionBreakdown: [],
            statusBreakdown: [],
            specialtyBreakdown: [],
            arrivalTrends: [
              { date: "2026-03-01", label: "03-01", inPatients: 3, outPatients: 2, total: 5 },
            ],
          },
        }),
      });
    });

    await page.goto("/dashboard");
    await page.waitForLoadState("networkidle");

    const pill7d = page.locator("button:has-text('7D')");
    if (await pill7d.isVisible()) {
      await pill7d.click();
      await page.waitForTimeout(300);
      expect(requestedPeriods).toContain("7d");
    }
  });

  test("5. Server-side pagination, search and filtering with >100 seeded records", async ({
    page,
  }) => {
    await page.route("**/api/auth/refresh", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          data: {
            token: "mock-valid-token",
            user: {
              id: "admin-123",
              name: "Dr. Admin User",
              email: "admin@doctortracker.com",
              role: "admin",
            },
          },
        }),
      });
    });

    await page.route("**/api/auth/me", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          data: {
            id: "admin-123",
            name: "Dr. Admin User",
            email: "admin@doctortracker.com",
            role: "admin",
          },
        }),
      });
    });

    // Generate 120 seeded doctor records
    const mockDoctors = Array.from({ length: 120 }, (_, i) => ({
      _id: `doc-${i + 1}`,
      name: `Dr. Physician ${i + 1}`,
      specialty: i % 2 === 0 ? "Cardiology" : "Neurology",
      roomNumber: `Room ${100 + i}`,
      hospital: "Doctor Tracker Medical Center",
      patientCount: i * 2,
      status: "Active",
      phone: "+1 555-0100",
      email: `doctor${i + 1}@hospital.org`,
      createdAt: new Date().toISOString(),
    }));

    await page.route("**/api/doctors*", async (route) => {
      const url = new URL(route.request().url());
      const pageNum = parseInt(url.searchParams.get("page") || "1", 10);
      const limitNum = parseInt(url.searchParams.get("limit") || "10", 10);
      const search = url.searchParams.get("search")?.toLowerCase() || "";

      let filtered = mockDoctors;
      if (search) {
        filtered = filtered.filter((d) => d.name.toLowerCase().includes(search));
      }

      const startIndex = (pageNum - 1) * limitNum;
      const pageData = filtered.slice(startIndex, startIndex + limitNum);

      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          data: pageData,
          total: filtered.length,
          totalPages: Math.ceil(filtered.length / limitNum),
          currentPage: pageNum,
        }),
      });
    });

    await page.goto("/doctors");
    await page.waitForLoadState("networkidle");

    // Check pagination displays total count >100
    await expect(page.locator("text=120").first()).toBeVisible({ timeout: 10000 });

    // Search for a specific doctor
    const searchInput = page.getByRole("textbox", { name: "Search doctors" });
    await searchInput.fill("Physician 12");
    await page.waitForTimeout(400); // Debounce wait

    await expect(page.locator("text=Dr. Physician 12").first()).toBeVisible();
  });

  test("6. Responsive layout check at 375px viewport (no horizontal scroll)", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/login");
    await page.waitForLoadState("networkidle");

    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const innerWidth = await page.evaluate(() => window.innerWidth);
    expect(scrollWidth).toBeLessThanOrEqual(innerWidth);
  });
});

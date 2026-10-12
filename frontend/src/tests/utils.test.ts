import { describe, it, expect, vi } from "vitest";
import { formatDate, formatLocalDateToYMD } from "../lib/utils.js";
import { buildFilterQueryString, debounce } from "../lib/queryUtils.js";

describe("Frontend Core Utilities Test Suite", () => {
  describe("Timezone-safe Date Formatting", () => {
    it("formats YYYY-MM-DD date strings without UTC day-shift regression", () => {
      // Regardless of local time zone, 2026-05-15 must format as May 15, 2026
      const formatted = formatDate("2026-05-15");
      expect(formatted).toBe("May 15, 2026");
    });

    it("handles Date objects properly", () => {
      const date = new Date(2026, 0, 10); // Jan 10, 2026
      expect(formatDate(date)).toBe("Jan 10, 2026");
    });

    it("handles null, undefined and invalid date strings gracefully", () => {
      expect(formatDate(null)).toBe("N/A");
      expect(formatDate(undefined)).toBe("N/A");
      expect(formatDate("not-a-valid-date")).toBe("N/A");
    });

    it("formats local Date to YYYY-MM-DD string without UTC offset shifts", () => {
      const date = new Date(2026, 7, 24); // Aug 24, 2026
      expect(formatLocalDateToYMD(date)).toBe("2026-08-24");
    });
  });

  describe("Debounce Utility", () => {
    it("debounces rapid invocations and executes only the last call", async () => {
      vi.useFakeTimers();
      const callback = vi.fn();
      const debouncedFn = debounce(callback, 300);

      debouncedFn("first");
      debouncedFn("second");
      debouncedFn("third");

      expect(callback).not.toHaveBeenCalled();

      vi.advanceTimersByTime(299);
      expect(callback).not.toHaveBeenCalled();

      vi.advanceTimersByTime(1);
      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenCalledWith("third");

      vi.useRealTimers();
    });

    it("cancels pending executions when cancel() is called", () => {
      vi.useFakeTimers();
      const callback = vi.fn();
      const debouncedFn = debounce(callback, 300);

      debouncedFn("test");
      debouncedFn.cancel();

      vi.advanceTimersByTime(350);
      expect(callback).not.toHaveBeenCalled();

      vi.useRealTimers();
    });
  });

  describe("Filter-to-Query Mapping", () => {
    it("maps filter state into a clean query string, ignoring defaults and empty values", () => {
      const filters = {
        search: "Cardiology",
        condition: "All", // default sentinel should be ignored
        status: "Active",
        page: 2,
        limit: 25,
        hospital: "", // empty string should be ignored
        customTag: undefined, // undefined should be ignored
        secondaryTag: null, // null should be ignored
      };

      const qs = buildFilterQueryString(filters);
      expect(qs).toContain("search=Cardiology");
      expect(qs).toContain("status=Active");
      expect(qs).toContain("page=2");
      expect(qs).toContain("limit=25");
      expect(qs).not.toContain("condition");
      expect(qs).not.toContain("hospital");
      expect(qs).not.toContain("customTag");
      expect(qs).not.toContain("secondaryTag");
      expect(qs.startsWith("?")).toBe(true);
    });

    it("returns empty string when all filter values are empty or defaults", () => {
      const filters = {
        search: "",
        condition: "All",
        status: "All",
      };

      expect(buildFilterQueryString(filters)).toBe("");
    });
  });
});

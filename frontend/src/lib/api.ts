/**
 * Healthcare API Service Client for Doctor Tracker
 * Connects Next.js frontend to backend Express REST endpoints
 */

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  count?: number;
  total?: number;
  totalPages?: number;
  currentPage?: number;
}

// In-memory access token storage (never persisted to localStorage)
let inMemoryAccessToken: string | null = null;
let onAuthFailureCallback: (() => void) | null = null;

export function setAccessToken(token: string | null): void {
  inMemoryAccessToken = token;
}

export function getAccessToken(): string | null {
  return inMemoryAccessToken;
}

export function setOnAuthFailure(callback: () => void): void {
  onAuthFailureCallback = callback;
}

let isRefreshing = false;
let refreshSubscribers: ((token: string | null) => void)[] = [];

function subscribeTokenRefresh(cb: (token: string | null) => void) {
  refreshSubscribers.push(cb);
}

function onRefreshed(token: string | null) {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
}

// Generic fetch wrapper with in-memory auth injection, credentials, and 401 refresh handling
async function request<T>(
  endpoint: string,
  options: RequestInit = {},
  isRetry = false
): Promise<ApiResponse<T>> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(inMemoryAccessToken
      ? { Authorization: `Bearer ${inMemoryAccessToken}` }
      : {}),
    ...((options.headers as Record<string, string>) || {}),
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      credentials: "include", // Send and receive httpOnly cookies (for refresh token)
      headers,
    });

    // Handle 401 Unauthorized globally
    if (response.status === 401 && !isRetry && !endpoint.startsWith("/auth/")) {
      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const refreshRes = await fetch(`${API_BASE_URL}/auth/refresh`, {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
          });

          if (refreshRes.ok) {
            const refreshData = await refreshRes.json();
            const newToken = refreshData?.data?.token || null;
            setAccessToken(newToken);
            isRefreshing = false;
            onRefreshed(newToken);

            if (newToken) {
              return request<T>(endpoint, options, true);
            }
          }
        } catch {
          // Refresh failed
        }

        isRefreshing = false;
        onRefreshed(null);
        setAccessToken(null);
        if (onAuthFailureCallback) {
          onAuthFailureCallback();
        } else if (typeof window !== "undefined" && window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
      } else {
        // Wait for active refresh
        return new Promise<ApiResponse<T>>((resolve) => {
          subscribeTokenRefresh((newToken) => {
            if (newToken) {
              resolve(request<T>(endpoint, options, true));
            } else {
              resolve({
                success: false,
                message: "Authentication session expired.",
              });
            }
          });
        });
      }
    }

    const data = await response.json();
    return data;
  } catch (error) {
    return {
      success: false,
      message: (error as Error).message || "Network request failed",
    };
  }
}

export const api = {
  // Authentication
  auth: {
    login: (credentials: { email: string; password?: string }) =>
      request("/auth/login", {
        method: "POST",
        body: JSON.stringify(credentials),
      }),
    refresh: () =>
      request("/auth/refresh", {
        method: "POST",
      }),
    logout: () =>
      request("/auth/logout", {
        method: "POST",
      }),
    getMe: () => request("/auth/me"),
    register: (userData: any) =>
      request("/auth/register", {
        method: "POST",
        body: JSON.stringify(userData),
      }),
  },

  // Doctors
  doctors: {
    getAll: (params?: {
      search?: string;
      specialty?: string;
      status?: string;
      hospital?: string;
      startDate?: string;
      endDate?: string;
      sortBy?: string;
      order?: "asc" | "desc";
      page?: number;
      limit?: number;
    }) => {
      const query = new URLSearchParams();
      if (params?.search) query.set("search", params.search);
      if (params?.specialty && params.specialty !== "All")
        query.set("specialty", params.specialty);
      if (params?.status && params.status !== "All")
        query.set("status", params.status);
      if (params?.hospital && params.hospital !== "All")
        query.set("hospital", params.hospital);
      if (params?.startDate) query.set("startDate", params.startDate);
      if (params?.endDate) query.set("endDate", params.endDate);
      if (params?.sortBy) query.set("sortBy", params.sortBy);
      if (params?.order) query.set("order", params.order);
      if (params?.page) query.set("page", params.page.toString());
      if (params?.limit) query.set("limit", params.limit.toString());
      return request(`/doctors?${query.toString()}`);
    },
    getById: (id: string) => request(`/doctors/${id}`),
    create: (data: any) =>
      request("/doctors", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    update: (id: string, data: any) =>
      request(`/doctors/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    delete: (id: string) =>
      request(`/doctors/${id}`, {
        method: "DELETE",
      }),
    addPatient: (doctorId: string, patientData: any) =>
      request(`/doctors/${doctorId}/patients`, {
        method: "POST",
        body: JSON.stringify(patientData),
      }),
    removePatient: (doctorId: string, patientId: string) =>
      request(`/doctors/${doctorId}/patients/${patientId}`, {
        method: "DELETE",
      }),
  },

  // Patients
  patients: {
    getAll: (params?: {
      search?: string;
      condition?: string;
      status?: string;
      bloodGroup?: string;
      doctorId?: string;
      startDate?: string;
      endDate?: string;
      sortBy?: string;
      order?: "asc" | "desc";
      page?: number;
      limit?: number;
    }) => {
      const query = new URLSearchParams();
      if (params?.search) query.set("search", params.search);
      if (params?.condition && params.condition !== "All")
        query.set("condition", params.condition);
      if (params?.status && params.status !== "All")
        query.set("status", params.status);
      if (params?.bloodGroup && params.bloodGroup !== "All")
        query.set("bloodGroup", params.bloodGroup);
      if (params?.doctorId && params.doctorId !== "All")
        query.set("doctorId", params.doctorId);
      if (params?.startDate) query.set("startDate", params.startDate);
      if (params?.endDate) query.set("endDate", params.endDate);
      if (params?.sortBy) query.set("sortBy", params.sortBy);
      if (params?.order) query.set("order", params.order);
      if (params?.page) query.set("page", params.page.toString());
      if (params?.limit) query.set("limit", params.limit.toString());
      return request(`/patients?${query.toString()}`);
    },
    getById: (id: string) => request(`/patients/${id}`),
    create: (data: any) =>
      request("/patients", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    update: (id: string, data: any) =>
      request(`/patients/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    delete: (id: string) =>
      request(`/patients/${id}`, {
        method: "DELETE",
      }),
  },

  // Departments
  departments: {
    getAll: (params?: {
      search?: string;
      floor?: string;
      emergencyOnly?: boolean;
      load?: string;
    }) => {
      const query = new URLSearchParams();
      if (params?.search) query.set("search", params.search);
      if (params?.floor && params.floor !== "All") query.set("floor", params.floor);
      if (params?.emergencyOnly) query.set("emergencyOnly", "true");
      if (params?.load && params.load !== "All") query.set("load", params.load);
      return request(`/departments?${query.toString()}`);
    },
    getById: (id: string) => request(`/departments/${id}`),
    create: (data: any) =>
      request("/departments", {
        method: "POST",
        body: JSON.stringify(data),
      }),
  },

  // Appointments
  appointments: {
    getAll: (params?: {
      search?: string;
      status?: string;
      doctorId?: string;
      date?: string;
      page?: number;
      limit?: number;
    }) => {
      const query = new URLSearchParams();
      if (params?.search) query.set("search", params.search);
      if (params?.status && params.status !== "All") query.set("status", params.status);
      if (params?.doctorId && params.doctorId !== "All") query.set("doctorId", params.doctorId);
      if (params?.date) query.set("date", params.date);
      if (params?.page) query.set("page", params.page.toString());
      if (params?.limit) query.set("limit", params.limit.toString());
      return request(`/appointments?${query.toString()}`);
    },
    create: (data: any) =>
      request("/appointments", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    updateStatus: (id: string, status: string) =>
      request(`/appointments/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      }),
    cancel: (id: string) =>
      request(`/appointments/${id}`, {
        method: "DELETE",
      }),
  },

  // Invoices & Billing
  invoices: {
    getAll: (params?: {
      search?: string;
      status?: string;
      department?: string;
      page?: number;
      limit?: number;
    }) => {
      const query = new URLSearchParams();
      if (params?.search) query.set("search", params.search);
      if (params?.status && params.status !== "All") query.set("status", params.status);
      if (params?.department && params.department !== "All") query.set("department", params.department);
      if (params?.page) query.set("page", params.page.toString());
      if (params?.limit) query.set("limit", params.limit.toString());
      return request(`/invoices?${query.toString()}`);
    },
    create: (data: any) =>
      request("/invoices", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    markPaid: (id: string) =>
      request(`/invoices/${id}/pay`, {
        method: "PATCH",
      }),
  },

  // Activity Logs
  logs: {
    getAll: (params?: {
      category?: string;
      status?: string;
      search?: string;
      page?: number;
      limit?: number;
    }) => {
      const query = new URLSearchParams();
      if (params?.category && params.category !== "All") query.set("category", params.category);
      if (params?.status && params.status !== "All") query.set("status", params.status);
      if (params?.search) query.set("search", params.search);
      if (params?.page) query.set("page", params.page.toString());
      if (params?.limit) query.set("limit", params.limit.toString());
      return request(`/logs?${query.toString()}`);
    },
    create: (data: any) =>
      request("/logs", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    clear: () =>
      request("/logs", {
        method: "DELETE",
      }),
  },

  // Analytics & Aggregates
  analytics: {
    getDashboard: (params?: {
      from?: string;
      to?: string;
      hospital?: string;
      specialty?: string;
      period?: string;
    }) => {
      const query = new URLSearchParams();
      if (params?.from) query.set("from", params.from);
      if (params?.to) query.set("to", params.to);
      if (params?.hospital && params.hospital !== "All") query.set("hospital", params.hospital);
      if (params?.specialty && params.specialty !== "All") query.set("specialty", params.specialty);
      if (params?.period) query.set("period", params.period);
      const queryString = query.toString();
      return request(`/analytics/dashboard${queryString ? `?${queryString}` : ""}`);
    },
  },

  // System & Database Administration
  system: {
    resetDatabase: (confirm = "CONFIRM_RESET_DATABASE") =>
      request("/system/reset-database", {
        method: "POST",
        body: JSON.stringify({ confirm }),
      }),
  },
};

/**
 * Healthcare API Service Client for Doctor Tracker
 * Connects frontend client to backend Node.js/Express REST endpoints
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  count?: number;
  total?: number;
  totalPages?: number;
  currentPage?: number;
}

// Generic fetch wrapper with auth header injection
async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("medcare_token") : null;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    "Cache-Control": "no-cache, no-store, must-revalidate",
    "Pragma": "no-cache",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      cache: "no-store",
      headers,
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.warn(`[API Client Warning] Failed request to ${endpoint}:`, (error as Error).message);
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
    register: (userData: any) =>
      request("/auth/register", {
        method: "POST",
        body: JSON.stringify(userData),
      }),
    getMe: () => request("/auth/me"),
  },

  // Doctors
  doctors: {
    getAll: (params?: {
      search?: string;
      specialty?: string;
      status?: string;
      page?: number;
      limit?: number;
    }) => {
      const query = new URLSearchParams();
      if (params?.search) query.set("search", params.search);
      if (params?.specialty && params.specialty !== "All")
        query.set("specialty", params.specialty);
      if (params?.status && params.status !== "All")
        query.set("status", params.status);
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
    getDashboard: () => request("/analytics/dashboard"),
  },

  // System & Database Administration
  system: {
    resetDatabase: () =>
      request("/system/reset-database", {
        method: "POST",
      }),
  },
};

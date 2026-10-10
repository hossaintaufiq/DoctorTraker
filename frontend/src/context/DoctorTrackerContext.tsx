"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  Doctor,
  Patient,
  MetricSummary,
  NotificationItem,
  ToastMessage,
  PatientGrowthData,
} from "@/lib/types";
import {
  INITIAL_DOCTORS,
  INITIAL_PATIENTS,
  INITIAL_METRICS,
  INITIAL_NOTIFICATIONS,
  PATIENT_GROWTH_MONTHLY,
  PATIENT_GROWTH_WEEKLY,
} from "@/lib/mock-data";
import { api } from "@/lib/api";

interface DoctorTrackerContextType {
  doctors: Doctor[];
  patients: Patient[];
  metrics: MetricSummary[];
  notifications: NotificationItem[];
  unreadNotificationCount: number;
  toasts: ToastMessage[];
  dateRange: string;
  setDateRange: (range: string) => void;
  growthPeriod: "Monthly" | "Weekly";
  setGrowthPeriod: (period: "Monthly" | "Weekly") => void;
  growthData: PatientGrowthData[];

  // Doctor Modals & Selection
  isAddDoctorModalOpen: boolean;
  setIsAddDoctorModalOpen: (open: boolean) => void;
  isEditDoctorModalOpen: boolean;
  setIsEditDoctorModalOpen: (open: boolean) => void;
  editingDoctor: Doctor | null;
  setEditingDoctor: (doctor: Doctor | null) => void;

  // Patient Modals & Selection
  isAddPatientModalOpen: boolean;
  setIsAddPatientModalOpen: (open: boolean) => void;
  isEditPatientModalOpen: boolean;
  setIsEditPatientModalOpen: (open: boolean) => void;
  editingPatient: Patient | null;
  setEditingPatient: (patient: Patient | null) => void;
  selectedDoctorForNewPatient: Doctor | null;
  setSelectedDoctorForNewPatient: (doctor: Doctor | null) => void;

  // Layout & Theme
  isMobileSidebarOpen: boolean;
  setIsMobileSidebarOpen: (open: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  theme: "light";

  // Actions
  addDoctor: (doctor: Omit<Doctor, "id" | "patientCount" | "rating" | "joinedDate">) => void;
  updateDoctor: (id: string, data: Partial<Doctor>) => void;
  deleteDoctor: (id: string) => void;
  addPatient: (patient: Omit<Patient, "id" | "patientCode" | "registrationDate" | "lastVisit">) => void;
  updatePatient: (id: string, data: Partial<Patient>) => void;
  deletePatient: (id: string) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  showToast: (title: string, description?: string, type?: "success" | "info" | "warning" | "error") => void;
  removeToast: (id: string) => void;
  refreshData: () => Promise<void>;
}

const DoctorTrackerContext = createContext<DoctorTrackerContextType | undefined>(undefined);

export function DoctorTrackerProvider({ children }: { children: React.ReactNode }) {
  const [doctors, setDoctors] = useState<Doctor[]>(INITIAL_DOCTORS);
  const [patients, setPatients] = useState<Patient[]>(INITIAL_PATIENTS);
  const [metrics, setMetrics] = useState<MetricSummary[]>(INITIAL_METRICS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [dateRange, setDateRange] = useState<string>("Last 30 Days");
  const [growthPeriod, setGrowthPeriod] = useState<"Monthly" | "Weekly">("Monthly");

  // Doctor Modals
  const [isAddDoctorModalOpen, setIsAddDoctorModalOpen] = useState(false);
  const [isEditDoctorModalOpen, setIsEditDoctorModalOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);

  // Patient Modals
  const [isAddPatientModalOpen, setIsAddPatientModalOpen] = useState(false);
  const [isEditPatientModalOpen, setIsEditPatientModalOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [selectedDoctorForNewPatient, setSelectedDoctorForNewPatient] = useState<Doctor | null>(null);

  // Layout & Theme (Strict Light Theme)
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const theme = "light" as const;

  useEffect(() => {
    localStorage.removeItem("medcare_theme");
    document.documentElement.classList.remove("dark");
  }, []);

  const unreadNotificationCount = notifications.filter((n) => !n.read).length;
  const growthData = growthPeriod === "Monthly" ? PATIENT_GROWTH_MONTHLY : PATIENT_GROWTH_WEEKLY;

  // Initial load from backend API if available
  const refreshData = async () => {
    try {
      const [doctorsRes, patientsRes] = await Promise.all([
        api.doctors.getAll(),
        api.patients.getAll(),
      ]);

      if (doctorsRes.success && Array.isArray(doctorsRes.data) && doctorsRes.data.length > 0) {
        const mappedDoctors: Doctor[] = doctorsRes.data.map((d: any) => ({
          id: d._id || d.id,
          name: d.name,
          specialty: d.specialty,
          hospital: d.hospital || "Medcare Central Hospital",
          email: d.email,
          phone: d.phone,
          roomNumber: d.roomNumber,
          patientCount: d.patientCount || 0,
          maxPatients: d.maxPatients || 300,
          experienceYears: d.experienceYears || 5,
          rating: 5.0,
          status: d.status || "Active",
          biography: d.biography || "",
          joinedDate: d.createdAt ? d.createdAt.split("T")[0] : "2026-01-10",
        }));
        setDoctors(mappedDoctors);
      }

      if (patientsRes.success && Array.isArray(patientsRes.data) && patientsRes.data.length > 0) {
        const mappedPatients: Patient[] = patientsRes.data.map((p: any) => ({
          id: p._id || p.id,
          patientCode: p.patientCode || `PT-${Math.floor(1000 + Math.random() * 9000)}`,
          name: p.name,
          age: p.age,
          gender: p.gender,
          assignedDoctorId: p.assignedDoctor?._id || p.assignedDoctor || "doc-1",
          assignedDoctorName: p.assignedDoctorName || p.assignedDoctor?.name || "Dr. Sarah Ahmed",
          condition: p.condition || "General",
          status: p.status || "Outpatient",
          bloodGroup: p.bloodGroup || "O+",
          phone: p.phone,
          email: p.email,
          notes: p.notes,
          lastVisit: p.lastVisit ? p.lastVisit.split("T")[0] : "2026-02-14",
          registrationDate: p.registrationDate ? p.registrationDate.split("T")[0] : "2026-01-15",
        }));
        setPatients(mappedPatients);
      }
    } catch {
      // Graceful fallback to initial mock state
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const showToast = (
    title: string,
    description?: string,
    type: "success" | "info" | "warning" | "error" = "success"
  ) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const newToast: ToastMessage = { id, title, description, type };
    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // DOCTOR OPERATIONS
  const addDoctor = async (data: Omit<Doctor, "id" | "patientCount" | "rating" | "joinedDate">) => {
    const newDoc: Doctor = {
      ...data,
      id: `doc-${Date.now()}`,
      patientCount: 0,
      rating: 5.0,
      joinedDate: new Date().toISOString().split("T")[0],
    };
    setDoctors((prev) => [newDoc, ...prev]);

    // Update metrics reactively
    setMetrics((prev) =>
      prev.map((m) => {
        if (m.id === "total-doctors") {
          const newVal = m.numericValue + 1;
          return { ...m, numericValue: newVal, value: newVal.toString() };
        }
        if (m.id === "active-doctors" && data.status === "Active") {
          const newVal = m.numericValue + 1;
          return { ...m, numericValue: newVal, value: newVal.toString() };
        }
        return m;
      })
    );

    // Sync with backend API
    api.doctors.create(data).catch(() => {});

    // Add notification
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: "Doctor Created",
      message: `${newDoc.name} (${newDoc.specialty}) at ${newDoc.hospital} was created.`,
      timestamp: "Just now",
      read: false,
      type: "success",
    };
    setNotifications((prev) => [newNotif, ...prev]);
    showToast("Doctor Created", `${newDoc.name} has been successfully added to staff.`);
  };

  const updateDoctor = async (id: string, data: Partial<Doctor>) => {
    setDoctors((prev) =>
      prev.map((d) => (d.id === id ? { ...d, ...data } : d))
    );

    // If doctor name changed, update patient records
    if (data.name) {
      setPatients((prev) =>
        prev.map((p) => (p.assignedDoctorId === id ? { ...p, assignedDoctorName: data.name! } : p))
      );
    }

    // Sync with backend API
    api.doctors.update(id, data).catch(() => {});

    showToast("Doctor Updated", "Doctor information updated successfully.", "success");
  };

  const deleteDoctor = async (id: string) => {
    const docToDelete = doctors.find((d) => d.id === id);
    setDoctors((prev) => prev.filter((d) => d.id !== id));

    setMetrics((prev) =>
      prev.map((m) => {
        if (m.id === "total-doctors") {
          const newVal = Math.max(0, m.numericValue - 1);
          return { ...m, numericValue: newVal, value: newVal.toString() };
        }
        return m;
      })
    );

    // Sync with backend API
    api.doctors.delete(id).catch(() => {});

    if (docToDelete) {
      showToast("Doctor Removed", `${docToDelete.name} was removed from the roster.`, "info");
    }
  };

  // PATIENT OPERATIONS
  const addPatient = async (
    data: Omit<Patient, "id" | "patientCode" | "registrationDate" | "lastVisit">
  ) => {
    const codeNumber = 1043 + patients.length;
    const newPatient: Patient = {
      ...data,
      id: `pat-${Date.now()}`,
      patientCode: `PT-${codeNumber}`,
      registrationDate: new Date().toISOString().split("T")[0],
      lastVisit: new Date().toISOString().split("T")[0],
    };
    setPatients((prev) => [newPatient, ...prev]);

    // Increment assigned doctor count if found
    setDoctors((prev) =>
      prev.map((d) => {
        if (d.id === data.assignedDoctorId || d.name === data.assignedDoctorName) {
          return { ...d, patientCount: d.patientCount + 1 };
        }
        return d;
      })
    );

    // Update metrics
    setMetrics((prev) =>
      prev.map((m) => {
        if (m.id === "total-patients") {
          const newVal = m.numericValue + 1;
          return { ...m, numericValue: newVal, value: newVal.toLocaleString() };
        }
        if (m.id === "new-patients") {
          const newVal = m.numericValue + 1;
          return { ...m, numericValue: newVal, value: newVal.toLocaleString() };
        }
        return m;
      })
    );

    // Sync with backend API
    api.patients.create(data).catch(() => {});

    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: "New Patient Registered",
      message: `${newPatient.name} (${newPatient.patientCode}) assigned to ${newPatient.assignedDoctorName}.`,
      timestamp: "Just now",
      read: false,
      type: "info",
    };
    setNotifications((prev) => [newNotif, ...prev]);
    showToast("Patient Registered", `${newPatient.name} has been registered.`);
  };

  const updatePatient = async (id: string, data: Partial<Patient>) => {
    const existing = patients.find((p) => p.id === id);
    if (!existing) return;

    // Handle doctor change patient counts
    if (data.assignedDoctorId && data.assignedDoctorId !== existing.assignedDoctorId) {
      setDoctors((prev) =>
        prev.map((d) => {
          if (d.id === existing.assignedDoctorId) {
            return { ...d, patientCount: Math.max(0, d.patientCount - 1) };
          }
          if (d.id === data.assignedDoctorId) {
            return { ...d, patientCount: d.patientCount + 1 };
          }
          return d;
        })
      );
    }

    setPatients((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...data } : p))
    );

    // Sync with backend API
    api.patients.update(id, data).catch(() => {});

    showToast("Patient Updated", "Patient record updated successfully.", "success");
  };

  const deletePatient = async (id: string) => {
    const patientToDelete = patients.find((p) => p.id === id);
    if (patientToDelete) {
      // Decrement doctor patient count
      setDoctors((prev) =>
        prev.map((d) => {
          if (d.id === patientToDelete.assignedDoctorId || d.name === patientToDelete.assignedDoctorName) {
            return { ...d, patientCount: Math.max(0, d.patientCount - 1) };
          }
          return d;
        })
      );

      // Decrement total patients metric
      setMetrics((prev) =>
        prev.map((m) => {
          if (m.id === "total-patients") {
            const newVal = Math.max(0, m.numericValue - 1);
            return { ...m, numericValue: newVal, value: newVal.toLocaleString() };
          }
          return m;
        })
      );
    }

    setPatients((prev) => prev.filter((p) => p.id !== id));

    // Sync with backend API
    api.patients.delete(id).catch(() => {});

    if (patientToDelete) {
      showToast("Patient Removed", `${patientToDelete.name} was removed.`, "info");
    }
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    showToast("Notifications Marked Read", "All pending alerts marked as read.", "info");
  };

  return (
    <DoctorTrackerContext.Provider
      value={{
        doctors,
        patients,
        metrics,
        notifications,
        unreadNotificationCount,
        toasts,
        dateRange,
        setDateRange,
        growthPeriod,
        setGrowthPeriod,
        growthData,
        isAddDoctorModalOpen,
        setIsAddDoctorModalOpen,
        isEditDoctorModalOpen,
        setIsEditDoctorModalOpen,
        editingDoctor,
        setEditingDoctor,
        isAddPatientModalOpen,
        setIsAddPatientModalOpen,
        isEditPatientModalOpen,
        setIsEditPatientModalOpen,
        editingPatient,
        setEditingPatient,
        selectedDoctorForNewPatient,
        setSelectedDoctorForNewPatient,
        isMobileSidebarOpen,
        setIsMobileSidebarOpen,
        searchQuery,
        setSearchQuery,
        theme,
        addDoctor,
        updateDoctor,
        deleteDoctor,
        addPatient,
        updatePatient,
        deletePatient,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        showToast,
        removeToast,
        refreshData,
      }}
    >
      {children}
    </DoctorTrackerContext.Provider>
  );
}

export function useDoctorTracker() {
  const context = useContext(DoctorTrackerContext);
  if (!context) {
    throw new Error("useDoctorTracker must be used within a DoctorTrackerProvider");
  }
  return context;
}

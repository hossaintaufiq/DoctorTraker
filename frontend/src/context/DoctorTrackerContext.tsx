"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  Doctor,
  Patient,
  MetricSummary,
  NotificationItem,
  ToastMessage,
  PatientGrowthData,
  DepartmentItem,
  AppointmentItem,
  InvoiceItem,
  ConversationItem,
  ChatMessageItem,
  ActivityLogItem,
} from "@/lib/types";
import {
  INITIAL_DOCTORS,
  INITIAL_PATIENTS,
  INITIAL_METRICS,
  INITIAL_NOTIFICATIONS,
  INITIAL_DEPARTMENTS,
  INITIAL_APPOINTMENTS,
  INITIAL_INVOICES,
  INITIAL_CONVERSATIONS,
  INITIAL_CHAT_MESSAGES,
  INITIAL_ACTIVITY_LOGS,
  PATIENT_GROWTH_MONTHLY,
  PATIENT_GROWTH_WEEKLY,
} from "@/lib/mock-data";
import { api, setAccessToken, setOnAuthFailure } from "@/lib/api";

export interface ConfirmDialogOptions {
  title: string;
  message: string;
  itemName?: string;
  itemType?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  onConfirm: () => void | Promise<void>;
}

interface DoctorTrackerContextType {
  doctors: Doctor[];
  patients: Patient[];
  departments: DepartmentItem[];
  appointments: AppointmentItem[];
  invoices: InvoiceItem[];
  activityLogs: ActivityLogItem[];
  conversations: ConversationItem[];
  chatMessages: Record<string, ChatMessageItem[]>;
  activeConversationId: string;
  setActiveConversationId: (id: string) => void;

  // Confirmation Modal
  confirmDialog: ConfirmDialogOptions | null;
  openConfirmDialog: (options: ConfirmDialogOptions) => void;
  closeConfirmDialog: () => void;

  metrics: MetricSummary[];
  notifications: NotificationItem[];
  unreadNotificationCount: number;
  unreadMessageCount: number;
  toasts: ToastMessage[];
  dateRange: string;
  setDateRange: (range: string) => void;
  growthPeriod: "Monthly" | "Weekly";
  setGrowthPeriod: (period: "Monthly" | "Weekly") => void;
  growthData: PatientGrowthData[];

  // Doctor Modals
  isAddDoctorModalOpen: boolean;
  setIsAddDoctorModalOpen: (open: boolean) => void;
  isEditDoctorModalOpen: boolean;
  setIsEditDoctorModalOpen: (open: boolean) => void;
  editingDoctor: Doctor | null;
  setEditingDoctor: (doctor: Doctor | null) => void;

  // Patient Modals
  isAddPatientModalOpen: boolean;
  setIsAddPatientModalOpen: (open: boolean) => void;
  isEditPatientModalOpen: boolean;
  setIsEditPatientModalOpen: (open: boolean) => void;
  editingPatient: Patient | null;
  setEditingPatient: (patient: Patient | null) => void;
  selectedDoctorForNewPatient: Doctor | null;
  setSelectedDoctorForNewPatient: (doctor: Doctor | null) => void;

  // Additional Feature Modals
  isMessagesModalOpen: boolean;
  setIsMessagesModalOpen: (open: boolean) => void;
  isLogsModalOpen: boolean;
  setIsLogsModalOpen: (open: boolean) => void;
  isBookAppointmentModalOpen: boolean;
  setIsBookAppointmentModalOpen: (open: boolean) => void;
  isGenerateInvoiceModalOpen: boolean;
  setIsGenerateInvoiceModalOpen: (open: boolean) => void;

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

  // Appointments & Invoices
  addAppointment: (appointment: Omit<AppointmentItem, "id" | "appointmentCode">) => void;
  updateAppointmentStatus: (id: string, status: AppointmentItem["status"]) => void;
  cancelAppointment: (id: string) => void;
  addInvoice: (invoice: Omit<InvoiceItem, "id" | "invoiceCode" | "issueDate">) => void;
  markInvoicePaid: (id: string) => void;

  // Messaging & Logs
  sendChatMessage: (conversationId: string, text: string) => void;
  addActivityLog: (category: ActivityLogItem["category"], action: string, details?: string, status?: ActivityLogItem["status"]) => void;
  clearActivityLogs: () => void;

  // Auth State & Actions
  user: { id: string; name: string; email: string; role: string; token: string } | null;
  isAuthenticated: boolean;
  authLoading: boolean;
  login: (email: string, password?: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;

  // Notifications & Alerts
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  showToast: (title: string, description?: string, type?: "success" | "info" | "warning" | "error") => void;
  removeToast: (id: string) => void;
  refreshData: () => Promise<void>;
  resetDatabase: () => Promise<boolean>;
}

const DoctorTrackerContext = createContext<DoctorTrackerContextType | undefined>(undefined);

export function DoctorTrackerProvider({ children }: { children: React.ReactNode }) {
  // Auth state
  const [user, setUser] = useState<{ id: string; name: string; email: string; role: string; token: string } | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authLoading, setAuthLoading] = useState<boolean>(true);

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [departments, setDepartments] = useState<DepartmentItem[]>([]);
  const [appointments, setAppointments] = useState<AppointmentItem[]>([]);
  const [invoices, setInvoices] = useState<InvoiceItem[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLogItem[]>([]);
  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [chatMessages, setChatMessages] = useState<Record<string, ChatMessageItem[]>>({});
  const [activeConversationId, setActiveConversationId] = useState<string>("conv-1");

  const [metrics, setMetrics] = useState<MetricSummary[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [dateRange, setDateRange] = useState<string>("Last 30 Days");
  const [growthPeriod, setGrowthPeriod] = useState<"Monthly" | "Weekly">("Monthly");

  // Modals
  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogOptions | null>(null);

  const openConfirmDialog = (options: ConfirmDialogOptions) => {
    setConfirmDialog(options);
  };

  const closeConfirmDialog = () => {
    setConfirmDialog(null);
  };

  const [isAddDoctorModalOpen, setIsAddDoctorModalOpen] = useState(false);
  const [isEditDoctorModalOpen, setIsEditDoctorModalOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);

  const [isAddPatientModalOpen, setIsAddPatientModalOpen] = useState(false);
  const [isEditPatientModalOpen, setIsEditPatientModalOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [selectedDoctorForNewPatient, setSelectedDoctorForNewPatient] = useState<Doctor | null>(null);

  const [isMessagesModalOpen, setIsMessagesModalOpen] = useState(false);
  const [isLogsModalOpen, setIsLogsModalOpen] = useState(false);
  const [isBookAppointmentModalOpen, setIsBookAppointmentModalOpen] = useState(false);
  const [isGenerateInvoiceModalOpen, setIsGenerateInvoiceModalOpen] = useState(false);

  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const theme = "light" as const;

  // Initialize Auth & Theme
  useEffect(() => {
    localStorage.removeItem("medcare_theme");
    localStorage.removeItem("medcare_token");
    localStorage.removeItem("medcare_user");
    document.documentElement.classList.remove("dark");

    const initAuth = async () => {
      try {
        const res = await api.auth.refresh();
        if (res.success && res.data) {
          const authData = res.data as any;
          setAccessToken(authData.token || null);
          setUser({
            id: authData.user?.id || authData.id,
            name: authData.user?.name || authData.name,
            email: authData.user?.email || authData.email,
            role: authData.user?.role || authData.role,
            token: authData.token,
          });
          setIsAuthenticated(true);
        } else {
          setAccessToken(null);
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch {
        setAccessToken(null);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setAuthLoading(false);
      }
    };

    setOnAuthFailure(() => {
      setAccessToken(null);
      setUser(null);
      setIsAuthenticated(false);
      if (typeof window !== "undefined" && window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    });

    initAuth();
  }, []);

  const login = async (email: string, password?: string) => {
    try {
      const res = await api.auth.login({ email, password });
      if (res.success && res.data) {
        const authData = res.data as any;
        setAccessToken(authData.token || null);
        const userData = {
          id: authData.id,
          name: authData.name,
          email: authData.email,
          role: authData.role,
          token: authData.token,
        };
        setUser(userData);
        setIsAuthenticated(true);
        addActivityLog("Security", "User Login Succeeded", `Authenticated ${userData.email} to administrative portal.`, "Success");
        showToast("Signed In", `Welcome back, ${userData.name}.`, "success");
        return { success: true };
      } else {
        showToast("Authentication Failed", res.message || "Invalid work email or password.", "error");
        return { success: false, message: res.message || "Invalid work email or password." };
      }
    } catch {
      showToast("Sign In Error", "Could not complete login request.", "error");
      return { success: false, message: "Network error during authentication." };
    }
  };

  const logout = async () => {
    const userEmail = user?.email || "Administrator";
    try {
      await api.auth.logout();
    } catch {
      // Ignore logout errors
    }
    setAccessToken(null);
    setUser(null);
    setIsAuthenticated(false);
    addActivityLog("Security", "User Signed Out", `Session closed for ${userEmail}.`, "Info");
    showToast("Signed Out", "You have been logged out of the portal.", "info");
  };

  const unreadNotificationCount = notifications.filter((n) => !n.read).length;
  const unreadMessageCount = conversations.reduce((acc, c) => acc + c.unreadCount, 0);
  const growthData = growthPeriod === "Monthly" ? PATIENT_GROWTH_MONTHLY : PATIENT_GROWTH_WEEKLY;

  // Log Helper
  const addActivityLog = (
    category: ActivityLogItem["category"],
    action: string,
    details?: string,
    status: ActivityLogItem["status"] = "Success"
  ) => {
    const now = new Date();
    const dateStr = now.toISOString().replace("T", " ").substring(0, 19);
    const newLog: ActivityLogItem = {
      id: `log-${Date.now()}`,
      timestamp: dateStr,
      category,
      user: "Sullivan (Admin)",
      action,
      ipAddress: "192.168.1.10",
      status,
      details,
    };
    setActivityLogs((prev) => [newLog, ...prev]);
  };

  const clearActivityLogs = () => {
    setActivityLogs([]);
    showToast("Logs Cleared", "System activity logs have been archived.", "info");
  };

  // Toast Helper
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

  // Initial backend sync
  const refreshData = async () => {
    try {
      const [
        doctorsRes,
        patientsRes,
        deptRes,
        aptRes,
        invRes,
        logsRes,
      ] = await Promise.all([
        api.doctors.getAll({ limit: 100 }),
        api.patients.getAll({ limit: 100 }),
        api.departments.getAll(),
        api.appointments.getAll({ limit: 100 }),
        api.invoices.getAll({ limit: 100 }),
        api.logs.getAll({ limit: 50 }),
      ]);

      if (doctorsRes.success && Array.isArray(doctorsRes.data)) {
        const mappedDoctors: Doctor[] = doctorsRes.data.map((d: any) => ({
          id: d._id || d.id,
          name: d.name,
          specialty: d.specialty,
          hospital: d.hospital || "Doctor Tracker Medical Center",
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

      if (patientsRes.success && Array.isArray(patientsRes.data)) {
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

      if (deptRes.success && Array.isArray(deptRes.data)) {
        const mappedDepts: DepartmentItem[] = deptRes.data.map((dp: any) => ({
          id: dp._id || dp.id,
          name: dp.name,
          code: dp.code,
          floor: dp.floor || "Floor 3",
          headName: dp.headName || "Dr. Sarah Ahmed",
          headDoctorId: dp.headDoctorId,
          specialistsCount: dp.specialistsCount || dp.doctorsCount || 6,
          activeCasesCount: dp.activeCasesCount || dp.patientsCount || 45,
          totalBeds: dp.totalBeds || 40,
          occupiedBeds: dp.occupiedBeds || 30,
          occupancyPercentage: dp.occupancyPercentage || 75,
          emergencyReady: dp.emergencyReady ?? true,
          topServices: dp.topServices || ["Consultation", "Diagnostics"],
          equipmentSummary: dp.equipmentSummary || "Standard Clinical Equipment",
          rating: dp.rating || 4.9,
          colorTheme: dp.colorTheme || "#2F65F6",
        }));
        setDepartments(mappedDepts);
      }

      if (aptRes.success && Array.isArray(aptRes.data)) {
        const mappedApts: AppointmentItem[] = aptRes.data.map((a: any) => ({
          id: a._id || a.id,
          appointmentCode: a.appointmentCode || `APT-${Math.floor(100 + Math.random() * 900)}`,
          patientId: a.patientId || (a.patient?._id || "pat-1"),
          patientName: a.patientName,
          patientPhone: a.patientPhone || "+1 (555) 019-2834",
          doctorId: a.doctorId || (a.doctor?._id || "doc-1"),
          doctorName: a.doctorName,
          doctorSpecialty: a.doctorSpecialty || "General Medicine",
          date: a.date,
          timeSlot: a.timeSlot,
          roomNumber: a.roomNumber || "Chamber 201",
          type: a.type || "Consultation",
          status: a.status || "Confirmed",
          notes: a.notes,
        }));
        setAppointments(mappedApts);
      }

      if (invRes.success && Array.isArray(invRes.data)) {
        const mappedInvs: InvoiceItem[] = invRes.data.map((inv: any) => ({
          id: inv._id || inv.id,
          invoiceCode: inv.invoiceCode || `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`,
          patientId: inv.patientId || "pat-1",
          patientName: inv.patientName,
          patientCode: inv.patientCode || `PT-1001`,
          doctorId: inv.doctorId || "doc-1",
          doctorName: inv.doctorName,
          issueDate: inv.issueDate ? inv.issueDate.split("T")[0] : new Date().toISOString().split("T")[0],
          dueDate: inv.dueDate ? inv.dueDate.split("T")[0] : new Date().toISOString().split("T")[0],
          items: inv.items || [],
          subtotal: inv.subtotal || 0,
          discount: inv.discount || 0,
          tax: inv.tax || 0,
          total: inv.total || 0,
          status: inv.status || "Pending",
          paymentMethod: inv.paymentMethod || "Credit Card",
        }));
        setInvoices(mappedInvs);
      }

      if (logsRes.success && Array.isArray(logsRes.data)) {
        const mappedLogs: ActivityLogItem[] = logsRes.data.map((l: any) => ({
          id: l._id || l.id,
          timestamp: l.createdAt ? l.createdAt.replace("T", " ").substring(0, 19) : l.timestamp,
          category: l.category,
          user: l.user || "Sullivan (Admin)",
          action: l.action,
          ipAddress: l.ipAddress || "192.168.1.10",
          status: l.status || "Success",
          details: l.details,
        }));
        setActivityLogs(mappedLogs);
      }
    } catch {
      // Graceful fallback
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  // Dynamically synchronize metrics based on live database state
  useEffect(() => {
    setMetrics([
      {
        id: "total-doctors",
        label: "Total Doctors",
        value: doctors.length.toString(),
        numericValue: doctors.length,
        iconName: "Stethoscope",
        trendPercentage: 12.5,
        trendDirection: "up",
        supportingText: "registered specialists",
      },
      {
        id: "total-patients",
        label: "Total Patients",
        value: patients.length.toLocaleString(),
        numericValue: patients.length,
        iconName: "Users",
        trendPercentage: 8.2,
        trendDirection: "up",
        supportingText: "active clinical records",
      },
      {
        id: "active-doctors",
        label: "Active Doctors",
        value: doctors.filter((d) => d.status === "Active").length.toString(),
        numericValue: doctors.filter((d) => d.status === "Active").length,
        iconName: "UserCheck",
        trendPercentage: 4.3,
        trendDirection: "up",
        supportingText: "currently on duty",
      },
      {
        id: "new-patients",
        label: "Appointments",
        value: appointments.length.toString(),
        numericValue: appointments.length,
        iconName: "UserPlus",
        trendPercentage: 12.8,
        trendDirection: "up",
        supportingText: "scheduled consultations",
      },
    ]);
  }, [doctors, patients, appointments]);

  const resetDatabase = async (): Promise<boolean> => {
    try {
      showToast("Resetting Database...", "Purging collections and seeding fresh records into MongoDB Atlas.", "info");
      const res = await api.system.resetDatabase();
      if (res.success) {
        await refreshData();
        showToast("Database Reset Complete", "Database cleared and re-initialized with fresh clinical records.", "success");
        return true;
      } else {
        await refreshData();
        showToast("Database Re-synchronized", res.message || "Fresh baseline state restored.", "success");
        return true;
      }
    } catch (e) {
      showToast("Reset Failed", "Could not complete database wipe: " + (e as Error).message, "error");
      return false;
    }
  };

  // DOCTOR OPERATIONS
  const addDoctor = async (data: Omit<Doctor, "id" | "patientCount" | "rating" | "joinedDate">) => {
    const tempId = `doc-${Date.now()}`;
    const newDoc: Doctor = {
      ...data,
      id: tempId,
      patientCount: 0,
      rating: 5.0,
      joinedDate: new Date().toISOString().split("T")[0],
    };
    setDoctors((prev) => [newDoc, ...prev]);

    addActivityLog("Staff", `Registered new specialist ${newDoc.name} (${newDoc.specialty})`, `Hospital: ${newDoc.hospital}`);
    try {
      const res = await api.doctors.create(data);
      if (res.success && res.data) {
        const docData = res.data as any;
        setDoctors((prev) =>
          prev.map((d) => (d.id === tempId ? { ...d, id: docData._id || d.id } : d))
        );
      }
    } catch {
      // offline fallback
    }
    showToast("Doctor Created", `${newDoc.name} has been added.`);
  };

  const updateDoctor = async (id: string, data: Partial<Doctor>) => {
    // 1. Update doctor in state
    setDoctors((prev) =>
      prev.map((d) => (d.id === id ? { ...d, ...data } : d))
    );

    // 2. Propagate doctor changes across all patients
    if (data.name) {
      setPatients((prev) =>
        prev.map((p) =>
          p.assignedDoctorId === id || p.assignedDoctorName === (doctors.find((d) => d.id === id)?.name)
            ? { ...p, assignedDoctorName: data.name! }
            : p
        )
      );
    }

    // 3. Propagate doctor changes across all appointments
    setAppointments((prev) =>
      prev.map((apt) => {
        if (apt.doctorId === id || apt.doctorName === (doctors.find((d) => d.id === id)?.name)) {
          return {
            ...apt,
            ...(data.name ? { doctorName: data.name } : {}),
            ...(data.specialty ? { doctorSpecialty: data.specialty } : {}),
            ...(data.roomNumber ? { roomNumber: data.roomNumber } : {}),
          };
        }
        return apt;
      })
    );

    // 4. Propagate to backend MongoDB
    try {
      await api.doctors.update(id, data);
    } catch {
      // offline fallback
    }

    addActivityLog("Staff", `Updated physician record ${data.name || id}`, `Specialty: ${data.specialty || "Unchanged"}, Status: ${data.status || "Unchanged"}`);
    showToast("Doctor Updated", "Doctor information updated across all systems.", "success");
  };

  const deleteDoctor = async (id: string) => {
    const docToDelete = doctors.find((d) => d.id === id);
    setDoctors((prev) => prev.filter((d) => d.id !== id));

    if (docToDelete) {
      addActivityLog("Staff", `Removed physician ${docToDelete.name} from directory`, undefined, "Warning");
      showToast("Doctor Removed Successfully", `${docToDelete.name} has been removed from the medical directory.`, "success");
    }

    try {
      await api.doctors.delete(id);
    } catch {
      // offline fallback
    }
  };

  // PATIENT OPERATIONS
  const addPatient = async (
    data: Omit<Patient, "id" | "patientCode" | "registrationDate" | "lastVisit">
  ) => {
    const codeNumber = 1000 + patients.length + 1;
    const tempId = `pat-${Date.now()}`;
    const newPatient: Patient = {
      ...data,
      id: tempId,
      patientCode: `PT-${codeNumber}`,
      registrationDate: new Date().toISOString().split("T")[0],
      lastVisit: new Date().toISOString().split("T")[0],
    };
    setPatients((prev) => [newPatient, ...prev]);

    setDoctors((prev) =>
      prev.map((d) => {
        if (d.id === data.assignedDoctorId || d.name === data.assignedDoctorName) {
          return { ...d, patientCount: (d.patientCount || 0) + 1 };
        }
        return d;
      })
    );

    addActivityLog("Patient", `Registered patient ${newPatient.name} (${newPatient.patientCode})`, `Assigned to ${newPatient.assignedDoctorName}`);

    try {
      const res = await api.patients.create({
        ...data,
        assignedDoctor: data.assignedDoctorId,
      });
      if (res.success && res.data) {
        const patData = res.data as any;
        setPatients((prev) =>
          prev.map((p) => (p.id === tempId ? { ...p, id: patData._id || p.id, patientCode: patData.patientCode || p.patientCode } : p))
        );
      }
    } catch {
      // offline fallback
    }

    showToast("Patient Registered", `${newPatient.name} has been registered.`);
  };

  const updatePatient = async (id: string, data: Partial<Patient>) => {
    const existing = patients.find((p) => p.id === id);
    if (!existing) return;

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

    addActivityLog("Patient", `Updated clinical chart for ${existing.name} (${existing.patientCode})`, undefined);

    try {
      await api.patients.update(id, {
        ...data,
        ...(data.assignedDoctorId ? { assignedDoctor: data.assignedDoctorId } : {}),
      });
    } catch {
      // offline fallback
    }

    showToast("Patient Updated", "Patient record updated successfully.", "success");
  };

  const deletePatient = async (id: string) => {
    const patientToDelete = patients.find((p) => p.id === id);
    if (patientToDelete) {
      setDoctors((prev) =>
        prev.map((d) => {
          if (d.id === patientToDelete.assignedDoctorId || d.name === patientToDelete.assignedDoctorName) {
            return { ...d, patientCount: Math.max(0, d.patientCount - 1) };
          }
          return d;
        })
      );

      addActivityLog("Patient", `Deleted patient record ${patientToDelete.name} (${patientToDelete.patientCode})`, undefined, "Warning");
      showToast("Patient Removed Successfully", `${patientToDelete.name} (${patientToDelete.patientCode}) has been removed.`, "success");
    }

    setPatients((prev) => prev.filter((p) => p.id !== id));

    try {
      await api.patients.delete(id);
    } catch {
      // offline fallback
    }
  };

  // APPOINTMENT OPERATIONS
  const addAppointment = async (data: Omit<AppointmentItem, "id" | "appointmentCode">) => {
    const tempId = `apt-${Date.now()}`;
    const newApt: AppointmentItem = {
      ...data,
      id: tempId,
      appointmentCode: `APT-2026-${Math.floor(100 + Math.random() * 900)}`,
    };
    setAppointments((prev) => [newApt, ...prev]);
    addActivityLog("Clinical", `Scheduled appointment for ${data.patientName} with ${data.doctorName}`, `${data.date} at ${data.timeSlot}`);

    try {
      const res = await api.appointments.create(data);
      if (res.success && res.data) {
        const aptData = res.data as any;
        setAppointments((prev) =>
          prev.map((a) => (a.id === tempId ? { ...a, id: aptData._id || a.id, appointmentCode: aptData.appointmentCode || a.appointmentCode } : a))
        );
      }
    } catch {
      // offline fallback
    }

    showToast("Appointment Booked", `Confirmed for ${data.patientName} on ${data.date}.`);
  };

  const updateAppointmentStatus = async (id: string, status: AppointmentItem["status"]) => {
    setAppointments((prev) =>
      prev.map((apt) => (apt.id === id ? { ...apt, status } : apt))
    );
    addActivityLog("Clinical", `Appointment ${id} status updated to ${status}`);

    try {
      await api.appointments.updateStatus(id, status);
    } catch {
      // offline fallback
    }

    showToast("Status Updated", `Appointment marked as ${status}.`, "info");
  };

  const cancelAppointment = async (id: string) => {
    setAppointments((prev) =>
      prev.map((apt) => (apt.id === id ? { ...apt, status: "Cancelled" } : apt))
    );
    addActivityLog("Clinical", `Cancelled appointment ID #${id}`, undefined, "Warning");

    try {
      await api.appointments.cancel(id);
    } catch {
      // offline fallback
    }

    showToast("Appointment Cancelled", "Consultation slot was cancelled.", "warning");
  };

  // INVOICE OPERATIONS
  const addInvoice = async (data: Omit<InvoiceItem, "id" | "invoiceCode" | "issueDate">) => {
    const today = new Date().toISOString().split("T")[0];
    const tempId = `inv-${Date.now()}`;
    const newInv: InvoiceItem = {
      ...data,
      id: tempId,
      invoiceCode: `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      issueDate: today,
    };
    setInvoices((prev) => [newInv, ...prev]);
    addActivityLog("Billing", `Generated invoice ${newInv.invoiceCode} for ${newInv.patientName}`, `Amount: $${newInv.total.toFixed(2)}`);

    try {
      const res = await api.invoices.create(data);
      if (res.success && res.data) {
        const invData = res.data as any;
        setInvoices((prev) =>
          prev.map((i) => (i.id === tempId ? { ...i, id: invData._id || i.id, invoiceCode: invData.invoiceCode || i.invoiceCode } : i))
        );
      }
    } catch {
      // offline fallback
    }

    showToast("Invoice Generated", `Invoice ${newInv.invoiceCode} created.`);
  };

  const markInvoicePaid = async (id: string) => {
    setInvoices((prev) =>
      prev.map((inv) => (inv.id === id ? { ...inv, status: "Paid" } : inv))
    );
    addActivityLog("Billing", `Marked invoice ${id} as settled / Paid in full`);

    try {
      await api.invoices.markPaid(id);
    } catch {
      // offline fallback
    }

    showToast("Payment Received", `Invoice marked as Paid.`, "success");
  };

  // MESSAGING OPERATIONS
  const sendChatMessage = (conversationId: string, text: string) => {
    if (!text.trim()) return;
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    const newMsg: ChatMessageItem = {
      id: `msg-${Date.now()}`,
      senderId: "admin",
      senderName: "Sullivan (Admin)",
      senderRole: "Admin",
      text: text.trim(),
      timestamp: timeStr,
      isSelf: true,
    };

    setChatMessages((prev) => ({
      ...prev,
      [conversationId]: [...(prev[conversationId] || []), newMsg],
    }));

    // Update conversation last message
    setConversations((prev) =>
      prev.map((c) =>
        c.id === conversationId
          ? { ...c, lastMessage: text.trim(), lastMessageTime: "Just now" }
          : c
      )
    );

    // Simulate instant doctor reply after 1.5s
    setTimeout(() => {
      const conv = conversations.find((c) => c.id === conversationId);
      const replyMsg: ChatMessageItem = {
        id: `msg-${Date.now() + 1}`,
        senderId: conv ? conv.participantId : "doctor",
        senderName: conv ? conv.participantName : "Attending Physician",
        senderRole: "Doctor",
        text: "Thank you for the update. Clinical records noted and prescription synced with central hospital pharmacy.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        isSelf: false,
      };

      setChatMessages((prev) => ({
        ...prev,
        [conversationId]: [...(prev[conversationId] || []), replyMsg],
      }));

      setConversations((prev) =>
        prev.map((c) =>
          c.id === conversationId
            ? { ...c, lastMessage: replyMsg.text, lastMessageTime: "Just now" }
            : c
        )
      );
    }, 1500);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    showToast("Notifications Marked Read", "All alerts marked as read.", "info");
  };

  return (
    <DoctorTrackerContext.Provider
      value={{
        doctors,
        patients,
        departments,
        appointments,
        invoices,
        activityLogs,
        conversations,
        chatMessages,
        activeConversationId,
        setActiveConversationId,
        metrics,
        notifications,
        unreadNotificationCount,
        unreadMessageCount,
        toasts,
        dateRange,
        setDateRange,
        growthPeriod,
        setGrowthPeriod,
        growthData,
        confirmDialog,
        openConfirmDialog,
        closeConfirmDialog,
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
        isMessagesModalOpen,
        setIsMessagesModalOpen,
        isLogsModalOpen,
        setIsLogsModalOpen,
        isBookAppointmentModalOpen,
        setIsBookAppointmentModalOpen,
        isGenerateInvoiceModalOpen,
        setIsGenerateInvoiceModalOpen,
        isMobileSidebarOpen,
        setIsMobileSidebarOpen,
        searchQuery,
        setSearchQuery,
        theme,
        user,
        isAuthenticated,
        authLoading,
        login,
        logout,
        addDoctor,
        updateDoctor,
        deleteDoctor,
        addPatient,
        updatePatient,
        deletePatient,
        addAppointment,
        updateAppointmentStatus,
        cancelAppointment,
        addInvoice,
        markInvoicePaid,
        sendChatMessage,
        addActivityLog,
        clearActivityLogs,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        showToast,
        removeToast,
        refreshData,
        resetDatabase,
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

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
import { api } from "@/lib/api";

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

  // Notifications & Alerts
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
  const [departments, setDepartments] = useState<DepartmentItem[]>(INITIAL_DEPARTMENTS);
  const [appointments, setAppointments] = useState<AppointmentItem[]>(INITIAL_APPOINTMENTS);
  const [invoices, setInvoices] = useState<InvoiceItem[]>(INITIAL_INVOICES);
  const [activityLogs, setActivityLogs] = useState<ActivityLogItem[]>(INITIAL_ACTIVITY_LOGS);
  const [conversations, setConversations] = useState<ConversationItem[]>(INITIAL_CONVERSATIONS);
  const [chatMessages, setChatMessages] = useState<Record<string, ChatMessageItem[]>>(INITIAL_CHAT_MESSAGES);
  const [activeConversationId, setActiveConversationId] = useState<string>("conv-1");

  const [metrics, setMetrics] = useState<MetricSummary[]>(INITIAL_METRICS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [dateRange, setDateRange] = useState<string>("Last 30 Days");
  const [growthPeriod, setGrowthPeriod] = useState<"Monthly" | "Weekly">("Monthly");

  // Modals
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

  useEffect(() => {
    localStorage.removeItem("medcare_theme");
    document.documentElement.classList.remove("dark");
  }, []);

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
      // Graceful fallback
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

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

    addActivityLog("Staff", `Registered new specialist ${newDoc.name} (${newDoc.specialty})`, `Hospital: ${newDoc.hospital}`);
    api.doctors.create(data).catch(() => {});
    showToast("Doctor Created", `${newDoc.name} has been added.`);
  };

  const updateDoctor = async (id: string, data: Partial<Doctor>) => {
    setDoctors((prev) =>
      prev.map((d) => (d.id === id ? { ...d, ...data } : d))
    );

    if (data.name) {
      setPatients((prev) =>
        prev.map((p) => (p.assignedDoctorId === id ? { ...p, assignedDoctorName: data.name! } : p))
      );
    }

    addActivityLog("Staff", `Updated profile for Doctor ID #${id}`, JSON.stringify(data));
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

    if (docToDelete) {
      addActivityLog("Staff", `Removed physician ${docToDelete.name} from directory`, undefined, "Warning");
      showToast("Doctor Removed", `${docToDelete.name} was removed from the roster.`, "info");
    }
    api.doctors.delete(id).catch(() => {});
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

    setDoctors((prev) =>
      prev.map((d) => {
        if (d.id === data.assignedDoctorId || d.name === data.assignedDoctorName) {
          return { ...d, patientCount: d.patientCount + 1 };
        }
        return d;
      })
    );

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

    addActivityLog("Patient", `Registered patient ${newPatient.name} (${newPatient.patientCode})`, `Assigned to ${newPatient.assignedDoctorName}`);
    api.patients.create(data).catch(() => {});
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
    api.patients.update(id, data).catch(() => {});
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

      setMetrics((prev) =>
        prev.map((m) => {
          if (m.id === "total-patients") {
            const newVal = Math.max(0, m.numericValue - 1);
            return { ...m, numericValue: newVal, value: newVal.toLocaleString() };
          }
          return m;
        })
      );
      addActivityLog("Patient", `Deleted patient record ${patientToDelete.name} (${patientToDelete.patientCode})`, undefined, "Warning");
      showToast("Patient Removed", `${patientToDelete.name} was removed.`, "info");
    }

    setPatients((prev) => prev.filter((p) => p.id !== id));
    api.patients.delete(id).catch(() => {});
  };

  // APPOINTMENT OPERATIONS
  const addAppointment = (data: Omit<AppointmentItem, "id" | "appointmentCode">) => {
    const newApt: AppointmentItem = {
      ...data,
      id: `apt-${Date.now()}`,
      appointmentCode: `APT-2026-${Math.floor(100 + Math.random() * 900)}`,
    };
    setAppointments((prev) => [newApt, ...prev]);
    addActivityLog("Clinical", `Scheduled appointment for ${data.patientName} with ${data.doctorName}`, `${data.date} at ${data.timeSlot}`);
    showToast("Appointment Booked", `Confirmed for ${data.patientName} on ${data.date}.`);
  };

  const updateAppointmentStatus = (id: string, status: AppointmentItem["status"]) => {
    setAppointments((prev) =>
      prev.map((apt) => (apt.id === id ? { ...apt, status } : apt))
    );
    addActivityLog("Clinical", `Appointment ${id} status updated to ${status}`);
    showToast("Status Updated", `Appointment marked as ${status}.`, "info");
  };

  const cancelAppointment = (id: string) => {
    setAppointments((prev) =>
      prev.map((apt) => (apt.id === id ? { ...apt, status: "Cancelled" } : apt))
    );
    addActivityLog("Clinical", `Cancelled appointment ID #${id}`, undefined, "Warning");
    showToast("Appointment Cancelled", "Consultation slot was cancelled.", "warning");
  };

  // INVOICE OPERATIONS
  const addInvoice = (data: Omit<InvoiceItem, "id" | "invoiceCode" | "issueDate">) => {
    const today = new Date().toISOString().split("T")[0];
    const newInv: InvoiceItem = {
      ...data,
      id: `inv-${Date.now()}`,
      invoiceCode: `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      issueDate: today,
    };
    setInvoices((prev) => [newInv, ...prev]);
    addActivityLog("Billing", `Generated invoice ${newInv.invoiceCode} for ${newInv.patientName}`, `Amount: $${newInv.total.toFixed(2)}`);
    showToast("Invoice Generated", `Invoice ${newInv.invoiceCode} created.`);
  };

  const markInvoicePaid = (id: string) => {
    setInvoices((prev) =>
      prev.map((inv) => (inv.id === id ? { ...inv, status: "Paid" } : inv))
    );
    addActivityLog("Billing", `Marked invoice ${id} as settled / Paid in full`);
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

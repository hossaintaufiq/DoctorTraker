"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { AuthProvider, useAuth, AuthUser } from "./AuthContext";
import { UIProvider, useUI, ConfirmDialogOptions } from "./UIContext";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { useDoctors, useDoctorMutations } from "@/hooks/useDoctors";
import { usePatients, usePatientMutations } from "@/hooks/usePatients";
import { useDashboard } from "@/hooks/useDashboard";
import { api } from "@/lib/api";
import {
  Doctor,
  Patient,
  ToastMessage,
  DepartmentItem,
  AppointmentItem,
  InvoiceItem,
  NotificationItem,
  ConversationItem,
  ChatMessageItem,
  ActivityLogItem,
  MetricSummary,
  PatientGrowthData,
} from "@/lib/types";
import {
  INITIAL_DEPARTMENTS,
  INITIAL_APPOINTMENTS,
  INITIAL_INVOICES,
  INITIAL_NOTIFICATIONS,
  INITIAL_CONVERSATIONS,
  INITIAL_CHAT_MESSAGES,
  INITIAL_ACTIVITY_LOGS,
  INITIAL_METRICS,
  PATIENT_GROWTH_MONTHLY,
} from "@/lib/mock-data";

export type { ConfirmDialogOptions, AuthUser };

// Composite Context Interface for clean state access
export interface DoctorTrackerContextType {
  // Auth
  user: AuthUser | null;
  isAuthenticated: boolean;
  authLoading: boolean;
  login: (email: string, password?: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;

  // Data Lists
  doctors: Doctor[];
  patients: Patient[];
  departments: DepartmentItem[];
  appointments: AppointmentItem[];
  invoices: InvoiceItem[];
  metrics: MetricSummary[];
  totalDoctors: number;
  totalPatients: number;
  isLoading: boolean;
  refreshData: () => Promise<void>;

  // UI & General Modals
  isMobileSidebarOpen: boolean;
  setIsMobileSidebarOpen: (open: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  confirmDialog: ConfirmDialogOptions | null;
  openConfirmDialog: (options: ConfirmDialogOptions) => void;
  closeConfirmDialog: () => void;

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

  // Auxiliary Modals
  isBookAppointmentModalOpen: boolean;
  setIsBookAppointmentModalOpen: (open: boolean) => void;
  isGenerateInvoiceModalOpen: boolean;
  setIsGenerateInvoiceModalOpen: (open: boolean) => void;
  isActivityLogsModalOpen: boolean;
  setIsActivityLogsModalOpen: (open: boolean) => void;
  isMessagesModalOpen: boolean;
  setIsMessagesModalOpen: (open: boolean) => void;
  isLogsModalOpen: boolean;
  setIsLogsModalOpen: (open: boolean) => void;

  // Notifications
  notifications: NotificationItem[];
  unreadNotificationCount: number;
  unreadMessageCount: number;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;

  // Chat / Messages
  conversations: ConversationItem[];
  chatMessages: Record<string, ChatMessageItem[]>;
  activeConversationId: string | null;
  setActiveConversationId: (id: string | null) => void;
  sendChatMessage: (conversationId: string, text: string) => void;

  // Activity Logs
  activityLogs: ActivityLogItem[];
  addActivityLog: (category: string, action: string, details: string, severity?: "Info" | "Warning" | "Critical") => void;
  clearActivityLogs: () => void;

  // Growth & Dashboard
  growthPeriod: string;
  setGrowthPeriod: (period: string) => void;
  growthData: PatientGrowthData[];

  // Toasts
  toasts: ToastMessage[];
  showToast: (title: string, description?: string, type?: "success" | "info" | "warning" | "error") => void;
  removeToast: (id: string) => void;

  // Mutations
  addDoctor: (doctor: any) => Promise<any>;
  updateDoctor: (id: string, data: any) => Promise<any>;
  deleteDoctor: (id: string) => Promise<any>;
  addPatient: (patient: any) => Promise<any>;
  updatePatient: (id: string, data: any) => Promise<any>;
  deletePatient: (id: string) => Promise<any>;
  addPatientUnderDoctor: (doctorId: string, patientData: any) => Promise<any>;
  removePatientFromDoctor: (doctorId: string, patientId: string) => Promise<any>;
  addAppointment: (appointment: any) => Promise<any>;
  updateAppointmentStatus: (id: string, status: any) => Promise<any>;
  cancelAppointment: (id: string) => Promise<any>;
  addInvoice: (invoice: any) => Promise<any>;
  markInvoicePaid: (id: string) => Promise<any>;
  resetDatabase: () => Promise<void>;
}

const DoctorTrackerContext = createContext<DoctorTrackerContextType | undefined>(undefined);

function CompositeContextProvider({ children }: { children: React.ReactNode }) {
  const auth = useAuth();
  const ui = useUI();
  const doctorsQuery = useDoctors({ limit: 100 });
  const patientsQuery = usePatients({ limit: 100 });
  const dashboardQuery = useDashboard();
  const doctorMutations = useDoctorMutations();
  const patientMutations = usePatientMutations();

  // Auxiliary state for legacy interactive modules
  const [departments, setDepartments] = useState<DepartmentItem[]>(INITIAL_DEPARTMENTS);
  const [appointments, setAppointments] = useState<AppointmentItem[]>(INITIAL_APPOINTMENTS);
  const [invoices, setInvoices] = useState<InvoiceItem[]>(INITIAL_INVOICES);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [conversations, setConversations] = useState<ConversationItem[]>(INITIAL_CONVERSATIONS);
  const [chatMessages, setChatMessages] = useState<Record<string, ChatMessageItem[]>>(INITIAL_CHAT_MESSAGES);
  const [activeConversationId, setActiveConversationId] = useState<string | null>("conv-1");
  const [activityLogs, setActivityLogs] = useState<ActivityLogItem[]>(INITIAL_ACTIVITY_LOGS);
  const [growthPeriod, setGrowthPeriod] = useState<string>("monthly");
  const [isLogsModalOpen, setIsLogsModalOpen] = useState(false);

  // Fetch real backend departments, appointments, invoices if authenticated
  useEffect(() => {
    if (auth.isAuthenticated) {
      api.departments.getAll().then((res) => {
        if (res.success && Array.isArray(res.data) && res.data.length > 0) {
          setDepartments(res.data as DepartmentItem[]);
        }
      }).catch(() => {});

      api.appointments.getAll().then((res) => {
        if (res.success && Array.isArray(res.data) && res.data.length > 0) {
          setAppointments(res.data as AppointmentItem[]);
        }
      }).catch(() => {});

      api.invoices.getAll().then((res) => {
        if (res.success && Array.isArray(res.data) && res.data.length > 0) {
          setInvoices(res.data as InvoiceItem[]);
        }
      }).catch(() => {});
    }
  }, [auth.isAuthenticated]);

  const refreshData = async () => {
    await Promise.all([
      doctorsQuery.refetch(),
      patientsQuery.refetch(),
      dashboardQuery.refetch(),
    ]);
  };

  const addDoctor = async (doctor: any) => {
    const res = await doctorMutations.createDoctor.mutateAsync(doctor);
    ui.showToast("Doctor Added", `${doctor.name} has been added.`, "success");
    return res;
  };

  const updateDoctor = async (id: string, data: any) => {
    const res = await doctorMutations.updateDoctor.mutateAsync({ id, data });
    ui.showToast("Doctor Updated", "Doctor information updated successfully.", "success");
    return res;
  };

  const deleteDoctor = async (id: string) => {
    await doctorMutations.deleteDoctor.mutateAsync(id);
    ui.showToast("Doctor Deleted", "Physician record removed from directory.", "info");
  };

  const addPatient = async (patient: any) => {
    const res = await patientMutations.createPatient.mutateAsync(patient);
    ui.showToast("Patient Registered", `${patient.name} has been admitted.`, "success");
    return res;
  };

  const updatePatient = async (id: string, data: any) => {
    const res = await patientMutations.updatePatient.mutateAsync({ id, data });
    ui.showToast("Patient Updated", "Patient chart updated successfully.", "success");
    return res;
  };

  const deletePatient = async (id: string) => {
    await patientMutations.deletePatient.mutateAsync(id);
    ui.showToast("Patient Deleted", "Patient chart has been removed.", "info");
  };

  const addPatientUnderDoctor = async (doctorId: string, patientData: any) => {
    const res = await doctorMutations.addPatientUnderDoctor.mutateAsync({
      doctorId,
      patientData,
    });
    ui.showToast("Patient Assigned", "Patient registered under doctor.", "success");
    return res;
  };

  const removePatientFromDoctor = async (doctorId: string, patientId: string) => {
    await doctorMutations.removePatientFromDoctor.mutateAsync({
      doctorId,
      patientId,
    });
    ui.showToast("Patient Removed", "Patient unassigned from doctor.", "info");
  };

  const addAppointment = async (appointment: any) => {
    try {
      const res = await api.appointments.create(appointment);
      if (res.success && res.data) {
        setAppointments((prev) => [res.data as AppointmentItem, ...prev]);
        ui.showToast("Appointment Booked", "Consultation session scheduled.", "success");
        return res.data;
      }
    } catch {
      // Fallback local update
      setAppointments((prev) => [{ id: `apt-${Date.now()}`, ...appointment } as AppointmentItem, ...prev]);
      ui.showToast("Appointment Booked", "Consultation session scheduled.", "success");
    }
  };

  const updateAppointmentStatus = async (id: string, status: any) => {
    try {
      await api.appointments.updateStatus(id, status);
    } catch {}
    setAppointments((prev) =>
      prev.map((apt) => (apt.id === id ? { ...apt, status } : apt))
    );
    ui.showToast("Status Updated", `Appointment status marked as ${status}.`, "info");
  };

  const cancelAppointment = async (id: string) => {
    try {
      await api.appointments.cancel(id);
    } catch {}
    setAppointments((prev) =>
      prev.map((apt) => (apt.id === id ? { ...apt, status: "Cancelled" } : apt))
    );
    ui.showToast("Appointment Cancelled", "Appointment has been cancelled.", "warning");
  };

  const addInvoice = async (invoice: any) => {
    try {
      const res = await api.invoices.create(invoice);
      if (res.success && res.data) {
        setInvoices((prev) => [res.data as InvoiceItem, ...prev]);
        ui.showToast("Invoice Generated", "Clinical billing invoice created.", "success");
        return res.data;
      }
    } catch {
      setInvoices((prev) => [{ id: `inv-${Date.now()}`, ...invoice } as InvoiceItem, ...prev]);
      ui.showToast("Invoice Generated", "Clinical billing invoice created.", "success");
    }
  };

  const markInvoicePaid = async (id: string) => {
    try {
      await api.invoices.markPaid(id);
    } catch {}
    setInvoices((prev) =>
      prev.map((inv) => (inv.id === id ? { ...inv, status: "Paid" } : inv))
    );
    ui.showToast("Payment Recorded", "Invoice settled successfully.", "success");
  };

  const resetDatabase = async () => {
    try {
      const res = await api.system.resetDatabase();
      if (!res.success) {
        throw new Error(res.message || "Failed to reset database");
      }
      ui.showToast("Database Reset", "Collections wiped and seeded successfully.", "success");
      await refreshData();
    } catch (err: any) {
      ui.showToast("Reset Error", err?.message || "Could not reset database.", "error");
    }
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const sendChatMessage = (conversationId: string, text: string) => {
    const newMsg: ChatMessageItem = {
      id: `msg-${Date.now()}`,
      senderId: auth.user?.id || "usr-admin",
      senderName: auth.user?.name || "Administrator",
      senderRole: "Admin",
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isSelf: true,
    };
    setChatMessages((prev) => ({
      ...prev,
      [conversationId]: [...(prev[conversationId] || []), newMsg],
    }));
  };

  const addActivityLog = (
    category: string,
    action: string,
    details: string,
    severity: "Info" | "Warning" | "Critical" = "Info"
  ) => {
    const newLog: ActivityLogItem = {
      id: `log-${Date.now()}`,
      category: (category as any) || "Clinical",
      action,
      details,
      user: auth.user?.name || "Administrator",
      timestamp: new Date().toLocaleTimeString(),
      status: severity === "Critical" ? "Error" : severity === "Warning" ? "Warning" : "Success",
      ipAddress: "192.168.1.1",
    };
    setActivityLogs((prev) => [newLog, ...prev]);
  };

  const clearActivityLogs = () => {
    setActivityLogs([]);
    ui.showToast("Logs Cleared", "Audit trail records cleared.", "info");
  };

  const unreadNotificationCount = notifications.filter((n) => !n.read).length;
  const unreadMessageCount = conversations.reduce((acc, c) => acc + (c.unreadCount || 0), 0);

  const contextValue: DoctorTrackerContextType = {
    ...auth,
    ...ui,
    doctors: doctorsQuery.data?.doctors || [],
    patients: patientsQuery.data?.patients || [],
    departments,
    appointments,
    invoices,
    metrics: INITIAL_METRICS,
    totalDoctors: doctorsQuery.data?.total || 0,
    totalPatients: patientsQuery.data?.total || 0,
    isLoading: doctorsQuery.isLoading || patientsQuery.isLoading,
    refreshData,
    addDoctor,
    updateDoctor,
    deleteDoctor,
    addPatient,
    updatePatient,
    deletePatient,
    addPatientUnderDoctor,
    removePatientFromDoctor,
    addAppointment,
    updateAppointmentStatus,
    cancelAppointment,
    addInvoice,
    markInvoicePaid,
    resetDatabase,
    notifications,
    unreadNotificationCount,
    unreadMessageCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    conversations,
    chatMessages,
    activeConversationId,
    setActiveConversationId,
    sendChatMessage,
    activityLogs,
    addActivityLog,
    clearActivityLogs,
    isLogsModalOpen,
    setIsLogsModalOpen,
    growthPeriod,
    setGrowthPeriod,
    growthData: PATIENT_GROWTH_MONTHLY,
  };

  return (
    <DoctorTrackerContext.Provider value={contextValue}>
      {children}
    </DoctorTrackerContext.Provider>
  );
}

export function DoctorTrackerProvider({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <AuthProvider>
        <UIProvider>
          <CompositeContextProvider>{children}</CompositeContextProvider>
        </UIProvider>
      </AuthProvider>
    </QueryProvider>
  );
}

export function useDoctorTracker(): DoctorTrackerContextType {
  const context = useContext(DoctorTrackerContext);
  if (!context) {
    throw new Error("useDoctorTracker must be used within DoctorTrackerProvider");
  }
  return context;
}

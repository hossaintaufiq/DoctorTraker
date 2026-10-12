"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { Doctor, Patient, ToastMessage } from "@/lib/types";

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

interface UIContextType {
  // Mobile Sidebar
  isMobileSidebarOpen: boolean;
  setIsMobileSidebarOpen: (open: boolean) => void;

  // Confirm Modal
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

  // Global Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Toasts
  toasts: ToastMessage[];
  showToast: (title: string, description?: string, type?: "success" | "info" | "warning" | "error") => void;
  removeToast: (id: string) => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export function UIProvider({ children }: { children: React.ReactNode }) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogOptions | null>(null);

  const [isAddDoctorModalOpen, setIsAddDoctorModalOpen] = useState(false);
  const [isEditDoctorModalOpen, setIsEditDoctorModalOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);

  const [isAddPatientModalOpen, setIsAddPatientModalOpen] = useState(false);
  const [isEditPatientModalOpen, setIsEditPatientModalOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [selectedDoctorForNewPatient, setSelectedDoctorForNewPatient] = useState<Doctor | null>(null);

  const [isBookAppointmentModalOpen, setIsBookAppointmentModalOpen] = useState(false);
  const [isGenerateInvoiceModalOpen, setIsGenerateInvoiceModalOpen] = useState(false);
  const [isActivityLogsModalOpen, setIsActivityLogsModalOpen] = useState(false);
  const [isMessagesModalOpen, setIsMessagesModalOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const openConfirmDialog = useCallback((options: ConfirmDialogOptions) => {
    setConfirmDialog(options);
  }, []);

  const closeConfirmDialog = useCallback(() => {
    setConfirmDialog(null);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (
      title: string,
      description?: string,
      type: "success" | "info" | "warning" | "error" = "info"
    ) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      const newToast: ToastMessage = { id, title, description, type };

      setToasts((prev) => [...prev.slice(-4), newToast]);

      setTimeout(() => {
        removeToast(id);
      }, 4500);
    },
    [removeToast]
  );

  return (
    <UIContext.Provider
      value={{
        isMobileSidebarOpen,
        setIsMobileSidebarOpen,
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
        isBookAppointmentModalOpen,
        setIsBookAppointmentModalOpen,
        isGenerateInvoiceModalOpen,
        setIsGenerateInvoiceModalOpen,
        isActivityLogsModalOpen,
        setIsActivityLogsModalOpen,
        isMessagesModalOpen,
        setIsMessagesModalOpen,
        searchQuery,
        setSearchQuery,
        toasts,
        showToast,
        removeToast,
      }}
    >
      {children}
    </UIContext.Provider>
  );
}

export function useUI(): UIContextType {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error("useUI must be used within a UIProvider");
  }
  return context;
}

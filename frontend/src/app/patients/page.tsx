"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { useDoctorTracker } from "@/context/DoctorTrackerContext";
import { usePatients } from "@/hooks/usePatients";
import { PatientFiltersBar } from "@/components/patients/PatientFiltersBar";
import { PatientDataTable } from "@/components/patients/PatientDataTable";
import { PatientPagination } from "@/components/patients/PatientPagination";
import { Plus, Loader2 } from "lucide-react";
import { Patient } from "@/lib/types";

export default function PatientsPage() {
  const {
    doctors,
    setIsAddPatientModalOpen,
    setIsEditPatientModalOpen,
    setEditingPatient,
    deletePatient,
    openConfirmDialog,
  } = useDoctorTracker();

  // Search, filter, and pagination states
  const [search, setSearch] = useState("");
  const [condition, setCondition] = useState("All");
  const [status, setStatus] = useState("All");
  const [bloodGroup, setBloodGroup] = useState("All");
  const [doctorId, setDoctorId] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Server-driven data query using TanStack Query
  const {
    data: queryResult,
    isLoading,
    isPlaceholderData,
  } = usePatients({
    search: search.trim() || undefined,
    condition: condition !== "All" ? condition : undefined,
    status: status !== "All" ? status : undefined,
    bloodGroup: bloodGroup !== "All" ? bloodGroup : undefined,
    doctorId: doctorId !== "All" ? doctorId : undefined,
    page: currentPage,
    limit: pageSize,
    sortBy: "registrationDate",
    order: "desc",
  });

  const patients = queryResult?.patients || [];
  const total = queryResult?.total || 0;
  const totalPages = queryResult?.totalPages || 1;

  const handleResetFilters = () => {
    setSearch("");
    setCondition("All");
    setStatus("All");
    setBloodGroup("All");
    setDoctorId("All");
    setCurrentPage(1);
  };

  const handleEditPatient = (pt: Patient) => {
    setEditingPatient(pt);
    setIsEditPatientModalOpen(true);
  };

  const handleDeletePatient = (pt: Patient) => {
    const ptId = pt.id || (pt as any)._id;
    openConfirmDialog({
      title: "Remove Patient Chart",
      itemName: `${pt.name} (${pt.patientCode || ""})`,
      itemType: "Patient Record",
      message: `Are you sure you want to remove the medical chart for ${pt.name}? This will permanently delete clinical records.`,
      confirmLabel: "Yes, Remove Patient",
      onConfirm: async () => {
        await deletePatient(ptId);
      },
    });
  };

  return (
    <AppShell breadcrumbTitle="Patient Population">
      <div className="space-y-6 animate-fade-in">
        {/* Page Title & Add Patient Action */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
          <div>
            <h1 className="text-2xl sm:text-[28px] font-bold text-[#101828] tracking-tight">
              Patient Registry
            </h1>
            <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
              Comprehensive clinical database, patient charts, conditions, and care statuses.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsAddPatientModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold text-white bg-gradient-to-r from-[#2F65F6] to-[#1E4FD8] hover:from-[#2557E5] hover:to-[#1742BC] shadow-[0_2px_8px_rgba(47,101,246,0.25)] hover:shadow-[0_4px_12px_rgba(47,101,246,0.35)] transition-all cursor-pointer whitespace-nowrap active:scale-[0.98]"
          >
            <Plus className="w-4 h-4 stroke-[2.2]" />
            <span>Register New Patient</span>
          </button>
        </div>

        {/* Server-Driven Filters Bar */}
        <PatientFiltersBar
          search={search}
          onSearchChange={(val) => {
            setSearch(val);
            setCurrentPage(1);
          }}
          condition={condition}
          onConditionChange={(val) => {
            setCondition(val);
            setCurrentPage(1);
          }}
          status={status}
          onStatusChange={(val) => {
            setStatus(val);
            setCurrentPage(1);
          }}
          bloodGroup={bloodGroup}
          onBloodGroupChange={(val) => {
            setBloodGroup(val);
            setCurrentPage(1);
          }}
          doctorId={doctorId}
          onDoctorIdChange={(val) => {
            setDoctorId(val);
            setCurrentPage(1);
          }}
          doctors={doctors}
          onReset={handleResetFilters}
        />

        {/* Loading Indicator / Table */}
        {isLoading && !isPlaceholderData ? (
          <div className="glass-card p-12 text-center rounded-3xl space-y-3 shadow-2xs">
            <Loader2 className="w-8 h-8 text-[#2F65F6] animate-spin mx-auto" />
            <p className="text-xs font-semibold text-[#64748B]">Loading patient roster...</p>
          </div>
        ) : (
          <PatientDataTable
            patients={patients}
            onEdit={handleEditPatient}
            onDelete={handleDeletePatient}
          />
        )}

        {/* Server-Side Pagination */}
        <PatientPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={total}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
        />
      </div>
    </AppShell>
  );
}

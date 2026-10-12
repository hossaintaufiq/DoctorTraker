"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { useDoctorTracker } from "@/context/DoctorTrackerContext";
import { useDoctors } from "@/hooks/useDoctors";
import { DoctorFiltersBar } from "@/components/doctors/DoctorFiltersBar";
import { DoctorCardGrid } from "@/components/doctors/DoctorCardGrid";
import { DoctorDataTable } from "@/components/doctors/DoctorDataTable";
import { DoctorPagination } from "@/components/doctors/DoctorPagination";
import { Plus, Users, Loader2 } from "lucide-react";
import { Doctor } from "@/lib/types";

export default function DoctorsPage() {
  const {
    setIsAddDoctorModalOpen,
    setIsEditDoctorModalOpen,
    setEditingDoctor,
    setIsAddPatientModalOpen,
    setSelectedDoctorForNewPatient,
    deleteDoctor,
    openConfirmDialog,
  } = useDoctorTracker();

  // Search, filter, view mode, and pagination states
  const [search, setSearch] = useState("");
  const [specialty, setSpecialty] = useState("All");
  const [status, setStatus] = useState("All");
  const [hospital, setHospital] = useState("All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);

  // Server-driven data query using TanStack Query
  const {
    data: queryResult,
    isLoading,
    isPlaceholderData,
  } = useDoctors({
    search: search.trim() || undefined,
    specialty: specialty !== "All" ? specialty : undefined,
    status: status !== "All" ? status : undefined,
    hospital: hospital !== "All" ? hospital : undefined,
    page: currentPage,
    limit: pageSize,
    sortBy: "createdAt",
    order: "desc",
  });

  const doctors = queryResult?.doctors || [];
  const total = queryResult?.total || 0;
  const totalPages = queryResult?.totalPages || 1;

  const handleResetFilters = () => {
    setSearch("");
    setSpecialty("All");
    setStatus("All");
    setHospital("All");
    setCurrentPage(1);
  };

  const handleEditDoctor = (doc: Doctor) => {
    setEditingDoctor(doc);
    setIsEditDoctorModalOpen(true);
  };

  const handleDeleteDoctor = (doc: Doctor) => {
    openConfirmDialog({
      title: "Remove Physician Record",
      itemName: doc.name,
      itemType: "Doctor Profile",
      message: `Are you sure you want to remove Dr. ${doc.name}? All assigned patients will be unassigned.`,
      confirmLabel: "Yes, Remove Doctor",
      onConfirm: () => {
        deleteDoctor(doc.id);
      },
    });
  };

  const handleAddPatientToDoctor = (doc: Doctor) => {
    setSelectedDoctorForNewPatient(doc);
    setIsAddPatientModalOpen(true);
  };

  return (
    <AppShell breadcrumbTitle="Doctors Directory">
      <div className="space-y-6 animate-fade-in">
        {/* Page Title & Add Doctor Action */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
          <div>
            <h1 className="text-2xl sm:text-[28px] font-bold text-[#101828] tracking-tight">
              Doctors Directory
            </h1>
            <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
              Manage clinical medical staff, specialties, hospital assignments, and patient capacities.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsAddDoctorModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold text-white bg-gradient-to-r from-[#2F65F6] to-[#1E4FD8] hover:from-[#2557E5] hover:to-[#1742BC] shadow-[0_2px_8px_rgba(47,101,246,0.25)] hover:shadow-[0_4px_12px_rgba(47,101,246,0.35)] transition-all cursor-pointer whitespace-nowrap active:scale-[0.98]"
          >
            <Plus className="w-4 h-4 stroke-[2.2]" />
            <span>Add New Doctor</span>
          </button>
        </div>

        {/* Server-Driven Filters Bar */}
        <DoctorFiltersBar
          search={search}
          onSearchChange={(val) => {
            setSearch(val);
            setCurrentPage(1);
          }}
          specialty={specialty}
          onSpecialtyChange={(val) => {
            setSpecialty(val);
            setCurrentPage(1);
          }}
          status={status}
          onStatusChange={(val) => {
            setStatus(val);
            setCurrentPage(1);
          }}
          hospital={hospital}
          onHospitalChange={(val) => {
            setHospital(val);
            setCurrentPage(1);
          }}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onReset={handleResetFilters}
        />

        {/* Loading Indicator / Content */}
        {isLoading && !isPlaceholderData ? (
          <div className="glass-card p-12 text-center rounded-3xl space-y-3 shadow-2xs">
            <Loader2 className="w-8 h-8 text-[#2F65F6] animate-spin mx-auto" />
            <p className="text-xs font-semibold text-[#64748B]">Loading doctors directory...</p>
          </div>
        ) : viewMode === "grid" ? (
          <DoctorCardGrid
            doctors={doctors}
            onEdit={handleEditDoctor}
            onDelete={handleDeleteDoctor}
            onAddPatient={handleAddPatientToDoctor}
          />
        ) : (
          <DoctorDataTable
            doctors={doctors}
            onEdit={handleEditDoctor}
            onDelete={handleDeleteDoctor}
            onAddPatient={handleAddPatientToDoctor}
          />
        )}

        {/* Server-Side Pagination */}
        <DoctorPagination
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

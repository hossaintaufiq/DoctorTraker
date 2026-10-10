"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { useDoctorTracker } from "@/context/DoctorTrackerContext";
import {
  Search,
  Plus,
  Eye,
  Trash2,
  Edit2,
  Calendar,
  FileDown,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  Building2,
  HeartPulse,
  RotateCcw,
  Users,
} from "lucide-react";
import { getInitials, formatDate, cn } from "@/lib/utils";
import { PatientCondition, Patient } from "@/lib/types";

const CONDITION_STYLES: Record<
  PatientCondition,
  { bg: string; text: string; dot: string }
> = {
  General: {
    bg: "bg-[#EBF3FE]",
    text: "text-[#2F65F6]",
    dot: "bg-[#2F65F6]",
  },
  Chronic: {
    bg: "bg-[#EFF6FF]",
    text: "text-[#1D4ED8]",
    dot: "bg-[#1D4ED8]",
  },
  Recovering: {
    bg: "bg-[#ECFDF5]",
    text: "text-[#10B981]",
    dot: "bg-[#10B981]",
  },
  "Follow-up": {
    bg: "bg-[#FEF3C7]",
    text: "text-[#D97706]",
    dot: "bg-[#D97706]",
  },
  Critical: {
    bg: "bg-[#FEE2E2]",
    text: "text-[#EF4444]",
    dot: "bg-[#EF4444]",
  },
};

export default function PatientsPage() {
  const {
    patients,
    doctors,
    setIsAddPatientModalOpen,
    setIsEditPatientModalOpen,
    setEditingPatient,
    deletePatient,
    showToast,
  } = useDoctorTracker();

  // Search & Filters state
  const [search, setSearch] = useState("");
  const [selectedCondition, setSelectedCondition] = useState<string>("All");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  const [selectedDoctor, setSelectedDoctor] = useState<string>("All");
  const [selectedDateFilter, setSelectedDateFilter] = useState<string>("All");
  const [selectedBloodGroup, setSelectedBloodGroup] = useState<string>("All");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Filtered Patients List
  const filteredPatients = useMemo(() => {
    return patients.filter((p) => {
      const q = search.toLowerCase();
      const matchesSearch =
        p.name.toLowerCase().includes(q) ||
        p.patientCode.toLowerCase().includes(q) ||
        p.assignedDoctorName.toLowerCase().includes(q) ||
        p.phone.includes(q) ||
        p.email.toLowerCase().includes(q);

      const matchesCondition =
        selectedCondition === "All" || p.condition === selectedCondition;

      const matchesStatus =
        selectedStatus === "All" || p.status === selectedStatus;

      const matchesDoctor =
        selectedDoctor === "All" ||
        p.assignedDoctorId === selectedDoctor ||
        p.assignedDoctorName === selectedDoctor;

      const matchesBlood =
        selectedBloodGroup === "All" || p.bloodGroup === selectedBloodGroup;

      let matchesDate = true;
      if (selectedDateFilter === "Last-7-Days") {
        const d = new Date(p.registrationDate);
        const now = new Date();
        const diffDays = (now.getTime() - d.getTime()) / (1000 * 3600 * 24);
        matchesDate = diffDays <= 7;
      } else if (selectedDateFilter === "Last-30-Days") {
        const d = new Date(p.registrationDate);
        const now = new Date();
        const diffDays = (now.getTime() - d.getTime()) / (1000 * 3600 * 24);
        matchesDate = diffDays <= 30;
      } else if (selectedDateFilter === "2026") {
        matchesDate = p.registrationDate.startsWith("2026");
      } else if (selectedDateFilter === "2025") {
        matchesDate = p.registrationDate.startsWith("2025");
      }

      return (
        matchesSearch &&
        matchesCondition &&
        matchesStatus &&
        matchesDoctor &&
        matchesBlood &&
        matchesDate
      );
    });
  }, [
    patients,
    search,
    selectedCondition,
    selectedStatus,
    selectedDoctor,
    selectedBloodGroup,
    selectedDateFilter,
  ]);

  // Paginated patients
  const totalPages = Math.max(1, Math.ceil(filteredPatients.length / pageSize));
  const currentPatients = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredPatients.slice(start, start + pageSize);
  }, [filteredPatients, currentPage, pageSize]);

  // Summary Metrics Counts
  const admittedCount = patients.filter((p) => p.status === "Admitted").length;
  const outpatientCount = patients.filter((p) => p.status === "Outpatient").length;
  const criticalCount = patients.filter((p) => p.condition === "Critical").length;

  const handleEditPatient = (patient: Patient) => {
    setEditingPatient(patient);
    setIsEditPatientModalOpen(true);
  };

  const handleDeletePatient = (patient: Patient) => {
    if (
      window.confirm(
        `Are you sure you want to delete patient ${patient.name} (${patient.patientCode})? This action cannot be undone.`
      )
    ) {
      deletePatient(patient.id);
    }
  };

  const handleResetFilters = () => {
    setSearch("");
    setSelectedCondition("All");
    setSelectedStatus("All");
    setSelectedDoctor("All");
    setSelectedDateFilter("All");
    setSelectedBloodGroup("All");
    setCurrentPage(1);
  };

  const handleExportCSV = () => {
    try {
      const headers = [
        "Patient ID",
        "Name",
        "Age",
        "Gender",
        "Assigned Doctor",
        "Condition",
        "Status",
        "Blood Group",
        "Phone",
        "Email",
        "Registered Date",
        "Last Visit",
      ];
      const rows = filteredPatients.map((p) => [
        p.patientCode,
        `"${p.name}"`,
        p.age,
        p.gender,
        `"${p.assignedDoctorName}"`,
        p.condition,
        p.status,
        p.bloodGroup,
        `"${p.phone}"`,
        `"${p.email}"`,
        p.registrationDate,
        p.lastVisit,
      ]);
      const csv =
        "data:text/csv;charset=utf-8," +
        [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
      const uri = encodeURI(csv);
      const link = document.createElement("a");
      link.setAttribute("href", uri);
      link.setAttribute(
        "download",
        `medcare_patients_roster_${new Date().toISOString().split("T")[0]}.csv`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast(
        "Export Successful",
        `Downloaded ${filteredPatients.length} patient records.`,
        "success"
      );
    } catch {
      showToast("Export Failed", "Could not export CSV file.", "error");
    }
  };

  const isFilterActive =
    search.trim() !== "" ||
    selectedCondition !== "All" ||
    selectedStatus !== "All" ||
    selectedDoctor !== "All" ||
    selectedDateFilter !== "All" ||
    selectedBloodGroup !== "All";

  return (
    <AppShell
      breadcrumbTitle="Patients"
      parentLabel="Workspace"
      parentPath="/dashboard"
    >
      <div className="space-y-6">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl sm:text-[28px] font-bold text-[#101828] tracking-tight">
                Patient Management
              </h1>
              <span className="px-3 py-1 text-xs font-semibold rounded-full bg-[#2F65F6]/10 text-[#2F65F6] border border-[#2F65F6]/20">
                {patients.length} Registered Records
              </span>
            </div>
            <p className="text-xs text-[#64748B] mt-1">
              Clinical charts, vital sign records, assigned specialists, and condition categories.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap shrink-0">
            <button
              onClick={handleExportCSV}
              className="flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-[#1E293B] bg-white/80 border border-white/90 rounded-full hover:bg-white card-shadow transition-all"
            >
              <FileDown className="w-3.5 h-3.5 text-[#64748B]" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={() => setIsAddPatientModalOpen(true)}
              className="flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-[#2F65F6] hover:bg-[#1E4FD8] rounded-full shadow-xs transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Register Patient</span>
            </button>
          </div>
        </div>

        {/* 4 Summary Stat KPI Mini Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="glass-card p-4.5 rounded-3xl flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-[#EBF3FE] text-[#2F65F6] flex items-center justify-center font-bold text-sm shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase text-[#64748B] truncate">
                Total Patients
              </p>
              <h3 className="text-xl font-bold text-[#101828]">
                {patients.length}
              </h3>
            </div>
          </div>

          <div className="glass-card p-4.5 rounded-3xl flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-[#ECFDF5] text-[#10B981] flex items-center justify-center font-bold text-sm shrink-0">
              <UserCheck className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase text-[#64748B] truncate">
                Outpatients
              </p>
              <h3 className="text-xl font-bold text-[#101828]">
                {outpatientCount}
              </h3>
            </div>
          </div>

          <div className="glass-card p-4.5 rounded-3xl flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-[#EFF6FF] text-[#1D4ED8] flex items-center justify-center font-bold text-sm shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase text-[#64748B] truncate">
                Inpatient / Admitted
              </p>
              <h3 className="text-xl font-bold text-[#101828]">
                {admittedCount}
              </h3>
            </div>
          </div>

          <div className="glass-card p-4.5 rounded-3xl flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-[#FEE2E2] text-[#EF4444] flex items-center justify-center font-bold text-sm shrink-0">
              <HeartPulse className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase text-[#64748B] truncate">
                Critical Care
              </p>
              <h3 className="text-xl font-bold text-[#101828]">
                {criticalCount}
              </h3>
            </div>
          </div>
        </div>

        {/* Filter & Live Search Toolbar */}
        <div className="glass-card p-4 sm:p-5 rounded-3xl space-y-3.5">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3.5">
            {/* Search Input */}
            <div className="relative w-full lg:w-80 shrink-0">
              <Search className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search by patient name, #PT-1042, doctor..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-2.5 text-xs rounded-full border border-white/80 bg-white/70 text-[#101828] placeholder-[#94A3B8] focus:bg-white focus:outline-none focus:border-[#2F65F6] transition-all shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)]"
              />
            </div>

            {/* Multi-Filters Grid */}
            <div className="flex items-center flex-wrap gap-2.5 w-full lg:w-auto">
              {/* Condition Filter */}
              <div className="flex items-center gap-1.5 text-xs text-[#64748B]">
                <span className="font-semibold hidden xl:inline">Condition:</span>
                <select
                  value={selectedCondition}
                  onChange={(e) => {
                    setSelectedCondition(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="px-3.5 py-2 text-xs rounded-full border border-white/80 bg-white/70 text-[#101828] focus:outline-none focus:border-[#2F65F6]"
                >
                  <option value="All">All Conditions</option>
                  <option value="General">General</option>
                  <option value="Chronic">Chronic</option>
                  <option value="Recovering">Recovering</option>
                  <option value="Follow-up">Follow-up</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-1.5 text-xs text-[#64748B]">
                <span className="font-semibold hidden xl:inline">Care Status:</span>
                <select
                  value={selectedStatus}
                  onChange={(e) => {
                    setSelectedStatus(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="px-3.5 py-2 text-xs rounded-full border border-white/80 bg-white/70 text-[#101828] focus:outline-none focus:border-[#2F65F6]"
                >
                  <option value="All">All Care Statuses</option>
                  <option value="Outpatient">Outpatient</option>
                  <option value="Admitted">Admitted</option>
                  <option value="Discharged">Discharged</option>
                </select>
              </div>

              {/* Doctor Filter */}
              <div className="flex items-center gap-1.5 text-xs text-[#64748B]">
                <span className="font-semibold hidden xl:inline">Doctor:</span>
                <select
                  value={selectedDoctor}
                  onChange={(e) => {
                    setSelectedDoctor(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="px-3.5 py-2 text-xs rounded-full border border-white/80 bg-white/70 text-[#101828] focus:outline-none focus:border-[#2F65F6] max-w-[160px] truncate"
                >
                  <option value="All">All Doctors</option>
                  {doctors.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date Filter */}
              <div className="flex items-center gap-1.5 text-xs text-[#64748B]">
                <Calendar className="w-3.5 h-3.5 text-[#94A3B8]" />
                <select
                  value={selectedDateFilter}
                  onChange={(e) => {
                    setSelectedDateFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="px-3.5 py-2 text-xs rounded-full border border-white/80 bg-white/70 text-[#101828] focus:outline-none focus:border-[#2F65F6]"
                >
                  <option value="All">All Dates</option>
                  <option value="Last-7-Days">Last 7 Days</option>
                  <option value="Last-30-Days">Last 30 Days</option>
                  <option value="2026">Year 2026</option>
                  <option value="2025">Year 2025</option>
                </select>
              </div>

              {/* Blood Group Filter */}
              <div className="flex items-center gap-1.5 text-xs text-[#64748B]">
                <select
                  value={selectedBloodGroup}
                  onChange={(e) => {
                    setSelectedBloodGroup(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="px-3 py-2 text-xs rounded-full border border-white/80 bg-white/70 text-[#101828] focus:outline-none focus:border-[#2F65F6]"
                >
                  <option value="All">Blood: All</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>

              {/* Permanent Reset Filter Button */}
              <button
                type="button"
                disabled={!isFilterActive}
                onClick={handleResetFilters}
                className={cn(
                  "px-3.5 py-2 text-xs font-semibold rounded-full border flex items-center gap-1.5 transition-all duration-200",
                  isFilterActive
                    ? "border-[#2F65F6]/40 bg-[#EBF3FE] text-[#2F65F6] hover:bg-[#DCE8FC] hover:text-[#1E4FD8] cursor-pointer shadow-xs active:scale-95"
                    : "border-white/80 bg-white/50 text-[#94A3B8] opacity-50 cursor-not-allowed"
                )}
                title={isFilterActive ? "Reset all filters" : "No active filters to reset"}
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            </div>
          </div>
        </div>

        {/* Patient Table Glass Container with Minimum Stable Height */}
        <div className="glass-card rounded-3xl p-4 sm:p-6 min-h-[380px] flex flex-col justify-between">
          <div className="overflow-x-auto -mx-4 sm:-mx-6">
            <table className="w-full text-left border-collapse min-w-[780px]">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
                  <th className="py-3 px-6">Patient</th>
                  <th className="py-3 px-4">Patient Code</th>
                  <th className="py-3 px-4">Assigned Doctor</th>
                  <th className="py-3 px-4">Condition</th>
                  <th className="py-3 px-4">Blood</th>
                  <th className="py-3 px-4">Care Status</th>
                  <th className="py-3 px-4">Registered</th>
                  <th className="py-3 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100/70 text-xs">
                {currentPatients.map((patient) => {
                  const conditionStyle =
                    CONDITION_STYLES[patient.condition] ||
                    CONDITION_STYLES.General;

                  return (
                    <tr
                      key={patient.id}
                      className="hover:bg-white/50 transition-colors group"
                    >
                      {/* Name & Avatar */}
                      <td className="py-3.5 px-6">
                        <Link
                          href={`/patients/${patient.id}`}
                          className="flex items-center gap-3"
                        >
                          <div className="w-9 h-9 rounded-xl bg-[#2F65F6]/10 text-[#2F65F6] font-bold text-xs flex items-center justify-center border border-white/80 shrink-0">
                            {getInitials(patient.name)}
                          </div>
                          <div>
                            <span className="font-bold text-[#101828] group-hover:text-[#2F65F6] transition-colors block">
                              {patient.name}
                            </span>
                            <span className="text-[11px] text-[#64748B]">
                              {patient.gender}, {patient.age} yrs &bull; {patient.phone}
                            </span>
                          </div>
                        </Link>
                      </td>

                      {/* Code */}
                      <td className="py-3.5 px-4 font-mono text-[11px] font-semibold text-[#64748B]">
                        {patient.patientCode}
                      </td>

                      {/* Doctor */}
                      <td className="py-3.5 px-4 font-medium text-[#1E293B]">
                        <span className="truncate block max-w-[150px]">{patient.assignedDoctorName}</span>
                      </td>

                      {/* Condition Badge */}
                      <td className="py-3.5 px-4">
                        <span
                          className={cn(
                            "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold",
                            conditionStyle.bg,
                            conditionStyle.text
                          )}
                        >
                          <span
                            className={cn(
                              "w-1.5 h-1.5 rounded-full",
                              conditionStyle.dot
                            )}
                          />
                          {patient.condition}
                        </span>
                      </td>

                      {/* Blood Group */}
                      <td className="py-3.5 px-4 font-bold text-[#101828]">
                        {patient.bloodGroup}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <span
                          className={cn(
                            "px-2.5 py-1 rounded-full text-[10px] font-semibold inline-block",
                            patient.status === "Admitted" && "bg-[#FEE2E2] text-[#EF4444]",
                            patient.status === "Outpatient" && "bg-[#EBF3FE] text-[#2F65F6]",
                            patient.status === "Discharged" && "bg-[#ECFDF5] text-[#10B981]"
                          )}
                        >
                          {patient.status}
                        </span>
                      </td>

                      {/* Reg Date */}
                      <td className="py-3.5 px-4 text-[#64748B] text-[11px]">
                        {formatDate(patient.registrationDate)}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Edit Patient */}
                          <button
                            type="button"
                            onClick={() => handleEditPatient(patient)}
                            className="p-1.5 text-[#64748B] hover:text-[#2F65F6] hover:bg-white rounded-lg transition-colors"
                            title="Edit Patient Information"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete Patient */}
                          <button
                            type="button"
                            onClick={() => handleDeletePatient(patient)}
                            className="p-1.5 text-[#94A3B8] hover:text-[#EF4444] hover:bg-[#FEF2F2] rounded-lg transition-colors"
                            title="Delete Patient Record"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>

                          {/* View Patient Details */}
                          <Link
                            href={`/patients/${patient.id}`}
                            className="p-1.5 text-[#2F65F6] bg-white/80 hover:bg-white rounded-lg border border-white/80 transition-colors"
                            title="View Clinical Chart"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredPatients.length === 0 && (
            <div className="p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#EBF3FE] text-[#2F65F6] flex items-center justify-center mx-auto">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[#101828]">
                No patient records found
              </h3>
              <p className="text-xs text-[#64748B] max-w-sm mx-auto">
                No patient matched your active search or filter parameters. Try clearing your filters or create a new patient record.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 text-xs font-semibold text-[#2F65F6] hover:underline"
              >
                Reset all filters
              </button>
            </div>
          )}
        </div>

        {/* Pagination Bar */}
        {filteredPatients.length > 0 && (
          <div className="glass-card p-4 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center flex-wrap gap-2 text-xs text-[#64748B]">
              <span>Showing</span>
              <span className="font-bold text-[#101828]">
                {Math.min(filteredPatients.length, (currentPage - 1) * pageSize + 1)}-
                {Math.min(filteredPatients.length, currentPage * pageSize)}
              </span>
              <span>of</span>
              <span className="font-bold text-[#101828]">
                {filteredPatients.length}
              </span>
              <span>patients</span>

              <div className="ml-2 sm:ml-4 flex items-center gap-1.5">
                <span className="hidden sm:inline">Rows per page:</span>
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="px-2.5 py-1 text-xs rounded-full border border-white/80 bg-white/70 text-[#101828]"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
              </div>
            </div>

            {/* Pagination Navigation */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="p-2 rounded-full border border-white/80 bg-white/70 text-[#64748B] hover:text-[#101828] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                aria-label="Previous Page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  type="button"
                  onClick={() => setCurrentPage(pageNum)}
                  className={cn(
                    "w-8 h-8 rounded-full text-xs font-bold transition-all",
                    currentPage === pageNum
                      ? "bg-[#2F65F6] text-white shadow-xs"
                      : "bg-white/70 text-[#64748B] hover:text-[#101828] border border-white/80"
                  )}
                >
                  {pageNum}
                </button>
              ))}

              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="p-2 rounded-full border border-white/80 bg-white/70 text-[#64748B] hover:text-[#101828] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                aria-label="Next Page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}

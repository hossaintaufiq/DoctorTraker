"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { useDoctorTracker } from "@/context/DoctorTrackerContext";
import {
  Search,
  Plus,
  Phone,
  Mail,
  Building2,
  Eye,
  Trash2,
  Edit2,
  Calendar,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  List,
  RotateCcw,
  Users,
} from "lucide-react";
import { getInitials, cn } from "@/lib/utils";
import { Doctor } from "@/lib/types";

export default function DoctorsPage() {
  const {
    doctors,
    setIsAddDoctorModalOpen,
    setIsEditDoctorModalOpen,
    setEditingDoctor,
    setIsAddPatientModalOpen,
    setSelectedDoctorForNewPatient,
    deleteDoctor,
    showToast,
    openConfirmDialog,
  } = useDoctorTracker();

  const [search, setSearch] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>("All");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  const [selectedHospital, setSelectedHospital] = useState<string>("All");
  const [selectedDateFilter, setSelectedDateFilter] = useState<string>("All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);

  const specialties = [
    "All",
    "Cardiology",
    "Neurology",
    "Pediatrics",
    "Orthopedics",
    "Dermatology",
    "General Medicine",
    "Gynecology",
    "Oncology",
    "Psychiatry",
  ];

  // Extract unique hospitals from doctor records
  const hospitals = useMemo(() => {
    const list = Array.from(new Set(doctors.map((d) => d.hospital).filter(Boolean)));
    return ["All", ...list];
  }, [doctors]);

  const filteredDoctors = useMemo(() => {
    return doctors.filter((doc) => {
      const q = search.toLowerCase();
      const matchesSearch =
        doc.name.toLowerCase().includes(q) ||
        doc.specialty.toLowerCase().includes(q) ||
        (doc.hospital && doc.hospital.toLowerCase().includes(q)) ||
        doc.email.toLowerCase().includes(q) ||
        doc.phone.toLowerCase().includes(q);

      const matchesSpecialty =
        selectedSpecialty === "All" || doc.specialty === selectedSpecialty;

      const matchesStatus =
        selectedStatus === "All" || doc.status === selectedStatus;

      const matchesHospital =
        selectedHospital === "All" || doc.hospital === selectedHospital;

      let matchesDate = true;
      if (selectedDateFilter === "2024-2026") {
        matchesDate = doc.joinedDate >= "2024-01-01";
      } else if (selectedDateFilter === "2022-2023") {
        matchesDate = doc.joinedDate >= "2022-01-01" && doc.joinedDate <= "2023-12-31";
      } else if (selectedDateFilter === "Prior-2022") {
        matchesDate = doc.joinedDate < "2022-01-01";
      }

      return matchesSearch && matchesSpecialty && matchesStatus && matchesHospital && matchesDate;
    });
  }, [doctors, search, selectedSpecialty, selectedStatus, selectedHospital, selectedDateFilter]);

  // Paginated doctors
  const totalPages = Math.max(1, Math.ceil(filteredDoctors.length / pageSize));
  const currentDoctors = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredDoctors.slice(start, start + pageSize);
  }, [filteredDoctors, currentPage, pageSize]);

  // Handle direct patient registration under doctor
  const handleAddPatientUnderDoctor = (doc: Doctor) => {
    setSelectedDoctorForNewPatient(doc);
    setIsAddPatientModalOpen(true);
  };

  const handleEditDoctor = (doc: Doctor) => {
    setEditingDoctor(doc);
    setIsEditDoctorModalOpen(true);
  };

  const handleDeleteDoctor = (doc: Doctor) => {
    openConfirmDialog({
      title: "Remove Doctor",
      itemName: `${doc.name} (${doc.specialty})`,
      itemType: "Doctor",
      message: `Are you sure you want to remove ${doc.name} from the medical directory? This action cannot be undone.`,
      confirmLabel: "Yes, Remove Doctor",
      onConfirm: () => {
        deleteDoctor(doc.id);
      },
    });
  };

  const handleResetFilters = () => {
    setSearch("");
    setSelectedSpecialty("All");
    setSelectedStatus("All");
    setSelectedHospital("All");
    setSelectedDateFilter("All");
    setCurrentPage(1);
  };

  const isFilterActive =
    search.trim() !== "" ||
    selectedSpecialty !== "All" ||
    selectedStatus !== "All" ||
    selectedHospital !== "All" ||
    selectedDateFilter !== "All";

  return (
    <AppShell breadcrumbTitle="Doctors" parentLabel="Menu" parentPath="/dashboard">
      <div className="space-y-6">
        {/* Header Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
          <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-3 flex-wrap">
              <h1 className="text-2xl sm:text-[28px] font-bold text-[#101828] tracking-tight">
                Doctor Management
              </h1>
              <span className="px-3 py-1 text-xs font-semibold rounded-full bg-[#2F65F6]/10 text-[#2F65F6] border border-[#2F65F6]/20">
                {filteredDoctors.length} {filteredDoctors.length === 1 ? "Physician" : "Physicians"}
              </span>
            </div>
            <p className="text-xs text-[#64748B] mt-1 text-center sm:text-left">
              Administer clinical specialists, hospital affiliations, patient quotas, and departments.
            </p>
          </div>

          <div className="flex items-center justify-center sm:justify-end gap-2.5 flex-wrap sm:flex-nowrap w-full sm:w-auto shrink-0">
            {/* View Mode Switcher: Grid View vs List View */}
            <div className="flex items-center justify-center bg-white/80 p-1 rounded-full border border-white/90 shadow-2xs">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer",
                  viewMode === "grid"
                    ? "bg-[#2F65F6] text-white shadow-xs"
                    : "text-[#64748B] hover:text-[#101828]"
                )}
                title="View as Grid Cards"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Grid View</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode("list")}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer",
                  viewMode === "list"
                    ? "bg-[#2F65F6] text-white shadow-xs"
                    : "text-[#64748B] hover:text-[#101828]"
                )}
                title="View as Table List"
              >
                <List className="w-3.5 h-3.5" />
                <span>List View</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => setIsAddDoctorModalOpen(true)}
              className="flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-[#2F65F6] hover:bg-[#1E4FD8] rounded-full shadow-xs transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create Doctor</span>
            </button>
          </div>
        </div>

        {/* Filter & Search Bar - Glass Card */}
        <div className="glass-card p-4 sm:p-5 rounded-3xl space-y-3.5">
          <div className="flex flex-col lg:flex-row items-center lg:items-center justify-between gap-3.5">
            {/* Search Input */}
            <div className="relative w-full max-w-md lg:max-w-none lg:w-88 shrink-0">
              <Search className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search by doctor name, hospital, specialty, phone..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-2.5 text-xs rounded-full border border-white/80 bg-white/70 text-[#101828] placeholder-[#94A3B8] focus:bg-white focus:outline-none focus:border-[#2F65F6] transition-all shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)]"
              />
            </div>

            {/* Filter Group - Centered on Mobile */}
            <div className="flex items-center justify-center lg:justify-start flex-wrap gap-2.5 w-full lg:w-auto">
              {/* Specialty Filter */}
              <div className="flex items-center justify-center gap-1.5 text-xs text-[#64748B]">
                <span className="font-semibold hidden sm:inline">Specialty:</span>
                <select
                  value={selectedSpecialty}
                  onChange={(e) => {
                    setSelectedSpecialty(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="px-3.5 py-2 text-xs rounded-full border border-white/80 bg-white/70 text-[#101828] focus:outline-none focus:border-[#2F65F6] cursor-pointer"
                >
                  {specialties.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              {/* Hospital Filter */}
              <div className="flex items-center justify-center gap-1.5 text-xs text-[#64748B]">
                <span className="font-semibold hidden sm:inline">Hospital:</span>
                <select
                  value={selectedHospital}
                  onChange={(e) => {
                    setSelectedHospital(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="px-3.5 py-2 text-xs rounded-full border border-white/80 bg-white/70 text-[#101828] focus:outline-none focus:border-[#2F65F6] max-w-[170px] truncate cursor-pointer"
                >
                  {hospitals.map((h) => (
                    <option key={h} value={h}>
                      {h}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status Filter */}
              <div className="flex items-center justify-center gap-1.5 text-xs text-[#64748B]">
                <span className="font-semibold hidden sm:inline">Status:</span>
                <select
                  value={selectedStatus}
                  onChange={(e) => {
                    setSelectedStatus(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="px-3.5 py-2 text-xs rounded-full border border-white/80 bg-white/70 text-[#101828] focus:outline-none focus:border-[#2F65F6] cursor-pointer"
                >
                  <option value="All">All Statuses</option>
                  <option value="Active">Active</option>
                  <option value="In Surgery">In Surgery</option>
                  <option value="On Leave">On Leave</option>
                  <option value="Off Duty">Off Duty</option>
                </select>
              </div>

              {/* Date Filter */}
              <div className="flex items-center justify-center gap-1.5 text-xs text-[#64748B]">
                <Calendar className="w-3.5 h-3.5 text-[#94A3B8]" />
                <select
                  value={selectedDateFilter}
                  onChange={(e) => {
                    setSelectedDateFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="px-3.5 py-2 text-xs rounded-full border border-white/80 bg-white/70 text-[#101828] focus:outline-none focus:border-[#2F65F6] cursor-pointer"
                >
                  <option value="All">All Joined Dates</option>
                  <option value="2024-2026">Recent (2024 - 2026)</option>
                  <option value="2022-2023">Mid-term (2022 - 2023)</option>
                  <option value="Prior-2022">Senior (Prior to 2022)</option>
                </select>
              </div>

              {/* Permanent Reset Filter Button */}
              <button
                type="button"
                disabled={!isFilterActive}
                onClick={handleResetFilters}
                className={cn(
                  "px-3.5 py-2 text-xs font-semibold rounded-full border flex items-center justify-center gap-1.5 transition-all duration-200 shrink-0",
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

        {/* Doctors Display with Minimum Stable Height */}
        <div className="min-h-[380px]">
          {filteredDoctors.length === 0 ? (
            <div className="glass-card rounded-3xl p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#EBF3FE] text-[#2F65F6] flex items-center justify-center mx-auto">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[#101828]">No doctors found</h3>
              <p className="text-xs text-[#64748B] max-w-sm mx-auto">
                No physician matched your search criteria. Try modifying your filter options or register a new doctor.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 text-xs font-semibold text-[#2F65F6] hover:underline"
              >
                Reset all filters
              </button>
            </div>
          ) : viewMode === "grid" ? (
            /* Grid View: Responsive Glassmorphic Doctor Cards */
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {currentDoctors.map((doc) => {
                const isActive = doc.status === "Active";
                const isInSurgery = doc.status === "In Surgery";
                const isOnLeave = doc.status === "On Leave";
                const loadPercentage = Math.min(
                  100,
                  Math.round((doc.patientCount / doc.maxPatients) * 100)
                );

                return (
                  <div
                    key={doc.id}
                    className="glass-card card-shadow-hover p-6 rounded-3xl flex flex-col justify-between"
                  >
                    <div>
                      {/* Top Bar */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#2F65F6]/20 to-[#60A5FA]/20 text-[#2F65F6] font-bold text-sm flex items-center justify-center border border-white/80 shrink-0 shadow-2xs">
                            {getInitials(doc.name)}
                          </div>
                          <div className="min-w-0">
                            <Link
                              href={`/doctors/${doc.id}`}
                              className="text-sm font-bold text-[#101828] hover:text-[#2F65F6] transition-colors truncate block"
                            >
                              {doc.name}
                            </Link>
                            <span className="text-xs font-semibold text-[#2F65F6] block">
                              {doc.specialty}
                            </span>
                          </div>
                        </div>

                        {/* Status Pill */}
                        <span
                          className={cn(
                            "px-2.5 py-0.5 rounded-full text-[10px] font-semibold shrink-0",
                            isActive && "bg-[#ECFDF5] text-[#10B981]",
                            isInSurgery && "bg-[#FEF3C7] text-[#D97706]",
                            isOnLeave && "bg-[#F1F5F9] text-[#64748B]",
                            !isActive && !isInSurgery && !isOnLeave && "bg-[#FEF2F2] text-[#EF4444]"
                          )}
                        >
                          &bull; {doc.status}
                        </span>
                      </div>

                      {/* Hospital & Contact Info */}
                      <div className="mt-4 space-y-2 text-xs text-[#64748B]">
                        <div className="flex items-center gap-2 truncate text-[#101828] font-medium">
                          <Building2 className="w-3.5 h-3.5 text-[#2F65F6] shrink-0" />
                          <span className="truncate">{doc.hospital || "Medcare Central Hospital"}</span>
                        </div>
                        <div className="flex items-center gap-2 truncate">
                          <Mail className="w-3.5 h-3.5 text-[#94A3B8] shrink-0" />
                          <span className="truncate">{doc.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-3.5 h-3.5 text-[#94A3B8] shrink-0" />
                          <span>{doc.phone}</span>
                        </div>
                        <div className="flex items-center justify-between text-[11px] pt-1">
                          <span>{doc.roomNumber}</span>
                          <span className="text-[#94A3B8]">Joined {doc.joinedDate}</span>
                        </div>
                      </div>

                      {/* Patient Load Capacity Bar */}
                      <div className="mt-4 pt-3.5 border-t border-slate-100">
                        <div className="flex items-center justify-between text-xs mb-1.5">
                          <span className="text-[#64748B]">Assigned Patients</span>
                          <span className="font-bold text-[#101828]">
                            {doc.patientCount} / {doc.maxPatients} ({loadPercentage}%)
                          </span>
                        </div>
                        <div className="w-full bg-[#F1F5F9] h-2 rounded-full overflow-hidden">
                          <div
                            className={cn(
                              "h-full rounded-full transition-all",
                              loadPercentage > 85 ? "bg-[#F59E0B]" : "bg-[#2F65F6]"
                            )}
                            style={{ width: `${loadPercentage}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Bottom Actions */}
                    <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between flex-wrap gap-2">
                      <div className="text-xs text-[#64748B]">
                        <span className="font-semibold text-[#101828]">{doc.experienceYears} yrs</span>
                        <span className="text-[#94A3B8] ml-1">experience</span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {/* Edit Doctor */}
                        <button
                          type="button"
                          onClick={() => handleEditDoctor(doc)}
                          className="p-1.5 text-[#64748B] hover:text-[#2F65F6] hover:bg-white rounded-lg transition-colors"
                          title="Edit Doctor"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        {/* Delete Doctor */}
                        <button
                          type="button"
                          onClick={() => handleDeleteDoctor(doc)}
                          className="p-1.5 text-[#94A3B8] hover:text-[#EF4444] hover:bg-[#FEF2F2] rounded-lg transition-colors"
                          title="Delete Doctor"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>

                        {/* View Profile */}
                        <Link
                          href={`/doctors/${doc.id}`}
                          className="p-1.5 text-[#2F65F6] bg-white/80 hover:bg-white rounded-lg border border-white/80 transition-colors"
                          title="View Doctor Chart & Patient List"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* List View */
            <div className="glass-card rounded-3xl overflow-hidden p-4 sm:p-6">
              <div className="overflow-x-auto -mx-4 sm:-mx-6">
                <table className="w-full text-left border-collapse min-w-[760px]">
                  <thead>
                    <tr className="border-b border-slate-100 text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
                      <th className="py-3 px-6">Doctor</th>
                      <th className="py-3 px-4">Specialization</th>
                      <th className="py-3 px-4">Hospital</th>
                      <th className="py-3 px-4">Phone / Email</th>
                      <th className="py-3 px-4">Patients</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100/70 text-xs">
                    {currentDoctors.map((doc) => (
                      <tr key={doc.id} className="hover:bg-white/50 transition-colors">
                        <td className="py-3.5 px-6">
                          <Link href={`/doctors/${doc.id}`} className="flex items-center gap-3 group">
                            <div className="w-9 h-9 rounded-xl bg-[#2F65F6]/10 text-[#2F65F6] font-bold text-xs flex items-center justify-center shrink-0">
                              {getInitials(doc.name)}
                            </div>
                            <div>
                              <span className="font-bold text-[#101828] group-hover:text-[#2F65F6] transition-colors block">
                                {doc.name}
                              </span>
                              <span className="text-[11px] text-[#64748B]">
                                {doc.roomNumber} &bull; {doc.experienceYears} yrs exp
                              </span>
                            </div>
                          </Link>
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-[#2F65F6]">
                          {doc.specialty}
                        </td>
                        <td className="py-3.5 px-4 text-[#101828] font-medium">
                          {doc.hospital || "Medcare Central Hospital"}
                        </td>
                        <td className="py-3.5 px-4 text-[#64748B]">
                          <div>{doc.phone}</div>
                          <div className="text-[11px] text-[#94A3B8]">{doc.email}</div>
                        </td>
                        <td className="py-3.5 px-4 font-bold text-[#101828]">
                          {doc.patientCount} <span className="text-[11px] text-[#94A3B8] font-normal">/ {doc.maxPatients}</span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={cn(
                              "px-2.5 py-0.5 rounded-full text-[10px] font-semibold inline-block",
                              doc.status === "Active" && "bg-[#ECFDF5] text-[#10B981]",
                              doc.status === "In Surgery" && "bg-[#FEF3C7] text-[#D97706]",
                              doc.status === "On Leave" && "bg-[#F1F5F9] text-[#64748B]"
                            )}
                          >
                            {doc.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-6 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleEditDoctor(doc)}
                              className="p-1.5 text-[#64748B] hover:text-[#2F65F6] hover:bg-white rounded-lg"
                              title="Edit"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteDoctor(doc)}
                              className="p-1.5 text-[#94A3B8] hover:text-[#EF4444] rounded-lg"
                              title="Delete"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                            <Link
                              href={`/doctors/${doc.id}`}
                              className="p-1.5 text-[#2F65F6] hover:bg-white rounded-lg border border-white/80"
                              title="View Chart"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Pagination Controls */}
        {filteredDoctors.length > 0 && (
          <div className="glass-card p-4 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center flex-wrap gap-2 text-xs text-[#64748B]">
              <span>Showing</span>
              <span className="font-bold text-[#101828]">
                {Math.min(filteredDoctors.length, (currentPage - 1) * pageSize + 1)}-
                {Math.min(filteredDoctors.length, currentPage * pageSize)}
              </span>
              <span>of</span>
              <span className="font-bold text-[#101828]">
                {filteredDoctors.length}
              </span>
              <span>doctors</span>

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
                  <option value={6}>6</option>
                  <option value={9}>9</option>
                  <option value={12}>12</option>
                  <option value={24}>24</option>
                </select>
              </div>
            </div>

            {/* Page Buttons */}
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

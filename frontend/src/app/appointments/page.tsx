"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { useDoctorTracker } from "@/context/DoctorTrackerContext";
import { AppointmentItem } from "@/lib/types";
import {
  Calendar,
  Clock,
  Search,
  Plus,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Play,
  User,
  Stethoscope,
  Building2,
  Phone,
  Filter,
  Check,
  ChevronRight,
  ListFilter,
  LayoutGrid,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function AppointmentsPage() {
  const {
    appointments,
    doctors,
    updateAppointmentStatus,
    cancelAppointment,
    setIsBookAppointmentModalOpen,
    showToast,
  } = useDoctorTracker();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  const [selectedDoctor, setSelectedDoctor] = useState<string>("All");
  const [selectedDatePreset, setSelectedDatePreset] = useState<string>("All");
  const [viewMode, setViewMode] = useState<"Table" | "Timeline">("Table");
  const [activeTab, setActiveTab] = useState<"All" | "Confirmed" | "In-Consultation" | "Completed" | "Cancelled">("All");

  const todayStr = new Date().toISOString().slice(0, 10);

  const isFiltered =
    searchQuery.trim() !== "" ||
    selectedStatus !== "All" ||
    selectedDoctor !== "All" ||
    selectedDatePreset !== "All" ||
    activeTab !== "All";

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedStatus("All");
    setSelectedDoctor("All");
    setSelectedDatePreset("All");
    setActiveTab("All");
  };

  const filteredAppointments = appointments.filter((apt) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      apt.patientName.toLowerCase().includes(query) ||
      apt.doctorName.toLowerCase().includes(query) ||
      apt.appointmentCode.toLowerCase().includes(query) ||
      apt.doctorSpecialty.toLowerCase().includes(query) ||
      apt.roomNumber.toLowerCase().includes(query);

    const matchesStatus =
      selectedStatus === "All" || apt.status === selectedStatus;

    const matchesTab =
      activeTab === "All" || apt.status === activeTab;

    const matchesDoctor =
      selectedDoctor === "All" || apt.doctorId === selectedDoctor;

    let matchesDate = true;
    if (selectedDatePreset === "Today") {
      matchesDate = apt.date === todayStr;
    } else if (selectedDatePreset === "Upcoming") {
      matchesDate = apt.date >= todayStr;
    }

    return matchesSearch && matchesStatus && matchesTab && matchesDoctor && matchesDate;
  });

  // KPI calculations
  const totalCount = appointments.length;
  const confirmedCount = appointments.filter((a) => a.status === "Confirmed").length;
  const inConsultCount = appointments.filter((a) => a.status === "In-Consultation").length;
  const completedCount = appointments.filter((a) => a.status === "Completed").length;

  const getStatusBadge = (status: AppointmentItem["status"]) => {
    switch (status) {
      case "Confirmed":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#EFF6FF] text-[#2F65F6] border border-[#DBEAFE]">
            &bull; Confirmed
          </span>
        );
      case "In-Consultation":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#FEF3C7] text-[#D97706] border border-[#FDE68A] animate-pulse">
            &bull; In Progress
          </span>
        );
      case "Completed":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#ECFDF5] text-[#10B981] border border-[#D1FAE5]">
            <Check className="w-3 h-3" /> Completed
          </span>
        );
      case "Cancelled":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#FEE2E2] text-[#EF4444] border border-[#FECACA]">
            &bull; Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-600 border border-slate-200">
            &bull; {status}
          </span>
        );
    }
  };

  return (
    <AppShell breadcrumbTitle="Appointments" parentLabel="Menu" parentPath="/dashboard">
      <div className="space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
          <div className="space-y-1 min-w-0">
            <h1 className="text-2xl sm:text-[28px] font-bold text-[#101828] tracking-tight leading-tight">
              Clinical Appointments Schedule
            </h1>
            <p className="text-xs sm:text-sm text-[#64748B] font-normal">
              Real-time patient booking slots, consultation timetables, and attending specialist rounds.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsBookAppointmentModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 h-10 px-5 text-xs sm:text-[13px] font-semibold text-white bg-gradient-to-r from-[#2F65F6] to-[#1E4FD8] hover:from-[#2557E5] hover:to-[#1742BC] rounded-xl shadow-[0_2px_8px_rgba(47,101,246,0.25)] hover:shadow-[0_4px_12px_rgba(47,101,246,0.35)] transition-all active:scale-[0.98] w-full sm:w-auto shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Book Appointment</span>
          </button>
        </div>

        {/* Aggregate KPI Cards - Fully Responsive Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {/* Card 1: Total Scheduled */}
          <div className="bg-white/95 rounded-2xl sm:rounded-3xl border border-[#EBF0F7] p-3.5 sm:p-5 card-shadow flex flex-col sm:flex-row sm:items-center gap-2.5 sm:gap-4 min-w-0">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-[#EBF3FE] text-[#2F65F6] flex items-center justify-center shrink-0">
              <Calendar className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] sm:text-[11px] text-[#94A3B8] font-bold uppercase tracking-wider block truncate">
                Total Scheduled
              </span>
              <p className="text-lg sm:text-2xl font-bold text-[#101828] tracking-tight mt-0.5">
                {totalCount} <span className="text-xs font-semibold text-[#64748B]">Slots</span>
              </p>
              <span className="text-[10px] sm:text-[11px] text-[#10B981] font-semibold block truncate mt-0.5">
                Active Roster
              </span>
            </div>
          </div>

          {/* Card 2: In Consultation */}
          <div className="bg-white/95 rounded-2xl sm:rounded-3xl border border-[#EBF0F7] p-3.5 sm:p-5 card-shadow flex flex-col sm:flex-row sm:items-center gap-2.5 sm:gap-4 min-w-0">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-[#FEF3C7] text-[#D97706] flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] sm:text-[11px] text-[#94A3B8] font-bold uppercase tracking-wider block truncate">
                In Consultation
              </span>
              <p className="text-lg sm:text-2xl font-bold text-[#D97706] tracking-tight mt-0.5">
                {inConsultCount} <span className="text-xs font-semibold text-[#64748B]">Active</span>
              </p>
              <span className="text-[10px] sm:text-[11px] text-[#64748B] font-semibold block truncate mt-0.5">
                Live in Chambers
              </span>
            </div>
          </div>

          {/* Card 3: Confirmed Waiting */}
          <div className="bg-white/95 rounded-2xl sm:rounded-3xl border border-[#EBF0F7] p-3.5 sm:p-5 card-shadow flex flex-col sm:flex-row sm:items-center gap-2.5 sm:gap-4 min-w-0">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-[#EFF6FF] text-[#2F65F6] flex items-center justify-center shrink-0">
              <User className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] sm:text-[11px] text-[#94A3B8] font-bold uppercase tracking-wider block truncate">
                Confirmed
              </span>
              <p className="text-lg sm:text-2xl font-bold text-[#101828] tracking-tight mt-0.5">
                {confirmedCount} <span className="text-xs font-semibold text-[#64748B]">Patients</span>
              </p>
              <span className="text-[10px] sm:text-[11px] text-[#2F65F6] font-semibold block truncate mt-0.5">
                Ready for Check-in
              </span>
            </div>
          </div>

          {/* Card 4: Completed */}
          <div className="bg-white/95 rounded-2xl sm:rounded-3xl border border-[#EBF0F7] p-3.5 sm:p-5 card-shadow flex flex-col sm:flex-row sm:items-center gap-2.5 sm:gap-4 min-w-0">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-[#ECFDF5] text-[#10B981] flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] sm:text-[11px] text-[#94A3B8] font-bold uppercase tracking-wider block truncate">
                Completed
              </span>
              <p className="text-lg sm:text-2xl font-bold text-[#10B981] tracking-tight mt-0.5">
                {completedCount} <span className="text-xs font-semibold text-[#64748B]">Discharged</span>
              </p>
              <span className="text-[10px] sm:text-[11px] text-[#10B981] font-semibold block truncate mt-0.5">
                Avg 18 min / patient
              </span>
            </div>
          </div>
        </div>

        {/* Interactive Filter Toolbar & View Toggle */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-[#EBF0F7] p-3.5 sm:p-4 card-shadow space-y-3">
          {/* Status Tabs & View Switcher */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 gap-2">
            {/* Scrollable Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 min-w-0 flex-1">
              {(["All", "Confirmed", "In-Consultation", "Completed", "Cancelled"] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "px-3 sm:px-3.5 py-1.5 text-xs font-semibold rounded-xl sm:rounded-full transition-all shrink-0 cursor-pointer",
                    activeTab === tab
                      ? "bg-[#2F65F6] text-white shadow-xs"
                      : "bg-[#F8FAFC] text-slate-600 border border-slate-200 hover:bg-slate-100"
                  )}
                >
                  {tab === "In-Consultation" ? "In Progress" : tab}
                </button>
              ))}
            </div>

            {/* View Switcher: Table vs Timeline */}
            <div className="flex items-center gap-1 bg-[#F8FAFC] p-1 rounded-xl sm:rounded-full border border-slate-200 shrink-0">
              <button
                type="button"
                onClick={() => setViewMode("Table")}
                className={cn(
                  "p-1.5 rounded-lg sm:rounded-full text-xs font-semibold transition-all cursor-pointer",
                  viewMode === "Table"
                    ? "bg-white text-[#2F65F6] shadow-2xs"
                    : "text-slate-500 hover:text-slate-800"
                )}
                title="Table List View"
                aria-label="Table View"
              >
                <ListFilter className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("Timeline")}
                className={cn(
                  "p-1.5 rounded-lg sm:rounded-full text-xs font-semibold transition-all cursor-pointer",
                  viewMode === "Timeline"
                    ? "bg-white text-[#2F65F6] shadow-2xs"
                    : "text-slate-500 hover:text-slate-800"
                )}
                title="Timeline Hourly View"
                aria-label="Timeline Cards View"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Search Input & Doctor / Date Selectors */}
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-2.5 sm:gap-3">
            <div className="relative w-full lg:max-w-xs">
              <input
                type="text"
                placeholder="Search patient, doctor, room or code..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl sm:rounded-full pl-9 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-[#2F65F6] transition-all"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 w-full lg:w-auto">
              {/* Doctor Filter */}
              <select
                value={selectedDoctor}
                onChange={(e) => setSelectedDoctor(e.target.value)}
                className="w-full bg-[#F8FAFC] border border-slate-200 text-slate-700 text-xs rounded-xl sm:rounded-full px-3 py-2 sm:py-1.5 focus:bg-white focus:outline-none focus:border-[#2F65F6] cursor-pointer truncate"
              >
                <option value="All">All Doctors</option>
                {doctors.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} ({d.specialty})
                  </option>
                ))}
              </select>

              {/* Date Preset */}
              <select
                value={selectedDatePreset}
                onChange={(e) => setSelectedDatePreset(e.target.value)}
                className="w-full bg-[#F8FAFC] border border-slate-200 text-slate-700 text-xs rounded-xl sm:rounded-full px-3 py-2 sm:py-1.5 focus:bg-white focus:outline-none focus:border-[#2F65F6] cursor-pointer"
              >
                <option value="All">All Dates</option>
                <option value="Today">Today's Schedule</option>
                <option value="Upcoming">Upcoming</option>
              </select>

              {/* Reset Filter Button */}
              <button
                type="button"
                onClick={handleResetFilters}
                disabled={!isFiltered}
                className={cn(
                  "h-9 sm:h-auto px-3.5 py-1.5 rounded-xl sm:rounded-full text-xs font-semibold flex items-center justify-center gap-1.5 border transition-all",
                  isFiltered
                    ? "bg-white text-[#2F65F6] border-[#2F65F6]/30 hover:bg-[#2F65F6]/5 cursor-pointer shadow-2xs"
                    : "bg-[#F8FAFC] text-slate-400 border-slate-200 cursor-not-allowed opacity-60"
                )}
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>
          </div>
        </div>

        {/* Content Views: Table (Desktop) / Cards (Mobile) or Timeline */}
        {viewMode === "Table" ? (
          <div className="bg-white rounded-2xl sm:rounded-3xl border border-[#EBF0F7] p-3.5 sm:p-6 card-shadow">
            {/* Desktop / Tablet Data Table (md and above) */}
            <div className="hidden md:block overflow-x-auto -mx-3.5 sm:-mx-6">
              <table className="w-full text-left border-collapse min-w-[760px]">
                <thead>
                  <tr className="text-[11px] font-semibold text-[#94A3B8] uppercase border-b border-[#F1F5F9]">
                    <th className="py-3 px-6">Appointment & Slot</th>
                    <th className="py-3 px-4">Patient</th>
                    <th className="py-3 px-4">Attending Doctor</th>
                    <th className="py-3 px-4">Room & Type</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-6 text-right">Quick Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1F5F9] text-xs">
                  {filteredAppointments.map((apt) => (
                    <tr key={apt.id} className="hover:bg-[#F8FAFC] transition-colors">
                      <td className="py-3.5 px-6">
                        <div className="font-mono font-bold text-[#2F65F6]">
                          {apt.appointmentCode}
                        </div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span>{apt.timeSlot}</span> &bull; <span>{apt.date}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-[#101828] flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-slate-400" />
                          <span>{apt.patientName}</span>
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          {apt.patientPhone}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-[#101828]">{apt.doctorName}</div>
                        <div className="text-[11px] text-[#2F65F6]">{apt.doctorSpecialty}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-slate-700 block">{apt.roomNumber}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">
                          {apt.type}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">{getStatusBadge(apt.status)}</td>

                      <td className="py-3.5 px-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {apt.status === "Confirmed" && (
                            <button
                              type="button"
                              onClick={() => updateAppointmentStatus(apt.id, "In-Consultation")}
                              className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-700 font-semibold rounded-full border border-amber-200 transition-all flex items-center gap-1 cursor-pointer"
                              title="Start Consultation"
                            >
                              <Play className="w-3 h-3 fill-amber-700" />
                              <span>Start</span>
                            </button>
                          )}

                          {apt.status === "In-Consultation" && (
                            <button
                              type="button"
                              onClick={() => updateAppointmentStatus(apt.id, "Completed")}
                              className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold rounded-full border border-emerald-200 transition-all flex items-center gap-1 cursor-pointer"
                              title="Mark as Completed"
                            >
                              <Check className="w-3 h-3" />
                              <span>Complete</span>
                            </button>
                          )}

                          {apt.status !== "Completed" && apt.status !== "Cancelled" && (
                            <button
                              type="button"
                              onClick={() => cancelAppointment(apt.id)}
                              className="p-1.5 text-slate-400 hover:text-rose-500 rounded-full hover:bg-rose-50 transition-all cursor-pointer"
                              title="Cancel Slot"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}

                  {filteredAppointments.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-400">
                        No appointments found for the selected criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile Touch-Friendly Card View (Below md screen size) */}
            <div className="md:hidden space-y-3">
              {filteredAppointments.length === 0 ? (
                <div className="py-10 text-center text-xs text-slate-400">
                  No appointments found for the selected criteria.
                </div>
              ) : (
                filteredAppointments.map((apt) => (
                  <div
                    key={apt.id}
                    className="p-3.5 rounded-2xl bg-[#F8FAFC] border border-[#EBF0F7] space-y-2.5"
                  >
                    {/* Top Row: Code + Time Badge + Status */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-xs font-bold text-[#2F65F6]">
                          {apt.appointmentCode}
                        </span>
                        <span className="text-[10px] text-slate-600 font-medium flex items-center gap-1 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                          <Clock className="w-3 h-3 text-[#2F65F6]" />
                          {apt.timeSlot}
                        </span>
                      </div>
                      {getStatusBadge(apt.status)}
                    </div>

                    {/* Patient & Doctor Details */}
                    <div className="pt-0.5">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold text-[#101828]">
                          {apt.patientName}
                        </h4>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-200/70 text-slate-700 font-medium">
                          {apt.type}
                        </span>
                      </div>
                      <p className="text-xs text-[#64748B] mt-1 flex items-center gap-1">
                        <Stethoscope className="w-3.5 h-3.5 text-[#2F65F6] shrink-0" />
                        <span className="truncate">{apt.doctorName} &bull; {apt.doctorSpecialty}</span>
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {apt.roomNumber} &bull; {apt.date} &bull; {apt.patientPhone}
                      </p>
                    </div>

                    {/* Mobile Action Buttons */}
                    <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between gap-2">
                      <span className="text-[11px] text-slate-500 font-medium">
                        Actions
                      </span>
                      <div className="flex items-center gap-2">
                        {apt.status === "Confirmed" && (
                          <button
                            type="button"
                            onClick={() => updateAppointmentStatus(apt.id, "In-Consultation")}
                            className="px-3 py-1 bg-amber-50 hover:bg-amber-100 text-amber-700 font-semibold rounded-lg text-xs border border-amber-200 transition-all flex items-center gap-1 cursor-pointer"
                          >
                            <Play className="w-3 h-3 fill-amber-700" />
                            <span>Start</span>
                          </button>
                        )}
                        {apt.status === "In-Consultation" && (
                          <button
                            type="button"
                            onClick={() => updateAppointmentStatus(apt.id, "Completed")}
                            className="px-3 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold rounded-lg text-xs border border-emerald-200 transition-all flex items-center gap-1 cursor-pointer"
                          >
                            <Check className="w-3 h-3" />
                            <span>Complete</span>
                          </button>
                        )}
                        {apt.status !== "Completed" && apt.status !== "Cancelled" && (
                          <button
                            type="button"
                            onClick={() => cancelAppointment(apt.id)}
                            className="px-2.5 py-1 text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg text-xs border border-rose-200 transition-all cursor-pointer"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        ) : (
          /* Timeline Hourly Schedule Board View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
            {filteredAppointments.map((apt) => (
              <div
                key={apt.id}
                className="bg-white rounded-2xl sm:rounded-3xl border border-[#EBF0F7] p-4 sm:p-5 card-shadow flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-[#2F65F6]">
                      {apt.appointmentCode}
                    </span>
                    {getStatusBadge(apt.status)}
                  </div>

                  <div className="mt-3">
                    <h3 className="text-sm font-bold text-[#101828]">{apt.patientName}</h3>
                    <p className="text-xs text-[#64748B] mt-0.5 flex items-center gap-1">
                      <Stethoscope className="w-3.5 h-3.5 text-[#2F65F6] shrink-0" />
                      <span className="truncate">{apt.doctorName} &bull; {apt.doctorSpecialty}</span>
                    </p>
                  </div>

                  <div className="mt-3 p-2.5 rounded-xl sm:rounded-2xl bg-[#F8FAFC] border border-slate-100 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-slate-700 font-semibold">
                      <Clock className="w-3.5 h-3.5 text-[#2F65F6]" />
                      <span>{apt.timeSlot}</span>
                    </div>
                    <div className="text-slate-500 font-medium">
                      {apt.roomNumber}
                    </div>
                  </div>

                  {apt.notes && (
                    <p className="text-[11px] text-slate-500 mt-2 bg-slate-50 p-2 rounded-xl border border-slate-100 italic">
                      "{apt.notes}"
                    </p>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-medium">{apt.type}</span>

                  <div className="flex items-center gap-1.5">
                    {apt.status === "Confirmed" && (
                      <button
                        type="button"
                        onClick={() => updateAppointmentStatus(apt.id, "In-Consultation")}
                        className="px-3 py-1 bg-[#2F65F6] text-white text-xs font-semibold rounded-full shadow-xs hover:bg-[#1E4FD8] transition-all cursor-pointer"
                      >
                        Start Session
                      </button>
                    )}
                    {apt.status === "In-Consultation" && (
                      <button
                        type="button"
                        onClick={() => updateAppointmentStatus(apt.id, "Completed")}
                        className="px-3 py-1 bg-emerald-600 text-white text-xs font-semibold rounded-full shadow-xs hover:bg-emerald-700 transition-all cursor-pointer"
                      >
                        Mark Done
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}

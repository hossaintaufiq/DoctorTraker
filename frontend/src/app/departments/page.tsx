"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { useDoctorTracker } from "@/context/DoctorTrackerContext";
import { DepartmentItem } from "@/lib/types";
import {
  Building2,
  HeartPulse,
  Brain,
  Baby,
  Bone,
  Activity,
  Stethoscope,
  ChevronRight,
  Search,
  RotateCcw,
  BedDouble,
  Users,
  ShieldAlert,
  Flame,
  Layers,
  Sparkles,
  Calendar,
  X,
  CheckCircle2,
  Cpu,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function DepartmentsPage() {
  const { departments, setIsBookAppointmentModalOpen, showToast } = useDoctorTracker();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFloor, setSelectedFloor] = useState("All");
  const [selectedLoad, setSelectedLoad] = useState("All");
  const [emergencyOnly, setEmergencyOnly] = useState(false);
  const [selectedDeptForDetail, setSelectedDeptForDetail] = useState<DepartmentItem | null>(null);

  const isFiltered =
    searchQuery.trim() !== "" ||
    selectedFloor !== "All" ||
    selectedLoad !== "All" ||
    emergencyOnly;

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedFloor("All");
    setSelectedLoad("All");
    setEmergencyOnly(false);
  };

  const filteredDepartments = departments.filter((dept) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      dept.name.toLowerCase().includes(query) ||
      dept.code.toLowerCase().includes(query) ||
      dept.headName.toLowerCase().includes(query) ||
      dept.topServices.some((s) => s.toLowerCase().includes(query)) ||
      dept.equipmentSummary.toLowerCase().includes(query);

    const matchesFloor = selectedFloor === "All" || dept.floor.includes(selectedFloor);

    const matchesLoad =
      selectedLoad === "All" ||
      (selectedLoad === "High" && dept.occupancyPercentage >= 80) ||
      (selectedLoad === "Moderate" && dept.occupancyPercentage >= 60 && dept.occupancyPercentage < 80) ||
      (selectedLoad === "Low" && dept.occupancyPercentage < 60);

    const matchesEmergency = !emergencyOnly || dept.emergencyReady;

    return matchesSearch && matchesFloor && matchesLoad && matchesEmergency;
  });

  // Aggregate Metrics
  const totalBeds = departments.reduce((acc, d) => acc + d.totalBeds, 0);
  const totalOccupied = departments.reduce((acc, d) => acc + d.occupiedBeds, 0);
  const totalStaff = departments.reduce((acc, d) => acc + d.specialistsCount, 0);
  const totalActiveCases = departments.reduce((acc, d) => acc + d.activeCasesCount, 0);
  const averageOccupancy = Math.round((totalOccupied / (totalBeds || 1)) * 100);

  const getDeptIcon = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes("cardio")) return HeartPulse;
    if (lower.includes("neuro")) return Brain;
    if (lower.includes("pediatric") || lower.includes("child")) return Baby;
    if (lower.includes("ortho") || lower.includes("trauma")) return Bone;
    if (lower.includes("emergency")) return Flame;
    if (lower.includes("derma") || lower.includes("skin")) return Sparkles;
    if (lower.includes("radiology") || lower.includes("imaging")) return Layers;
    return Activity;
  };

  return (
    <AppShell breadcrumbTitle="Departments" parentLabel="Menu" parentPath="/dashboard">
      <div className="space-y-6">
        {/* Header Title & Top Summary */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
          <div>
            <h1 className="text-2xl sm:text-[28px] font-bold text-[#101828] tracking-tight">
              Hospital Clinical Departments & Divisions
            </h1>
            <p className="text-xs text-[#64748B] mt-1">
              Comprehensive ward rosters, bed capacity utilization, and attending specialist teams.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsBookAppointmentModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-[#2F65F6] hover:bg-[#1E4FD8] rounded-full shadow-xs transition-all self-start sm:self-auto"
          >
            <Calendar className="w-4 h-4" />
            <span>Book Department Slot</span>
          </button>
        </div>

        {/* Aggregate KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-3xl border border-[#EBF0F7] p-5 card-shadow flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#EBF3FE] text-[#2F65F6] flex items-center justify-center shrink-0">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] text-[#94A3B8] font-semibold uppercase">Total Divisions</span>
              <p className="text-2xl font-bold text-[#101828]">{departments.length} Units</p>
              <span className="text-[10px] text-[#10B981] font-semibold">100% Operational</span>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-[#EBF0F7] p-5 card-shadow flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#ECFDF5] text-[#10B981] flex items-center justify-center shrink-0">
              <BedDouble className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] text-[#94A3B8] font-semibold uppercase">Bed Capacity</span>
              <p className="text-2xl font-bold text-[#101828]">{totalOccupied} / {totalBeds}</p>
              <span className="text-[10px] text-[#64748B] font-semibold">{averageOccupancy}% Overall Load</span>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-[#EBF0F7] p-5 card-shadow flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#F3E8FF] text-[#9333EA] flex items-center justify-center shrink-0">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] text-[#94A3B8] font-semibold uppercase">Specialist Doctors</span>
              <p className="text-2xl font-bold text-[#101828]">{totalStaff} Doctors</p>
              <span className="text-[10px] text-[#9333EA] font-semibold">12 Chief Consultants</span>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-[#EBF0F7] p-5 card-shadow flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#FEF3C7] text-[#D97706] flex items-center justify-center shrink-0">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] text-[#94A3B8] font-semibold uppercase">Active Inpatients</span>
              <p className="text-2xl font-bold text-[#101828]">{totalActiveCases} Patients</p>
              <span className="text-[10px] text-[#D97706] font-semibold">Active Round-the-clock</span>
            </div>
          </div>
        </div>

        {/* Interactive Filter Toolbar */}
        <div className="bg-white rounded-3xl border border-[#EBF0F7] p-4 card-shadow flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <input
              type="text"
              placeholder="Search department, head, services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#F8FAFC] border border-slate-200 rounded-full pl-9 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-[#2F65F6] transition-all"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            {/* Floor Select */}
            <select
              value={selectedFloor}
              onChange={(e) => setSelectedFloor(e.target.value)}
              className="bg-[#F8FAFC] border border-slate-200 text-slate-700 text-xs rounded-full px-3 py-1.5 focus:bg-white focus:outline-none focus:border-[#2F65F6]"
            >
              <option value="All">All Floors</option>
              <option value="Ground">Ground Floor</option>
              <option value="Floor 1">1st Floor</option>
              <option value="Floor 2">2nd Floor</option>
              <option value="Floor 3">3rd Floor</option>
              <option value="Floor 4">4th Floor</option>
            </select>

            {/* Load Select */}
            <select
              value={selectedLoad}
              onChange={(e) => setSelectedLoad(e.target.value)}
              className="bg-[#F8FAFC] border border-slate-200 text-slate-700 text-xs rounded-full px-3 py-1.5 focus:bg-white focus:outline-none focus:border-[#2F65F6]"
            >
              <option value="All">All Bed Loads</option>
              <option value="High">High Load (&gt; 80%)</option>
              <option value="Moderate">Moderate (60-80%)</option>
              <option value="Low">Low Load (&lt; 60%)</option>
            </select>

            {/* Emergency Readiness Button */}
            <button
              type="button"
              onClick={() => setEmergencyOnly(!emergencyOnly)}
              className={cn(
                "px-3 py-1.5 text-xs font-semibold rounded-full border transition-all flex items-center gap-1.5 shrink-0",
                emergencyOnly
                  ? "bg-rose-50 text-rose-600 border-rose-200"
                  : "bg-[#F8FAFC] text-slate-600 border-slate-200 hover:bg-slate-100"
              )}
            >
              <Flame className="w-3.5 h-3.5 text-rose-500" />
              <span>24/7 Emergency Units</span>
            </button>

            {/* Permanent Non-Shifting Reset Button */}
            <button
              type="button"
              onClick={handleResetFilters}
              disabled={!isFiltered}
              className={cn(
                "h-8 px-3 rounded-full text-xs font-semibold flex items-center gap-1.5 border transition-all shrink-0",
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

        {/* Departments Grid (12+ Rich Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredDepartments.map((dept) => {
            const Icon = getDeptIcon(dept.name);
            const isHighLoad = dept.occupancyPercentage >= 80;

            return (
              <div
                key={dept.id}
                className="bg-white rounded-3xl border border-[#EBF0F7] p-6 card-shadow card-shadow-hover flex flex-col justify-between transition-all"
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-[#EBF3FE] text-[#2F65F6] flex items-center justify-center shrink-0 border border-blue-50">
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <span className="text-[10px] font-mono font-bold text-slate-400">
                          {dept.code}
                        </span>
                        <h3 className="text-base font-bold text-[#101828] leading-snug">
                          {dept.name}
                        </h3>
                      </div>
                    </div>

                    <span
                      className={cn(
                        "px-2.5 py-1 rounded-full text-[11px] font-semibold border shrink-0",
                        isHighLoad
                          ? "bg-rose-50 text-rose-600 border-rose-200"
                          : "bg-[#F4F7FB] text-[#64748B] border-[#EBF0F7]"
                      )}
                    >
                      {dept.occupancyPercentage}% Load
                    </span>
                  </div>

                  {/* Floor & Emergency Tag */}
                  <div className="flex items-center gap-2 mt-3 text-xs text-[#64748B]">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 font-medium text-slate-700 text-[11px]">
                      {dept.floor}
                    </span>
                    {dept.emergencyReady && (
                      <span className="px-2 py-0.5 rounded-md bg-rose-50 text-rose-600 border border-rose-100 font-semibold text-[10px] flex items-center gap-1">
                        <Flame className="w-3 h-3" /> 24/7 ER Ready
                      </span>
                    )}
                  </div>

                  {/* Head of Department */}
                  <p className="text-xs text-[#64748B] mt-3">
                    Head Physician: <strong className="text-[#101828] font-semibold">{dept.headName}</strong>
                  </p>

                  {/* Bed Occupancy Progress Bar */}
                  <div className="mt-4 space-y-1.5">
                    <div className="flex justify-between text-[11px]">
                      <span className="font-semibold text-slate-600">Bed Occupancy</span>
                      <span className="font-mono text-slate-800 font-bold">
                        {dept.occupiedBeds} / {dept.totalBeds} Beds
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all duration-500",
                          isHighLoad ? "bg-rose-500" : "bg-[#2F65F6]"
                        )}
                        style={{ width: `${dept.occupancyPercentage}%` }}
                      />
                    </div>
                  </div>

                  {/* Top Clinical Services Tags */}
                  <div className="mt-4 pt-3 border-t border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                      Key Clinical Services
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {dept.topServices.map((service, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-full bg-slate-50 text-slate-600 text-[10px] border border-slate-200"
                        >
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Staff & Active Cases Stats */}
                  <div className="grid grid-cols-2 gap-2.5 mt-4 pt-3 border-t border-[#F1F5F9]">
                    <div className="p-2.5 rounded-2xl bg-[#F8FAFC]">
                      <span className="text-[10px] font-semibold text-[#94A3B8] uppercase">Staff Doctors</span>
                      <p className="text-xs font-bold text-[#101828] mt-0.5">{dept.specialistsCount} Specialists</p>
                    </div>
                    <div className="p-2.5 rounded-2xl bg-[#F8FAFC]">
                      <span className="text-[10px] font-semibold text-[#94A3B8] uppercase">Active Inpatients</span>
                      <p className="text-xs font-bold text-[#2F65F6] mt-0.5">{dept.activeCasesCount} Cases</p>
                    </div>
                  </div>
                </div>

                {/* Footer Action Buttons */}
                <div className="mt-5 pt-3 border-t border-[#F1F5F9] flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setSelectedDeptForDetail(dept)}
                    className="text-xs font-semibold text-slate-700 hover:text-[#2F65F6] inline-flex items-center gap-1"
                  >
                    <Info className="w-3.5 h-3.5" />
                    <span>Unit Details</span>
                  </button>

                  <Link
                    href={`/doctors?specialty=${encodeURIComponent(dept.name)}`}
                    className="text-xs font-semibold text-[#2F65F6] hover:underline inline-flex items-center gap-1"
                  >
                    <span>Specialists</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}

          {filteredDepartments.length === 0 && (
            <div className="col-span-full py-16 text-center bg-white rounded-3xl border border-slate-200 p-8">
              <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-800">No departments match your filters</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Try searching for a different keyword or resetting your filter options.
              </p>
              <button
                onClick={handleResetFilters}
                className="mt-4 px-4 py-2 text-xs font-semibold text-white bg-[#2F65F6] rounded-full shadow-xs"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>

        {/* Department Detailed Specifications Modal */}
        {selectedDeptForDetail && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/40 backdrop-blur-md animate-fade-in">
            <div className="bg-white/95 backdrop-blur-3xl w-full max-w-2xl rounded-3xl border border-white/90 shadow-2xl p-6 sm:p-8 overflow-hidden animate-scale-up">
              <div className="flex items-start justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#EBF3FE] text-[#2F65F6] flex items-center justify-center">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-mono font-bold text-slate-400">
                      {selectedDeptForDetail.code}
                    </span>
                    <h2 className="text-xl font-bold text-[#101828]">
                      {selectedDeptForDetail.name} Division
                    </h2>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedDeptForDetail(null)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="py-5 space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-slate-50 rounded-2xl">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Head of Department</span>
                    <p className="text-sm font-bold text-slate-900 mt-0.5">{selectedDeptForDetail.headName}</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-2xl">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Hospital Location</span>
                    <p className="text-sm font-bold text-slate-900 mt-0.5">{selectedDeptForDetail.floor}</p>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold flex items-center gap-1">
                    <Cpu className="w-3.5 h-3.5 text-[#2F65F6]" /> Specialized Medical Equipment
                  </span>
                  <p className="text-slate-700 leading-relaxed font-medium">
                    {selectedDeptForDetail.equipmentSummary}
                  </p>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block mb-2">
                    Clinical Procedures Offered
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {selectedDeptForDetail.topServices.map((service, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 rounded-full bg-[#EBF3FE] text-[#2F65F6] font-semibold border border-blue-100"
                      >
                        {service}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedDeptForDetail(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-full"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedDeptForDetail(null);
                    setIsBookAppointmentModalOpen(true);
                  }}
                  className="px-5 py-2.5 text-xs font-bold text-white bg-[#2F65F6] hover:bg-[#1E4FD8] rounded-full shadow-xs flex items-center gap-1.5"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book Consultation</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}

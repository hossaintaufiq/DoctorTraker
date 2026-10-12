"use client";

import React, { useState, useEffect } from "react";
import { Search, RotateCcw } from "lucide-react";
import { Doctor } from "@/lib/types";

interface PatientFiltersBarProps {
  search: string;
  onSearchChange: (val: string) => void;
  condition: string;
  onConditionChange: (val: string) => void;
  status: string;
  onStatusChange: (val: string) => void;
  bloodGroup: string;
  onBloodGroupChange: (val: string) => void;
  doctorId: string;
  onDoctorIdChange: (val: string) => void;
  doctors: Doctor[];
  onReset: () => void;
}

const CONDITIONS = ["All", "General", "Chronic", "Recovering", "Follow-up", "Critical"];
const STATUSES = ["All", "Outpatient", "Admitted", "Discharged", "Emergency"];
const BLOOD_GROUPS = ["All", "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export function PatientFiltersBar({
  search,
  onSearchChange,
  condition,
  onConditionChange,
  status,
  onStatusChange,
  bloodGroup,
  onBloodGroupChange,
  doctorId,
  onDoctorIdChange,
  doctors,
  onReset,
}: PatientFiltersBarProps) {
  // Local state for debounced search (~300ms)
  const [localSearch, setLocalSearch] = useState(search);

  useEffect(() => {
    setLocalSearch(search);
  }, [search]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearch !== search) {
        onSearchChange(localSearch);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [localSearch, search, onSearchChange]);

  const hasActiveFilters =
    search.trim() !== "" ||
    condition !== "All" ||
    status !== "All" ||
    bloodGroup !== "All" ||
    doctorId !== "All";

  return (
    <div className="glass-card p-4 rounded-3xl space-y-3 shadow-2xs">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        {/* Search input with 300ms debounce */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search patients by name, code, doctor, phone..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs bg-white/70 border border-white/80 rounded-2xl text-[#1E293B] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#2F65F6]/20 transition-all"
            aria-label="Search patients"
          />
        </div>

        {/* Filters Group */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Condition */}
          <select
            value={condition}
            onChange={(e) => onConditionChange(e.target.value)}
            className="flex-1 sm:flex-initial min-w-[120px] px-3 py-2 text-xs bg-white/70 border border-white/80 rounded-2xl text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#2F65F6]/20 cursor-pointer"
            aria-label="Filter by condition"
          >
            {CONDITIONS.map((cond) => (
              <option key={cond} value={cond}>
                {cond === "All" ? "All Conditions" : cond}
              </option>
            ))}
          </select>

          {/* Status */}
          <select
            value={status}
            onChange={(e) => onStatusChange(e.target.value)}
            className="flex-1 sm:flex-initial min-w-[110px] px-3 py-2 text-xs bg-white/70 border border-white/80 rounded-2xl text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#2F65F6]/20 cursor-pointer"
            aria-label="Filter by status"
          >
            {STATUSES.map((st) => (
              <option key={st} value={st}>
                {st === "All" ? "All Statuses" : st}
              </option>
            ))}
          </select>

          {/* Blood Group */}
          <select
            value={bloodGroup}
            onChange={(e) => onBloodGroupChange(e.target.value)}
            className="flex-1 sm:flex-initial min-w-[110px] px-3 py-2 text-xs bg-white/70 border border-white/80 rounded-2xl text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#2F65F6]/20 cursor-pointer"
            aria-label="Filter by blood group"
          >
            {BLOOD_GROUPS.map((bg) => (
              <option key={bg} value={bg}>
                {bg === "All" ? "All Blood Groups" : `Blood: ${bg}`}
              </option>
            ))}
          </select>

          {/* Assigned Doctor */}
          <select
            value={doctorId}
            onChange={(e) => onDoctorIdChange(e.target.value)}
            className="flex-1 sm:flex-initial min-w-[130px] max-w-[200px] px-3 py-2 text-xs bg-white/70 border border-white/80 rounded-2xl text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#2F65F6]/20 cursor-pointer truncate"
            aria-label="Filter by doctor"
          >
            <option value="All">All Doctors</option>
            {doctors.map((doc, idx) => (
              <option key={doc.id || (doc as any)._id || `pt-filter-doc-${idx}`} value={doc.id || (doc as any)._id}>
                {doc.name}
              </option>
            ))}
          </select>

          {/* Reset Filters Button */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={onReset}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#64748B] hover:text-[#1E293B] bg-white/60 hover:bg-white rounded-2xl border border-white/80 transition-all cursor-pointer"
              title="Reset all filters"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

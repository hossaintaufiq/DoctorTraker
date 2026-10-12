"use client";

import React, { useState, useEffect } from "react";
import { Search, LayoutGrid, List, RotateCcw } from "lucide-react";

interface DoctorFiltersBarProps {
  search: string;
  onSearchChange: (val: string) => void;
  specialty: string;
  onSpecialtyChange: (val: string) => void;
  status: string;
  onStatusChange: (val: string) => void;
  hospital: string;
  onHospitalChange: (val: string) => void;
  viewMode: "grid" | "list";
  onViewModeChange: (val: "grid" | "list") => void;
  onReset: () => void;
  hospitals?: string[];
}

const SPECIALTIES = [
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

const STATUSES = ["All", "Active", "In Surgery", "On Leave"];

export function DoctorFiltersBar({
  search,
  onSearchChange,
  specialty,
  onSpecialtyChange,
  status,
  onStatusChange,
  hospital,
  onHospitalChange,
  viewMode,
  onViewModeChange,
  onReset,
  hospitals = ["All"],
}: DoctorFiltersBarProps) {
  // Local state for debounced search
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
    specialty !== "All" ||
    status !== "All" ||
    hospital !== "All";

  return (
    <div className="glass-card p-4 rounded-3xl space-y-3 shadow-2xs">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        {/* Search input with 300ms debounce */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search doctors by name, specialty, hospital..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs bg-white/70 border border-white/80 rounded-2xl text-[#1E293B] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#2F65F6]/20 transition-all"
            aria-label="Search doctors"
          />
        </div>

        {/* Dropdowns & View Mode */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Specialty */}
          <select
            value={specialty}
            onChange={(e) => onSpecialtyChange(e.target.value)}
            className="px-3 py-2 text-xs bg-white/70 border border-white/80 rounded-2xl text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#2F65F6]/20 cursor-pointer"
            aria-label="Filter by specialty"
          >
            {SPECIALTIES.map((spec) => (
              <option key={spec} value={spec}>
                {spec === "All" ? "All Specialties" : spec}
              </option>
            ))}
          </select>

          {/* Status */}
          <select
            value={status}
            onChange={(e) => onStatusChange(e.target.value)}
            className="px-3 py-2 text-xs bg-white/70 border border-white/80 rounded-2xl text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#2F65F6]/20 cursor-pointer"
            aria-label="Filter by clinical status"
          >
            {STATUSES.map((st) => (
              <option key={st} value={st}>
                {st === "All" ? "All Statuses" : st}
              </option>
            ))}
          </select>

          {/* Hospital */}
          {hospitals.length > 1 && (
            <select
              value={hospital}
              onChange={(e) => onHospitalChange(e.target.value)}
              className="px-3 py-2 text-xs bg-white/70 border border-white/80 rounded-2xl text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#2F65F6]/20 cursor-pointer max-w-[180px] truncate"
              aria-label="Filter by hospital"
            >
              {hospitals.map((hosp) => (
                <option key={hosp} value={hosp}>
                  {hosp === "All" ? "All Hospitals" : hosp}
                </option>
              ))}
            </select>
          )}

          {/* Reset Filters */}
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

          {/* View Mode Toggle */}
          <div className="flex items-center p-1 bg-white/60 border border-white/80 rounded-2xl">
            <button
              type="button"
              onClick={() => onViewModeChange("grid")}
              className={`p-1.5 rounded-xl transition-all cursor-pointer ${
                viewMode === "grid"
                  ? "bg-[#2F65F6] text-white shadow-2xs"
                  : "text-[#64748B] hover:text-[#1E293B]"
              }`}
              title="Grid View"
              aria-label="Grid view"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange("list")}
              className={`p-1.5 rounded-xl transition-all cursor-pointer ${
                viewMode === "list"
                  ? "bg-[#2F65F6] text-white shadow-2xs"
                  : "text-[#64748B] hover:text-[#1E293B]"
              }`}
              title="List Table View"
              aria-label="List table view"
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { Plus, Calendar, ChevronDown, Check, UserPlus, Download } from "lucide-react";
import { useDoctorTracker } from "@/context/DoctorTrackerContext";
import { cn } from "@/lib/utils";

const DATE_RANGE_OPTIONS = [
  "Today",
  "Last 7 Days",
  "Last 30 Days",
  "This Month",
  "Last Quarter",
  "This Year",
];

export function DashboardHeader() {
  const {
    dateRange,
    setDateRange,
    setIsAddDoctorModalOpen,
    setIsAddPatientModalOpen,
    showToast,
  } = useDoctorTracker();

  const [isDateDropdownOpen, setIsDateDropdownOpen] = useState(false);

  const handleExport = () => {
    showToast("Export Initiated", "Monthly operational report downloaded as CSV.", "success");
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E8EDF3]/60 mb-6">
      {/* Left Title & Subtitle */}
      <div>
        <h1 className="text-2xl sm:text-[26px] font-bold text-[#172B4D] tracking-tight leading-tight">
          Dashboard
        </h1>
        <p className="text-xs sm:text-sm text-[#7A8798] mt-1 font-normal leading-relaxed">
          Here&apos;s what&apos;s happening with your healthcare operations today.
        </p>
      </div>

      {/* Right Controls */}
      <div className="flex items-center flex-wrap gap-2.5 sm:gap-3">
        {/* Date Range Selector */}
        <div className="relative">
          <button
            onClick={() => setIsDateDropdownOpen(!isDateDropdownOpen)}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-[#243247] bg-white border border-[#E8EDF3] rounded-xl hover:bg-[#F7F9FC] card-shadow transition-all"
            aria-label="Select date range"
          >
            <Calendar className="w-3.5 h-3.5 text-[#0F9F9A] shrink-0" />
            <span>{dateRange}</span>
            <ChevronDown className="w-3.5 h-3.5 text-[#7A8798] shrink-0" />
          </button>

          {isDateDropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsDateDropdownOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl border border-[#E8EDF3] popover-shadow p-1.5 z-50 animate-fade-in text-xs">
                {DATE_RANGE_OPTIONS.map((option) => {
                  const isSelected = option === dateRange;
                  return (
                    <button
                      key={option}
                      onClick={() => {
                        setDateRange(option);
                        setIsDateDropdownOpen(false);
                        showToast("Filter Updated", `Showing data for ${option}.`, "info");
                      }}
                      className={cn(
                        "w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors",
                        isSelected
                          ? "bg-[#E6F7F6] text-[#0F9F9A] font-semibold"
                          : "text-[#243247] hover:bg-[#F7F9FC]"
                      )}
                    >
                      <span>{option}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-[#0F9F9A]" />}
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* Secondary Quick Action: Add Patient */}
        <button
          onClick={() => setIsAddPatientModalOpen(true)}
          className="hidden md:flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#0F9F9A] bg-[#E6F7F6] hover:bg-[#D5F2F0] rounded-xl transition-all"
        >
          <UserPlus className="w-3.5 h-3.5 stroke-[2.2]" />
          <span>New Patient</span>
        </button>

        {/* Primary Action Button: Add Doctor */}
        <button
          onClick={() => setIsAddDoctorModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-[#0F9F9A] hover:bg-[#0B7F7A] rounded-xl shadow-xs transition-all active:scale-[0.98]"
        >
          <Plus className="w-4 h-4 stroke-[2.4]" />
          <span>Add Doctor</span>
        </button>
      </div>
    </div>
  );
}

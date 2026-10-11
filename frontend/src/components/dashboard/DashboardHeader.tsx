"use client";

import React, { useState, useRef, useEffect } from "react";
import { Download, FileText, Calendar, ChevronDown, Check } from "lucide-react";
import { useDoctorTracker } from "@/context/DoctorTrackerContext";
import { ReportModal } from "@/components/modals/ReportModal";
import { cn } from "@/lib/utils";

const TIME_FILTERS = ["This week", "Today", "Last week", "This month", "This year"];

export function DashboardHeader() {
  const { patients, showToast, user } = useDoctorTracker();
  const [selectedTime, setSelectedTime] = useState("This week");
  const [isOpen, setIsOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const doctorTitle = user?.name
    ? user.name.startsWith("Dr.")
      ? user.name
      : `Dr. ${user.name}`
    : "Dr. Robert";

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Functional CSV Exporter
  const handleExportCSV = () => {
    try {
      const headers = [
        "Patient ID",
        "Patient Name",
        "Age",
        "Gender",
        "Assigned Doctor",
        "Condition",
        "Care Status",
        "Blood Group",
        "Registration Date",
      ];
      const rows = patients.map((p) => [
        p.patientCode,
        `"${p.name}"`,
        p.age,
        p.gender,
        `"${p.assignedDoctorName}"`,
        p.condition,
        p.status,
        p.bloodGroup,
        p.registrationDate,
      ]);

      const csvContent =
        "data:text/csv;charset=utf-8," +
        [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute(
        "download",
        `medcare_patients_${new Date().toISOString().split("T")[0]}.csv`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      showToast(
        "Export Complete",
        `Exported ${patients.length} patient records as CSV.`,
        "success"
      );
    } catch (e) {
      showToast("Export Failed", "Could not generate CSV file.", "error");
    }
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1 mb-6">
        {/* Welcome Title & Subtitle */}
        <div className="space-y-1 min-w-0">
          <h1 className="text-2xl sm:text-[28px] font-bold text-[#101828] tracking-tight leading-tight">
            Welcome back, {doctorTitle}!
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] font-normal">
            Here is your clinic overview, patient appointments, and medical staff activity.
          </p>
        </div>

        {/* Action Buttons: Row 1 (Generate Report + This week), Row 2 (Export to CSV at bottom) */}
        <div className="flex flex-col gap-2 shrink-0 w-full sm:w-auto">
          {/* Top Row: Generate Report & This week dropdown */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {/* Generate Report Button */}
            <button
              type="button"
              onClick={() => setIsReportOpen(true)}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 h-9 sm:h-10 px-3.5 sm:px-4 rounded-xl text-xs sm:text-[13px] font-semibold text-[#1E293B] bg-white/95 hover:bg-white border border-[#E2E8F0] hover:border-[#CBD5E1] shadow-[0_1px_2px_rgba(0,0,0,0.04)] hover:shadow-xs transition-all duration-200 active:scale-[0.98] cursor-pointer group whitespace-nowrap"
              title="Generate custom clinical and analytical reports"
            >
              <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#64748B] group-hover:text-[#2F65F6] transition-colors shrink-0" />
              <span>Generate Report</span>
            </button>

            {/* Time Range Filter Dropdown */}
            <div className="relative flex-1 sm:flex-initial" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-9 sm:h-10 px-3.5 sm:px-4 rounded-xl text-xs sm:text-[13px] font-semibold text-white bg-gradient-to-r from-[#2F65F6] to-[#1E4FD8] hover:from-[#2557E5] hover:to-[#1742BC] shadow-[0_2px_8px_rgba(47,101,246,0.25)] hover:shadow-[0_4px_12px_rgba(47,101,246,0.35)] transition-all duration-200 active:scale-[0.98] cursor-pointer whitespace-nowrap"
                aria-label="Filter timeline"
              >
                <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white/90 shrink-0" />
                <span>{selectedTime}</span>
                <ChevronDown
                  className={cn(
                    "w-3.5 h-3.5 text-white/85 transition-transform duration-200 shrink-0",
                    isOpen && "rotate-180"
                  )}
                />
              </button>

              {isOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-white/98 backdrop-blur-xl rounded-2xl border border-[#E2E8F0] shadow-xl p-1.5 z-50 animate-fade-in text-xs">
                  <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#94A3B8]">
                    Select Range
                  </div>
                  {TIME_FILTERS.map((item) => {
                    const isSelected = item === selectedTime;
                    return (
                      <button
                        key={item}
                        type="button"
                        onClick={() => {
                          setSelectedTime(item);
                          setIsOpen(false);
                          showToast(
                            "Range Filtered",
                            `Showing dashboard metrics for ${item}.`,
                            "info"
                          );
                        }}
                        className={cn(
                          "w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-colors font-medium cursor-pointer",
                          isSelected
                            ? "bg-[#EBF3FE] text-[#2F65F6] font-semibold"
                            : "text-[#1E293B] hover:bg-[#F4F7FB]"
                        )}
                      >
                        <span>{item}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-[#2F65F6]" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Bottom Row: Export to CSV (underneath Generate Report & This week) */}
          <button
            type="button"
            onClick={handleExportCSV}
            className="w-full inline-flex items-center justify-center gap-2 h-9 sm:h-10 px-3.5 sm:px-4 rounded-xl text-xs sm:text-[13px] font-semibold text-[#1E293B] bg-white/95 hover:bg-white border border-[#E2E8F0] hover:border-[#CBD5E1] shadow-[0_1px_2px_rgba(0,0,0,0.04)] hover:shadow-xs transition-all duration-200 active:scale-[0.98] cursor-pointer group"
            title="Download full patient records in CSV format"
          >
            <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#64748B] group-hover:text-[#2F65F6] transition-colors shrink-0" />
            <span>Export to CSV</span>
          </button>
        </div>
      </div>

      {/* Interactive Report Modal */}
      <ReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
      />
    </>
  );
}

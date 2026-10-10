"use client";

import React, { useState, useRef, useEffect } from "react";
import { Briefcase, FileText, ChevronDown, Check } from "lucide-react";
import { useDoctorTracker } from "@/context/DoctorTrackerContext";
import { ReportModal } from "@/components/modals/ReportModal";
import { cn } from "@/lib/utils";

const TIME_FILTERS = ["This week", "Today", "Last week", "This month", "This year"];

export function DashboardHeader() {
  const { patients, doctors, showToast } = useDoctorTracker();
  const [selectedTime, setSelectedTime] = useState("This week");
  const [isOpen, setIsOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 mb-6">
        {/* Welcome Title */}
        <div>
          <h1 className="text-2xl sm:text-[28px] font-bold text-[#101828] tracking-tight leading-tight">
            Welcome back, Dr, Robert!
          </h1>
        </div>

        {/* Right Action Pills */}
        <div className="flex items-center flex-wrap gap-2.5 sm:gap-3">
          {/* Export to CSV */}
          <button
            type="button"
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-[#1E293B] bg-white border border-[#EBF0F7] rounded-full hover:bg-[#F8FAFC] card-shadow transition-all active:scale-[0.98]"
          >
            <span>Export to CSV</span>
            <Briefcase className="w-3.5 h-3.5 text-[#64748B]" />
          </button>

          {/* Generate Report */}
          <button
            type="button"
            onClick={() => setIsReportOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-[#1E293B] bg-white border border-[#EBF0F7] rounded-full hover:bg-[#F8FAFC] card-shadow transition-all active:scale-[0.98]"
          >
            <span>Generate Report</span>
            <FileText className="w-3.5 h-3.5 text-[#64748B]" />
          </button>

          {/* Time Selector Dropdown (Solid Blue Pill) */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-[#2F65F6] hover:bg-[#1E4FD8] rounded-full shadow-xs transition-all"
            >
              <span>{selectedTime}</span>
              <ChevronDown className="w-3.5 h-3.5 text-white/90" />
            </button>

            {isOpen && (
              <div className="absolute right-0 mt-2 w-36 bg-white rounded-2xl border border-[#EBF0F7] popover-shadow p-1.5 z-50 animate-fade-in text-xs">
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
                        "w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-colors",
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
      </div>

      {/* Interactive Report Modal */}
      <ReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
      />
    </>
  );
}

"use client";

import React from "react";
import { X, FileText, Download, Printer, CheckCircle2, TrendingUp } from "lucide-react";
import { useDoctorTracker } from "@/context/DoctorTrackerContext";

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ReportModal({ isOpen, onClose }: ReportModalProps) {
  const { doctors, patients, showToast } = useDoctorTracker();

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    showToast("PDF Report Downloaded", "Clinical Operations Report saved to downloads.", "success");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#0B132B]/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-2xl bg-white rounded-3xl border border-[#EBF0F7] popover-shadow overflow-hidden z-50 animate-fade-in flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#EBF0F7] flex items-center justify-between bg-white">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#EBF3FE] text-[#2F65F6] flex items-center justify-center">
              <FileText className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#101828]">Executive Clinical Report</h3>
              <p className="text-xs text-[#64748B]">Medcare &bull; Weekly Operational Summary</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#64748B] hover:text-[#101828] rounded-lg hover:bg-[#F4F7FB] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Report Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-[#1E293B]">
          {/* Key Metrics Banner */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-2xl bg-[#F4F7FB] border border-[#EBF0F7]">
              <span className="text-[10px] text-[#94A3B8] uppercase font-semibold block">Total Revenue</span>
              <span className="text-base font-bold text-[#101828] mt-0.5 block">$54,24.05</span>
              <span className="text-[10px] text-[#10B981] font-semibold">+18.4% vs last wk</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#F4F7FB] border border-[#EBF0F7]">
              <span className="text-[10px] text-[#94A3B8] uppercase font-semibold block">Active Patients</span>
              <span className="text-base font-bold text-[#101828] mt-0.5 block">{patients.length} Registrations</span>
              <span className="text-[10px] text-[#2F65F6] font-semibold">100% Verified</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#F4F7FB] border border-[#EBF0F7]">
              <span className="text-[10px] text-[#94A3B8] uppercase font-semibold block">Active Doctors</span>
              <span className="text-base font-bold text-[#101828] mt-0.5 block">{doctors.length} Physicians</span>
              <span className="text-[10px] text-[#10B981] font-semibold">88% Capacity</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#F4F7FB] border border-[#EBF0F7]">
              <span className="text-[10px] text-[#94A3B8] uppercase font-semibold block">Appointments</span>
              <span className="text-base font-bold text-[#101828] mt-0.5 block">96 Bookings</span>
              <span className="text-[10px] text-[#2F65F6] font-semibold">+14% Efficiency</span>
            </div>
          </div>

          {/* Department Breakdown */}
          <div>
            <h4 className="font-bold text-[#101828] mb-2.5 uppercase tracking-wider text-[11px]">
              Specialist Physician Capacity
            </h4>
            <div className="space-y-2">
              {doctors.slice(0, 4).map((doc) => (
                <div
                  key={doc.id}
                  className="p-3 rounded-2xl bg-[#F8FAFC] border border-[#EBF0F7] flex items-center justify-between"
                >
                  <div>
                    <span className="font-bold text-[#101828]">{doc.name}</span>
                    <span className="text-[11px] text-[#64748B] block">{doc.specialty} &bull; Room {doc.roomNumber}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-[#2F65F6]">{doc.patientCount} Active Pts</span>
                    <span className="text-[10px] text-[#10B981] block">Rating: {doc.rating.toFixed(1)} / 5.0</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-[#EBF0F7] bg-white flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-[#1E293B] bg-[#F4F7FB] hover:bg-[#EBF3FE] hover:text-[#2F65F6] rounded-full transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print</span>
          </button>
          <button
            type="button"
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-white bg-[#2F65F6] hover:bg-[#1E4FD8] rounded-full shadow-xs transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
}

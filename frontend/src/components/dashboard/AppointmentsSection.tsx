"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  ArrowUpRight,
  FileText,
  Trash2,
} from "lucide-react";
import { useDoctorTracker } from "@/context/DoctorTrackerContext";
import { cn } from "@/lib/utils";

const DAYS_OF_MONTH = Array.from({ length: 23 }, (_, i) => i + 1);

export function AppointmentsSection() {
  const { appointments, cancelAppointment, showToast, openConfirmDialog } = useDoctorTracker();
  const [selectedDay, setSelectedDay] = useState(13);

  const handleDelete = (id: string, name: string) => {
    openConfirmDialog({
      title: "Cancel Appointment",
      itemName: name,
      itemType: "Patient Appointment",
      message: `Are you sure you want to cancel the scheduled consultation for ${name}?`,
      confirmLabel: "Yes, Cancel Slot",
      onConfirm: () => {
        cancelAppointment(id);
      },
    });
  };

  const activeAppointments = useMemo(() => {
    return appointments.filter((a) => a.status !== "Cancelled");
  }, [appointments]);

  return (
    <div className="bg-white rounded-3xl border border-[#EBF0F7] p-6 card-shadow flex flex-col justify-between">
      {/* Header with Title, Legend & Diagonal Arrow Circle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#F1F5F9]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#EBF3FE] text-[#2F65F6] flex items-center justify-center shrink-0">
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#101828] tracking-tight">
              Appointments ({activeAppointments.length})
            </h3>
          </div>
        </div>

        {/* Legend & Diagonal Arrow */}
        <div className="flex items-center gap-4 text-xs text-[#64748B] flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#CBD5E1]" />
            <span>Available Slots</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#2F65F6]" />
            <span className="text-[#2F65F6] font-semibold">Selected</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#E2E8F0]" />
            <span>Unavailable Slots</span>
          </div>

          <Link
            href="/appointments"
            className="w-8 h-8 rounded-full bg-[#101828] text-white flex items-center justify-center hover:bg-[#2F65F6] transition-colors shrink-0"
            aria-label="View all appointments"
          >
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Date Carousel Strip - Responsive without sliding bars */}
      <div className="py-3 sm:py-4 flex items-center justify-between gap-1.5 sm:gap-2 select-none border-b border-[#F1F5F9]">
        <button
          type="button"
          onClick={() => setSelectedDay((prev) => Math.max(10, prev - 1))}
          className="w-7 h-7 rounded-full bg-[#F4F7FB] flex items-center justify-center text-[#64748B] hover:bg-[#EBF3FE] hover:text-[#2F65F6] shrink-0"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Desktop: Full 14-day range */}
        <div className="hidden sm:flex items-center gap-1.5 md:gap-2 flex-1 justify-between">
          {DAYS_OF_MONTH.map((day) => {
            const isSelected = day === selectedDay;
            const isUnavailable = day === 17 || day === 19;

            return (
              <button
                key={day}
                type="button"
                onClick={() => setSelectedDay(day)}
                className={cn(
                  "w-7 h-7 rounded-full text-xs font-semibold flex items-center justify-center transition-all shrink-0",
                  isSelected
                    ? "bg-[#2F65F6] text-white shadow-xs"
                    : isUnavailable
                    ? "bg-[#E2E8F0] text-[#94A3B8]"
                    : "bg-[#EBF3FE]/70 text-[#64748B] hover:bg-[#EBF3FE] hover:text-[#2F65F6]"
                )}
              >
                {day}
              </button>
            );
          })}
        </div>

        {/* Mobile: 7-day view centered on selected day (fits 100% of mobile screens without sliding bar) */}
        <div className="flex sm:hidden items-center gap-1 flex-1 justify-around">
          {DAYS_OF_MONTH.slice(
            Math.max(0, Math.min(DAYS_OF_MONTH.length - 7, (DAYS_OF_MONTH.indexOf(selectedDay) >= 0 ? DAYS_OF_MONTH.indexOf(selectedDay) : 0) - 3)),
            Math.max(0, Math.min(DAYS_OF_MONTH.length - 7, (DAYS_OF_MONTH.indexOf(selectedDay) >= 0 ? DAYS_OF_MONTH.indexOf(selectedDay) : 0) - 3)) + 7
          ).map((day) => {
            const isSelected = day === selectedDay;
            const isUnavailable = day === 17 || day === 19;

            return (
              <button
                key={day}
                type="button"
                onClick={() => setSelectedDay(day)}
                className={cn(
                  "w-7 h-7 rounded-full text-xs font-semibold flex items-center justify-center transition-all shrink-0",
                  isSelected
                    ? "bg-[#2F65F6] text-white shadow-xs"
                    : isUnavailable
                    ? "bg-[#E2E8F0] text-[#94A3B8]"
                    : "bg-[#EBF3FE]/70 text-[#64748B] hover:bg-[#EBF3FE] hover:text-[#2F65F6]"
                )}
              >
                {day}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => setSelectedDay((prev) => Math.min(23, prev + 1))}
          className="w-7 h-7 rounded-full bg-[#F4F7FB] flex items-center justify-center text-[#64748B] hover:bg-[#EBF3FE] hover:text-[#2F65F6] shrink-0"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Appointments Table */}
      <div className="overflow-x-auto -mx-6 flex-1 mt-2">
        {activeAppointments.length === 0 ? (
          <div className="py-12 text-center text-xs text-[#64748B]">
            No appointments scheduled yet. Book an appointment from the directory.
          </div>
        ) : (
          <table className="w-full text-left border-collapse min-w-[620px]">
            <thead>
              <tr className="text-[11px] font-semibold text-[#94A3B8] uppercase">
                <th className="py-3 px-6">Patients</th>
                <th className="py-3 px-4">Assigned Doctor</th>
                <th className="py-3 px-4">Date / Slot</th>
                <th className="py-3 px-4 text-center">Condition</th>
                <th className="py-3 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9] text-xs">
              {activeAppointments.slice(0, 5).map((apt) => (
                <tr key={apt.id} className="hover:bg-[#F8FAFC] transition-colors group">
                  {/* Patient */}
                  <td className="py-3 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full overflow-hidden bg-[#EBF3FE] text-[#2F65F6] border border-[#EBF0F7] shrink-0 flex items-center justify-center font-bold text-xs">
                        {apt.patientName.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <span className="font-bold text-[#101828] block">
                          {apt.patientName}
                        </span>
                        <span className="text-[11px] text-[#94A3B8]">
                          {apt.patientPhone || "+1 (555) 019-2834"}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Assigned Doctor */}
                  <td className="py-3 px-4">
                    <span className="font-semibold text-[#101828] block">
                      {apt.doctorName}
                    </span>
                    <span className="text-[11px] text-[#94A3B8]">
                      {apt.doctorSpecialty}
                    </span>
                  </td>

                  {/* Date / Time */}
                  <td className="py-3 px-4">
                    <span className="font-semibold text-[#101828] block">
                      {apt.timeSlot || "10:00 AM"}
                    </span>
                    <span className="text-[11px] text-[#94A3B8]">
                      {apt.date}
                    </span>
                  </td>

                  {/* Type / Reason Pill */}
                  <td className="py-3 px-4 text-center">
                    <span className="px-4 py-1 rounded-full text-xs font-medium text-[#1E293B] border border-[#EBF0F7] bg-white inline-block">
                      {apt.type || "Consultation"}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          showToast("Medical Notes", `Clinical notes for ${apt.patientName}: ${apt.notes || "Regular checkup"}`, "info")
                        }
                        className="p-1.5 text-[#94A3B8] hover:text-[#2F65F6] hover:bg-[#EBF3FE] rounded-lg transition-colors cursor-pointer"
                        title="View Notes"
                      >
                        <FileText className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(apt.id, apt.patientName)}
                        className="p-1.5 text-[#EF4444] hover:bg-[#FEF2F2] rounded-lg transition-colors cursor-pointer"
                        title="Cancel Appointment"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Table Bottom Footer: Record Count & View All Schedule Link */}
      <div className="pt-4 mt-3 border-t border-[#F1F5F9] flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="text-xs text-[#64748B] flex items-center gap-1.5">
          <span>Showing</span>
          <span className="font-semibold text-[#101828]">
            {Math.min(5, activeAppointments.length)}
          </span>
          <span>of</span>
          <span className="font-semibold text-[#101828]">
            {activeAppointments.length}
          </span>
          <span>scheduled consultation records</span>
        </div>

        <Link
          href="/appointments"
          className="text-xs font-semibold text-[#2F65F6] hover:text-[#1E4FD8] inline-flex items-center gap-1 transition-colors group"
        >
          <span>View full schedule</span>
          <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
}

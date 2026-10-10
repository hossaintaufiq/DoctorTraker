"use client";

import React, { useState } from "react";
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

const APPOINTMENTS_LIST = [
  {
    id: "apt-1",
    patientName: "Jane Cooper",
    patientAge: 28,
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    doctorName: "Dr. Eleanor Pena",
    doctorSpecialty: "Cardiology",
    time: "11:30 AM",
    date: "25/12/2026",
    disease: "Fever",
  },
  {
    id: "apt-2",
    patientName: "Olivia Bennett",
    patientAge: 34,
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
    doctorName: "Dr. Salman Hossain",
    doctorSpecialty: "Cardiology",
    time: "09:15 AM",
    date: "10/10/2026",
    disease: "Hypertension",
  },
  {
    id: "apt-3",
    patientName: "Ethan Parker",
    patientAge: 48,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    doctorName: "Dr. Esther Howard",
    doctorSpecialty: "Cardiology",
    time: "10:45 AM",
    date: "10/10/2026",
    disease: "Migraine",
  },
  {
    id: "apt-4",
    patientName: "Sophia Martinez",
    patientAge: 9,
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
    doctorName: "Dr. Theresa Webb",
    doctorSpecialty: "Cardiology",
    time: "02:00 PM",
    date: "10/10/2026",
    disease: "Checkup",
  },
];

export function AppointmentsSection() {
  const { showToast } = useDoctorTracker();
  const [selectedDay, setSelectedDay] = useState(13);
  const [appointments, setAppointments] = useState(APPOINTMENTS_LIST);

  const handleDelete = (id: string, name: string) => {
    setAppointments((prev) => prev.filter((a) => a.id !== id));
    showToast("Appointment Cancelled", `Booking for ${name} removed.`, "info");
  };

  return (
    <div className="bg-white rounded-3xl border border-[#EBF0F7] p-6 card-shadow flex flex-col justify-between">
      {/* Header with Title, Legend & Diagonal Arrow Circle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#F1F5F9]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#EBF3FE] text-[#2F65F6] flex items-center justify-center shrink-0">
            <Calendar className="w-4 h-4" />
          </div>
          <h3 className="text-base font-bold text-[#101828] tracking-tight">
            Appointments
          </h3>
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
            href="/patients"
            className="w-8 h-8 rounded-full bg-[#101828] text-white flex items-center justify-center hover:bg-[#2F65F6] transition-colors shrink-0"
            aria-label="View all appointments"
          >
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Date Carousel Strip */}
      <div className="py-4 flex items-center gap-2 overflow-x-auto select-none border-b border-[#F1F5F9]">
        <button
          type="button"
          onClick={() => setSelectedDay((prev) => Math.max(1, prev - 1))}
          className="w-7 h-7 rounded-full bg-[#F4F7FB] flex items-center justify-center text-[#64748B] hover:bg-[#EBF3FE] hover:text-[#2F65F6] shrink-0"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 flex-1 justify-between min-w-[560px]">
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
        <table className="w-full text-left border-collapse min-w-[620px]">
          <thead>
            <tr className="text-[11px] font-semibold text-[#94A3B8] uppercase">
              <th className="py-3 px-6">Patients</th>
              <th className="py-3 px-4">Assigned Doctor</th>
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4 text-center">Diseases</th>
              <th className="py-3 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F1F5F9] text-xs">
            {appointments.map((apt) => (
              <tr key={apt.id} className="hover:bg-[#F8FAFC] transition-colors group">
                {/* Patient */}
                <td className="py-3 px-6">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full overflow-hidden bg-[#F4F7FB] border border-[#EBF0F7] shrink-0">
                      <img
                        src={apt.avatar}
                        alt={apt.patientName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <span className="font-bold text-[#101828] block">
                        {apt.patientName}
                      </span>
                      <span className="text-[11px] text-[#94A3B8]">
                        Age - {apt.patientAge}
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
                    {apt.time}
                  </span>
                  <span className="text-[11px] text-[#94A3B8]">
                    {apt.date}
                  </span>
                </td>

                {/* Diseases / Condition Pill */}
                <td className="py-3 px-4 text-center">
                  <span className="px-4 py-1 rounded-full text-xs font-medium text-[#1E293B] border border-[#EBF0F7] bg-white inline-block">
                    {apt.disease}
                  </span>
                </td>

                {/* Actions */}
                <td className="py-3 px-6 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        showToast("Medical Notes", `Opened chart for ${apt.patientName}.`, "info")
                      }
                      className="p-1.5 text-[#94A3B8] hover:text-[#2F65F6] hover:bg-[#EBF3FE] rounded-lg transition-colors"
                      title="View Notes"
                    >
                      <FileText className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(apt.id, apt.patientName)}
                      className="p-1.5 text-[#EF4444] hover:bg-[#FEF2F2] rounded-lg transition-colors"
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
      </div>
    </div>
  );
}

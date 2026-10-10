"use client";

import React, { useState } from "react";
import { useDoctorTracker } from "@/context/DoctorTrackerContext";
import {
  X,
  Calendar,
  Clock,
  User,
  Stethoscope,
  Building2,
  FileText,
  Check,
} from "lucide-react";
import { AppointmentItem } from "@/lib/types";

const TIME_SLOTS = [
  "08:30 AM",
  "09:15 AM",
  "10:00 AM",
  "10:45 AM",
  "11:30 AM",
  "01:30 PM",
  "02:15 PM",
  "03:00 PM",
  "03:45 PM",
  "04:30 PM",
  "05:15 PM",
];

const APPOINTMENT_TYPES: AppointmentItem["type"][] = [
  "Consultation",
  "General Checkup",
  "Follow-up",
  "Emergency",
  "Surgery Review",
];

export function BookAppointmentModal() {
  const {
    isBookAppointmentModalOpen,
    setIsBookAppointmentModalOpen,
    doctors,
    patients,
    addAppointment,
    showToast,
  } = useDoctorTracker();

  const [selectedPatientId, setSelectedPatientId] = useState("");
  const [patientName, setPatientName] = useState("");
  const [patientPhone, setPatientPhone] = useState("");
  const [selectedDoctorId, setSelectedDoctorId] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [timeSlot, setTimeSlot] = useState(TIME_SLOTS[2]);
  const [type, setType] = useState<AppointmentItem["type"]>("Consultation");
  const [notes, setNotes] = useState("");

  if (!isBookAppointmentModalOpen) return null;

  const handlePatientSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const pId = e.target.value;
    setSelectedPatientId(pId);
    if (pId === "new") {
      setPatientName("");
      setPatientPhone("");
    } else {
      const found = patients.find((p) => p.id === pId);
      if (found) {
        setPatientName(found.name);
        setPatientPhone(found.phone);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const selectedDoc = doctors.find((d) => d.id === selectedDoctorId) || doctors[0];
    const finalPatientName = patientName.trim() || "Walk-in Patient";
    const finalPhone = patientPhone.trim() || "+880 1711-000000";

    addAppointment({
      patientId: selectedPatientId && selectedPatientId !== "new" ? selectedPatientId : `pat-${Date.now()}`,
      patientName: finalPatientName,
      patientPhone: finalPhone,
      doctorId: selectedDoc?.id || "doc-1",
      doctorName: selectedDoc?.name || "Dr. Salman Hossain",
      doctorSpecialty: selectedDoc?.specialty || "Cardiology",
      roomNumber: selectedDoc ? `Room ${100 + Math.floor(Math.random() * 30)}` : "Room 304",
      date,
      timeSlot,
      type,
      status: "Confirmed",
      notes: notes.trim() || undefined,
    });

    setIsBookAppointmentModalOpen(false);
    // Reset fields
    setPatientName("");
    setPatientPhone("");
    setSelectedPatientId("");
    setNotes("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/40 backdrop-blur-md animate-fade-in">
      <div className="bg-white/95 backdrop-blur-3xl w-full max-w-xl rounded-3xl border border-white/90 shadow-2xl overflow-hidden animate-scale-up">
        {/* Header */}
        <div className="h-16 px-6 border-b border-slate-100 flex items-center justify-between bg-white/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#2F65F6]/10 text-[#2F65F6] flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#101828]">
                Schedule Clinical Appointment
              </h2>
              <p className="text-xs text-[#64748B]">
                Reserve consultation slot with specialist doctor.
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsBookAppointmentModalOpen(false)}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-all"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[78vh] overflow-y-auto">
          {/* Patient Selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-[#2F65F6]" /> Patient Selection
            </label>
            <select
              value={selectedPatientId}
              onChange={handlePatientSelect}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-xs text-slate-800 focus:bg-white focus:outline-none focus:border-[#2F65F6]"
            >
              <option value="">Select registered patient or enter manually...</option>
              <option value="new">+ Enter New / Walk-in Patient</option>
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.patientCode}) &bull; {p.condition}
                </option>
              ))}
            </select>
          </div>

          {/* Patient Details (if new or editing) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600">Patient Full Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Eleanor Vance"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-xs text-slate-800 focus:bg-white focus:outline-none focus:border-[#2F65F6]"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600">Contact Phone</label>
              <input
                type="tel"
                placeholder="+880 1711-234567"
                value={patientPhone}
                onChange={(e) => setPatientPhone(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-xs text-slate-800 focus:bg-white focus:outline-none focus:border-[#2F65F6]"
              />
            </div>
          </div>

          {/* Attending Doctor */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Stethoscope className="w-3.5 h-3.5 text-[#2F65F6]" /> Attending Specialist Doctor
            </label>
            <select
              required
              value={selectedDoctorId}
              onChange={(e) => setSelectedDoctorId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-xs text-slate-800 focus:bg-white focus:outline-none focus:border-[#2F65F6]"
            >
              <option value="">Select attending specialist doctor...</option>
              {doctors.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} &mdash; {d.specialty} ({d.hospital})
                </option>
              ))}
            </select>
          </div>

          {/* Date & Time Slot */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" /> Appointment Date
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-xs text-slate-800 focus:bg-white focus:outline-none focus:border-[#2F65F6]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" /> Time Slot
              </label>
              <select
                value={timeSlot}
                onChange={(e) => setTimeSlot(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-xs text-slate-800 focus:bg-white focus:outline-none focus:border-[#2F65F6]"
              >
                {TIME_SLOTS.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Appointment Type */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-600">Appointment Type</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {APPOINTMENT_TYPES.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setType(t)}
                  className={`py-2 px-3 rounded-2xl text-xs font-semibold border transition-all text-center ${
                    type === t
                      ? "bg-[#2F65F6] text-white border-[#2F65F6] shadow-xs"
                      : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Clinical Notes */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-600 flex items-center gap-1">
              <FileText className="w-3.5 h-3.5 text-slate-400" /> Clinical Notes / Reason for Visit
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Patient complaining of acute chest tightness and shortness of breath..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs text-slate-800 focus:bg-white focus:outline-none focus:border-[#2F65F6]"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsBookAppointmentModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-full transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-xs font-bold text-white bg-[#2F65F6] hover:bg-[#1E4FD8] rounded-full shadow-xs transition-all flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Confirm Booking</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

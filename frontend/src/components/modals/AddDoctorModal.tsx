"use client";

import React, { useState } from "react";
import { X, UserPlus, Stethoscope, Mail, Phone, Building2, Users } from "lucide-react";
import { useDoctorTracker } from "@/context/DoctorTrackerContext";
import { DoctorSpecialty, DoctorStatus } from "@/lib/types";

const SPECIALTIES: DoctorSpecialty[] = [
  "Cardiology",
  "Neurology",
  "Pediatrics",
  "Orthopedics",
  "Dermatology",
  "Oncology",
  "General Medicine",
  "Gynecology",
  "Psychiatry",
];

export function AddDoctorModal() {
  const { isAddDoctorModalOpen, setIsAddDoctorModalOpen, addDoctor } = useDoctorTracker();

  const [name, setName] = useState("");
  const [specialty, setSpecialty] = useState<DoctorSpecialty>("Cardiology");
  const [hospital, setHospital] = useState("Medcare Central Hospital");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [roomNumber, setRoomNumber] = useState("");
  const [maxPatients, setMaxPatients] = useState("300");
  const [experienceYears, setExperienceYears] = useState("8");
  const [status, setStatus] = useState<DoctorStatus>("Active");
  const [biography, setBiography] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isAddDoctorModalOpen) return null;

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = "Doctor name is required";
    if (!hospital.trim()) errs.hospital = "Hospital affiliation is required";
    if (!email.trim() || !email.includes("@")) errs.email = "Valid work email is required";
    if (!phone.trim()) errs.phone = "Phone number is required";
    if (!roomNumber.trim()) errs.roomNumber = "Consultation room is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    addDoctor({
      name: name.startsWith("Dr.") ? name : `Dr. ${name}`,
      specialty,
      hospital: hospital.trim(),
      email: email.trim(),
      phone: phone.trim(),
      roomNumber: roomNumber.trim(),
      maxPatients: parseInt(maxPatients) || 250,
      experienceYears: parseInt(experienceYears) || 5,
      status,
      biography:
        biography.trim() ||
        `${specialty} specialist with ${experienceYears} years of medical experience at ${hospital.trim()}.`,
    });

    // Reset form
    setName("");
    setHospital("Medcare Central Hospital");
    setEmail("");
    setPhone("");
    setRoomNumber("");
    setBiography("");
    setErrors({});
    setIsAddDoctorModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#0B132B]/35 backdrop-blur-md transition-opacity"
        onClick={() => setIsAddDoctorModalOpen(false)}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-xl md:max-w-2xl lg:max-w-4xl bg-white/95 backdrop-blur-2xl rounded-3xl border border-white/90 popover-shadow overflow-hidden z-50 animate-fade-in flex flex-col max-h-[92vh] lg:max-h-none shadow-2xl">
        {/* Header */}
        <div className="px-5 sm:px-6 py-3.5 sm:py-4 border-b border-slate-100 flex items-center justify-between bg-white/60 backdrop-blur-md shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-[#2F65F6]/10 text-[#2F65F6] flex items-center justify-center border border-[#2F65F6]/20 shadow-2xs shrink-0">
              <Stethoscope className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-[#101828]">Add New Doctor</h3>
              <p className="text-[11px] sm:text-xs text-[#64748B]">Register a physician to the medical staff directory</p>
            </div>
          </div>
          <button
            onClick={() => setIsAddDoctorModalOpen(false)}
            className="p-1.5 text-[#64748B] hover:text-[#101828] rounded-full hover:bg-[#F8FAFC] transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-5 lg:p-6 overflow-y-auto lg:overflow-visible space-y-3 sm:space-y-3.5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-3.5">
            {/* Full Name */}
            <div className="space-y-1">
              <label className="text-[11px] sm:text-xs font-semibold text-[#101828]">
                Doctor Name <span className="text-[#EF4444]">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Dr. Sarah Ahmed"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl sm:rounded-full border border-[#EBF0F7] bg-[#F4F7FB] text-[#1E293B] focus:bg-white focus:outline-none focus:border-[#2F65F6] transition-all"
              />
              {errors.name && <p className="text-[10px] text-[#EF4444]">{errors.name}</p>}
            </div>

            {/* Specialty */}
            <div className="space-y-1">
              <label className="text-[11px] sm:text-xs font-semibold text-[#101828]">Specialization</label>
              <select
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value as DoctorSpecialty)}
                className="w-full px-3.5 py-2 text-xs rounded-xl sm:rounded-full border border-[#EBF0F7] bg-[#F4F7FB] text-[#1E293B] focus:bg-white focus:outline-none focus:border-[#2F65F6] transition-all cursor-pointer"
              >
                {SPECIALTIES.map((spec) => (
                  <option key={spec} value={spec}>
                    {spec}
                  </option>
                ))}
              </select>
            </div>

            {/* Hospital */}
            <div className="space-y-1 sm:col-span-2 lg:col-span-1">
              <label className="text-[11px] sm:text-xs font-semibold text-[#101828]">
                Hospital Affiliation <span className="text-[#EF4444]">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Medcare Central Hospital"
                value={hospital}
                onChange={(e) => setHospital(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl sm:rounded-full border border-[#EBF0F7] bg-[#F4F7FB] text-[#1E293B] focus:bg-white focus:outline-none focus:border-[#2F65F6] transition-all"
              />
              {errors.hospital && <p className="text-[10px] text-[#EF4444]">{errors.hospital}</p>}
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label className="text-[11px] sm:text-xs font-semibold text-[#101828]">
                Email Address <span className="text-[#EF4444]">*</span>
              </label>
              <input
                type="email"
                placeholder="physician@medcare.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl sm:rounded-full border border-[#EBF0F7] bg-[#F4F7FB] text-[#1E293B] focus:bg-white focus:outline-none focus:border-[#2F65F6] transition-all"
              />
              {errors.email && <p className="text-[10px] text-[#EF4444]">{errors.email}</p>}
            </div>

            {/* Phone */}
            <div className="space-y-1">
              <label className="text-[11px] sm:text-xs font-semibold text-[#101828]">
                Phone Number <span className="text-[#EF4444]">*</span>
              </label>
              <input
                type="text"
                placeholder="+880 1711-000000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl sm:rounded-full border border-[#EBF0F7] bg-[#F4F7FB] text-[#1E293B] focus:bg-white focus:outline-none focus:border-[#2F65F6] transition-all"
              />
              {errors.phone && <p className="text-[10px] text-[#EF4444]">{errors.phone}</p>}
            </div>

            {/* Room Number */}
            <div className="space-y-1">
              <label className="text-[11px] sm:text-xs font-semibold text-[#101828]">
                Consultation Room / Wing <span className="text-[#EF4444]">*</span>
              </label>
              <input
                type="text"
                placeholder="Room 304 - Wing B"
                value={roomNumber}
                onChange={(e) => setRoomNumber(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl sm:rounded-full border border-[#EBF0F7] bg-[#F4F7FB] text-[#1E293B] focus:bg-white focus:outline-none focus:border-[#2F65F6] transition-all"
              />
              {errors.roomNumber && (
                <p className="text-[10px] text-[#EF4444]">{errors.roomNumber}</p>
              )}
            </div>

            {/* Status */}
            <div className="space-y-1">
              <label className="text-[11px] sm:text-xs font-semibold text-[#101828]">Initial Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as DoctorStatus)}
                className="w-full px-3.5 py-2 text-xs rounded-xl sm:rounded-full border border-[#EBF0F7] bg-[#F4F7FB] text-[#1E293B] focus:bg-white focus:outline-none focus:border-[#2F65F6] transition-all cursor-pointer"
              >
                <option value="Active">Active (Available)</option>
                <option value="In Surgery">In Surgery</option>
                <option value="On Leave">On Leave</option>
                <option value="Off Duty">Off Duty</option>
              </select>
            </div>

            {/* Max Patients */}
            <div className="space-y-1">
              <label className="text-[11px] sm:text-xs font-semibold text-[#101828]">Max Capacity</label>
              <input
                type="number"
                value={maxPatients}
                onChange={(e) => setMaxPatients(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl sm:rounded-full border border-[#EBF0F7] bg-[#F4F7FB] text-[#1E293B] focus:bg-white focus:outline-none focus:border-[#2F65F6] transition-all"
              />
            </div>

            {/* Experience Years */}
            <div className="space-y-1">
              <label className="text-[11px] sm:text-xs font-semibold text-[#101828]">Years of Experience</label>
              <input
                type="number"
                value={experienceYears}
                onChange={(e) => setExperienceYears(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl sm:rounded-full border border-[#EBF0F7] bg-[#F4F7FB] text-[#1E293B] focus:bg-white focus:outline-none focus:border-[#2F65F6] transition-all"
              />
            </div>
          </div>

          {/* Biography */}
          <div className="space-y-1">
            <label className="text-[11px] sm:text-xs font-semibold text-[#101828]">Professional Summary</label>
            <textarea
              rows={2}
              placeholder="Clinical focus, research experience, or hospital affiliations..."
              value={biography}
              onChange={(e) => setBiography(e.target.value)}
              className="w-full px-3.5 py-2 text-xs rounded-xl sm:rounded-2xl border border-[#EBF0F7] bg-[#F4F7FB] text-[#1E293B] focus:bg-white focus:outline-none focus:border-[#2F65F6] transition-all resize-none"
            />
          </div>

          {/* Actions */}
          <div className="pt-2.5 border-t border-[#EBF0F7] flex items-center justify-end gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setIsAddDoctorModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-[#64748B] hover:text-[#101828] hover:bg-[#F8FAFC] rounded-full border border-[#EBF0F7] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-[#2F65F6] hover:bg-[#1E4FD8] rounded-full shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Register Doctor</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

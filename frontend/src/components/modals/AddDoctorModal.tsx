"use client";

import React, { useState } from "react";
import { X, UserPlus, Stethoscope, Mail, Phone, Building, Users } from "lucide-react";
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
      email,
      phone,
      roomNumber,
      maxPatients: parseInt(maxPatients) || 250,
      experienceYears: parseInt(experienceYears) || 5,
      status,
      biography:
        biography.trim() ||
        `${specialty} specialist with ${experienceYears} years of medical experience in patient diagnostics and treatment.`,
    });

    // Reset form
    setName("");
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
        className="fixed inset-0 bg-[#0D1C2E]/40 backdrop-blur-xs transition-opacity"
        onClick={() => setIsAddDoctorModalOpen(false)}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-xl bg-white rounded-2xl border border-[#E8EDF3] popover-shadow overflow-hidden z-50 animate-fade-in flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4.5 border-b border-[#E8EDF3] flex items-center justify-between bg-white">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#E6F7F6] text-[#0F9F9A] flex items-center justify-center">
              <Stethoscope className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#172B4D]">Add New Doctor</h3>
              <p className="text-xs text-[#7A8798]">Register a physician to the medical staff directory</p>
            </div>
          </div>
          <button
            onClick={() => setIsAddDoctorModalOpen(false)}
            className="p-1.5 text-[#7A8798] hover:text-[#243247] rounded-lg hover:bg-[#F7F9FC] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#172B4D]">
                Doctor Name <span className="text-[#E05252]">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Dr. Sarah Ahmed"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#E8EDF3] bg-white text-[#243247] focus:outline-none focus:border-[#0F9F9A] focus:ring-1 focus:ring-[#0F9F9A] transition-all"
              />
              {errors.name && <p className="text-[11px] text-[#E05252]">{errors.name}</p>}
            </div>

            {/* Specialty */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#172B4D]">Specialization</label>
              <select
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value as DoctorSpecialty)}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#E8EDF3] bg-white text-[#243247] focus:outline-none focus:border-[#0F9F9A] focus:ring-1 focus:ring-[#0F9F9A] transition-all"
              >
                {SPECIALTIES.map((spec) => (
                  <option key={spec} value={spec}>
                    {spec}
                  </option>
                ))}
              </select>
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#172B4D]">
                Email Address <span className="text-[#E05252]">*</span>
              </label>
              <input
                type="email"
                placeholder="physician@careguide.bd"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#E8EDF3] bg-white text-[#243247] focus:outline-none focus:border-[#0F9F9A] focus:ring-1 focus:ring-[#0F9F9A] transition-all"
              />
              {errors.email && <p className="text-[11px] text-[#E05252]">{errors.email}</p>}
            </div>

            {/* Phone */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#172B4D]">
                Phone Number <span className="text-[#E05252]">*</span>
              </label>
              <input
                type="text"
                placeholder="+880 1711-000000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#E8EDF3] bg-white text-[#243247] focus:outline-none focus:border-[#0F9F9A] focus:ring-1 focus:ring-[#0F9F9A] transition-all"
              />
              {errors.phone && <p className="text-[11px] text-[#E05252]">{errors.phone}</p>}
            </div>

            {/* Room Number */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#172B4D]">
                Consultation Room / Wing <span className="text-[#E05252]">*</span>
              </label>
              <input
                type="text"
                placeholder="Room 304 - Wing B"
                value={roomNumber}
                onChange={(e) => setRoomNumber(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#E8EDF3] bg-white text-[#243247] focus:outline-none focus:border-[#0F9F9A] focus:ring-1 focus:ring-[#0F9F9A] transition-all"
              />
              {errors.roomNumber && (
                <p className="text-[11px] text-[#E05252]">{errors.roomNumber}</p>
              )}
            </div>

            {/* Status */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#172B4D]">Initial Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as DoctorStatus)}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#E8EDF3] bg-white text-[#243247] focus:outline-none focus:border-[#0F9F9A] focus:ring-1 focus:ring-[#0F9F9A] transition-all"
              >
                <option value="Active">Active (Available)</option>
                <option value="In Surgery">In Surgery</option>
                <option value="On Leave">On Leave</option>
                <option value="Off Duty">Off Duty</option>
              </select>
            </div>

            {/* Max Patients */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#172B4D]">Max Patient Capacity</label>
              <input
                type="number"
                value={maxPatients}
                onChange={(e) => setMaxPatients(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#E8EDF3] bg-white text-[#243247] focus:outline-none focus:border-[#0F9F9A] focus:ring-1 focus:ring-[#0F9F9A] transition-all"
              />
            </div>

            {/* Experience Years */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#172B4D]">Years of Experience</label>
              <input
                type="number"
                value={experienceYears}
                onChange={(e) => setExperienceYears(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#E8EDF3] bg-white text-[#243247] focus:outline-none focus:border-[#0F9F9A] focus:ring-1 focus:ring-[#0F9F9A] transition-all"
              />
            </div>
          </div>

          {/* Biography */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#172B4D]">Professional Summary</label>
            <textarea
              rows={2}
              placeholder="Clinical focus, research experience, or hospital affiliations..."
              value={biography}
              onChange={(e) => setBiography(e.target.value)}
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#E8EDF3] bg-white text-[#243247] focus:outline-none focus:border-[#0F9F9A] focus:ring-1 focus:ring-[#0F9F9A] transition-all"
            />
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-[#E8EDF3] flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={() => setIsAddDoctorModalOpen(false)}
              className="px-4 py-2 text-xs font-medium text-[#7A8798] hover:text-[#243247] hover:bg-[#F7F9FC] rounded-xl border border-[#E8EDF3] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-[#0F9F9A] hover:bg-[#0B7F7A] rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
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

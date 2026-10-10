"use client";

import React, { useState, useEffect } from "react";
import { X, Edit2, Stethoscope, Mail, Phone, Building2, Save, Check } from "lucide-react";
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
  "Emergency & Trauma",
  "Radiology & Imaging",
  "Gastroenterology",
  "Nephrology",
];

export function EditDoctorModal() {
  const {
    isEditDoctorModalOpen,
    setIsEditDoctorModalOpen,
    editingDoctor,
    setEditingDoctor,
    updateDoctor,
  } = useDoctorTracker();

  const [name, setName] = useState("");
  const [specialty, setSpecialty] = useState<DoctorSpecialty>("Cardiology");
  const [hospital, setHospital] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [roomNumber, setRoomNumber] = useState("");
  const [maxPatients, setMaxPatients] = useState("300");
  const [experienceYears, setExperienceYears] = useState("8");
  const [status, setStatus] = useState<DoctorStatus>("Active");
  const [biography, setBiography] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (editingDoctor) {
      setName(editingDoctor.name || "");
      setSpecialty(editingDoctor.specialty || "Cardiology");
      setHospital(editingDoctor.hospital || "Doctor Tracker Medical Center");
      setEmail(editingDoctor.email || "");
      setPhone(editingDoctor.phone || "");
      setRoomNumber(editingDoctor.roomNumber || "");
      setMaxPatients(editingDoctor.maxPatients?.toString() || "300");
      setExperienceYears(editingDoctor.experienceYears?.toString() || "8");
      setStatus(editingDoctor.status || "Active");
      setBiography(editingDoctor.biography || "");
      setErrors({});
    }
  }, [editingDoctor, isEditDoctorModalOpen]);

  if (!isEditDoctorModalOpen || !editingDoctor) return null;

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

    updateDoctor(editingDoctor.id, {
      name: name.trim(),
      specialty,
      hospital: hospital.trim(),
      email: email.trim(),
      phone: phone.trim(),
      roomNumber: roomNumber.trim(),
      maxPatients: parseInt(maxPatients) || 300,
      experienceYears: parseInt(experienceYears) || 5,
      status,
      biography: biography.trim(),
    });

    setIsEditDoctorModalOpen(false);
    setEditingDoctor(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/40 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-xl bg-white/95 backdrop-blur-3xl rounded-3xl border border-white/90 shadow-2xl overflow-hidden animate-scale-up flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-white/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#2F65F6]/10 text-[#2F65F6] flex items-center justify-center border border-[#2F65F6]/20">
              <Edit2 className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#101828]">Edit Doctor Profile</h3>
              <p className="text-xs text-[#64748B]">Update physician credentials, department, and contact details</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              setIsEditDoctorModalOpen(false);
              setEditingDoctor(null);
            }}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-all"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
          {/* Doctor Name & Specialty */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700">Full Name & Title</label>
              <input
                type="text"
                required
                placeholder="Dr. Sarah Ahmed"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#2F65F6]"
              />
              {errors.name && <span className="text-rose-500 text-[10px]">{errors.name}</span>}
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700">Clinical Specialty</label>
              <select
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value as DoctorSpecialty)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#2F65F6]"
              >
                {SPECIALTIES.map((spec) => (
                  <option key={spec} value={spec}>
                    {spec}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Hospital & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700">Hospital Affiliation</label>
              <input
                type="text"
                required
                placeholder="Doctor Tracker Medical Center"
                value={hospital}
                onChange={(e) => setHospital(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#2F65F6]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700">Current Duty Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as DoctorStatus)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#2F65F6]"
              >
                <option value="Active">Active Duty</option>
                <option value="In Surgery">In Surgery</option>
                <option value="On Leave">On Leave</option>
                <option value="Off Duty">Off Duty</option>
              </select>
            </div>
          </div>

          {/* Email & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700">Work Email</label>
              <input
                type="email"
                required
                placeholder="sarah.ahmed@medcare.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#2F65F6]"
              />
              {errors.email && <span className="text-rose-500 text-[10px]">{errors.email}</span>}
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700">Contact Phone</label>
              <input
                type="tel"
                required
                placeholder="+880 1711-234567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#2F65F6]"
              />
            </div>
          </div>

          {/* Room Number, Experience & Max Patients */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700">Chamber / Room</label>
              <input
                type="text"
                required
                placeholder="Room 304 - Wing B"
                value={roomNumber}
                onChange={(e) => setRoomNumber(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#2F65F6]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700">Experience (Years)</label>
              <input
                type="number"
                min="0"
                value={experienceYears}
                onChange={(e) => setExperienceYears(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#2F65F6]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700">Max Patient Target</label>
              <input
                type="number"
                min="10"
                value={maxPatients}
                onChange={(e) => setMaxPatients(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#2F65F6]"
              />
            </div>
          </div>

          {/* Biography */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700">Clinical Biography & Scope</label>
            <textarea
              rows={3}
              placeholder="Clinical background, sub-specialty qualifications, and hospital responsibilities..."
              value={biography}
              onChange={(e) => setBiography(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#2F65F6]"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => {
                setIsEditDoctorModalOpen(false);
                setEditingDoctor(null);
              }}
              className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-full transition-all"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 font-bold text-white bg-[#2F65F6] hover:bg-[#1E4FD8] rounded-full shadow-xs transition-all flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

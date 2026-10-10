"use client";

import React, { useState } from "react";
import { X, UserPlus, Users, Stethoscope, HeartPulse } from "lucide-react";
import { useDoctorTracker } from "@/context/DoctorTrackerContext";
import { PatientCondition, PatientGender } from "@/lib/types";

export function AddPatientModal() {
  const { isAddPatientModalOpen, setIsAddPatientModalOpen, doctors, addPatient } =
    useDoctorTracker();

  const [name, setName] = useState("");
  const [age, setAge] = useState("32");
  const [gender, setGender] = useState<PatientGender>("Female");
  const [assignedDoctorId, setAssignedDoctorId] = useState(
    doctors[0]?.id || "doc-1"
  );
  const [condition, setCondition] = useState<PatientCondition>("General");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [bloodGroup, setBloodGroup] = useState<
    "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-"
  >("O+");
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isAddPatientModalOpen) return null;

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = "Patient full name is required";
    if (!phone.trim()) errs.phone = "Contact phone is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const selectedDoc = doctors.find((d) => d.id === assignedDoctorId) || doctors[0];

    addPatient({
      name,
      age: parseInt(age) || 28,
      gender,
      assignedDoctorId: selectedDoc?.id || "doc-1",
      assignedDoctorName: selectedDoc?.name || "Dr. Sarah Ahmed",
      condition,
      phone,
      email: email.trim() || `${name.toLowerCase().replace(/\s+/g, ".")}@example.com`,
      bloodGroup,
      status: "Outpatient",
      notes: notes.trim() || "Initial registration and baseline vitals recorded.",
    });

    // Reset
    setName("");
    setPhone("");
    setEmail("");
    setNotes("");
    setErrors({});
    setIsAddPatientModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#0D1C2E]/40 backdrop-blur-xs transition-opacity"
        onClick={() => setIsAddPatientModalOpen(false)}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-xl bg-white rounded-2xl border border-[#E8EDF3] popover-shadow overflow-hidden z-50 animate-fade-in flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4.5 border-b border-[#E8EDF3] flex items-center justify-between bg-white">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#E6F7F6] text-[#0F9F9A] flex items-center justify-center">
              <Users className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#172B4D]">Register New Patient</h3>
              <p className="text-xs text-[#7A8798]">Create clinical patient chart & assign physician</p>
            </div>
          </div>
          <button
            onClick={() => setIsAddPatientModalOpen(false)}
            className="p-1.5 text-[#7A8798] hover:text-[#243247] rounded-lg hover:bg-[#F7F9FC] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Patient Name */}
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-semibold text-[#172B4D]">
                Patient Full Name <span className="text-[#E05252]">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Olivia Bennett"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#E8EDF3] bg-white text-[#243247] focus:outline-none focus:border-[#0F9F9A] focus:ring-1 focus:ring-[#0F9F9A] transition-all"
              />
              {errors.name && <p className="text-[11px] text-[#E05252]">{errors.name}</p>}
            </div>

            {/* Age */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#172B4D]">Age</label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#E8EDF3] bg-white text-[#243247] focus:outline-none focus:border-[#0F9F9A] focus:ring-1 focus:ring-[#0F9F9A] transition-all"
              />
            </div>

            {/* Gender */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#172B4D]">Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as PatientGender)}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#E8EDF3] bg-white text-[#243247] focus:outline-none focus:border-[#0F9F9A] focus:ring-1 focus:ring-[#0F9F9A] transition-all"
              >
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Assigned Doctor */}
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-semibold text-[#172B4D]">
                Assigned Primary Physician
              </label>
              <select
                value={assignedDoctorId}
                onChange={(e) => setAssignedDoctorId(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#E8EDF3] bg-white text-[#243247] focus:outline-none focus:border-[#0F9F9A] focus:ring-1 focus:ring-[#0F9F9A] transition-all"
              >
                {doctors.map((doc) => (
                  <option key={doc.id} value={doc.id}>
                    {doc.name} — {doc.specialty} ({doc.patientCount} current patients)
                  </option>
                ))}
              </select>
            </div>

            {/* Condition Category */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#172B4D]">Condition Classification</label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value as PatientCondition)}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#E8EDF3] bg-white text-[#243247] focus:outline-none focus:border-[#0F9F9A] focus:ring-1 focus:ring-[#0F9F9A] transition-all"
              >
                <option value="General">General (Routine / Wellness)</option>
                <option value="Chronic">Chronic (Long-term Care)</option>
                <option value="Recovering">Recovering (Post-Treatment)</option>
                <option value="Follow-up">Follow-up (Review Visit)</option>
                <option value="Critical">Critical (Intensive Monitoring)</option>
              </select>
            </div>

            {/* Blood Group */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#172B4D]">Blood Group</label>
              <select
                value={bloodGroup}
                onChange={(e) =>
                  setBloodGroup(
                    e.target.value as "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-"
                  )
                }
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#E8EDF3] bg-white text-[#243247] focus:outline-none focus:border-[#0F9F9A] focus:ring-1 focus:ring-[#0F9F9A] transition-all"
              >
                <option value="O+">O positive (O+)</option>
                <option value="O-">O negative (O-)</option>
                <option value="A+">A positive (A+)</option>
                <option value="A-">A negative (A-)</option>
                <option value="B+">B positive (B+)</option>
                <option value="B-">B negative (B-)</option>
                <option value="AB+">AB positive (AB+)</option>
                <option value="AB-">AB negative (AB-)</option>
              </select>
            </div>

            {/* Phone */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#172B4D]">
                Contact Phone <span className="text-[#E05252]">*</span>
              </label>
              <input
                type="text"
                placeholder="+880 1812-000000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#E8EDF3] bg-white text-[#243247] focus:outline-none focus:border-[#0F9F9A] focus:ring-1 focus:ring-[#0F9F9A] transition-all"
              />
              {errors.phone && <p className="text-[11px] text-[#E05252]">{errors.phone}</p>}
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#172B4D]">Email Address</label>
              <input
                type="email"
                placeholder="patient@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#E8EDF3] bg-white text-[#243247] focus:outline-none focus:border-[#0F9F9A] focus:ring-1 focus:ring-[#0F9F9A] transition-all"
              />
            </div>
          </div>

          {/* Clinical Notes */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#172B4D]">Initial Clinical Assessment</label>
            <textarea
              rows={2}
              placeholder="Presenting symptoms, allergies, or referral notes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#E8EDF3] bg-white text-[#243247] focus:outline-none focus:border-[#0F9F9A] focus:ring-1 focus:ring-[#0F9F9A] transition-all"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-[#E8EDF3] flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={() => setIsAddPatientModalOpen(false)}
              className="px-4 py-2 text-xs font-medium text-[#7A8798] hover:text-[#243247] hover:bg-[#F7F9FC] rounded-xl border border-[#E8EDF3] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-[#0F9F9A] hover:bg-[#0B7F7A] rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Register Patient</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { X, UserPlus, Users, Stethoscope, HeartPulse } from "lucide-react";
import { useDoctorTracker } from "@/context/DoctorTrackerContext";
import { PatientCondition, PatientGender } from "@/lib/types";

export function AddPatientModal() {
  const {
    isAddPatientModalOpen,
    setIsAddPatientModalOpen,
    doctors,
    addPatient,
    selectedDoctorForNewPatient,
  } = useDoctorTracker();

  const [name, setName] = useState("");
  const [age, setAge] = useState("32");
  const [gender, setGender] = useState<PatientGender>("Female");
  const getDoctorId = (doc?: any) => doc?.id || doc?._id || "";

  const [assignedDoctorId, setAssignedDoctorId] = useState(
    getDoctorId(selectedDoctorForNewPatient) || getDoctorId(doctors[0]) || ""
  );
  const [condition, setCondition] = useState<PatientCondition>("General");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [bloodGroup, setBloodGroup] = useState<
    "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-"
  >("O+");
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  React.useEffect(() => {
    const targetId = getDoctorId(selectedDoctorForNewPatient) || getDoctorId(doctors[0]);
    if (targetId && !assignedDoctorId) {
      setAssignedDoctorId(targetId);
    }
  }, [selectedDoctorForNewPatient, doctors, assignedDoctorId]);

  if (!isAddPatientModalOpen) return null;

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = "Patient full name is required";
    if (!phone.trim()) errs.phone = "Contact phone is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || isSubmitting) return;

    const selectedDoc =
      doctors.find(
        (d: any) => d.id === assignedDoctorId || d._id === assignedDoctorId
      ) || doctors[0];

    const targetDocId = getDoctorId(selectedDoc);

    setIsSubmitting(true);
    try {
      const res = await addPatient({
        name: name.trim(),
        age: parseInt(age) || 28,
        gender,
        assignedDoctorId: targetDocId,
        assignedDoctorName: selectedDoc?.name || "Dr. Sarah Ahmed",
        condition,
        phone: phone.trim(),
        email: email.trim() || `${name.toLowerCase().replace(/\s+/g, ".")}@example.com`,
        bloodGroup,
        status: "Outpatient",
        notes: notes.trim() || "Initial registration and baseline vitals recorded.",
      });

      if (res) {
        setName("");
        setPhone("");
        setEmail("");
        setNotes("");
        setErrors({});
        setIsAddPatientModalOpen(false);
      }
    } catch {
      // Handled in context toast
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#0B132B]/30 backdrop-blur-md transition-opacity"
        onClick={() => setIsAddPatientModalOpen(false)}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-xl bg-white/90 backdrop-blur-2xl rounded-3xl border border-white/90 popover-shadow overflow-hidden z-50 animate-fade-in flex flex-col max-h-[90vh] shadow-2xl">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-white/60 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#2F65F6]/10 text-[#2F65F6] flex items-center justify-center border border-[#2F65F6]/20 shadow-2xs">
              <Users className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#101828]">Register New Patient</h3>
              <p className="text-xs text-[#64748B]">Create clinical patient chart & assign physician</p>
            </div>
          </div>
          <button
            onClick={() => setIsAddPatientModalOpen(false)}
            className="p-2 text-[#64748B] hover:text-[#101828] rounded-full hover:bg-[#F8FAFC] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Patient Name */}
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-semibold text-[#101828]">
                Patient Full Name <span className="text-[#EF4444]">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Olivia Bennett"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 text-xs rounded-full border border-[#EBF0F7] bg-[#F4F7FB] text-[#1E293B] focus:bg-white focus:outline-none focus:border-[#2F65F6] transition-all"
              />
              {errors.name && <p className="text-[11px] text-[#EF4444]">{errors.name}</p>}
            </div>

            {/* Age */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#101828]">Age</label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full px-4 py-2.5 text-xs rounded-full border border-[#EBF0F7] bg-[#F4F7FB] text-[#1E293B] focus:bg-white focus:outline-none focus:border-[#2F65F6] transition-all"
              />
            </div>

            {/* Gender */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#101828]">Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as PatientGender)}
                className="w-full px-4 py-2.5 text-xs rounded-full border border-[#EBF0F7] bg-[#F4F7FB] text-[#1E293B] focus:bg-white focus:outline-none focus:border-[#2F65F6] transition-all"
              >
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Assigned Doctor */}
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-semibold text-[#101828]">
                Assigned Primary Physician
              </label>
              <select
                value={assignedDoctorId}
                onChange={(e) => setAssignedDoctorId(e.target.value)}
                className="w-full px-4 py-2.5 text-xs rounded-full border border-[#EBF0F7] bg-[#F4F7FB] text-[#1E293B] focus:bg-white focus:outline-none focus:border-[#2F65F6] transition-all"
              >
                {doctors.map((doc, i) => (
                  <option key={doc.id || (doc as any)._id || `add-pt-doc-${i}`} value={doc.id || (doc as any)._id}>
                    {doc.name} — {doc.specialty} ({doc.patientCount} patients)
                  </option>
                ))}
              </select>
            </div>

            {/* Condition Category */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#101828]">Condition Classification</label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value as PatientCondition)}
                className="w-full px-4 py-2.5 text-xs rounded-full border border-[#EBF0F7] bg-[#F4F7FB] text-[#1E293B] focus:bg-white focus:outline-none focus:border-[#2F65F6] transition-all"
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
              <label className="text-xs font-semibold text-[#101828]">Blood Group</label>
              <select
                value={bloodGroup}
                onChange={(e) =>
                  setBloodGroup(
                    e.target.value as "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-"
                  )
                }
                className="w-full px-4 py-2.5 text-xs rounded-full border border-[#EBF0F7] bg-[#F4F7FB] text-[#1E293B] focus:bg-white focus:outline-none focus:border-[#2F65F6] transition-all"
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
              <label className="text-xs font-semibold text-[#101828]">
                Contact Phone <span className="text-[#EF4444]">*</span>
              </label>
              <input
                type="text"
                placeholder="+880 1812-000000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-2.5 text-xs rounded-full border border-[#EBF0F7] bg-[#F4F7FB] text-[#1E293B] focus:bg-white focus:outline-none focus:border-[#2F65F6] transition-all"
              />
              {errors.phone && <p className="text-[11px] text-[#EF4444]">{errors.phone}</p>}
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#101828]">Email Address</label>
              <input
                type="email"
                placeholder="patient@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 text-xs rounded-full border border-[#EBF0F7] bg-[#F4F7FB] text-[#1E293B] focus:bg-white focus:outline-none focus:border-[#2F65F6] transition-all"
              />
            </div>
          </div>

          {/* Clinical Notes */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#101828]">Initial Clinical Assessment</label>
            <textarea
              rows={2}
              placeholder="Presenting symptoms, allergies, or referral notes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-4 py-2.5 text-xs rounded-2xl border border-[#EBF0F7] bg-[#F4F7FB] text-[#1E293B] focus:bg-white focus:outline-none focus:border-[#2F65F6] transition-all"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-[#EBF0F7] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsAddPatientModalOpen(false)}
              className="px-5 py-2.5 text-xs font-semibold text-[#64748B] hover:text-[#101828] hover:bg-[#F8FAFC] rounded-full border border-[#EBF0F7] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 text-xs font-semibold text-white bg-[#2F65F6] hover:bg-[#1E4FD8] rounded-full shadow-xs transition-colors flex items-center gap-1.5"
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

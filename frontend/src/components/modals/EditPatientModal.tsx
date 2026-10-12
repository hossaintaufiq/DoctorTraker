"use client";

import React, { useState, useEffect } from "react";
import { X, Edit2, User, Phone, Mail, Stethoscope, Check } from "lucide-react";
import { useDoctorTracker } from "@/context/DoctorTrackerContext";
import { PatientCondition, PatientGender } from "@/lib/types";

export function EditPatientModal() {
  const {
    isEditPatientModalOpen,
    setIsEditPatientModalOpen,
    editingPatient,
    setEditingPatient,
    doctors,
    updatePatient,
  } = useDoctorTracker();

  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState<PatientGender>("Male");
  const [assignedDoctorId, setAssignedDoctorId] = useState("");
  const [condition, setCondition] = useState<PatientCondition>("General");
  const [status, setStatus] = useState<"Admitted" | "Outpatient" | "Discharged">("Outpatient");
  const [bloodGroup, setBloodGroup] = useState<string>("O+");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (editingPatient) {
      setName(editingPatient.name || "");
      setAge(editingPatient.age?.toString() || "35");
      setGender(editingPatient.gender || "Male");
      setAssignedDoctorId(editingPatient.assignedDoctorId || "");
      setCondition(editingPatient.condition || "General");
      setStatus(editingPatient.status || "Outpatient");
      setBloodGroup(editingPatient.bloodGroup || "O+");
      setPhone(editingPatient.phone || "");
      setEmail(editingPatient.email || "");
      setNotes(editingPatient.notes || "");
    }
  }, [editingPatient, isEditPatientModalOpen]);

  if (!isEditPatientModalOpen || !editingPatient) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const matchedDoc = doctors.find((d: any) => d.id === assignedDoctorId || d._id === assignedDoctorId);
    const targetDocId = matchedDoc
      ? matchedDoc.id || (matchedDoc as any)._id
      : editingPatient.assignedDoctorId;
    const targetPatientId = editingPatient.id || (editingPatient as any)._id;

    await updatePatient(targetPatientId, {
      name: name.trim(),
      age: parseInt(age) || 30,
      gender,
      assignedDoctorId: targetDocId,
      assignedDoctorName: matchedDoc ? matchedDoc.name : editingPatient.assignedDoctorName,
      condition,
      status,
      bloodGroup: bloodGroup as any,
      phone: phone.trim(),
      email: email.trim(),
      notes: notes.trim(),
    });

    setIsEditPatientModalOpen(false);
    setEditingPatient(null);
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
              <h3 className="text-base font-bold text-[#101828]">Edit Patient Record</h3>
              <p className="text-xs text-[#64748B]">Update medical condition, attending doctor, and clinical notes</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              setIsEditPatientModalOpen(false);
              setEditingPatient(null);
            }}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-all"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
          {/* Patient Name & Age */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2 space-y-1.5">
              <label className="font-semibold text-slate-700">Patient Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#2F65F6]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700">Age</label>
              <input
                type="number"
                required
                min="0"
                max="130"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#2F65F6]"
              />
            </div>
          </div>

          {/* Gender, Blood Group & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700">Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as PatientGender)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#2F65F6]"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700">Blood Group</label>
              <select
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#2F65F6]"
              >
                {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
                  <option key={bg} value={bg}>
                    {bg}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700">Care Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#2F65F6]"
              >
                <option value="Outpatient">Outpatient</option>
                <option value="Admitted">Admitted Inpatient</option>
                <option value="Discharged">Discharged</option>
              </select>
            </div>
          </div>

          {/* Assigned Doctor */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700 flex items-center gap-1.5">
              <Stethoscope className="w-3.5 h-3.5 text-[#2F65F6]" /> Attending Specialist Doctor
            </label>
            <select
              value={assignedDoctorId}
              onChange={(e) => setAssignedDoctorId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#2F65F6]"
            >
              {doctors.map((d, i) => (
                <option key={d.id || (d as any)._id || `edit-pt-doc-${i}`} value={d.id || (d as any)._id}>
                  {d.name} &bull; {d.specialty} ({d.hospital})
                </option>
              ))}
            </select>
          </div>

          {/* Condition & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700">Clinical Classification</label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value as PatientCondition)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#2F65F6]"
              >
                <option value="General">General Care</option>
                <option value="Chronic">Chronic Condition</option>
                <option value="Recovering">Recovering / Post-op</option>
                <option value="Follow-up">Follow-up Required</option>
                <option value="Critical">Critical ICU</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700">Contact Phone</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#2F65F6]"
              />
            </div>
          </div>

          {/* Medical Notes */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700">Medical Notes & Treatment History</label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#2F65F6]"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => {
                setIsEditPatientModalOpen(false);
                setEditingPatient(null);
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
              <span>Save Patient Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

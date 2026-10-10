"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import {
  AlertCircle,
  Activity,
  Bed,
  PhoneCall,
  Plus,
  Flame,
  Search,
  RotateCcw,
  CheckCircle2,
  Clock,
  Radio,
  Siren,
  X,
  Check,
} from "lucide-react";
import { useDoctorTracker } from "@/context/DoctorTrackerContext";
import { cn } from "@/lib/utils";

interface EmergencyTriageItem {
  id: string;
  patient: string;
  age: number;
  gender: string;
  condition: string;
  priority: "Immediate OR" | "Critical ICU" | "High Priority" | "Stable";
  room: string;
  time: string;
  vitals: string;
}

const INITIAL_EMERGENCY: EmergencyTriageItem[] = [
  { id: "EM-104", patient: "Lucas Vance", age: 63, gender: "Male", condition: "Acute Arrhythmia & Chest Trauma", priority: "Critical ICU", room: "ICU Bed 4", time: "10 mins ago", vitals: "BP 160/95 • HR 122 bpm • SpO2 91%" },
  { id: "EM-103", patient: "Rachel Green", age: 29, gender: "Female", condition: "Acute Perforated Appendicitis", priority: "Immediate OR", room: "OR Suite 2", time: "25 mins ago", vitals: "BP 115/75 • Temp 102.4°F • WBC High" },
  { id: "EM-102", patient: "David Miller", age: 55, gender: "Male", condition: "Compound Femur Fracture", priority: "High Priority", room: "Triage Bed 8", time: "45 mins ago", vitals: "BP 130/85 • HR 88 bpm • SpO2 98%" },
  { id: "EM-101", patient: "Sophia Chen", age: 34, gender: "Female", condition: "Severe Bronchospasm & Asthma", priority: "Stable", room: "Nebulization Bay 1", time: "1 hour ago", vitals: "BP 120/80 • HR 94 bpm • SpO2 95%" },
];

export default function EmergencyPage() {
  const { showToast, addActivityLog } = useDoctorTracker();

  const [triageQueue, setTriageQueue] = useState<EmergencyTriageItem[]>(INITIAL_EMERGENCY);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPriority, setSelectedPriority] = useState("All");
  const [showIntakeModal, setShowIntakeModal] = useState(false);

  // New Intake Form
  const [patientName, setPatientName] = useState("");
  const [age, setAge] = useState("");
  const [condition, setCondition] = useState("");
  const [priority, setPriority] = useState<EmergencyTriageItem["priority"]>("Immediate OR");
  const [room, setRoom] = useState("ICU Bed 5");

  const isFiltered = searchQuery.trim() !== "" || selectedPriority !== "All";

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedPriority("All");
  };

  const filteredQueue = triageQueue.filter((item) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      item.patient.toLowerCase().includes(q) ||
      item.condition.toLowerCase().includes(q) ||
      item.id.toLowerCase().includes(q) ||
      item.room.toLowerCase().includes(q);

    const matchesPriority =
      selectedPriority === "All" || item.priority === selectedPriority;

    return matchesSearch && matchesPriority;
  });

  const handleCreateIntake = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName.trim()) return;

    const newItem: EmergencyTriageItem = {
      id: `EM-${100 + triageQueue.length + 1}`,
      patient: patientName.trim(),
      age: Number(age) || 45,
      gender: "Male",
      condition: condition.trim() || "Acute Trauma / ER Triage",
      priority,
      room,
      time: "Just now",
      vitals: "Vitals Recorded at ER Bay",
    };

    setTriageQueue([newItem, ...triageQueue]);
    addActivityLog("Clinical", "Emergency Triage Registered", `Admitted ${newItem.patient} (${newItem.priority}) to ${newItem.room}.`, "Warning");
    showToast("Emergency Intake Logged", `Dispatched trauma alert for ${newItem.patient}.`, "error");

    setShowIntakeModal(false);
    setPatientName("");
    setCondition("");
    setAge("");
  };

  const handleDischargeFromTriage = (id: string) => {
    setTriageQueue((prev) => prev.filter((item) => item.id !== id));
    showToast("Triage Cleared", "Patient transferred to specialized ward.", "success");
  };

  const getPriorityBadge = (p: EmergencyTriageItem["priority"]) => {
    switch (p) {
      case "Immediate OR":
        return "bg-rose-100 text-rose-700 border-rose-300 animate-pulse";
      case "Critical ICU":
        return "bg-rose-50 text-rose-600 border-rose-200";
      case "High Priority":
        return "bg-amber-50 text-amber-700 border-amber-200";
      default:
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
    }
  };

  return (
    <AppShell breadcrumbTitle="Emergency & Admission" parentLabel="Menu" parentPath="/dashboard">
      <div className="space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
          <div>
            <h1 className="text-2xl sm:text-[28px] font-bold text-[#101828] tracking-tight">
              Emergency Trauma & Rapid Admission
            </h1>
            <p className="text-xs text-[#64748B] mt-1">
              Real-time ICU telemetry, trauma triage priority queue, emergency dispatch, and rapid bed allocations.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => {
                addActivityLog("Security", "Trauma Siren Broadcast", "Dispatched emergency audio alert to Wing A.", "Warning");
                showToast("Trauma Alert Dispatched", "Emergency alarm triggered across Wing A OR suites.", "error");
              }}
              className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-full transition-all"
            >
              <Siren className="w-4 h-4 text-rose-600" />
              <span>Broadcast Trauma Alert</span>
            </button>

            <button
              type="button"
              onClick={() => setShowIntakeModal(true)}
              className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-[#EF4444] hover:bg-[#DC2626] rounded-full shadow-xs transition-all"
            >
              <AlertCircle className="w-4 h-4" />
              <span>Rapid ER Intake</span>
            </button>
          </div>
        </div>

        {/* Emergency Telemetry Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-3xl border border-[#EBF0F7] p-5 card-shadow flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#FEF2F2] text-[#EF4444] flex items-center justify-center shrink-0">
              <Bed className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] text-[#94A3B8] font-semibold uppercase">ICU Bed Occupancy</span>
              <p className="text-2xl font-bold text-[#101828] mt-0.5">18 / 20 Beds</p>
              <span className="text-[10px] text-rose-600 font-semibold">90% Capacity &bull; 2 Beds Open</span>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-[#EBF0F7] p-5 card-shadow flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#ECFDF5] text-[#10B981] flex items-center justify-center shrink-0">
              <Radio className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] text-[#94A3B8] font-semibold uppercase">Active Fleet Ambulances</span>
              <p className="text-2xl font-bold text-[#10B981] mt-0.5">4 Units En-route</p>
              <span className="text-[10px] text-[#64748B]">GPS Telemetry Live</span>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-[#EBF0F7] p-5 card-shadow flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#EBF3FE] text-[#2F65F6] flex items-center justify-center shrink-0">
              <PhoneCall className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] text-[#94A3B8] font-semibold uppercase">Trauma On-Call Lead</span>
              <p className="text-2xl font-bold text-[#101828] mt-0.5">Dr. Salman Hossain</p>
              <span className="text-[10px] text-[#2F65F6] font-semibold">Chief Trauma Surgeon</span>
            </div>
          </div>
        </div>

        {/* Filters Toolbar */}
        <div className="bg-white rounded-3xl border border-[#EBF0F7] p-4 card-shadow flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="relative w-full md:w-80">
            <input
              type="text"
              placeholder="Search triage queue by patient, condition, room..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#F8FAFC] border border-slate-200 rounded-full pl-9 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-[#2F65F6]"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="bg-[#F8FAFC] border border-slate-200 text-slate-700 text-xs rounded-full px-3 py-1.5 focus:bg-white focus:outline-none focus:border-[#2F65F6]"
            >
              <option value="All">All Triage Priorities</option>
              <option value="Immediate OR">Immediate OR</option>
              <option value="Critical ICU">Critical ICU</option>
              <option value="High Priority">High Priority</option>
              <option value="Stable">Stable</option>
            </select>

            <button
              type="button"
              onClick={handleResetFilters}
              disabled={!isFiltered}
              className={cn(
                "h-8 px-3 rounded-full text-xs font-semibold flex items-center gap-1.5 border transition-all shrink-0",
                isFiltered
                  ? "bg-white text-[#2F65F6] border-[#2F65F6]/30 hover:bg-[#2F65F6]/5 cursor-pointer shadow-2xs"
                  : "bg-[#F8FAFC] text-slate-400 border-slate-200 cursor-not-allowed opacity-60"
              )}
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Triage Live Queue List */}
        <div className="bg-white rounded-3xl border border-[#EBF0F7] p-6 card-shadow space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-[#101828]">Active Triage Queue & Telemetry</h3>
            <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-rose-50 text-rose-600 border border-rose-200">
              {filteredQueue.length} Active Trauma Cases
            </span>
          </div>

          <div className="space-y-3">
            {filteredQueue.map((em) => (
              <div
                key={em.id}
                className="p-5 rounded-3xl bg-[#F8FAFC] border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all hover:bg-white hover:shadow-sm"
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-[#FEF2F2] text-[#EF4444] flex items-center justify-center font-bold text-sm shrink-0 border border-red-100">
                    {em.id}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-[#101828]">{em.patient}</h4>
                      <span className="text-xs text-slate-500 font-medium">({em.age} yrs &bull; {em.gender})</span>
                    </div>
                    <p className="text-xs font-semibold text-rose-700 mt-0.5">{em.condition}</p>
                    <p className="text-[11px] text-slate-500 font-mono mt-1">{em.vitals}</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 self-stretch md:self-auto justify-between md:justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-200">
                  <div className="text-left sm:text-right">
                    <span className="font-bold text-xs text-slate-800 block">{em.room}</span>
                    <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1 sm:justify-end">
                      <Clock className="w-3 h-3" /> {em.time}
                    </span>
                  </div>

                  <span className={cn("px-3 py-1 rounded-full text-[11px] font-bold border", getPriorityBadge(em.priority))}>
                    &bull; {em.priority}
                  </span>

                  <button
                    type="button"
                    onClick={() => handleDischargeFromTriage(em.id)}
                    className="px-3 py-1.5 text-xs font-semibold text-[#10B981] bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-full transition-all"
                  >
                    Transfer / Clear
                  </button>
                </div>
              </div>
            ))}

            {filteredQueue.length === 0 && (
              <div className="py-12 text-center text-xs text-slate-400">
                No emergency trauma cases currently waiting.
              </div>
            )}
          </div>
        </div>

        {/* Rapid ER Intake Modal */}
        {showIntakeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/40 backdrop-blur-md animate-fade-in">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 w-full max-w-lg space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Flame className="w-5 h-5 text-rose-600" />
                  <h3 className="text-base font-bold text-slate-900">Rapid Emergency Intake Entry</h3>
                </div>
                <button
                  onClick={() => setShowIntakeModal(false)}
                  className="w-7 h-7 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center hover:bg-slate-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreateIntake} className="space-y-3 text-xs">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Patient Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Samuel Henderson"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:bg-white focus:border-rose-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Patient Age</label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 52"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:bg-white focus:border-rose-500"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Triage Priority</label>
                    <select
                      value={priority}
                      onChange={(e) => setPriority(e.target.value as any)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:bg-white focus:border-rose-500"
                    >
                      <option value="Immediate OR">Immediate OR (Level 1)</option>
                      <option value="Critical ICU">Critical ICU (Level 2)</option>
                      <option value="High Priority">High Priority (Level 3)</option>
                      <option value="Stable">Stable / Ambulatory (Level 4)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Acute Condition / Symptoms</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Cardiac Arrest, Severe Concussion"
                    value={condition}
                    onChange={(e) => setCondition(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:bg-white focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Assigned Bed / OR Suite</label>
                  <input
                    type="text"
                    value={room}
                    onChange={(e) => setRoom(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:bg-white focus:border-rose-500"
                  />
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowIntakeModal(false)}
                    className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-full"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-full shadow-xs flex items-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Admit Immediately</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}

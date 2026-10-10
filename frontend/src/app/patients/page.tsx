"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { useDoctorTracker } from "@/context/DoctorTrackerContext";
import {
  Search,
  Plus,
  Users,
  Eye,
  Trash2,
  Calendar,
  HeartPulse,
  Filter,
  CheckCircle,
} from "lucide-react";
import { getInitials, formatDate, cn } from "@/lib/utils";
import { PatientCondition } from "@/lib/types";

const CONDITION_STYLES: Record<
  PatientCondition,
  { bg: string; text: string; dot: string }
> = {
  General: {
    bg: "bg-[#E6F7F6]",
    text: "text-[#0F9F9A]",
    dot: "bg-[#0F9F9A]",
  },
  Chronic: {
    bg: "bg-[#EFF6FF]",
    text: "text-[#2563EB]",
    dot: "bg-[#2563EB]",
  },
  Recovering: {
    bg: "bg-[#EAF7F0]",
    text: "text-[#16A36A]",
    dot: "bg-[#16A36A]",
  },
  "Follow-up": {
    bg: "bg-[#FEF7EC]",
    text: "text-[#D97706]",
    dot: "bg-[#D97706]",
  },
  Critical: {
    bg: "bg-[#FDEDED]",
    text: "text-[#E05252]",
    dot: "bg-[#E05252]",
  },
};

export default function PatientsPage() {
  const { patients, setIsAddPatientModalOpen, deletePatient, showToast } =
    useDoctorTracker();

  const [search, setSearch] = useState("");
  const [selectedCondition, setSelectedCondition] = useState<string>("All");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");

  const filteredPatients = patients.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.patientCode.toLowerCase().includes(search.toLowerCase()) ||
      p.assignedDoctorName.toLowerCase().includes(search.toLowerCase()) ||
      p.phone.includes(search);

    const matchesCondition =
      selectedCondition === "All" || p.condition === selectedCondition;

    const matchesStatus =
      selectedStatus === "All" || p.status === selectedStatus;

    return matchesSearch && matchesCondition && matchesStatus;
  });

  return (
    <AppShell breadcrumbTitle="Patients" parentLabel="Workspace" parentPath="/dashboard">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E8EDF3]/60">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl sm:text-[26px] font-bold text-[#172B4D] tracking-tight">
                Patient Records & Directory
              </h1>
              <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-[#E6F7F6] text-[#0F9F9A]">
                {patients.length} Active Records
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#7A8798] mt-1">
              Clinical registration charts, assigned specialists, condition categories, and medical history.
            </p>
          </div>

          <button
            onClick={() => setIsAddPatientModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-[#0F9F9A] hover:bg-[#0B7F7A] rounded-xl shadow-xs transition-all self-start sm:self-auto"
          >
            <Plus className="w-4 h-4 stroke-[2.4]" />
            <span>Register Patient</span>
          </button>
        </div>

        {/* Filter Bar */}
        <div className="bg-white p-4 rounded-2xl border border-[#E8EDF3] card-shadow flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-[#7A8798] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by patient name, ID (#PT-1042), doctor..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-[#E8EDF3] bg-[#F7F9FC] text-[#243247] placeholder-[#7A8798] focus:bg-white focus:outline-none focus:border-[#0F9F9A] focus:ring-1 focus:ring-[#0F9F9A] transition-all"
            />
          </div>

          <div className="flex items-center flex-wrap gap-2.5 w-full md:w-auto">
            <div className="flex items-center gap-1.5 text-xs text-[#7A8798]">
              <span className="font-medium hidden sm:inline">Condition:</span>
              <select
                value={selectedCondition}
                onChange={(e) => setSelectedCondition(e.target.value)}
                className="px-3 py-1.5 text-xs rounded-xl border border-[#E8EDF3] bg-white text-[#243247] focus:outline-none focus:border-[#0F9F9A]"
              >
                <option value="All">All Conditions</option>
                <option value="General">General</option>
                <option value="Chronic">Chronic</option>
                <option value="Recovering">Recovering</option>
                <option value="Follow-up">Follow-up</option>
                <option value="Critical">Critical</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-[#7A8798]">
              <span className="font-medium hidden sm:inline">Care Status:</span>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-1.5 text-xs rounded-xl border border-[#E8EDF3] bg-white text-[#243247] focus:outline-none focus:border-[#0F9F9A]"
              >
                <option value="All">All Care Statuses</option>
                <option value="Outpatient">Outpatient</option>
                <option value="Admitted">Admitted</option>
                <option value="Discharged">Discharged</option>
              </select>
            </div>
          </div>
        </div>

        {/* Patient Table */}
        <div className="bg-white rounded-2xl border border-[#E8EDF3] p-5 sm:p-6 card-shadow">
          <div className="overflow-x-auto -mx-5 sm:-mx-6">
            <table className="w-full text-left border-collapse min-w-[720px]">
              <thead>
                <tr className="border-y border-[#E8EDF3] bg-[#F7F9FC]/60 text-[11px] font-semibold text-[#7A8798] uppercase tracking-wider">
                  <th className="py-2.5 px-5 sm:px-6">Patient</th>
                  <th className="py-2.5 px-4">Patient Code</th>
                  <th className="py-2.5 px-4">Assigned Doctor</th>
                  <th className="py-2.5 px-4">Condition</th>
                  <th className="py-2.5 px-4">Blood</th>
                  <th className="py-2.5 px-4">Care Status</th>
                  <th className="py-2.5 px-4">Registered</th>
                  <th className="py-2.5 px-5 sm:px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0F4F8] text-xs">
                {filteredPatients.map((patient) => {
                  const conditionStyle =
                    CONDITION_STYLES[patient.condition] || CONDITION_STYLES.General;

                  return (
                    <tr
                      key={patient.id}
                      className="hover:bg-[#F7F9FC]/70 transition-colors group"
                    >
                      {/* Name & Avatar */}
                      <td className="py-3.5 px-5 sm:px-6">
                        <Link
                          href={`/patients/${patient.id}`}
                          className="flex items-center gap-2.5"
                        >
                          <div className="w-8 h-8 rounded-full bg-[#E6F7F6] text-[#0F9F9A] font-bold text-xs flex items-center justify-center border border-[#0F9F9A]/20 shrink-0">
                            {getInitials(patient.name)}
                          </div>
                          <div>
                            <span className="font-semibold text-[#172B4D] group-hover:text-[#0F9F9A] transition-colors block">
                              {patient.name}
                            </span>
                            <span className="text-[11px] text-[#7A8798]">
                              {patient.gender}, {patient.age} yrs
                            </span>
                          </div>
                        </Link>
                      </td>

                      {/* Code */}
                      <td className="py-3.5 px-4 font-mono text-[11px] text-[#7A8798]">
                        {patient.patientCode}
                      </td>

                      {/* Doctor */}
                      <td className="py-3.5 px-4 font-medium text-[#243247]">
                        {patient.assignedDoctorName}
                      </td>

                      {/* Condition Badge */}
                      <td className="py-3.5 px-4">
                        <span
                          className={cn(
                            "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold",
                            conditionStyle.bg,
                            conditionStyle.text
                          )}
                        >
                          <span
                            className={cn("w-1.5 h-1.5 rounded-full", conditionStyle.dot)}
                          />
                          {patient.condition}
                        </span>
                      </td>

                      {/* Blood Group */}
                      <td className="py-3.5 px-4 font-semibold text-[#172B4D]">
                        {patient.bloodGroup}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <span
                          className={cn(
                            "px-2 py-0.5 rounded-full text-[10px] font-semibold",
                            patient.status === "Admitted" && "bg-[#FDEDED] text-[#E05252]",
                            patient.status === "Outpatient" && "bg-[#E6F7F6] text-[#0F9F9A]",
                            patient.status === "Discharged" && "bg-[#EAF7F0] text-[#16A36A]"
                          )}
                        >
                          {patient.status}
                        </span>
                      </td>

                      {/* Reg Date */}
                      <td className="py-3.5 px-4 text-[#7A8798] text-[11px]">
                        {formatDate(patient.registrationDate)}
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-5 sm:px-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            href={`/patients/${patient.id}`}
                            className="p-1.5 text-[#7A8798] hover:text-[#0F9F9A] hover:bg-[#E6F7F6] rounded-lg transition-colors"
                            title="View Chart"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => deletePatient(patient.id)}
                            className="p-1.5 text-[#7A8798] hover:text-[#E05252] hover:bg-[#FDEDED] rounded-lg transition-colors"
                            title="Delete Record"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredPatients.length === 0 && (
            <div className="p-8 text-center text-xs text-[#7A8798]">
              No patient records found matching the query.
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}

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
  FileDown,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";
import { getInitials, formatDate, cn } from "@/lib/utils";
import { PatientCondition } from "@/lib/types";

const CONDITION_STYLES: Record<
  PatientCondition,
  { bg: string; text: string; dot: string }
> = {
  General: {
    bg: "bg-[#EBF3FE]",
    text: "text-[#2F65F6]",
    dot: "bg-[#2F65F6]",
  },
  Chronic: {
    bg: "bg-[#EFF6FF]",
    text: "text-[#1D4ED8]",
    dot: "bg-[#1D4ED8]",
  },
  Recovering: {
    bg: "bg-[#ECFDF5]",
    text: "text-[#10B981]",
    dot: "bg-[#10B981]",
  },
  "Follow-up": {
    bg: "bg-[#FEF3C7]",
    text: "text-[#D97706]",
    dot: "bg-[#D97706]",
  },
  Critical: {
    bg: "bg-[#FEE2E2]",
    text: "text-[#EF4444]",
    dot: "bg-[#EF4444]",
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

  const handleExportCSV = () => {
    try {
      const headers = [
        "Patient ID",
        "Name",
        "Age",
        "Gender",
        "Assigned Doctor",
        "Condition",
        "Status",
        "Blood Group",
        "Registered",
      ];
      const rows = filteredPatients.map((p) => [
        p.patientCode,
        `"${p.name}"`,
        p.age,
        p.gender,
        `"${p.assignedDoctorName}"`,
        p.condition,
        p.status,
        p.bloodGroup,
        p.registrationDate,
      ]);
      const csv =
        "data:text/csv;charset=utf-8," +
        [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
      const uri = encodeURI(csv);
      const link = document.createElement("a");
      link.setAttribute("href", uri);
      link.setAttribute(
        "download",
        `medcare_patients_list_${new Date().toISOString().split("T")[0]}.csv`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast("Export Successful", `Downloaded ${filteredPatients.length} patient records.`, "success");
    } catch {
      showToast("Export Failed", "Could not export CSV file.", "error");
    }
  };

  return (
    <AppShell breadcrumbTitle="Patient" parentLabel="Workspace" parentPath="/dashboard">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-[28px] font-bold text-[#101828] tracking-tight">
                Patient Records
              </h1>
              <span className="px-3 py-1 text-xs font-semibold rounded-full bg-[#EBF3FE] text-[#2F65F6] border border-[#DCE8FC]">
                {patients.length} Active Records
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#64748B] mt-1">
              Clinical registration charts, assigned specialists, condition categories, and patient history.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-auto">
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-[#1E293B] bg-white border border-[#EBF0F7] rounded-full hover:bg-[#F8FAFC] card-shadow transition-all"
            >
              <FileDown className="w-3.5 h-3.5 text-[#64748B]" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={() => setIsAddPatientModalOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-[#2F65F6] hover:bg-[#1E4FD8] rounded-full shadow-xs transition-all"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Register Patient</span>
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-white p-4 rounded-3xl border border-[#EBF0F7] card-shadow flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="relative w-full md:w-88">
            <Search className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, ID (#PT-1042), doctor, phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2.5 text-xs rounded-full border border-[#EBF0F7] bg-[#F4F7FB] text-[#1E293B] placeholder-[#94A3B8] focus:bg-white focus:outline-none focus:border-[#2F65F6] focus:ring-1 focus:ring-[#2F65F6] transition-all"
            />
          </div>

          <div className="flex items-center flex-wrap gap-3 w-full md:w-auto">
            <div className="flex items-center gap-2 text-xs text-[#64748B]">
              <span className="font-medium hidden sm:inline">Condition:</span>
              <select
                value={selectedCondition}
                onChange={(e) => setSelectedCondition(e.target.value)}
                className="px-3.5 py-2 text-xs rounded-full border border-[#EBF0F7] bg-[#F4F7FB] text-[#1E293B] focus:outline-none focus:border-[#2F65F6]"
              >
                <option value="All">All Conditions</option>
                <option value="General">General</option>
                <option value="Chronic">Chronic</option>
                <option value="Recovering">Recovering</option>
                <option value="Follow-up">Follow-up</option>
                <option value="Critical">Critical</option>
              </select>
            </div>

            <div className="flex items-center gap-2 text-xs text-[#64748B]">
              <span className="font-medium hidden sm:inline">Care Status:</span>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3.5 py-2 text-xs rounded-full border border-[#EBF0F7] bg-[#F4F7FB] text-[#1E293B] focus:outline-none focus:border-[#2F65F6]"
              >
                <option value="All">All Care Statuses</option>
                <option value="Outpatient">Outpatient</option>
                <option value="Admitted">Admitted</option>
                <option value="Discharged">Discharged</option>
              </select>
            </div>
          </div>
        </div>

        {/* Patient Table Card */}
        <div className="bg-white rounded-3xl border border-[#EBF0F7] p-6 card-shadow">
          <div className="overflow-x-auto -mx-6">
            <table className="w-full text-left border-collapse min-w-[760px]">
              <thead>
                <tr className="border-y border-[#EBF0F7] bg-[#F8FAFC] text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider">
                  <th className="py-3 px-6">Patient</th>
                  <th className="py-3 px-4">Patient Code</th>
                  <th className="py-3 px-4">Assigned Doctor</th>
                  <th className="py-3 px-4">Condition</th>
                  <th className="py-3 px-4">Blood</th>
                  <th className="py-3 px-4">Care Status</th>
                  <th className="py-3 px-4">Registered</th>
                  <th className="py-3 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9] text-xs">
                {filteredPatients.map((patient) => {
                  const conditionStyle =
                    CONDITION_STYLES[patient.condition] || CONDITION_STYLES.General;

                  return (
                    <tr
                      key={patient.id}
                      className="hover:bg-[#F8FAFC]/80 transition-colors group"
                    >
                      {/* Name & Avatar */}
                      <td className="py-4 px-6">
                        <Link
                          href={`/patients/${patient.id}`}
                          className="flex items-center gap-3"
                        >
                          <div className="w-9 h-9 rounded-full bg-[#EBF3FE] text-[#2F65F6] font-bold text-xs flex items-center justify-center border border-[#DCE8FC] shrink-0">
                            {getInitials(patient.name)}
                          </div>
                          <div>
                            <span className="font-semibold text-[#101828] group-hover:text-[#2F65F6] transition-colors block">
                              {patient.name}
                            </span>
                            <span className="text-[11px] text-[#64748B]">
                              {patient.gender}, {patient.age} yrs
                            </span>
                          </div>
                        </Link>
                      </td>

                      {/* Code */}
                      <td className="py-4 px-4 font-mono text-[11px] text-[#64748B]">
                        {patient.patientCode}
                      </td>

                      {/* Doctor */}
                      <td className="py-4 px-4 font-medium text-[#1E293B]">
                        {patient.assignedDoctorName}
                      </td>

                      {/* Condition Badge */}
                      <td className="py-4 px-4">
                        <span
                          className={cn(
                            "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold",
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
                      <td className="py-4 px-4 font-semibold text-[#101828]">
                        {patient.bloodGroup}
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4">
                        <span
                          className={cn(
                            "px-2.5 py-1 rounded-full text-[10px] font-semibold",
                            patient.status === "Admitted" && "bg-[#FEE2E2] text-[#EF4444]",
                            patient.status === "Outpatient" && "bg-[#EBF3FE] text-[#2F65F6]",
                            patient.status === "Discharged" && "bg-[#ECFDF5] text-[#10B981]"
                          )}
                        >
                          {patient.status}
                        </span>
                      </td>

                      {/* Reg Date */}
                      <td className="py-4 px-4 text-[#64748B] text-[11px]">
                        {formatDate(patient.registrationDate)}
                      </td>

                      {/* Action */}
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            href={`/patients/${patient.id}`}
                            className="p-2 text-[#64748B] hover:text-[#2F65F6] hover:bg-[#EBF3FE] rounded-full transition-colors"
                            title="View Chart"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => {
                              deletePatient(patient.id);
                              showToast("Record Removed", `${patient.name} record deleted.`, "info");
                            }}
                            className="p-2 text-[#64748B] hover:text-[#EF4444] hover:bg-[#FEE2E2] rounded-full transition-colors"
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
            <div className="p-10 text-center text-xs text-[#64748B]">
              No patient records found matching your filter criteria.
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}

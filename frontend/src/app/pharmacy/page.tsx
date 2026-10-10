"use client";

import React from "react";
import { AppShell } from "@/components/layout/AppShell";
import { ShoppingBag, Plus, AlertCircle, CheckCircle2, Pill } from "lucide-react";
import { useDoctorTracker } from "@/context/DoctorTrackerContext";

const MEDICINES = [
  { name: "Amoxicillin 500mg", category: "Antibiotic", stock: 1420, status: "In Stock", supplier: "Apex Pharma" },
  { name: "Atorvastatin 20mg", category: "Cardiovascular", stock: 850, status: "In Stock", supplier: "Square Med" },
  { name: "Metformin 850mg", category: "Antidiabetic", stock: 620, status: "In Stock", supplier: "Beximco" },
  { name: "Paracetamol 500mg", category: "Analgesic", stock: 48, status: "Low Stock", supplier: "Incepta" },
  { name: "Omeprazole 20mg", category: "Gastrointestinal", stock: 950, status: "In Stock", supplier: "Renata" },
];

export default function PharmacyPage() {
  const { showToast } = useDoctorTracker();

  return (
    <AppShell breadcrumbTitle="Pharmacy Management" parentLabel="Other Menu" parentPath="/dashboard">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
          <div>
            <h1 className="text-2xl sm:text-[28px] font-bold text-[#101828] tracking-tight">
              Hospital Pharmacy & Dispensary
            </h1>
            <p className="text-xs text-[#64748B] mt-1">
              Pharmaceutical inventory tracking, prescription fulfillments, and stock replenishment.
            </p>
          </div>

          <button
            type="button"
            onClick={() => showToast("Stock Added", "New batch recorded in pharmacy ledger.", "success")}
            className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-[#2F65F6] hover:bg-[#1E4FD8] rounded-full shadow-xs transition-all self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add Medication</span>
          </button>
        </div>

        <div className="bg-white rounded-3xl border border-[#EBF0F7] p-6 card-shadow">
          <h3 className="text-base font-bold text-[#101828] mb-4">Medication Inventory</h3>
          <div className="overflow-x-auto -mx-6">
            <table className="w-full text-left border-collapse min-w-[580px]">
              <thead>
                <tr className="text-[11px] font-semibold text-[#94A3B8] uppercase border-b border-[#F1F5F9]">
                  <th className="py-3 px-6">Medication</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Stock Units</th>
                  <th className="py-3 px-4">Supplier</th>
                  <th className="py-3 px-6 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9] text-xs">
                {MEDICINES.map((med) => (
                  <tr key={med.name} className="hover:bg-[#F8FAFC] transition-colors">
                    <td className="py-3.5 px-6 font-bold text-[#101828]">{med.name}</td>
                    <td className="py-3.5 px-4 text-[#64748B]">{med.category}</td>
                    <td className="py-3.5 px-4 font-bold text-[#101828]">{med.stock} units</td>
                    <td className="py-3.5 px-4 text-[#94A3B8]">{med.supplier}</td>
                    <td className="py-3.5 px-6 text-right">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${med.status === "In Stock" ? "bg-[#ECFDF5] text-[#10B981]" : "bg-[#FEF3C7] text-[#D97706]"}`}>
                        &bull; {med.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

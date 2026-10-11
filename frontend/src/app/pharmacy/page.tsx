"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { useDoctorTracker } from "@/context/DoctorTrackerContext";
import {
  ShoppingBag,
  Plus,
  AlertCircle,
  CheckCircle2,
  Pill,
  Search,
  RotateCcw,
  Package,
  Boxes,
  AlertTriangle,
  Check,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface MedicineItem {
  id: string;
  name: string;
  category: string;
  stock: number;
  unitPrice: number;
  status: "In Stock" | "Low Stock" | "Critical";
  supplier: string;
  batchNumber: string;
  expiryDate: string;
}

const INITIAL_MEDICINES: MedicineItem[] = [
  { id: "MED-101", name: "Amoxicillin 500mg", category: "Antibiotic", stock: 1420, unitPrice: 12.50, status: "In Stock", supplier: "Apex Pharma", batchNumber: "APX-8821", expiryDate: "Dec 2027" },
  { id: "MED-102", name: "Atorvastatin 20mg", category: "Cardiovascular", stock: 850, unitPrice: 24.00, status: "In Stock", supplier: "Square Med", batchNumber: "SQR-9902", expiryDate: "Aug 2027" },
  { id: "MED-103", name: "Metformin 850mg", category: "Antidiabetic", stock: 620, unitPrice: 15.20, status: "In Stock", supplier: "Beximco", batchNumber: "BEX-4410", expiryDate: "Nov 2026" },
  { id: "MED-104", name: "Paracetamol 500mg", category: "Analgesic", stock: 48, unitPrice: 4.50, status: "Low Stock", supplier: "Incepta", batchNumber: "INC-2201", expiryDate: "Mar 2028" },
  { id: "MED-105", name: "Omeprazole 20mg", category: "Gastrointestinal", stock: 950, unitPrice: 18.00, status: "In Stock", supplier: "Renata", batchNumber: "REN-7731", expiryDate: "Jan 2028" },
  { id: "MED-106", name: "Ciprofloxacin 500mg", category: "Antibiotic", stock: 18, unitPrice: 22.00, status: "Critical", supplier: "Apex Pharma", batchNumber: "APX-3310", expiryDate: "Oct 2026" },
  { id: "MED-107", name: "Salbutamol Inhaler 100mcg", category: "Respiratory", stock: 320, unitPrice: 35.00, status: "In Stock", supplier: "Beximco", batchNumber: "BEX-1180", expiryDate: "May 2027" },
  { id: "MED-108", name: "Heparin Injection 5000 IU", category: "Anticoagulant", stock: 110, unitPrice: 48.00, status: "In Stock", supplier: "Square Med", batchNumber: "SQR-5541", expiryDate: "Sep 2027" },
];

export default function PharmacyPage() {
  const { showToast, addActivityLog } = useDoctorTracker();

  const [medicines, setMedicines] = useState<MedicineItem[]>(INITIAL_MEDICINES);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [showAddModal, setShowAddModal] = useState(false);

  // New med modal form
  const [newName, setNewName] = useState("");
  const [newCategory, setNewCategory] = useState("Antibiotic");
  const [newStock, setNewStock] = useState("100");
  const [newPrice, setNewPrice] = useState("10.00");
  const [newSupplier, setNewSupplier] = useState("Apex Pharma");

  const isFiltered =
    searchQuery.trim() !== "" ||
    selectedCategory !== "All" ||
    selectedStatus !== "All";

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All");
    setSelectedStatus("All");
  };

  const filteredMedicines = medicines.filter((med) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      med.name.toLowerCase().includes(q) ||
      med.category.toLowerCase().includes(q) ||
      med.supplier.toLowerCase().includes(q) ||
      med.batchNumber.toLowerCase().includes(q);

    const matchesCategory =
      selectedCategory === "All" || med.category === selectedCategory;

    const matchesStatus =
      selectedStatus === "All" || med.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleAddMedicine = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const stockNum = Number(newStock) || 50;
    const newMedItem: MedicineItem = {
      id: `MED-${100 + medicines.length + 1}`,
      name: newName.trim(),
      category: newCategory,
      stock: stockNum,
      unitPrice: Number(newPrice) || 10,
      status: stockNum < 20 ? "Critical" : stockNum < 60 ? "Low Stock" : "In Stock",
      supplier: newSupplier.trim() || "Hospital Depot",
      batchNumber: `BAT-${Math.floor(1000 + Math.random() * 9000)}`,
      expiryDate: "Dec 2028",
    };

    setMedicines([newMedItem, ...medicines]);
    addActivityLog("Clinical", "New Medication Recorded", `Added ${newMedItem.name} (${stockNum} units).`, "Success");
    showToast("Medication Added", `Added ${newMedItem.name} to pharmacy inventory.`, "success");

    setShowAddModal(false);
    setNewName("");
  };

  const handleAdjustStock = (id: string, delta: number) => {
    setMedicines((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          const updatedStock = Math.max(0, m.stock + delta);
          const status = updatedStock < 20 ? "Critical" : updatedStock < 60 ? "Low Stock" : "In Stock";
          return { ...m, stock: updatedStock, status };
        }
        return m;
      })
    );
    showToast("Stock Updated", "Inventory count adjusted.", "info");
  };

  const totalStockUnits = medicines.reduce((acc, m) => acc + m.stock, 0);
  const lowStockCount = medicines.filter((m) => m.status === "Low Stock" || m.status === "Critical").length;

  return (
    <AppShell breadcrumbTitle="Pharmacy Management" parentLabel="Menu" parentPath="/dashboard">
      <div className="space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
          <div>
            <h1 className="text-2xl sm:text-[28px] font-bold text-[#101828] tracking-tight">
              Hospital Pharmacy & Dispensary Inventory
            </h1>
            <p className="text-xs text-[#64748B] mt-1">
              Pharmaceutical inventory tracking, batch expiry auditing, and electronic prescription dispensations.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-[#2F65F6] hover:bg-[#1E4FD8] rounded-full shadow-xs transition-all self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add Medication</span>
          </button>
        </div>

        {/* Pharmacy KPI Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-3xl border border-[#EBF0F7] p-5 card-shadow flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#EBF3FE] text-[#2F65F6] flex items-center justify-center shrink-0">
              <Boxes className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] text-[#94A3B8] font-semibold uppercase">Total Stock Units</span>
              <p className="text-2xl font-bold text-[#101828]">{totalStockUnits.toLocaleString()}</p>
              <span className="text-[10px] text-[#10B981] font-semibold">{medicines.length} Cataloged SKUs</span>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-[#EBF0F7] p-5 card-shadow flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#FEF2F2] text-[#EF4444] flex items-center justify-center shrink-0">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] text-[#94A3B8] font-semibold uppercase">Restock Alerts</span>
              <p className="text-2xl font-bold text-[#EF4444]">{lowStockCount} Items</p>
              <span className="text-[10px] text-[#EF4444] font-semibold">Immediate re-order needed</span>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-[#EBF0F7] p-5 card-shadow flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#ECFDF5] text-[#10B981] flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] text-[#94A3B8] font-semibold uppercase">Compliance & Expiry</span>
              <p className="text-2xl font-bold text-[#10B981]">100% Valid</p>
              <span className="text-[10px] text-[#10B981] font-semibold">Zero expired batches</span>
            </div>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="bg-white rounded-3xl border border-[#EBF0F7] p-4 card-shadow flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="relative w-full md:w-80">
            <input
              type="text"
              placeholder="Search medication, category, supplier..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#F8FAFC] border border-slate-200 rounded-full pl-9 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-[#2F65F6]"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {/* Category Select */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-[#F8FAFC] border border-slate-200 text-slate-700 text-xs rounded-full px-3 py-1.5 focus:bg-white focus:outline-none focus:border-[#2F65F6]"
            >
              <option value="All">All Categories</option>
              <option value="Antibiotic">Antibiotic</option>
              <option value="Cardiovascular">Cardiovascular</option>
              <option value="Antidiabetic">Antidiabetic</option>
              <option value="Analgesic">Analgesic</option>
              <option value="Gastrointestinal">Gastrointestinal</option>
              <option value="Respiratory">Respiratory</option>
              <option value="Anticoagulant">Anticoagulant</option>
            </select>

            {/* Status Select */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-[#F8FAFC] border border-slate-200 text-slate-700 text-xs rounded-full px-3 py-1.5 focus:bg-white focus:outline-none focus:border-[#2F65F6]"
            >
              <option value="All">All Stock Levels</option>
              <option value="In Stock">In Stock</option>
              <option value="Low Stock">Low Stock</option>
              <option value="Critical">Critical</option>
            </select>

            {/* Non-shifting Reset Button */}
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

        {/* Medication Table */}
        <div className="bg-white rounded-3xl border border-[#EBF0F7] p-6 card-shadow">
          <div className="overflow-x-auto -mx-6">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="text-[11px] font-semibold text-[#94A3B8] uppercase border-b border-[#F1F5F9]">
                  <th className="py-3 px-6">Medication SKU</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Batch & Expiry</th>
                  <th className="py-3 px-4">Unit Price</th>
                  <th className="py-3 px-4">Stock Level</th>
                  <th className="py-3 px-4">Supplier</th>
                  <th className="py-3 px-6 text-right">Quick Stock Adjust</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9] text-xs">
                {filteredMedicines.map((med) => (
                  <tr key={med.id} className="hover:bg-[#F8FAFC] transition-colors">
                    <td className="py-3.5 px-6">
                      <div className="font-bold text-[#101828] flex items-center gap-2">
                        <Pill className="w-4 h-4 text-[#2F65F6]" />
                        <span>{med.name}</span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400 block mt-0.5">
                        {med.id}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-slate-600 font-medium">{med.category}</td>

                    <td className="py-3.5 px-4 text-slate-500">
                      <span className="font-mono text-xs text-slate-700 font-semibold">{med.batchNumber}</span>
                      <span className="text-[10px] text-slate-400 block">Exp: {med.expiryDate}</span>
                    </td>

                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                      ${med.unitPrice.toFixed(2)}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{med.stock} units</div>
                      <span
                        className={cn(
                          "px-2 py-0.5 rounded-full text-[10px] font-semibold inline-block mt-0.5 border",
                          med.status === "In Stock"
                            ? "bg-[#ECFDF5] text-[#10B981] border-[#D1FAE5]"
                            : med.status === "Low Stock"
                            ? "bg-[#FEF3C7] text-[#D97706] border-[#FDE68A]"
                            : "bg-[#FEF2F2] text-[#EF4444] border-[#FECACA]"
                        )}
                      >
                        &bull; {med.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-slate-500 font-medium">{med.supplier}</td>

                    <td className="py-3.5 px-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleAdjustStock(med.id, -10)}
                          className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-xs"
                          title="Dispense 10 units"
                        >
                          -10
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAdjustStock(med.id, 50)}
                          className="w-7 h-7 rounded-full bg-blue-50 hover:bg-blue-100 text-[#2F65F6] font-bold flex items-center justify-center text-xs"
                          title="Restock 50 units"
                        >
                          +50
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredMedicines.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400">
                      No medications match the search and filter criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add Medication Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/40 backdrop-blur-md animate-fade-in">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl p-4 sm:p-6 w-full max-w-lg space-y-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Pill className="w-5 h-5 text-[#2F65F6]" />
                  <h3 className="text-base font-bold text-slate-900">Record New Pharmacy SKU</h3>
                </div>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="w-7 h-7 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center hover:bg-slate-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleAddMedicine} className="space-y-3 text-xs">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Medication Name & Dosage</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Azithromycin 500mg"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:bg-white focus:border-[#2F65F6]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Category</label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:bg-white focus:border-[#2F65F6]"
                    >
                      <option value="Antibiotic">Antibiotic</option>
                      <option value="Cardiovascular">Cardiovascular</option>
                      <option value="Antidiabetic">Antidiabetic</option>
                      <option value="Analgesic">Analgesic</option>
                      <option value="Gastrointestinal">Gastrointestinal</option>
                      <option value="Respiratory">Respiratory</option>
                      <option value="Anticoagulant">Anticoagulant</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Supplier</label>
                    <input
                      type="text"
                      placeholder="e.g. Square Med"
                      value={newSupplier}
                      onChange={(e) => setNewSupplier(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:bg-white focus:border-[#2F65F6]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Initial Stock Units</label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={newStock}
                      onChange={(e) => setNewStock(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:bg-white focus:border-[#2F65F6]"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Unit Price ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      min="0"
                      value={newPrice}
                      onChange={(e) => setNewPrice(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:bg-white focus:border-[#2F65F6]"
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-full"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 font-bold text-white bg-[#2F65F6] hover:bg-[#1E4FD8] rounded-full shadow-xs flex items-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Save to Inventory</span>
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

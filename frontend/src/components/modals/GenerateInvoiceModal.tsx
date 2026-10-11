"use client";

import React, { useState } from "react";
import { useDoctorTracker } from "@/context/DoctorTrackerContext";
import {
  X,
  Plus,
  Trash2,
  FileText,
  DollarSign,
  User,
  Stethoscope,
  Building2,
  CreditCard,
  Calendar,
  Check,
} from "lucide-react";
import { InvoiceItem } from "@/lib/types";

interface LineItemState {
  description: string;
  department: string;
  quantity: number;
  unitPrice: number;
}

const DEFAULT_LINE_ITEMS: LineItemState[] = [
  { description: "Specialist Physician Consultation", department: "Cardiology", quantity: 1, unitPrice: 150 },
  { description: "Comprehensive Metabolic Panel (CMP)", department: "Pathology", quantity: 1, unitPrice: 85 },
];

export function GenerateInvoiceModal() {
  const {
    isGenerateInvoiceModalOpen,
    setIsGenerateInvoiceModalOpen,
    doctors,
    patients,
    departments,
    addInvoice,
  } = useDoctorTracker();

  const [selectedPatientId, setSelectedPatientId] = useState(patients[0]?.id || "");
  const [selectedDoctorId, setSelectedDoctorId] = useState(doctors[0]?.id || "");
  const [dueDate, setDueDate] = useState(
    new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
  );
  const [paymentMethod, setPaymentMethod] = useState<InvoiceItem["paymentMethod"]>("Insurance");
  const [status, setStatus] = useState<InvoiceItem["status"]>("Pending");
  const [taxRate, setTaxRate] = useState(5);
  const [discountAmount, setDiscountAmount] = useState(0);

  const [lineItems, setLineItems] = useState<LineItemState[]>(DEFAULT_LINE_ITEMS);

  if (!isGenerateInvoiceModalOpen) return null;

  const handleAddLineItem = () => {
    setLineItems([
      ...lineItems,
      { description: "Diagnostic Ultrasound Scan", department: "Radiology", quantity: 1, unitPrice: 120 },
    ]);
  };

  const handleRemoveLineItem = (index: number) => {
    if (lineItems.length === 1) return;
    setLineItems(lineItems.filter((_, i) => i !== index));
  };

  const handleItemChange = (index: number, field: keyof LineItemState, value: any) => {
    const updated = [...lineItems];
    updated[index] = { ...updated[index], [field]: value };
    setLineItems(updated);
  };

  const subtotal = lineItems.reduce((sum, item) => sum + (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0), 0);
  const tax = Number(((subtotal * taxRate) / 100).toFixed(2));
  const total = Math.max(0, Number((subtotal + tax - discountAmount).toFixed(2)));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const selectedPatient = patients.find((p) => p.id === selectedPatientId) || patients[0];
    const selectedDoctor = doctors.find((d) => d.id === selectedDoctorId) || doctors[0];

    const formattedItems = lineItems.map((item) => ({
      description: item.description,
      department: item.department,
      quantity: Number(item.quantity) || 1,
      unitPrice: Number(item.unitPrice) || 0,
      totalPrice: (Number(item.quantity) || 1) * (Number(item.unitPrice) || 0),
    }));

    addInvoice({
      patientId: selectedPatient ? selectedPatient.id : "pat-walkin",
      patientName: selectedPatient ? selectedPatient.name : "Walk-in Patient",
      patientCode: selectedPatient ? selectedPatient.patientCode : "PT-0099",
      doctorId: selectedDoctor ? selectedDoctor.id : "doc-1",
      doctorName: selectedDoctor ? selectedDoctor.name : "Dr. Salman Hossain",
      dueDate,
      status,
      paymentMethod,
      subtotal,
      tax,
      discount: discountAmount,
      total,
      items: formattedItems,
    });

    setIsGenerateInvoiceModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/40 backdrop-blur-md animate-fade-in">
      <div className="bg-white/95 backdrop-blur-3xl w-full max-w-3xl rounded-3xl border border-white/90 shadow-2xl overflow-hidden animate-scale-up flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="h-16 px-4 sm:px-6 border-b border-slate-100 flex items-center justify-between bg-white/80 shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-[#10B981]/10 text-[#10B981] flex items-center justify-center shrink-0">
              <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <h2 className="text-sm sm:text-base font-bold text-[#101828] truncate">
                Generate Clinical Invoice & Claim
              </h2>
              <p className="text-[11px] sm:text-xs text-[#64748B] truncate hidden xs:block">
                Create itemized medical charges, insurance co-pay, and patient statements.
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsGenerateInvoiceModalOpen(false)}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-all shrink-0 cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-5 overflow-y-auto flex-1">
          {/* Patient & Doctor Select */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#2F65F6]" /> Patient Account
              </label>
              <select
                required
                value={selectedPatientId}
                onChange={(e) => setSelectedPatientId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-xs text-slate-800 focus:bg-white focus:outline-none focus:border-[#2F65F6]"
              >
                {patients.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.patientCode}) &bull; {p.phone}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Stethoscope className="w-3.5 h-3.5 text-[#2F65F6]" /> Attending Specialist
              </label>
              <select
                required
                value={selectedDoctorId}
                onChange={(e) => setSelectedDoctorId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-xs text-slate-800 focus:bg-white focus:outline-none focus:border-[#2F65F6]"
              >
                {doctors.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} &bull; {d.specialty}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Due Date & Payment Method */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" /> Payment Due Date
              </label>
              <input
                type="date"
                required
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2 text-xs text-slate-800 focus:bg-white focus:outline-none focus:border-[#2F65F6]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600 flex items-center gap-1">
                <CreditCard className="w-3.5 h-3.5 text-slate-400" /> Payment Method
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2 text-xs text-slate-800 focus:bg-white focus:outline-none focus:border-[#2F65F6]"
              >
                <option value="Insurance">Insurance Claim</option>
                <option value="Credit Card">Credit Card</option>
                <option value="Cash">Cash at Desk</option>
                <option value="Bank Transfer">Bank Wire</option>
                <option value="Mobile Pay">Mobile Pay</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600">Initial Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2 text-xs text-slate-800 focus:bg-white focus:outline-none focus:border-[#2F65F6]"
              >
                <option value="Pending">Pending Payment</option>
                <option value="Paid">Mark as Paid Immediately</option>
                <option value="Processing">Processing Claim</option>
                <option value="Overdue">Overdue</option>
              </select>
            </div>
          </div>

          {/* Itemized Line Items */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Itemized Medical Charges & Procedures
              </h3>
              <button
                type="button"
                onClick={handleAddLineItem}
                className="text-xs font-semibold text-[#2F65F6] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Add Charge Item
              </button>
            </div>

            <div className="space-y-2.5">
              {lineItems.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-slate-50/80 rounded-2xl border border-slate-200 space-y-2 sm:space-y-0 sm:grid sm:grid-cols-12 sm:gap-2 sm:items-center"
                >
                  <div className="sm:col-span-5">
                    <input
                      type="text"
                      placeholder="Service / Procedure Description"
                      required
                      value={item.description}
                      onChange={(e) => handleItemChange(idx, "description", e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-[#2F65F6]"
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <select
                      value={item.department}
                      onChange={(e) => handleItemChange(idx, "department", e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-[#2F65F6]"
                    >
                      {departments.map((d) => (
                        <option key={d.id} value={d.name}>
                          {d.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-12 gap-2 sm:col-span-4 items-center">
                    <div className="col-span-5 sm:col-span-6">
                      <input
                        type="number"
                        min="1"
                        placeholder="Qty"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(idx, "quantity", e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-2 py-1.5 text-xs text-slate-800 text-center focus:outline-none focus:border-[#2F65F6]"
                      />
                    </div>

                    <div className="col-span-5 sm:col-span-4">
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="Price"
                        value={item.unitPrice}
                        onChange={(e) => handleItemChange(idx, "unitPrice", e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-2 py-1.5 text-xs text-slate-800 text-right focus:outline-none focus:border-[#2F65F6]"
                      />
                    </div>

                    <div className="col-span-2 sm:col-span-2 flex justify-end">
                      <button
                        type="button"
                        onClick={() => handleRemoveLineItem(idx)}
                        disabled={lineItems.length === 1}
                        className="p-1.5 text-slate-400 hover:text-rose-500 disabled:opacity-30 transition-colors cursor-pointer"
                        title="Remove row"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing Calculations Summary */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal:</span>
              <span className="font-semibold text-slate-900">${subtotal.toFixed(2)}</span>
            </div>

            <div className="flex items-center justify-between text-slate-600">
              <span className="flex items-center gap-1.5">
                Tax (VAT / Govt Surcharge):
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={taxRate}
                  onChange={(e) => setTaxRate(Number(e.target.value) || 0)}
                  className="w-12 bg-white border border-slate-200 rounded px-1.5 py-0.5 text-center text-xs"
                />
                %
              </span>
              <span className="font-semibold text-slate-900">${tax.toFixed(2)}</span>
            </div>

            <div className="flex items-center justify-between text-slate-600">
              <span className="flex items-center gap-1.5">
                Hospital Discount / Subsidy ($):
                <input
                  type="number"
                  min="0"
                  value={discountAmount}
                  onChange={(e) => setDiscountAmount(Number(e.target.value) || 0)}
                  className="w-16 bg-white border border-slate-200 rounded px-1.5 py-0.5 text-center text-xs"
                />
              </span>
              <span className="font-semibold text-emerald-600">-${discountAmount.toFixed(2)}</span>
            </div>

            <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-bold text-slate-900">
              <span>Total Invoice Payable:</span>
              <span className="text-base text-[#2F65F6]">${total.toFixed(2)}</span>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setIsGenerateInvoiceModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-full transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-xs font-bold text-white bg-[#2F65F6] hover:bg-[#1E4FD8] rounded-full shadow-xs transition-all flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Generate & Save Invoice</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

"use client";

import React from "react";
import { Building2 } from "lucide-react";

interface GeneralSettingsTabProps {
  hospitalName: string;
  setHospitalName: (val: string) => void;
  tagline: string;
  setTagline: (val: string) => void;
  adminEmail: string;
  setAdminEmail: (val: string) => void;
  emergencyPhone: string;
  setEmergencyPhone: (val: string) => void;
  supportPhone: string;
  setSupportPhone: (val: string) => void;
  licenseKey: string;
  setLicenseKey: (val: string) => void;
  facilityAddress: string;
  setFacilityAddress: (val: string) => void;
  defaultCurrency: string;
  setDefaultCurrency: (val: string) => void;
  timezone: string;
  setTimezone: (val: string) => void;
}

export function GeneralSettingsTab({
  hospitalName,
  setHospitalName,
  tagline,
  setTagline,
  adminEmail,
  setAdminEmail,
  emergencyPhone,
  setEmergencyPhone,
  supportPhone,
  setSupportPhone,
  licenseKey,
  setLicenseKey,
  facilityAddress,
  setFacilityAddress,
  defaultCurrency,
  setDefaultCurrency,
  timezone,
  setTimezone,
}: GeneralSettingsTabProps) {
  return (
    <div className="bg-white rounded-3xl border border-[#EBF0F7] p-6 sm:p-8 card-shadow space-y-6 animate-fade-in">
      <div className="flex items-center gap-3 pb-4 border-b border-[#EBF0F7]">
        <div className="w-11 h-11 rounded-2xl bg-[#EBF3FE] text-[#2F65F6] flex items-center justify-center border border-[#DCE8FC]">
          <Building2 className="w-5 h-5 stroke-[2.2]" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-[#101828]">Hospital Profile & Facility Branding</h3>
          <p className="text-xs text-[#64748B]">Official institution identity, licensing, and contact metadata</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        <div className="space-y-1.5">
          <label className="font-semibold text-[#101828]">Hospital / Health System Name</label>
          <input
            type="text"
            required
            value={hospitalName}
            onChange={(e) => setHospitalName(e.target.value)}
            className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 bg-[#F8FAFC] text-[#1E293B] focus:bg-white focus:outline-none focus:border-[#2F65F6]"
          />
        </div>

        <div className="space-y-1.5">
          <label className="font-semibold text-[#101828]">Official Tagline / Mission</label>
          <input
            type="text"
            value={tagline}
            onChange={(e) => setTagline(e.target.value)}
            className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 bg-[#F8FAFC] text-[#1E293B] focus:bg-white focus:outline-none focus:border-[#2F65F6]"
          />
        </div>

        <div className="space-y-1.5">
          <label className="font-semibold text-[#101828]">Primary Administration Email</label>
          <input
            type="email"
            required
            value={adminEmail}
            onChange={(e) => setAdminEmail(e.target.value)}
            className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 bg-[#F8FAFC] text-[#1E293B] focus:bg-white focus:outline-none focus:border-[#2F65F6]"
          />
        </div>

        <div className="space-y-1.5">
          <label className="font-semibold text-[#101828]">Emergency Response Hotline (24/7)</label>
          <input
            type="text"
            required
            value={emergencyPhone}
            onChange={(e) => setEmergencyPhone(e.target.value)}
            className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 bg-[#F8FAFC] text-rose-600 font-bold focus:bg-white focus:outline-none focus:border-[#2F65F6]"
          />
        </div>

        <div className="space-y-1.5">
          <label className="font-semibold text-[#101828]">General Patient Support Phone</label>
          <input
            type="text"
            value={supportPhone}
            onChange={(e) => setSupportPhone(e.target.value)}
            className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 bg-[#F8FAFC] text-[#1E293B] focus:bg-white focus:outline-none focus:border-[#2F65F6]"
          />
        </div>

        <div className="space-y-1.5">
          <label className="font-semibold text-[#101828]">Healthcare License & Regulatory ID</label>
          <input
            type="text"
            value={licenseKey}
            onChange={(e) => setLicenseKey(e.target.value)}
            className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 bg-[#F8FAFC] text-[#1E293B] font-mono focus:bg-white focus:outline-none focus:border-[#2F65F6]"
          />
        </div>

        <div className="sm:col-span-2 space-y-1.5">
          <label className="font-semibold text-[#101828]">Physical Facility Location / Address</label>
          <input
            type="text"
            value={facilityAddress}
            onChange={(e) => setFacilityAddress(e.target.value)}
            className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 bg-[#F8FAFC] text-[#1E293B] focus:bg-white focus:outline-none focus:border-[#2F65F6]"
          />
        </div>

        <div className="space-y-1.5">
          <label className="font-semibold text-[#101828]">Default System Currency</label>
          <select
            value={defaultCurrency}
            onChange={(e) => setDefaultCurrency(e.target.value)}
            className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 bg-[#F8FAFC] text-[#1E293B] focus:bg-white focus:outline-none focus:border-[#2F65F6]"
          >
            <option>USD ($)</option>
            <option>BDT (৳)</option>
            <option>EUR (€)</option>
            <option>GBP (£)</option>
            <option>CAD ($)</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="font-semibold text-[#101828]">Operational Timezone</label>
          <select
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
            className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 bg-[#F8FAFC] text-[#1E293B] focus:bg-white focus:outline-none focus:border-[#2F65F6]"
          >
            <option>Asia/Dhaka (GMT+6)</option>
            <option>UTC (Coordinated Universal Time)</option>
            <option>America/New_York (EST/EDT)</option>
            <option>Europe/London (GMT/BST)</option>
          </select>
        </div>
      </div>
    </div>
  );
}

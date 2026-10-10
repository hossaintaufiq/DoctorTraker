"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { useDoctorTracker } from "@/context/DoctorTrackerContext";
import {
  Building2,
  Shield,
  Bell,
  Lock,
  Save,
  CheckCircle2,
  User,
  Globe,
  Database,
  Sliders,
} from "lucide-react";

export default function SettingsPage() {
  const { showToast } = useDoctorTracker();

  const [orgName, setOrgName] = useState("Medcare Healthcare Center");
  const [adminEmail, setAdminEmail] = useState("admin@medcare.com");
  const [licenseKey, setLicenseKey] = useState("MC-2026-MED-9941");
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [triageAlerts, setTriageAlerts] = useState(true);
  const [autoBackup, setAutoBackup] = useState(true);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    showToast("Settings Saved", "Medcare system preferences updated successfully.", "success");
  };

  return (
    <AppShell breadcrumbTitle="Setting" parentLabel="Workspace" parentPath="/dashboard">
      <div className="space-y-6 max-w-4xl">
        {/* Header */}
        <div className="pb-2">
          <h1 className="text-2xl sm:text-[28px] font-bold text-[#101828] tracking-tight">
            Settings & Hospital Preferences
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] mt-1">
            Manage your organization profile, notifications, security protocols, and clinical parameters.
          </p>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          {/* Organization Information */}
          <div className="bg-white rounded-3xl border border-[#EBF0F7] p-6 card-shadow space-y-5">
            <div className="flex items-center gap-3 pb-3.5 border-b border-[#EBF0F7]">
              <div className="w-10 h-10 rounded-2xl bg-[#EBF3FE] text-[#2F65F6] flex items-center justify-center border border-[#DCE8FC]">
                <Building2 className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#101828]">Healthcare Organization Details</h3>
                <p className="text-xs text-[#64748B]">Facility metadata and regulatory licensing</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-semibold text-[#101828]">Organization Name</label>
                <input
                  type="text"
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-full border border-[#EBF0F7] bg-[#F4F7FB] text-[#1E293B] focus:bg-white focus:outline-none focus:border-[#2F65F6] transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-[#101828]">Primary Administrative Email</label>
                <input
                  type="email"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-full border border-[#EBF0F7] bg-[#F4F7FB] text-[#1E293B] focus:bg-white focus:outline-none focus:border-[#2F65F6] transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-[#101828]">Medical License ID</label>
                <input
                  type="text"
                  value={licenseKey}
                  onChange={(e) => setLicenseKey(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-full border border-[#EBF0F7] bg-[#F4F7FB] text-[#1E293B] font-mono focus:bg-white focus:outline-none focus:border-[#2F65F6] transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-[#101828]">Default Clinical Timezone</label>
                <select className="w-full px-4 py-2.5 rounded-full border border-[#EBF0F7] bg-[#F4F7FB] text-[#1E293B] focus:bg-white focus:outline-none focus:border-[#2F65F6] transition-all">
                  <option>Asia/Dhaka (GMT+6)</option>
                  <option>UTC (Coordinated Universal Time)</option>
                  <option>America/New_York (EST)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Notification Preferences */}
          <div className="bg-white rounded-3xl border border-[#EBF0F7] p-6 card-shadow space-y-5">
            <div className="flex items-center gap-3 pb-3.5 border-b border-[#EBF0F7]">
              <div className="w-10 h-10 rounded-2xl bg-[#EBF3FE] text-[#2F65F6] flex items-center justify-center border border-[#DCE8FC]">
                <Bell className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#101828]">Notification & Alert Settings</h3>
                <p className="text-xs text-[#64748B]">Manage real-time push alerts and clinical email digests</p>
              </div>
            </div>

            <div className="space-y-3">
              <label className="flex items-center justify-between p-4 rounded-2xl bg-[#F4F7FB] border border-[#EBF0F7] cursor-pointer hover:bg-[#EEF2F6] transition-colors">
                <div>
                  <p className="text-xs font-semibold text-[#101828]">Email Notifications for New Patient Registrations</p>
                  <p className="text-[11px] text-[#64748B]">Send intake summaries to attending doctors upon chart creation</p>
                </div>
                <input
                  type="checkbox"
                  checked={emailAlerts}
                  onChange={(e) => setEmailAlerts(e.target.checked)}
                  className="w-4 h-4 accent-[#2F65F6] rounded"
                />
              </label>

              <label className="flex items-center justify-between p-4 rounded-2xl bg-[#F4F7FB] border border-[#EBF0F7] cursor-pointer hover:bg-[#EEF2F6] transition-colors">
                <div>
                  <p className="text-xs font-semibold text-[#101828]">Emergency Triage Alerts</p>
                  <p className="text-[11px] text-[#64748B]">High-priority visual indicators for critical patient classifications</p>
                </div>
                <input
                  type="checkbox"
                  checked={triageAlerts}
                  onChange={(e) => setTriageAlerts(e.target.checked)}
                  className="w-4 h-4 accent-[#2F65F6] rounded"
                />
              </label>

              <label className="flex items-center justify-between p-4 rounded-2xl bg-[#F4F7FB] border border-[#EBF0F7] cursor-pointer hover:bg-[#EEF2F6] transition-colors">
                <div>
                  <p className="text-xs font-semibold text-[#101828]">Automated Cloud Telemetry Backup</p>
                  <p className="text-[11px] text-[#64748B]">Nightly encrypted backups of doctor schedules & patient logs</p>
                </div>
                <input
                  type="checkbox"
                  checked={autoBackup}
                  onChange={(e) => setAutoBackup(e.target.checked)}
                  className="w-4 h-4 accent-[#2F65F6] rounded"
                />
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 text-xs sm:text-sm font-semibold text-white bg-[#2F65F6] hover:bg-[#1E4FD8] rounded-full shadow-xs transition-all"
            >
              <Save className="w-4 h-4" />
              <span>Save Configuration</span>
            </button>
          </div>
        </form>
      </div>
    </AppShell>
  );
}

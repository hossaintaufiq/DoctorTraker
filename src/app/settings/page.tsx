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
} from "lucide-react";

export default function SettingsPage() {
  const { showToast } = useDoctorTracker();

  const [orgName, setOrgName] = useState("Care Guide BD Medical Center");
  const [adminEmail, setAdminEmail] = useState("admin@careguide.bd");
  const [licenseKey, setLicenseKey] = useState("CGBD-2026-MED-9941");
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [triageAlerts, setTriageAlerts] = useState(true);
  const [autoBackup, setAutoBackup] = useState(true);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    showToast("Settings Saved", "Healthcare organization preferences updated successfully.", "success");
  };

  return (
    <AppShell breadcrumbTitle="Settings" parentLabel="Workspace" parentPath="/dashboard">
      <div className="space-y-6 max-w-4xl">
        {/* Header */}
        <div className="pb-4 border-b border-[#E8EDF3]/60">
          <h1 className="text-2xl sm:text-[26px] font-bold text-[#172B4D] tracking-tight">
            Settings & Hospital Preferences
          </h1>
          <p className="text-xs sm:text-sm text-[#7A8798] mt-1">
            Manage your organization profile, notifications, security protocols, and operational parameters.
          </p>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          {/* Organization Information */}
          <div className="bg-white rounded-2xl border border-[#E8EDF3] p-6 card-shadow space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-[#F0F4F8]">
              <Building2 className="w-5 h-5 text-[#0F9F9A]" />
              <div>
                <h3 className="text-sm font-bold text-[#172B4D]">Healthcare Organization Details</h3>
                <p className="text-xs text-[#7A8798]">Hospital facility metadata and regulatory licensing</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-semibold text-[#172B4D]">Organization Name</label>
                <input
                  type="text"
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E8EDF3] bg-[#F7F9FC] text-[#243247] focus:bg-white focus:outline-none focus:border-[#0F9F9A]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-[#172B4D]">Primary Administrative Email</label>
                <input
                  type="email"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E8EDF3] bg-[#F7F9FC] text-[#243247] focus:bg-white focus:outline-none focus:border-[#0F9F9A]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-[#172B4D]">Medical License ID</label>
                <input
                  type="text"
                  value={licenseKey}
                  onChange={(e) => setLicenseKey(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E8EDF3] bg-[#F7F9FC] text-[#243247] font-mono focus:bg-white focus:outline-none focus:border-[#0F9F9A]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-[#172B4D]">Default Clinical Timezone</label>
                <select className="w-full px-3.5 py-2 rounded-xl border border-[#E8EDF3] bg-[#F7F9FC] text-[#243247] focus:bg-white focus:outline-none focus:border-[#0F9F9A]">
                  <option>Asia/Dhaka (GMT+6)</option>
                  <option>UTC (Coordinated Universal Time)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Notification Preferences */}
          <div className="bg-white rounded-2xl border border-[#E8EDF3] p-6 card-shadow space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-[#F0F4F8]">
              <Bell className="w-5 h-5 text-[#0F9F9A]" />
              <div>
                <h3 className="text-sm font-bold text-[#172B4D]">Notification & Alert Settings</h3>
                <p className="text-xs text-[#7A8798]">Manage real-time push alerts and clinical email digests</p>
              </div>
            </div>

            <div className="space-y-3">
              <label className="flex items-center justify-between p-3 rounded-xl bg-[#F7F9FC] border border-[#E8EDF3]/60 cursor-pointer">
                <div>
                  <p className="text-xs font-semibold text-[#172B4D]">Email Notifications for New Patient Registrations</p>
                  <p className="text-[11px] text-[#7A8798]">Send intake summaries to attending doctors upon chart creation</p>
                </div>
                <input
                  type="checkbox"
                  checked={emailAlerts}
                  onChange={(e) => setEmailAlerts(e.target.checked)}
                  className="w-4 h-4 accent-[#0F9F9A] rounded"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-[#F7F9FC] border border-[#E8EDF3]/60 cursor-pointer">
                <div>
                  <p className="text-xs font-semibold text-[#172B4D]">Emergency Triage Alerts</p>
                  <p className="text-[11px] text-[#7A8798]">High-priority visual indicators for critical patient classifications</p>
                </div>
                <input
                  type="checkbox"
                  checked={triageAlerts}
                  onChange={(e) => setTriageAlerts(e.target.checked)}
                  className="w-4 h-4 accent-[#0F9F9A] rounded"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-[#F7F9FC] border border-[#E8EDF3]/60 cursor-pointer">
                <div>
                  <p className="text-xs font-semibold text-[#172B4D]">Automated Cloud Telemetry Backup</p>
                  <p className="text-[11px] text-[#7A8798]">Nightly encrypted backups of doctor schedules & patient logs</p>
                </div>
                <input
                  type="checkbox"
                  checked={autoBackup}
                  onChange={(e) => setAutoBackup(e.target.checked)}
                  className="w-4 h-4 accent-[#0F9F9A] rounded"
                />
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 text-xs sm:text-sm font-semibold text-white bg-[#0F9F9A] hover:bg-[#0B7F7A] rounded-xl shadow-xs transition-all"
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

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
  CreditCard,
  Stethoscope,
  Key,
  Download,
  Upload,
  RotateCcw,
  Sparkles,
  Smartphone,
  Mail,
  Flame,
  AlertTriangle,
  HardDrive,
  Cpu,
  Layers,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ActiveSession {
  id: string;
  user: string;
  role: string;
  ip: string;
  location: string;
  device: string;
  time: string;
  status: "Active" | "Idle";
}

const ACTIVE_SESSIONS: ActiveSession[] = [
  { id: "SES-991", user: "Sullivan (Owner)", role: "Master Admin", ip: "192.168.1.10", location: "Admin Terminal 01", device: "Chrome / Windows 11", time: "Active now", status: "Active" },
  { id: "SES-992", user: "Dr. Sarah Ahmed", role: "Chief Cardiologist", ip: "192.168.1.42", location: "Chamber 304", device: "Safari / macOS", time: "8 mins ago", status: "Active" },
  { id: "SES-993", user: "Clara Oswald", role: "Head Pharmacist", ip: "192.168.1.88", location: "Pharmacy Counter A", device: "Firefox / Linux", time: "22 mins ago", status: "Idle" },
  { id: "SES-994", user: "Billing Desk 02", role: "Accountant", ip: "192.168.1.104", location: "Billing Terminal", device: "Edge / Windows 10", time: "12 mins ago", status: "Active" },
];

type SettingsTab =
  | "General"
  | "Clinical"
  | "Billing"
  | "Security"
  | "Notifications"
  | "Backup";

export default function SettingsPage() {
  const { showToast, addActivityLog, setIsLogsModalOpen } = useDoctorTracker();

  const [activeTab, setActiveTab] = useState<SettingsTab>("General");
  const [sessions, setSessions] = useState<ActiveSession[]>(ACTIVE_SESSIONS);

  const handleTerminateSession = (id: string, user: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== id));
    addActivityLog("Security", "User Session Terminated", `Revoked active token for ${user}.`, "Warning");
    showToast("Session Terminated", `Revoked credentials for ${user}.`, "info");
  };

  // Tab 1: General & Hospital Branding
  const [hospitalName, setHospitalName] = useState("Doctor Tracker Medical Center");
  const [tagline, setTagline] = useState("Excellence in Clinical Care & Patient Recovery");
  const [adminEmail, setAdminEmail] = useState("admin@doctortracker.health");
  const [emergencyPhone, setEmergencyPhone] = useState("+880 2 988-1234");
  const [supportPhone, setSupportPhone] = useState("+880 1711-000000");
  const [licenseKey, setLicenseKey] = useState("MED-2026-BD-88392");
  const [facilityAddress, setFacilityAddress] = useState("Plot 14, Block B, Medical Zone, Dhaka 1212");
  const [defaultCurrency, setDefaultCurrency] = useState("USD ($)");
  const [timezone, setTimezone] = useState("Asia/Dhaka (GMT+6)");
  const [dateFormat, setDateFormat] = useState("DD/MM/YYYY");

  // Tab 2: Clinical & Ward Configuration
  const [consultationDuration, setConsultationDuration] = useState("20");
  const [autoAllocateBeds, setAutoAllocateBeds] = useState(true);
  const [enforcePrescriptionPin, setEnforcePrescriptionPin] = useState(true);
  const [allowOverbooking, setAllowOverbooking] = useState(false);
  const [overbookingLimit, setOverbookingLimit] = useState("10");
  const [dischargeChecklistEnforced, setDischargeChecklistEnforced] = useState(true);
  const [triageAlertAudio, setTriageAlertAudio] = useState(true);

  // Tab 3: Financial & Billing Parameters
  const [defaultTaxRate, setDefaultTaxRate] = useState("5.00");
  const [defaultCoPay, setDefaultCoPay] = useState("15.00");
  const [invoicePrefix, setInvoicePrefix] = useState("INV-2026");
  const [paymentGracePeriod, setPaymentGracePeriod] = useState("14");
  const [autoGenerateReceipt, setAutoGenerateReceipt] = useState(true);
  const [maxDiscountAllowed, setMaxDiscountAllowed] = useState("25");

  // Tab 4: Security & Access Control
  const [twoFactorAuth, setTwoFactorAuth] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState("30");
  const [ipWhitelisting, setIpWhitelisting] = useState(false);
  const [patientDataEncryption, setPatientDataEncryption] = useState(true);
  const [auditLogRetentionDays, setAuditLogRetentionDays] = useState("365");
  const [doctorDirectAccessToBilling, setDoctorDirectAccessToBilling] = useState(false);

  // Tab 5: Notifications & Communications
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsPatientReminders, setSmsPatientReminders] = useState(true);
  const [smsGatewayProvider, setSmsGatewayProvider] = useState("Twilio Healthcare API");
  const [smtpServer, setSmtpServer] = useState("smtp.sendgrid.net (Port 587)");
  const [dailyDigestEmail, setDailyDigestEmail] = useState(true);

  // Tab 6: System Backup & Maintenance
  const [autoCloudBackup, setAutoCloudBackup] = useState(true);
  const [backupFrequency, setBackupFrequency] = useState("Daily at 00:00 UTC");
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  const handleSaveConfiguration = (e: React.FormEvent) => {
    e.preventDefault();
    addActivityLog(
      "Security",
      "Hospital Global Settings Updated",
      `Saved configuration parameters under tab: ${activeTab}.`,
      "Success"
    );
    showToast(
      "Configuration Saved",
      "All hospital master preferences have been persisted and synchronized.",
      "success"
    );
  };

  const handleExportBackupSnapshot = () => {
    const configSnapshot = {
      systemVersion: "2.4.0-PRO",
      exportTimestamp: new Date().toISOString(),
      organization: {
        hospitalName,
        tagline,
        adminEmail,
        emergencyPhone,
        supportPhone,
        licenseKey,
        facilityAddress,
        defaultCurrency,
        timezone,
        dateFormat,
      },
      clinical: {
        consultationDuration,
        autoAllocateBeds,
        enforcePrescriptionPin,
        allowOverbooking,
        overbookingLimit,
        dischargeChecklistEnforced,
        triageAlertAudio,
      },
      billing: {
        defaultTaxRate,
        defaultCoPay,
        invoicePrefix,
        paymentGracePeriod,
        autoGenerateReceipt,
        maxDiscountAllowed,
      },
      security: {
        twoFactorAuth,
        sessionTimeout,
        ipWhitelisting,
        patientDataEncryption,
        auditLogRetentionDays,
        doctorDirectAccessToBilling,
      },
      notifications: {
        emailAlerts,
        smsPatientReminders,
        smsGatewayProvider,
        smtpServer,
        dailyDigestEmail,
      },
      backup: {
        autoCloudBackup,
        backupFrequency,
        maintenanceMode,
      },
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(configSnapshot, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `medcare_master_config_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    addActivityLog("Security", "Master Configuration Exported", "Admin downloaded JSON backup snapshot.", "Info");
    showToast("Snapshot Exported", "Master settings backup downloaded as JSON.", "success");
  };

  const handleResetDefaults = () => {
    setHospitalName("Doctor Tracker Medical Center");
    setTagline("Excellence in Clinical Care & Patient Recovery");
    setConsultationDuration("20");
    setDefaultTaxRate("5.00");
    setTwoFactorAuth(true);
    setSessionTimeout("30");
    setEmailAlerts(true);
    setSmsPatientReminders(true);
    setAutoCloudBackup(true);
    setMaintenanceMode(false);
    showToast("Defaults Restored", "Configuration reset to hospital factory settings.", "info");
  };

  return (
    <AppShell breadcrumbTitle="Setting" parentLabel="Menu" parentPath="/dashboard">
      <div className="space-y-6 max-w-5xl">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
          <div>
            <h1 className="text-2xl sm:text-[28px] font-bold text-[#101828] tracking-tight">
              Hospital Master Settings & Admin Configuration
            </h1>
            <p className="text-xs text-[#64748B] mt-1">
              Complete administrative control over hospital profile, clinical rules, billing parameters, security, and cloud telemetry.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              type="button"
              onClick={handleExportBackupSnapshot}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-full shadow-2xs transition-all"
              title="Download Settings JSON"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export JSON</span>
            </button>

            <button
              type="button"
              onClick={handleResetDefaults}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 bg-[#F8FAFC] border border-slate-200 rounded-full transition-all"
              title="Reset Defaults"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation Navigation Bar */}
        <div className="bg-white rounded-3xl border border-[#EBF0F7] p-2 card-shadow flex items-center gap-1.5 overflow-x-auto">
          {[
            { id: "General", label: "Hospital Profile", icon: Building2 },
            { id: "Clinical", label: "Clinical & Wards", icon: Stethoscope },
            { id: "Billing", label: "Billing & Invoices", icon: CreditCard },
            { id: "Security", label: "Security & Roles", icon: Shield },
            { id: "Notifications", label: "Notifications", icon: Bell },
            { id: "Backup", label: "Backups & Telemetry", icon: HardDrive },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as SettingsTab)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shrink-0",
                  isActive
                    ? "bg-[#2F65F6] text-white shadow-xs"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                )}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Main Settings Form Container */}
        <form onSubmit={handleSaveConfiguration} className="space-y-6">
          {/* TAB 1: General & Hospital Profile */}
          {activeTab === "General" && (
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
          )}

          {/* TAB 2: Clinical & Ward Configuration */}
          {activeTab === "Clinical" && (
            <div className="bg-white rounded-3xl border border-[#EBF0F7] p-6 sm:p-8 card-shadow space-y-6 animate-fade-in">
              <div className="flex items-center gap-3 pb-4 border-b border-[#EBF0F7]">
                <div className="w-11 h-11 rounded-2xl bg-[#ECFDF5] text-[#10B981] flex items-center justify-center border border-[#D1FAE5]">
                  <Stethoscope className="w-5 h-5 stroke-[2.2]" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#101828]">Clinical Protocols & Ward Operations</h3>
                  <p className="text-xs text-[#64748B]">Consultation duration limits, ICU bed distribution, and triage rules</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1.5">
                  <label className="font-semibold text-[#101828]">Standard Consultation Duration</label>
                  <select
                    value={consultationDuration}
                    onChange={(e) => setConsultationDuration(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 bg-[#F8FAFC] text-[#1E293B] focus:bg-white focus:outline-none focus:border-[#2F65F6]"
                  >
                    <option value="15">15 Minutes / Slot</option>
                    <option value="20">20 Minutes / Slot (Recommended)</option>
                    <option value="30">30 Minutes / Slot</option>
                    <option value="45">45 Minutes / Slot</option>
                    <option value="60">60 Minutes / Slot</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-[#101828]">Max Emergency Overbooking Margin (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="50"
                    value={overbookingLimit}
                    onChange={(e) => setOverbookingLimit(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 bg-[#F8FAFC] text-[#1E293B] focus:bg-white focus:outline-none focus:border-[#2F65F6]"
                  />
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <label className="flex items-center justify-between p-4 rounded-2xl bg-[#F8FAFC] border border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors">
                  <div>
                    <p className="text-xs font-bold text-[#101828]">Automatic ICU & Ward Bed Allocation</p>
                    <p className="text-[11px] text-[#64748B]">
                      Auto-assign available ward bed upon emergency doctor admission approval
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={autoAllocateBeds}
                    onChange={(e) => setAutoAllocateBeds(e.target.checked)}
                    className="w-4 h-4 accent-[#2F65F6] rounded"
                  />
                </label>

                <label className="flex items-center justify-between p-4 rounded-2xl bg-[#F8FAFC] border border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors">
                  <div>
                    <p className="text-xs font-bold text-[#101828]">Require Doctor PIN for Controlled Pharmacy Prescriptions</p>
                    <p className="text-[11px] text-[#64748B]">
                      Strict 4-digit electronic signature required before releasing scheduled narcotics
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={enforcePrescriptionPin}
                    onChange={(e) => setEnforcePrescriptionPin(e.target.checked)}
                    className="w-4 h-4 accent-[#2F65F6] rounded"
                  />
                </label>

                <label className="flex items-center justify-between p-4 rounded-2xl bg-[#F8FAFC] border border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors">
                  <div>
                    <p className="text-xs font-bold text-[#101828]">Mandatory Multi-Discipline Inpatient Discharge Checklist</p>
                    <p className="text-[11px] text-[#64748B]">
                      Prevents billing closure until attending physician and pharmacy sign off
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={dischargeChecklistEnforced}
                    onChange={(e) => setDischargeChecklistEnforced(e.target.checked)}
                    className="w-4 h-4 accent-[#2F65F6] rounded"
                  />
                </label>

                <label className="flex items-center justify-between p-4 rounded-2xl bg-[#F8FAFC] border border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors">
                  <div>
                    <p className="text-xs font-bold text-rose-700">Audio Siren for Critical Triage Score Intake</p>
                    <p className="text-[11px] text-[#64748B]">
                      Play audible workstation siren when a Level-1 trauma case is entered
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={triageAlertAudio}
                    onChange={(e) => setTriageAlertAudio(e.target.checked)}
                    className="w-4 h-4 accent-rose-600 rounded"
                  />
                </label>
              </div>
            </div>
          )}

          {/* TAB 3: Financial & Billing Parameters */}
          {activeTab === "Billing" && (
            <div className="bg-white rounded-3xl border border-[#EBF0F7] p-6 sm:p-8 card-shadow space-y-6 animate-fade-in">
              <div className="flex items-center gap-3 pb-4 border-b border-[#EBF0F7]">
                <div className="w-11 h-11 rounded-2xl bg-[#EFF6FF] text-[#2F65F6] flex items-center justify-center border border-[#DBEAFE]">
                  <CreditCard className="w-5 h-5 stroke-[2.2]" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#101828]">Financial, Tariff & Invoice Rules</h3>
                  <p className="text-xs text-[#64748B]">Tax rates, insurance co-pay thresholds, invoice prefixes, and settlement grace periods</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1.5">
                  <label className="font-semibold text-[#101828]">Default VAT / Government Health Tax (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={defaultTaxRate}
                    onChange={(e) => setDefaultTaxRate(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 bg-[#F8FAFC] text-[#1E293B] focus:bg-white focus:outline-none focus:border-[#2F65F6]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-[#101828]">Default Insurance Co-Pay Deductible (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={defaultCoPay}
                    onChange={(e) => setDefaultCoPay(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 bg-[#F8FAFC] text-[#1E293B] focus:bg-white focus:outline-none focus:border-[#2F65F6]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-[#101828]">Invoice Code Sequential Prefix</label>
                  <input
                    type="text"
                    value={invoicePrefix}
                    onChange={(e) => setInvoicePrefix(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 bg-[#F8FAFC] font-mono text-[#1E293B] focus:bg-white focus:outline-none focus:border-[#2F65F6]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-[#101828]">Payment Grace Period (Days)</label>
                  <input
                    type="number"
                    value={paymentGracePeriod}
                    onChange={(e) => setPaymentGracePeriod(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 bg-[#F8FAFC] text-[#1E293B] focus:bg-white focus:outline-none focus:border-[#2F65F6]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-[#101828]">Maximum Discretionary Discount (%)</label>
                  <input
                    type="number"
                    max="100"
                    value={maxDiscountAllowed}
                    onChange={(e) => setMaxDiscountAllowed(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 bg-[#F8FAFC] text-[#1E293B] focus:bg-white focus:outline-none focus:border-[#2F65F6]"
                  />
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-center justify-between p-4 rounded-2xl bg-[#F8FAFC] border border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors">
                  <div>
                    <p className="text-xs font-bold text-[#101828]">Auto-Generate Payment Receipt on Paid Invoices</p>
                    <p className="text-[11px] text-[#64748B]">
                      Immediately trigger POS digital payment voucher and SMS confirmation to patient
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={autoGenerateReceipt}
                    onChange={(e) => setAutoGenerateReceipt(e.target.checked)}
                    className="w-4 h-4 accent-[#2F65F6] rounded"
                  />
                </label>
              </div>
            </div>
          )}

          {/* TAB 4: Security, Access & Admin Control */}
          {activeTab === "Security" && (
            <div className="space-y-6 animate-fade-in">
              {/* Top Security & Admin Control Bar */}
              <div className="bg-white rounded-3xl border border-[#EBF0F7] p-6 sm:p-8 card-shadow space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#EBF0F7]">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-[#FEF2F2] text-[#EF4444] flex items-center justify-center border border-[#FECACA]">
                      <Shield className="w-5 h-5 stroke-[2.2]" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-[#101828]">Master Admin & System Security Control</h3>
                      <p className="text-xs text-[#64748B]">Active staff sessions, RBAC permissions, live server telemetry, and compliance audits</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsLogsModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#2F65F6] hover:bg-[#1E4FD8] rounded-full shadow-xs transition-all self-start sm:self-auto"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Open System Audit Logs</span>
                  </button>
                </div>

                {/* System Health Telemetry Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-[#F8FAFC] rounded-2xl border border-slate-200/80 p-4 flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-[#EBF3FE] text-[#2F65F6] flex items-center justify-center shrink-0">
                      <Cpu className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] text-[#94A3B8] font-bold uppercase tracking-wider">API Gateway</span>
                      <p className="text-base font-bold text-[#101828]">99.99% Uptime</p>
                      <span className="text-[10px] text-[#10B981] font-semibold">Latency: 24ms &bull; SSL Active</span>
                    </div>
                  </div>

                  <div className="bg-[#F8FAFC] rounded-2xl border border-slate-200/80 p-4 flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-[#ECFDF5] text-[#10B981] flex items-center justify-center shrink-0">
                      <Database className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] text-[#94A3B8] font-bold uppercase tracking-wider">Database Cluster</span>
                      <p className="text-base font-bold text-[#101828]">Atlas Sync Online</p>
                      <span className="text-[10px] text-[#64748B]">Continuous Live Replication</span>
                    </div>
                  </div>

                  <div className="bg-[#F8FAFC] rounded-2xl border border-slate-200/80 p-4 flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-[#FEF3C7] text-[#D97706] flex items-center justify-center shrink-0">
                      <Key className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] text-[#94A3B8] font-bold uppercase tracking-wider">Active Staff Logins</span>
                      <p className="text-base font-bold text-[#101828]">{sessions.length} Authorized</p>
                      <span className="text-[10px] text-[#10B981] font-semibold">2FA Enforced</span>
                    </div>
                  </div>
                </div>

                {/* Policies & Parameters */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
                  <div className="space-y-1.5">
                    <label className="font-semibold text-[#101828]">Admin Session Inactivity Timeout</label>
                    <select
                      value={sessionTimeout}
                      onChange={(e) => setSessionTimeout(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 bg-[#F8FAFC] text-[#1E293B] focus:bg-white focus:outline-none focus:border-[#2F65F6]"
                    >
                      <option value="15">15 Minutes of Inactivity</option>
                      <option value="30">30 Minutes (Recommended)</option>
                      <option value="60">1 Hour</option>
                      <option value="240">4 Hours</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-semibold text-[#101828]">Audit Trail Log Retention Period</label>
                    <select
                      value={auditLogRetentionDays}
                      onChange={(e) => setAuditLogRetentionDays(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 bg-[#F8FAFC] text-[#1E293B] focus:bg-white focus:outline-none focus:border-[#2F65F6]"
                    >
                      <option value="90">90 Days</option>
                      <option value="180">180 Days</option>
                      <option value="365">1 Year (HIPAA Compliant)</option>
                      <option value="1825">5 Years (Permanent Archive)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <label className="flex items-center justify-between p-4 rounded-2xl bg-[#F8FAFC] border border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors">
                    <div>
                      <p className="text-xs font-bold text-[#101828]">Enforce Multi-Factor Authentication (2FA)</p>
                      <p className="text-[11px] text-[#64748B]">
                        Mandatory Google Authenticator / SMS code for all administrative and medical staff
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={twoFactorAuth}
                      onChange={(e) => setTwoFactorAuth(e.target.checked)}
                      className="w-4 h-4 accent-[#2F65F6] rounded"
                    />
                  </label>

                  <label className="flex items-center justify-between p-4 rounded-2xl bg-[#F8FAFC] border border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors">
                    <div>
                      <p className="text-xs font-bold text-[#101828]">AES-256 GCM Patient Record Encryption</p>
                      <p className="text-[11px] text-[#64748B]">
                        Encrypt diagnosis notes, lab attachments, and personal IDs at rest
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={patientDataEncryption}
                      onChange={(e) => setPatientDataEncryption(e.target.checked)}
                      className="w-4 h-4 accent-[#2F65F6] rounded"
                    />
                  </label>

                  <label className="flex items-center justify-between p-4 rounded-2xl bg-[#F8FAFC] border border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors">
                    <div>
                      <p className="text-xs font-bold text-[#101828]">Hospital Subnet IP Whitelisting</p>
                      <p className="text-[11px] text-[#64748B]">
                        Restrict admin panel modifications strictly to authorized hospital network gateways
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={ipWhitelisting}
                      onChange={(e) => setIpWhitelisting(e.target.checked)}
                      className="w-4 h-4 accent-[#2F65F6] rounded"
                    />
                  </label>
                </div>
              </div>

              {/* Active Staff Sessions Table */}
              <div className="bg-white rounded-3xl border border-[#EBF0F7] p-6 sm:p-8 card-shadow space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-[#101828]">Active Administrative & Staff Sessions</h3>
                    <p className="text-xs text-[#64748B]">Real-time session watcher with remote revocation authority</p>
                  </div>
                  <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-[11px] font-bold rounded-full border border-emerald-200">
                    {sessions.length} Live Sessions
                  </span>
                </div>

                <div className="overflow-x-auto -mx-6 sm:-mx-8">
                  <table className="w-full text-left border-collapse min-w-[650px]">
                    <thead>
                      <tr className="text-[11px] font-semibold text-[#94A3B8] uppercase border-b border-[#F1F5F9]">
                        <th className="py-3 px-6 sm:px-8">User Account</th>
                        <th className="py-3 px-4">Role / Scope</th>
                        <th className="py-3 px-4">IP Address</th>
                        <th className="py-3 px-4">Location / Terminal</th>
                        <th className="py-3 px-4">Device & Client</th>
                        <th className="py-3 px-6 sm:px-8 text-right">Revoke Session</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F1F5F9] text-xs">
                      {sessions.map((s) => (
                        <tr key={s.id} className="hover:bg-[#F8FAFC] transition-colors">
                          <td className="py-3.5 px-6 sm:px-8">
                            <div className="font-bold text-[#101828] flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                              <span>{s.user}</span>
                            </div>
                            <span className="text-[10px] text-slate-400 font-mono block mt-0.5">{s.id}</span>
                          </td>

                          <td className="py-3.5 px-4">
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-[#2F65F6] border border-blue-100">
                              {s.role}
                            </span>
                          </td>

                          <td className="py-3.5 px-4 font-mono text-slate-600">{s.ip}</td>
                          <td className="py-3.5 px-4 text-slate-700 font-medium">{s.location}</td>
                          <td className="py-3.5 px-4 text-slate-500">{s.device}</td>

                          <td className="py-3.5 px-6 sm:px-8 text-right">
                            <button
                              type="button"
                              onClick={() => handleTerminateSession(s.id, s.user)}
                              className="px-3 py-1 bg-rose-50 hover:bg-rose-100 text-rose-600 font-semibold rounded-full border border-rose-200 transition-all text-xs"
                            >
                              Terminate
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* System Role Permission Matrix Card */}
              <div className="bg-white rounded-3xl border border-[#EBF0F7] p-6 sm:p-8 card-shadow space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-[#101828]">System Role-Based Access Control (RBAC) Matrix</h3>
                  <p className="text-xs text-[#64748B]">Granular permission definitions for medical and administrative staff tiers</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between font-bold text-slate-900">
                      <span>Master Admin</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 text-[#2F65F6]">Full Access</span>
                    </div>
                    <p className="text-slate-500 text-[11px]">
                      Full read/write permissions across patient charts, doctor appointments, billing adjustments, and security settings.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between font-bold text-slate-900">
                      <span>Doctor / Specialist</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-[#10B981]">Clinical Read/Write</span>
                    </div>
                    <p className="text-slate-500 text-[11px]">
                      Create prescriptions, manage assigned patient queues, update diagnoses, and message patients.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between font-bold text-slate-900">
                      <span>Pharmacy & Billing Staff</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-[#D97706]">Financial & Stock</span>
                    </div>
                    <p className="text-slate-500 text-[11px]">
                      Generate invoice charges, settle payments, dispense pharmaceutical inventory, and print vouchers.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: Notifications & Communications */}
          {activeTab === "Notifications" && (
            <div className="bg-white rounded-3xl border border-[#EBF0F7] p-6 sm:p-8 card-shadow space-y-6 animate-fade-in">
              <div className="flex items-center gap-3 pb-4 border-b border-[#EBF0F7]">
                <div className="w-11 h-11 rounded-2xl bg-[#FEF3C7] text-[#D97706] flex items-center justify-center border border-[#FDE68A]">
                  <Bell className="w-5 h-5 stroke-[2.2]" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#101828]">Notification & Gateway Integration</h3>
                  <p className="text-xs text-[#64748B]">SMS dispatch gateways, SMTP relays, and staff push notification rules</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1.5">
                  <label className="font-semibold text-[#101828]">SMS Gateway Provider</label>
                  <input
                    type="text"
                    value={smsGatewayProvider}
                    onChange={(e) => setSmsGatewayProvider(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 bg-[#F8FAFC] text-[#1E293B] focus:bg-white focus:outline-none focus:border-[#2F65F6]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-[#101828]">SMTP Server Relay Configuration</label>
                  <input
                    type="text"
                    value={smtpServer}
                    onChange={(e) => setSmtpServer(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 bg-[#F8FAFC] text-[#1E293B] focus:bg-white focus:outline-none focus:border-[#2F65F6]"
                  />
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <label className="flex items-center justify-between p-4 rounded-2xl bg-[#F8FAFC] border border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors">
                  <div>
                    <p className="text-xs font-bold text-[#101828]">Automated SMS Reminders to Scheduled Patients</p>
                    <p className="text-[11px] text-[#64748B]">
                      Send automated appointment slot notification 2 hours prior to consultation
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={smsPatientReminders}
                    onChange={(e) => setSmsPatientReminders(e.target.checked)}
                    className="w-4 h-4 accent-[#2F65F6] rounded"
                  />
                </label>

                <label className="flex items-center justify-between p-4 rounded-2xl bg-[#F8FAFC] border border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors">
                  <div>
                    <p className="text-xs font-bold text-[#101828]">Real-time Email Alerts for Patient Discharges</p>
                    <p className="text-[11px] text-[#64748B]">
                      Dispatch itemized billing summary to billing desk and primary physician
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={emailAlerts}
                    onChange={(e) => setEmailAlerts(e.target.checked)}
                    className="w-4 h-4 accent-[#2F65F6] rounded"
                  />
                </label>

                <label className="flex items-center justify-between p-4 rounded-2xl bg-[#F8FAFC] border border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors">
                  <div>
                    <p className="text-xs font-bold text-[#101828]">Daily Operations & Revenue Executive Digest</p>
                    <p className="text-[11px] text-[#64748B]">
                      Send executive clinical summary and revenue KPIs to medical director at 06:00 AM
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={dailyDigestEmail}
                    onChange={(e) => setDailyDigestEmail(e.target.checked)}
                    className="w-4 h-4 accent-[#2F65F6] rounded"
                  />
                </label>
              </div>
            </div>
          )}

          {/* TAB 6: Backups, Telemetry & Maintenance */}
          {activeTab === "Backup" && (
            <div className="bg-white rounded-3xl border border-[#EBF0F7] p-6 sm:p-8 card-shadow space-y-6 animate-fade-in">
              <div className="flex items-center gap-3 pb-4 border-b border-[#EBF0F7]">
                <div className="w-11 h-11 rounded-2xl bg-[#F3E8FF] text-[#9333EA] flex items-center justify-center border border-[#E9D5FF]">
                  <HardDrive className="w-5 h-5 stroke-[2.2]" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#101828]">Cloud Backups, Database Snapshots & System Maintenance</h3>
                  <p className="text-xs text-[#64748B]">Scheduled telemetry sync, manual disaster recovery backups, and maintenance mode</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1.5">
                  <label className="font-semibold text-[#101828]">Automated Backup Schedule</label>
                  <select
                    value={backupFrequency}
                    onChange={(e) => setBackupFrequency(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 bg-[#F8FAFC] text-[#1E293B] focus:bg-white focus:outline-none focus:border-[#2F65F6]"
                  >
                    <option>Daily at 00:00 UTC</option>
                    <option>Every 6 Hours</option>
                    <option>Hourly Telemetry Sync</option>
                    <option>Weekly Full Archive</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-[#101828]">Cloud Storage Target</label>
                  <input
                    type="text"
                    disabled
                    value="AWS S3 Healthcare Vault (Encrypted)"
                    className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 bg-slate-100 text-slate-500 font-medium"
                  />
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <label className="flex items-center justify-between p-4 rounded-2xl bg-[#F8FAFC] border border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors">
                  <div>
                    <p className="text-xs font-bold text-[#101828]">Automated Nightly Cloud Backup</p>
                    <p className="text-[11px] text-[#64748B]">
                      Snapshot doctor rosters, patient records, invoices, and activity logs
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={autoCloudBackup}
                    onChange={(e) => setAutoCloudBackup(e.target.checked)}
                    className="w-4 h-4 accent-[#2F65F6] rounded"
                  />
                </label>

                <label className="flex items-center justify-between p-4 rounded-2xl bg-amber-50/70 border border-amber-200 cursor-pointer hover:bg-amber-100/60 transition-colors">
                  <div>
                    <p className="text-xs font-bold text-amber-900">Hospital System Maintenance Mode</p>
                    <p className="text-[11px] text-amber-700">
                      Temporarily lock non-admin staff access for database migration or ERP updates
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={maintenanceMode}
                    onChange={(e) => setMaintenanceMode(e.target.checked)}
                    className="w-4 h-4 accent-amber-600 rounded"
                  />
                </label>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Instant Full System Data Snapshot</h4>
                  <p className="text-[11px] text-slate-500">Download complete client-side database backup for offline archives.</p>
                </div>

                <button
                  type="button"
                  onClick={handleExportBackupSnapshot}
                  className="px-4 py-2 text-xs font-bold text-[#2F65F6] bg-white border border-[#2F65F6]/30 hover:bg-blue-50 rounded-full shadow-2xs transition-all flex items-center gap-1.5 self-start sm:self-auto"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Backup (.JSON)</span>
                </button>
              </div>
            </div>
          )}

          {/* Persistent Action Footer Bar */}
          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-slate-400">
              Changes applied instantly across all connected terminal workstations.
            </span>

            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 text-xs sm:text-sm font-bold text-white bg-[#2F65F6] hover:bg-[#1E4FD8] rounded-full shadow-xs transition-all"
            >
              <Save className="w-4 h-4" />
              <span>Save & Apply Configuration</span>
            </button>
          </div>
        </form>
      </div>
    </AppShell>
  );
}

"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { useDoctorTracker } from "@/context/DoctorTrackerContext";
import {
  Building2,
  Shield,
  Bell,
  Save,
  CreditCard,
  Stethoscope,
  Download,
  RotateCcw,
  HardDrive,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { GeneralSettingsTab } from "@/components/settings/GeneralSettingsTab";
import { ClinicalSettingsTab } from "@/components/settings/ClinicalSettingsTab";
import { BillingSettingsTab } from "@/components/settings/BillingSettingsTab";
import { SecuritySettingsTab, ActiveSession } from "@/components/settings/SecuritySettingsTab";
import { NotificationsSettingsTab } from "@/components/settings/NotificationsSettingsTab";
import { BackupSettingsTab } from "@/components/settings/BackupSettingsTab";

const INITIAL_SESSIONS: ActiveSession[] = [
  { id: "SES-991", user: "Admin (Owner)", role: "Master Admin", ip: "192.168.1.10", location: "Admin Terminal 01", device: "Chrome / Windows 11", time: "Active now", status: "Active" },
  { id: "SES-992", user: "Dr. Sarah Ahmed", role: "Chief Cardiologist", ip: "192.168.1.42", location: "Chamber 304", device: "Safari / macOS", time: "8 mins ago", status: "Active" },
  { id: "SES-993", user: "Clinical Staff 01", role: "Nurse Supervisor", ip: "192.168.1.88", location: "Triage Counter A", device: "Firefox / Linux", time: "22 mins ago", status: "Idle" },
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
  const {
    showToast,
    addActivityLog,
    setIsLogsModalOpen,
    resetDatabase,
    openConfirmDialog,
  } = useDoctorTracker();

  const [activeTab, setActiveTab] = useState<SettingsTab>("General");
  const [sessions, setSessions] = useState<ActiveSession[]>(INITIAL_SESSIONS);

  // Tab 1: General State
  const [hospitalName, setHospitalName] = useState("Doctor Tracker Medical Center");
  const [tagline, setTagline] = useState("Excellence in Clinical Care & Patient Recovery");
  const [adminEmail, setAdminEmail] = useState("admin@doctortracker.health");
  const [emergencyPhone, setEmergencyPhone] = useState("+880 2 988-1234");
  const [supportPhone, setSupportPhone] = useState("+880 1711-000000");
  const [licenseKey, setLicenseKey] = useState("MED-2026-BD-88392");
  const [facilityAddress, setFacilityAddress] = useState("Plot 14, Block B, Medical Zone, Dhaka 1212");
  const [defaultCurrency, setDefaultCurrency] = useState("USD ($)");
  const [timezone, setTimezone] = useState("Asia/Dhaka (GMT+6)");

  // Tab 2: Clinical State
  const [consultationDuration, setConsultationDuration] = useState("20");
  const [maxPatientsPerSlot, setMaxPatientsPerSlot] = useState("15");
  const [icuTotalBeds, setIcuTotalBeds] = useState("32");
  const [triageSystem, setTriageSystem] = useState("ESI (Emergency Severity Index 5-Tier)");
  const [dischargeChecklistEnforced, setDischargeChecklistEnforced] = useState(true);
  const [triageAlertAudio, setTriageAlertAudio] = useState(true);

  // Tab 3: Billing State
  const [defaultTaxRate, setDefaultTaxRate] = useState("5.0");
  const [defaultCoPay, setDefaultCoPay] = useState("20.0");
  const [invoicePrefix, setInvoicePrefix] = useState("INV-2026-");
  const [paymentGracePeriod, setPaymentGracePeriod] = useState("14");
  const [maxDiscountAllowed, setMaxDiscountAllowed] = useState("15");
  const [autoGenerateReceipt, setAutoGenerateReceipt] = useState(true);

  // Tab 4: Security State
  const [sessionTimeout, setSessionTimeout] = useState("30");
  const [auditLogRetentionDays, setAuditLogRetentionDays] = useState("365");
  const [twoFactorAuth, setTwoFactorAuth] = useState(true);
  const [patientDataEncryption, setPatientDataEncryption] = useState(true);
  const [ipWhitelisting, setIpWhitelisting] = useState(false);

  // Tab 5: Notifications State
  const [smsGatewayProvider, setSmsGatewayProvider] = useState("Twilio / Infobip Telephony Hub");
  const [smtpServer, setSmtpServer] = useState("smtp.sendgrid.net (Port 587 TLS)");
  const [smsPatientReminders, setSmsPatientReminders] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [dailyDigestEmail, setDailyDigestEmail] = useState(true);

  // Tab 6: Backup State
  const [backupFrequency, setBackupFrequency] = useState("Daily at 00:00 UTC");
  const [autoCloudBackup, setAutoCloudBackup] = useState(true);
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  const handleTerminateSession = (id: string, user: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== id));
    addActivityLog("Security", "User Session Terminated", `Revoked active token for ${user}.`, "Warning");
    showToast("Session Terminated", `Revoked credentials for ${user}.`, "info");
  };

  const handlePromptResetDatabase = () => {
    openConfirmDialog({
      title: "Reset Database & Start Fresh",
      itemName: "All MongoDB Collections",
      itemType: "Database Wipe",
      message: "Are you sure you want to reset the database? All records will be reinitialized to fresh seed data.",
      confirmLabel: "Yes, Reset Database",
      destructive: true,
      onConfirm: async () => {
        await resetDatabase();
      },
    });
  };

  const handleSaveConfiguration = (e: React.FormEvent) => {
    e.preventDefault();
    addActivityLog("System", "Hospital Configuration Updated", "Master administrator saved system preferences.", "Info");
    showToast("Settings Saved", "System configuration preferences updated successfully.", "success");
  };

  const handleExportBackupSnapshot = () => {
    const configData = {
      hospitalName,
      tagline,
      adminEmail,
      emergencyPhone,
      supportPhone,
      licenseKey,
      facilityAddress,
      defaultCurrency,
      timezone,
      consultationDuration,
      maxPatientsPerSlot,
      icuTotalBeds,
      defaultTaxRate,
      defaultCoPay,
      invoicePrefix,
      sessionTimeout,
      twoFactorAuth,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(configData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", url);
    downloadAnchor.setAttribute("download", `doctor_tracker_config_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    document.body.removeChild(downloadAnchor);
    URL.revokeObjectURL(url);
    showToast("Snapshot Exported", "Master system config exported to JSON.", "success");
  };

  const handleResetDefaults = () => {
    setHospitalName("Doctor Tracker Medical Center");
    setTagline("Excellence in Clinical Care & Patient Recovery");
    setAdminEmail("admin@doctortracker.health");
    setDefaultCurrency("USD ($)");
    setTimezone("Asia/Dhaka (GMT+6)");
    showToast("Defaults Restored", "Settings restored to baseline defaults.", "info");
  };

  return (
    <AppShell breadcrumbTitle="System Settings">
      <div className="space-y-6 animate-fade-in">
        {/* Header Title & Quick Export */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
          <div>
            <h1 className="text-2xl sm:text-[28px] font-bold text-[#101828] tracking-tight">
              System Settings & Administration
            </h1>
            <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
              Hospital branding, clinical parameters, RBAC permissions, and backup policies.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              type="button"
              onClick={handleExportBackupSnapshot}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-full shadow-2xs transition-all cursor-pointer"
              title="Download Settings JSON"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export JSON</span>
            </button>

            <button
              type="button"
              onClick={handleResetDefaults}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 bg-[#F8FAFC] border border-slate-200 rounded-full transition-all cursor-pointer"
              title="Reset Defaults"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation Subnav Bar */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-[#EBF0F7] p-1.5 sm:p-2 card-shadow grid grid-cols-2 sm:grid-cols-3 lg:flex lg:items-center gap-1.5 sm:gap-2">
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
                  "flex items-center justify-center sm:justify-start gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl text-[11px] sm:text-xs font-bold transition-all shrink-0 cursor-pointer text-center sm:text-left",
                  isActive
                    ? "bg-[#2F65F6] text-white shadow-xs"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                )}
              >
                <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                <span className="truncate">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Main Settings Form Container */}
        <form onSubmit={handleSaveConfiguration} className="space-y-6">
          {activeTab === "General" && (
            <GeneralSettingsTab
              hospitalName={hospitalName}
              setHospitalName={setHospitalName}
              tagline={tagline}
              setTagline={setTagline}
              adminEmail={adminEmail}
              setAdminEmail={setAdminEmail}
              emergencyPhone={emergencyPhone}
              setEmergencyPhone={setEmergencyPhone}
              supportPhone={supportPhone}
              setSupportPhone={setSupportPhone}
              licenseKey={licenseKey}
              setLicenseKey={setLicenseKey}
              facilityAddress={facilityAddress}
              setFacilityAddress={setFacilityAddress}
              defaultCurrency={defaultCurrency}
              setDefaultCurrency={setDefaultCurrency}
              timezone={timezone}
              setTimezone={setTimezone}
            />
          )}

          {activeTab === "Clinical" && (
            <ClinicalSettingsTab
              consultationDuration={consultationDuration}
              setConsultationDuration={setConsultationDuration}
              maxPatientsPerSlot={maxPatientsPerSlot}
              setMaxPatientsPerSlot={setMaxPatientsPerSlot}
              icuTotalBeds={icuTotalBeds}
              setIcuTotalBeds={setIcuTotalBeds}
              triageSystem={triageSystem}
              setTriageSystem={setTriageSystem}
              dischargeChecklistEnforced={dischargeChecklistEnforced}
              setDischargeChecklistEnforced={setDischargeChecklistEnforced}
              triageAlertAudio={triageAlertAudio}
              setTriageAlertAudio={setTriageAlertAudio}
            />
          )}

          {activeTab === "Billing" && (
            <BillingSettingsTab
              defaultTaxRate={defaultTaxRate}
              setDefaultTaxRate={setDefaultTaxRate}
              defaultCoPay={defaultCoPay}
              setDefaultCoPay={setDefaultCoPay}
              invoicePrefix={invoicePrefix}
              setInvoicePrefix={setInvoicePrefix}
              paymentGracePeriod={paymentGracePeriod}
              setPaymentGracePeriod={setPaymentGracePeriod}
              maxDiscountAllowed={maxDiscountAllowed}
              setMaxDiscountAllowed={setMaxDiscountAllowed}
              autoGenerateReceipt={autoGenerateReceipt}
              setAutoGenerateReceipt={setAutoGenerateReceipt}
            />
          )}

          {activeTab === "Security" && (
            <SecuritySettingsTab
              sessions={sessions}
              onTerminateSession={handleTerminateSession}
              onOpenLogsModal={() => setIsLogsModalOpen(true)}
              sessionTimeout={sessionTimeout}
              setSessionTimeout={setSessionTimeout}
              auditLogRetentionDays={auditLogRetentionDays}
              setAuditLogRetentionDays={setAuditLogRetentionDays}
              twoFactorAuth={twoFactorAuth}
              setTwoFactorAuth={setTwoFactorAuth}
              patientDataEncryption={patientDataEncryption}
              setPatientDataEncryption={setPatientDataEncryption}
              ipWhitelisting={ipWhitelisting}
              setIpWhitelisting={setIpWhitelisting}
            />
          )}

          {activeTab === "Notifications" && (
            <NotificationsSettingsTab
              smsGatewayProvider={smsGatewayProvider}
              setSmsGatewayProvider={setSmsGatewayProvider}
              smtpServer={smtpServer}
              setSmtpServer={setSmtpServer}
              smsPatientReminders={smsPatientReminders}
              setSmsPatientReminders={setSmsPatientReminders}
              emailAlerts={emailAlerts}
              setEmailAlerts={setEmailAlerts}
              dailyDigestEmail={dailyDigestEmail}
              setDailyDigestEmail={setDailyDigestEmail}
            />
          )}

          {activeTab === "Backup" && (
            <BackupSettingsTab
              backupFrequency={backupFrequency}
              setBackupFrequency={setBackupFrequency}
              autoCloudBackup={autoCloudBackup}
              setAutoCloudBackup={setAutoCloudBackup}
              maintenanceMode={maintenanceMode}
              setMaintenanceMode={setMaintenanceMode}
              onExportBackupSnapshot={handleExportBackupSnapshot}
              onPromptResetDatabase={handlePromptResetDatabase}
            />
          )}

          {/* Action Footer */}
          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-slate-400">
              Changes applied instantly across all connected terminal workstations.
            </span>

            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 text-xs sm:text-sm font-bold text-white bg-[#2F65F6] hover:bg-[#1E4FD8] rounded-full shadow-xs transition-all cursor-pointer"
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

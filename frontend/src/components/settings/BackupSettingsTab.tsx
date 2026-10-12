"use client";

import React from "react";
import { HardDrive, Download, RotateCcw } from "lucide-react";

interface BackupSettingsTabProps {
  backupFrequency: string;
  setBackupFrequency: (val: string) => void;
  autoCloudBackup: boolean;
  setAutoCloudBackup: (val: boolean) => void;
  maintenanceMode: boolean;
  setMaintenanceMode: (val: boolean) => void;
  onExportBackupSnapshot: () => void;
  onPromptResetDatabase: () => void;
}

export function BackupSettingsTab({
  backupFrequency,
  setBackupFrequency,
  autoCloudBackup,
  setAutoCloudBackup,
  maintenanceMode,
  setMaintenanceMode,
  onExportBackupSnapshot,
  onPromptResetDatabase,
}: BackupSettingsTabProps) {
  return (
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
            value="Encrypted Local & Remote Archive"
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
          onClick={onExportBackupSnapshot}
          className="px-4 py-2 text-xs font-bold text-[#2F65F6] bg-white border border-[#2F65F6]/30 hover:bg-blue-50 rounded-full shadow-2xs transition-all flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Download Backup (.JSON)</span>
        </button>
      </div>

      {/* Danger Zone: Reset Database & Start Fresh */}
      <div className="p-5 sm:p-6 rounded-3xl bg-red-50/70 border border-red-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center shrink-0 border border-red-200 shadow-2xs mt-0.5">
            <RotateCcw className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-red-950">Reset Database & Start Fresh</h4>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-700 border border-red-200">
                Destructive Action
              </span>
            </div>
            <p className="text-xs text-red-800/80 leading-relaxed max-w-xl">
              Permanently wipe all current clinical records, patient charts, active consultation slots, and itemized billing invoices from MongoDB Atlas, and reinitialize pristine baseline records.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onPromptResetDatabase}
          className="px-5 py-2.5 text-xs font-bold text-white bg-red-600 hover:bg-red-700 active:scale-95 rounded-full shadow-xs hover:shadow-sm transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer self-start md:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Database to Fresh State</span>
        </button>
      </div>
    </div>
  );
}

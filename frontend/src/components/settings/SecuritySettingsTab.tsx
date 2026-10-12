"use client";

import React from "react";
import { Shield, Sparkles, Cpu, Database, Key } from "lucide-react";

export interface ActiveSession {
  id: string;
  user: string;
  role: string;
  ip: string;
  location: string;
  device: string;
  time: string;
  status: "Active" | "Idle";
}

interface SecuritySettingsTabProps {
  sessions: ActiveSession[];
  onTerminateSession: (id: string, user: string) => void;
  onOpenLogsModal: () => void;
  sessionTimeout: string;
  setSessionTimeout: (val: string) => void;
  auditLogRetentionDays: string;
  setAuditLogRetentionDays: (val: string) => void;
  twoFactorAuth: boolean;
  setTwoFactorAuth: (val: boolean) => void;
  patientDataEncryption: boolean;
  setPatientDataEncryption: (val: boolean) => void;
  ipWhitelisting: boolean;
  setIpWhitelisting: (val: boolean) => void;
}

export function SecuritySettingsTab({
  sessions,
  onTerminateSession,
  onOpenLogsModal,
  sessionTimeout,
  setSessionTimeout,
  auditLogRetentionDays,
  setAuditLogRetentionDays,
  twoFactorAuth,
  setTwoFactorAuth,
  patientDataEncryption,
  setPatientDataEncryption,
  ipWhitelisting,
  setIpWhitelisting,
}: SecuritySettingsTabProps) {
  return (
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
            onClick={onOpenLogsModal}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#2F65F6] hover:bg-[#1E4FD8] rounded-full shadow-xs transition-all self-start sm:self-auto cursor-pointer"
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
              <p className="text-base font-bold text-[#101828]">Operational</p>
              <span className="text-[10px] text-[#10B981] font-semibold">SSL Active &bull; Auth Guards On</span>
            </div>
          </div>

          <div className="bg-[#F8FAFC] rounded-2xl border border-slate-200/80 p-4 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#ECFDF5] text-[#10B981] flex items-center justify-center shrink-0">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-[#94A3B8] font-bold uppercase tracking-wider">Database Cluster</span>
              <p className="text-base font-bold text-[#101828]">MongoDB Connected</p>
              <span className="text-[10px] text-[#64748B]">Indexed & Validated</span>
            </div>
          </div>

          <div className="bg-[#F8FAFC] rounded-2xl border border-slate-200/80 p-4 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#FEF3C7] text-[#D97706] flex items-center justify-center shrink-0">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-[#94A3B8] font-bold uppercase tracking-wider">Active Staff Logins</span>
              <p className="text-base font-bold text-[#101828]">{sessions.length} Authorized</p>
              <span className="text-[10px] text-[#10B981] font-semibold">RBAC Enforced</span>
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
              <option value="365">1 Year (Compliant)</option>
              <option value="1825">5 Years (Permanent Archive)</option>
            </select>
          </div>
        </div>

        <div className="space-y-3 pt-2">
          <label className="flex items-center justify-between p-4 rounded-2xl bg-[#F8FAFC] border border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors">
            <div>
              <p className="text-xs font-bold text-[#101828]">Enforce Multi-Factor Authentication (2FA)</p>
              <p className="text-[11px] text-[#64748B]">
                Mandatory Authenticator / SMS code for administrative and medical staff
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
              <p className="text-xs font-bold text-[#101828]">AES-256 Patient Record Encryption</p>
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
                      onClick={() => onTerminateSession(s.id, s.user)}
                      className="px-3 py-1 bg-rose-50 hover:bg-rose-100 text-rose-600 font-semibold rounded-full border border-rose-200 transition-all text-xs cursor-pointer"
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
              <span>Admin</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 text-[#2F65F6]">Full Access</span>
            </div>
            <p className="text-slate-500 text-[11px]">
              Full read/write permissions across doctors, patient charts, departments, appointments, billing adjustments, and security settings.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-slate-200 space-y-2">
            <div className="flex items-center justify-between font-bold text-slate-900">
              <span>Doctor / Specialist</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-[#10B981]">Clinical Read/Write</span>
            </div>
            <p className="text-slate-500 text-[11px]">
              Read doctors and patients, manage assigned patient roster, update diagnoses, and schedule consultations.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-slate-200 space-y-2">
            <div className="flex items-center justify-between font-bold text-slate-900">
              <span>Staff / Receptionist</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-[#D97706]">Read & Appointments</span>
            </div>
            <p className="text-slate-500 text-[11px]">
              View directory, register new patients, book appointments, and print invoice receipts.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

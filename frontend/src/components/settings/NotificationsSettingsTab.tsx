"use client";

import React from "react";
import { Bell } from "lucide-react";

interface NotificationsSettingsTabProps {
  smsGatewayProvider: string;
  setSmsGatewayProvider: (val: string) => void;
  smtpServer: string;
  setSmtpServer: (val: string) => void;
  smsPatientReminders: boolean;
  setSmsPatientReminders: (val: boolean) => void;
  emailAlerts: boolean;
  setEmailAlerts: (val: boolean) => void;
  dailyDigestEmail: boolean;
  setDailyDigestEmail: (val: boolean) => void;
}

export function NotificationsSettingsTab({
  smsGatewayProvider,
  setSmsGatewayProvider,
  smtpServer,
  setSmtpServer,
  smsPatientReminders,
  setSmsPatientReminders,
  emailAlerts,
  setEmailAlerts,
  dailyDigestEmail,
  setDailyDigestEmail,
}: NotificationsSettingsTabProps) {
  return (
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
  );
}

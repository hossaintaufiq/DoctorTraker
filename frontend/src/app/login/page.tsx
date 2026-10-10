"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Activity, Lock, Mail, ArrowRight, ShieldCheck } from "lucide-react";
import { useDoctorTracker } from "@/context/DoctorTrackerContext";

export default function LoginPage() {
  const router = useRouter();
  const { showToast } = useDoctorTracker();

  const [email, setEmail] = useState("admin@medcare.com");
  const [password, setPassword] = useState("••••••••••••");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      showToast("Welcome Back", "Signed in to Medcare Doctor Tracker Portal.", "success");
      router.push("/dashboard");
    }, 500);
  };

  const handleQuickDemo = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      showToast("Demo Access Granted", "Signed in as Medical Administrator.", "success");
      router.push("/dashboard");
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#F4F7FB] flex flex-col justify-center items-center p-4 sm:p-6">
      {/* Container Card */}
      <div className="w-full max-w-md bg-white rounded-3xl border border-[#EBF0F7] popover-shadow p-7 sm:p-8 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2.5">
          <div className="w-12 h-12 rounded-full bg-[#2F65F6] text-white flex items-center justify-center mx-auto shadow-xs">
            <Activity className="w-6 h-6 stroke-[2.5]" />
          </div>
          <h2 className="text-2xl font-bold text-[#101828] tracking-tight">Medcare Tracker</h2>
          <p className="text-xs text-[#64748B]">
            Healthcare Management & Medical Administration Portal
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5 text-xs">
            <label className="font-semibold text-[#101828]">Work Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#94A3B8] absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-full border border-[#EBF0F7] bg-[#F4F7FB] text-[#1E293B] focus:bg-white focus:outline-none focus:border-[#2F65F6] transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5 text-xs">
            <div className="flex items-center justify-between">
              <label className="font-semibold text-[#101828]">Password</label>
              <button
                type="button"
                onClick={() => showToast("Password Reset", "Reset instructions dispatched.", "info")}
                className="text-[11px] font-medium text-[#2F65F6] hover:underline"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#94A3B8] absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-full border border-[#EBF0F7] bg-[#F4F7FB] text-[#1E293B] focus:bg-white focus:outline-none focus:border-[#2F65F6] transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-full text-xs sm:text-sm font-semibold text-white bg-[#2F65F6] hover:bg-[#1E4FD8] shadow-xs transition-all flex items-center justify-center gap-2"
          >
            <span>{isLoading ? "Authenticating..." : "Sign In to Portal"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Demo Credentials */}
        <div className="pt-4 border-t border-[#EBF0F7] text-center space-y-3">
          <button
            type="button"
            onClick={handleQuickDemo}
            className="w-full py-2.5 rounded-full text-xs font-semibold text-[#2F65F6] bg-[#EBF3FE] hover:bg-[#DCE8FC] transition-colors"
          >
            ⚡ Quick Demo 1-Click Login
          </button>
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#64748B]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
            <span>HIPAA-compliant encrypted session</span>
          </div>
        </div>
      </div>
    </div>
  );
}

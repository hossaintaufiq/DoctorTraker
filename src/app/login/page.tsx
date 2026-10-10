"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Activity, Lock, Mail, ArrowRight, ShieldCheck } from "lucide-react";
import { useDoctorTracker } from "@/context/DoctorTrackerContext";

export default function LoginPage() {
  const router = useRouter();
  const { showToast } = useDoctorTracker();

  const [email, setEmail] = useState("admin@careguide.bd");
  const [password, setPassword] = useState("••••••••••••");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      showToast("Welcome Back", "Signed in to Doctor Tracker Admin Portal.", "success");
      router.push("/dashboard");
    }, 600);
  };

  const handleQuickDemo = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      showToast("Demo Access Granted", "Signed in as Administrator.", "success");
      router.push("/dashboard");
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#F7F9FC] flex flex-col justify-center items-center p-4 sm:p-6">
      {/* Container Card */}
      <div className="w-full max-w-md bg-white rounded-3xl border border-[#E8EDF3] popover-shadow p-6 sm:p-8 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-[#0F9F9A] text-white flex items-center justify-center mx-auto shadow-sm">
            <Activity className="w-6 h-6 stroke-[2.4]" />
          </div>
          <h2 className="text-2xl font-bold text-[#172B4D] tracking-tight">Doctor Tracker</h2>
          <p className="text-xs text-[#7A8798]">
            Healthcare Management Admin Portal &bull; Care Guide BD
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5 text-xs">
            <label className="font-semibold text-[#172B4D]">Work Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#9BA6B5] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#E8EDF3] bg-[#F7F9FC] text-[#243247] focus:bg-white focus:outline-none focus:border-[#0F9F9A] transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5 text-xs">
            <div className="flex items-center justify-between">
              <label className="font-semibold text-[#172B4D]">Password</label>
              <button
                type="button"
                onClick={() => showToast("Password Reset", "Reset instructions dispatched.", "info")}
                className="text-[11px] font-medium text-[#0F9F9A] hover:underline"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#9BA6B5] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#E8EDF3] bg-[#F7F9FC] text-[#243247] focus:bg-white focus:outline-none focus:border-[#0F9F9A] transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold text-white bg-[#0F9F9A] hover:bg-[#0B7F7A] shadow-xs transition-all flex items-center justify-center gap-2"
          >
            <span>{isLoading ? "Authenticating..." : "Sign In to Dashboard"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Demo Credentials */}
        <div className="pt-4 border-t border-[#F0F4F8] text-center">
          <button
            type="button"
            onClick={handleQuickDemo}
            className="w-full py-2 rounded-xl text-xs font-semibold text-[#0F9F9A] bg-[#E6F7F6] hover:bg-[#D5F2F0] transition-colors"
          >
            ⚡ Quick Demo 1-Click Login
          </button>
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#7A8798] mt-3">
            <ShieldCheck className="w-3.5 h-3.5 text-[#16A36A]" />
            <span>HIPAA-compliant encrypted admin session</span>
          </div>
        </div>
      </div>
    </div>
  );
}

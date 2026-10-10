"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Activity, Lock, Mail, ArrowRight, ShieldCheck, Sparkles, CheckCircle2, AlertCircle } from "lucide-react";
import { useDoctorTracker } from "@/context/DoctorTrackerContext";

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, authLoading } = useDoctorTracker();

  const [email, setEmail] = useState("admin@medcare.com");
  const [password, setPassword] = useState("password123");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [authLoading, isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    const result = await login(email, password);
    setIsLoading(false);

    if (result.success) {
      router.push("/dashboard");
    } else {
      setErrorMessage(result.message || "Invalid work email or password. Please verify credentials.");
    }
  };

  const handleQuickDemo = async () => {
    setEmail("admin@medcare.com");
    setPassword("password123");
    setErrorMessage("");
    setIsLoading(true);

    const result = await login("admin@medcare.com", "password123");
    setIsLoading(false);

    if (result.success) {
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-[#ECEEF4] flex flex-col justify-center items-center p-4 sm:p-6 relative overflow-hidden">
      {/* Ambient background mesh */}
      <div className="glass-mesh-background" />

      {/* Container Card */}
      <div className="relative z-10 w-full max-w-md bg-white/95 backdrop-blur-3xl rounded-3xl border border-white/90 shadow-2xl p-7 sm:p-9 space-y-6 animate-fade-in">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-[#2F65F6] to-[#60A5FA] text-white flex items-center justify-center mx-auto shadow-md shadow-[#2F65F6]/20">
            <Activity className="w-7 h-7 stroke-[2.5]" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#101828] tracking-tight">
            Doctor Tracker
          </h1>
          <p className="text-xs text-[#64748B]">
            Clinical Staff Directory, Patient Records & Management Portal
          </p>
        </div>

        {/* Demo Credentials Notice Card */}
        <div className="p-3.5 rounded-2xl bg-[#EFF6FF] border border-[#BFDBFE] flex items-start gap-2.5 text-xs text-[#1D4ED8]">
          <Sparkles className="w-4 h-4 text-[#2F65F6] shrink-0 mt-0.5" />
          <div className="space-y-0.5 min-w-0 flex-1">
            <span className="font-bold block text-[#1E40AF]">Evaluator Demo Account:</span>
            <div className="text-[11px] text-[#2563EB] flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
              <span>Email: <strong className="font-mono">admin@medcare.com</strong></span>
              <span>Pass: <strong className="font-mono">password123</strong></span>
            </div>
          </div>
        </div>

        {/* Error alert */}
        {errorMessage && (
          <div className="p-3 rounded-2xl bg-[#FEF2F2] border border-[#FECACA] flex items-center gap-2 text-xs text-[#EF4444] animate-fade-in">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5 text-xs">
            <label className="font-semibold text-[#101828]">Administrator Work Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#94A3B8] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@medcare.com"
                required
                className="w-full pl-10 pr-4 py-2.5 text-xs rounded-full border border-slate-200 bg-slate-50 text-[#101828] focus:bg-white focus:outline-none focus:border-[#2F65F6] transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5 text-xs">
            <div className="flex items-center justify-between">
              <label className="font-semibold text-[#101828]">Master Password</label>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#94A3B8] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                className="w-full pl-10 pr-4 py-2.5 text-xs rounded-full border border-slate-200 bg-slate-50 text-[#101828] focus:bg-white focus:outline-none focus:border-[#2F65F6] transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-full text-xs sm:text-sm font-bold text-white bg-[#2F65F6] hover:bg-[#1E4FD8] shadow-md shadow-[#2F65F6]/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
          >
            <span>{isLoading ? "Authenticating Session..." : "Sign In to Portal"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Demo Credentials Autofill Button */}
        <div className="pt-3 border-t border-slate-100 text-center space-y-3">
          <button
            type="button"
            onClick={handleQuickDemo}
            disabled={isLoading}
            className="w-full py-2.5 px-4 rounded-full text-xs font-bold text-[#2F65F6] bg-[#EBF3FE] hover:bg-[#DCE8FC] border border-[#BFDBFE] transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4 text-[#2F65F6]" />
            <span>⚡ 1-Click Demo Admin Instant Access</span>
          </button>
          
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#64748B]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
            <span>End-to-end encrypted session with MongoDB Atlas</span>
          </div>
        </div>
      </div>
    </div>
  );
}

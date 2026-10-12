"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Activity, 
  Lock, 
  Mail, 
  ArrowRight, 
  ShieldCheck, 
  Eye, 
  EyeOff,
  AlertCircle
} from "lucide-react";
import { useDoctorTracker } from "@/context/DoctorTrackerContext";

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, authLoading } = useDoctorTracker();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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

    if (!email.trim() || !password) {
      setErrorMessage("Please enter both work email and password.");
      return;
    }

    setIsLoading(true);

    const result = await login(email.trim(), password);
    setIsLoading(false);

    if (result.success) {
      router.push("/dashboard");
    } else {
      setErrorMessage(result.message || "Invalid work email or password.");
    }
  };

  return (
    <div className="min-h-screen w-full bg-white flex flex-col lg:grid lg:grid-cols-12 selection:bg-[#2F65F6] selection:text-white">
      {/* =========================================================================
          LEFT SIDE: Doctor Photography Hero
         ========================================================================= */}
      <div className="relative lg:col-span-6 xl:col-span-7 hidden lg:flex flex-col justify-between p-12 xl:p-16 text-white overflow-hidden bg-slate-900">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=1600&auto=format&fit=crop')`,
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-[#09111E]/90 via-[#09111E]/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#09111E]/30" />

        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#2F65F6] text-white flex items-center justify-center shadow-md shadow-[#2F65F6]/30">
            <Activity className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight text-white block">
              Doctor Tracker
            </span>
            <span className="text-xs text-slate-300">
              Healthcare Operations Platform
            </span>
          </div>
        </div>

        <div className="relative z-10 max-w-md space-y-2">
          <h2 className="text-2xl xl:text-3xl font-bold tracking-tight text-white leading-snug">
            Caring for patients with clarity and precision.
          </h2>
          <p className="text-xs xl:text-sm text-slate-300 font-normal">
            Unified clinical directories, department schedules, and patient management.
          </p>
        </div>
      </div>

      {/* =========================================================================
          MOBILE TOP BANNER
         ========================================================================= */}
      <div className="lg:hidden relative w-full h-44 bg-slate-900 overflow-hidden flex flex-col justify-end p-6 text-white">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=1200&auto=format&fit=crop')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#09111E] via-[#09111E]/60 to-transparent" />
        
        <div className="relative z-10 flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-[#2F65F6] text-white flex items-center justify-center shadow-md">
            <Activity className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white tracking-tight">Doctor Tracker</h1>
            <p className="text-[11px] text-slate-300">Clinical Operations Portal</p>
          </div>
        </div>
      </div>

      {/* =========================================================================
          RIGHT SIDE: Secure Login Form (No prefilled credentials)
         ========================================================================= */}
      <div className="flex-1 lg:col-span-6 xl:col-span-5 flex flex-col justify-center items-center px-6 py-10 sm:px-12 xl:px-16 bg-white">
        <div className="w-full max-w-sm space-y-7">
          <div className="space-y-1.5 text-center sm:text-left">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
              Sign In
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Enter your authorized credentials to access the clinical portal.
            </p>
          </div>

          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-center gap-2 text-xs text-rose-600 animate-fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5 text-xs">
              <label htmlFor="login-email" className="font-semibold text-slate-700">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@doctortracker.com"
                  required
                  autoComplete="email"
                  className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2F65F6]/20 focus:border-[#2F65F6] transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5 text-xs">
              <label htmlFor="login-password" className="font-semibold text-slate-700">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  autoComplete="current-password"
                  className="w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2F65F6]/20 focus:border-[#2F65F6] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer p-1"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              id="login-submit-button"
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold text-white bg-[#2F65F6] hover:bg-[#1E4FD8] active:scale-[0.99] shadow-md shadow-[#2F65F6]/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
            <span>Secure 256-bit encrypted connection</span>
          </div>
        </div>
      </div>
    </div>
  );
}

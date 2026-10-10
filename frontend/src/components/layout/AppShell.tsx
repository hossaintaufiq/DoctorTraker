"use client";

import React, { Suspense, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDoctorTracker } from "@/context/DoctorTrackerContext";
import { Sidebar } from "./Sidebar";
import { TopNavbar } from "./TopNavbar";
import { MobileSidebar } from "./MobileSidebar";
import { Activity } from "lucide-react";

interface AppShellProps {
  children: React.ReactNode;
  breadcrumbTitle?: string;
  parentPath?: string;
  parentLabel?: string;
}

function AppShellContent({
  children,
  breadcrumbTitle,
  parentPath,
  parentLabel,
}: AppShellProps) {
  const router = useRouter();
  const { isAuthenticated, authLoading } = useDoctorTracker();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [authLoading, isAuthenticated, router]);

  if (authLoading) {
    return (
      <div className="h-screen w-screen overflow-hidden flex items-center justify-center bg-[#ECEEF4] relative">
        <div className="glass-mesh-background" />
        <div className="relative z-10 glass-card p-8 rounded-3xl flex flex-col items-center gap-4 text-center max-w-sm">
          <div className="w-12 h-12 rounded-2xl bg-[#2F65F6]/10 text-[#2F65F6] flex items-center justify-center animate-pulse">
            <Activity className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#101828]">Doctor Tracker</h3>
            <p className="text-xs text-[#64748B] mt-1">Verifying encrypted administrator session...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="h-screen w-screen overflow-hidden flex text-[#1E293B] relative">
      {/* Ambient Glassmorphism Mesh Background */}
      <div className="glass-mesh-background" />

      {/* Persistent Frosted Glass Left Sidebar (256px) - Pinned to the Left */}
      <Sidebar />

      {/* Mobile Slide-over Drawer */}
      <MobileSidebar />

      {/* Main Right Area: Top Navbar Pinned at Top, Only Content Below Scrolls */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden relative z-10">
        {/* Pinned Top Navbar Header */}
        <div className="shrink-0 z-20">
          <TopNavbar
            breadcrumbTitle={breadcrumbTitle}
            parentPath={parentPath}
            parentLabel={parentLabel}
          />
        </div>

        {/* Scrollable Page Content Container: Only this area scrolls up and down */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 lg:p-8">
          <div className="max-w-[1440px] w-full mx-auto pb-12">
            <Suspense
              fallback={
                <div className="h-64 glass-card rounded-3xl flex items-center justify-center text-xs text-[#94A3B8]">
                  Loading workspace...
                </div>
              }
            >
              {children}
            </Suspense>
          </div>
        </main>
      </div>
    </div>
  );
}

export function AppShell(props: AppShellProps) {
  return <AppShellContent {...props} />;
}

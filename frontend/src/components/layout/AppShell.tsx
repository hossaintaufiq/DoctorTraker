"use client";

import React, { Suspense } from "react";
import { Sidebar } from "./Sidebar";
import { TopNavbar } from "./TopNavbar";
import { MobileSidebar } from "./MobileSidebar";

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

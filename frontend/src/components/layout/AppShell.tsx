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
    <div className="min-h-screen relative flex text-[#1E293B]">
      {/* Ambient Glassmorphism Mesh Background */}
      <div className="glass-mesh-background" />

      {/* Persistent Frosted Glass Left Sidebar (256px) */}
      <Sidebar />

      {/* Mobile Slide-over Drawer */}
      <MobileSidebar />

      {/* Main Right Content Panel with relative positioning */}
      <div className="flex-1 flex flex-col min-w-0 relative z-10">
        <TopNavbar
          breadcrumbTitle={breadcrumbTitle}
          parentPath={parentPath}
          parentLabel={parentLabel}
        />

        {/* Content Container */}
        <main className="flex-1 p-5 sm:p-7 lg:p-8 max-w-[1440px] w-full mx-auto">
          <Suspense
            fallback={
              <div className="h-64 glass-card rounded-3xl flex items-center justify-center text-xs text-[#94A3B8]">
                Loading workspace...
              </div>
            }
          >
            {children}
          </Suspense>
        </main>
      </div>
    </div>
  );
}

export function AppShell(props: AppShellProps) {
  return <AppShellContent {...props} />;
}

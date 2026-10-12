"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export interface DashboardParams {
  period?: "7d" | "30d" | "90d" | "ytd" | "all" | string;
  from?: string;
  to?: string;
  hospital?: string;
  specialty?: string;
}

export interface DashboardData {
  summary: {
    totalDoctors: number;
    totalPatients: number;
    activeDoctorsCount: number;
    admittedPatientsCount: number;
    criticalPatientsCount: number;
    avgPatientsPerDoctor: number;
    totalRevenue: number;
    appointmentsInRange: number;
    appointmentsToday: number;
    period: string;
    range: {
      from: string;
      to: string;
    };
  };
  changes: {
    arrivalsChangePercent: number;
    revenueChangePercent: number;
    prevPatientsInRange: number;
    currentPatientsInRange: number;
  };
  patientsPerDoctor: Array<{
    doctorId?: string;
    doctorName: string;
    specialty?: string;
    count: number;
  }>;
  conditionBreakdown: Array<{
    name: string;
    value: number;
    percentage: number;
  }>;
  statusBreakdown: Array<{
    name: string;
    value: number;
    percentage: number;
  }>;
  specialtyBreakdown: Array<{
    name: string;
    count: number;
  }>;
  arrivalTrends: Array<{
    date: string;
    label: string;
    inPatients: number;
    outPatients: number;
    total: number;
  }>;
}

export function useDashboard(params?: DashboardParams, options?: { enabled?: boolean }) {
  return useQuery<DashboardData>({
    queryKey: ["dashboard", params],
    queryFn: async () => {
      const res = await api.analytics.getDashboard(params);
      if (!res.success) {
        throw new Error(res.message || "Failed to load dashboard analytics.");
      }
      return res.data as DashboardData;
    },
    enabled: options?.enabled ?? true,
    staleTime: 30 * 1000,
  });
}

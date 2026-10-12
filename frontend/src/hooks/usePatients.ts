"use client";

import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Patient } from "@/lib/types";

export interface PatientsQueryParams {
  search?: string;
  condition?: string;
  status?: string;
  bloodGroup?: string;
  doctorId?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: string;
  order?: "asc" | "desc";
  page?: number;
  limit?: number;
}

export function usePatients(params?: PatientsQueryParams, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ["patients", params],
    queryFn: async () => {
      const res = await api.patients.getAll(params);
      if (!res.success) {
        throw new Error(res.message || "Failed to fetch patients");
      }
      return {
        patients: (res.data as Patient[]) || [],
        total: res.total || 0,
        totalPages: res.totalPages || 1,
        currentPage: res.currentPage || 1,
      };
    },
    enabled: options?.enabled ?? true,
    placeholderData: keepPreviousData,
    staleTime: 30 * 1000,
  });
}

export function usePatient(id?: string) {
  return useQuery({
    queryKey: ["patient", id],
    queryFn: async () => {
      if (!id) return null;
      const res = await api.patients.getById(id);
      if (!res.success) {
        throw new Error(res.message || "Failed to fetch patient chart");
      }
      return res.data;
    },
    enabled: Boolean(id),
    staleTime: 30 * 1000,
  });
}

export function usePatientMutations() {
  const queryClient = useQueryClient();

  const createPatient = useMutation({
    mutationFn: async (patientData: any) => {
      const res = await api.patients.create(patientData);
      if (!res.success) throw new Error(res.message || "Failed to create patient");
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      queryClient.invalidateQueries({ queryKey: ["doctors"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });

  const updatePatient = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const res = await api.patients.update(id, data);
      if (!res.success) throw new Error(res.message || "Failed to update patient");
      return res.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      queryClient.invalidateQueries({ queryKey: ["patient", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["doctors"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });

  const deletePatient = useMutation({
    mutationFn: async (id: string) => {
      const res = await api.patients.delete(id);
      if (!res.success) throw new Error(res.message || "Failed to delete patient");
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      queryClient.invalidateQueries({ queryKey: ["doctors"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });

  return {
    createPatient,
    updatePatient,
    deletePatient,
  };
}

"use client";

import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Doctor } from "@/lib/types";

export interface DoctorsQueryParams {
  search?: string;
  specialty?: string;
  status?: string;
  hospital?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: string;
  order?: "asc" | "desc";
  page?: number;
  limit?: number;
}

export function useDoctors(params?: DoctorsQueryParams, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ["doctors", params],
    queryFn: async () => {
      const res = await api.doctors.getAll(params);
      if (!res.success) {
        throw new Error(res.message || "Failed to fetch doctors");
      }
      const rawList = (res.data as any[]) || [];
      const doctors: Doctor[] = rawList.map((d) => ({
        ...d,
        id: (d.id || d._id || "").toString(),
      }));
      return {
        doctors,
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

export function useDoctor(id?: string) {
  return useQuery({
    queryKey: ["doctor", id],
    queryFn: async () => {
      if (!id) return null;
      const res = await api.doctors.getById(id);
      if (!res.success) {
        throw new Error(res.message || "Failed to fetch doctor details");
      }
      return res.data;
    },
    enabled: Boolean(id),
    staleTime: 30 * 1000,
  });
}

export function useDoctorMutations() {
  const queryClient = useQueryClient();

  const createDoctor = useMutation({
    mutationFn: async (doctorData: any) => {
      const res = await api.doctors.create(doctorData);
      if (!res.success) throw new Error(res.message || "Failed to create doctor");
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["doctors"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });

  const updateDoctor = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const res = await api.doctors.update(id, data);
      if (!res.success) throw new Error(res.message || "Failed to update doctor");
      return res.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["doctors"] });
      queryClient.invalidateQueries({ queryKey: ["doctor", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });

  const deleteDoctor = useMutation({
    mutationFn: async (id: string) => {
      const res = await api.doctors.delete(id);
      if (!res.success) throw new Error(res.message || "Failed to delete doctor");
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["doctors"] });
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });

  const addPatientUnderDoctor = useMutation({
    mutationFn: async ({ doctorId, patientData }: { doctorId: string; patientData: any }) => {
      const res = await api.doctors.addPatient(doctorId, patientData);
      if (!res.success) throw new Error(res.message || "Failed to add patient under doctor");
      return res.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["doctor", variables.doctorId] });
      queryClient.invalidateQueries({ queryKey: ["doctors"] });
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });

  const removePatientFromDoctor = useMutation({
    mutationFn: async ({ doctorId, patientId }: { doctorId: string; patientId: string }) => {
      const res = await api.doctors.removePatient(doctorId, patientId);
      if (!res.success) throw new Error(res.message || "Failed to remove patient from doctor");
      return res;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["doctor", variables.doctorId] });
      queryClient.invalidateQueries({ queryKey: ["doctors"] });
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });

  return {
    createDoctor,
    updateDoctor,
    deleteDoctor,
    addPatientUnderDoctor,
    removePatientFromDoctor,
  };
}

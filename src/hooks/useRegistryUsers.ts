import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/apis/axios";
import type { UserRole } from "@/types/user";

export type RegistryUserRow = {
  id: number;
  first_name: string | null;
  last_name: string | null;
  email: string;
  profile_picture_url: string | null;
  is_active: boolean;
  email_verified: boolean;
  roles: { id: number; code: string; name: string }[];
  department_id: number | null;
  department_name: string;
};

export type RegistryUsersResponse = {
  success: boolean;
  data: RegistryUserRow[];
  meta: { page: number; limit: number; total: number; totalPages: number };
};

export type RegistryUsersQuery = {
  page: number;
  limit: number;
  search?: string;
  role?: UserRole | "all" | "";
  department_id?: number;
};

export function useRegistryUsers(params: RegistryUsersQuery) {
  return useQuery({
    queryKey: ["registry-users", params],
    queryFn: async (): Promise<RegistryUsersResponse> => {
      const qs = new URLSearchParams();
      qs.set("page", String(params.page));
      qs.set("limit", String(params.limit));
      if (params.search?.trim()) qs.set("search", params.search.trim());
      if (params.role && params.role !== "all") qs.set("role", params.role);
      if (params.department_id) qs.set("department_id", String(params.department_id));
      const res = await apiClient.get(`/v1/user/management/users?${qs.toString()}`);
      return res.data as RegistryUsersResponse;
    },
    enabled: true,
  });
}

export type UpdateRegistryUserBody = {
  first_name?: string;
  last_name?: string;
  email?: string;
  is_active?: boolean;
};

export function useUpdateRegistryUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, body }: { id: number; body: UpdateRegistryUserBody }) => {
      const res = await apiClient.patch(`/v1/user/management/users/${id}`, body);
      return res.data;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["registry-users"] });
    },
  });
}

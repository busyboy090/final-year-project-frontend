import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/apis/axios";
import type { UserRole } from "@/types/user";

export type CreateUserPayload = {
  first_name: string;
  last_name: string;
  email: string;
  role: UserRole;
  organisation_id?: number;
};

export type CreateUserResponse = {
  success: boolean;
  message: string;
  data: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    roles: { id: number; code: string; name: string }[];
  };
};

export function useCreateUser() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (
      payload: CreateUserPayload,
    ): Promise<CreateUserResponse> => {
      const res = await apiClient.post("/v1/user", payload);
      return res.data as CreateUserResponse;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["registry-users"] });
    },
  });
}

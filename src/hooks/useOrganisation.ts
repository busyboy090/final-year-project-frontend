import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/apis/axios";
import type { OrganisationFilters, PaginatedOrganisationsResponse } from "@/types/organisation";

const fetchOrganisations = async (
  filters: OrganisationFilters
): Promise<PaginatedOrganisationsResponse> => {
  const params = new URLSearchParams();

  if (filters.page)          params.set('page',          String(filters.page));
  if (filters.limit)         params.set('limit',         String(filters.limit));
  if (filters.name)          params.set('name',          filters.name);
  if (filters.faculty_id)    params.set('faculty_id',    String(filters.faculty_id));
  if (filters.department_id) params.set('department_id', String(filters.department_id));

  const { data } = await apiClient.get<PaginatedOrganisationsResponse>(
    `/v1/organisations?${params.toString()}`
  );

  return data;
};

export const useOrganisations = (filters: OrganisationFilters = {}) => {
  return useQuery({
    queryKey: ["organisations", filters],
    queryFn:  () => fetchOrganisations(filters),
  });
};

export type OrganisationPayload = {
  name: string;
  address?: string;
  faculty_id?: number;
  department_id?: number;
};

export const useCreateOrganisation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: OrganisationPayload) => {
      const response = await apiClient.post("/v1/organisations", payload);
      return response.data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["organisations"] });
    },
  });
};

export const useUpdateOrganisation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, payload }: { id: number; payload: OrganisationPayload }) => {
      const response = await apiClient.patch(`/v1/organisations/${id}`, payload);
      return response.data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["organisations"] });
    },
  });
};

export const useDeleteOrganisation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await apiClient.delete(`/v1/organisations/${id}`);
      return response.data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["organisations"] });
    },
  });
};

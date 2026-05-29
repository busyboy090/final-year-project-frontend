import { useQuery } from "@tanstack/react-query";
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
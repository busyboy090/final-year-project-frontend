import { apiClient } from "@/apis/axios";
import { useQuery } from "@tanstack/react-query";
import type { DepartmentsParams, PaginatedDepartmentsResponse } from "@/types/department";

export const useDepartments = (params: DepartmentsParams = {}) => {
    const { facultyId, search, type, page = 1, limit = 20 } = params;
  
    return useQuery<PaginatedDepartmentsResponse>({
      queryKey: ["departments", { facultyId, search, type, page, limit }],
      queryFn: async () => {
        // FIX 1: Build query string properly instead of manual string concat
        const query = new URLSearchParams();
        if (facultyId) query.set("facultyId",  String(facultyId));
        if (search)    query.set("search",      search);
        if (type)      query.set("type",        type);
                       query.set("page",        String(page));
                       query.set("limit",       String(limit));
  
        const response = await apiClient.get(`/v1/departments?${query.toString()}`);
  
        return response.data
      },
      staleTime: 1000 * 60 * 60,
    });
  };
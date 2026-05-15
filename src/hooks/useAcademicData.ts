import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/apis/axios';

// 1. Fetch Undergraduate Levels
export const useLevels = (type: 'under-grade' | 'post-grade' | "alumni" | "pre-degree" = 'under-grade') => {
  return useQuery({
    queryKey: ['levels', type],
    queryFn: async () => {
      const response = await apiClient.get(`/v1/levels?type=${type}`);
      return response.data.data;
    },
    staleTime: 1000 * 60 * 60, // Data is fresh for 1 hour (academic data doesn't change often)
  });
};

// 2. Fetch Departments
export const useDepartments = (facultyId?: number) => {
  return useQuery({
    queryKey: ['departments', facultyId],
    queryFn: async () => {
      const url = facultyId ? `/v1/departments?faculty_id=${facultyId}` : '/v1/departments';
      const response = await apiClient.get(url);
      return response.data.data;
    },
    staleTime: 1000 * 60 * 60, // Data is fresh for 1 hour (academic data doesn't change often)
  });
};

export const useFaculties = () => {
  return useQuery({
    queryKey: ['faculties'],
    queryFn: async () => {
      const response = await apiClient.get("/v1/faculties");
      return response.data.data;
    },
    staleTime: 1000 * 60 * 60, // Data is fresh for 1 hour (academic data doesn't change often)
  });
};
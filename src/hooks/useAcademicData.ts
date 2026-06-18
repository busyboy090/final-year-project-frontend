import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
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

export const useCreateLevel = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: {
      name: string;
      code: string;
      category: 'under-grade' | 'post-grade' | 'alumni' | 'pre-degree';
    }) => {
      const response = await apiClient.post('/v1/levels', payload);
      return response.data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['levels'] });
    },
  });
};

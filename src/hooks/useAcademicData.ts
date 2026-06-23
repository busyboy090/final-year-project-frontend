import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/apis/axios';
import type { AcademicSession } from '@/types/academic-session';

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

export const useAcademicSessions = () => {
  return useQuery({
    queryKey: ['academic-sessions'],
    queryFn: async () => {
      const response = await apiClient.get('/v1/academic-sessions');
      return response.data.data as AcademicSession[];
    },
    staleTime: 1000 * 60 * 10,
  });
};

export const useCurrentAcademicSession = () => {
  return useQuery({
    queryKey: ['academic-sessions', 'current'],
    queryFn: async () => {
      const response = await apiClient.get('/v1/academic-sessions/current');
      return response.data.data as AcademicSession | null;
    },
    staleTime: 1000 * 60 * 10,
  });
};

export const useCreateAcademicSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: {
      name: string;
      code: string;
      start_date: string;
      end_date: string;
      is_active?: boolean;
    }) => {
      const response = await apiClient.post('/v1/academic-sessions', payload);
      return response.data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['academic-sessions'] });
    },
  });
};

export const useUpdateAcademicSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, payload }: {
      id: number;
      payload: Partial<{
        name: string;
        code: string;
        start_date: string;
        end_date: string;
        is_active: boolean;
      }>;
    }) => {
      const response = await apiClient.patch(`/v1/academic-sessions/${id}`, payload);
      return response.data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['academic-sessions'] });
    },
  });
};

export const useSetCurrentAcademicSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await apiClient.patch(`/v1/academic-sessions/${id}/current`);
      return response.data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['academic-sessions'] });
      void queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
};

export const useDeleteAcademicSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await apiClient.delete(`/v1/academic-sessions/${id}`);
      return response.data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['academic-sessions'] });
    },
  });
};

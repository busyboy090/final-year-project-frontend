import { renderHook, waitFor } from '@testing-library/react';
import { QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { apiClient } from '@/apis/axios';
import { useVenueStats } from '@/hooks/useVenue';
import { createTestQueryClient } from './test-utils';

vi.mock('@/apis/axios', () => ({
  apiClient: {
    get: vi.fn(),
  },
}));

afterEach(() => {
  vi.mocked(apiClient.get).mockReset();
});

describe('useVenueStats', () => {
  it('derives totals and occupancy percentage from venue records', async () => {
    vi.mocked(apiClient.get).mockResolvedValueOnce({
      data: {
        data: [
          { id: '1', status: 'available' },
          { id: '2', status: 'available' },
          { id: '3', status: 'maintenance' },
          { id: '4', status: 'occupied' },
        ],
      },
    });
    const queryClient = createTestQueryClient();
    const wrapper = ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    );

    const { result } = renderHook(() => useVenueStats(), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(apiClient.get).toHaveBeenCalledWith('/v1/venues', {
      params: { limit: 1000, page: 1 },
    });
    expect(result.current.data).toEqual({
      total: 4,
      available: 2,
      maintenance: 1,
      occupied: 1,
      occupancyRate: 25,
    });
  });

  it('returns zero occupancy for an empty venue list', async () => {
    vi.mocked(apiClient.get).mockResolvedValueOnce({
      data: { data: [] },
    });
    const queryClient = createTestQueryClient();
    const wrapper = ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    );

    const { result } = renderHook(() => useVenueStats(), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.occupancyRate).toBe(0);
    expect(result.current.data?.total).toBe(0);
  });
});

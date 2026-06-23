import { cleanup, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import Hero from '@/features/home/Hero';
import Stats from '@/features/home/Stats';
import { apiClient } from '@/apis/axios';
import { renderWithProviders } from './test-utils';

const authState = vi.hoisted(() => ({
  isAuthenticated: true,
}));

const eventStatsState = vi.hoisted(() => ({
  stats: {
    total_events: 12,
    total_registrations: 88,
  },
  isLoading: false,
}));

vi.mock('@/hooks/useAuth', () => ({
  default: () => ({
    isAuthenticated: authState.isAuthenticated,
  }),
}));

vi.mock('@/hooks/useEvent', () => ({
  useEventStats: () => ({
    data: eventStatsState.stats,
    isLoading: eventStatsState.isLoading,
  }),
}));

vi.mock('@/apis/axios', () => ({
  apiClient: {
    get: vi.fn(),
  },
}));

afterEach(() => {
  cleanup();
  authState.isAuthenticated = true;
  eventStatsState.stats = {
    total_events: 12,
    total_registrations: 88,
  };
  eventStatsState.isLoading = false;
  vi.mocked(apiClient.get).mockReset();
});

describe('Home dynamic data', () => {
  it('renders authenticated homepage stats from API-backed hooks', async () => {
    vi.mocked(apiClient.get).mockResolvedValueOnce({
      data: {
        pagination: { totalItems: 6 },
        data: [],
      },
    });

    renderWithProviders(<Stats />);

    expect(screen.getByText('12')).toBeInTheDocument();
    expect(screen.getByText('88')).toBeInTheDocument();
    await waitFor(() => expect(screen.getByText('6')).toBeInTheDocument());
    expect(screen.queryByText('500+')).not.toBeInTheDocument();
    expect(screen.queryByText('12k')).not.toBeInTheDocument();
  });

  it('uses neutral public placeholders instead of fake metrics when unauthenticated', () => {
    authState.isAuthenticated = false;

    renderWithProviders(<Stats />);

    expect(screen.getAllByText('Live')).toHaveLength(3);
    expect(apiClient.get).not.toHaveBeenCalled();
  });

  it('renders the next approved event in the hero card when available', async () => {
    vi.mocked(apiClient.get).mockResolvedValueOnce({
      data: {
        events: [
          {
            id: 1,
            title: 'Research Week Opening Ceremony',
            start_date: '2026-07-01T10:00:00.000Z',
          },
        ],
      },
    });

    renderWithProviders(<Hero />);

    await waitFor(() => {
      expect(screen.getByText('Research Week Opening Ceremony')).toBeInTheDocument();
    });
    expect(screen.queryByText(/Founder/i)).not.toBeInTheDocument();
  });

  it('shows a sign-in prompt in the hero card when public users cannot load events', () => {
    authState.isAuthenticated = false;

    renderWithProviders(<Hero />);

    expect(screen.getByText('Live Event Updates')).toBeInTheDocument();
    expect(screen.getByText('Sign in to view upcoming events')).toBeInTheDocument();
    expect(apiClient.get).not.toHaveBeenCalled();
  });
});

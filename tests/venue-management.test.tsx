import { cleanup, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import VenueManagement from '@/pages/Dashboard/admin/Venues';
import { renderWithProviders } from './test-utils';

const venueStatsState = vi.hoisted(() => ({
  stats: {
    total: 7,
    available: 4,
    maintenance: 2,
    occupied: 1,
    occupancyRate: 14,
  },
  isLoading: false,
}));

vi.mock('@/hooks/useVenue', () => ({
  useVenueStats: () => ({
    data: venueStatsState.stats,
    isLoading: venueStatsState.isLoading,
  }),
}));

vi.mock('@/features/dashboard/admin/VenueTable', () => ({
  default: () => <div data-testid="venue-table">Venue table</div>,
}));

afterEach(() => {
  cleanup();
  venueStatsState.stats = {
    total: 7,
    available: 4,
    maintenance: 2,
    occupied: 1,
    occupancyRate: 14,
  };
  venueStatsState.isLoading = false;
});

describe('VenueManagement', () => {
  it('renders venue stats from the venue stats hook', () => {
    renderWithProviders(<VenueManagement />);

    expect(screen.getByText('Total Venues')).toBeInTheDocument();
    expect(screen.getByText('07')).toBeInTheDocument();
    expect(screen.getByText('Available Now')).toBeInTheDocument();
    expect(screen.getByText('04')).toBeInTheDocument();
    expect(screen.getByText('In Maintenance')).toBeInTheDocument();
    expect(screen.getByText('02')).toBeInTheDocument();
    expect(screen.getByText('14%')).toBeInTheDocument();
    expect(screen.queryByText('42')).not.toBeInTheDocument();
    expect(screen.queryByText('74%')).not.toBeInTheDocument();
  });

  it('renders loading placeholders while stats are loading', () => {
    venueStatsState.isLoading = true;

    renderWithProviders(<VenueManagement />);

    expect(screen.getAllByText('...')).toHaveLength(4);
  });
});

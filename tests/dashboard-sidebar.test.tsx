import { cleanup, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { SidebarProvider } from '@/components/ui/sidebar';
import { DashboardSidebar } from '@/layouts/DashboardSidebar';
import { renderWithProviders } from './test-utils';
import { CalendarDays } from 'lucide-react';

const sessionState = vi.hoisted(() => ({
  currentSession: {
    id: 2,
    name: '2026/2027 Academic Session',
    code: '2026/2027',
    start_date: '2026-09-01',
    end_date: '2027-07-31',
    is_active: true,
    created_at: '2026-06-23',
    updated_at: '2026-06-23',
  },
}));

vi.mock('@/hooks/useAcademicData', () => ({
  useCurrentAcademicSession: () => ({
    data: sessionState.currentSession,
  }),
}));

afterEach(() => {
  cleanup();
  sessionState.currentSession = {
    id: 2,
    name: '2026/2027 Academic Session',
    code: '2026/2027',
    start_date: '2026-09-01',
    end_date: '2027-07-31',
    is_active: true,
    created_at: '2026-06-23',
    updated_at: '2026-06-23',
  };
});

describe('DashboardSidebar', () => {
  it('renders the active academic session from the API hook', () => {
    renderWithProviders(
      <SidebarProvider>
        <DashboardSidebar
          navItems={[
            {
              icon: CalendarDays,
              label: 'Calendar',
              path: '/dashboard/calendar',
            },
          ]}
        />
      </SidebarProvider>,
      { route: '/dashboard/calendar' },
    );

    expect(screen.getByText('Academic Session')).toBeInTheDocument();
    expect(screen.getByText('2026/2027')).toBeInTheDocument();
    expect(screen.queryByText('2025/2026')).not.toBeInTheDocument();
  });

  it('shows a neutral fallback when no current session is configured', () => {
    sessionState.currentSession = null as any;

    renderWithProviders(
      <SidebarProvider>
        <DashboardSidebar
          navItems={[
            {
              icon: CalendarDays,
              label: 'Calendar',
              path: '/dashboard/calendar',
            },
          ]}
        />
      </SidebarProvider>,
      { route: '/dashboard/calendar' },
    );

    expect(screen.getByText('Not set')).toBeInTheDocument();
  });
});

import { cleanup, fireEvent, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import Sessions from '@/pages/Dashboard/admin/Sessions';
import { renderWithProviders } from './test-utils';

const createSession = vi.hoisted(() => vi.fn());
const updateSession = vi.hoisted(() => vi.fn());
const setCurrentSession = vi.hoisted(() => vi.fn());
const deleteSession = vi.hoisted(() => vi.fn());

const sessionState = vi.hoisted(() => ({
  sessions: [
    {
      id: 1,
      name: '2025/2026 Academic Session',
      code: '2025/2026',
      start_date: '2025-09-01T00:00:00.000Z',
      end_date: '2026-07-31T00:00:00.000Z',
      is_active: true,
      created_at: '2025-01-01',
      updated_at: '2025-01-01',
    },
    {
      id: 2,
      name: '2026/2027 Academic Session',
      code: '2026/2027',
      start_date: '2026-09-01T00:00:00.000Z',
      end_date: '2027-07-31T00:00:00.000Z',
      is_active: false,
      created_at: '2026-01-01',
      updated_at: '2026-01-01',
    },
  ],
  isLoading: false,
}));

vi.mock('@/hooks/useAcademicData', () => ({
  useAcademicSessions: () => ({
    data: sessionState.sessions,
    isLoading: sessionState.isLoading,
  }),
  useCreateAcademicSession: () => ({
    mutateAsync: createSession,
    isPending: false,
  }),
  useUpdateAcademicSession: () => ({
    mutateAsync: updateSession,
    isPending: false,
  }),
  useSetCurrentAcademicSession: () => ({
    mutateAsync: setCurrentSession,
    isPending: false,
  }),
  useDeleteAcademicSession: () => ({
    mutateAsync: deleteSession,
    isPending: false,
  }),
}));

vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

afterEach(() => {
  cleanup();
  createSession.mockReset();
  updateSession.mockReset();
  setCurrentSession.mockReset();
  deleteSession.mockReset();
  sessionState.sessions = [
    {
      id: 1,
      name: '2025/2026 Academic Session',
      code: '2025/2026',
      start_date: '2025-09-01T00:00:00.000Z',
      end_date: '2026-07-31T00:00:00.000Z',
      is_active: true,
      created_at: '2025-01-01',
      updated_at: '2025-01-01',
    },
    {
      id: 2,
      name: '2026/2027 Academic Session',
      code: '2026/2027',
      start_date: '2026-09-01T00:00:00.000Z',
      end_date: '2027-07-31T00:00:00.000Z',
      is_active: false,
      created_at: '2026-01-01',
      updated_at: '2026-01-01',
    },
  ];
  sessionState.isLoading = false;
});

describe('Admin Sessions page', () => {
  it('renders existing sessions and highlights the current session', () => {
    renderWithProviders(<Sessions />);

    expect(screen.getByText('2025/2026 Academic Session')).toBeInTheDocument();
    expect(screen.getByText('2026/2027 Academic Session')).toBeInTheDocument();
    expect(screen.getAllByText('Current')).toHaveLength(2);
    expect(screen.getByRole('button', { name: /set current/i })).toBeInTheDocument();
  });

  it('creates a new session from form values', async () => {
    createSession.mockResolvedValueOnce({ success: true });
    renderWithProviders(<Sessions />);

    fireEvent.change(screen.getByPlaceholderText('2026/2027 Academic Session'), {
      target: { value: '2027/2028 Academic Session' },
    });
    fireEvent.change(screen.getByPlaceholderText('2026/2027'), {
      target: { value: '2027/2028' },
    });

    const dateInputs = screen.getAllByDisplayValue('');
    fireEvent.change(dateInputs[0], { target: { value: '2027-09-01' } });
    fireEvent.change(dateInputs[1], { target: { value: '2028-07-31' } });
    fireEvent.click(screen.getByRole('button', { name: /create session/i }));

    await waitFor(() => {
      expect(createSession).toHaveBeenCalledWith({
        name: '2027/2028 Academic Session',
        code: '2027/2028',
        start_date: '2027-09-01',
        end_date: '2028-07-31',
        is_active: false,
      });
    });
  });

  it('sets a non-current session as current', async () => {
    setCurrentSession.mockResolvedValueOnce({ success: true });
    renderWithProviders(<Sessions />);

    fireEvent.click(screen.getByRole('button', { name: /set current/i }));

    await waitFor(() => {
      expect(setCurrentSession).toHaveBeenCalledWith(2);
    });
  });
});

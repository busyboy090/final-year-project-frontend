import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  AccountActivityCard,
  ProfileIntegrityCard,
} from '@/components/profile/ProfileInsightCards';

const authState = vi.hoisted(() => ({
  user: {
    id: 1,
    role: 'student',
    first_name: 'Ada',
    last_name: 'Lovelace',
    email: 'ada@adun.edu.ng',
    created_at: '2026-01-01T09:00:00.000Z',
    updated_at: '2026-01-02T10:15:00.000Z',
  },
}));

const userState = vi.hoisted(() => ({
  profile: {
    first_name: 'Ada',
    last_name: 'Lovelace',
    email: 'ada@adun.edu.ng',
    phone: '08012345678',
    gender: 'female',
    matric_number: 'ADUN/FS/SEN/22/001',
    department_id: 3,
    level_id: 4,
    created_at: '2026-01-01T09:00:00.000Z',
    updated_at: '2026-06-23T10:15:00.000Z',
  },
}));

vi.mock('@/hooks/useAuth', () => ({
  default: () => authState,
}));

vi.mock('@/hooks/useUser', () => ({
  default: () => userState,
}));

afterEach(() => {
  cleanup();
  authState.user = {
    id: 1,
    role: 'student',
    first_name: 'Ada',
    last_name: 'Lovelace',
    email: 'ada@adun.edu.ng',
    created_at: '2026-01-01T09:00:00.000Z',
    updated_at: '2026-01-02T10:15:00.000Z',
  };
  userState.profile = {
    first_name: 'Ada',
    last_name: 'Lovelace',
    email: 'ada@adun.edu.ng',
    phone: '08012345678',
    gender: 'female',
    matric_number: 'ADUN/FS/SEN/22/001',
    department_id: 3,
    level_id: 4,
    created_at: '2026-01-01T09:00:00.000Z',
    updated_at: '2026-06-23T10:15:00.000Z',
  };
});

describe('ProfileInsightCards', () => {
  it('calculates profile integrity from completed student profile fields', () => {
    render(<ProfileIntegrityCard />);

    expect(screen.getByText('100%')).toBeInTheDocument();
    expect(screen.getByText(/your profile is complete/i)).toBeInTheDocument();
    expect(screen.queryByText(/add missing details/i)).not.toBeInTheDocument();
  });

  it('shows incomplete profile strength and action when fields are missing', () => {
    userState.profile = {
      ...userState.profile,
      phone: '',
      matric_number: '',
      level_id: null,
    };

    render(<ProfileIntegrityCard />);

    expect(screen.getByText('63%')).toBeInTheDocument();
    expect(screen.getByText(/complete the remaining profile fields/i)).toBeInTheDocument();
    expect(screen.getByText(/add missing details/i)).toBeInTheDocument();
  });

  it('renders real account activity date instead of a static last-login placeholder', () => {
    render(<AccountActivityCard />);

    expect(screen.getByText('Profile Updated')).toBeInTheDocument();
    expect(screen.getByText(/Jun 23, 2026/i)).toBeInTheDocument();
    expect(screen.queryByText(/Today, 10:45 AM/i)).not.toBeInTheDocument();
  });

  it('falls back to account-created activity when profile update date is unavailable', () => {
    userState.profile = {
      ...userState.profile,
      updated_at: undefined,
      created_at: '2026-02-01T08:00:00.000Z',
    };
    authState.user = {
      ...authState.user,
      updated_at: undefined,
      created_at: '2026-02-01T08:00:00.000Z',
    };

    render(<AccountActivityCard />);

    expect(screen.getByText('Account Created')).toBeInTheDocument();
    expect(screen.getByText(/Feb 01, 2026/i)).toBeInTheDocument();
  });
});

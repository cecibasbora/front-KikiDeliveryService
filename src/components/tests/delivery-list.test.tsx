import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import DeliveryList from '../delivery-list';
import React from 'react';

const mockFetchDeliveries = vi.fn();
const mockUseAuthState = vi.fn();

vi.mock('react-firebase-hooks/auth', () => ({
  useAuthState: vi.fn(() => [
    { uid: 'test-user', displayName: 'Test User' }, 
    false,
    null 
  ])
}));

vi.mock('firebase/auth', async (importOriginal) => {
  const actual = await importOriginal<typeof import('firebase/auth')>();
  return {
    ...actual,
    getAuth: vi.fn(() => ({})),
    GoogleAuthProvider: vi.fn(),
    signInWithPopup: vi.fn(),
    signOut: vi.fn()
  };
});

vi.mock('../service/firebase', () => ({
  auth: {}
}));

vi.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />
}));

vi.mock('../server/route', () => ({
  fetchDeliveries: mockFetchDeliveries
}));

vi.mock('next/image', () => ({
  default: (props: any) => <img {...props} />
}));

describe('DeliveryList', () => {
  const mockDelivery = {
    id: '1',
    customerName: 'John Doe',
    deliveryAddress: '123 Main St',
    deliveryDate: new Date().toISOString(),
    userId: 'user-123'
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows loading state', () => {
    mockUseAuthState.mockReturnValue([{ uid: 'user-123' }, false]);
    render(<DeliveryList />);
    expect(screen.getByText('Carregando...')).toBeTruthy();
  });
  
});
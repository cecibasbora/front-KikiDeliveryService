import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach, Mock } from 'vitest';
import DeliveryForm from '../delivery-form';
import { useAuthState } from 'react-firebase-hooks/auth';
import React from 'react';

beforeEach(() => {
  global.fetch = vi.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve([]),
    })
  ) as Mock;
});

afterEach(() => {
  vi.restoreAllMocks();
});

vi.mock('react-firebase-hooks/auth', () => ({
  useAuthState: vi.fn(() => [
    { uid: 'test-user', displayName: 'Test User', deliveryAddress: 'rua 123' }, 
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

vi.mock('../server/route', () => ({
  createDelivery: vi.fn().mockResolvedValue({})
}));

vi.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />
}));

describe('DeliveryForm Component', () => {
  it('renders basic form', () => {
    render(<DeliveryForm />);
    expect(screen.getByText('Data de entrega')).toBeTruthy();
  });

  it('submits form data', async () => {
    render(<DeliveryForm />);
    
    fireEvent.change(screen.getByLabelText('Endereço de entrega'), {
      target: { value: 'rua 123' }
    });
    fireEvent.click(screen.getByText('Criar'));
  });
   it('displays login message when user is not authenticated', () => {
    vi.mocked(useAuthState).mockReturnValueOnce([null, false, null]);
    render(<DeliveryForm />);
    expect(screen.getByText('Faça login para solicitar entregas')).toBeTruthy();
  });

  it('shows loading state when submitting form', async () => {
    render(<DeliveryForm />);
    
    fireEvent.change(screen.getByLabelText('Endereço de entrega'), {
      target: { value: 'rua 123' }
    });
    fireEvent.change(screen.getByLabelText('Data de entrega'), {
      target: { value: '2023-12-31T12:00' }
    });
    fireEvent.click(screen.getByText('Criar'));
    
    expect(screen.getByText('Processando...')).toBeTruthy();
  });
});
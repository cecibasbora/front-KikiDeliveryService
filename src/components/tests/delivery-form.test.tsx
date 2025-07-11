import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import DeliveryForm from '../delivery-form';
import React from 'react';

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
    expect(screen.getByText('Criar entrega')).toBeTruthy();
  });

  it('submits form data', async () => {
    render(<DeliveryForm />);
    
    fireEvent.change(screen.getByLabelText('Endereço de entrega'), {
      target: { value: 'rua 123' }
    });
    fireEvent.click(screen.getByText('Criar'));
  });
});
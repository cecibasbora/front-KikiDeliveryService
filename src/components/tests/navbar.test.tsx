import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, Mock, beforeEach } from 'vitest';
import Navbar from '../navbar';
import { useRouter } from 'next/navigation';
import { useAuthState } from 'react-firebase-hooks/auth';
import React from 'react';

vi.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />
}));

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn()
  }))
}));

vi.mock('react-firebase-hooks/auth', () => ({
  useAuthState: vi.fn()
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

describe('Navbar Component', () => {
  const mockPush = vi.fn();
  
  beforeEach(() => {
    (useRouter as Mock).mockReturnValue({ push: mockPush });
    (useAuthState as Mock).mockReturnValue([null, false]);
    vi.clearAllMocks();
  });

  it('renders logo and login button when not authenticated', () => {
    (useAuthState as Mock).mockReturnValue([null, false]);
    
    render(<Navbar />);
    
    expect(screen.getByAltText("Kiki's Delivery Logo")).toBeTruthy();
    expect(screen.getByText('Login')).toBeTruthy();
    expect(screen.queryByText('Criar entrega')).toBeNull();
  });

  it('renders user info and logout button when authenticated', () => {
    (useAuthState as Mock).mockReturnValue([{ 
      displayName: 'John Doe' 
    }, false]);
    
    render(<Navbar />);
    
    expect(screen.getByText('Olá, John!')).toBeTruthy();
    expect(screen.getByText('Sair')).toBeTruthy();
    expect(screen.getByText('Criar entrega')).toBeTruthy();
  });

});
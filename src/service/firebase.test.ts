import { describe, it, expect, vi, Mock, beforeAll } from 'vitest';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

vi.mock('firebase/app', () => ({
  initializeApp: vi.fn()
}));

vi.mock('firebase/auth', () => ({
  getAuth: vi.fn()
}));

describe('Firebase Initialization', () => {
  beforeAll(() => {
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY = 'test-api-key';
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN = 'test-auth-domain';
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID = 'test-project-id';
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET = 'test-storage-bucket';
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID = 'test-sender-id';
    process.env.NEXT_PUBLIC_FIREBASE_APP_ID = 'test-app-id';
    
    return import('./firebase');
  });

  it('should initialize Firebase with the correct config', () => {
    expect(initializeApp).toHaveBeenCalledWith({
      apiKey: 'test-api-key',
      authDomain: 'test-auth-domain',
      projectId: 'test-project-id',
      storageBucket: 'test-storage-bucket',
      messagingSenderId: 'test-sender-id',
      appId: 'test-app-id'
    });
  });

  it('should initialize auth with the app instance', () => {
    const mockApp = (initializeApp as Mock).mock.results[0].value;
    expect(getAuth).toHaveBeenCalledWith(mockApp);
  });

  it('should export the auth instance', async () => {
    const module = await import('./firebase');
    const mockAuth = (getAuth as Mock).mock.results[0].value;
    expect(module.auth).toBe(mockAuth);
  });
});
import { vi, describe, test, expect, beforeEach } from 'vitest';
import useDeliveryStore from './delivery-store';
import { fetchDeliveries } from '../server/route';
import type { Delivery } from '../server/route';

vi.mock('../server/route', () => ({
  fetchDeliveries: vi.fn()
}));

const mockDelivery: Delivery = { 
 id: '0001',
 customerName: 'Ursula',
 deliveryAddress: 'Rua da floresta, 231',
 deliveryDate: '2023-01-01',
 userId: 'Yd98Sdh' 
};

describe('Delivery Store', () => {
  beforeEach(() => {
    useDeliveryStore.setState({
      deliveries: [],
      isLoading: false,
      error: null
    });
    vi.clearAllMocks();
  });

  test('initial state is correct', () => {
    const state = useDeliveryStore.getState();
    expect(state.deliveries).toEqual([]);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });

  describe('fetchDeliveries', () => {
    test('successful fetch updates state correctly', async () => {
      vi.mocked(fetchDeliveries).mockResolvedValue([mockDelivery]);
      
      await useDeliveryStore.getState().fetchDeliveries('user1');
      
      const state = useDeliveryStore.getState();
      expect(state.deliveries).toEqual([mockDelivery]);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
    });

    test('handles errors correctly', async () => {
      vi.mocked(fetchDeliveries).mockRejectedValue(new Error('Network error'));
      
      await useDeliveryStore.getState().fetchDeliveries('user1');
      
      const state = useDeliveryStore.getState();
      expect(state.error).toBe('Network error');
      expect(state.isLoading).toBe(false);
      expect(state.deliveries).toEqual([]);
    });

    test('sets loading state during fetch', async () => {
      vi.mocked(fetchDeliveries).mockImplementation(
        () => new Promise(resolve => setTimeout(() => resolve([mockDelivery]), 100))
      );
      
      const promise = useDeliveryStore.getState().fetchDeliveries('user1');
      
      expect(useDeliveryStore.getState().isLoading).toBe(true);
      
      await promise;
      expect(useDeliveryStore.getState().isLoading).toBe(false);
    });
  });
});
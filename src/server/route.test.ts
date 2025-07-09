import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchDeliveries, createDelivery, Delivery } from './route';

const mockFetch = vi.fn();
global.fetch = mockFetch;

const mockDelivery: Delivery = {
  id: '0001',
  customerName: 'Ursula',
  deliveryAddress:'Rua da floresta, 231',
  deliveryDate: '2023-01-01',
  userId: 'Yd98Sdh&'
};

describe('API Functions', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  describe('fetchDeliveries', () => {
    it('should return deliveries on successful fetch', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([mockDelivery])
      });

      const result = await fetchDeliveries();
      expect(result).toEqual([mockDelivery]);
      expect(fetch).toHaveBeenCalledWith('http://localhost:3333/entregas');
    });

    it('should throw error on failed fetch', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false
      });
      await expect(fetchDeliveries()).rejects.toThrow('Failed to fetch deliveries');
    });
  });

  describe('createDelivery', () => {
    it('should create and return a delivery', async () => {
      const newDelivery = {
        customerName: 'Jane Doe',
        deliveryAddress: '456 Oak Ave',
        deliveryDate: '2023-01-02',
        userId: 'Yd98Sdh3&'
      };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockDelivery)
      });

      const result = await createDelivery(newDelivery);
      expect(result).toEqual(mockDelivery);
      expect(fetch).toHaveBeenCalledWith('http://localhost:3333', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newDelivery)
      });
    });

    it('should throw error on failed creation', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false
      });

      await expect(createDelivery({
        customerName: 'Fail',
        deliveryAddress: 'Error St',
        deliveryDate: '2023-01-01',
        userId: '2T72hJx'
      })).rejects.toThrow('Failed to create delivery');
    });
  });
});
import { describe, it, expect, vi, Mock, beforeEach } from 'vitest';
import { fetchDeliveries, createDelivery } from './route';

beforeEach(() => {
  global.fetch = vi.fn();
});

describe('fetchDeliveries', () => {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const testUserId = 'Yd98Sdh&';
  
  it('gets filtered deliveries from the API using userId', async () => {
    const mockData = [{  
      id: '0001',
      customerName: 'Ursula',
      deliveryAddress: 'Rua da floresta, 231',
      deliveryDate: '2023-01-01',
      userId: testUserId 
    }];
    
    (fetch as Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockData),
    });

    const result = await fetchDeliveries(testUserId);
    
    expect(result).toEqual(mockData);
    expect(fetch).toHaveBeenCalledWith(
      `${API_BASE_URL}/entregas/${testUserId}`
    );
  });

  it('throws error when request fails', async () => {
    (fetch as Mock).mockResolvedValue({ ok: false });
    await expect(fetchDeliveries(testUserId))
      .rejects.toThrow('Failed to fetch deliveries');
  });
});


describe('createDelivery', () => {
  it('sends new delivery to the API', async () => {
    const newDelivery = { 
        customerName: 'Tombo',
        deliveryAddress:'Rua da floresta, 231',
        deliveryDate: '2024-02-01',
        userId: 'Yd98Sdh&'
     };
    const mockResponse = { id: '2', ...newDelivery };
    
    (fetch as Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });

    const result = await createDelivery(newDelivery);
    expect(result).toEqual(mockResponse);
    expect(fetch).toHaveBeenCalledWith(process.env.NEXT_PUBLIC_API_BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newDelivery),
    });
  });

  it('throws error when creation fails', async () => {
    (fetch as Mock).mockResolvedValue({ ok: false });
    await expect(createDelivery({} as any)).rejects.toThrow('Failed to create delivery');
  });
});
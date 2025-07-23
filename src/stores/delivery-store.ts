import { create } from 'zustand';
import { fetchDeliveries } from '../server/route';
import type { Delivery } from '../server/route';

type DeliveryStoreState = {
  deliveries: Delivery[];
  isLoading: boolean;
  error: string | null;
  fetchDeliveries: (userId: string) => Promise<void>;
  getDeliveryById: (id: string) => Delivery | undefined;
};

const useDeliveryStore = create<DeliveryStoreState>((set, get) => ({
  deliveries: [],
  isLoading: false,
  error: null,
  
  fetchDeliveries: async (userId) => {
    set({ isLoading: true, error: null });
    try {
      const deliveries = await fetchDeliveries(userId);
      set({ deliveries, isLoading: false });
    } catch (err) {
      set({ error: (err as Error).message, isLoading: false });
    }
  },

  getDeliveryById: (id) => {
    return get().deliveries.find(delivery => delivery.id === id);
  }
}));

export default useDeliveryStore;
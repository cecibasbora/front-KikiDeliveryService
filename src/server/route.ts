export interface Delivery {
  id: string;
  customerName: string;
  deliveryAddress: string;
  deliveryDate: string;
  userId: string; 
}

export async function fetchDeliveries(userId: string): Promise<Delivery[]> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/entregas/${userId}`); 
  if (!response.ok) throw new Error('Failed to fetch deliveries');
  return response.json();
}

export async function createDelivery(deliveryData: Omit<Delivery, 'id'>): Promise<Delivery> {
  const response = await fetch(process.env.NEXT_PUBLIC_API_BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(deliveryData),
  });
  if (!response.ok) throw new Error('Failed to create delivery');
  return response.json();
}  

export async function deleteDelivery(id: string): Promise<void> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/entregas/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  
  if (!response.ok) throw new Error('Failed to delete delivery');
  return;
}
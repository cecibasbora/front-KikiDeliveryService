'use client';

import { useEffect, useState } from 'react';
import { fetchDeliveries, Delivery } from '../server/route';
import styles from '../styles/delivery-list.module.css'
import Image from 'next/image';

export default function DeliveryList() {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadDeliveries() {
      try {
        const data = await fetchDeliveries();
        setDeliveries(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }
    loadDeliveries();
  }, []);

  if (loading) return <div>Loading deliveries...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className={styles.container}>   
      <h2 className={styles.title}>
        <Image 
            src="/package-icon.png" 
            alt="Kiki's Delivery Logo" 
            width={30}
            height={30}
        />     
        <>     </>
         Lista de entregas
       </h2>
      <ul className={styles.list}>
        {deliveries.map((delivery) => (
          <li key={delivery.id} className={styles.listItem}>
            <div className="flex justify-between items-center">
              <div className={styles.deliveryInfo}>
                <h3 className={styles.customerName}>{delivery.customerName}</h3>
                <p className={styles.deliveryDetail}>{delivery.deliveryAddress}</p>
                <p className={styles.deliveryDetail}>
                  {new Date(delivery.deliveryDate).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
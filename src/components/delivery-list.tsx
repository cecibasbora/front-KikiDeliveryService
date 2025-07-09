'use client';

import { useEffect, useState } from 'react';
import { fetchDeliveries, Delivery } from '../server/route';
import styles from '../styles/delivery-list.module.css';
import Image from 'next/image';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../service/firebase';

export default function DeliveryList() {
  const [user] = useAuthState(auth);
  const [allDeliveries, setAllDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const userDeliveries = allDeliveries.filter(delivery => delivery.userId === user?.uid);

  useEffect(() => {
    async function loadAllDeliveries() {
      try {
        const data = await fetchDeliveries();
        setAllDeliveries(data);
      } catch (err) {
        console.error('Fetch error:', err);
        setError('Erro ao carregar entregas. Tente novamente.');
      } finally {
        setLoading(false);
      }
    }

    loadAllDeliveries();
  }, []);

  if (!user) return <div className={styles.container}>Faça login para visualizar suas entregas</div>;
  if (loading) return <div className={styles.container}>Carregando...</div>;
  if (error) return <div className={styles.container}>{error}</div>;

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>
        <Image 
          src="/package-icon.png" 
          alt="Ícone de entregas" 
          width={30}
          height={30}
        />
        Minhas Entregas
      </h2>
      
      {userDeliveries.length === 0 ? (
        <p className={styles.emptyMessage}>Nenhuma entrega registrada</p>
      ) : (
        <ul className={styles.list}>
          {userDeliveries.map((delivery) => (
            <li key={delivery.id} className={styles.listItem}>
              <div className={styles.deliveryInfo}>
                <h3>{delivery.customerName}</h3>
                <p>Endereço: {delivery.deliveryAddress}</p>
                <p>
                  Data: {new Date(delivery.deliveryDate).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
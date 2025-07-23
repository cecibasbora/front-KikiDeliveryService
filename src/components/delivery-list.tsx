'use client';
import React, { useEffect, useState } from 'react';
import { deleteDelivery } from '../server/route';
import styles from '../styles/delivery-list.module.css';
import Image from 'next/image';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../service/firebase';
import Link from 'next/link';
import useDeliveryStore from '../stores/delivery-store'; 

export default function DeliveryList() {
  const [user] = useAuthState(auth);
  const [deletingId, setDeletingId] = useState<string | null>(null); 
  const [error, setError] = useState<string | null>(null);
  const { deliveries, isLoading, fetchDeliveries } = useDeliveryStore();

   // Usando Zustand para acessar as entregas
  useEffect(() => {
    if (user?.uid) {
      fetchDeliveries(user.uid);
    }
  }, [user, fetchDeliveries]);

  //Pretendo usar a loja do zustand para os outros métodos
  const handleDelete = async (deliveryId: string) => {
    if (!window.confirm('Tem certeza que deseja excluir esta entrega?')) return;
    try {
      setDeletingId(deliveryId);
      await deleteDelivery(deliveryId);
      if (user?.uid) fetchDeliveries(user.uid);
    } catch (err) {
      console.error('Delete error:', err);
      setError('Erro ao excluir entrega. Tente novamente.');
    } finally {
      setDeletingId(null);
    }
  };

  if (!user) return <div className={styles.container}>Faça login para visualizar suas entregas</div>;
  if (isLoading) return <div className={styles.container}>Carregando...</div>;
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
      
      {deliveries.length === 0 ? (
        <p className={styles.emptyMessage}>Nenhuma entrega registrada</p>
      ) : (
        <ul className={styles.list}>
          {deliveries.map((delivery) => (
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
              <Link href={`/editar-entrega/${delivery.id}`}>
                <button className={styles.editButton}>
                  Editar
                </button>
              </Link>
              <button
                onClick={() => handleDelete(delivery.id)}
                disabled={deletingId === delivery.id}
                className={styles.deleteButton}
              >
                {deletingId === delivery.id ? 'Excluindo...' : 'Excluir'}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
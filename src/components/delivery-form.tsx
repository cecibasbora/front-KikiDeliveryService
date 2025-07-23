'use client';
import { useState, useEffect } from 'react';
import { createDelivery } from "../server/route";
import styles from '../styles/delivery-form.module.css';
import Image from 'next/image';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../service/firebase';
import React from 'react';
import useDeliveryStore from '../stores/delivery-store'; 

interface FormState {
  deliveryAddress: string;
  deliveryDate: string;
}

export default function DeliveryForm() {
   const [user] = useAuthState(auth);
  const [form, setForm] = useState<FormState>({
    deliveryAddress: '',
    deliveryDate: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showNewAddress, setShowNewAddress] = useState(false);

   // Usando Zustand para acessar as entregas
  const { deliveries, fetchDeliveries } = useDeliveryStore();
  const savedAddresses = [...new Set(deliveries.map(d => d.deliveryAddress))];

  useEffect(() => {
    if (user?.uid && deliveries.length === 0) {
      fetchDeliveries(user.uid);
    }
  }, [user, fetchDeliveries, deliveries.length]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);
  //Pretendo usar a loja do zustand para os outros métodos
    try {
      await createDelivery({
        ...form,
        deliveryDate: new Date(form.deliveryDate).toISOString(),
        userId: user?.uid || '',
        customerName: user?.displayName || ''
      });
      setSuccess(true);
      setForm({
        deliveryAddress: '',
        deliveryDate: '',
      });
      setShowNewAddress(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create delivery');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseNotification = () => {
    setError(null);
    setSuccess(false);
  };

  if (!user) return <div className={styles.container}>Faça login para solicitar entregas</div>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        <Image 
          src="/delivery-icon.png" 
          alt="Kiki's Delivery Logo" 
          width={40}
          height={40}
        />        
        Criar entrega
      </h1>
      
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="deliveryAddress" className={styles.label}>
            Endereço de entrega
          </label>
          
          {!showNewAddress && savedAddresses.length > 0 ? (
            <>
              <select
                id="deliveryAddress"
                value={form.deliveryAddress}
                onChange={(e) => setForm({...form, deliveryAddress: e.target.value})}
                required
                disabled={isSubmitting}
                className={styles.input}
              >
                <option value="">Selecione um endereço salvo</option>
                {savedAddresses.map((address) => (
                  <option key={address} value={address}>{address}</option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => setShowNewAddress(true)}
                className={styles.addAddressButton}
              >
                + Adicionar novo endereço
              </button>
            </>
          ) : (
            <>
              <input
                id="deliveryAddress"
                type="text"
                value={form.deliveryAddress}
                onChange={(e) => setForm({...form, deliveryAddress: e.target.value})}
                required
                disabled={isSubmitting}
                className={styles.input}
                placeholder="Digite o endereço completo"
              />
              {savedAddresses.length > 0 && (
                <button
                  type="button"
                  onClick={() => setShowNewAddress(false)}
                  className={styles.useSavedButton}
                >
                  Usar endereço salvo
                </button>
              )}
            </>
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="deliveryDate" className={styles.label}>
            Data de entrega
          </label>
          <input
            id="deliveryDate"
            type="datetime-local"
            value={form.deliveryDate}
            onChange={(e) => setForm({...form, deliveryDate: e.target.value})}
            required
            disabled={isSubmitting}
            className={styles.input}
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={styles.submitButton}
        >
          {isSubmitting ? 'Processando...' : 'Criar'}
        </button>
      </form>

      {error && (
        <div className={`${styles.notification} ${styles.errorNotification}`}>
          <span>⚠️</span>
          <span>{error}</span>
          <button 
            onClick={handleCloseNotification}
            className={styles.closeButton}
          >
            ×
          </button>
        </div>
      )}
      {success && (
        <div className={`${styles.notification} ${styles.successNotification}`}>
          <span>✓</span>
          <span>Entrega criada com sucesso!</span>
          <button 
            onClick={handleCloseNotification}
            className={styles.closeButton}
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}
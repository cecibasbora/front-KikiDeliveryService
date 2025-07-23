'use client';
import { useState, useEffect } from 'react';
import { updateDelivery, fetchDeliveries } from "../server/route";
import styles from '../styles/delivery-form.module.css';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../service/firebase';
import React from 'react';

interface FormState {
  deliveryAddress: string;
  deliveryDate: string;
}

export default function EditEvent() {
  const [user] = useAuthState(auth);
  const [form, setForm] = useState<FormState>({
    deliveryAddress: '',
    deliveryDate: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState<string[]>([]);
  const [showNewAddress, setShowNewAddress] = useState(false);
  const [deliveryId, setDeliveryId] = useState<string>(''); 

  useEffect(() => {
    if (user?.uid) {
      fetchDeliveries(user.uid).then(deliveries => {
        const addresses = [...new Set(deliveries.map(d => d.deliveryAddress))];
        setSavedAddresses(addresses);
        
        if (deliveries.length > 0) {
          const firstDelivery = deliveries[0];
          setDeliveryId(firstDelivery.id);
          setForm({
            deliveryAddress: firstDelivery.deliveryAddress,
            deliveryDate: firstDelivery.deliveryDate.split('T')[0] + 'T' + 
                         firstDelivery.deliveryDate.split('T')[1].slice(0, 5)
          });
        }
      });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      await updateDelivery(deliveryId, {
        deliveryAddress: form.deliveryAddress,
        deliveryDate: new Date(form.deliveryDate).toISOString()
      });
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update delivery');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseNotification = () => {
    setError(null);
    setSuccess(false);
  };

  if (!user) return <div className={styles.container}>Faça login para editar entregas</div>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>      
        Editar entrega
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
          {isSubmitting ? 'Salvando...' : 'Salvar alterações'}
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
          <span>Entrega atualizada com sucesso!</span>
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
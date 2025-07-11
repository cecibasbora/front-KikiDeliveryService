'use client';
import { useState } from 'react';
import { createDelivery } from "../server/route";
import styles from '../styles/delivery-form.module.css';
import Image from 'next/image';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../service/firebase';
import React from 'react';

interface FormState {
  // customerName: string;
  deliveryAddress: string;
  deliveryDate: string;
}

export default function DeliveryForm() {
  const [user] = useAuthState(auth);
  const [form, setForm] = useState<FormState>({
    // customerName: '',
    deliveryAddress: '',
    deliveryDate: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

   try {
      await createDelivery({
        ...form,
        deliveryDate: new Date(form.deliveryDate).toISOString(),
        userId: user.uid,
        customerName: user.displayName
      });
      setSuccess(true);
      setForm({
        // customerName: '',
        deliveryAddress: '',
        deliveryDate: '',
      });
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
        {/* <div className={styles.formGroup}>
          <label htmlFor="customerName" className={styles.label}>
            Nome do cliente
          </label>
          <input
            id="customerName"
            type="text"
            value={form.customerName}
            onChange={(e) => setForm({...form, customerName: e.target.value})}
            required
            disabled={isSubmitting}
            className={styles.input}
          />
        </div> */}

        <div className={styles.formGroup}>
          <label htmlFor="deliveryAddress" className={styles.label}>
            Endereço de entrega
          </label>
          <input
            id="deliveryAddress"
            type="text"
            value={form.deliveryAddress}
            onChange={(e) => setForm({...form, deliveryAddress: e.target.value})}
            required
            disabled={isSubmitting}
            className={styles.input}
          />
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
          {isSubmitting ? (
            <>
              <span className="spinner"></span>
              Processando...
            </>
          ) : 'Criar'}
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
import React from 'react';
import Navbar from '../components/navbar';
import styles from '../styles/homepage.module.css';
import EditDeliveryForm from '../components/edit-delivery';

const editarEntrega: React.FC = () => {
  return (
    <div className={styles.container}>
      <Navbar />
      <br/>
      <EditDeliveryForm />
    </div>
  );
};

export default editarEntrega;
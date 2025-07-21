import React from 'react';
import Navbar from '../components/navbar';
import styles from '../styles/homepage.module.css';
import EditForms from '../components/edit-delivery';

const editarEntrega: React.FC = () => {
  return (
    <div className={styles.container}>
      <Navbar />
      
      <div className={styles.messageBox}>
        <EditForms />
      </div>
    </div>
  );
};

export default editarEntrega;
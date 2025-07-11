import React from 'react';
import Navbar from '../components/navbar';
import styles from '../styles/homepage.module.css';

const HomePage: React.FC = () => {
  return (
    <div className={styles.container}>
      <Navbar />
      
      <div className={styles.messageBox}>
        <h1 className={styles.title}>
          Bem-vinde ao serviço de entregas da Kiki!
        </h1>
        <p className={styles.subtitle}>
          Entregas mágicas por toda a cidade
        </p>
      </div>
    </div>
  );
};

export default HomePage;
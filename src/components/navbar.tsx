'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect } from 'react';
import styles from '../styles/navbar.module.css';

export default function Navbar() {
    useEffect(() => {
      document.body.style.margin = '0';
      document.body.style.padding = '0';
      
      return () => {
        document.body.style.margin = '';
        document.body.style.padding = '';
      };
    }, []);
  return (
    <nav className={styles.nav}>
      <div className={styles.logoContainer}>
        <Link href="/">
          <Image 
            src="/logo.png" 
            alt="Kiki's Delivery Logo" 
            width={140}
            height={80}
            className={styles.logo}
          />
        </Link>
      </div>
      <div>
        <Link 
          href="/formulario-entrega" 
          className={styles.navLink}
        >
          <Image 
            src="/delivery-icon.png" 
            alt="Delivery Icon" 
            width={35}
            height={35}
          />
          <span>Criar entrega</span>
        </Link>
      </div>
    </nav>
  );
}
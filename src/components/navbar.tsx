'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect } from 'react';
import styles from '../styles/navbar.module.css';
import { signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { auth } from '../service/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const [user] = useAuthState(auth);
  const router = useRouter();

  useEffect(() => {
    document.body.style.margin = '0';
    document.body.style.padding = '0';

    if (user && typeof window !== 'undefined' && window.location.pathname === '/') {
      router.push('/entregas');
    }
    
    return () => {
      document.body.style.margin = '';
      document.body.style.padding = '';
    };
  }, [user, router]);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Erro ao fazer login com Google", error);
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
    router.push('/');
  };

  return (
     <nav className={styles.nav}>
      <div className={styles.leftSection}>
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

        {user && (
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
        )}
      </div>

      <div className={styles.navActions}>
        
        {user ? (
          <div className={styles.profileContainer}>
            <div className={styles.userInfo}>
              <span className={styles.userName}>Olá, {user.displayName?.split(' ')[0]}!</span>
            </div>
            <button onClick={handleSignOut} className={styles.logoutButton}>
              Sair
            </button>
          </div>
        ) : (
          <button onClick={signInWithGoogle} className={styles.loginButton}>
            <span>Login</span>
          </button>
        )}
      </div>
    </nav>
  );
}
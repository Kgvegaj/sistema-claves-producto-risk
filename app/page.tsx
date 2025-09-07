
import Link from 'next/link';
import styles from '../styles/Home.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.icon}>
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"></path>
          </svg>
        </div>
        <h1 className={styles.title}>Sistema de Gestión de Claves</h1>
        <p className={styles.description}>Sistema para administrar claves de producto de forma segura</p>
        <Link href="/login" className={styles.button}>
          Iniciar Sesión
        </Link>
      </div>
    </div>
  );
}
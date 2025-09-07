
import ProductKeysManager from '../../components/ProductKeysManager';
import styles from '../../styles/Dashboard.module.css';

export default function Dashboard() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div>
            <h1 className={styles.title}>Panel de Administración</h1>
            <p className={styles.subtitle}>Gestiona las claves de producto del sistema</p>
          </div>
        </div>
      </header>
      
      <main className={styles.main}>
        <ProductKeysManager />
      </main>
    </div>
  );
}
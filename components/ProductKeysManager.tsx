// ProductKeysManager.tsx - Versión corregida
'use client';

import { useState, useEffect, useCallback } from 'react';
import styles from '../styles/Dashboard.module.css';

interface ProductKey {
  id: string;
  key_value: string;
  is_active: boolean;
  created_at: string;
  activated_at: string | null;
  device_id: string | null;
  valid_until: string | null;
}

export default function ProductKeysManager() {
  const [keys, setKeys] = useState<ProductKey[]>([]);
  const [newKey, setNewKey] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [editingValidUntil, setEditingValidUntil] = useState<{id: string, date: string} | null>(null);

  const fetchKeys = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/keys');
      if (response.ok) {
        const data = await response.json();
        setKeys(data);
      }
    } catch (error) {
      console.error('Error fetching keys:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const checkExpiredKeys = useCallback(async () => {
    try {
      const response = await fetch('/api/keys/check-expired', {
        method: 'POST'
      });
      
      if (response.ok) {
        const result = await response.json();
        if (result.expiredCount > 0) {
          fetchKeys();
        }
      }
    } catch (error) {
      console.error('Error checking expired keys:', error);
    }
  }, [fetchKeys]);

  useEffect(() => {
    fetchKeys();
    
    const interval = setInterval(checkExpiredKeys, 60000);
    return () => clearInterval(interval);
  }, [fetchKeys, checkExpiredKeys]);

  const generateKey = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/keys/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setMessage('Clave generada correctamente');
        setNewKey(data.key);
        fetchKeys();
        
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('Error generando la clave');
      }
    } catch (error) {
      setMessage('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  const toggleKeyStatus = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch('/api/keys/toggle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, status: !currentStatus }),
      });
      
      if (response.ok) {
        setMessage('Estado actualizado correctamente');
        fetchKeys();
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('Error actualizando el estado');
      }
    } catch (error) {
      setMessage('Error de conexión');
    }
  };

  const deleteKey = async (id: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar esta clave? Esta acción no se puede deshacer.')) {
      return;
    }
    
    try {
      const response = await fetch('/api/keys/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });
      
      if (response.ok) {
        setMessage('Clave eliminada correctamente');
        fetchKeys();
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('Error eliminando la clave');
      }
    } catch (error) {
      setMessage('Error de conexión');
    }
  };

  const updateValidUntil = async (id: string, date: string) => {
    try {
      const response = await fetch('/api/keys/update-valid-until', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, validUntil: date }),
      });
      
      if (response.ok) {
        setMessage('Fecha de validez actualizada correctamente');
        setEditingValidUntil(null);
        fetchKeys();
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('Error actualizando la fecha de validez');
      }
    } catch (error) {
      setMessage('Error de conexión');
    }
  };

  const startEditing = (id: string, currentDate: string | null) => {
    setEditingValidUntil({
      id,
      date: currentDate ? new Date(currentDate).toISOString().split('T')[0] : ''
    });
  };

  const cancelEditing = () => {
    setEditingValidUntil(null);
  };

  const saveEditing = () => {
    if (editingValidUntil) {
      updateValidUntil(editingValidUntil.id, editingValidUntil.date);
    }
  };

  return (
    <div>
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Generar Nueva Clave</h2>
        <button 
          onClick={generateKey}
          disabled={loading}
          className={styles.generateButton}
        >
          {loading ? (
            <>
              <div className={styles.loadingSpinner}></div>
              Generando...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              Generar Nueva Clave
            </>
          )}
        </button>
        
        {newKey && (
          <div className={styles.newKey}>
            <p className={styles.newKeyTitle}>¡Nueva clave generada!</p>
            <div className={styles.keyValue}>
              <code style={{color: '#2c3e50'}}>{newKey}</code>
              <button 
                onClick={() => navigator.clipboard.writeText(newKey)}
                className={styles.copyButton}
                title="Copiar al portapapeles"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                </svg>
              </button>
            </div>
          </div>
        )}
      </section>

      {message && (
        <div className={`${styles.message} ${message.includes('Error') ? styles.messageError : styles.messageSuccess}`}>
          {message.includes('Error') ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          )}
          {message}
        </div>
      )}

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Claves de Producto</h2>
        
        {loading ? (
          <div className={styles.loading}>
            <div className={styles.loadingSpinner}></div>
            <p>Cargando claves...</p>
          </div>
        ) : keys.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"></path>
              </svg>
            </div>
            <h3>No hay claves de producto</h3>
            <p>Comienza generando tu primera clave de producto.</p>
          </div>
        ) : (
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Clave</th>
                  <th>Estado</th>
                  <th>Creada</th>
                  <th>Activada</th>
                  <th>Dispositivo</th>
                  <th>Válida hasta</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {keys.map((key) => (
                  <tr key={key.id} className={styles.tableRow}>
                    <td>
                      <code>{key.key_value}</code>
                    </td>
                    <td>
                      <span className={`${styles.status} ${key.is_active ? styles.statusActive : styles.statusInactive}`}>
                        {key.is_active ? 'Activa' : 'Inactiva'}
                      </span>
                    </td>
                    <td>{new Date(key.created_at).toLocaleDateString()}</td>
                    <td>{key.activated_at ? new Date(key.activated_at).toLocaleDateString() : 'No activada'}</td>
                    <td>{key.device_id || 'N/A'}</td>
                    <td>
                      {editingValidUntil?.id === key.id ? (
                        <div className={styles.editContainer}>
                          <input
                            type="date"
                            value={editingValidUntil.date}
                            onChange={(e) => setEditingValidUntil({
                              ...editingValidUntil,
                              date: e.target.value
                            })}
                            className={styles.dateInput}
                          />
                          <div className={styles.editButtons}>
                            <button onClick={saveEditing} className={styles.saveButton}>
                              ✓
                            </button>
                            <button onClick={cancelEditing} className={styles.cancelButton}>
                              ✗
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className={styles.dateDisplay}>
                          {key.valid_until ? new Date(key.valid_until).toLocaleDateString() : 'Indefinida'}
                          <button 
                            onClick={() => startEditing(key.id, key.valid_until)}
                            className={styles.editButton}
                            title="Editar fecha"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                            </svg>
                          </button>
                        </div>
                      )}
                    </td>
                    <td>
                      <div className={styles.actionButtons}>
                        <button
                          onClick={() => toggleKeyStatus(key.id, key.is_active)}
                          className={styles.toggleButton}
                        >
                          {key.is_active ? 'Desactivar' : 'Activar'}
                        </button>
                        <button
                          onClick={() => deleteKey(key.id)}
                          className={styles.deleteButton}
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
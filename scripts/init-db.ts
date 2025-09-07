// init-db.ts - Modificado para incluir la columna valid_until
import { createClient } from '@libsql/client';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Cargar variables de entorno desde .env.local
dotenv.config({ path: resolve(__dirname, '../.env.local') });

if (!process.env.TURSO_DATABASE_URL || !process.env.TURSO_AUTH_TOKEN) {
  throw new Error('Las variables de entorno TURSO_DATABASE_URL y TURSO_AUTH_TOKEN son requeridas');
}

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

async function initDatabase() {
  try {
    // Tabla de usuarios para el sistema de claves
    await client.execute(`
      CREATE TABLE IF NOT EXISTS admin_users (
        id TEXT PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Tabla de claves de producto
    await client.execute(`
      CREATE TABLE IF NOT EXISTS product_keys (
        id TEXT PRIMARY KEY,
        key_value TEXT UNIQUE NOT NULL,
        is_active BOOLEAN DEFAULT TRUE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        activated_at DATETIME,
        device_id TEXT,
        valid_until DATETIME
      )
    `);

    console.log('Base de datos inicializada correctamente');
  } catch (error) {
    console.error('Error inicializando la base de datos:', error);
  } finally {
    client.close();
  }
}

initDatabase();
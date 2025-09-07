import { createClient } from '@libsql/client';
import * as bcrypt from 'bcrypt';
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

async function createAdminUser() {
  try {
    const username = 'sys.claves.manager';
    const password = 'B3@nF8!qT1$yK5*zM7&wJ2';  
    const passwordHash = await bcrypt.hash(password, 10);
    
    await client.execute({
      sql: "INSERT OR IGNORE INTO admin_users (id, username, password_hash) VALUES (?, ?, ?)",
      args: ['1', username, passwordHash]
    });
    
    console.log('Usuario administrador creado:');
    console.log('Usuario: sys.claves.manager');
    console.log('Contraseña: B3@nF8!qT1$yK5*zM7&wJ2');
    console.log('¡Cambia estas credenciales en producción!');
  } catch (error) {
    console.error('Error creando usuario administrador:', error);
  } finally {
    client.close();
  }
}

createAdminUser();
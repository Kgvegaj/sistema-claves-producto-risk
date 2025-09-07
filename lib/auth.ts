import { Lucia } from 'lucia';
import { LibSQLAdapter } from '@lucia-auth/adapter-sqlite';
import client from './db';

const adapter = new LibSQLAdapter(client, {
  user: "admin_users",
  session: "user_sessions"
});

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      secure: process.env.NODE_ENV === "production"
    }
  },
  getUserAttributes: (attributes) => {
    return {
      // Aquí defines los atributos adicionales del usuario si los tienes
      username: attributes.username
    };
  }
});

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: {
      username: string;
      // añade otros atributos que tengas en tu tabla de usuarios
    };
  }
}
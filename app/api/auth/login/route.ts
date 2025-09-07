import { NextResponse } from 'next/server';
import client from '../../../../lib/db';
import * as bcrypt from 'bcrypt';

interface LoginRequest {
  username: string;
  password: string;
}

interface DatabaseUser {
  id: string;
  username: string;
  password_hash: string;
  created_at: string;
}

export async function POST(request: Request) {
  try {
    const { username, password }: LoginRequest = await request.json();

    const result = await client.execute({
      sql: "SELECT * FROM admin_users WHERE username = ?",
      args: [username]
    });

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 401 });
    }

    // Mapear manualmente los campos
    const row = result.rows[0];
    const user: DatabaseUser = {
      id: row.id as string,
      username: row.username as string,
      password_hash: row.password_hash as string,
      created_at: row.created_at as string
    };
    
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    
    if (!isValidPassword) {
      return NextResponse.json({ error: 'Contraseña incorrecta' }, { status: 401 });
    }

    const response = NextResponse.json({ success: true });
    response.cookies.set('auth_session', 'valid_session_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
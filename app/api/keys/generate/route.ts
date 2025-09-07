import { NextResponse } from 'next/server';
import client from '../../../../lib/db';
import { v4 as uuidv4 } from 'uuid';

export async function POST() {
  try {
    const newKey = `RISK-${Math.random().toString(36).substring(2, 10).toUpperCase()}-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
    const keyId = uuidv4();
    
    await client.execute({
      sql: "INSERT INTO product_keys (id, key_value) VALUES (?, ?)",
      args: [keyId, newKey]
    });

    return NextResponse.json({ key: newKey });
  } catch (error) {
    console.error('Error generating key:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
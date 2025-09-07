import { NextResponse } from 'next/server';
import client from '../../../lib/db';

export async function GET() {
  try {
    const result = await client.execute("SELECT * FROM product_keys ORDER BY created_at DESC");
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching keys:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
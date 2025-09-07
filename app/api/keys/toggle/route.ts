import { NextRequest, NextResponse } from 'next/server';
import client from '../../../../lib/db';

export async function POST(request: NextRequest) {
  try {
    const { id, status } = await request.json();
    
    await client.execute({
      sql: "UPDATE product_keys SET is_active = ? WHERE id = ?",
      args: [status, id]
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error toggling key status:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
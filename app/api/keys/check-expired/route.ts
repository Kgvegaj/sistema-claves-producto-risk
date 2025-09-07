import { NextResponse } from 'next/server';
import client from '../../../../lib/db';

export async function POST() {
  try {
    const now = new Date().toISOString();
    
    const expiredKeys = await client.execute({
      sql: "SELECT * FROM product_keys WHERE valid_until IS NOT NULL AND valid_until < ? AND is_active = TRUE",
      args: [now]
    });

    if (expiredKeys.rows.length > 0) {
      await client.execute({
        sql: "UPDATE product_keys SET is_active = FALSE WHERE valid_until IS NOT NULL AND valid_until < ? AND is_active = TRUE",
        args: [now]
      });
    }

    return NextResponse.json({ 
      success: true,
      expiredCount: expiredKeys.rows.length
    });

  } catch (error) {
    console.error('Error checking expired keys:', error);
    return NextResponse.json({ 
      error: 'Error interno del servidor' 
    }, { status: 500 });
  }
}
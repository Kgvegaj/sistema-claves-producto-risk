import { NextResponse } from 'next/server';
import client from '../../../../lib/db';

interface CheckRequest {
  productKey: string;
}

interface DatabaseProductKey {
  id: string;
  key_value: string;
  is_active: boolean;
  created_at: string;
  activated_at: string | null;
  device_id: string | null;
  valid_until: string | null;
}

export async function POST(request: Request) {
  try {
    const text = await request.text();
    
    if (!text) {
      return NextResponse.json({ 
        valid: false, 
        error: 'Cuerpo de solicitud vacío' 
      }, { status: 400 });
    }

    let productKey: string;
    try {
      const parsedBody: CheckRequest = JSON.parse(text);
      productKey = parsedBody.productKey;
    } catch {
      return NextResponse.json({ 
        valid: false, 
        error: 'JSON inválido en el cuerpo de la solicitud' 
      }, { status: 400 });
    }

    if (!productKey) {
      return NextResponse.json({ 
        valid: false, 
        error: 'Clave de producto requerida' 
      }, { status: 400 });
    }

    const result = await client.execute({
      sql: "SELECT * FROM product_keys WHERE key_value = ?",
      args: [productKey]
    });

    if (result.rows.length === 0) {
      return NextResponse.json({ 
        valid: false, 
        error: 'Clave de producto no válida' 
      }, { status: 404 });
    }

    // Mapear manualmente
    const row = result.rows[0];
    const keyData: DatabaseProductKey = {
      id: row.id as string,
      key_value: row.key_value as string,
      is_active: Boolean(row.is_active),
      created_at: row.created_at as string,
      activated_at: row.activated_at as string | null,
      device_id: row.device_id as string | null,
      valid_until: row.valid_until as string | null
    };

    if (!keyData.is_active) {
      return NextResponse.json({ 
        valid: false, 
        error: 'Clave de producto desactivada' 
      }, { status: 403 });
    }

    return NextResponse.json({ 
      valid: true,
      key: keyData.key_value,
      validUntil: keyData.valid_until
    });

  } catch (error) {
    console.error('Error checking product key:', error);
    return NextResponse.json({ 
      valid: false, 
      error: 'Error interno del servidor' 
    }, { status: 500 });
  }
}
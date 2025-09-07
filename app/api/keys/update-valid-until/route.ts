import { NextRequest, NextResponse } from 'next/server';
import client from '../../../../lib/db';

export async function POST(request: NextRequest) {
  try {
    const { id, validUntil } = await request.json();

    if (!id) {
      return NextResponse.json({ 
        error: 'ID de clave requerido' 
      }, { status: 400 });
    }

    // Actualizar la fecha de validez
    await client.execute({
      sql: "UPDATE product_keys SET valid_until = ? WHERE id = ?",
      args: [validUntil, id]
    });

    return NextResponse.json({ 
      success: true,
      message: 'Fecha de validez actualizada correctamente'
    });

  } catch (error) {
    console.error('Error updating valid until date:', error);
    return NextResponse.json({ 
      error: 'Error interno del servidor' 
    }, { status: 500 });
  }
}
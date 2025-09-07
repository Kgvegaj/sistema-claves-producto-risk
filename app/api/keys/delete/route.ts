import { NextRequest, NextResponse } from 'next/server';
import client from '../../../../lib/db';

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ 
        error: 'ID de clave requerido' 
      }, { status: 400 });
    }

    // Eliminar la clave de la base de datos
    await client.execute({
      sql: "DELETE FROM product_keys WHERE id = ?",
      args: [id]
    });

    return NextResponse.json({ 
      success: true,
      message: 'Clave eliminada correctamente'
    });

  } catch (error) {
    console.error('Error deleting product key:', error);
    return NextResponse.json({ 
      error: 'Error interno del servidor' 
    }, { status: 500 });
  }
}
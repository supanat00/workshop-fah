import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient()

export async function PUT(request, { params }) {
  const { id } = params;
  const body = await request.json();

  try {
    const updatedUser = await prisma.user.update({
      where: { id: Number(id) },
      data: {
        name: body.name,
        email: body.email,
        role: body.role,
      },
    });

    return NextResponse.json({ message: 'success', user: updatedUser });
  } catch (error) {
    return NextResponse.json({ message: 'error', error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
    try {
        await prisma.user.update({
            where: {
                id: parseInt(params.id)
            },
            data: {
                status: 'delete'
            }
        })
        return NextResponse.json({ message: 'success' })
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}
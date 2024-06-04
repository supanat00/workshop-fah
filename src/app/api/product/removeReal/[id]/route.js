import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

export async function DELETE(request, { params }) {
  try {
    await prisma.product.delete({
        where: {
            id: parseInt(params.id)
        }
    })
    return NextResponse.json({ message: 'success' }, { status: 200 })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
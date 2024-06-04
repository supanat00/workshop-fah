import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function DELETE(request, { params }) {
    try {
        await prisma.product.update({
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
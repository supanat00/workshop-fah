import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request, { params }) {
    try {
        const { billSaleId } = params
        await prisma.billSale.update({
            data: {
                status: 'send'
            },
            where: {
                id: parseInt(billSaleId)
            }
        })
        return NextResponse.json({ message: 'success' })
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}
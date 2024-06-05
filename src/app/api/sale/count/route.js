import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
    try {
        const count = await prisma.billSale.count()
        return NextResponse.json({ count })
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}
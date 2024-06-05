import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
    try {
        const results = await prisma.billSale.findMany({
            orderBy: {
                id: 'desc'
            }
        })
        return NextResponse.json({ results: results }, { status: 200 })
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}
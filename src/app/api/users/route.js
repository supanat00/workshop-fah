import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
    try {
        const users = await prisma.user.findMany({
            orderBy: {
                id: 'asc'
            },
            where: {
                status: 'use'
            }
        })
        return NextResponse.json({ results: users }, { status: 200 })
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}
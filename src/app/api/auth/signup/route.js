import { NextResponse } from 'next/server'
import bcrypt from 'bcrypt'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request) {
    try {
        const { name, email, password } = await request.json()
        const hashedPassword = bcrypt.hashSync(password, 10)
        const res = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword
            }
        })

        return NextResponse.json({ message: 'success', data: res })
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}
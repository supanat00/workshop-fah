import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request) {
    const user = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
    const { pathname } = request.nextUrl

    if (pathname.startsWith('/dashboard') && (!user || user.role !== 'admin')) {
        return NextResponse.redirect(new URL('/', request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: '/dashboard/:path*'
}
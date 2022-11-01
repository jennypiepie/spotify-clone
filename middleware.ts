// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
    //if user logged in ,token is exist
    const token = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET
    })

    const { pathname} = request.nextUrl
    
    //allow request if token exists
    //or it's a request for NextAuth session & provider
    //or is's a request to '/_next' '/_next/static/'

    if (token || pathname.includes('/api/auth') || pathname.includes('/_next')) {
        if (pathname === '/login') {
            return NextResponse.redirect(new URL('/',request.url))
        }

        return NextResponse.next()
    }

    //redirect to login if user doesn't have token and is requesting protected route
    if (!token && pathname !== '/login') {
        return NextResponse.redirect(new URL('/login',request.url))
    }

    return NextResponse.next()
}
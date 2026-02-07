import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(request: NextRequest) {
    // Only protect /admin routes
    if (request.nextUrl.pathname.startsWith('/admin')) {
        const token = request.cookies.get('auth-token')?.value;

        if (!token) {
            return NextResponse.redirect(new URL('/login', request.url));
        }

        try {
            const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'default-secret-key-change-me');
            await jwtVerify(token, secret);
            return NextResponse.next();
        } catch (error) {
            console.error('Middleware auth error:', error);
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*'],
};

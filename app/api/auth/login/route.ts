import { NextResponse } from 'next/server';
import { UserModel } from '@/infrastructure/models/UserModel';
import dbConnect from '@/infrastructure/database/mongoose';
import bcrypt from 'bcryptjs';
import { SignJWT } from 'jose';

export async function POST(request: Request) {
    try {
        await dbConnect();
        const body = await request.json();
        const { email, password } = body;

        // 1. Find User
        const user = await UserModel.findOne({ email });
        if (!user) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        // 2. Verify Password
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        // 3. Create Session (JWT)
        const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'default-secret-key-change-me');
        const token = await new SignJWT({
            id: user._id.toString(),
            email: user.email,
            role: user.role
        })
            .setProtectedHeader({ alg: 'HS256' })
            .setExpirationTime('24h')
            .sign(secret);

        // 4. Set Cookie
        const response = NextResponse.json({ success: true, user: { name: user.name, email: user.email } });
        response.cookies.set('auth-token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24 // 1 day
        });

        return response;

    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json({ error: 'Login failed' }, { status: 500 });
    }
}

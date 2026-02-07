import { NextResponse } from 'next/server';
import { UserModel } from '@/infrastructure/models/UserModel';
import dbConnect from '@/infrastructure/database/mongoose';
import bcrypt from 'bcryptjs';
import { SignJWT } from 'jose';

export async function POST(request: Request) {
    try {
        await dbConnect();

        // 1. Check if ANY user exists
        const count = await UserModel.countDocuments();
        if (count > 0) {
            return NextResponse.json(
                { error: 'System already initialized. Registration is disabled.' },
                { status: 403 }
            );
        }

        const body = await request.json();
        const { name, email, password } = body;

        if (!name || !email || !password) {
            return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
        }

        // 2. Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 3. Create User
        const newUser = await UserModel.create({
            name,
            email,
            password: hashedPassword,
            role: 'admin'
        });

        // 4. Create Session
        const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'default-secret-key-change-me');
        const token = await new SignJWT({
            id: newUser._id.toString(),
            email: newUser.email,
            role: newUser.role
        })
            .setProtectedHeader({ alg: 'HS256' })
            .setExpirationTime('24h')
            .sign(secret);

        // 5. Set Cookie
        const response = NextResponse.json({ success: true });
        response.cookies.set('auth-token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24 // 1 day
        });

        return response;

    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
    }
}

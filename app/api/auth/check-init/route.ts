import { NextResponse } from 'next/server';
import { UserModel } from '@/infrastructure/models/UserModel';
import dbConnect from '@/infrastructure/database/mongoose';

export async function GET() {
    try {
        await dbConnect();
        const count = await UserModel.countDocuments();
        return NextResponse.json({ initialized: count > 0 });
    } catch (error) {
        console.error('Check init error:', error);
        return NextResponse.json({ error: 'Failed to checks initialization' }, { status: 500 });
    }
}

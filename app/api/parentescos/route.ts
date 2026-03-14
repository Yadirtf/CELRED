import { NextResponse } from 'next/server';
import dbConnect from '@/infrastructure/database/mongoose';
import ParentescoModel from '@/infrastructure/models/ParentescoModel';

// GET /api/parentescos - Returns all active parentesco options
export async function GET() {
    try {
        await dbConnect();
        const parentescos = await ParentescoModel.find({ activo: true }).sort({ nombre: 1 }).lean();
        return NextResponse.json(parentescos);
    } catch (error) {
        console.error('Error fetching parentescos:', error);
        return NextResponse.json({ error: 'Error fetching parentescos' }, { status: 500 });
    }
}

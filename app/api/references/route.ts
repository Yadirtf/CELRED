import { NextResponse } from 'next/server';
import dbConnect from '@/infrastructure/database/mongoose';
import ReferenceModel from '@/infrastructure/models/ReferenceModel';
// Import ParentescoModel so Mongoose registers it before populate is called
import '@/infrastructure/models/ParentescoModel';

// GET /api/references - List references (optionally filtered by advisorId)
export async function GET(request: Request) {
    try {
        await dbConnect();
        const { searchParams } = new URL(request.url);
        const advisorId = searchParams.get('advisorId');
        
        const filter = advisorId ? { advisorId } : {};
        
        const references = await ReferenceModel
            .find(filter)
            .sort({ createdAt: -1 })
            .populate('referencias.parentesco', 'nombre')
            .lean();
        return NextResponse.json(references);
    } catch (error) {
        console.error('Error fetching references:', error);
        return NextResponse.json({ error: 'Error fetching references' }, { status: 500 });
    }
}

// POST /api/references - Create a new buyer + referral entries
export async function POST(request: Request) {
    try {
        await dbConnect();
        const data = await request.json();

        const { nombreComprador, whatsappComprador, advisorId, referencias } = data;

        if (!nombreComprador || !whatsappComprador || !advisorId || !referencias || referencias.length === 0) {
            return NextResponse.json(
                { error: 'Datos incompletos. Se requiere comprador, asesor y al menos una referencia.' },
                { status: 400 }
            );
        }

        const newReference = await ReferenceModel.create({
            nombreComprador: nombreComprador.trim(),
            whatsappComprador: whatsappComprador.trim(),
            advisorId: advisorId.trim(),
            referencias: referencias.map((r: { nombre: string; whatsapp: string; parentescoId: string }) => ({
                nombre: r.nombre?.trim(),
                whatsapp: r.whatsapp?.trim(),
                parentesco: r.parentescoId,   // ObjectId from the Parentesco collection
                estado: 'Pendiente',
            })),
        });

        // Return populated version
        const populated = await newReference.populate('referencias.parentesco', 'nombre');
        return NextResponse.json(populated, { status: 201 });
    } catch (error) {
        console.error('Error creating reference:', error);
        return NextResponse.json({ error: 'Error creating reference' }, { status: 500 });
    }
}


import { NextResponse } from 'next/server';
import dbConnect from '@/infrastructure/database/mongoose';
import ReferenceModel from '@/infrastructure/models/ReferenceModel';

interface Params {
    params: Promise<{ id: string }>;
}

// PATCH /api/references/[id] - Update status of a specific referral entry
export async function PATCH(request: Request, { params }: Params) {
    try {
        await dbConnect();
        const { id } = await params;
        const { referralId, estado } = await request.json();

        if (!referralId || !estado) {
            return NextResponse.json({ error: 'referralId y estado son requeridos' }, { status: 400 });
        }

        const reference = await ReferenceModel.findById(id);
        if (!reference) {
            return NextResponse.json({ error: 'Registro no encontrado' }, { status: 404 });
        }

        const referral = reference.referencias.find(
            (r: { _id?: { toString: () => string } }) => r._id?.toString() === referralId
        );

        if (!referral) {
            return NextResponse.json({ error: 'Referencia no encontrada' }, { status: 404 });
        }

        referral.estado = estado;
        await reference.save();

        return NextResponse.json(reference);
    } catch (error) {
        console.error('Error updating referral status:', error);
        return NextResponse.json({ error: 'Error updating referral' }, { status: 500 });
    }
}

// DELETE /api/references/[id] - Delete an entire buyer+referrals block
export async function DELETE(_request: Request, { params }: Params) {
    try {
        await dbConnect();
        const { id } = await params;
        await ReferenceModel.findByIdAndDelete(id);
        return NextResponse.json({ message: 'Eliminado correctamente' });
    } catch (error) {
        console.error('Error deleting reference:', error);
        return NextResponse.json({ error: 'Error deleting reference' }, { status: 500 });
    }
}

import { NextResponse } from 'next/server';
import { QuickNoteService } from '../../../../use-cases/QuickNoteService';
import { MongoQuickNoteRepository } from '../../../../infrastructure/repositories/MongoQuickNoteRepository';

const quickNoteRepository = new MongoQuickNoteRepository();
const quickNoteService = new QuickNoteService(quickNoteRepository);

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    try {
        const body = await request.json();
        const updatedNote = await quickNoteService.updateQuickNote(id, body);
        if (!updatedNote) {
            return NextResponse.json({ error: 'Quick note not found' }, { status: 404 });
        }
        return NextResponse.json(updatedNote);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update quick note' }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    try {
        const success = await quickNoteService.deleteQuickNote(id);
        if (!success) {
            return NextResponse.json({ error: 'Quick note not found' }, { status: 404 });
        }
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete quick note' }, { status: 500 });
    }
}

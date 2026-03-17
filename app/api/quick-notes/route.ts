import { NextResponse } from 'next/server';
import { QuickNoteService } from '../../../use-cases/QuickNoteService';
import { MongoQuickNoteRepository } from '../../../infrastructure/repositories/MongoQuickNoteRepository';

const quickNoteRepository = new MongoQuickNoteRepository();
const quickNoteService = new QuickNoteService(quickNoteRepository);

export async function GET() {
    try {
        const notes = await quickNoteService.getAllQuickNotes();
        return NextResponse.json(notes);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch quick notes' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const newNote = await quickNoteService.createQuickNote(body);
        return NextResponse.json(newNote, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create quick note' }, { status: 500 });
    }
}

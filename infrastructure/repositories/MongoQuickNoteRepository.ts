import { QuickNote } from '../../core/entities/QuickNote';
import { IQuickNoteRepository } from '../../core/repositories/IQuickNoteRepository';
import QuickNoteModel from '../models/QuickNoteModel';
import dbConnect from '../database/mongoose';

export class MongoQuickNoteRepository implements IQuickNoteRepository {
    async create(note: QuickNote): Promise<QuickNote> {
        await dbConnect();
        const newNote = await QuickNoteModel.create(note);
        return this.mapToEntity(newNote);
    }

    async getAll(): Promise<QuickNote[]> {
        await dbConnect();
        const notes = await QuickNoteModel.find().sort({ createdAt: -1 });
        return notes.map(this.mapToEntity);
    }

    async findById(id: string): Promise<QuickNote | null> {
        await dbConnect();
        const note = await QuickNoteModel.findById(id);
        if (!note) return null;
        return this.mapToEntity(note);
    }

    async update(id: string, noteData: Partial<QuickNote>): Promise<QuickNote | null> {
        await dbConnect();
        const note = await QuickNoteModel.findByIdAndUpdate(id, noteData, { new: true });
        if (!note) return null;
        return this.mapToEntity(note);
    }

    async delete(id: string): Promise<boolean> {
        await dbConnect();
        const result = await QuickNoteModel.findByIdAndDelete(id);
        return !!result;
    }

    private mapToEntity(doc: any): QuickNote {
        return {
            id: doc._id.toString(),
            title: doc.title,
            content: doc.content,
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt,
        };
    }
}

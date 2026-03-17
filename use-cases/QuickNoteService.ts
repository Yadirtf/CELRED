import { IQuickNoteRepository } from '../core/repositories/IQuickNoteRepository';
import { QuickNote } from '../core/entities/QuickNote';

export class QuickNoteService {
    constructor(private quickNoteRepository: IQuickNoteRepository) { }

    async createQuickNote(note: QuickNote): Promise<QuickNote> {
        if (!note.title || !note.content) {
            throw new Error('Title and content are required');
        }
        return this.quickNoteRepository.create(note);
    }

    async getAllQuickNotes(): Promise<QuickNote[]> {
        return this.quickNoteRepository.getAll();
    }

    async getQuickNoteById(id: string): Promise<QuickNote | null> {
        return this.quickNoteRepository.findById(id);
    }

    async updateQuickNote(id: string, note: Partial<QuickNote>): Promise<QuickNote | null> {
        return this.quickNoteRepository.update(id, note);
    }

    async deleteQuickNote(id: string): Promise<boolean> {
        return this.quickNoteRepository.delete(id);
    }
}

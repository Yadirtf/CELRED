import { QuickNote } from '../entities/QuickNote';

export interface IQuickNoteRepository {
    create(note: QuickNote): Promise<QuickNote>;
    getAll(): Promise<QuickNote[]>;
    findById(id: string): Promise<QuickNote | null>;
    update(id: string, note: Partial<QuickNote>): Promise<QuickNote | null>;
    delete(id: string): Promise<boolean>;
}

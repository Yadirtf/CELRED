import mongoose, { Schema, Document, Model } from 'mongoose';
import { QuickNote } from '../../core/entities/QuickNote';

export interface QuickNoteDocument extends Omit<QuickNote, 'id'>, Document {}

const QuickNoteSchema: Schema = new Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
}, { timestamps: true });

const QuickNoteModel: Model<QuickNoteDocument> = mongoose.models.QuickNote || mongoose.model<QuickNoteDocument>('QuickNote', QuickNoteSchema);

export default QuickNoteModel;

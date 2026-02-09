import mongoose, { Schema, Document } from 'mongoose';

export interface ISettings extends Document {
    advisors: {
        number: string;
        imageUrl?: string;
        name?: string;
    }[];
    updatedAt: Date;
}

const SettingsSchema: Schema = new Schema({
    advisors: [{
        number: { type: String, required: true },
        imageUrl: { type: String },
        name: { type: String }
    }],
}, { timestamps: true });

export default mongoose.models.Settings || mongoose.model<ISettings>('Settings', SettingsSchema);

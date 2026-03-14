import mongoose, { Schema, Document } from 'mongoose';

export interface ISettings extends Document {
    advisors: {
        number: string;
        imageUrl?: string;
        name?: string;
    }[];
    referralMessage: string;
    updatedAt: Date;
}

const SettingsSchema: Schema = new Schema({
    advisors: [{
        number: { type: String, required: true },
        imageUrl: { type: String },
        name: { type: String }
    }],
    referralMessage: {
        type: String,
        default: '¡Hola {nombre_referido}! 👋 Tu amigo/a {nombre_comprador} nos pasó tu contacto porque sabe que quieres estrenar celular. Tenemos excelentes opciones para ti. 📱'
    },
}, { timestamps: true });

export default mongoose.models.Settings || mongoose.model<ISettings>('Settings', SettingsSchema);

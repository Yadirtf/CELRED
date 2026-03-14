import mongoose, { Schema, Document, Types } from 'mongoose';

export type ReferralStatus = 'Pendiente' | 'Contactado';

export interface IReferralEntry {
    _id?: string;
    nombre: string;
    whatsapp: string;
    /** ObjectId referencing the Parentesco collection */
    parentesco: Types.ObjectId | string;
    estado: ReferralStatus;
}

/** Shape after `.populate('referencias.parentesco')` */
export interface IReferralEntryPopulated extends Omit<IReferralEntry, 'parentesco'> {
    parentesco: { _id: string; nombre: string };
}

export interface IReference extends Document {
    nombreComprador: string;
    whatsappComprador: string;
    advisorId: string; // WhatsApp number or ID of the advisor
    referencias: IReferralEntry[];
    createdAt: Date;
    updatedAt: Date;
}

const ReferralEntrySchema = new Schema<IReferralEntry>({
    nombre: { type: String, required: true, trim: true },
    whatsapp: { type: String, required: true, trim: true },
    parentesco: { type: Schema.Types.ObjectId, ref: 'Parentesco', required: true },
    estado: { type: String, enum: ['Pendiente', 'Contactado'], default: 'Pendiente' },
});

const ReferenceSchema = new Schema<IReference>({
    nombreComprador: { type: String, required: true, trim: true },
    whatsappComprador: { type: String, required: true, trim: true },
    advisorId: { type: String, required: true, index: true },
    referencias: { type: [ReferralEntrySchema], default: [] },
}, { timestamps: true });

export default mongoose.models.Reference || mongoose.model<IReference>('Reference', ReferenceSchema);


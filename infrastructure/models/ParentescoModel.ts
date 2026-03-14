import mongoose, { Schema, Document } from 'mongoose';

export interface IParentesco extends Document {
    nombre: string;
    activo: boolean;
}

const ParentescoSchema = new Schema<IParentesco>(
    {
        nombre: { type: String, required: true, unique: true, trim: true },
        activo: { type: Boolean, default: true },
    },
    { timestamps: true }
);

export default mongoose.models.Parentesco ||
    mongoose.model<IParentesco>('Parentesco', ParentescoSchema);

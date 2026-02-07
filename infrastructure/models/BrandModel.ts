import mongoose, { Schema, Document, Model } from 'mongoose';
import { Brand } from '../../core/entities/Brand';

export interface BrandDocument extends Omit<Brand, 'id'>, Document { }

const BrandSchema: Schema = new Schema({
    name: { type: String, required: true, unique: true },
    logoUrl: { type: String },
    description: { type: String },
}, { timestamps: true });

const BrandModel: Model<BrandDocument> = mongoose.models.Brand || mongoose.model<BrandDocument>('Brand', BrandSchema);

export default BrandModel;

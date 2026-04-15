import mongoose, { Schema, Document } from 'mongoose';

export interface ICatalogStats extends Document {
    totalVisits: number;
    updatedAt: Date;
}

const CatalogStatsSchema: Schema = new Schema({
    totalVisits: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.models.CatalogStats || mongoose.model<ICatalogStats>('CatalogStats', CatalogStatsSchema);

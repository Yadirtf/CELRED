import mongoose, { Schema, Document } from 'mongoose';

export interface ICatalogVisitor extends Document {
    visitorId: string;
    customerUUID?: string;
    ip: string;
    device: 'Mobile' | 'Tablet' | 'Desktop';
    browser: string;
    os: string;
    city: string;
    region: string;
    country: string;
    referrer: string;
    screenResolution: string;
    visitedAt: Date;
}

const CatalogVisitorSchema: Schema = new Schema({
    visitorId: { type: String, required: true, index: true },
    customerUUID: { type: String, index: true },
    ip: { type: String, default: 'Desconocido' },
    device: { type: String, enum: ['Mobile', 'Tablet', 'Desktop'], default: 'Desktop' },
    browser: { type: String, default: 'Desconocido' },
    os: { type: String, default: 'Desconocido' },
    city: { type: String, default: 'Desconocido' },
    region: { type: String, default: 'Desconocido' },
    country: { type: String, default: 'Desconocido' },
    referrer: { type: String, default: 'Directo' },
    screenResolution: { type: String, default: 'Desconocido' },
    visitedAt: { type: Date, default: Date.now, index: true },
}, {
    timestamps: false,
});

// TTL index: automatically delete documents after 90 days
CatalogVisitorSchema.index({ visitedAt: 1 }, { expireAfterSeconds: 90 * 24 * 60 * 60 });

export default mongoose.models.CatalogVisitor ||
    mongoose.model<ICatalogVisitor>('CatalogVisitor', CatalogVisitorSchema);

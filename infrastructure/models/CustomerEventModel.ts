import mongoose, { Document, Model, Schema } from 'mongoose';

export interface ICustomerEvent extends Document {
  customerUUID: string;
  eventType: 'PRODUCT_VIEW' | 'WHATSAPP_START' | 'CATALOG_VISIT';
  productId?: string;
  productName?: string;
  preference?: 'CONTADO' | 'FINANCIADO';
  metadata?: Record<string, any>;
  createdAt: Date;
}

const CustomerEventSchema = new Schema<ICustomerEvent>({
  customerUUID: { type: String, required: true, index: true },
  eventType: { 
      type: String, 
      required: true,
      enum: ['PRODUCT_VIEW', 'WHATSAPP_START', 'CATALOG_VISIT'] 
  },
  productId: { type: String },
  productName: { type: String },
  preference: { type: String, enum: ['CONTADO', 'FINANCIADO'] },
  metadata: { type: Schema.Types.Mixed },
  createdAt: { type: Date, default: Date.now }
});

// TTL Index: Delete history older than 6 months (privacy compliance and space saving)
CustomerEventSchema.index({ createdAt: 1 }, { expireAfterSeconds: 15552000 });

// Compound index for querying a user's recent product views quickly
CustomerEventSchema.index({ customerUUID: 1, eventType: 1, createdAt: -1 });

export const CustomerEventModel: Model<ICustomerEvent> =
  mongoose.models.CustomerEvent || mongoose.model<ICustomerEvent>('CustomerEvent', CustomerEventSchema);

export default CustomerEventModel;

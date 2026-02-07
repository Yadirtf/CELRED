import mongoose, { Schema, Document, Model } from 'mongoose';
import { Product } from '../../core/entities/Product';

export interface ProductDocument extends Omit<Product, 'id' | 'brand'>, Document {
    brand: mongoose.Types.ObjectId;
}

const ProductSchema: Schema = new Schema({
    name: { type: String, required: true },
    brand: { type: Schema.Types.ObjectId, ref: 'Brand', required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true, default: 0 },
    description: { type: String, required: true },
    imageUrl: { type: String, required: true },
    specs: {
        processor: String,
        ram: String,
        storage: String,
        screen: String,
        battery: String,
        camera: String,
    },
}, { timestamps: true });

const ProductModel: Model<ProductDocument> = mongoose.models.Product || mongoose.model<ProductDocument>('Product', ProductSchema);

export default ProductModel;

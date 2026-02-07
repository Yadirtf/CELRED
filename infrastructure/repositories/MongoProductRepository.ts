import { Product } from '../../core/entities/Product';
import { IProductRepository } from '../../core/repositories/IProductRepository';
import ProductModel from '../models/ProductModel';
import dbConnect from '../database/mongoose';

export class MongoProductRepository implements IProductRepository {
    async create(product: Product): Promise<Product> {
        await dbConnect();
        // Ensure we extract the ID if brand is an object
        const brandId = typeof product.brand === 'object' ? product.brand.id : product.brand;
        const newProduct = await ProductModel.create({ ...product, brand: brandId });
        return this.mapToEntity(newProduct);
    }

    async getAll(): Promise<Product[]> {
        await dbConnect();
        const products = await ProductModel.find().populate('brand').sort({ createdAt: -1 });
        return products.map(this.mapToEntity);
    }

    async findById(id: string): Promise<Product | null> {
        await dbConnect();
        const product = await ProductModel.findById(id).populate('brand');
        if (!product) return null;
        return this.mapToEntity(product);
    }

    async update(id: string, productData: Partial<Product>): Promise<Product | null> {
        await dbConnect();
        const product = await ProductModel.findByIdAndUpdate(id, productData, { new: true }).populate('brand');
        if (!product) return null;
        return this.mapToEntity(product);
    }

    async delete(id: string): Promise<boolean> {
        await dbConnect();
        const result = await ProductModel.findByIdAndDelete(id);
        return !!result;
    }

    private mapToEntity(doc: any): Product {
        return {
            id: doc._id.toString(),
            name: doc.name,
            brand: doc.brand, // Populated or ID
            price: doc.price,
            stock: doc.stock ?? 0,
            description: doc.description,
            imageUrl: doc.imageUrl,
            specs: doc.specs,
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt,
        };
    }
}

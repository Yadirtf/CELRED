import { Brand } from '../../core/entities/Brand';
import { IBrandRepository } from '../../core/repositories/IBrandRepository';
import BrandModel from '../models/BrandModel';
import dbConnect from '../database/mongoose';

export class MongoBrandRepository implements IBrandRepository {
    async create(brand: Brand): Promise<Brand> {
        await dbConnect();
        const newBrand = await BrandModel.create(brand);
        return this.mapToEntity(newBrand);
    }

    async getAll(): Promise<Brand[]> {
        await dbConnect();
        const brands = await BrandModel.find().sort({ createdAt: -1 });
        return brands.map(this.mapToEntity);
    }

    async findById(id: string): Promise<Brand | null> {
        await dbConnect();
        const brand = await BrandModel.findById(id);
        if (!brand) return null;
        return this.mapToEntity(brand);
    }

    async update(id: string, brand: Partial<Brand>): Promise<Brand | null> {
        await dbConnect();
        const updatedBrand = await BrandModel.findByIdAndUpdate(id, brand, { new: true });
        if (!updatedBrand) return null;
        return this.mapToEntity(updatedBrand);
    }

    async delete(id: string): Promise<boolean> {
        await dbConnect();
        const result = await BrandModel.findByIdAndDelete(id);
        return result !== null;
    }

    private mapToEntity(doc: {
        _id: any;
        name: string;
        logoUrl?: string;
        description?: string;
        createdAt?: Date;
        updatedAt?: Date;
    }): Brand {
        return {
            id: doc._id.toString(),
            name: doc.name,
            logoUrl: doc.logoUrl,
            description: doc.description,
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt,
        };
    }
}

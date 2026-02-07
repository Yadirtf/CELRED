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

    private mapToEntity(doc: any): Brand {
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

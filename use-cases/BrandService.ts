import { IBrandRepository } from '../core/repositories/IBrandRepository';
import { Brand } from '../core/entities/Brand';

export class BrandService {
    constructor(private brandRepository: IBrandRepository) { }

    async createBrand(brand: Brand): Promise<Brand> {
        // Add business logic here (e.g., validation)
        return this.brandRepository.create(brand);
    }

    async getAllBrands(): Promise<Brand[]> {
        return this.brandRepository.getAll();
    }

    async getBrandById(id: string): Promise<Brand | null> {
        return this.brandRepository.findById(id);
    }
}

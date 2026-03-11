import { Brand } from '../entities/Brand';

export interface IBrandRepository {
    create(brand: Brand): Promise<Brand>;
    getAll(): Promise<Brand[]>;
    findById(id: string): Promise<Brand | null>;
    update(id: string, brand: Partial<Brand>): Promise<Brand | null>;
    delete(id: string): Promise<boolean>;
}

import { Product } from '../entities/Product';

export interface IProductRepository {
    create(product: Product): Promise<Product>;
    getAll(): Promise<Product[]>;
    findById(id: string): Promise<Product | null>;
    update(id: string, product: Partial<Product>): Promise<Product | null>;
    delete(id: string): Promise<boolean>;
}

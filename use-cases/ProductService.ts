import { IProductRepository } from '../core/repositories/IProductRepository';
import { Product } from '../core/entities/Product';

export class ProductService {
    constructor(private productRepository: IProductRepository) { }

    async createProduct(product: Product): Promise<Product> {
        // Business logic validations
        if (product.price < 0) {
            throw new Error('Price cannot be negative');
        }
        return this.productRepository.create(product);
    }

    async getAllProducts(): Promise<Product[]> {
        return this.productRepository.getAll();
    }

    async getProductById(id: string): Promise<Product | null> {
        return this.productRepository.findById(id);
    }

    async updateProduct(id: string, product: Partial<Product>): Promise<Product | null> {
        return this.productRepository.update(id, product);
    }

    async deleteProduct(id: string): Promise<boolean> {
        return this.productRepository.delete(id);
    }
}

import { NextResponse } from 'next/server';
import { ProductService } from '../../../use-cases/ProductService';
import { MongoProductRepository } from '../../../infrastructure/repositories/MongoProductRepository';

const productRepository = new MongoProductRepository();
const productService = new ProductService(productRepository);

export async function GET() {
    try {
        const products = await productService.getAllProducts();
        return NextResponse.json(products);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        console.log('Creating product:', body);
        const newProduct = await productService.createProduct(body);
        return NextResponse.json(newProduct, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
    }
}

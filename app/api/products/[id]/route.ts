import { NextResponse } from 'next/server';
import { ProductService } from '../../../../use-cases/ProductService';
import { MongoProductRepository } from '../../../../infrastructure/repositories/MongoProductRepository';

const productRepository = new MongoProductRepository();
const productService = new ProductService(productRepository);

// Helper to extract ID from params
// In Next.js 15+, params is a Promise, but in 14 it's an object. 
// The user has "next": "16.1.6" in package.json (wait, 16? Next.js 16 isn't out yet, maybe 15 or RC? Or typo in file?)
// Ah, the file view showed "next": "16.1.6". This is likely a very new or nightly version, or a misunderstanding of the versioning.
// Assuming Next.js 13/14/15 App Router standard: params is { id: string }
// NOTE: In Next.js 15, params is asynchronous. I should check the version. 
// "next": "16.1.6" <- This is weird. Latest stable is 14 or 15. 
// Let's assume standard async params access pattern to be safe for future versions.

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const product = await productService.getProductById(id);
        if (!product) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }
        return NextResponse.json(product);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
    }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const body = await request.json();
        const updatedProduct = await productService.updateProduct(id, body);
        if (!updatedProduct) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }
        return NextResponse.json(updatedProduct);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const success = await productService.deleteProduct(id);
        if (!success) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }
        return NextResponse.json({ message: 'Product deleted successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
    }
}

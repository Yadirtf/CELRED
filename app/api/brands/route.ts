import { NextResponse } from 'next/server';
import { BrandService } from '../../../use-cases/BrandService';
import { MongoBrandRepository } from '../../../infrastructure/repositories/MongoBrandRepository';

const brandRepository = new MongoBrandRepository();
const brandService = new BrandService(brandRepository);

export async function GET() {
    try {
        const brands = await brandService.getAllBrands();
        return NextResponse.json(brands);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch brands' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const newBrand = await brandService.createBrand(body);
        return NextResponse.json(newBrand, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create brand' }, { status: 500 });
    }
}

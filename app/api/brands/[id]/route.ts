import { NextResponse } from 'next/server';
import { BrandService } from '../../../../use-cases/BrandService';
import { MongoBrandRepository } from '../../../../infrastructure/repositories/MongoBrandRepository';

const brandRepository = new MongoBrandRepository();
const brandService = new BrandService(brandRepository);

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const id = (await params).id;
        const body = await request.json();
        
        const updatedBrand = await brandService.updateBrand(id, body);
        
        if (!updatedBrand) {
            return NextResponse.json({ error: 'Brand not found' }, { status: 404 });
        }
        
        return NextResponse.json(updatedBrand);
    } catch (error) {
        console.error('Error updating brand:', error);
        return NextResponse.json({ error: 'Failed to update brand' }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const id = (await params).id;
        
        const success = await brandService.deleteBrand(id);
        
        if (!success) {
            return NextResponse.json({ error: 'Brand not found' }, { status: 404 });
        }
        
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting brand:', error);
        return NextResponse.json({ error: 'Failed to delete brand' }, { status: 500 });
    }
}

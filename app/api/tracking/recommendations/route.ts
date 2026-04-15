import { NextRequest, NextResponse } from 'next/server';
import { TrackingService } from '@/services/trackingService';

// ── GET: Returns the latest product IDs the user interacted with ──
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const uuid = searchParams.get('uuid');

        if (!uuid) {
            return NextResponse.json({ error: 'uuid required' }, { status: 400 });
        }

        const productIds = await TrackingService.getRecommendations(uuid, 4);
        
        return NextResponse.json({ productIds });
    } catch (error) {
        console.error('Error fetching recommendations:', error);
        return NextResponse.json({ error: 'Internal error' }, { status: 500 });
    }
}

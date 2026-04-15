import { NextRequest, NextResponse } from 'next/server';
import { TrackingService } from '@/services/trackingService';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        
        if (!body.customerUUID) {
            return NextResponse.json({ error: 'customerUUID required' }, { status: 400 });
        }

        await TrackingService.trackEvent(body);
        
        return NextResponse.json({ ok: true });
    } catch (error) {
        console.error('Error tracking customer event:', error);
        return NextResponse.json({ error: 'Internal error' }, { status: 500 });
    }
}

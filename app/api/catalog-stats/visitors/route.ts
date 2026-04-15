import { NextRequest, NextResponse } from 'next/server';
import { AnalyticsService } from '@/services/analyticsService';

// ── GET: Return visitor analytics for the admin dashboard ──
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        
        const data = await AnalyticsService.getDashboardAnalytics({
            from: searchParams.get('from'),
            to: searchParams.get('to'),
            limit: parseInt(searchParams.get('limit') || '50')
        });

        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching visitor analytics:', error);
        return NextResponse.json({ error: 'Internal error' }, { status: 500 });
    }
}

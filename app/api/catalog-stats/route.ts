import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/infrastructure/database/mongoose';
import CatalogStatsModel from '@/infrastructure/models/CatalogStatsModel';
import {
    registerHeartbeat,
    removeViewer,
    getActiveCount,
    shouldCountAsNewVisit,
} from '@/lib/catalogViewerStore';
import { TrackingService } from '@/services/trackingService';

/**
 * Extract the client IP from request headers.
 */
function getClientIp(request: NextRequest): string {
    const xForwardedFor = request.headers.get('x-forwarded-for');
    if (xForwardedFor) return xForwardedFor.split(',')[0].trim();
    const xRealIp = request.headers.get('x-real-ip');
    if (xRealIp) return xRealIp.trim();
    return 'Desconocido';
}

// ── POST: Heartbeat from a catalog visitor ──
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { visitorId, customerUUID, isNewSession, referrer, screenResolution, exactLocation } = body;

        if (!visitorId) {
            return NextResponse.json({ error: 'visitorId required' }, { status: 400 });
        }

        // Handle async exact location update
        if (exactLocation) {
            await TrackingService.updateExactLocation(visitorId, exactLocation);
            return NextResponse.json({ ok: true });
        }

        // Keep active viewer count running
        registerHeartbeat(visitorId);

        // Process full tracking if it's the first time we see this session
        if (isNewSession && shouldCountAsNewVisit(visitorId)) {
            const ip = getClientIp(request);
            const userAgent = request.headers.get('user-agent') || '';

            await TrackingService.registerNewVisit({
                visitorId,
                customerUUID,
                isNewSession,
                referrer,
                screenResolution,
                ip,
                userAgent
            });
        }

        return NextResponse.json({ ok: true });
    } catch (error) {
        console.error('Error in catalog-stats POST:', error);
        return NextResponse.json({ error: 'Internal error' }, { status: 500 });
    }
}

// ── GET: Return active viewers count + total visits ──
export async function GET() {
    try {
        const activeCount = getActiveCount();

        await dbConnect();
        let stats = await CatalogStatsModel.findOne();
        if (!stats) {
            stats = await CatalogStatsModel.create({ totalVisits: 0 });
        }

        return NextResponse.json({
            activeViewers: activeCount,
            totalVisits: stats.totalVisits,
        });
    } catch (error) {
        console.error('Error in catalog-stats GET:', error);
        return NextResponse.json({ error: 'Internal error' }, { status: 500 });
    }
}

// ── DELETE: Remove a viewer when they leave the page ──
export async function DELETE(request: NextRequest) {
    try {
        const { visitorId } = await request.json();
        if (visitorId) {
            removeViewer(visitorId);
        }
        return NextResponse.json({ ok: true });
    } catch {
        return NextResponse.json({ ok: true });
    }
}

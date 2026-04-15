import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/infrastructure/database/mongoose';
import CatalogStatsModel from '@/infrastructure/models/CatalogStatsModel';
import CatalogVisitorModel from '@/infrastructure/models/CatalogVisitorModel';
import {
    registerHeartbeat,
    removeViewer,
    getActiveCount,
    shouldCountAsNewVisit,
} from '@/lib/catalogViewerStore';
import { parseUserAgent } from '@/lib/parseUserAgent';
import { geolocateIp } from '@/lib/geolocateIp';

/**
 * Extract the client IP from request headers.
 * Works with Vercel, Cloudflare, Nginx, and most reverse proxies.
 */
function getClientIp(request: NextRequest): string {
    // Vercel-specific header
    const xForwardedFor = request.headers.get('x-forwarded-for');
    if (xForwardedFor) {
        // x-forwarded-for can contain multiple IPs: client, proxy1, proxy2
        return xForwardedFor.split(',')[0].trim();
    }

    const xRealIp = request.headers.get('x-real-ip');
    if (xRealIp) return xRealIp.trim();

    return 'Desconocido';
}

// ── POST: Heartbeat from a catalog visitor ──
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { visitorId, isNewSession, referrer, screenResolution } = body;

        if (!visitorId) {
            return NextResponse.json({ error: 'visitorId required' }, { status: 400 });
        }

        registerHeartbeat(visitorId);

        // On new session: increment counter + save visitor record with analytics
        if (isNewSession && shouldCountAsNewVisit(visitorId)) {
            await dbConnect();

            // Increment total visits counter
            await CatalogStatsModel.findOneAndUpdate(
                {},
                { $inc: { totalVisits: 1 } },
                { upsert: true, new: true }
            );

            // Capture visitor analytics (non-blocking)
            const ip = getClientIp(request);
            const userAgent = request.headers.get('user-agent') || '';
            const parsed = parseUserAgent(userAgent);

            // Geolocation runs async — don't block the response
            geolocateIp(ip).then(async (geo) => {
                try {
                    await CatalogVisitorModel.create({
                        visitorId,
                        ip,
                        device: parsed.device,
                        browser: parsed.browser,
                        os: parsed.os,
                        city: geo.city,
                        region: geo.region,
                        country: geo.country,
                        referrer: referrer || 'Directo',
                        screenResolution: screenResolution || 'Desconocido',
                        visitedAt: new Date(),
                    });
                } catch (err) {
                    console.error('Error saving visitor record:', err);
                }
            }).catch(() => { /* silently fail geo+save */ });
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

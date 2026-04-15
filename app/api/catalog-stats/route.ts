import { NextResponse } from 'next/server';
import dbConnect from '@/infrastructure/database/mongoose';
import CatalogStatsModel from '@/infrastructure/models/CatalogStatsModel';
import {
    registerHeartbeat,
    removeViewer,
    getActiveCount,
    shouldCountAsNewVisit,
} from '@/lib/catalogViewerStore';

// ── POST: Heartbeat from a catalog visitor ──
export async function POST(request: Request) {
    try {
        const { visitorId, isNewSession } = await request.json();

        if (!visitorId) {
            return NextResponse.json({ error: 'visitorId required' }, { status: 400 });
        }

        registerHeartbeat(visitorId);

        // Increment totalVisits only once per unique visitor per server lifecycle
        if (isNewSession && shouldCountAsNewVisit(visitorId)) {
            await dbConnect();
            await CatalogStatsModel.findOneAndUpdate(
                {},
                { $inc: { totalVisits: 1 } },
                { upsert: true, new: true }
            );
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
export async function DELETE(request: Request) {
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

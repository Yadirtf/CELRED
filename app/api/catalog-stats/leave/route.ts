import { NextResponse } from 'next/server';

// Import the shared activeViewers map from the main route
// Since sendBeacon can only POST, this endpoint handles viewer departure
// via a separate POST to /api/catalog-stats/leave

// ── Shared in-memory store (module-level, same server process) ──
// We need to import from a shared module instead. Let's create a utility.

import { removeViewer } from '@/lib/catalogViewerStore';

export async function POST(request: Request) {
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

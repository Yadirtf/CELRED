/**
 * Shared in-memory store for tracking active catalog viewers.
 * 
 * This module maintains a Map of visitorId → timestamp for heartbeat tracking,
 * and a Set of visitors that have already been counted for totalVisits.
 * 
 * Data is ephemeral and resets on server restart (which is expected behavior
 * for "who is viewing right now" data).
 */

const INACTIVE_THRESHOLD_MS = 60_000; // 60 seconds

// visitorId → last heartbeat timestamp
const activeViewers = new Map<string, number>();

// Visitors that already incremented totalVisits in this server lifecycle
const countedVisitors = new Set<string>();

function pruneInactive() {
    const now = Date.now();
    for (const [id, ts] of activeViewers) {
        if (now - ts > INACTIVE_THRESHOLD_MS) {
            activeViewers.delete(id);
        }
    }
}

export function registerHeartbeat(visitorId: string): void {
    activeViewers.set(visitorId, Date.now());
    pruneInactive();
}

export function removeViewer(visitorId: string): void {
    activeViewers.delete(visitorId);
}

export function getActiveCount(): number {
    pruneInactive();
    return activeViewers.size;
}

export function shouldCountAsNewVisit(visitorId: string): boolean {
    if (countedVisitors.has(visitorId)) return false;
    countedVisitors.add(visitorId);
    return true;
}

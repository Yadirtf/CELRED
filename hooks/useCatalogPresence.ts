import { useEffect, useRef } from 'react';

const HEARTBEAT_INTERVAL_MS = 30_000; // 30 seconds

/**
 * Registers the current browser tab as an active catalog viewer.
 * Sends a heartbeat every 30s and cleans up on page unload.
 */
export function useCatalogPresence() {
    const visitorIdRef = useRef<string>('');

    useEffect(() => {
        // Generate a unique ID for this tab session
        const id = crypto.randomUUID();
        visitorIdRef.current = id;

        // Check if this is a new session (not a reload that already counted)
        const SESSION_KEY = 'catalog_visit_counted';
        const alreadyCounted = sessionStorage.getItem(SESSION_KEY) === 'true';
        const isNewSession = !alreadyCounted;

        if (isNewSession) {
            sessionStorage.setItem(SESSION_KEY, 'true');
        }

        // Collect client-side analytics data (only needed for first heartbeat)
        const clientData = {
            referrer: document.referrer || 'Directo',
            screenResolution: `${window.screen.width}x${window.screen.height}`,
        };

        // Send heartbeat
        const sendHeartbeat = (newSession = false) => {
            fetch('/api/catalog-stats', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    visitorId: id,
                    isNewSession: newSession,
                    ...(newSession ? clientData : {}),
                }),
            }).catch(() => { /* silently fail */ });
        };

        // Initial heartbeat
        sendHeartbeat(isNewSession);

        // Periodic heartbeat
        const interval = setInterval(() => sendHeartbeat(false), HEARTBEAT_INTERVAL_MS);

        // Cleanup on page unload
        const handleUnload = () => {
            const body = JSON.stringify({ visitorId: id });
            // Use sendBeacon for reliable delivery on unload
            // sendBeacon only supports POST, so we use a dedicated /leave endpoint
            if (navigator.sendBeacon) {
                const blob = new Blob([body], { type: 'application/json' });
                navigator.sendBeacon('/api/catalog-stats/leave', blob);
            }
        };

        window.addEventListener('beforeunload', handleUnload);

        return () => {
            clearInterval(interval);
            window.removeEventListener('beforeunload', handleUnload);
            // Also try to clean up on React unmount
            handleUnload();
        };
    }, []);
}

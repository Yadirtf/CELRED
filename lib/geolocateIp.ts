/**
 * IP Geolocation using ip-api.com (free, no API key, 45 req/min).
 * Includes in-memory cache with 1-hour TTL to avoid redundant lookups.
 */

interface GeoResult {
    city: string;
    region: string;
    country: string;
}

interface CacheEntry {
    data: GeoResult;
    expiresAt: number;
}

const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour
const geoCache = new Map<string, CacheEntry>();

const UNKNOWN: GeoResult = {
    city: 'Desconocido',
    region: 'Desconocido',
    country: 'Desconocido',
};

// IPs that are local/private and can't be geolocated
const PRIVATE_IP_REGEX = /^(127\.|10\.|172\.(1[6-9]|2\d|3[01])\.|192\.168\.|::1|localhost|0\.0\.0\.0)/;

function pruneCache() {
    const now = Date.now();
    for (const [key, entry] of geoCache) {
        if (now > entry.expiresAt) {
            geoCache.delete(key);
        }
    }
}

export async function geolocateIp(ip: string): Promise<GeoResult> {
    // Skip private/local IPs
    if (!ip || PRIVATE_IP_REGEX.test(ip)) {
        return { city: 'Local', region: 'Local', country: 'Local' };
    }

    // Check cache
    const cached = geoCache.get(ip);
    if (cached && Date.now() < cached.expiresAt) {
        return cached.data;
    }

    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 3000); // 3s timeout

        const res = await fetch(
            `http://ip-api.com/json/${ip}?fields=status,city,regionName,country`,
            { signal: controller.signal }
        );

        clearTimeout(timeout);

        if (!res.ok) return UNKNOWN;

        const data = await res.json();

        if (data.status !== 'success') return UNKNOWN;

        const result: GeoResult = {
            city: data.city || 'Desconocido',
            region: data.regionName || 'Desconocido',
            country: data.country || 'Desconocido',
        };

        // Cache the result
        geoCache.set(ip, {
            data: result,
            expiresAt: Date.now() + CACHE_TTL_MS,
        });

        // Periodic cache cleanup (every 100 lookups)
        if (geoCache.size % 100 === 0) pruneCache();

        return result;
    } catch {
        return UNKNOWN;
    }
}

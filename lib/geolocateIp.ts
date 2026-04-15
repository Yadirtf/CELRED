/**
 * IP Geolocation with multi-provider fallback.
 * 
 * Primary:  ip-api.com  (HTTP, free, 45 req/min)
 * Fallback: ipapi.co    (HTTPS, free, 1000 req/day)
 * 
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

async function fetchWithTimeout(url: string, timeoutMs = 5000): Promise<Response> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    try {
        const res = await fetch(url, { signal: controller.signal });
        return res;
    } finally {
        clearTimeout(timeout);
    }
}

/** Primary: ip-api.com (HTTP) */
async function tryIpApi(ip: string): Promise<GeoResult | null> {
    try {
        const res = await fetchWithTimeout(
            `http://ip-api.com/json/${ip}?fields=status,city,regionName,country`
        );
        if (!res.ok) return null;
        const data = await res.json();
        if (data.status !== 'success') return null;
        return {
            city: data.city || 'Desconocido',
            region: data.regionName || 'Desconocido',
            country: data.country || 'Desconocido',
        };
    } catch {
        return null;
    }
}

/** Fallback: ipapi.co (HTTPS, no API key for basic usage) */
async function tryIpapiCo(ip: string): Promise<GeoResult | null> {
    try {
        const res = await fetchWithTimeout(
            `https://ipapi.co/${ip}/json/`
        );
        if (!res.ok) return null;
        const data = await res.json();
        if (data.error) return null;
        return {
            city: data.city || 'Desconocido',
            region: data.region || 'Desconocido',
            country: data.country_name || 'Desconocido',
        };
    } catch {
        return null;
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

    // Try primary, then fallback
    const result = await tryIpApi(ip) || await tryIpapiCo(ip) || UNKNOWN;

    // Cache the result (even UNKNOWN to avoid repeated failed lookups)
    geoCache.set(ip, {
        data: result,
        expiresAt: Date.now() + (result === UNKNOWN ? 5 * 60 * 1000 : CACHE_TTL_MS),
    });

    // Periodic cleanup
    if (geoCache.size % 100 === 0) pruneCache();

    return result;
}

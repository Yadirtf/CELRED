'use client';

import { useEffect, useState } from 'react';
import { Eye, Users } from 'lucide-react';

interface CatalogStats {
    activeViewers: number;
    totalVisits: number;
}

const POLL_INTERVAL_MS = 10_000; // 10 seconds

export default function CatalogViewerStats() {
    const [stats, setStats] = useState<CatalogStats>({ activeViewers: 0, totalVisits: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch('/api/catalog-stats');
                if (res.ok) {
                    const data = await res.json();
                    setStats(data);
                }
            } catch {
                /* silently fail */
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
        const interval = setInterval(fetchStats, POLL_INTERVAL_MS);
        return () => clearInterval(interval);
    }, []);

    const formatNumber = (n: number): string => {
        if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
        return n.toString();
    };

    if (loading) {
        return (
            <div className="flex gap-3">
                <div className="h-9 w-20 bg-gray-100 rounded-full animate-pulse" />
                <div className="h-9 w-24 bg-gray-100 rounded-full animate-pulse" />
            </div>
        );
    }

    return (
        <div className="flex items-center gap-3">
            {/* Active viewers */}
            <div
                className="flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all duration-300"
                style={{
                    background: stats.activeViewers > 0
                        ? 'linear-gradient(135deg, #ecfdf5, #d1fae5)'
                        : '#f9fafb',
                    borderColor: stats.activeViewers > 0 ? '#6ee7b7' : '#e5e7eb',
                }}
                title="Personas viendo el catálogo ahora"
            >
                <div className="relative">
                    <Eye
                        className="w-4 h-4 transition-colors duration-300"
                        style={{
                            color: stats.activeViewers > 0 ? '#059669' : '#9ca3af',
                        }}
                    />
                    {stats.activeViewers > 0 && (
                        <span
                            className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full animate-pulse"
                            style={{ backgroundColor: '#10b981' }}
                        />
                    )}
                </div>
                <span
                    className="text-sm font-bold tabular-nums transition-colors duration-300"
                    style={{
                        color: stats.activeViewers > 0 ? '#059669' : '#6b7280',
                    }}
                >
                    {stats.activeViewers}
                </span>
                <span
                    className="text-xs font-medium hidden sm:inline transition-colors duration-300"
                    style={{
                        color: stats.activeViewers > 0 ? '#047857' : '#9ca3af',
                    }}
                >
                    en línea
                </span>
            </div>

            {/* Total visits */}
            <div
                className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-gray-200 bg-gray-50"
                title="Total de visitas al catálogo"
            >
                <Users className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-bold tabular-nums text-gray-700">
                    {formatNumber(stats.totalVisits)}
                </span>
                <span className="text-xs font-medium text-gray-400 hidden sm:inline">
                    visitas
                </span>
            </div>
        </div>
    );
}

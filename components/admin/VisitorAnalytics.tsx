'use client';

import { useEffect, useState, useCallback } from 'react';
import { Eye, Users, Calendar, MapPin, Monitor, Smartphone, Globe, RefreshCw, BarChart3 } from 'lucide-react';
import { StatCard, BreakdownBar, CityRanking } from '@/components/admin/analytics/StatComponents';
import { RecentVisitorsTable } from '@/components/admin/analytics/VisitorTable';

// ── Types ──
interface AnalyticsData {
    recentVisitors: any[];
    stats: {
        visitsToday: number;
        visitsLast7Days: number;
        visitsLast30Days: number;
        uniqueCitiesToday: number;
    };
    breakdowns: {
        devices: any[];
        browsers: any[];
        os: any[];
        cities: any[];
    };
}

// ── Helpers ──
function deviceEmoji(device: string) {
    switch (device) {
        case 'Mobile': return '📱';
        case 'Tablet': return '📟';
        default: return '💻';
    }
}

export default function VisitorAnalytics() {
    const [data, setData] = useState<AnalyticsData | null>(null);
    const [liveStats, setLiveStats] = useState({ activeViewers: 0, totalVisits: 0 });
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchData = useCallback(async () => {
        try {
            const [analyticsRes, liveRes] = await Promise.all([
                fetch('/api/catalog-stats/visitors'),
                fetch('/api/catalog-stats'),
            ]);

            if (analyticsRes.ok) setData(await analyticsRes.json());
            if (liveRes.ok) setLiveStats(await liveRes.json());
        } catch { /* silently fail */ } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
        const interval = setInterval(async () => {
            try {
                const res = await fetch('/api/catalog-stats');
                if (res.ok) setLiveStats(await res.json());
            } catch {}
        }, 15_000);
        return () => clearInterval(interval);
    }, [fetchData]);

    const handleRefresh = () => {
        setRefreshing(true);
        fetchData();
    };

    if (loading) {
        return (
            <div className="space-y-6 animate-pulse">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[...Array(4)].map((_, i) => <div key={i} className="h-20 bg-gray-100 rounded-xl" />)}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="h-64 bg-gray-100 rounded-xl" />
                    <div className="h-64 bg-gray-100 rounded-xl" />
                </div>
                <div className="h-48 bg-gray-100 rounded-xl" />
            </div>
        );
    }

    if (!data) {
        return (
            <div className="text-center py-16 text-gray-400">
                <BarChart3 className="w-10 h-10 mx-auto mb-3 opacity-40" />
                <p className="font-medium">No se pudieron cargar las estadísticas</p>
                <button onClick={handleRefresh} className="mt-3 text-sm text-blue-500 hover:underline">Reintentar</button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-indigo-500" />
                        Audiencia del Catálogo
                    </h2>
                    <p className="text-sm text-gray-400 mt-0.5">Datos de los últimos 30 días</p>
                </div>
                <button onClick={handleRefresh} disabled={refreshing} className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors disabled:opacity-50">
                    <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                    Actualizar
                </button>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard icon={<Eye className="w-5 h-5" />} label="En línea ahora" value={liveStats.activeViewers} color="#10b981" subtext="Tiempo real" />
                <StatCard icon={<Users className="w-5 h-5" />} label="Visitas hoy" value={data.stats.visitsToday} color="#3b82f6" />
                <StatCard icon={<Calendar className="w-5 h-5" />} label="Últimos 7 días" value={data.stats.visitsLast7Days} color="#8b5cf6" />
                <StatCard icon={<MapPin className="w-5 h-5" />} label="Ciudades hoy" value={data.stats.uniqueCitiesToday} color="#f59e0b" subtext="Ciudades únicas" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
                    <h3 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
                        <Smartphone className="w-4 h-4 text-blue-500" />
                        Dispositivos
                    </h3>
                    <div className="space-y-3">
                        {data.breakdowns.devices.map((d, i) => {
                            const total = data.breakdowns.devices.reduce((s, x) => s + x.count, 0);
                            const pct = total > 0 ? Math.round((d.count / total) * 100) : 0;
                            const colors = ['#3b82f6', '#10b981', '#f59e0b'];
                            return (
                                <div key={d.name} className="flex items-center justify-between">
                                    <span className="flex items-center gap-2 text-sm text-gray-600">
                                        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: colors[i % colors.length] }} />
                                        {deviceEmoji(d.name)} {d.name}
                                    </span>
                                    <span className="text-sm font-bold text-gray-700 tabular-nums">
                                        {pct}% <span className="text-xs text-gray-400 font-normal ml-1">({d.count})</span>
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
                    <h3 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-indigo-500" />
                        Top Ciudades
                    </h3>
                    <CityRanking cities={data.breakdowns.cities} />
                </div>

                <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
                    <h3 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
                        <Globe className="w-4 h-4 text-cyan-500" />
                        Navegadores
                    </h3>
                    <BreakdownBar items={data.breakdowns.browsers} colorStart="#06b6d4" colorEnd="#0891b2" />
                </div>

                <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
                    <h3 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
                        <Monitor className="w-4 h-4 text-emerald-500" />
                        Sistemas Operativos
                    </h3>
                    <BreakdownBar items={data.breakdowns.os} colorStart="#10b981" colorEnd="#059669" />
                </div>
            </div>

            <RecentVisitorsTable visitors={data.recentVisitors} />
        </div>
    );
}

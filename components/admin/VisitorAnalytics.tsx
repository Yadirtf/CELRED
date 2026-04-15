'use client';

import { useEffect, useState, useCallback } from 'react';
import {
    Eye, Users, Calendar, MapPin, Monitor, Smartphone, Tablet,
    Globe, RefreshCw, ChevronDown, ChevronUp, BarChart3,
} from 'lucide-react';

// ── Types ──

interface VisitorRecord {
    _id: string;
    visitorId: string;
    ip: string;
    device: 'Mobile' | 'Tablet' | 'Desktop';
    browser: string;
    os: string;
    city: string;
    region: string;
    country: string;
    referrer: string;
    screenResolution: string;
    visitedAt: string;
}

interface BreakdownItem {
    name: string;
    count: number;
}

interface CityItem {
    city: string;
    region: string;
    country: string;
    count: number;
}

interface AnalyticsData {
    recentVisitors: VisitorRecord[];
    stats: {
        visitsToday: number;
        visitsLast7Days: number;
        visitsLast30Days: number;
        uniqueCitiesToday: number;
    };
    breakdowns: {
        devices: BreakdownItem[];
        browsers: BreakdownItem[];
        os: BreakdownItem[];
        cities: CityItem[];
    };
}

interface LiveStats {
    activeViewers: number;
    totalVisits: number;
}

// ── Helpers ──

function maskIp(ip: string): string {
    // DEV: Mostrar IP completa para pruebas.
    // En producción, descomentar la lógica de abajo:
    // const parts = ip.split('.');
    // if (parts.length === 4) return `${parts[0]}.${parts[1]}.${parts[2]}.xxx`;
    return ip;
}

function formatDate(dateStr: string): string {
    const d = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);

    if (diffMins < 1) return 'Ahora';
    if (diffMins < 60) return `Hace ${diffMins}m`;
    if (diffHours < 24) return `Hace ${diffHours}h`;

    return d.toLocaleDateString('es-CO', {
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
    });
}

function deviceIcon(device: string) {
    switch (device) {
        case 'Mobile': return <Smartphone className="w-4 h-4" />;
        case 'Tablet': return <Tablet className="w-4 h-4" />;
        default: return <Monitor className="w-4 h-4" />;
    }
}

function deviceEmoji(device: string) {
    switch (device) {
        case 'Mobile': return '📱';
        case 'Tablet': return '📟';
        default: return '💻';
    }
}

function truncateReferrer(ref: string): string {
    if (!ref || ref === 'Directo') return 'Directo';
    try {
        const url = new URL(ref);
        return url.hostname.replace('www.', '');
    } catch {
        return ref.slice(0, 30);
    }
}

// ── Stat Card Component ──

function StatCard({ icon, label, value, color, subtext }: {
    icon: React.ReactNode;
    label: string;
    value: number | string;
    color: string;
    subtext?: string;
}) {
    return (
        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
                <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `${color}15` }}
                >
                    <div style={{ color }}>{icon}</div>
                </div>
                <div className="min-w-0">
                    <p className="text-2xl font-bold text-gray-800 tabular-nums">{value}</p>
                    <p className="text-xs text-gray-500 font-medium truncate">{label}</p>
                    {subtext && <p className="text-[10px] text-gray-400 mt-0.5">{subtext}</p>}
                </div>
            </div>
        </div>
    );
}

// ── Breakdown Bar Component ──

function BreakdownBar({ items, colorStart, colorEnd, icon }: {
    items: BreakdownItem[];
    colorStart: string;
    colorEnd: string;
    icon?: React.ReactNode;
}) {
    const total = items.reduce((sum, i) => sum + i.count, 0);
    if (total === 0) {
        return <p className="text-sm text-gray-400 italic py-4 text-center">Sin datos aún</p>;
    }

    return (
        <div className="space-y-2.5">
            {items.map((item, idx) => {
                const pct = Math.round((item.count / total) * 100);
                return (
                    <div key={item.name} className="group">
                        <div className="flex items-center justify-between text-sm mb-1">
                            <span className="font-medium text-gray-700 flex items-center gap-1.5">
                                {icon && idx === 0 && icon}
                                {item.name}
                            </span>
                            <span className="text-gray-400 tabular-nums text-xs font-semibold">
                                {item.count} <span className="text-gray-300">({pct}%)</span>
                            </span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                                className="h-full rounded-full transition-all duration-700 ease-out"
                                style={{
                                    width: `${pct}%`,
                                    background: `linear-gradient(90deg, ${colorStart}, ${colorEnd})`,
                                }}
                            />
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

// ── City Ranking Component ──

function CityRanking({ cities }: { cities: CityItem[] }) {
    const maxCount = cities[0]?.count || 1;

    if (cities.length === 0) {
        return <p className="text-sm text-gray-400 italic py-4 text-center">Sin datos de ubicación</p>;
    }

    return (
        <div className="space-y-2">
            {cities.map((c, idx) => (
                <div key={`${c.city}-${c.region}`} className="flex items-center gap-3">
                    <span className="text-xs font-bold text-gray-400 w-5 text-right tabular-nums">
                        {idx + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-0.5">
                            <span className="text-sm font-medium text-gray-700 truncate">
                                {c.city}
                            </span>
                            <span className="text-xs text-gray-400 tabular-nums ml-2 shrink-0">
                                {c.count}
                            </span>
                        </div>
                        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div
                                className="h-full rounded-full transition-all duration-700"
                                style={{
                                    width: `${(c.count / maxCount) * 100}%`,
                                    background: 'linear-gradient(90deg, #6366f1, #8b5cf6)',
                                }}
                            />
                        </div>
                        <p className="text-[10px] text-gray-400 mt-0.5">
                            {c.region}, {c.country}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
}

// ── Main Dashboard Component ──

export default function VisitorAnalytics() {
    const [data, setData] = useState<AnalyticsData | null>(null);
    const [liveStats, setLiveStats] = useState<LiveStats>({ activeViewers: 0, totalVisits: 0 });
    const [loading, setLoading] = useState(true);
    const [showAllVisitors, setShowAllVisitors] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const fetchData = useCallback(async () => {
        try {
            const [analyticsRes, liveRes] = await Promise.all([
                fetch('/api/catalog-stats/visitors'),
                fetch('/api/catalog-stats'),
            ]);

            if (analyticsRes.ok) {
                const analyticsData = await analyticsRes.json();
                setData(analyticsData);
            }
            if (liveRes.ok) {
                const live = await liveRes.json();
                setLiveStats(live);
            }
        } catch {
            /* silently fail */
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
        // Refresh live stats every 15 seconds
        const interval = setInterval(async () => {
            try {
                const res = await fetch('/api/catalog-stats');
                if (res.ok) setLiveStats(await res.json());
            } catch { /* */ }
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
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-20 bg-gray-100 rounded-xl" />
                    ))}
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
                <button onClick={handleRefresh} className="mt-3 text-sm text-blue-500 hover:underline">
                    Reintentar
                </button>
            </div>
        );
    }

    const visibleVisitors = showAllVisitors
        ? data.recentVisitors
        : data.recentVisitors.slice(0, 10);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-indigo-500" />
                        Audiencia del Catálogo
                    </h2>
                    <p className="text-sm text-gray-400 mt-0.5">
                        Datos de los últimos 30 días
                    </p>
                </div>
                <button
                    onClick={handleRefresh}
                    disabled={refreshing}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors disabled:opacity-50"
                >
                    <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                    Actualizar
                </button>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    icon={<Eye className="w-5 h-5" />}
                    label="En línea ahora"
                    value={liveStats.activeViewers}
                    color="#10b981"
                    subtext="Tiempo real"
                />
                <StatCard
                    icon={<Users className="w-5 h-5" />}
                    label="Visitas hoy"
                    value={data.stats.visitsToday}
                    color="#3b82f6"
                />
                <StatCard
                    icon={<Calendar className="w-5 h-5" />}
                    label="Últimos 7 días"
                    value={data.stats.visitsLast7Days}
                    color="#8b5cf6"
                />
                <StatCard
                    icon={<MapPin className="w-5 h-5" />}
                    label="Ciudades hoy"
                    value={data.stats.uniqueCitiesToday}
                    color="#f59e0b"
                    subtext="Ciudades únicas"
                />
            </div>

            {/* Breakdowns Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Devices */}
                <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
                    <h3 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
                        <Smartphone className="w-4 h-4 text-blue-500" />
                        Dispositivos
                    </h3>

                    {/* Visual device split */}
                    {data.breakdowns.devices.length > 0 && (
                        <div className="flex gap-1 h-3 rounded-full overflow-hidden mb-4">
                            {data.breakdowns.devices.map((d, i) => {
                                const total = data.breakdowns.devices.reduce((s, x) => s + x.count, 0);
                                const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];
                                return (
                                    <div
                                        key={d.name}
                                        className="transition-all duration-700"
                                        style={{
                                            width: `${(d.count / total) * 100}%`,
                                            backgroundColor: colors[i % colors.length],
                                            borderRadius: i === 0 ? '9999px 0 0 9999px'
                                                : i === data.breakdowns.devices.length - 1 ? '0 9999px 9999px 0' : '0',
                                        }}
                                        title={`${d.name}: ${d.count}`}
                                    />
                                );
                            })}
                        </div>
                    )}

                    <div className="space-y-3">
                        {data.breakdowns.devices.map((d, i) => {
                            const total = data.breakdowns.devices.reduce((s, x) => s + x.count, 0);
                            const pct = total > 0 ? Math.round((d.count / total) * 100) : 0;
                            const colors = ['#3b82f6', '#10b981', '#f59e0b'];
                            return (
                                <div key={d.name} className="flex items-center justify-between">
                                    <span className="flex items-center gap-2 text-sm text-gray-600">
                                        <span
                                            className="w-2.5 h-2.5 rounded-full shrink-0"
                                            style={{ backgroundColor: colors[i % colors.length] }}
                                        />
                                        {deviceEmoji(d.name)} {d.name}
                                    </span>
                                    <span className="text-sm font-bold text-gray-700 tabular-nums">
                                        {pct}%
                                        <span className="text-xs text-gray-400 font-normal ml-1">({d.count})</span>
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Cities */}
                <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
                    <h3 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-indigo-500" />
                        Top Ciudades
                    </h3>
                    <CityRanking cities={data.breakdowns.cities} />
                </div>

                {/* Browsers */}
                <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
                    <h3 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
                        <Globe className="w-4 h-4 text-cyan-500" />
                        Navegadores
                    </h3>
                    <BreakdownBar
                        items={data.breakdowns.browsers}
                        colorStart="#06b6d4"
                        colorEnd="#0891b2"
                    />
                </div>

                {/* OS */}
                <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
                    <h3 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
                        <Monitor className="w-4 h-4 text-emerald-500" />
                        Sistemas Operativos
                    </h3>
                    <BreakdownBar
                        items={data.breakdowns.os}
                        colorStart="#10b981"
                        colorEnd="#059669"
                    />
                </div>
            </div>

            {/* Recent Visitors Table */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                    <h3 className="text-sm font-bold text-gray-700 flex items-center gap-2">
                        🕒 Visitantes Recientes
                    </h3>
                    <span className="text-xs text-gray-400">
                        Últimos {data.recentVisitors.length} visitantes
                    </span>
                </div>

                {data.recentVisitors.length === 0 ? (
                    <div className="px-5 py-10 text-center text-gray-400 text-sm">
                        Aún no hay visitantes registrados
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="bg-gray-50/80">
                                        <th className="text-left px-4 py-2.5 font-semibold text-gray-500 text-xs uppercase tracking-wider">Cuando</th>
                                        <th className="text-left px-4 py-2.5 font-semibold text-gray-500 text-xs uppercase tracking-wider">IP</th>
                                        <th className="text-left px-4 py-2.5 font-semibold text-gray-500 text-xs uppercase tracking-wider">Ciudad</th>
                                        <th className="text-center px-4 py-2.5 font-semibold text-gray-500 text-xs uppercase tracking-wider">Dispositivo</th>
                                        <th className="text-left px-4 py-2.5 font-semibold text-gray-500 text-xs uppercase tracking-wider">Navegador</th>
                                        <th className="text-left px-4 py-2.5 font-semibold text-gray-500 text-xs uppercase tracking-wider">OS</th>
                                        <th className="text-left px-4 py-2.5 font-semibold text-gray-500 text-xs uppercase tracking-wider">Desde</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {visibleVisitors.map((v) => (
                                        <tr
                                            key={v._id}
                                            className="hover:bg-blue-50/30 transition-colors"
                                        >
                                            <td className="px-4 py-2.5 text-gray-600 whitespace-nowrap">
                                                {formatDate(v.visitedAt)}
                                            </td>
                                            <td className="px-4 py-2.5 text-gray-400 font-mono text-xs whitespace-nowrap">
                                                {maskIp(v.ip)}
                                            </td>
                                            <td className="px-4 py-2.5 whitespace-nowrap">
                                                <span className="text-gray-700 font-medium">{v.city}</span>
                                                {v.region && v.region !== 'Desconocido' && (
                                                    <span className="text-gray-400 text-xs ml-1">
                                                        ({v.region})
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-4 py-2.5 text-center">
                                                <span
                                                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
                                                    style={{
                                                        backgroundColor: v.device === 'Mobile' ? '#eff6ff'
                                                            : v.device === 'Tablet' ? '#fef3c7'
                                                            : '#f0fdf4',
                                                        color: v.device === 'Mobile' ? '#2563eb'
                                                            : v.device === 'Tablet' ? '#d97706'
                                                            : '#16a34a',
                                                    }}
                                                >
                                                    {deviceIcon(v.device)}
                                                    {v.device}
                                                </span>
                                            </td>
                                            <td className="px-4 py-2.5 text-gray-600 whitespace-nowrap">
                                                {v.browser}
                                            </td>
                                            <td className="px-4 py-2.5 text-gray-500 whitespace-nowrap text-xs">
                                                {v.os}
                                            </td>
                                            <td className="px-4 py-2.5 text-gray-400 whitespace-nowrap text-xs">
                                                {truncateReferrer(v.referrer)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {data.recentVisitors.length > 10 && (
                            <div className="px-5 py-3 border-t border-gray-100 text-center">
                                <button
                                    onClick={() => setShowAllVisitors(!showAllVisitors)}
                                    className="text-sm text-blue-500 hover:text-blue-700 font-medium inline-flex items-center gap-1 transition-colors"
                                >
                                    {showAllVisitors ? (
                                        <>
                                            <ChevronUp className="w-4 h-4" />
                                            Mostrar menos
                                        </>
                                    ) : (
                                        <>
                                            <ChevronDown className="w-4 h-4" />
                                            Ver todos ({data.recentVisitors.length})
                                        </>
                                    )}
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

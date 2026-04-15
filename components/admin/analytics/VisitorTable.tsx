import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Monitor, Smartphone, Tablet } from 'lucide-react';

export function maskIp(ip: string): string {
    return ip;
}

export function formatDate(dateStr: string): string {
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

function truncateReferrer(ref: string): string {
    if (!ref || ref === 'Directo') return 'Directo';
    try {
        const url = new URL(ref);
        return url.hostname.replace('www.', '');
    } catch {
        return ref.slice(0, 30);
    }
}

export function RecentVisitorsTable({ visitors }: { visitors: any[] }) {
    const [showAll, setShowAll] = useState(false);
    const visibleVisitors = showAll ? visitors : visitors.slice(0, 10);

    return (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-sm font-bold text-gray-700 flex items-center gap-2">
                    🕒 Visitantes Recientes
                </h3>
                <span className="text-xs text-gray-400">
                    Últimos {visitors.length} visitantes
                </span>
            </div>

            {visitors.length === 0 ? (
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
                                    <tr key={v._id} className="hover:bg-blue-50/30 transition-colors">
                                        <td className="px-4 py-2.5 text-gray-600 whitespace-nowrap">{formatDate(v.visitedAt)}</td>
                                        <td className="px-4 py-2.5 text-gray-400 font-mono text-xs whitespace-nowrap">{maskIp(v.ip)}</td>
                                        <td className="px-4 py-2.5 whitespace-nowrap">
                                            <span className="text-gray-700 font-medium">{v.city}</span>
                                            {v.region && v.region !== 'Desconocido' && (
                                                <span className="text-gray-400 text-xs ml-1">({v.region})</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-2.5 text-center">
                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
                                                style={{
                                                    backgroundColor: v.device === 'Mobile' ? '#eff6ff' : v.device === 'Tablet' ? '#fef3c7' : '#f0fdf4',
                                                    color: v.device === 'Mobile' ? '#2563eb' : v.device === 'Tablet' ? '#d97706' : '#16a34a',
                                                }}>
                                                {deviceIcon(v.device)}
                                                {v.device}
                                            </span>
                                        </td>
                                        <td className="px-4 py-2.5 text-gray-600 whitespace-nowrap">{v.browser}</td>
                                        <td className="px-4 py-2.5 text-gray-500 whitespace-nowrap text-xs">{v.os}</td>
                                        <td className="px-4 py-2.5 text-gray-400 whitespace-nowrap text-xs">{truncateReferrer(v.referrer)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {visitors.length > 10 && (
                        <div className="px-5 py-3 border-t border-gray-100 text-center">
                            <button
                                onClick={() => setShowAll(!showAll)}
                                className="text-sm text-blue-500 hover:text-blue-700 font-medium inline-flex items-center gap-1 transition-colors"
                            >
                                {showAll ? (
                                    <><ChevronUp className="w-4 h-4" /> Mostrar menos</>
                                ) : (
                                    <><ChevronDown className="w-4 h-4" /> Ver todos ({visitors.length})</>
                                )}
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

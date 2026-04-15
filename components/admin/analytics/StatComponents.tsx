import React from 'react';

export function StatCard({ icon, label, value, color, subtext }: {
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

export function BreakdownBar({ items, colorStart, colorEnd, icon }: {
    items: { name: string; count: number; }[];
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

export function CityRanking({ cities }: { cities: { city: string; region: string; country: string; count: number; }[] }) {
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

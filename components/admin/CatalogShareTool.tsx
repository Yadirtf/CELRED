'use client';

import { Advisor } from '@/core/entities/Settings';
import { Button } from '@/components/ui/Button';
import { Share2, Copy } from 'lucide-react';

interface CatalogShareToolProps {
    advisors: Advisor[];
}

export default function CatalogShareTool({ advisors }: CatalogShareToolProps) {
    return (
        <div className="pt-6 border-t border-gray-100">
            <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Share2 className="w-4 h-4 text-green-600" />
                Herramienta de Compartición Global
            </h3>
            <div className="bg-green-50/50 rounded-xl p-4 border border-green-100/50">
                <p className="text-sm text-green-800 mb-4">
                    Genera un link para compartir el catálogo completo con un asesor específico.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-green-700 uppercase">
                            Seleccionar Asesor
                        </label>
                        <select
                            className="w-full bg-white border border-green-200 rounded-lg px-3 py-2 text-sm"
                            onChange={(e) => {
                                const url = `${window.location.origin}/?wa=${e.target.value}`;
                                (document.getElementById('global-link') as HTMLInputElement).value = url;
                            }}
                        >
                            <option value="">Selecciona un asesor...</option>
                            {advisors.map((n, i) => (
                                <option key={i} value={n.number}>
                                    {n.name ? `${n.name} (${n.number})` : n.number}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-green-700 uppercase">
                            Link del Catálogo
                        </label>
                        <div className="flex gap-2">
                            <input
                                id="global-link"
                                readOnly
                                className="flex-1 bg-white border border-green-200 rounded-lg px-3 py-2 text-xs font-mono"
                                placeholder="Selecciona un número primero"
                            />
                            <Button
                                size="sm"
                                onClick={() => {
                                    const val = (document.getElementById('global-link') as HTMLInputElement).value;
                                    if (val) navigator.clipboard.writeText(val);
                                }}
                            >
                                <Copy className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

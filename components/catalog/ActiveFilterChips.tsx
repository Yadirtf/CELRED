'use client';

import { X } from 'lucide-react';
import { Brand } from '@/core/entities/Brand';

interface ActiveFilterChipsProps {
    searchTerm: string;
    onSearchClear: () => void;
    selectedBrand: string;
    onBrandClear: () => void;
    brands: Brand[];
    totalFiltered: number;
    onResetAll: () => void;
}

export default function ActiveFilterChips({
    searchTerm,
    onSearchClear,
    selectedBrand,
    onBrandClear,
    brands,
    totalFiltered,
    onResetAll
}: ActiveFilterChipsProps) {
    const hasFilters = selectedBrand !== 'all' || searchTerm.trim() !== '';
    if (!hasFilters) return null;

    const selectedBrandName = brands.find((b) => b.id === selectedBrand)?.name;

    return (
        <div className="flex flex-col gap-2 pt-3 pb-1">
            <div className="flex flex-wrap items-center gap-2">
                {selectedBrand !== 'all' && selectedBrandName && (
                    <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                        {selectedBrandName}
                        <button onClick={onBrandClear} className="hover:text-blue-900 transition-colors">
                            <X className="w-3 h-3" />
                        </button>
                    </span>
                )}
                {searchTerm && (
                    <span className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-700 border border-gray-200 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                        "{searchTerm}"
                        <button onClick={onSearchClear} className="hover:text-gray-900 transition-colors">
                            <X className="w-3 h-3" />
                        </button>
                    </span>
                )}
            </div>

            <div className="flex justify-between items-center px-1">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    {totalFiltered} Resultado{totalFiltered !== 1 ? 's' : ''}
                </span>
                <button
                    onClick={onResetAll}
                    className="text-[10px] font-bold text-red-500 uppercase tracking-widest hover:text-red-700 transition-colors"
                >
                    Limpiar Todo
                </button>
            </div>
        </div>
    );
}

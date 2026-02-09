'use client';

import { Search } from 'lucide-react';
import { Input } from './ui/Input';
import { Brand } from '@/core/entities/Brand';

interface ProductFilterProps {
    searchTerm: string;
    onSearchChange: (value: string) => void;
    selectedBrand: string;
    onBrandChange: (value: string) => void;
    brands: Brand[];
    placeholder?: string;
    variant?: 'admin' | 'catalog';
}

export default function ProductFilter({
    searchTerm,
    onSearchChange,
    selectedBrand,
    onBrandChange,
    brands,
    placeholder = "Buscar celular...",
    variant = 'admin'
}: ProductFilterProps) {
    if (variant === 'catalog') {
        return (
            <div className="space-y-6">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                        placeholder={placeholder}
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
                    />
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Search className="w-5 h-5 text-gray-500" />
                        Filtrar por Marca
                    </h3>
                    <div className="space-y-2">
                        <button
                            onClick={() => onBrandChange('all')}
                            className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${selectedBrand === 'all'
                                ? 'bg-blue-600 text-white shadow-md'
                                : 'text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            Todas las marcas
                        </button>
                        {brands.map(brand => (
                            <button
                                key={brand.id}
                                onClick={() => onBrandChange(brand.id!)}
                                className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${selectedBrand === brand.id
                                    ? 'bg-blue-600 text-white shadow-md'
                                    : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                            >
                                {brand.name}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col md:flex-row gap-4 items-end bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
            <div className="flex-1 w-full">
                <Input
                    label="Buscar"
                    placeholder={placeholder}
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="w-full"
                />
            </div>
            <div className="w-full md:w-64">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Marca</label>
                <select
                    className="w-full rounded-md border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={selectedBrand}
                    onChange={(e) => onBrandChange(e.target.value)}
                >
                    <option value="all">Todas las marcas</option>
                    {brands.map(b => (
                        <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                </select>
            </div>
        </div>
    );
}

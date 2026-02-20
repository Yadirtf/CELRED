'use client';

import { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, X, Tag } from 'lucide-react';
import { Brand } from '@/core/entities/Brand';
import { Product } from '@/core/entities/Product';

interface CatalogFilterProps {
    searchTerm: string;
    onSearchChange: (value: string) => void;
    selectedBrand: string;
    onBrandChange: (value: string) => void;
    brands: Brand[];
    products: Product[]; // all products (unfiltered) for counters
    totalFiltered: number;
}

function getBrandCount(products: Product[], brandId: string): number {
    return products.filter((p) => {
        const pid =
            typeof p.brand === 'object' && p.brand !== null
                ? (p.brand as any)._id || (p.brand as Brand).id
                : p.brand;
        return pid === brandId;
    }).length;
}

// ── Desktop Sidebar ──────────────────────────────────────────────
function DesktopSidebar({
    searchTerm,
    onSearchChange,
    selectedBrand,
    onBrandChange,
    brands,
    products,
}: CatalogFilterProps) {
    const hasActiveFilter = selectedBrand !== 'all' || searchTerm.trim() !== '';

    const handleReset = () => {
        onBrandChange('all');
        onSearchChange('');
    };

    return (
        <div className="hidden lg:flex flex-col gap-6 w-64 flex-shrink-0">
            {/* Search */}
            <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Buscar</label>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                        placeholder="Buscar celular..."
                        className="w-full pl-10 pr-9 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
                    />
                    {searchTerm && (
                        <button
                            onClick={() => onSearchChange('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>

            {/* Filter Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Card Header */}
                <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Tag className="w-4 h-4 text-blue-500" />
                        <span className="text-sm font-bold text-gray-800">Marcas</span>
                    </div>
                </div>

                {/* Brand list */}
                <div className="p-3 space-y-1 max-h-[calc(100vh-20rem)] overflow-y-auto custom-scrollbar">
                    {/* All brands button */}
                    <button
                        onClick={() => onBrandChange('all')}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${selectedBrand === 'all'
                                ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            }`}
                    >
                        <span>Todas las marcas</span>
                        <span
                            className={`text-xs font-bold px-2 py-0.5 rounded-full ${selectedBrand === 'all'
                                    ? 'bg-white/20 text-white'
                                    : 'bg-gray-100 text-gray-500'
                                }`}
                        >
                            {products.length}
                        </span>
                    </button>

                    {brands.map((brand) => {
                        const count = getBrandCount(products, brand.id!);
                        const isActive = selectedBrand === brand.id;
                        return (
                            <button
                                key={brand.id}
                                onClick={() => onBrandChange(brand.id!)}
                                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${isActive
                                        ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                    }`}
                            >
                                <span className="truncate mr-2">{brand.name}</span>
                                <span
                                    className={`text-xs font-bold px-2 py-0.5 rounded-full shrink-0 ${isActive
                                            ? 'bg-white/20 text-white'
                                            : 'bg-gray-100 text-gray-500'
                                        }`}
                                >
                                    {count}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {hasActiveFilter && (
                    <div className="p-3 border-t border-gray-50">
                        <button
                            onClick={handleReset}
                            className="w-full py-2 text-xs text-red-600 hover:bg-red-50 rounded-lg font-bold transition-colors flex items-center justify-center gap-2"
                        >
                            <X className="w-3.5 h-3.5" /> Limpiar Filtros
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

// ── Mobile Filter ────────────────────────────────────────────────
function MobileFilter({
    searchTerm,
    onSearchChange,
    selectedBrand,
    onBrandChange,
    brands,
    products,
    totalFiltered,
}: CatalogFilterProps) {
    const [isOpen, setIsOpen] = useState(false);
    const activeFilters = (selectedBrand !== 'all' ? 1 : 0) + (searchTerm.trim() ? 1 : 0);

    // Lock body scroll when drawer is open
    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    const handleBrandSelect = (brandId: string) => {
        onBrandChange(brandId);
        setIsOpen(false);
    };

    const handleReset = () => {
        onBrandChange('all');
        onSearchChange('');
    };

    const selectedBrandName = brands.find((b) => b.id === selectedBrand)?.name;

    return (
        <div className="lg:hidden">
            {/* Sticky top bar */}
            <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm -mx-4 px-4 py-3 flex items-center gap-3">
                {/* Search input */}
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                        placeholder="Buscar celular..."
                        className="w-full pl-9 pr-8 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                    />
                    {searchTerm && (
                        <button
                            onClick={() => onSearchChange('')}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </div>

                {/* Filter button */}
                <button
                    onClick={() => setIsOpen(true)}
                    className={`relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold border transition-all shrink-0 ${activeFilters > 0
                            ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-200'
                            : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
                        }`}
                >
                    <SlidersHorizontal className="w-4 h-4" />
                    <span className="hidden sm:inline">Filtros</span>
                    {activeFilters > 0 && (
                        <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow">
                            {activeFilters}
                        </span>
                    )}
                </button>
            </div>

            {/* Active filter chips */}
            <div className="flex flex-col gap-2 pt-3 pb-1">
                <div className="flex flex-wrap items-center gap-2">
                    {selectedBrand !== 'all' && selectedBrandName && (
                        <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                            {selectedBrandName}
                            <button onClick={() => onBrandChange('all')}>
                                <X className="w-3 h-3" />
                            </button>
                        </span>
                    )}
                    {searchTerm && (
                        <span className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-700 border border-gray-200 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                            "{searchTerm}"
                            <button onClick={() => onSearchChange('')}>
                                <X className="w-3 h-3" />
                            </button>
                        </span>
                    )}
                </div>
                {activeFilters > 0 && (
                    <div className="flex justify-between items-center px-1">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                            {totalFiltered} Resultado{totalFiltered !== 1 ? 's' : ''}
                        </span>
                        <button onClick={handleReset} className="text-[10px] font-bold text-red-500 uppercase tracking-widest">
                            Limpiar Todo
                        </button>
                    </div>
                )}
            </div>

            {/* Drawer Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Bottom Drawer */}
            <div
                className={`fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-[2.5rem] shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${isOpen ? 'translate-y-0' : 'translate-y-full'
                    }`}
                style={{ maxHeight: '85vh' }}
            >
                {/* Drag handle */}
                <div className="flex justify-center pt-4 pb-2">
                    <div className="w-12 h-1.5 bg-gray-200 rounded-full" />
                </div>

                {/* Drawer header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
                    <h3 className="text-xl font-extrabold text-gray-900">Aplicar Filtros</h3>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="p-2 rounded-full bg-gray-100 text-gray-500"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="overflow-y-auto p-6 space-y-8" style={{ maxHeight: 'calc(85vh - 120px)' }}>
                    {/* Brand Section */}
                    <div className="space-y-4 pb-10">
                        <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
                            <Tag className="w-4 h-4 text-blue-500" />
                            Marcas
                        </h4>
                        <div className="grid grid-cols-2 gap-2">
                            <button
                                onClick={() => handleBrandSelect('all')}
                                className={`flex items-center justify-between px-4 py-3 rounded-2xl border text-xs font-bold transition-all col-span-2 ${selectedBrand === 'all'
                                        ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-200'
                                        : 'bg-gray-50 text-gray-700 border-gray-100'
                                    }`}
                            >
                                <span>Todas las marcas</span>
                                <span className={`px-2 py-0.5 rounded-full ${selectedBrand === 'all' ? 'bg-white/20' : 'bg-gray-200 text-gray-500'}`}>
                                    {products.length}
                                </span>
                            </button>

                            {brands.map((brand) => {
                                const count = getBrandCount(products, brand.id!);
                                const isActive = selectedBrand === brand.id;
                                return (
                                    <button
                                        key={brand.id}
                                        onClick={() => handleBrandSelect(brand.id!)}
                                        className={`flex items-center justify-between px-4 py-3 rounded-2xl border text-xs font-bold transition-all ${isActive
                                                ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-200'
                                                : 'bg-gray-50 text-gray-700 border-gray-100'
                                            }`}
                                    >
                                        <span className="truncate mr-2">{brand.name}</span>
                                        <span className={`shrink-0 px-2 py-0.5 rounded-full ${isActive ? 'bg-white/20' : 'bg-gray-200 text-gray-500'}`}>
                                            {count}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Footer action */}
                <div className="p-6 border-t border-gray-50 bg-gray-50/50">
                    <button
                        onClick={() => setIsOpen(false)}
                        className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold shadow-xl shadow-gray-200 active:scale-[0.98] transition-transform"
                    >
                        Ver {totalFiltered} Productos
                    </button>
                </div>
            </div>
        </div>
    );
}

// ── Main Export ──────────────────────────────────────────────────
export default function CatalogFilter(props: CatalogFilterProps) {
    return (
        <>
            <DesktopSidebar {...props} />
            <MobileFilter {...props} />
        </>
    );
}

'use client';

import { useState } from 'react';
import { SlidersHorizontal, X, Tag } from 'lucide-react';
import { Brand } from '@/core/entities/Brand';
import { Product } from '@/core/entities/Product';
import CatalogSearch from './CatalogSearch';
import BrandFilterList from './BrandFilterList';
import ActiveFilterChips from './ActiveFilterChips';
import FilterDrawer from './FilterDrawer';

interface CatalogFilterProps {
    searchTerm: string;
    onSearchChange: (value: string) => void;
    selectedBrand: string;
    onBrandChange: (value: string) => void;
    brands: Brand[];
    products: Product[];
    totalFiltered: number;
}

// ── Desktop Sidebar Component ─────────────────────────────────────
function DesktopSidebar(props: CatalogFilterProps) {
    const { searchTerm, onSearchChange, selectedBrand, onBrandChange, brands, products } = props;
    const hasActiveFilter = selectedBrand !== 'all' || searchTerm.trim() !== '';

    return (
        <div className="hidden lg:flex flex-col gap-6 w-64 flex-shrink-0 sticky top-24 h-fit">
            <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Buscar</label>
                <CatalogSearch value={searchTerm} onChange={onSearchChange} placeholder="Buscar celular..." />
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Tag className="w-4 h-4 text-blue-500" />
                        <span className="text-sm font-bold text-gray-800">Marcas</span>
                    </div>
                </div>

                <BrandFilterList
                    brands={brands}
                    products={products}
                    selectedBrand={selectedBrand}
                    onBrandChange={onBrandChange}
                    variant="list"
                />

                {hasActiveFilter && (
                    <div className="p-3 border-t border-gray-50">
                        <button
                            onClick={() => { onBrandChange('all'); onSearchChange(''); }}
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

// ── Mobile Filter Component ───────────────────────────────────────
function MobileFilter(props: CatalogFilterProps) {
    const { searchTerm, onSearchChange, selectedBrand, onBrandChange, brands, products, totalFiltered } = props;
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const activeFiltersCount = (selectedBrand !== 'all' ? 1 : 0) + (searchTerm.trim() ? 1 : 0);

    const handleBrandSelect = (brandId: string) => {
        onBrandChange(brandId);
        setIsDrawerOpen(false);
    };

    return (
        <div className="lg:hidden contents">
            {/* Sticky Row: This must be a direct child of the flex container in page.tsx if possible, 
                or we use 'contents' to pass through the sticky behavior to the actual sticky div 
                so it stays relative to the tall container. */}
            <div className="sticky top-16 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-md -mx-4 px-4 py-3 flex items-center gap-3 transition-shadow">
                <CatalogSearch
                    value={searchTerm}
                    onChange={onSearchChange}
                    placeholder="Buscar celular..."
                    className="flex-1"
                />

                <button
                    onClick={() => setIsDrawerOpen(true)}
                    className={`relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold border transition-all shrink-0 ${activeFiltersCount > 0
                            ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-200'
                            : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
                        }`}
                >
                    <SlidersHorizontal className="w-4 h-4" />
                    <span className="hidden sm:inline">Filtros</span>
                    {activeFiltersCount > 0 && (
                        <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow">
                            {activeFiltersCount}
                        </span>
                    )}
                </button>
            </div>

            {/* Chips (Non-sticky part below the search bar) */}
            <ActiveFilterChips
                searchTerm={searchTerm}
                onSearchClear={() => onSearchChange('')}
                selectedBrand={selectedBrand}
                onBrandClear={() => onBrandChange('all')}
                brands={brands}
                totalFiltered={totalFiltered}
                onResetAll={() => { onSearchChange(''); onBrandChange('all'); }}
            />

            <FilterDrawer
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                title="Aplicar Filtros"
                actionLabel={`Ver ${totalFiltered} Productos`}
                onAction={() => setIsDrawerOpen(false)}
            >
                <div className="p-6 space-y-4 pb-10">
                    <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
                        <Tag className="w-4 h-4 text-blue-500" />
                        Marcas
                    </h4>
                    <BrandFilterList
                        brands={brands}
                        products={products}
                        selectedBrand={selectedBrand}
                        onBrandChange={handleBrandSelect}
                        variant="grid"
                    />
                </div>
            </FilterDrawer>
        </div>
    );
}

// ── Main Component Export ────────────────────────────────────────
export default function CatalogFilter(props: CatalogFilterProps) {
    return (
        <div className="contents">
            <DesktopSidebar {...props} />
            <MobileFilter {...props} />
        </div>
    );
}

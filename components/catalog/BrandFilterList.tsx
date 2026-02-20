'use client';

import { Brand } from '@/core/entities/Brand';
import { Product } from '@/core/entities/Product';

interface BrandFilterListProps {
    brands: Brand[];
    products: Product[];
    selectedBrand: string;
    onBrandChange: (brandId: string) => void;
    variant?: 'list' | 'grid';
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

export default function BrandFilterList({
    brands,
    products,
    selectedBrand,
    onBrandChange,
    variant = 'list'
}: BrandFilterListProps) {
    const isList = variant === 'list';

    const containerClasses = isList
        ? "space-y-1 max-h-[calc(100vh-20rem)] overflow-y-auto custom-scrollbar p-3"
        : "grid grid-cols-2 gap-2 p-4";

    const buttonBaseClasses = "flex items-center justify-between transition-all duration-150 font-medium text-sm";
    const listClasses = "w-full px-3 py-2.5 rounded-xl";
    const gridClasses = "px-4 py-3 rounded-2xl border";

    const getActiveClasses = (isActive: boolean) => {
        if (isActive) {
            return "bg-blue-600 text-white shadow-md shadow-blue-200 border-blue-600";
        }
        return isList
            ? "text-gray-600 hover:bg-gray-50 hover:text-gray-900 border-transparent"
            : "bg-gray-50 text-gray-700 border-gray-100";
    };

    const getBadgeClasses = (isActive: boolean) => {
        if (isActive) return "bg-white/20 text-white";
        return "bg-gray-100 text-gray-500";
    };

    return (
        <div className={containerClasses}>
            <button
                onClick={() => onBrandChange('all')}
                className={`${buttonBaseClasses} ${isList ? listClasses : `${gridClasses} col-span-2`} ${getActiveClasses(selectedBrand === 'all')}`}
            >
                <span>Todas las marcas</span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${getBadgeClasses(selectedBrand === 'all')}`}>
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
                        className={`${buttonBaseClasses} ${isList ? listClasses : gridClasses} ${getActiveClasses(isActive)}`}
                    >
                        <span className="truncate mr-2">{brand.name}</span>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full shrink-0 ${getBadgeClasses(isActive)}`}>
                            {count}
                        </span>
                    </button>
                );
            })}
        </div>
    );
}

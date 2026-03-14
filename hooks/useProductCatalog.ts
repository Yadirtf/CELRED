'use client';

import { useState, useEffect, useMemo } from 'react';
import { Product } from '@/core/entities/Product';
import { Brand } from '@/core/entities/Brand';
import { apiFetch } from '@/lib/apiFetch';

export function useProductCatalog() {
    const [products, setProducts] = useState<Product[]>([]);
    const [brands, setBrands] = useState<Brand[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedBrand, setSelectedBrand] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [productsData, brandsData] = await Promise.all([
                    apiFetch<Product[]>('/api/products'),
                    apiFetch<Brand[]>('/api/brands')
                ]);
                setProducts(productsData);
                setBrands(brandsData);
            } catch (error) {
                console.error('Error fetching catalog data', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const filteredProducts = useMemo(() => {
        return products.filter((product) => {
            const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                 product.description.toLowerCase().includes(searchTerm.toLowerCase());
            
            const brandId = typeof product.brand === 'object' ? (product.brand as any)._id || (product.brand as Brand).id : product.brand;
            const matchesBrand = selectedBrand === 'all' || brandId === selectedBrand;
            return matchesSearch && matchesBrand && product.stock > 0;
        });
    }, [products, searchTerm, selectedBrand]);

    return {
        products,
        brands,
        loading,
        filteredProducts,
        selectedBrand,
        setSelectedBrand,
        searchTerm,
        setSearchTerm,
    };
}

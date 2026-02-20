'use client';

import { useState, useEffect } from 'react';
import { Product } from '@/core/entities/Product';
import { Brand } from '@/core/entities/Brand';

export function useProductCatalog() {
    const [products, setProducts] = useState<Product[]>([]);
    const [brands, setBrands] = useState<Brand[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedBrand, setSelectedBrand] = useState<string>('all');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [productsRes, brandsRes] = await Promise.all([
                    fetch('/api/products'),
                    fetch('/api/brands'),
                ]);
                const productsData = await productsRes.json();
                const brandsData = await brandsRes.json();
                setProducts(Array.isArray(productsData) ? productsData : []);
                setBrands(Array.isArray(brandsData) ? brandsData : []);
            } catch (error) {
                console.error('Failed to fetch catalog data', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const filteredProducts = products.filter((p) => {
        const brandId =
            typeof p.brand === 'object' && p.brand !== null
                ? (p.brand as any)._id || (p.brand as Brand).id
                : p.brand;
        const matchesBrand = selectedBrand === 'all' || brandId === selectedBrand;
        const matchesSearch =
            p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.description.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesBrand && matchesSearch;
    });

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

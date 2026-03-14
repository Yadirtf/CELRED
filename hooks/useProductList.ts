'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Product } from '@/core/entities/Product';
import { Brand } from '@/core/entities/Brand';

function resolveBrandId(product: Product): string {
    const b = product.brand;
    if (typeof b === 'object' && b !== null) {
        const obj = b as { _id?: string; id?: string };
        return obj._id || obj.id || '';
    }
    return (b as string) || '';
}

export function useProductList() {
    const [products, setProducts] = useState<Product[]>([]);
    const [brands, setBrands] = useState<Brand[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedBrand, setSelectedBrand] = useState('all');
    const [selectedStock, setSelectedStock] = useState('all');

    const fetchProducts = useCallback(async () => {
        try {
            const res = await fetch('/api/products');
            if (!res.ok) throw new Error('Error al cargar productos');
            const data = await res.json();
            setProducts(Array.isArray(data) ? data : []);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error desconocido');
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchBrands = useCallback(async () => {
        try {
            const res = await fetch('/api/brands');
            if (!res.ok) throw new Error('Error al cargar marcas');
            const data = await res.json();
            setBrands(Array.isArray(data) ? data : []);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al cargar marcas');
        }
    }, []);

    useEffect(() => {
        fetchProducts();
        fetchBrands();
    }, [fetchProducts, fetchBrands]);

    const handleDelete = async (id: string) => {
        if (!confirm('¿Estás seguro de eliminar este producto?')) return;
        try {
            const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Error al eliminar');
            setProducts(prev => prev.filter(p => p.id !== id));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al eliminar producto');
        }
    };

    const handleSell = async (product: Product) => {
        const qtyStr = prompt(`¿Cuántas unidades de "${product.name}" se vendieron?`, '1');
        if (!qtyStr) return;

        const quantity = parseInt(qtyStr, 10);
        if (isNaN(quantity) || quantity <= 0) {
            setError('Por favor ingresa un número válido.');
            return;
        }
        if (product.stock < quantity) {
            setError(`No hay suficiente stock. Disponible: ${product.stock}`);
            return;
        }

        const newStock = product.stock - quantity;
        setProducts(prev => prev.map(p => p.id === product.id ? { ...p, stock: newStock } : p));

        try {
            const res = await fetch(`/api/products/${product.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ stock: newStock }),
            });
            if (!res.ok) throw new Error('Error al actualizar stock');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al registrar venta');
            await fetchProducts();
        }
    };

    const filteredProducts = useMemo(() => {
        const q = searchTerm.toLowerCase();
        return products.filter(product => {
            const matchesSearch =
                product.name.toLowerCase().includes(q) ||
                product.description.toLowerCase().includes(q);

            const brandId = resolveBrandId(product);
            const matchesBrand = selectedBrand === 'all' || brandId === selectedBrand;

            const matchesStock =
                selectedStock === 'all' ||
                (selectedStock === 'gt1' && product.stock > 1) ||
                (selectedStock === 'zero' && product.stock === 0);

            return matchesSearch && matchesBrand && matchesStock;
        });
    }, [products, searchTerm, selectedBrand, selectedStock]);

    return {
        products,
        brands,
        loading,
        error,
        filteredProducts,
        searchTerm,
        setSearchTerm,
        selectedBrand,
        setSelectedBrand,
        selectedStock,
        setSelectedStock,
        handleDelete,
        handleSell,
        fetchProducts,
    };
}

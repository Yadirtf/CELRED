'use client';

import { useState, useEffect } from 'react';
import { Product } from '@/core/entities/Product';
import { Brand } from '@/core/entities/Brand';

export function useProductList() {
    const [products, setProducts] = useState<Product[]>([]);
    const [brands, setBrands] = useState<Brand[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedBrand, setSelectedBrand] = useState('all');
    const [selectedStock, setSelectedStock] = useState('all');

    const fetchProducts = async () => {
        try {
            const res = await fetch('/api/products');
            const data = await res.json();
            setProducts(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Failed to fetch products', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchBrands = async () => {
        try {
            const res = await fetch('/api/brands');
            const data = await res.json();
            setBrands(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Failed to fetch brands', error);
        }
    };

    useEffect(() => {
        fetchProducts();
        fetchBrands();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm('¿Estás seguro de eliminar este producto?')) return;
        try {
            await fetch(`/api/products/${id}`, { method: 'DELETE' });
            setProducts((prev) => prev.filter((p) => p.id !== id));
        } catch (error) {
            console.error('Failed to delete product', error);
        }
    };

    const handleSell = async (product: Product) => {
        const qtyStr = prompt(`¿Cuántas unidades de "${product.name}" se vendieron?`, '1');
        if (!qtyStr) return;

        const quantity = parseInt(qtyStr);
        if (isNaN(quantity) || quantity <= 0) {
            alert('Por favor ingresa un número válido.');
            return;
        }
        if (product.stock < quantity) {
            alert(`No hay suficiente stock. Disponible: ${product.stock}`);
            return;
        }

        const newStock = product.stock - quantity;
        setProducts((prev) => prev.map((p) => (p.id === product.id ? { ...p, stock: newStock } : p)));

        try {
            const res = await fetch(`/api/products/${product.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ stock: newStock }),
            });
            if (!res.ok) throw new Error('Failed to update stock');
            fetchProducts();
        } catch (error) {
            console.error('Error registering sale', error);
            alert('Error al registrar la venta.');
            fetchProducts();
        }
    };

    const filteredProducts = products.filter((product) => {
        const matchesSearch =
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.description.toLowerCase().includes(searchTerm.toLowerCase());

        const brandId =
            typeof product.brand === 'object' && product.brand !== null
                ? (product.brand as any)._id || (product.brand as Brand).id
                : product.brand;
        const matchesBrand = selectedBrand === 'all' || brandId === selectedBrand;

        const matchesStock =
            selectedStock === 'all' ||
            (selectedStock === 'gt1' && product.stock > 1) ||
            (selectedStock === 'zero' && product.stock === 0);

        return matchesSearch && matchesBrand && matchesStock;
    });

    return {
        products,
        brands,
        loading,
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

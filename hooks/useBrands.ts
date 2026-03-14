'use client';

import { useState, useEffect, useCallback } from 'react';
import { Brand } from '@/core/entities/Brand';

export interface UseBrandsReturn {
    brands: Brand[];
    loading: boolean;
    error: string | null;
    newBrandName: string;
    setNewBrandName: (name: string) => void;
    editingBrandId: string | null;
    editingBrandName: string;
    setEditingBrandName: (name: string) => void;
    startEditing: (brand: Brand) => void;
    cancelEditing: () => void;
    handleCreate: (e: React.FormEvent) => Promise<void>;
    handleUpdate: (id: string) => Promise<void>;
    handleDelete: (id: string) => Promise<void>;
}

export function useBrands(): UseBrandsReturn {
    const [brands, setBrands] = useState<Brand[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [newBrandName, setNewBrandName] = useState('');
    const [editingBrandId, setEditingBrandId] = useState<string | null>(null);
    const [editingBrandName, setEditingBrandName] = useState('');

    const fetchBrands = useCallback(async () => {
        try {
            const res = await fetch('/api/brands');
            if (!res.ok) throw new Error('Error al cargar marcas');
            const data = await res.json();
            setBrands(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error desconocido');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchBrands(); }, [fetchBrands]);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        const name = newBrandName.trim();
        if (!name) return;
        setError(null);
        try {
            const res = await fetch('/api/brands', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name }),
            });
            if (!res.ok) throw new Error('Error al crear la marca');
            setNewBrandName('');
            await fetchBrands();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al crear marca');
        }
    };

    const handleUpdate = async (id: string) => {
        if (!editingBrandName.trim()) return;
        setError(null);
        try {
            const res = await fetch(`/api/brands/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: editingBrandName }),
            });
            if (!res.ok) throw new Error('Error al actualizar la marca');
            setEditingBrandId(null);
            await fetchBrands();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al actualizar marca');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('¿Estás seguro de que deseas eliminar esta marca?')) return;
        setError(null);
        try {
            const res = await fetch(`/api/brands/${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Error al eliminar la marca');
            await fetchBrands();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al eliminar marca');
        }
    };

    const startEditing = (brand: Brand) => {
        setEditingBrandId(brand.id!);
        setEditingBrandName(brand.name);
    };

    const cancelEditing = () => setEditingBrandId(null);

    return {
        brands,
        loading,
        error,
        newBrandName,
        setNewBrandName,
        editingBrandId,
        editingBrandName,
        setEditingBrandName,
        startEditing,
        cancelEditing,
        handleCreate,
        handleUpdate,
        handleDelete,
    };
}

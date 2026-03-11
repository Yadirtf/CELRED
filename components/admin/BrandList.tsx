'use client';

import { useState, useEffect } from 'react';
import { Brand } from '@/core/entities/Brand';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Pencil, Trash2, X, Check } from 'lucide-react';

export default function BrandList() {
    const [brands, setBrands] = useState<Brand[]>([]);
    const [newBrandName, setNewBrandName] = useState('');
    const [editingBrandId, setEditingBrandId] = useState<string | null>(null);
    const [editingBrandName, setEditingBrandName] = useState('');

    const fetchBrands = async () => {
        const res = await fetch('/api/brands');
        const data = await res.json();
        setBrands(data);
    };

    useEffect(() => {
        fetchBrands();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm('¿Estás seguro de que deseas eliminar esta marca?')) return;
        try {
            const res = await fetch(`/api/brands/${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Failed to delete brand');
            fetchBrands();
        } catch (error) {
            console.error('Error deleting brand:', error);
            alert('Error al eliminar la marca');
        }
    };

    const handleUpdate = async (id: string) => {
        if (!editingBrandName.trim()) return;
        try {
            const res = await fetch(`/api/brands/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: editingBrandName })
            });
            if (!res.ok) throw new Error('Failed to update brand');
            setEditingBrandId(null);
            fetchBrands();
        } catch (error) {
            console.error('Error updating brand:', error);
            alert('Error al actualizar la marca');
        }
    };

    const startEditing = (brand: Brand) => {
        setEditingBrandId(brand.id!);
        setEditingBrandName(brand.name);
    };

    const handleCreateWrapper = async (e: React.FormEvent) => {
        e.preventDefault();
        const name = newBrandName.trim();
        if (!name) return;

        try {
            console.log('CREATING BRAND:', name);
            const res = await fetch('/api/brands', {
                method: 'POST',
                body: JSON.stringify({ name }),
                headers: { 'Content-Type': 'application/json' }
            });

            if (!res.ok) {
                const errorData = await res.json();
                console.error('FAILED TO CREATE BRAND:', errorData);
                alert('Error al crear la marca');
                return;
            }

            console.log('BRAND CREATED SUCCESSFULLY');
            setNewBrandName('');
            fetchBrands();
        } catch (error) {
            console.error('NETWORK ERROR CREATING BRAND:', error);
            alert('Error de red al crear la marca');
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border">
            <h3 className="text-lg font-bold mb-4">Marcas</h3>
            <form onSubmit={handleCreateWrapper} className="flex gap-2 mb-4">
                <Input
                    placeholder="Nueva marca..."
                    value={newBrandName}
                    onChange={(e) => setNewBrandName(e.target.value)}
                />
                <Button type="submit" size="sm">Agregar</Button>
            </form>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {brands.map(brand => (
                    <div key={brand.id} className="relative group px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-center shadow-sm hover:border-blue-200 hover:bg-white transition-all">
                        {editingBrandId === brand.id ? (
                            <div className="flex flex-col gap-2">
                                <Input
                                    value={editingBrandName}
                                    onChange={(e) => setEditingBrandName(e.target.value)}
                                    className="h-8 text-sm"
                                    autoFocus
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') handleUpdate(brand.id!);
                                        if (e.key === 'Escape') setEditingBrandId(null);
                                    }}
                                />
                                <div className="flex justify-center gap-1">
                                    <button onClick={() => handleUpdate(brand.id!)} className="p-1 text-green-600 hover:bg-green-100 rounded"><Check size={16} /></button>
                                    <button onClick={() => setEditingBrandId(null)} className="p-1 text-gray-500 hover:bg-gray-200 rounded"><X size={16} /></button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <span className="text-sm font-bold text-gray-700 block truncate">
                                    {brand.name}
                                </span>
                                <div className="absolute top-1 right-1 hidden group-hover:flex gap-1 bg-white shadow-sm border border-gray-100 rounded-md p-1">
                                    <button onClick={() => startEditing(brand)} className="text-blue-500 hover:text-blue-700 p-0.5" title="Editar">
                                        <Pencil size={12} />
                                    </button>
                                    <button onClick={() => handleDelete(brand.id!)} className="text-red-500 hover:text-red-700 p-0.5" title="Eliminar">
                                        <Trash2 size={12} />
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                ))}
                {brands.length === 0 && <span className="text-sm text-gray-400 col-span-full text-center py-4">Sin marcas registradas</span>}
            </div>
        </div>
    );
}

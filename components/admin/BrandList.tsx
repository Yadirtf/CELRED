'use client';

import { useBrands } from '@/hooks/useBrands';
import { Brand } from '@/core/entities/Brand';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Pencil, Trash2, X, Check, Tag } from 'lucide-react';

export default function BrandList() {
    const {
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
    } = useBrands();

    if (loading) {
        return <div className="p-8 text-center text-gray-400 text-sm">Cargando marcas...</div>;
    }

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border space-y-5">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                    <Tag className="w-5 h-5" />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-gray-900">Marcas</h3>
                    <p className="text-xs text-gray-500">Administra las marcas disponibles para los productos</p>
                </div>
            </div>

            {/* Create */}
            <form onSubmit={handleCreate} className="flex gap-2">
                <Input
                    placeholder="Nueva marca..."
                    value={newBrandName}
                    onChange={e => setNewBrandName(e.target.value)}
                />
                <Button type="submit" size="sm">Agregar</Button>
            </form>

            {/* Error feedback */}
            {error && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-2">{error}</p>
            )}

            {/* List */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {brands.map((brand: Brand) => (
                    <div
                        key={brand.id}
                        className="relative group px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-center shadow-sm hover:border-purple-200 hover:bg-white transition-all"
                    >
                        {editingBrandId === brand.id ? (
                            <div className="flex flex-col gap-2">
                                <Input
                                    value={editingBrandName}
                                    onChange={e => setEditingBrandName(e.target.value)}
                                    className="h-8 text-sm"
                                    autoFocus
                                    onKeyDown={e => {
                                        if (e.key === 'Enter') handleUpdate(brand.id!);
                                        if (e.key === 'Escape') cancelEditing();
                                    }}
                                />
                                <div className="flex justify-center gap-1">
                                    <button
                                        onClick={() => handleUpdate(brand.id!)}
                                        className="p-1 text-green-600 hover:bg-green-100 rounded"
                                        title="Confirmar"
                                    >
                                        <Check size={16} />
                                    </button>
                                    <button
                                        onClick={cancelEditing}
                                        className="p-1 text-gray-500 hover:bg-gray-200 rounded"
                                        title="Cancelar"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <span className="text-sm font-bold text-gray-700 block truncate">{brand.name}</span>
                                <div className="absolute top-1 right-1 hidden group-hover:flex gap-1 bg-white shadow-sm border border-gray-100 rounded-md p-1">
                                    <button
                                        onClick={() => startEditing(brand)}
                                        className="text-blue-500 hover:text-blue-700 p-0.5"
                                        title="Editar"
                                    >
                                        <Pencil size={12} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(brand.id!)}
                                        className="text-red-500 hover:text-red-700 p-0.5"
                                        title="Eliminar"
                                    >
                                        <Trash2 size={12} />
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                ))}
                {brands.length === 0 && (
                    <span className="text-sm text-gray-400 col-span-full text-center py-4">
                        Sin marcas registradas. Crea la primera arriba.
                    </span>
                )}
            </div>
        </div>
    );
}

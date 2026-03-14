'use client';

import { Product } from '@/core/entities/Product';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Upload } from 'lucide-react';
import { useProductForm } from '@/hooks/useProductForm';

interface ProductFormProps {
    initialData?: Product;
    onSuccess: () => void;
    onCancel: () => void;
}

export default function ProductForm({ initialData, onSuccess, onCancel }: ProductFormProps) {
    const {
        formData,
        brands,
        uploading,
        submitting,
        error,
        updateField,
        updateSpec,
        handleImageUpload,
        handleSubmit,
    } = useProductForm(initialData, onSuccess);

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                    label="Nombre del Celular"
                    value={formData.name}
                    onChange={e => updateField('name', e.target.value)}
                    required
                />
                <Input
                    type="number"
                    label="Precio"
                    value={formData.price ?? ''}
                    onChange={e => updateField('price', e.target.value === '' ? 0 : Number(e.target.value))}
                    required
                />
                <Input
                    type="number"
                    label="Stock"
                    value={formData.stock ?? ''}
                    onChange={e => updateField('stock', e.target.value === '' ? 0 : Number(e.target.value))}
                    required
                    min={0}
                />
            </div>

            {/* Brand selector */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Marca</label>
                <select
                    className="w-full rounded-md border border-gray-300 p-2 text-sm"
                    value={formData.brand as string}
                    onChange={e => updateField('brand', e.target.value)}
                    required
                >
                    <option value="">Selecciona una marca</option>
                    {brands.map(b => (
                        <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                </select>
                {brands.length === 0 && (
                    <p className="text-xs text-orange-500 mt-1">No hay marcas registradas. Crea una primero.</p>
                )}
            </div>

            {/* Image upload */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Imagen</label>
                <div className="flex items-center gap-4">
                    {formData.imageUrl && (
                        <img src={formData.imageUrl} alt="Preview" className="w-16 h-16 object-cover rounded-md border" />
                    )}
                    <label className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors">
                        <Upload className="w-4 h-4" />
                        {uploading ? 'Subiendo...' : 'Subir Foto'}
                        <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={handleImageUpload}
                            disabled={uploading}
                        />
                    </label>
                </div>
            </div>

            {/* Description */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Descripción</label>
                <textarea
                    className="w-full rounded-md border border-gray-300 p-2 text-sm"
                    rows={3}
                    value={formData.description}
                    onChange={e => updateField('description', e.target.value)}
                />
            </div>

            {/* Specs */}
            <div className="grid grid-cols-2 gap-4 border-t pt-4">
                <h4 className="col-span-2 font-medium text-gray-900">Especificaciones Técnicas</h4>
                <Input label="Procesador" value={formData.specs?.processor} onChange={e => updateSpec('processor', e.target.value)} />
                <Input label="RAM" value={formData.specs?.ram} onChange={e => updateSpec('ram', e.target.value)} />
                <Input label="Almacenamiento" value={formData.specs?.storage} onChange={e => updateSpec('storage', e.target.value)} />
                <Input label="Pantalla" value={formData.specs?.screen} onChange={e => updateSpec('screen', e.target.value)} />
                <Input label="Batería" value={formData.specs?.battery} onChange={e => updateSpec('battery', e.target.value)} />
                <Input label="Cámara" value={formData.specs?.camera} onChange={e => updateSpec('camera', e.target.value)} />
            </div>

            {/* Error */}
            {error && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-2">{error}</p>
            )}

            <div className="flex justify-end gap-3 pt-4 border-t">
                <Button type="button" variant="ghost" onClick={onCancel}>Cancelar</Button>
                <Button type="submit" disabled={uploading || submitting}>
                    {submitting ? 'Guardando...' : initialData ? 'Actualizar' : 'Registrar'}
                </Button>
            </div>
        </form>
    );
}

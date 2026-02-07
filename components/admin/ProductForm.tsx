'use client';

import { useState, FormEvent, useEffect } from 'react';
import { Product } from '@/core/entities/Product';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Upload } from 'lucide-react';
import { Brand } from '@/core/entities/Brand';

interface ProductFormProps {
    initialData?: Product;
    onSuccess: () => void;
    onCancel: () => void;
}

export default function ProductForm({ initialData, onSuccess, onCancel }: ProductFormProps) {
    const [formData, setFormData] = useState<Partial<Product>>({
        name: '',
        description: '',
        imageUrl: '',
        brand: '',
        specs: {
            processor: '',
            ram: '',
            storage: '',
            screen: '',
            battery: '',
            camera: ''
        }
    });
    // ... (rest of code)


    const [brands, setBrands] = useState<Brand[]>([]);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (initialData) {
            // If brand is populated (object), use its ID, otherwise use the string
            const brandId = typeof initialData.brand === 'object' && initialData.brand !== null
                ? (initialData.brand as any)._id || (initialData.brand as Brand).id
                : initialData.brand;

            setFormData({ ...initialData, brand: brandId });
        }
        fetchBrands();
    }, [initialData]);

    const fetchBrands = async () => {
        try {
            const res = await fetch('/api/brands');
            const data = await res.json();
            setBrands(data);
        } catch (e) {
            console.error("Error fetching brands", e);
        }
    }

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });
            const data = await res.json();
            if (data.url) {
                setFormData(prev => ({ ...prev, imageUrl: data.url }));
            }
        } catch (error) {
            console.error('Upload failed', error);
            alert('Error al subir imagen');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        try {
            const url = initialData?.id ? `/api/products/${initialData.id}` : '/api/products';
            const method = initialData?.id ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!res.ok) throw new Error('Failed to save');

            onSuccess();
        } catch (error) {
            console.error(error);
            alert('Error al guardar el producto');
        }
    };

    // Helper for nested specs updates
    const updateSpec = (key: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            specs: { ...prev.specs, [key]: value }
        }));
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                    label="Nombre del Celular"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    required
                />
                <Input
                    type="number"
                    label="Precio"
                    value={formData.price ?? ''}
                    onChange={e => setFormData({ ...formData, price: e.target.value === '' ? undefined : Number(e.target.value) })}
                    required
                />
                <Input
                    type="number"
                    label="Stock"
                    value={formData.stock ?? ''}
                    onChange={e => setFormData({ ...formData, stock: e.target.value === '' ? undefined : Number(e.target.value) })}
                    required
                    min={0}
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Marca</label>
                <select
                    className="w-full rounded-md border border-gray-300 p-2 text-sm"
                    value={formData.brand as string}
                    onChange={e => setFormData({ ...formData, brand: e.target.value })}
                    required
                >
                    <option value="">Selecciona una marca</option>
                    {brands.map(b => (
                        <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                </select>
                {brands.length === 0 && <p className="text-xs text-orange-500 mt-1">No hay marcas registradas. Crea una primero.</p>}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Imagen</label>
                <div className="flex items-center gap-4">
                    {formData.imageUrl && (
                        <img src={formData.imageUrl} alt="Preview" className="w-16 h-16 object-cover rounded-md border" />
                    )}
                    <label className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors">
                        <Upload className="w-4 h-4" />
                        {uploading ? 'Subiendo...' : 'Subir Foto'}
                        <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                    </label>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Descripción</label>
                <textarea
                    className="w-full rounded-md border border-gray-300 p-2 text-sm"
                    rows={3}
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                />
            </div>

            <div className="grid grid-cols-2 gap-4 border-t pt-4">
                <h4 className="col-span-2 font-medium text-gray-900">Especificaciones Técnicas</h4>
                <Input label="Procesador" value={formData.specs?.processor} onChange={e => updateSpec('processor', e.target.value)} />
                <Input label="RAM" value={formData.specs?.ram} onChange={e => updateSpec('ram', e.target.value)} />
                <Input label="Almacenamiento" value={formData.specs?.storage} onChange={e => updateSpec('storage', e.target.value)} />
                <Input label="Pantalla" value={formData.specs?.screen} onChange={e => updateSpec('screen', e.target.value)} />
                <Input label="Batería" value={formData.specs?.battery} onChange={e => updateSpec('battery', e.target.value)} />
                <Input label="Cámara" value={formData.specs?.camera} onChange={e => updateSpec('camera', e.target.value)} />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
                <Button type="button" variant="ghost" onClick={onCancel}>Cancelar</Button>
                <Button type="submit" disabled={uploading}>
                    {initialData ? 'Actualizar' : 'Registrar'}
                </Button>
            </div>
        </form>
    );
}

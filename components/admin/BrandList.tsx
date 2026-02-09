'use client';

import { useState, useEffect } from 'react';
import { Brand } from '@/core/entities/Brand';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function BrandList() {
    const [brands, setBrands] = useState<Brand[]>([]);
    const [newBrandName, setNewBrandName] = useState('');

    const fetchBrands = async () => {
        const res = await fetch('/api/brands');
        const data = await res.json();
        setBrands(data);
    };

    useEffect(() => {
        fetchBrands();
    }, []);

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
            <div className="flex flex-wrap gap-2">
                {brands.map(brand => (
                    <span key={brand.id} className="px-3 py-1 bg-gray-100 rounded-full text-sm font-medium text-gray-700">
                        {brand.name}
                    </span>
                ))}
                {brands.length === 0 && <span className="text-sm text-gray-400">Sin marcas</span>}
            </div>
        </div>
    );
}

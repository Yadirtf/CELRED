'use client';

import { useState, useEffect } from 'react';
import { Product } from '@/core/entities/Product';
import { Brand } from '@/core/entities/Brand';
import { apiFetch } from '@/lib/apiFetch';

const DEFAULT_FORM: Partial<Product> = {
    name: '',
    description: '',
    imageUrl: '',
    brand: '',
    specs: { processor: '', ram: '', storage: '', screen: '', battery: '', camera: '' },
};

function resolveBrandId(brand: unknown): string {
    if (typeof brand === 'object' && brand !== null) {
        const obj = brand as { _id?: string; id?: string };
        return obj._id || obj.id || '';
    }
    return (brand as string) || '';
}

export interface UseProductFormReturn {
    formData: Partial<Product>;
    brands: Brand[];
    uploading: boolean;
    submitting: boolean;
    error: string | null;
    updateField: <K extends keyof Product>(key: K, value: Product[K]) => void;
    updateSpec: (key: string, value: string) => void;
    handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
    handleSubmit: (e: React.FormEvent) => Promise<void>;
}

export function useProductForm(
    initialData: Product | undefined,
    onSuccess: () => void
): UseProductFormReturn {
    const [formData, setFormData] = useState<Partial<Product>>({ ...DEFAULT_FORM });
    const [brands, setBrands] = useState<Brand[]>([]);
    const [uploading, setUploading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Populate form when editing
    useEffect(() => {
        if (initialData) {
            setFormData({ ...initialData, brand: resolveBrandId(initialData.brand) });
        } else {
            setFormData({ ...DEFAULT_FORM });
        }
    }, [initialData]);

    // Fetch brand list for the select
    useEffect(() => {
        apiFetch<Brand[]>('/api/brands')
            .then(data => setBrands(data))
            .catch(() => setBrands([]));
    }, []);

    const updateField = <K extends keyof Product>(key: K, value: Product[K]) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    const updateSpec = (key: string, value: string) => {
        setFormData(prev => ({ ...prev, specs: { ...prev.specs, [key]: value } }));
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        setError(null);
        const body = new FormData();
        body.append('file', file);
        try {
            const data = await apiFetch<{ url: string }>('/api/upload', {
                method: 'POST',
                body,
                // Browser will set Content-Type with boundary for FormData
            });
            if (data.url) setFormData(prev => ({ ...prev, imageUrl: data.url }));
        } catch {
            setError('Error al subir la imagen. Intenta de nuevo.');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSubmitting(true);
        try {
            const url = initialData?.id ? `/api/products/${initialData.id}` : '/api/products';
            const method = initialData?.id ? 'PUT' : 'POST';
            await apiFetch(url, {
                method,
                body: JSON.stringify(formData),
            });
            onSuccess();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error desconocido');
        } finally {
            setSubmitting(false);
        }
    };

    return { formData, brands, uploading, submitting, error, updateField, updateSpec, handleImageUpload, handleSubmit };
}

'use client';

import { useState, useEffect } from 'react';
import { Advisor } from '@/core/entities/Settings';

export function useSettings() {
    const [advisors, setAdvisors] = useState<Advisor[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState<number | null>(null);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await fetch('/api/settings');
            const data = await res.json();
            if (data.advisors) setAdvisors(data.advisors);
        } catch (error) {
            console.error('Error fetching settings', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddAdvisor = (newNumber: string, newName: string) => {
        const cleanNumber = newNumber.replace(/\D/g, '');
        if (cleanNumber && !advisors.some((a) => a.number === cleanNumber)) {
            setAdvisors((prev) => [...prev, { number: cleanNumber, name: newName, imageUrl: '' }]);
            return true;
        }
        return false;
    };

    const handleRemoveAdvisor = (index: number) => {
        setAdvisors((prev) => prev.filter((_, i) => i !== index));
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(index);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch('/api/upload', { method: 'POST', body: formData });
            const data = await res.json();
            if (data.url) {
                setAdvisors((prev) => {
                    const updated = [...prev];
                    updated[index] = { ...updated[index], imageUrl: data.url };
                    return updated;
                });
            }
        } catch (error) {
            console.error('Upload failed', error);
        } finally {
            setUploading(null);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch('/api/settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ advisors }),
            });
            if (res.ok) {
                setMessage({ type: 'success', text: 'Configuración guardada correctamente' });
                setTimeout(() => setMessage({ type: '', text: '' }), 3000);
            }
        } catch {
            setMessage({ type: 'error', text: 'Error al guardar la configuración' });
        } finally {
            setSaving(false);
        }
    };

    return {
        advisors,
        loading,
        saving,
        uploading,
        message,
        handleAddAdvisor,
        handleRemoveAdvisor,
        handleImageUpload,
        handleSave,
    };
}

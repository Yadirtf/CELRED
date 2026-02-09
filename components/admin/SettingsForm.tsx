'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Plus, Trash2, Save, Check, MessageSquare, Share2, Copy, Upload, User } from 'lucide-react';
import { Advisor } from '@/core/entities/Settings';

export default function SettingsForm() {
    const [advisors, setAdvisors] = useState<Advisor[]>([]);
    const [newNumber, setNewNumber] = useState('');
    const [newName, setNewName] = useState('');
    const [uploading, setUploading] = useState<number | null>(null); // Index of advisor being updated or -1 for new
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await fetch('/api/settings');
            const data = await res.json();
            if (data.advisors) {
                setAdvisors(data.advisors);
            }
        } catch (error) {
            console.error('Error fetching settings', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddAdvisor = () => {
        const cleanNumber = newNumber.replace(/\D/g, '');
        if (cleanNumber && !advisors.some(a => a.number === cleanNumber)) {
            setAdvisors([...advisors, { number: cleanNumber, name: newName, imageUrl: '' }]);
            setNewNumber('');
            setNewName('');
        }
    };

    const handleRemoveAdvisor = (index: number) => {
        setAdvisors(advisors.filter((_, i) => i !== index));
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(index);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });
            const data = await res.json();
            if (data.url) {
                const updatedAdvisors = [...advisors];
                updatedAdvisors[index].imageUrl = data.url;
                setAdvisors(updatedAdvisors);
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
        } catch (error) {
            setMessage({ type: 'error', text: 'Error al guardar la configuración' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-8 text-center">Cargando configuración...</div>;

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mt-8">
            <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                        <MessageSquare className="w-5 h-5" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">Configuración de WhatsApp</h2>
                        <p className="text-xs text-gray-500">Administra los números de los asesores para el reparto de mensajes</p>
                    </div>
                </div>
                <Button
                    onClick={handleSave}
                    disabled={saving}
                    className="gap-2 px-6"
                >
                    {saving ? 'Guardando...' : message.type === 'success' ? <><Check className="w-4 h-4" /> Guardado</> : <><Save className="w-4 h-4" /> Guardar Cambios</>}
                </Button>
            </div>

            <div className="p-6 space-y-6">
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Añadir Nuevo Asesor</label>
                    <div className="flex flex-col md:flex-row gap-2">
                        <Input
                            placeholder="Nombre (Opcional)"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            className="md:w-1/3"
                        />
                        <Input
                            placeholder="Ej: 573166541275"
                            value={newNumber}
                            onChange={(e) => setNewNumber(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleAddAdvisor()}
                            className="flex-1"
                        />
                        <Button variant="secondary" onClick={handleAddAdvisor} className="gap-2 shrink-0">
                            <Plus className="w-4 h-4" /> Añadir
                        </Button>
                    </div>
                </div>

                <div className="space-y-3">
                    <label className="block text-sm font-semibold text-gray-700">Asesores Registrados</label>
                    {advisors.length === 0 ? (
                        <div className="text-center py-8 border-2 border-dashed border-gray-100 rounded-xl text-gray-400 text-sm">
                            No hay asesores registrados. Agrega uno arriba.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {advisors.map((advisor, index) => (
                                <div key={index} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 group hover:border-blue-200 transition-all flex flex-col gap-4">
                                    <div className="flex justify-between items-start">
                                        <div className="flex gap-4 items-center">
                                            <div className="relative group/photo">
                                                <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden border-2 border-white shadow-sm flex items-center justify-center">
                                                    {advisor.imageUrl ? (
                                                        <img src={advisor.imageUrl} alt="Advisor" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <User className="w-8 h-8 text-gray-400" />
                                                    )}
                                                </div>
                                                <label className="absolute inset-0 bg-black/40 text-white flex items-center justify-center opacity-0 group-hover/photo:opacity-100 rounded-full cursor-pointer transition-opacity">
                                                    <Upload className="w-4 h-4" />
                                                    <input
                                                        type="file"
                                                        className="hidden"
                                                        accept="image/*"
                                                        onChange={(e) => handleImageUpload(e, index)}
                                                    />
                                                </label>
                                                {uploading === index && (
                                                    <div className="absolute inset-0 bg-white/60 flex items-center justify-center rounded-full">
                                                        <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent animate-spin rounded-full"></div>
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900">{advisor.name || 'Sin Nombre'}</p>
                                                <p className="font-mono text-xs text-gray-500">{advisor.number}</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleRemoveAdvisor(index)}
                                            className="text-gray-400 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-lg"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {message.text && (
                    <div className={`p-3 rounded-lg text-sm text-center ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                        {message.text}
                    </div>
                )}

                <div className="pt-6 border-t border-gray-100">
                    <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Share2 className="w-4 h-4 text-green-600" />
                        Herramienta de Compartición Global
                    </h3>
                    <div className="bg-green-50/50 rounded-xl p-4 border border-green-100/50">
                        <p className="text-sm text-green-800 mb-4">
                            Genera un link para compartir el catálogo completo con un asesor específico.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-green-700 uppercase">Seleccionar Asesor</label>
                                <select
                                    className="w-full bg-white border border-green-200 rounded-lg px-3 py-2 text-sm"
                                    onChange={(e) => {
                                        const url = `${window.location.origin}/?wa=${e.target.value}`;
                                        (document.getElementById('global-link') as HTMLInputElement).value = url;
                                    }}
                                >
                                    <option value="">Selecciona un asesor...</option>
                                    {advisors.map((n, i) => (
                                        <option key={i} value={n.number}>{n.name ? `${n.name} (${n.number})` : n.number}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-green-700 uppercase">Link del Catálogo</label>
                                <div className="flex gap-2">
                                    <input
                                        id="global-link"
                                        readOnly
                                        className="flex-1 bg-white border border-green-200 rounded-lg px-3 py-2 text-xs font-mono"
                                        placeholder="Selecciona un número primero"
                                    />
                                    <Button size="sm" onClick={() => {
                                        const val = (document.getElementById('global-link') as HTMLInputElement).value;
                                        if (val) navigator.clipboard.writeText(val);
                                    }}>
                                        <Copy className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

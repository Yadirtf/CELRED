'use client';

import { useState, useEffect } from 'react';
import { MessageSquare, Save, Info } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const VARIABLES = [
    { tag: '{nombre_referido}', desc: 'Nombre del contacto referido' },
    { tag: '{nombre_comprador}', desc: 'Nombre del cliente que compró' },
    { tag: '{celular_comprador}', desc: 'WhatsApp del cliente (opcional)' },
];

export default function MessageTemplateForm() {
    const [message, setMessage] = useState('');
    const [saving, setSaving] = useState(false);
    const [status, setStatus] = useState<'idle' | 'saved' | 'error'>('idle');

    useEffect(() => {
        fetch('/api/settings')
            .then(r => r.json())
            .then(data => {
                if (data.referralMessage) setMessage(data.referralMessage);
            });
    }, []);

    const handleSave = async () => {
        setSaving(true);
        setStatus('idle');
        try {
            const res = await fetch('/api/settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ referralMessage: message }),
            });
            setStatus(res.ok ? 'saved' : 'error');
            setTimeout(() => setStatus('idle'), 3000);
        } catch {
            setStatus('error');
        } finally {
            setSaving(false);
        }
    };

    const insertTag = (tag: string) => {
        setMessage(prev => prev + tag);
    };

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-50 bg-gray-50/50 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                        <MessageSquare className="w-5 h-5" />
                    </div>
                    <div>
                        <h2 className="text-base font-bold text-gray-900">Mensaje Maestro de WhatsApp</h2>
                        <p className="text-xs text-gray-500">Template para el mensaje que se enviará a los referidos</p>
                    </div>
                </div>
                <Button onClick={handleSave} disabled={saving} className="gap-2 shrink-0">
                    <Save className="w-4 h-4" />
                    {saving ? 'Guardando...' : status === 'saved' ? '✅ Guardado' : 'Guardar'}
                </Button>
            </div>

            <div className="p-5 space-y-4">
                {/* Variables reference */}
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-3 text-blue-700">
                        <Info className="w-4 h-4 shrink-0" />
                        <span className="text-xs font-bold uppercase tracking-wide">Variables disponibles</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {VARIABLES.map(v => (
                            <button
                                key={v.tag}
                                type="button"
                                title={v.desc}
                                onClick={() => insertTag(v.tag)}
                                className="inline-flex items-center gap-1.5 text-xs bg-white border border-blue-200 text-blue-700 font-mono px-2.5 py-1 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer"
                            >
                                {v.tag}
                            </button>
                        ))}
                    </div>
                    <p className="text-xs text-blue-500 mt-2">Haz clic en una variable para insertarla, o escríbela directamente.</p>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Mensaje</label>
                    <textarea
                        value={message}
                        onChange={e => setMessage(e.target.value)}
                        rows={5}
                        placeholder="¡Hola {nombre_referido}! 👋 Tu amigo {nombre_comprador} nos pasó tu contacto..."
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 resize-none leading-relaxed"
                    />
                </div>

                {/* Preview */}
                {message && (
                    <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
                        <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Vista previa (ejemplo)</p>
                        <p className="text-sm text-gray-700 whitespace-pre-wrap">
                            {message
                                .replace(/\{nombre_referido\}/g, 'Carlos Ruiz')
                                .replace(/\{nombre_comprador\}/g, 'Juan Pérez')
                                .replace(/\{celular_comprador\}/g, '310-555-0000')}
                        </p>
                    </div>
                )}

                {status === 'error' && (
                    <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-2">
                        Error al guardar el mensaje. Intenta de nuevo.
                    </p>
                )}
            </div>
        </div>
    );
}

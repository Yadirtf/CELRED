'use client';

import { useState, useEffect } from 'react';
import { QuickNote } from '@/core/entities/QuickNote';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { X, Save } from 'lucide-react';

interface QuickNoteFormProps {
    note?: QuickNote | null;
    onSubmit: (note: Omit<QuickNote, 'id'> | Partial<QuickNote>) => Promise<void>;
    onCancel: () => void;
}

export default function QuickNoteForm({ note, onSubmit, onCancel }: QuickNoteFormProps) {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (note) {
            setTitle(note.title);
            setContent(note.content);
        } else {
            setTitle('');
            setContent('');
        }
    }, [note]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !content) return;

        setLoading(true);
        try {
            await onSubmit({ title, content });
            onCancel();
        } catch (error) {
            console.error('Failed to submit note', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-900">
                        {note ? 'Editar Nota Rápida' : 'Nueva Nota Rápida'}
                    </h2>
                    <button onClick={onCancel} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <Input
                        label="Título / Atajo"
                        placeholder="Ej: Saludo inicial, Precios, Despedida..."
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />

                    <div className="space-y-1.5">
                        <label className="block text-sm font-medium text-gray-700">Contenido del Mensaje</label>
                        <textarea
                            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[150px] resize-none transition-all"
                            placeholder="Escribe el mensaje que copiarás..."
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            required
                        />
                    </div>

                    <div className="flex gap-3 pt-2">
                        <Button type="button" variant="ghost" onClick={onCancel} className="flex-1">
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={loading} className="flex-1 gap-2 bg-blue-600 hover:bg-blue-700">
                            <Save className="w-4 h-4" />
                            {loading ? 'Guardando...' : 'Guardar Nota'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

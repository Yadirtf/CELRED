'use client';

import { useState } from 'react';
import { QuickNote } from '@/core/entities/QuickNote';
import { Copy, Edit2, Trash2, Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface QuickNoteCardProps {
    note: QuickNote;
    onEdit: (note: QuickNote) => void;
    onDelete: (id: string) => void;
    onCopy: (content: string) => Promise<boolean>;
}

export default function QuickNoteCard({ note, onEdit, onDelete, onCopy }: QuickNoteCardProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        const success = await onCopy(note.content);
        if (success) {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all p-4 flex flex-col gap-3 group">
            <div className="flex justify-between items-start gap-2">
                <h3 className="font-bold text-gray-900 line-clamp-1">{note.title}</h3>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                        onClick={() => onEdit(note)}
                        className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Editar"
                    >
                        <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                        onClick={() => onDelete(note.id!)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Eliminar"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </div>
            
            <p className="text-sm text-gray-600 line-clamp-3 bg-gray-50 p-3 rounded-lg border border-gray-100/50 whitespace-pre-wrap">
                {note.content}
            </p>

            <Button 
                onClick={handleCopy} 
                variant={copied ? 'ghost' : 'primary'}
                className={`mt-auto w-full gap-2 ${copied ? 'bg-green-50 text-green-600' : 'bg-green-600 hover:bg-green-700'}`}
            >
                {copied ? (
                    <>
                        <Check className="w-4 h-4" />
                        Copiado
                    </>
                ) : (
                    <>
                        <Copy className="w-4 h-4" />
                        Copiar Mensaje
                    </>
                )}
            </Button>
        </div>
    );
}

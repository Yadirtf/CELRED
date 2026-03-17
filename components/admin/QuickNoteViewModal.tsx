'use client';

import { QuickNote } from '@/core/entities/QuickNote';
import { X, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useState } from 'react';

interface QuickNoteViewModalProps {
    note: QuickNote;
    onClose: () => void;
    onCopy: (content: string) => Promise<boolean>;
}

export default function QuickNoteViewModal({ note, onClose, onCopy }: QuickNoteViewModalProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        const success = await onCopy(note.content);
        if (success) {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[60] flex items-center justify-center p-4 animate-in fade-in duration-300">
            <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                    <div>
                        <h2 className="text-xl font-black text-gray-900 leading-none mb-1">{note.title}</h2>
                        <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Vista Completa del Mensaje</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                        <X className="w-6 h-6 text-gray-500" />
                    </button>
                </div>

                <div className="p-8">
                    <div className="bg-gray-50 rounded-2xl border border-gray-100 p-6 min-h-[200px] max-h-[60vh] overflow-y-auto scrollbar-thin">
                        <p className="text-gray-800 text-lg leading-relaxed whitespace-pre-wrap font-medium">
                            {note.content}
                        </p>
                    </div>
                </div>

                <div className="p-6 bg-gray-50 border-t border-gray-50 flex gap-4">
                    <Button 
                        onClick={onClose} 
                        variant="ghost" 
                        className="flex-1 font-bold py-6 rounded-xl hover:bg-white border border-transparent hover:border-gray-200"
                    >
                        Cerrar
                    </Button>
                    <Button 
                        onClick={handleCopy} 
                        variant={copied ? 'ghost' : 'primary'}
                        className={`flex-1 gap-3 py-6 rounded-xl font-bold text-lg shadow-lg transition-all transform active:scale-95 ${copied ? 'bg-green-50 text-green-600 border-green-200' : 'bg-green-600 hover:bg-green-700 shadow-green-100'}`}
                    >
                        {copied ? (
                            <>
                                <Check className="w-6 h-6" />
                                ¡Copiado!
                            </>
                        ) : (
                            <>
                                <Copy className="w-6 h-6" />
                                Copiar Mensaje
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
}

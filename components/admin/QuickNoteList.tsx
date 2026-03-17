'use client';

import { useState } from 'react';
import { useQuickNotes } from '@/hooks/useQuickNotes';
import QuickNoteCard from './QuickNoteCard';
import QuickNoteForm from './QuickNoteForm';
import { Plus, Search, MessageSquareCode } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { QuickNote } from '@/core/entities/QuickNote';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import EmptyState from '@/components/ui/EmptyState';
import QuickNoteViewModal from './QuickNoteViewModal';

export default function QuickNoteList() {
    const { 
        filteredNotes, 
        loading, 
        error, 
        searchTerm, 
        setSearchTerm, 
        addNote, 
        updateNote, 
        deleteNote, 
        copyToClipboard 
    } = useQuickNotes();

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingNote, setEditingNote] = useState<QuickNote | null>(null);
    const [viewingNote, setViewingNote] = useState<QuickNote | null>(null);

    const handleOpenCreate = () => {
        setEditingNote(null);
        setIsFormOpen(true);
    };

    const handleOpenEdit = (note: QuickNote) => {
        setEditingNote(note);
        setIsFormOpen(true);
    };

    const handleFormSubmit = async (noteData: any) => {
        if (editingNote) {
            await updateNote(editingNote.id!, noteData);
        } else {
            await addNote(noteData);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                        placeholder="Buscar por título o contenido..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <Button onClick={handleOpenCreate} className="w-full md:w-auto gap-2 bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4" />
                    Nueva Nota Rápida
                </Button>
            </div>

            {loading ? (
                <div className="flex justify-center py-12">
                    <LoadingSpinner className="h-8 w-8" />
                </div>
            ) : error ? (
                <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 text-center">
                    {error}
                </div>
            ) : filteredNotes.length === 0 ? (
                <EmptyState 
                    message={searchTerm ? "No se encontraron resultados" : "No hay mensajes rápidos"}
                    hint={searchTerm ? "Intenta con otros términos de búsqueda" : "Crea tu primer mensaje rápido para agilizar tus respuestas de WhatsApp."}
                    icon={<MessageSquareCode className="w-12 h-12 text-gray-300 mb-4" />}
                />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredNotes.map((note) => (
                        <QuickNoteCard
                            key={note.id}
                            note={note}
                            onEdit={handleOpenEdit}
                            onDelete={deleteNote}
                            onCopy={copyToClipboard}
                            onView={setViewingNote}
                        />
                    ))}
                </div>
            )}

            {viewingNote && (
                <QuickNoteViewModal
                    note={viewingNote}
                    onClose={() => setViewingNote(null)}
                    onCopy={copyToClipboard}
                />
            )}

            {isFormOpen && (
                <QuickNoteForm
                    note={editingNote}
                    onSubmit={handleFormSubmit}
                    onCancel={() => setIsFormOpen(false)}
                />
            )}
        </div>
    );
}

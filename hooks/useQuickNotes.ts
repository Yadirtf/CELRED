'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { QuickNote } from '@/core/entities/QuickNote';
import { apiFetch } from '@/lib/apiFetch';

export function useQuickNotes() {
    const [notes, setNotes] = useState<QuickNote[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchNotes = useCallback(async () => {
        setLoading(true);
        try {
            const data = await apiFetch<QuickNote[]>('/api/quick-notes');
            setNotes(data);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al cargar notas');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchNotes();
    }, [fetchNotes]);

    const addNote = async (note: Omit<QuickNote, 'id'>) => {
        try {
            const newNote = await apiFetch<QuickNote>('/api/quick-notes', {
                method: 'POST',
                body: JSON.stringify(note),
            });
            setNotes(prev => [newNote, ...prev]);
            return newNote;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al crear nota');
            throw err;
        }
    };

    const updateNote = async (id: string, noteData: Partial<QuickNote>) => {
        try {
            const updatedNote = await apiFetch<QuickNote>(`/api/quick-notes/${id}`, {
                method: 'PUT',
                body: JSON.stringify(noteData),
            });
            setNotes(prev => prev.map(n => n.id === id ? updatedNote : n));
            return updatedNote;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al actualizar nota');
            throw err;
        }
    };

    const deleteNote = async (id: string) => {
        if (!confirm('¿Estás seguro de eliminar esta nota?')) return;
        try {
            await apiFetch(`/api/quick-notes/${id}`, { method: 'DELETE' });
            setNotes(prev => prev.filter(n => n.id !== id));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al eliminar nota');
            throw err;
        }
    };

    const copyToClipboard = async (content: string) => {
        try {
            await navigator.clipboard.writeText(content);
            return true;
        } catch (err) {
            console.error('Failed to copy: ', err);
            return false;
        }
    };

    const filteredNotes = useMemo(() => {
        const q = searchTerm.toLowerCase();
        return notes.filter(note => 
            note.title.toLowerCase().includes(q) || 
            note.content.toLowerCase().includes(q)
        );
    }, [notes, searchTerm]);

    return {
        notes,
        loading,
        error,
        searchTerm,
        setSearchTerm,
        filteredNotes,
        addNote,
        updateNote,
        deleteNote,
        copyToClipboard,
        refresh: fetchNotes
    };
}

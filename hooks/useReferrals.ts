'use client';

import { useState, useEffect, useCallback } from 'react';

export interface ReferralFormEntry {
    nombre: string;
    whatsapp: string;
    parentescoId: string;      // ObjectId referencing the Parentesco collection
    parentescoNombre?: string; // Denormalized label for convenience
}

/** Shape returned by the API after populate('referencias.parentesco') */
export interface PopulatedReferralEntry {
    _id: string;
    nombre: string;
    whatsapp: string;
    parentesco: { _id: string; nombre: string };
    estado: 'Pendiente' | 'Contactado';
}

export interface ReferenceRecord {
    _id: string;
    nombreComprador: string;
    whatsappComprador: string;
    referencias: PopulatedReferralEntry[];
    createdAt: string;
    updatedAt: string;
}

export function useReferrals() {
    const [records, setRecords] = useState<ReferenceRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchRecords = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/references');
            if (!res.ok) throw new Error('Error al cargar referencias');
            const data = await res.json();
            setRecords(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error desconocido');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchRecords();
    }, [fetchRecords]);

    const addReferrals = async (
        nombreComprador: string,
        whatsappComprador: string,
        referencias: ReferralFormEntry[]
    ) => {
        setSaving(true);
        setError(null);
        try {
            const res = await fetch('/api/references', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nombreComprador, whatsappComprador, referencias }),
            });
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Error al guardar');
            }
            await fetchRecords();
            return true;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error desconocido');
            return false;
        } finally {
            setSaving(false);
        }
    };

    const markAsContacted = async (recordId: string, referralId: string) => {
        // Optimistic update
        setRecords(prev =>
            prev.map(record => {
                if (record._id !== recordId) return record;
                return {
                    ...record,
                    referencias: record.referencias.map(r =>
                        r._id === referralId ? { ...r, estado: 'Contactado' } : r
                    ),
                };
            })
        );

        try {
            const res = await fetch(`/api/references/${recordId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ referralId, estado: 'Contactado' }),
            });
            if (!res.ok) throw new Error('Error al actualizar estado');
        } catch {
            // Revert on failure
            await fetchRecords();
        }
    };

    const deleteRecord = async (recordId: string) => {
        try {
            await fetch(`/api/references/${recordId}`, { method: 'DELETE' });
            setRecords(prev => prev.filter(r => r._id !== recordId));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al eliminar');
        }
    };

    return {
        records,
        loading,
        saving,
        error,
        addReferrals,
        markAsContacted,
        deleteRecord,
        refetch: fetchRecords,
    };
}

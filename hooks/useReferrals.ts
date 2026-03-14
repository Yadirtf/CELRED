import { useState, useEffect, useCallback } from 'react';
import { apiFetch } from '@/lib/apiFetch';

export interface PopulatedReferralEntry {
    _id: string;
    nombre: string;
    whatsapp: string;
    parentesco: {
        _id: string;
        nombre: string;
    };
    estado: 'Pendiente' | 'Contactado';
}

export interface ReferralFormEntry {
    nombre: string;
    parentescoId: string;
    parentescoNombre?: string;
    whatsapp: string;
}

export interface ReferenceRecord {
    _id: string;
    nombreComprador: string;
    whatsappComprador: string;
    advisorId: string;
    referencias: PopulatedReferralEntry[];
    createdAt: string;
    updatedAt: string;
}

export function useReferrals() {
    const [records, setRecords] = useState<ReferenceRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [referralMessage, setReferralMessage] = useState('');

    const fetchRecords = useCallback(async (advisorIdFilter?: string) => {
        setLoading(true);
        try {
            const url = advisorIdFilter 
                ? `/api/references?advisorId=${advisorIdFilter}` 
                : '/api/references';
            const data = await apiFetch<ReferenceRecord[]>(url);
            setRecords(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error desconocido');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchRecords();
        // Load referral message template from settings
        apiFetch<{ referralMessage?: string }>('/api/settings')
            .then(data => { if (data.referralMessage) setReferralMessage(data.referralMessage); })
            .catch(() => {});
    }, [fetchRecords]);

    const addReferrals = async (
        nombreComprador: string,
        whatsappComprador: string,
        advisorId: string,
        referencias: ReferralFormEntry[]
    ) => {
        setSaving(true);
        setError(null);
        try {
            await apiFetch('/api/references', {
                method: 'POST',
                body: JSON.stringify({ nombreComprador, whatsappComprador, advisorId, referencias }),
            });
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
            await apiFetch(`/api/references/${recordId}`, {
                method: 'PATCH',
                body: JSON.stringify({ referralId, estado: 'Contactado' }),
            });
        } catch {
            // Revert on failure
            await fetchRecords();
        }
    };

    const deleteRecord = async (recordId: string) => {
        try {
            await apiFetch(`/api/references/${recordId}`, { method: 'DELETE' });
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
        referralMessage,
        setReferralMessage,
        addReferrals,
        markAsContacted,
        deleteRecord,
        refetch: fetchRecords,
    };
}

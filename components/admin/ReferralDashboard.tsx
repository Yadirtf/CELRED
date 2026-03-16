'use client';

import { useState, useMemo, useEffect } from 'react';
import { MessageCircle, Trash2, RefreshCw, Users, ClipboardList, Search, X } from 'lucide-react';
import { useReferrals, type ReferenceRecord, type PopulatedReferralEntry } from '@/hooks/useReferrals';

function buildWhatsAppUrl(phone: string, message: string): string {
    let cleaned = phone.replace(/\D/g, '');
    // If it's a 10-digit number (Colombia standard), prepend 57
    if (cleaned.length === 10) {
        cleaned = `57${cleaned}`;
    }
    const encoded = encodeURIComponent(message);
    return `https://wa.me/${cleaned}?text=${encoded}`;
}

function processMessage(
    template: string,
    nombreReferido: string,
    nombreComprador: string,
    celularComprador: string
): string {
    return (template || '')
        .replace(/\{nombre_referido\}/g, nombreReferido || '')
        .replace(/\{nombre_comprador\}/g, nombreComprador || '')
        .replace(/\{celular_comprador\}/g, celularComprador || '');
}

interface Props {
    referralMessage: string;
}

export default function ReferralDashboard({ referralMessage }: Props) {
    const { records, loading, error, markAsContacted, deleteRecord, refetch } = useReferrals();
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [search, setSearch] = useState('');
    const [selectedAdvisorId, setSelectedAdvisorId] = useState('all');
    const [advisors, setAdvisors] = useState<{ number: string; name?: string }[]>([]);

    useEffect(() => {
        fetch('/api/settings')
            .then(r => r.json())
            .then(data => {
                if (data.advisors) setAdvisors(data.advisors);
            });
    }, []);

    // Filter records: advisorId filter + search term
    const filteredRecords = useMemo(() => {
        const q = search.trim().toLowerCase();
        let base = records;

        if (selectedAdvisorId !== 'all') {
            base = base.filter(r => r.advisorId === selectedAdvisorId);
        }

        if (!q) return base;
        
        return base
            .map(record => {
                const buyerMatch =
                    record.nombreComprador.toLowerCase().includes(q) ||
                    record.whatsappComprador.toLowerCase().includes(q);

                const matchingRefs = record.referencias.filter(
                    ref =>
                        ref.nombre.toLowerCase().includes(q) ||
                        ref.whatsapp.toLowerCase().includes(q)
                );

                if (buyerMatch) return record;           // Show full group
                if (matchingRefs.length > 0) return { ...record, referencias: matchingRefs };
                return null;
            })
            .filter(Boolean) as typeof records;
    }, [records, search, selectedAdvisorId]);

    const totalRefs = filteredRecords.reduce((acc, r) => acc + r.referencias.length, 0);
    const isFiltered = search.trim().length > 0 || selectedAdvisorId !== 'all';

    const handleWhatsApp = async (record: ReferenceRecord, ref: PopulatedReferralEntry) => {
        const msg = processMessage(referralMessage, ref.nombre, record.nombreComprador, record.whatsappComprador);
        const url = buildWhatsAppUrl(ref.whatsapp, msg);
        window.open(url, '_blank', 'noopener,noreferrer');
        await markAsContacted(record._id, ref._id);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('¿Eliminar este registro y todas sus referencias?')) return;
        setDeletingId(id);
        await deleteRecord(id);
        setDeletingId(null);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-16 gap-3 text-gray-400">
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>Cargando referencias...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-12 text-red-500 bg-red-50 rounded-xl border border-red-100">
                {error}
            </div>
        );
    }

    if (records.length === 0) {
        return (
            <div className="text-center py-16 border-2 border-dashed border-gray-100 rounded-2xl text-gray-400">
                <Users className="w-10 h-10 mx-auto mb-3 opacity-40" />
                <p className="font-medium">No hay referencias registradas</p>
                <p className="text-sm mt-1">Usa el formulario de arriba para agregar los primeros referidos.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Filters bar */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    <input
                        type="text"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Buscar por nombre o celular..."
                        className="w-full pl-9 pr-9 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-300 bg-white"
                    />
                    {search && (
                        <button
                            onClick={() => setSearch('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </div>
                
                <div className="w-full sm:w-64">
                    <select
                        value={selectedAdvisorId}
                        onChange={e => setSelectedAdvisorId(e.target.value)}
                        className={`w-full py-2.5 px-4 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-300 appearance-none bg-white transition-all ${selectedAdvisorId !== 'all' ? 'border-red-200 bg-red-50' : 'border-gray-200'}`}
                    >
                        <option value="all">📁 Todas las asesoras</option>
                        {advisors.map(adv => (
                            <option key={adv.number} value={adv.number}>
                                👩‍💼 {adv.name || adv.number}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Header stats */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                    <ClipboardList className="w-4 h-4" />
                    <span>
                        <strong className="text-gray-700">{filteredRecords.length}</strong> compradores
                        {' · '}
                        <strong className="text-gray-700">{totalRefs}</strong> referencias
                        {isFiltered && (
                            <span className="ml-2 text-xs text-red-500 font-medium">
                                (filtrado)
                            </span>
                        )}
                    </span>
                </div>
                <button
                    onClick={() => refetch()}
                    className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <RefreshCw className="w-3 h-3" />
                    Actualizar
                </button>
            </div>

            {/* Table or no results */}
            {filteredRecords.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-gray-100 rounded-2xl text-gray-400">
                    <Search className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    <p className="font-medium">Sin resultados para &ldquo;{search}&rdquo;</p>
                    <p className="text-xs mt-1">Intenta con otro nombre o número.</p>
                </div>
            ) : (
            <div className="overflow-x-auto rounded-2xl border border-gray-100 shadow-sm">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-100">
                            <th className="text-left px-4 py-3 font-semibold text-gray-600 min-w-[160px]">Comprador (Origen)</th>
                            <th className="text-left px-4 py-3 font-semibold text-gray-600 min-w-[140px]">Referencia</th>
                            <th className="text-left px-4 py-3 font-semibold text-gray-600 min-w-[110px]">Parentesco</th>
                            <th className="text-center px-4 py-3 font-semibold text-gray-600 min-w-[160px]">WhatsApp Acción</th>
                            <th className="text-center px-4 py-3 font-semibold text-gray-600 min-w-[110px]">Estado</th>
                            <th className="px-4 py-3"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {filteredRecords.map((record, recordIdx) => (
                            record.referencias.map((ref, refIdx) => (
                                <tr
                                    key={`${record._id}-${ref._id}`}
                                    className={`group transition-colors hover:bg-orange-50/40 ${recordIdx % 2 === 0 ? 'bg-white' : 'bg-gray-50/40'}`}
                                >
                                    {/* Buyer cell — only rendered for the first row of each group */}
                                    {refIdx === 0 && (
                                        <td
                                            rowSpan={record.referencias.length}
                                            className="px-4 py-3 align-top border-r border-gray-100"
                                        >
                                            <div className="font-semibold text-gray-800">{record.nombreComprador}</div>
                                            <div className="text-xs text-gray-400 mt-0.5">{record.whatsappComprador}</div>
                                        </td>
                                    )}

                                    {/* Referral name */}
                                    <td className="px-4 py-3">
                                        <div className="font-medium text-gray-700">{ref.nombre}</div>
                                        <div className="text-xs text-gray-400">{ref.whatsapp}</div>
                                    </td>

                                    {/* Parentesco */}
                                    <td className="px-4 py-3">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                                            {typeof ref.parentesco === 'object' ? ref.parentesco.nombre : ref.parentesco}
                                        </span>
                                    </td>

                                    {/* WhatsApp action */}
                                    <td className="px-4 py-3 text-center">
                                        <button
                                            onClick={() => handleWhatsApp(record, ref)}
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white text-xs font-semibold rounded-lg transition-all shadow-sm hover:shadow-green-200 hover:shadow-md active:scale-95"
                                        >
                                            <MessageCircle className="w-3.5 h-3.5" />
                                            Enviar WhatsApp
                                        </button>
                                    </td>

                                    {/* Status */}
                                    <td className="px-4 py-3 text-center">
                                        {ref.estado === 'Contactado' ? (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-50 text-green-700 border border-green-100">
                                                ✅ Contactado
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-100">
                                                ⏳ Pendiente
                                            </span>
                                        )}
                                    </td>

                                    {/* Delete — only on first row */}
                                    {refIdx === 0 && (
                                        <td rowSpan={record.referencias.length} className="px-3 py-3 text-center align-middle">
                                            <button
                                                onClick={() => handleDelete(record._id)}
                                                disabled={deletingId === record._id}
                                                className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                                title="Eliminar grupo"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    )}
                                </tr>
                            ))
                        ))}
                    </tbody>
                </table>
            </div>
            )}
        </div>
    );
}

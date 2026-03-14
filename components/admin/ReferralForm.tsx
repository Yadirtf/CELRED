'use client';

import { useState, useEffect, useRef } from 'react';
import { Plus, Trash2, UserPlus, Send, Search, ChevronDown, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import type { ReferralFormEntry } from '@/hooks/useReferrals';

interface ParentescoOption {
    _id: string;
    nombre: string;
}

const emptyEntry = (defaultId = '', defaultNombre = ''): ReferralFormEntry => ({
    nombre: '',
    whatsapp: '',
    parentescoId: defaultId,
    parentescoNombre: defaultNombre,
});

// ─── Searchable Combobox ────────────────────────────────────────────────────
interface ComboboxProps {
    options: ParentescoOption[];
    value: string;           // selected _id
    displayValue: string;    // selected nombre
    onChange: (id: string, nombre: string) => void;
    placeholder?: string;
}

function ParentescoCombobox({ options, value, displayValue, onChange, placeholder = 'Buscar parentesco...' }: ComboboxProps) {
    const [query, setQuery] = useState('');
    const [open, setOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const filtered = query.trim()
        ? options.filter(o => o.nombre.toLowerCase().includes(query.toLowerCase()))
        : options;

    // Close on outside click
    useEffect(() => {
        function handleClick(e: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setOpen(false);
                setQuery('');
            }
        }
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    const handleSelect = (opt: ParentescoOption) => {
        onChange(opt._id, opt.nombre);
        setQuery('');
        setOpen(false);
    };

    const handleClear = (e: React.MouseEvent) => {
        e.stopPropagation();
        onChange('', '');
        setQuery('');
    };

    return (
        <div ref={containerRef} className="relative">
            {/* Trigger / Search input */}
            <div
                className={`flex items-center border rounded-lg bg-white cursor-text transition-all ${open ? 'border-red-400 ring-2 ring-red-300' : 'border-gray-200 hover:border-gray-300'}`}
                onClick={() => { setOpen(true); }}
            >
                <Search className="w-3.5 h-3.5 text-gray-400 ml-3 shrink-0" />
                <input
                    type="text"
                    value={open ? query : displayValue}
                    onChange={e => { setQuery(e.target.value); setOpen(true); }}
                    onFocus={() => setOpen(true)}
                    placeholder={open ? placeholder : (displayValue || placeholder)}
                    className="flex-1 min-w-0 px-2 py-2 text-sm bg-transparent focus:outline-none placeholder:text-gray-400"
                />
                {value && !open ? (
                    <button type="button" onClick={handleClear} className="p-2 text-gray-400 hover:text-red-500">
                        <X className="w-3.5 h-3.5" />
                    </button>
                ) : (
                    <ChevronDown className={`w-3.5 h-3.5 text-gray-400 mr-2 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
                )}
            </div>

            {/* Dropdown */}
            {open && (
                <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                    <div className="max-h-52 overflow-y-auto">
                        {filtered.length === 0 ? (
                            <div className="px-4 py-3 text-sm text-gray-400 text-center">Sin resultados</div>
                        ) : (
                            filtered.map(opt => (
                                <button
                                    key={opt._id}
                                    type="button"
                                    onClick={() => handleSelect(opt)}
                                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-red-50 hover:text-red-700 ${opt._id === value ? 'bg-red-50 text-red-700 font-medium' : 'text-gray-700'}`}
                                >
                                    {opt.nombre}
                                </button>
                            ))
                        )}
                    </div>
                    <div className="border-t border-gray-50 px-3 py-1.5 text-xs text-gray-400">
                        {filtered.length} opción{filtered.length !== 1 ? 'es' : ''}
                    </div>
                </div>
            )}
        </div>
    );
}

// ─── Main Form ──────────────────────────────────────────────────────────────
interface Props {
    onSubmit: (nombreComprador: string, whatsappComprador: string, advisorId: string, referencias: ReferralFormEntry[]) => Promise<boolean>;
    saving: boolean;
}

export default function ReferralForm({ onSubmit, saving }: Props) {
    const [nombreComprador, setNombreComprador] = useState('');
    const [whatsappComprador, setWhatsappComprador] = useState('');
    const [selectedAdvisorId, setSelectedAdvisorId] = useState('');
    const [parentescos, setParentescos] = useState<ParentescoOption[]>([]);
    const [advisors, setAdvisors] = useState<{ number: string; name?: string }[]>([]);
    const [referencias, setReferencias] = useState<ReferralFormEntry[]>([]);
    const [formError, setFormError] = useState('');
    const [success, setSuccess] = useState(false);
    const [loadingOptions, setLoadingOptions] = useState(true);

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                const [parentescosRes, settingsRes] = await Promise.all([
                    fetch('/api/parentescos'),
                    fetch('/api/settings')
                ]);
                const parentescosData = await parentescosRes.json();
                const settingsData = await settingsRes.json();

                setParentescos(parentescosData);
                setAdvisors(settingsData.advisors || []);
                
                if (parentescosData.length > 0) {
                    setReferencias([emptyEntry(parentescosData[0]._id, parentescosData[0].nombre)]);
                }
            } catch (error) {
                console.error('Error loading initial data', error);
            } finally {
                setLoadingOptions(false);
            }
        };

        loadInitialData();
    }, []);

    const handleAddRow = () => {
        const first = parentescos[0];
        setReferencias(prev => [...prev, emptyEntry(first?._id ?? '', first?.nombre ?? '')]);
    };

    const handleRemoveRow = (index: number) => {
        if (referencias.length === 1) return;
        setReferencias(prev => prev.filter((_, i) => i !== index));
    };

    const handleFieldChange = (index: number, field: keyof ReferralFormEntry, value: string) => {
        setReferencias(prev =>
            prev.map((entry, i) => i === index ? { ...entry, [field]: value } : entry)
        );
    };

    const handleParentescoChange = (index: number, id: string, nombre: string) => {
        setReferencias(prev =>
            prev.map((entry, i) => i === index ? { ...entry, parentescoId: id, parentescoNombre: nombre } : entry)
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError('');
        setSuccess(false);

        if (!nombreComprador.trim() || !whatsappComprador.trim()) {
            setFormError('El nombre y WhatsApp del comprador son obligatorios.');
            return;
        }

        if (!selectedAdvisorId) {
            setFormError('Debes seleccionar un asesor.');
            return;
        }

        const validRefs = referencias.filter(r => r.nombre.trim() && r.whatsapp.trim() && r.parentescoId);
        if (validRefs.length === 0) {
            setFormError('Agrega al menos una referencia con nombre, WhatsApp y parentesco.');
            return;
        }

        const ok = await onSubmit(nombreComprador.trim(), whatsappComprador.trim(), selectedAdvisorId, validRefs);
        if (ok) {
            const first = parentescos[0];
            setNombreComprador('');
            setWhatsappComprador('');
            setReferencias([emptyEntry(first?._id ?? '', first?.nombre ?? '')]);
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        }
    };

    if (loadingOptions) {
        return <div className="py-8 text-center text-gray-400 text-sm">Cargando opciones...</div>;
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Advisor Selector */}
            <div className="bg-white border-2 border-red-50 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
                        <UserPlus className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="text-base font-bold text-gray-900">¿Quién registra?</h3>
                        <p className="text-xs text-gray-500">Selecciona tu nombre de asesora</p>
                    </div>
                </div>
                
                <div className="grid grid-cols-1 gap-4">
                    <select
                        value={selectedAdvisorId}
                        onChange={e => setSelectedAdvisorId(e.target.value)}
                        className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 appearance-none bg-white transition-all ${selectedAdvisorId ? 'border-red-200 bg-red-50/30' : 'border-gray-200'}`}
                    >
                        <option value="">-- Elige tu nombre --</option>
                        {advisors.map(adv => (
                            <option key={adv.number} value={adv.number}>
                                {adv.name || adv.number}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Buyer Block */}
            <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-100 rounded-xl p-5">
                <h3 className="text-sm font-bold text-red-700 uppercase tracking-wide mb-4 flex items-center gap-2">
                    <Search className="w-4 h-4" />
                    Datos del Comprador (Quien da la referencia)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Nombre *</label>
                        <input
                            type="text"
                            value={nombreComprador}
                            onChange={e => setNombreComprador(e.target.value)}
                            placeholder="Ej: Juan Pérez"
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 bg-white"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">WhatsApp *</label>
                        <input
                            type="tel"
                            value={whatsappComprador}
                            onChange={e => setWhatsappComprador(e.target.value)}
                            placeholder="Ej: 3105550000"
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 bg-white"
                        />
                    </div>
                </div>
            </div>

            {/* Referrals Block */}
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide">Referencias</h3>
                    <button
                        type="button"
                        onClick={handleAddRow}
                        className="flex items-center gap-1.5 text-sm text-red-600 hover:text-red-800 font-medium transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        Agregar referencia
                    </button>
                </div>

                {referencias.map((ref, index) => (
                    <div
                        key={index}
                        className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_220px_auto] gap-3 items-end bg-gray-50 border border-gray-100 rounded-xl p-4"
                    >
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 mb-1">Nombre</label>
                            <input
                                type="text"
                                value={ref.nombre}
                                onChange={e => handleFieldChange(index, 'nombre', e.target.value)}
                                placeholder="Nombre del referido"
                                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-300 bg-white"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 mb-1">WhatsApp</label>
                            <input
                                type="tel"
                                value={ref.whatsapp}
                                onChange={e => handleFieldChange(index, 'whatsapp', e.target.value)}
                                placeholder="Número"
                                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-300 bg-white"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 mb-1">Parentesco</label>
                            <ParentescoCombobox
                                options={parentescos}
                                value={ref.parentescoId}
                                displayValue={ref.parentescoNombre ?? ''}
                                onChange={(id, nombre) => handleParentescoChange(index, id, nombre)}
                            />
                        </div>
                        <button
                            type="button"
                            onClick={() => handleRemoveRow(index)}
                            disabled={referencias.length === 1}
                            className="p-2 text-gray-400 hover:text-red-500 disabled:opacity-30 transition-colors rounded-lg hover:bg-red-50"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                ))}
            </div>

            {formError && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-2">{formError}</p>
            )}
            {success && (
                <p className="text-sm text-green-700 bg-green-50 border border-green-100 rounded-lg px-4 py-2">
                    ✅ Referencias guardadas correctamente.
                </p>
            )}

            <Button type="submit" disabled={saving} className="w-full gap-2">
                <Send className="w-4 h-4" />
                {saving ? 'Guardando...' : 'Registrar Referencias'}
            </Button>
        </form>
    );
}

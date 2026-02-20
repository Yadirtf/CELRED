'use client';

import { Button } from '@/components/ui/Button';
import { Save, Check, MessageSquare } from 'lucide-react';
import { useSettings } from '@/hooks/useSettings';
import AddAdvisorForm from '@/components/admin/AddAdvisorForm';
import AdvisorCard from '@/components/admin/AdvisorCard';
import CatalogShareTool from '@/components/admin/CatalogShareTool';

export default function SettingsForm() {
    const {
        advisors,
        loading,
        saving,
        uploading,
        message,
        handleAddAdvisor,
        handleRemoveAdvisor,
        handleImageUpload,
        handleSave,
    } = useSettings();

    if (loading) return <div className="p-8 text-center">Cargando configuración...</div>;

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mt-8">
            {/* Header */}
            <div className="p-6 border-b border-gray-50 flex flex-col sm:flex-row justify-between items-start sm:items-center bg-gray-50/50 gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                        <MessageSquare className="w-5 h-5" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">Configuración de WhatsApp</h2>
                        <p className="text-xs text-gray-500">Administra los números de los asesores</p>
                    </div>
                </div>
                <Button onClick={handleSave} disabled={saving} className="gap-2 px-6 w-full sm:w-auto">
                    {saving
                        ? 'Guardando...'
                        : message.type === 'success'
                            ? <><Check className="w-4 h-4" /> Guardado</>
                            : <><Save className="w-4 h-4" /> Guardar</>}
                </Button>
            </div>

            <div className="p-6 space-y-6">
                <AddAdvisorForm onAdd={handleAddAdvisor} />

                <div className="space-y-3">
                    <label className="block text-sm font-semibold text-gray-700">
                        Asesores Registrados
                    </label>
                    {advisors.length === 0 ? (
                        <div className="text-center py-8 border-2 border-dashed border-gray-100 rounded-xl text-gray-400 text-sm">
                            No hay asesores registrados. Agrega uno arriba.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {advisors.map((advisor, index) => (
                                <AdvisorCard
                                    key={index}
                                    advisor={advisor}
                                    index={index}
                                    uploading={uploading}
                                    onRemove={handleRemoveAdvisor}
                                    onImageUpload={handleImageUpload}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {message.text && (
                    <div
                        className={`p-3 rounded-lg text-sm text-center ${message.type === 'success'
                                ? 'bg-green-50 text-green-700 border border-green-100'
                                : 'bg-red-50 text-red-700 border border-red-100'
                            }`}
                    >
                        {message.text}
                    </div>
                )}

                <CatalogShareTool advisors={advisors} />
            </div>
        </div>
    );
}

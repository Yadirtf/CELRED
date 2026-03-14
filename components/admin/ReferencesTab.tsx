'use client';

import { useState } from 'react';
import { ClipboardList, UserPlus, MessageSquare } from 'lucide-react';
import ReferralForm from '@/components/admin/ReferralForm';
import ReferralDashboard from '@/components/admin/ReferralDashboard';
import MessageTemplateForm from '@/components/admin/MessageTemplateForm';
import { useReferrals } from '@/hooks/useReferrals';

type SubTab = 'register' | 'dashboard' | 'message';

const SUB_TABS: { id: SubTab; label: string; icon: React.ReactNode }[] = [
    { id: 'register', label: 'Registrar Referidos', icon: <UserPlus className="w-4 h-4" /> },
    { id: 'dashboard', label: 'Dashboard', icon: <ClipboardList className="w-4 h-4" /> },
    { id: 'message', label: 'Mensaje Maestro', icon: <MessageSquare className="w-4 h-4" /> },
];

export default function ReferencesTab() {
    const [subTab, setSubTab] = useState<SubTab>('register');
    // referralMessage now lives in useReferrals — no direct API call needed here
    const { addReferrals, saving, referralMessage } = useReferrals();

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-start gap-4">
                <div className="p-3 bg-gradient-to-br from-red-100 to-orange-100 text-red-600 rounded-xl">
                    <ClipboardList className="w-6 h-6" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Módulo de Referencias</h2>
                    <p className="text-sm text-gray-500 mt-0.5">
                        Registra los referidos de tus compradores y envíales un mensaje de WhatsApp personalizado.
                    </p>
                </div>
            </div>

            {/* Sub-tab Navigation */}
            <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
                {SUB_TABS.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setSubTab(tab.id)}
                        className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                            subTab === tab.id
                                ? 'bg-white text-gray-900 shadow-sm'
                                : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        {tab.icon}
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Sub-tab Content */}
            {subTab === 'register' && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <h3 className="text-base font-bold text-gray-800 mb-5">Nuevo Registro de Referidos</h3>
                    <ReferralForm onSubmit={addReferrals} saving={saving} />
                </div>
            )}

            {subTab === 'dashboard' && (
                <ReferralDashboard referralMessage={referralMessage} />
            )}

            {subTab === 'message' && (
                <MessageTemplateForm />
            )}
        </div>
    );
}

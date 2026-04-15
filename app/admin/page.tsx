'use client';

import { useState } from 'react';
import ProductList from '@/components/admin/ProductList';
import BrandList from '@/components/admin/BrandList';
import SettingsForm from '@/components/admin/SettingsForm';
import ReferencesTab from '@/components/admin/ReferencesTab';
import QuickNoteList from '@/components/admin/QuickNoteList';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { LogOut, MessageSquareCode, BarChart3 } from 'lucide-react';
import CatalogViewerStats from '@/components/admin/CatalogViewerStats';
import VisitorAnalytics from '@/components/admin/VisitorAnalytics';

export default function AdminPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('products');

    const handleLogout = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
            router.push('/login');
            router.refresh();
        } catch (error) {
            console.error('Logout failed', error);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold text-gray-800">Panel de Administración</h1>
                    <div className="flex items-center gap-3">
                        <p className="text-gray-500">Gestiona tus productos y configuraciones.</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <CatalogViewerStats />
                    <div className="w-px h-8 bg-gray-200 hidden sm:block" />
                    <Button variant="ghost" onClick={handleLogout} className="text-red-500 hover:text-red-700 hover:bg-red-50 gap-2">
                        <LogOut className="w-5 h-5" />
                        Cerrar Sesión
                    </Button>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex border-b border-gray-200 overflow-x-auto scrollbar-hide">
                <button
                    className={`py-2 px-4 text-sm font-medium whitespace-nowrap ${activeTab === 'products' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                    onClick={() => setActiveTab('products')}
                >
                    Productos
                </button>
                <button
                    className={`py-2 px-4 text-sm font-medium whitespace-nowrap ${activeTab === 'brands' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                    onClick={() => setActiveTab('brands')}
                >
                    Marcas
                </button>
                <button
                    className={`py-2 px-4 text-sm font-medium whitespace-nowrap ${activeTab === 'advisors' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                    onClick={() => setActiveTab('advisors')}
                >
                    Asesores (WhatsApp)
                </button>
                <button
                    className={`py-2 px-4 text-sm font-medium whitespace-nowrap ${activeTab === 'quick-notes' ? 'border-b-2 border-green-500 text-green-600' : 'text-gray-500 hover:text-gray-700'}`}
                    onClick={() => setActiveTab('quick-notes')}
                >
                    <span className="flex items-center gap-2">
                        <MessageSquareCode className="w-4 h-4" />
                        Mensajes Rápidos
                    </span>
                </button>
                <button
                    className={`py-2 px-4 text-sm font-medium whitespace-nowrap ${activeTab === 'references' ? 'border-b-2 border-red-500 text-red-600' : 'text-gray-500 hover:text-gray-700'}`}
                    onClick={() => setActiveTab('references')}
                >
                    📋 Referencias
                </button>
                <button
                    className={`py-2 px-4 text-sm font-medium whitespace-nowrap ${activeTab === 'audience' ? 'border-b-2 border-indigo-500 text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                    onClick={() => setActiveTab('audience')}
                >
                    <span className="flex items-center gap-2">
                        <BarChart3 className="w-4 h-4" />
                        Audiencia
                    </span>
                </button>
            </div>

            {/* Tab Content */}
            <main className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 min-h-[400px]">
                {activeTab === 'products' && (
                    <div className="space-y-4">
                        <ProductList />
                    </div>
                )}

                {activeTab === 'brands' && <BrandList />}

                {activeTab === 'advisors' && <SettingsForm />}

                {activeTab === 'quick-notes' && <QuickNoteList />}

                {activeTab === 'references' && <ReferencesTab />}

                {activeTab === 'audience' && <VisitorAnalytics />}
            </main>
        </div>
    );
}

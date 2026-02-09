'use client';

import { useState } from 'react';
import ProductList from '@/components/admin/ProductList';
import BrandList from '@/components/admin/BrandList';
import SettingsForm from '@/components/admin/SettingsForm';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { LogOut } from 'lucide-react';

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
            <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Panel de Administración</h1>
                    <p className="text-gray-500">Gestiona tus productos y configuraciones.</p>
                </div>
                <Button variant="ghost" onClick={handleLogout} className="text-red-500 hover:text-red-700 hover:bg-red-50 gap-2">
                    <LogOut className="w-5 h-5" />
                    Cerrar Sesión
                </Button>
            </div>

            {/* Tab Navigation */}
            <div className="flex border-b border-gray-200">
                <button
                    className={`py-2 px-4 text-sm font-medium ${activeTab === 'products' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                    onClick={() => setActiveTab('products')}
                >
                    Productos
                </button>
                <button
                    className={`py-2 px-4 text-sm font-medium ${activeTab === 'brands' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                    onClick={() => setActiveTab('brands')}
                >
                    Marcas
                </button>
                <button
                    className={`py-2 px-4 text-sm font-medium ${activeTab === 'advisors' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                    onClick={() => setActiveTab('advisors')}
                >
                    Asesores (WhatsApp)
                </button>
            </div>

            {/* Tab Content */}
            <main className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                {activeTab === 'products' && (
                    <div className="space-y-4">
                        <ProductList />
                    </div>
                )}

                {activeTab === 'brands' && <BrandList />}

                {activeTab === 'advisors' && <SettingsForm />}
            </main>
        </div>
    );
}

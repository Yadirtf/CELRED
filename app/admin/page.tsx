'use client';

import ProductList from "@/components/admin/ProductList";
import BrandList from "@/components/admin/BrandList";
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { LogOut } from 'lucide-react';

export default function AdminPage() {
    const router = useRouter();

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

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div className="lg:col-span-1">
                    <BrandList />
                </div>
                <div className="lg:col-span-3">
                    <ProductList />
                </div>
            </div>
        </div>
    );
}

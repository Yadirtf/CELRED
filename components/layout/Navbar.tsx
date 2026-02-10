import Link from 'next/link';
import { Smartphone, LayoutGrid, Settings } from 'lucide-react';

export function Navbar() {
    return (
        <nav className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 font-bold text-xl text-gray-900 hover:opacity-80 transition">
                    <Smartphone className="w-6 h-6 text-red-600" />
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-orange-500">
                        CELRED
                    </span>
                </Link>

                <div className="flex items-center gap-6">
                    <Link
                        href="/"
                        className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
                    >
                        <LayoutGrid className="w-4 h-4" />
                        Galería
                    </Link>
                    <Link
                        href="/admin"
                        className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
                    >
                        <Settings className="w-4 h-4" />
                        Administración
                    </Link>
                </div>
            </div>
        </nav>
    );
}

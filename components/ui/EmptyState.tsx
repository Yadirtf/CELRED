import { Search } from 'lucide-react';

interface EmptyStateProps {
    message?: string;
    hint?: string;
}

export default function EmptyState({
    message = 'No se encontraron productos.',
    hint = 'Intenta seleccionar otra marca o filtro.',
}: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
            <Search className="w-12 h-12 text-gray-300 mb-4" />
            <p className="text-xl text-gray-500 font-medium">{message}</p>
            <p className="text-gray-400 text-sm mt-1">{hint}</p>
        </div>
    );
}

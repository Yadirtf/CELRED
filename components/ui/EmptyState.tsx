import { Search } from 'lucide-react';

interface EmptyStateProps {
    message?: string;
    hint?: string;
    icon?: React.ReactNode;
}

export default function EmptyState({
    message = 'No se encontraron resultados.',
    hint = 'Intenta con otros términos de búsqueda.',
    icon,
}: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-gray-300 shadow-sm">
            {icon ? icon : <Search className="w-12 h-12 text-gray-300 mb-4" />}
            <p className="text-xl text-gray-900 font-bold">{message}</p>
            <p className="text-gray-500 text-sm mt-1 text-center max-w-sm">{hint}</p>
        </div>
    );
}

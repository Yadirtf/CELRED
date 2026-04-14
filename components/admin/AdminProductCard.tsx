'use client';

import { Product } from '@/core/entities/Product';
import { Edit, Trash2, ShoppingBag, Eye, Share2, Tag } from 'lucide-react';

interface AdminProductCardProps {
    product: Product;
    onSell: (product: Product) => void;
    onShare: (product: Product) => void;
    onView: (product: Product) => void;
    onEdit: (product: Product) => void;
    onDelete: (id: string) => void;
}

export default function AdminProductCard({
    product,
    onSell,
    onShare,
    onView,
    onEdit,
    onDelete,
}: AdminProductCardProps) {
    const brandName = typeof product.brand === 'object' ? (product.brand as any).name : 'Celular';
    
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col hover:shadow-md transition-shadow group">
            {/* Image & Badges */}
            <div className="relative aspect-[4/3] bg-[#F8F8FA] flex items-center justify-center p-4 border-b border-gray-100">
                <img
                    src={product.imageUrl || '/placeholder.png'}
                    alt={product.name}
                    className={`max-h-full max-w-full object-contain ${product.stock <= 0 ? 'opacity-40 grayscale' : 'drop-shadow-sm group-hover:scale-105 transition-transform duration-300'}`}
                />
                
                {/* Stock Badge */}
                <div className="absolute top-2 right-2">
                    <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider shadow-sm ${product.stock > 0 ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-red-100 text-red-700 border border-red-200'}`}>
                        {product.stock > 0 ? `${product.stock} disp.` : 'Agotado'}
                    </span>
                </div>
            </div>

            {/* Info */}
            <div className="p-4 flex flex-col flex-1 bg-white">
                <div className="flex items-center gap-1 mb-1.5 opacity-60">
                    <Tag className="w-3 h-3 text-red-500" />
                    <span className="text-[9px] uppercase font-bold tracking-widest text-gray-600 truncate">{brandName}</span>
                </div>
                <h3 className="font-bold text-gray-900 leading-tight line-clamp-2 mb-2 text-xs md:text-sm">
                    {product.name}
                </h3>
                <div className="mt-auto pt-2 flex items-center justify-between border-t border-gray-100/50">
                    <span className="font-black text-gray-900 text-sm">
                        ${product.price.toLocaleString()}
                    </span>
                </div>
            </div>

            {/* Actions Toolbar */}
            <div className="grid grid-cols-5 border-t border-gray-200 bg-gray-50 divide-x divide-gray-200/60">
                <button
                    onClick={() => onSell(product)}
                    disabled={product.stock <= 0}
                    title="Vender"
                    className={`p-2.5 flex items-center justify-center transition-colors ${product.stock > 0 ? 'text-green-600 hover:bg-green-100 hover:text-green-700' : 'text-gray-300 cursor-not-allowed'}`}
                >
                    <ShoppingBag className="w-4 h-4" />
                </button>
                <button
                    onClick={() => onView(product)}
                    title="Ver Detalles"
                    className="p-2.5 flex items-center justify-center text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                >
                    <Eye className="w-4 h-4" />
                </button>
                <button
                    onClick={() => onShare(product)}
                    title="Compartir"
                    className="p-2.5 flex items-center justify-center text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                >
                    <Share2 className="w-4 h-4" />
                </button>
                <button
                    onClick={() => onEdit(product)}
                    title="Editar"
                    className="p-2.5 flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-200 transition-colors"
                >
                    <Edit className="w-4 h-4" />
                </button>
                <button
                    onClick={() => product.id && onDelete(product.id)}
                    title="Eliminar"
                    className="p-2.5 flex items-center justify-center text-red-400 hover:text-red-700 hover:bg-red-50 transition-colors"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}

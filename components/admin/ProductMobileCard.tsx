'use client';

import { Product } from '@/core/entities/Product';
import { Button } from '@/components/ui/Button';
import { Edit, Trash2, ShoppingBag, Eye, Share2 } from 'lucide-react';

interface ProductMobileCardProps {
    product: Product;
    onSell: (product: Product) => void;
    onShare: (product: Product) => void;
    onView: (product: Product) => void;
    onEdit: (product: Product) => void;
    onDelete: (id: string) => void;
}

export default function ProductMobileCard({
    product,
    onSell,
    onShare,
    onView,
    onEdit,
    onDelete,
}: ProductMobileCardProps) {
    return (
        <div className="p-4 space-y-4">
            <div className="flex gap-4">
                <img
                    src={product.imageUrl || '/placeholder.png'}
                    alt={product.name}
                    className="w-20 h-20 object-cover rounded-lg bg-gray-50"
                />
                <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-gray-900 truncate">{product.name}</h4>
                    <p className="text-blue-600 font-bold text-lg">
                        ${product.price.toLocaleString()}
                    </p>
                    <div className="mt-1">
                        <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${product.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
                        >
                            Stock: {product.stock}
                        </span>
                    </div>
                </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-50">
                <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => onSell(product)}
                    className="flex-1 bg-green-50 text-green-600 hover:bg-green-100 h-10"
                    disabled={product.stock <= 0}
                >
                    <ShoppingBag className="w-4 h-4 mr-2" /> Venta
                </Button>
                <Button variant="ghost" size="sm" onClick={() => onShare(product)} className="h-10 px-3">
                    <Share2 className="w-4 h-4 text-green-500" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => onView(product)} className="h-10 px-3 text-gray-500">
                    <Eye className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => onEdit(product)} className="h-10 px-3 text-blue-500">
                    <Edit className="w-4 h-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => product.id && onDelete(product.id)}
                    className="h-10 px-3 text-red-500"
                >
                    <Trash2 className="w-4 h-4" />
                </Button>
            </div>
        </div>
    );
}

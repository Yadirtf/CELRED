'use client';

import { Product } from '@/core/entities/Product';
import { Button } from '@/components/ui/Button';
import { Edit, Trash2, ShoppingBag, Eye, Share2 } from 'lucide-react';

interface ProductTableRowProps {
    product: Product;
    onSell: (product: Product) => void;
    onShare: (product: Product) => void;
    onView: (product: Product) => void;
    onEdit: (product: Product) => void;
    onDelete: (id: string) => void;
}

export default function ProductTableRow({
    product,
    onSell,
    onShare,
    onView,
    onEdit,
    onDelete,
}: ProductTableRowProps) {
    return (
        <tr className="hover:bg-gray-50 transition-colors">
            <td className="px-6 py-4">
                <img
                    src={product.imageUrl || '/placeholder.png'}
                    alt={product.name}
                    className="w-12 h-12 object-cover rounded-md bg-gray-100"
                />
            </td>
            <td className="px-6 py-4 font-medium text-gray-900">{product.name}</td>
            <td className="px-6 py-4 text-blue-600 font-semibold">
                ${product.price.toLocaleString()}
            </td>
            <td className="px-6 py-4">
                <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${product.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
                >
                    {product.stock} un.
                </span>
            </td>
            <td className="px-6 py-4 flex gap-2 justify-end">
                <Button
                    variant="secondary"
                    size="sm"
                    title="Registrar Venta"
                    onClick={() => onSell(product)}
                    className="bg-green-50 text-green-600 hover:bg-green-100 hover:text-green-700"
                    disabled={product.stock <= 0}
                >
                    <ShoppingBag className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => onShare(product)} title="Compartir">
                    <Share2 className="w-4 h-4 text-green-500" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => onView(product)} title="Ver detalles">
                    <Eye className="w-4 h-4 text-gray-500" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => onEdit(product)} title="Editar">
                    <Edit className="w-4 h-4 text-blue-500" />
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => product.id && onDelete(product.id)}
                    title="Eliminar"
                >
                    <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
            </td>
        </tr>
    );
}

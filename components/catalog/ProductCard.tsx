'use client';

import { Product } from '@/core/entities/Product';
import { Button } from '@/components/ui/Button';
import { MessageCircle } from 'lucide-react';

interface ProductCardProps {
    product: Product;
    onWhatsApp: (product: Product, opcion: 'financiado' | 'de contado') => void;
    onView: (product: Product) => void;
}

export default function ProductCard({ product, onWhatsApp, onView }: ProductCardProps) {
    const outOfStock = product.stock === 0;
    const brandName =
        typeof product.brand === 'object' ? (product.brand as any).name : 'Celular';

    return (
        <div className="group h-full flex flex-col relative w-full bg-white rounded-[2rem] border border-gray-200/60 overflow-hidden transition-all duration-500 hover:shadow-[0_24px_40px_-12px_rgba(0,0,0,0.1)] hover:-translate-y-1.5 focus-within:ring-4 focus-within:ring-red-500/20">
            {/* Image Section */}
            <div className="relative aspect-[4/5] bg-[#F8F8FA] w-full flex items-center justify-center p-8 overflow-hidden group-hover:bg-[#F2F2F5] transition-colors duration-500">
                <img
                    src={product.imageUrl || '/placeholder.png'}
                    alt={product.name}
                    className={`w-full h-full object-contain drop-shadow-xl transition-transform duration-700 ease-out group-hover:scale-105 ${outOfStock ? 'opacity-40 grayscale-[0.8]' : ''}`}
                />
                
                {/* Brand Badge */}
                <div className="absolute top-4 left-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/90 backdrop-blur-md border border-gray-200 shadow-sm text-[10px] font-black uppercase tracking-widest text-gray-800">
                        {brandName}
                    </span>
                </div>

                {/* Out of Stock Overlay */}
                {outOfStock && (
                    <div className="absolute inset-0 bg-white/20 backdrop-blur-[2px] flex items-center justify-center">
                        <span className="bg-red-600 text-white px-5 py-2 rounded-full text-sm font-bold uppercase tracking-widest shadow-2xl transform -rotate-6">
                            Agotado
                        </span>
                    </div>
                )}
            </div>

            {/* Content Section */}
            <div className="p-6 flex flex-col flex-1 bg-white">
                <div className="mb-4">
                    <h2 className="text-xl font-bold text-gray-900 leading-tight group-hover:text-red-600 transition-colors line-clamp-1">
                        {product.name}
                    </h2>
                    <p className="text-sm text-gray-500 mt-2 line-clamp-2 h-10 leading-relaxed">
                        {product.description}
                    </p>
                </div>

                {/* Action Section */}
                <div className="mt-auto flex flex-col gap-3">
                    <div className="flex items-center mb-1">
                        <span className="text-[10px] font-black text-orange-600 uppercase tracking-wider bg-orange-50 px-2.5 py-1 rounded-md border border-orange-100">
                            Financiación Disponible
                        </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => onWhatsApp(product, 'financiado')}
                            disabled={outOfStock}
                            className={`rounded-2xl py-5 text-xs font-bold transition-all ${outOfStock ? 'bg-gray-50 text-gray-400 border-gray-200' : 'bg-green-50 text-green-700 hover:bg-green-600 hover:text-white border-green-200 shadow-sm'}`}
                        >
                            <MessageCircle className="w-4 h-4 mr-1.5" />
                            Financiado
                        </Button>
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => onWhatsApp(product, 'de contado')}
                            disabled={outOfStock}
                            className={`rounded-2xl py-5 text-xs font-bold transition-all ${outOfStock ? 'bg-gray-50 text-gray-400 border-gray-200' : 'bg-green-50 text-green-700 hover:bg-green-600 hover:text-white border-green-200 shadow-sm'}`}
                        >
                            <MessageCircle className="w-4 h-4 mr-1.5" />
                            Contado
                        </Button>
                    </div>
                    
                    <Button
                        size="sm"
                        onClick={() => onView(product)}
                        className="w-full rounded-2xl py-6 text-sm font-bold bg-gray-900 text-white hover:bg-black shadow-md hover:shadow-xl transition-all"
                    >
                        Ver Características Principales
                    </Button>
                </div>
            </div>
        </div>
    );
}

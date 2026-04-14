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
        <div className="group relative">
            {/* Animated SVG Border */}
            <div className="absolute -inset-[2px] z-0 rounded-2xl overflow-visible pointer-events-none">
                <svg className="w-full h-full overflow-visible" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <linearGradient id={`border-grad-${product.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#ef4444" />
                            <stop offset="50%" stopColor="#ff6347" />
                            <stop offset="100%" stopColor="#ef4444" />
                        </linearGradient>
                        <filter id={`glow-${product.id}`}>
                            <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
                            <feMerge>
                                <feMergeNode in="coloredBlur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>
                    <rect
                        x="1" y="1"
                        width="calc(100% - 2px)"
                        height="calc(100% - 2px)"
                        rx="15"
                        fill="none"
                        stroke={`url(#border-grad-${product.id})`}
                        strokeWidth="3"
                        filter={`url(#glow-${product.id})`}
                        className="animate-border-travel opacity-80"
                        pathLength="100"
                    />
                </svg>
            </div>

            {/* Card Content */}
            <div className="relative h-full bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100/50 overflow-hidden flex flex-col z-10 m-[1px]">
                {/* Image Area */}
                <div className="aspect-[4/5] relative overflow-hidden bg-gray-50 p-6 flex items-center justify-center">
                    <img
                        src={product.imageUrl || '/placeholder.png'}
                        alt={product.name}
                        className={`w-full h-full object-contain group-hover:scale-110 transition-transform duration-500 drop-shadow-sm ${outOfStock ? 'opacity-40 grayscale-[0.5]' : ''}`}
                    />
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-gray-700 shadow-sm border border-gray-100 uppercase tracking-wider">
                        {brandName}
                    </div>
                    {outOfStock && (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="bg-red-600 text-white px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-widest shadow-lg transform -rotate-12">
                                Agotado
                            </span>
                        </div>
                    )}
                </div>

                {/* Info Area */}
                <div className="p-5 space-y-3 flex-1 flex flex-col">
                    <div>
                        <h2 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                            {product.name}
                        </h2>
                        <p className="text-sm text-gray-500 line-clamp-2 mt-1 h-10">
                            {product.description}
                        </p>
                    </div>

                    <div className="mt-auto pt-4 flex flex-col gap-3 border-t border-gray-50">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold text-orange-600">
                                Financiación Disponible
                            </span>
                        </div>
                        <div className="flex flex-col gap-2">
                            <div className="flex gap-2">
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    onClick={() => onWhatsApp(product, 'financiado')}
                                    disabled={outOfStock}
                                    className={`flex-1 rounded-full px-2 text-xs ${outOfStock ? 'bg-gray-100 text-gray-400 border-gray-200' : 'bg-green-50 text-green-700 hover:bg-green-100 border-green-200'}`}
                                >
                                    <MessageCircle className="w-3 h-3 mr-1" />
                                    {outOfStock ? 'Agotado' : 'Financiado'}
                                </Button>
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    onClick={() => onWhatsApp(product, 'de contado')}
                                    disabled={outOfStock}
                                    className={`flex-1 rounded-full px-2 text-xs ${outOfStock ? 'bg-gray-100 text-gray-400 border-gray-200' : 'bg-green-50 text-green-700 hover:bg-green-100 border-green-200'}`}
                                >
                                    <MessageCircle className="w-3 h-3 mr-1" />
                                    {outOfStock ? 'Agotado' : 'De contado'}
                                </Button>
                            </div>
                            <Button
                                size="sm"
                                onClick={() => onView(product)}
                                className="w-full rounded-full text-xs"
                            >
                                Ver Detalles
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

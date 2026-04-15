'use client';

import { useEffect, useState } from 'react';
import { Product } from '@/core/entities/Product';
import ProductCard from './ProductCard';
import { Zap } from 'lucide-react';

interface Props {
    customerUUID: string | null;
    allProducts: Product[];
    onWhatsApp: (product: Product, opcion: 'financiado' | 'de contado') => void;
    onView: (product: Product) => void;
}

export default function PersonalizedRecommendations({ customerUUID, allProducts, onWhatsApp, onView }: Props) {
    const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!customerUUID || allProducts.length === 0) {
            setLoading(false);
            return;
        }

        const fetchRecommendations = async () => {
            try {
                const res = await fetch(`/api/tracking/recommendations?uuid=${customerUUID}`);
                if (!res.ok) throw new Error('Failed to fetch');
                const data = await res.json();
                
                if (data.productIds && data.productIds.length > 0) {
                    // Match returned ID strings with actual Product objects
                    const recommended = data.productIds
                        .map((id: string) => allProducts.find(p => p.id === id))
                        .filter(Boolean) as Product[]; // remove undefined
                    
                    setRecommendedProducts(recommended);
                }
            } catch (error) {
                // Silently fail if something goes wrong, don't break the catalog
                console.error('Failed to load recommendations');
            } finally {
                setLoading(false);
            }
        };

        fetchRecommendations();
    }, [customerUUID, allProducts]);

    // If nothing to recommend, don't show the section at all
    if (loading || recommendedProducts.length === 0) return null;

    return (
        <section className="mt-8 mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-2 mb-6">
                <div className="bg-yellow-100 p-2 rounded-full">
                    <Zap className="w-5 h-5 text-yellow-600 fill-yellow-600 animate-pulse" />
                </div>
                <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                    Retomemos donde lo dejaste
                </h2>
            </div>
            
            <div className="bg-gradient-to-br from-indigo-50 via-white to-blue-50/30 rounded-3xl p-6 border border-indigo-100/50 shadow-sm">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {recommendedProducts.map((product) => (
                        <div key={`rec-${product.id}`} className="transform transition duration-300 hover:-translate-y-1">
                            <ProductCard
                                product={product}
                                onWhatsApp={onWhatsApp}
                                onView={onView}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

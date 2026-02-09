'use client';

import { useEffect, useState, use } from 'react';
import { Product } from '@/core/entities/Product';
import { Brand } from '@/core/entities/Brand';
import { Button } from '@/components/ui/Button';
import { useSearchParams } from 'next/navigation';
import { MessageCircle, ArrowLeft, ShieldCheck, Truck, CreditCard } from 'lucide-react';
import Link from 'next/link';

export default function SingleProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const searchParams = useSearchParams();

    const [product, setProduct] = useState<Product | undefined>(undefined);
    const [loading, setLoading] = useState(true);

    // Share parameters
    const whatsapp = searchParams.get('wa') || '573166541275';
    const advisor = searchParams.get('adv') || '';
    const showPrice = searchParams.get('sp') === '1';

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await fetch(`/api/products/${id}`);
                const data = await res.json();
                setProduct(data);
            } catch (error) {
                console.error("Error fetching product", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const handleContact = () => {
        const message = `Hola${advisor ? ' ' + advisor : ''}, vi este celular en el catálogo y me interesa: ${product?.name}.`;
        window.open(`https://wa.me/${whatsapp}?text=${encodeURIComponent(message)}`, '_blank');
    };

    if (loading) return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
    );

    if (!product) return (
        <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
            <h1 className="text-2xl font-bold text-gray-800">Producto no encontrado</h1>
            <Link href="/" className="mt-4 text-blue-600 hover:underline">Volver al catálogo</Link>
        </div>
    );

    const brandName = typeof product.brand === 'object' ? (product.brand as any).name : 'Celular';

    return (
        <div className="min-h-screen bg-gray-50 pb-12">
            {/* Header / Nav */}
            <div className="bg-white border-b sticky top-0 z-10">
                <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                        <span className="font-medium">Catálogo</span>
                    </Link>
                    <div className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-wider">
                        Oferta Recomendada
                    </div>
                </div>
            </div>

            <main className="max-w-6xl mx-auto px-4 py-8">
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 flex flex-col md:flex-row">
                    {/* Image Section */}
                    <div className="w-full md:w-1/2 bg-gray-50 p-8 flex items-center justify-center">
                        <img
                            src={product.imageUrl || '/placeholder.png'}
                            alt={product.name}
                            className="max-h-[70vh] object-contain drop-shadow-2xl"
                        />
                    </div>

                    {/* Info Section */}
                    <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col">
                        <div className="flex-1">
                            <span className="inline-block px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-black uppercase tracking-widest mb-4">
                                {brandName}
                            </span>
                            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-4">
                                {product.name}
                            </h1>

                            {showPrice ? (
                                <div className="mb-8">
                                    <p className="text-sm text-gray-500 font-medium mb-1">Precio Especial de Contado</p>
                                    <p className="text-4xl font-black text-blue-600 tracking-tight">
                                        ${product.price.toLocaleString()}
                                    </p>
                                </div>
                            ) : (
                                <div className="mb-8 p-4 bg-orange-50 border border-orange-100 rounded-2xl">
                                    <p className="text-orange-800 font-bold">¡Financiación disponible!</p>
                                    <p className="text-sm text-orange-700">Consulta el precio y las cuotas personalizadas con un asesor.</p>
                                </div>
                            )}

                            <div className="prose prose-slate mb-8 h-32 overflow-y-auto pr-4 scrollbar-thin">
                                <h3 className="text-sm font-bold text-gray-900 uppercase mb-2">Sobre este equipo</h3>
                                <p className="text-gray-600 leading-relaxed">{product.description}</p>
                            </div>

                            {product.specs && (
                                <div className="grid grid-cols-2 gap-3 mb-8">
                                    <SpecBox label="RAM" value={product.specs.ram} />
                                    <SpecBox label="Almacenamiento" value={product.specs.storage} />
                                    <SpecBox label="Pantalla" value={product.specs.screen} />
                                    <SpecBox label="Batería" value={product.specs.battery} />
                                </div>
                            )}

                            <div className="space-y-4 border-t pt-8">
                                <div className="flex items-center gap-3 text-sm text-gray-600">
                                    <ShieldCheck className="w-5 h-5 text-green-500" />
                                    <span>Garantía oficial incluida</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-600">
                                    <Truck className="w-5 h-5 text-green-500" />
                                    <span>Entrega inmediata disponible</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-600">
                                    <CreditCard className="w-5 h-5 text-green-500" />
                                    <span>Recibimos todos los medios de pago</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-12">
                            <Button
                                className="w-full py-8 text-xl font-bold bg-green-600 hover:bg-green-700 shadow-lg shadow-green-200 gap-3 group transition-all"
                                onClick={handleContact}
                            >
                                <MessageCircle className="w-7 h-7 group-hover:scale-110 transition-transform" />
                                Hablar con {advisor || 'un asesor'}
                            </Button>
                            <p className="text-center text-xs text-gray-400 mt-4 leading-tight">
                                Al hacer clic serás redirigido a WhatsApp para concretar tu compra con {advisor || 'nuestro equipo'}.
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

function SpecBox({ label, value }: { label: string, value?: string }) {
    if (!value) return null;
    return (
        <div className="bg-white border border-gray-100 p-3 rounded-xl shadow-sm">
            <p className="text-[10px] font-bold text-gray-400 uppercase">{label}</p>
            <p className="font-bold text-gray-900 text-sm">{value}</p>
        </div>
    );
}

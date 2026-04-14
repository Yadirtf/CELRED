import { Product } from '@/core/entities/Product';
import { Brand } from '@/core/entities/Brand';
import { Button } from '@/components/ui/Button';
import { useAdvisor } from '@/hooks/useAdvisor';
import { X, MessageCircle } from 'lucide-react';

interface ProductDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    product: Product | undefined;
}

export default function ProductDetailsModal({ isOpen, onClose, product }: ProductDetailsModalProps) {
    const { assignedWhatsApp } = useAdvisor();
    if (!isOpen || !product) return null;

    const brandName = typeof product.brand === 'object' && product.brand !== null
        ? (product.brand as Brand).name
        : 'Unknown Brand';

    const handleWhatsAppClick = (opcion: 'financiado' | 'de contado') => {
        if (!assignedWhatsApp) {
            alert("No hay asesores disponibles en este momento.");
            return;
        }

        let cleanedWa = assignedWhatsApp.replace(/\D/g, '');
        if (cleanedWa.length === 10) cleanedWa = `57${cleanedWa}`;

        const message = `Hola, quiero consultar por el ${brandName} ${product.name}. Lo quiero ${opcion}.`;
        window.open(`https://wa.me/${cleanedWa}?text=${encodeURIComponent(message)}`, '_blank');
    };

    return (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col md:flex-row">
                {/* Close Button Mobile */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 md:hidden z-10 p-2 bg-white/80 backdrop-blur-md rounded-full shadow-sm"
                >
                    <X className="w-6 h-6 text-gray-800" />
                </button>

                {/* Left: Image */}
                <div className="w-full md:w-1/2 bg-[#F8F8FA] flex items-center justify-center p-8 relative">
                    <img
                        src={product.imageUrl || '/placeholder.png'}
                        alt={product.name}
                        className="max-h-[60vh] object-contain drop-shadow-xl"
                    />
                </div>

                {/* Right: Details */}
                <div className="w-full md:w-1/2 p-8 overflow-y-auto bg-white relative">
                    <button
                        onClick={onClose}
                        className="hidden md:block absolute top-6 right-6 text-gray-400 hover:text-gray-900 transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>

                    <div className="space-y-6">
                        <div>
                            <div className="flex items-center gap-3 mb-3">
                                <span className="inline-block px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-bold tracking-wide uppercase border border-gray-200">
                                    {brandName}
                                </span>
                                {product.stock === 0 && (
                                    <span className="inline-block px-3 py-1 bg-red-50 text-red-600 rounded-full text-xs font-bold tracking-wide uppercase border border-red-100">
                                        Agotado
                                    </span>
                                )}
                            </div>
                            <h2 className="text-3xl font-black text-gray-900 tracking-tight leading-tight">{product.name}</h2>
                            <p className="text-lg font-bold text-orange-600 mt-2">
                                Financiación Disponible - Consulte con un asesor
                            </p>
                        </div>

                        <div className="prose prose-sm text-gray-600">
                            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-2">Descripción</h3>
                            <p>{product.description}</p>
                        </div>

                        {product.specs && (
                            <div>
                                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3">Especificaciones Técnicas</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <SpecItem label="Procesador" value={product.specs.processor} />
                                    <SpecItem label="RAM" value={product.specs.ram} />
                                    <SpecItem label="Almacenamiento" value={product.specs.storage} />
                                    <SpecItem label="Pantalla" value={product.specs.screen} />
                                    <SpecItem label="Batería" value={product.specs.battery} />
                                    <SpecItem label="Cámara" value={product.specs.camera} />
                                </div>
                            </div>
                        )}

                        <div className="pt-6 mt-auto space-y-3">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                                <Button
                                    className={`w-full py-6 text-sm sm:text-base gap-2 ${product.stock === 0 ? 'bg-gray-200 text-gray-400 cursor-not-allowed hover:bg-gray-200' : 'bg-green-600 hover:bg-green-700 shadow-lg shadow-green-200'}`}
                                    onClick={() => handleWhatsAppClick('financiado')}
                                    disabled={product.stock === 0}
                                >
                                    <MessageCircle className="w-5 h-5 shrink-0" />
                                    {product.stock === 0 ? 'Agotado' : 'Lo quiero financiado'}
                                </Button>
                                <Button
                                    className={`w-full py-6 text-sm sm:text-base gap-2 ${product.stock === 0 ? 'bg-gray-200 text-gray-400 cursor-not-allowed hover:bg-gray-200' : 'bg-green-600 hover:bg-green-700 shadow-lg shadow-green-200'}`}
                                    onClick={() => handleWhatsAppClick('de contado')}
                                    disabled={product.stock === 0}
                                >
                                    <MessageCircle className="w-5 h-5 shrink-0" />
                                    {product.stock === 0 ? 'Agotado' : 'Lo quiero de contado'}
                                </Button>
                            </div>
                            <Button variant="ghost" className="w-full py-4 text-gray-500 hover:text-gray-900 hover:bg-gray-50" onClick={onClose}>
                                Cerrar Ventana
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function SpecItem({ label, value }: { label: string, value?: string }) {
    if (!value) return null;
    return (
        <div className="bg-gray-50 p-3 rounded-xl border border-gray-100/50">
            <span className="block text-xs text-gray-500 font-bold mb-1 uppercase tracking-wider">{label}</span>
            <span className="block text-sm font-medium text-gray-900 truncate" title={value}>{value}</span>
        </div>
    );
}

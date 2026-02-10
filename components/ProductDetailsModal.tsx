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

    const handleWhatsAppClick = () => {
        if (!assignedWhatsApp) {
            alert("No hay asesores disponibles en este momento.");
            return;
        }
        const message = `Hola, quiero consultar por el ${brandName} ${product.name}.`;
        window.open(`https://wa.me/${assignedWhatsApp}?text=${encodeURIComponent(message)}`, '_blank');
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col md:flex-row">
                {/* Close Button Mobile */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 md:hidden z-10 p-2 bg-white/80 rounded-full"
                >
                    <X className="w-6 h-6 text-gray-500" />
                </button>

                {/* Left: Image */}
                <div className="w-full md:w-1/2 bg-gray-50 flex items-center justify-center p-8 relative">
                    <img
                        src={product.imageUrl || '/placeholder.png'}
                        alt={product.name}
                        className="max-h-[60vh] object-contain drop-shadow-lg"
                    />
                </div>

                {/* Right: Details */}
                <div className="w-full md:w-1/2 p-8 overflow-y-auto bg-white relative">
                    <button
                        onClick={onClose}
                        className="hidden md:block absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>

                    <div className="space-y-6">
                        <div>
                            <div className="flex items-center gap-3 mb-3">
                                <span className="inline-block px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold tracking-wide uppercase">
                                    {brandName}
                                </span>
                                {product.stock === 0 && (
                                    <span className="inline-block px-3 py-1 bg-red-100 text-red-600 rounded-full text-xs font-bold tracking-wide uppercase">
                                        Agotado
                                    </span>
                                )}
                            </div>
                            <h2 className="text-3xl font-bold text-gray-900 leading-tight">{product.name}</h2>
                            <p className="text-lg font-semibold text-orange-600 mt-2">
                                Financiación Disponible - Consulte con un asesor
                            </p>
                        </div>

                        <div className="prose prose-sm text-gray-600">
                            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-2">Descripción</h3>
                            <p>{product.description}</p>
                        </div>

                        {product.specs && (
                            <div>
                                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">Especificaciones Técnicas</h3>
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
                            <Button
                                className={`w-full py-6 text-lg gap-2 ${product.stock === 0 ? 'bg-gray-200 text-gray-400 cursor-not-allowed hover:bg-gray-200' : 'bg-green-600 hover:bg-green-700'}`}
                                onClick={handleWhatsAppClick}
                                disabled={product.stock === 0}
                            >
                                <MessageCircle className="w-6 h-6" />
                                {product.stock === 0 ? 'Producto Agotado' : 'Consultar por WhatsApp'}
                            </Button>
                            <Button variant="ghost" className="w-full py-4" onClick={onClose}>
                                Cerrar
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
        <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
            <span className="block text-xs text-gray-500 font-medium mb-1">{label}</span>
            <span className="block text-sm font-semibold text-gray-900 truncate" title={value}>{value}</span>
        </div>
    );
}

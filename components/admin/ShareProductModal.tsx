'use client';

import { useState, useEffect } from 'react';
import { Product } from '@/core/entities/Product';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { X, Copy, Share2, Check } from 'lucide-react';

interface ShareProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    product: Product | undefined;
}

export default function ShareProductModal({ isOpen, onClose, product }: ShareProductModalProps) {
    const [whatsappNumber, setWhatsappNumber] = useState('');
    const [advisorName, setAdvisorName] = useState('');
    const [showPrice, setShowPrice] = useState(false);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setWhatsappNumber(localStorage.getItem('advisor_wa') || '');
            setAdvisorName(localStorage.getItem('advisor_name') || '');
        }
    }, [isOpen]);

    const savePreferences = (wa: string, name: string) => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('advisor_wa', wa);
            localStorage.setItem('advisor_name', name);
        }
    };

    if (!isOpen || !product) return null;

    const generateLink = () => {
        const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
        const params = new URLSearchParams();
        params.set('wa', whatsappNumber.replace(/\D/g, '') || '573000000000');
        if (advisorName) params.set('adv', advisorName);
        if (showPrice) params.set('sp', '1');

        return `${baseUrl}/product/${product.id}?${params.toString()}`;
    };

    const handleCopy = () => {
        savePreferences(whatsappNumber, advisorName);
        navigator.clipboard.writeText(generateLink());
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleWhatsAppShare = () => {
        savePreferences(whatsappNumber, advisorName);
        const link = generateLink();
        const message = `Hola, te comparto la información de este celular: ${product.name}\n\nPuedes verlo aquí: ${link}`;
        window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
            <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-gray-900">Compartir Producto</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="space-y-4">
                    <div className="p-3 bg-blue-50 rounded-lg flex gap-3 items-center">
                        <img src={product.imageUrl} alt="" className="w-12 h-12 object-cover rounded shadow-sm bg-white" />
                        <div>
                            <p className="font-bold text-sm text-gray-900">{product.name}</p>
                            <p className="text-xs text-gray-500">Genera un link personalizado para tu cliente</p>
                        </div>
                    </div>

                    <Input
                        label="Tu WhatsApp (Ej: 573001234567)"
                        placeholder="Número para recibir consultas"
                        value={whatsappNumber}
                        onChange={(e) => setWhatsappNumber(e.target.value)}
                    />

                    <Input
                        label="Tu Nombre (Opcional)"
                        placeholder="Nombre que verá el cliente"
                        value={advisorName}
                        onChange={(e) => setAdvisorName(e.target.value)}
                    />

                    <div className="flex items-center gap-2 py-2">
                        <input
                            type="checkbox"
                            id="sharePrice"
                            checked={showPrice}
                            onChange={(e) => setShowPrice(e.target.checked)}
                            className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                        />
                        <label htmlFor="sharePrice" className="text-sm font-medium text-gray-700">
                            Incluir Precio en el link
                        </label>
                    </div>

                    <div className="pt-4 space-y-3">
                        <div className="flex gap-2">
                            <Button onClick={handleCopy} variant="secondary" className="flex-1 gap-2">
                                {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                                {copied ? 'Copiado' : 'Copiar Link'}
                            </Button>
                            <Button onClick={handleWhatsAppShare} className="flex-1 gap-2 bg-green-600 hover:bg-green-700">
                                <Share2 className="w-4 h-4" />
                                WhatsApp
                            </Button>
                        </div>
                        <p className="text-[10px] text-gray-400 text-center">
                            El cliente verá una vista dedicada del producto con botón directo a tu WhatsApp.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

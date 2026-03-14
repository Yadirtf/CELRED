'use client';

import { useState, useEffect, useCallback } from 'react';
import { Product } from '@/core/entities/Product';

const LS_WA = 'advisor_wa';
const LS_NAME = 'advisor_name';

export interface UseShareProductReturn {
    whatsappNumber: string;
    setWhatsappNumber: (v: string) => void;
    advisorName: string;
    setAdvisorName: (v: string) => void;
    showPrice: boolean;
    setShowPrice: (v: boolean) => void;
    copied: boolean;
    generatedLink: string;
    handleCopy: () => void;
    handleWhatsAppShare: () => void;
}

export function useShareProduct(product: Product | undefined, isOpen: boolean): UseShareProductReturn {
    const [whatsappNumber, setWhatsappNumber] = useState('');
    const [advisorName, setAdvisorName] = useState('');
    const [showPrice, setShowPrice] = useState(false);
    const [copied, setCopied] = useState(false);

    // Load saved preferences when the modal opens
    useEffect(() => {
        if (isOpen && typeof window !== 'undefined') {
            setWhatsappNumber(localStorage.getItem(LS_WA) || '');
            setAdvisorName(localStorage.getItem(LS_NAME) || '');
        }
    }, [isOpen]);

    const savePreferences = () => {
        if (typeof window === 'undefined') return;
        localStorage.setItem(LS_WA, whatsappNumber);
        localStorage.setItem(LS_NAME, advisorName);
    };

    const buildLink = useCallback((): string => {
        if (!product || typeof window === 'undefined') return '';
        const params = new URLSearchParams();
        params.set('wa', whatsappNumber.replace(/\D/g, '') || '573166541275');
        if (advisorName) params.set('adv', advisorName);
        if (showPrice) params.set('sp', '1');
        return `${window.location.origin}/product/${product.id}?${params.toString()}`;
    }, [product, whatsappNumber, advisorName, showPrice]);

    const generatedLink = buildLink();

    const handleCopy = () => {
        savePreferences();
        navigator.clipboard.writeText(generatedLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleWhatsAppShare = () => {
        if (!product) return;
        savePreferences();
        const msg = `Hola, te comparto la información de este celular: ${product.name}\n\nPuedes verlo aquí: ${generatedLink}`;
        window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
    };

    return {
        whatsappNumber,
        setWhatsappNumber,
        advisorName,
        setAdvisorName,
        showPrice,
        setShowPrice,
        copied,
        generatedLink,
        handleCopy,
        handleWhatsAppShare,
    };
}

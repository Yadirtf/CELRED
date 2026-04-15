'use client';

import { useState, useEffect } from 'react';
import { MapPin, X, Loader2 } from 'lucide-react';

interface Props {
    onLocationGranted: (geo: { city: string, region: string, country: string, device?: string }) => void;
}

export default function LocationConsentBanner({ onLocationGranted }: Props) {
    const [isVisible, setIsVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Only show if not previously handled
        const consent = localStorage.getItem('catalog_location_consent');
        
        // Delay showing the banner so it doesn't interrupt the immediate first impression
        if (!consent) {
            const timer = setTimeout(() => setIsVisible(true), 3000);
            return () => clearTimeout(timer);
        }
        
        // If they already granted it in the past, get location silently
        if (consent === 'granted') {
            requestLocationSilently();
        }
    }, []);

    const requestLocationSilently = () => {
        if (!('geolocation' in navigator)) return;
        
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                await reverseGeocode(latitude, longitude);
            },
            () => { /* silent fail */ },
            { timeout: 10000, enableHighAccuracy: false }
        );
    };

    const reverseGeocode = async (lat: number, lon: number) => {
        try {
            // Using OpenStreetMap's free Nominatim API
            // Always include email in User-Agent/headers or as a query param as required by their Terms of Use,
            // but for client-side we just append format=json. 
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&accept-language=es`);
            if (!res.ok) throw new Error('API error');
            
            const data = await res.json();
            
            // Extract best matching city
            const city = data.address.city || data.address.town || data.address.village || data.address.municipality || 'Desconocido';
            const region = data.address.state || data.address.region || 'Desconocido';
            const country = data.address.country || 'Desconocido';

            onLocationGranted({ city, region, country, device: 'Mobile' }); // Device isn't fully accurate here, relying on server for device anyway
        } catch (err) {
            setError('Error obteniendo ubicación. Usa tu IP en su lugar.');
            setTimeout(() => setIsVisible(false), 3000);
        }
    };

    const handleAllow = () => {
        if (!('geolocation' in navigator)) {
            setError('Tu navegador no soporta geolocalización');
            return;
        }

        setIsLoading(true);
        setError(null);

        // Prompt the user with the actual browser permission
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                localStorage.setItem('catalog_location_consent', 'granted');
                const { latitude, longitude } = position.coords;
                await reverseGeocode(latitude, longitude);
                setIsVisible(false);
                setIsLoading(false);
            },
            (err) => {
                localStorage.setItem('catalog_location_consent', 'denied');
                setError('Permiso denegado. Se usará la aproximada.');
                setIsLoading(false);
                setTimeout(() => setIsVisible(false), 3000);
            },
            { timeout: 10000, enableHighAccuracy: true }
        );
    };

    const handleDismiss = () => {
        localStorage.setItem('catalog_location_consent', 'dismissed');
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-4 right-4 max-w-sm w-full bg-white rounded-2xl shadow-2xl border border-gray-100 p-5 z-50 animate-in slide-in-from-bottom-5">
            <button 
                onClick={handleDismiss}
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 p-1 transition-colors"
                aria-label="Cerrar"
            >
                <X className="w-4 h-4" />
            </button>
            
            <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                    <h3 className="font-bold text-gray-800 text-sm mb-1">
                        Mejora tu experiencia
                    </h3>
                    <p className="text-xs text-gray-500 mb-4 leading-relaxed">
                        Comparte tu ubicación exacta de forma segura para recibir recomendaciones personalizadas y conocer la disponibilidad de entregas en tu zona.
                    </p>
                    
                    {error ? (
                        <p className="text-xs text-red-500 font-medium mb-3">{error}</p>
                    ) : null}

                    <div className="flex gap-2">
                        <button
                            onClick={handleAllow}
                            disabled={isLoading}
                            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2 px-4 rounded-lg flex-1 transition-colors flex items-center justify-center gap-2"
                        >
                            {isLoading && <Loader2 className="w-3 h-3 animate-spin" />}
                            Compartir Ubicación
                        </button>
                        <button
                            onClick={handleDismiss}
                            disabled={isLoading}
                            className="bg-gray-50 hover:bg-gray-100 text-gray-600 font-medium text-xs py-2 px-4 rounded-lg transition-colors"
                        >
                            No ahora
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

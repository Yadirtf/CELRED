'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { FileDown, Loader2 } from 'lucide-react';
import { Product } from '@/core/entities/Product';
import { Brand } from '@/core/entities/Brand';

// Import react-pdf components dynamically to avoid SSR issues
import { pdf } from '@react-pdf/renderer';
import { CatalogPdfDocument } from './CatalogPdfDocument';

interface DownloadCatalogButtonProps {
    products: Product[];
    brands: Brand[];
}

export default function DownloadCatalogButton({ products, brands }: DownloadCatalogButtonProps) {
    const [isGenerating, setIsGenerating] = useState(false);

    const handleDownloadPdf = async () => {
        if (products.length === 0) {
            alert('No hay productos para exportar.');
            return;
        }

        try {
            setIsGenerating(true);
            
            // Generate the PDF blob
            const blob = await pdf(
                <CatalogPdfDocument products={products} brands={brands} />
            ).toBlob();
            
            // Create a download link
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `Catalogo_Celulares_${new Date().toISOString().split('T')[0]}.pdf`;
            
            // Trigger download
            document.body.appendChild(link);
            link.click();
            
            // Cleanup
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error generating PDF:', error);
            alert('Hubo un error al generar el catálogo en PDF.');
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <Button 
            onClick={handleDownloadPdf} 
            variant="secondary" 
            className="gap-2 bg-red-50 text-red-700 hover:bg-red-100 hover:text-red-800 border-red-200"
            disabled={isGenerating || products.length === 0}
        >
            {isGenerating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
                <FileDown className="w-4 h-4" />
            )}
            {isGenerating ? 'Generando PDF...' : 'Catálogo PDF'}
        </Button>
    );
}

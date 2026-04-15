'use client';

import { Suspense, useState } from 'react';
import { Product } from '@/core/entities/Product';
import ProductDetailsModal from '@/components/ProductDetailsModal';
import ProductCard from '@/components/catalog/ProductCard';
import HeroSection from '@/components/catalog/HeroSection';
import EmptyState from '@/components/ui/EmptyState';
import CatalogFilter from '@/components/catalog/CatalogFilter';
import CatalogSkeleton from '@/components/catalog/CatalogSkeleton';
import LocationConsentBanner from '@/components/catalog/LocationConsentBanner';
import PersonalizedRecommendations from '@/components/catalog/PersonalizedRecommendations';
import { useAdvisor } from '@/hooks/useAdvisor';
import { useProductCatalog } from '@/hooks/useProductCatalog';
import { useCatalogPresence } from '@/hooks/useCatalogPresence';
import { useCustomerIdentity } from '@/hooks/useCustomerIdentity';

function CatalogContent() {
  const { assignedWhatsApp, isLoadingAdvisor } = useAdvisor();
  const {
    products,
    brands,
    loading,
    filteredProducts,
    selectedBrand,
    setSelectedBrand,
    searchTerm,
    setSearchTerm,
  } = useProductCatalog();

  // Persistent Identity
  const { customerUUID } = useCustomerIdentity();
  
  // Register this tab as an active catalog viewer
  const { sendExactLocation } = useCatalogPresence(customerUUID);

  const trackInteraction = (eventType: string, product: Product, preference?: string) => {
    if (!customerUUID) return;
    fetch('/api/tracking/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerUUID,
        eventType,
        productId: product.id,
        productName: product.name,
        preference
      })
    }).catch(() => {});
  };

  const [viewingProduct, setViewingProduct] = useState<Product | undefined>(undefined);
  const [isViewOpen, setIsViewOpen] = useState(false);

  const handleWhatsAppClick = (product: Product, opcion: 'financiado' | 'de contado') => {
    // 1. Log the intent directly to the tracking history
    trackInteraction('WHATSAPP_START', product, opcion === 'financiado' ? 'FINANCIADO' : 'CONTADO');

    if (!assignedWhatsApp) {
      if (!isLoadingAdvisor) {
        alert('No hay asesores disponibles en este momento. Por favor, intenta más tarde.');
      }
      return;
    }
    const brandName = typeof product.brand === 'object' ? (product.brand as any).name : 'Celular';
    const message = `Hola, quiero información sobre el ${brandName} ${product.name}. Lo quiero ${opcion}.`;
    
    let cleanedWa = assignedWhatsApp.replace(/\D/g, '');
    if (cleanedWa.length === 10) cleanedWa = `57${cleanedWa}`;

    const url = `https://wa.me/${cleanedWa}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const handleView = (product: Product) => {
    // Log the product view
    trackInteraction('PRODUCT_VIEW', product);
    
    setViewingProduct(product);
    setIsViewOpen(true);
  };

  if (loading) return <CatalogSkeleton />;

  const filterProps = {
    searchTerm,
    onSearchChange: setSearchTerm,
    selectedBrand,
    onBrandChange: setSelectedBrand,
    brands,
    products,
    totalFiltered: filteredProducts.length,
  };

  return (
    <div className="space-y-6">
      <HeroSection />

      <PersonalizedRecommendations 
        customerUUID={customerUUID} 
        allProducts={products} 
        onWhatsApp={handleWhatsAppClick} 
        onView={handleView} 
      />

      <div className="flex flex-col lg:flex-row gap-8">
        <CatalogFilter {...filterProps} />

        {/* Product Grid */}
        <div className="flex-1 min-w-0 space-y-6">
          {/* Desktop header */}
          <div className="hidden lg:flex justify-between items-center">
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">
              {selectedBrand === 'all'
                ? 'Catálogo de Dispositivos'
                : `Colección ${brands.find((b) => b.id === selectedBrand)?.name ?? ''}`}
            </h2>
            <span className="text-sm text-gray-600 bg-white shadow-sm border border-gray-100 px-4 py-1.5 rounded-full font-bold">
              {filteredProducts.length} encontrados
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onWhatsApp={handleWhatsAppClick}
                onView={handleView}
              />
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <EmptyState
              message="No se encontraron productos."
              hint="Intenta con otra marca o limpia los filtros."
            />
          )}
        </div>
      </div>

      <ProductDetailsModal
        isOpen={isViewOpen}
        onClose={() => setIsViewOpen(false)}
        product={viewingProduct}
      />

      <LocationConsentBanner onLocationGranted={sendExactLocation} />
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<CatalogSkeleton />}>
      <CatalogContent />
    </Suspense>
  );
}

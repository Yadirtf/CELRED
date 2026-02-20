'use client';

import { Suspense, useState } from 'react';
import { Product } from '@/core/entities/Product';
import ProductDetailsModal from '@/components/ProductDetailsModal';
import ProductCard from '@/components/catalog/ProductCard';
import HeroSection from '@/components/catalog/HeroSection';
import EmptyState from '@/components/ui/EmptyState';
import CatalogFilter from '@/components/catalog/CatalogFilter';
import CatalogSkeleton from '@/components/catalog/CatalogSkeleton';
import { useAdvisor } from '@/hooks/useAdvisor';
import { useProductCatalog } from '@/hooks/useProductCatalog';

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

  const [viewingProduct, setViewingProduct] = useState<Product | undefined>(undefined);
  const [isViewOpen, setIsViewOpen] = useState(false);

  const handleWhatsAppClick = (product: Product) => {
    if (!assignedWhatsApp) {
      if (!isLoadingAdvisor) {
        alert('No hay asesores disponibles en este momento. Por favor, intenta más tarde.');
      }
      return;
    }
    const brandName = typeof product.brand === 'object' ? (product.brand as any).name : 'Celular';
    const message = `Hola, quiero información sobre el ${brandName} ${product.name}.`;
    const url = `https://wa.me/${assignedWhatsApp}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const handleView = (product: Product) => {
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

      <div className="flex flex-col lg:flex-row gap-8">
        <CatalogFilter {...filterProps} />

        {/* Product Grid */}
        <div className="flex-1 min-w-0 space-y-6">
          {/* Desktop header */}
          <div className="hidden lg:flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-800">
              {selectedBrand === 'all'
                ? 'Todos los productos'
                : `Productos ${brands.find((b) => b.id === selectedBrand)?.name ?? ''}`}
            </h2>
            <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full font-bold">
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

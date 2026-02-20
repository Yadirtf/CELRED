'use client';

import { Suspense } from 'react';
import { Brand } from '@/core/entities/Brand';
import ProductDetailsModal from '@/components/ProductDetailsModal';
import ProductFilter from '@/components/ProductFilter';
import ProductCard from '@/components/catalog/ProductCard';
import HeroSection from '@/components/catalog/HeroSection';
import EmptyState from '@/components/ui/EmptyState';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useAdvisor } from '@/hooks/useAdvisor';
import { useProductCatalog } from '@/hooks/useProductCatalog';
import { useState } from 'react';
import { Product } from '@/core/entities/Product';

function CatalogContent() {
  const { assignedWhatsApp, isLoadingAdvisor } = useAdvisor();
  const {
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

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-8">
      <HeroSection />

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-64 flex-shrink-0">
          <ProductFilter
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            selectedBrand={selectedBrand}
            onBrandChange={setSelectedBrand}
            brands={brands}
            variant="catalog"
          />
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">
              {selectedBrand === 'all'
                ? 'Todos los productos'
                : `Productos ${brands.find((b) => b.id === selectedBrand)?.name}`}
            </h2>
            <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
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

          {filteredProducts.length === 0 && <EmptyState />}
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
    <Suspense fallback={<LoadingSpinner />}>
      <CatalogContent />
    </Suspense>
  );
}

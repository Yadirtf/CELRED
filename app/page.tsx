'use client';

import { useEffect, useState, Suspense } from 'react';
import { Product } from '@/core/entities/Product';
import { Brand } from '@/core/entities/Brand';
import { Button } from '@/components/ui/Button';
import ProductDetailsModal from '@/components/ProductDetailsModal';
import { Search, MessageCircle } from 'lucide-react';
import ProductFilter from '@/components/ProductFilter';
import { useAdvisor } from '@/hooks/useAdvisor';

function CatalogContent() {
  const { assignedWhatsApp, isLoadingAdvisor } = useAdvisor();
  const [products, setProducts] = useState<Product[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Modal
  const [viewingProduct, setViewingProduct] = useState<Product | undefined>(undefined);
  const [isViewOpen, setIsViewOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, brandsRes] = await Promise.all([
          fetch('/api/products'),
          fetch('/api/brands')
        ]);

        const productsData = await productsRes.json();
        const brandsData = await brandsRes.json();

        setProducts(Array.isArray(productsData) ? productsData : []);
        setBrands(Array.isArray(brandsData) ? brandsData : []);
      } catch (error) {
        console.error("Failed to fetch catalog data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredProducts = products.filter(p => {
    // Brand Filter
    const brandId = typeof p.brand === 'object' && p.brand !== null
      ? (p.brand as any)._id || (p.brand as Brand).id
      : p.brand;
    const matchesBrand = selectedBrand === 'all' || brandId === selectedBrand;

    // Search Filter
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesBrand && matchesSearch;
  });

  const handleWhatsAppClick = (product: Product) => {
    if (!assignedWhatsApp) {
      if (!isLoadingAdvisor) {
        alert("No hay asesores disponibles en este momento. Por favor, intenta más tarde.");
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

  if (loading) return (
    <div className="flex justify-center items-center min-h-[80vh]">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="text-center space-y-4 py-16 bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl shadow-xl border border-slate-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1556656793-02715d8dd6f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')] opacity-10 bg-cover bg-center"></div>
        <div className="relative z-10 px-4">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-4">
            Catálogo de Celulares
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto font-light">
            Explora nuestra selección premium de dispositivos móviles con la tecnología más avanzada del mercado.
          </p>
        </div>
      </section>

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
              {selectedBrand === 'all' ? 'Todos los productos' : `Productos ${brands.find(b => b.id === selectedBrand)?.name}`}
            </h2>
            <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">{filteredProducts.length} encontrados</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <div key={product.id} className="group relative">
                {/* Animated SVG Border - Sharp moving line */}
                <div className="absolute -inset-[2px] z-0 rounded-2xl overflow-visible pointer-events-none">
                  <svg className="w-full h-full overflow-visible" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <linearGradient id={`border-grad-${product.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#ef4444" />
                        <stop offset="50%" stopColor="#ff6347" />
                        <stop offset="100%" stopColor="#ef4444" />
                      </linearGradient>
                      <filter id={`glow-${product.id}`}>
                        <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
                        <feMerge>
                          <feMergeNode in="coloredBlur" />
                          <feMergeNode in="SourceGraphic" />
                        </feMerge>
                      </filter>
                    </defs>
                    <rect
                      x="1" y="1"
                      width="calc(100% - 2px)"
                      height="calc(100% - 2px)"
                      rx="15"
                      fill="none"
                      stroke={`url(#border-grad-${product.id})`}
                      strokeWidth="3"
                      filter={`url(#glow-${product.id})`}
                      className="animate-border-travel opacity-80"
                      pathLength="100"
                    />
                  </svg>
                </div>

                {/* Card Content */}
                <div className="relative h-full bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100/50 overflow-hidden flex flex-col z-10 m-[1px]">
                  <div className="aspect-[4/5] relative overflow-hidden bg-gray-50 p-6 flex items-center justify-center">
                    <img
                      src={product.imageUrl || '/placeholder.png'}
                      alt={product.name}
                      className={`w-full h-full object-contain group-hover:scale-110 transition-transform duration-500 drop-shadow-sm ${product.stock === 0 ? 'opacity-40 grayscale-[0.5]' : ''}`}
                    />
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-gray-700 shadow-sm border border-gray-100 uppercase tracking-wider">
                      {typeof product.brand === 'object' ? (product.brand as any).name : 'Celular'}
                    </div>
                    {product.stock === 0 && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="bg-red-600 text-white px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-widest shadow-lg transform -rotate-12">
                          Agotado
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-5 space-y-3 flex-1 flex flex-col">
                    <div>
                      <h2 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                        {product.name}
                      </h2>
                      <p className="text-sm text-gray-500 line-clamp-2 mt-1 h-10">
                        {product.description}
                      </p>
                    </div>

                    <div className="mt-auto pt-4 flex flex-col gap-3 border-t border-gray-50">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-orange-600">
                          Financiación Disponible
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleWhatsAppClick(product)}
                          disabled={product.stock === 0}
                          className={`flex-1 rounded-full ${product.stock === 0 ? 'bg-gray-100 text-gray-400 border-gray-200' : 'bg-green-50 text-green-600 hover:bg-green-100 border-green-100'}`}
                        >
                          <MessageCircle className="w-4 h-4 mr-2" />
                          {product.stock === 0 ? 'Sin Stock' : 'WhatsApp'}
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleView(product)}
                          className="flex-1 rounded-full text-xs"
                        >
                          Ver Detalles
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
              <Search className="w-12 h-12 text-gray-300 mb-4" />
              <p className="text-xl text-gray-500 font-medium">No se encontraron productos.</p>
              <p className="text-gray-400 text-sm mt-1">Intenta seleccionar otra marca o filtro.</p>
            </div>
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
    <Suspense fallback={
      <div className="flex justify-center items-center min-h-[80vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
      </div>
    }>
      <CatalogContent />
    </Suspense>
  );
}

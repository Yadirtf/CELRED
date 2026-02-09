'use client';

import { useEffect, useState } from 'react';
import { Product } from '@/core/entities/Product';
import { Brand } from '@/core/entities/Brand';
import { Button } from '@/components/ui/Button';
import ProductDetailsModal from '@/components/ProductDetailsModal';
import { Search } from 'lucide-react';
import ProductFilter from '@/components/ProductFilter';

export default function Home() {
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
              <div key={product.id} className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden group flex flex-col">
                <div className="aspect-[4/5] relative overflow-hidden bg-gray-50 p-6 flex items-center justify-center">
                  <img
                    src={product.imageUrl || '/placeholder.png'}
                    alt={product.name}
                    className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500 drop-shadow-sm"
                  />
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-gray-700 shadow-sm border border-gray-100 uppercase tracking-wider">
                    {typeof product.brand === 'object' ? (product.brand as any).name : 'Celular'}
                  </div>
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

                  <div className="mt-auto pt-4 flex items-center justify-between border-t border-gray-50">
                    <span className="text-2xl font-bold text-blue-600">
                      ${product.price ? product.price.toLocaleString() : '0'}
                    </span>
                    <Button
                      size="sm"
                      onClick={() => handleView(product)}
                      className="rounded-full px-6"
                    >
                      Ver Detalles
                    </Button>
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

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Plus, Download } from 'lucide-react';
import { Product } from '@/core/entities/Product';

import ProductForm from '@/components/admin/ProductForm';
import ProductDetailsModal from '@/components/ProductDetailsModal';
import ProductFilter from '@/components/ProductFilter';
import ShareProductModal from '@/components/admin/ShareProductModal';
import AdminProductCard from '@/components/admin/AdminProductCard';
import { useProductList } from '@/hooks/useProductList';
import { exportProductsToExcel } from '@/lib/exportExcel';
import DownloadCatalogButton from '@/components/pdf/DownloadCatalogButton';

export default function ProductList() {
    const {
        brands,
        loading,
        filteredProducts,
        searchTerm,
        setSearchTerm,
        selectedBrand,
        setSelectedBrand,
        selectedStock,
        setSelectedStock,
        handleDelete,
        handleSell,
        fetchProducts,
    } = useProductList();

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined);
    const [viewingProduct, setViewingProduct] = useState<Product | undefined>(undefined);
    const [isViewOpen, setIsViewOpen] = useState(false);
    const [sharingProduct, setSharingProduct] = useState<Product | undefined>(undefined);
    const [isShareOpen, setIsShareOpen] = useState(false);

    const handleEdit = (product: Product) => {
        setEditingProduct(product);
        setIsFormOpen(true);
    };

    const handleCreate = () => {
        setEditingProduct(undefined);
        setIsFormOpen(true);
    };

    const handleView = (product: Product) => {
        setViewingProduct(product);
        setIsViewOpen(true);
    };

    const handleShare = (product: Product) => {
        setSharingProduct(product);
        setIsShareOpen(true);
    };

    const handleFormSubmit = () => {
        setIsFormOpen(false);
        fetchProducts();
    };

    const handleExportExcel = () => exportProductsToExcel(filteredProducts, brands);

    if (loading) return <div className="text-center py-10">Cargando productos...</div>;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">Inventario de Celulares</h2>
                <div className="flex gap-2">
                    <DownloadCatalogButton products={filteredProducts} brands={brands} />
                    <Button onClick={handleExportExcel} variant="secondary" className="gap-2">
                        <Download className="w-4 h-4" /> Exportar Excel
                    </Button>
                    <Button onClick={handleCreate} className="gap-2">
                        <Plus className="w-4 h-4" /> Nuevo Celular
                    </Button>
                </div>
            </div>

            {/* Filters */}
            <ProductFilter
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                selectedBrand={selectedBrand}
                onBrandChange={setSelectedBrand}
                selectedStock={selectedStock}
                onStockChange={setSelectedStock}
                brands={brands}
                variant="admin"
            />

            {/* Product Form Modal */}
            {isFormOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between mb-4">
                            <h3 className="text-xl font-bold">
                                {editingProduct ? 'Editar Celular' : 'Registrar Celular'}
                            </h3>
                            <button
                                onClick={() => setIsFormOpen(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                ✕
                            </button>
                        </div>
                        <ProductForm
                            initialData={editingProduct}
                            onSuccess={handleFormSubmit}
                            onCancel={() => setIsFormOpen(false)}
                        />
                    </div>
                </div>
            )}

            <ProductDetailsModal
                isOpen={isViewOpen}
                onClose={() => setIsViewOpen(false)}
                product={viewingProduct}
            />

            <ShareProductModal
                isOpen={isShareOpen}
                onClose={() => setIsShareOpen(false)}
                product={sharingProduct}
            />

            {/* Grid View */}
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                {filteredProducts.map((product) => (
                    <AdminProductCard
                        key={product.id}
                        product={product}
                        onSell={handleSell}
                        onShare={handleShare}
                        onView={handleView}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                ))}
            </div>

            {filteredProducts.length === 0 && (
                <div className="px-6 py-16 text-center bg-white rounded-2xl shadow-sm border border-dashed border-gray-300 mt-2">
                    <p className="text-gray-500 font-medium">No se encontraron celulares con los filtros aplicados.</p>
                </div>
            )}
        </div>
    );
}

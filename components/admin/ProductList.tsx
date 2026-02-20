import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Plus, Download } from 'lucide-react';
import { Product } from '@/core/entities/Product';

import ProductForm from '@/components/admin/ProductForm';
import ProductDetailsModal from '@/components/ProductDetailsModal';
import ProductFilter from '@/components/ProductFilter';
import ShareProductModal from '@/components/admin/ShareProductModal';
import ProductTableRow from '@/components/admin/ProductTableRow';
import ProductMobileCard from '@/components/admin/ProductMobileCard';
import { useProductList } from '@/hooks/useProductList';
import { exportProductsToExcel } from '@/lib/exportExcel';

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

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                {/* Desktop View */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50 text-gray-600 text-sm uppercase">
                            <tr>
                                <th className="px-6 py-4 font-medium">Foto</th>
                                <th className="px-6 py-4 font-medium">Nombre</th>
                                <th className="px-6 py-4 font-medium">Precio</th>
                                <th className="px-6 py-4 font-medium">Stock</th>
                                <th className="px-6 py-4 font-medium text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredProducts.map((product) => (
                                <ProductTableRow
                                    key={product.id}
                                    product={product}
                                    onSell={handleSell}
                                    onShare={handleShare}
                                    onView={handleView}
                                    onEdit={handleEdit}
                                    onDelete={handleDelete}
                                />
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile View */}
                <div className="md:hidden divide-y divide-gray-100">
                    {filteredProducts.map((product) => (
                        <ProductMobileCard
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
                    <div className="px-6 py-12 text-center text-gray-500">
                        {/* products from hook is not accessible here, simplify message */}
                        No se encontraron celulares con los filtros aplicados.
                    </div>
                )}
            </div>
        </div>
    );
}

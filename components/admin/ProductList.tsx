import { useState, useEffect } from 'react';
import { Product } from '@/core/entities/Product';
import { Button } from '@/components/ui/Button';
import { Edit, Trash2, Plus, ShoppingBag, Download } from 'lucide-react';

import ProductForm from '@/components/admin/ProductForm';
import ProductDetailsModal from '@/components/ProductDetailsModal';
import { Eye, Share2 } from 'lucide-react';
import ProductFilter from '@/components/ProductFilter';
import ShareProductModal from '@/components/admin/ShareProductModal';
import { Brand } from '@/core/entities/Brand';

export default function ProductList() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined);
    const [viewingProduct, setViewingProduct] = useState<Product | undefined>(undefined);
    const [isViewOpen, setIsViewOpen] = useState(false);

    // Sharing modal
    const [sharingProduct, setSharingProduct] = useState<Product | undefined>(undefined);
    const [isShareOpen, setIsShareOpen] = useState(false);

    // Filter states
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedBrand, setSelectedBrand] = useState('all');
    const [selectedStock, setSelectedStock] = useState('all');
    const [brands, setBrands] = useState<Brand[]>([]);

    const fetchProducts = async () => {
        try {
            const res = await fetch('/api/products');
            const data = await res.json();
            setProducts(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Failed to fetch products', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchBrands = async () => {
        try {
            const res = await fetch('/api/brands');
            const data = await res.json();
            setBrands(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Failed to fetch brands', error);
        }
    };

    useEffect(() => {
        fetchProducts();
        fetchBrands();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm('¿Estás seguro de eliminar este producto?')) return;

        try {
            await fetch(`/api/products/${id}`, { method: 'DELETE' });
            setProducts(products.filter(p => p.id !== id));
        } catch (error) {
            console.error('Failed to delete product', error);
        }
    };

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

    const handleSell = async (product: Product) => {
        const qtyStr = prompt(`¿Cuántas unidades de "${product.name}" se vendieron?`, "1");
        if (!qtyStr) return;

        const quantity = parseInt(qtyStr);
        if (isNaN(quantity) || quantity <= 0) {
            alert("Por favor ingresa un número válido.");
            return;
        }

        if (product.stock < quantity) {
            alert(`No hay suficiente stock. Disponible: ${product.stock}`);
            return;
        }

        // Optimistically update UI
        const newStock = product.stock - quantity;
        const updatedProducts = products.map(p =>
            p.id === product.id ? { ...p, stock: newStock } : p
        );
        setProducts(updatedProducts);

        try {
            const res = await fetch(`/api/products/${product.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ stock: newStock })
            });

            if (!res.ok) throw new Error("Failed to update stock");

            // Allow refresh to sync
            fetchProducts();
        } catch (error) {
            console.error("Error registering sale", error);
            alert("Error al registrar la venta.");
            fetchProducts(); // Revert
        }
    };

    const handleFormSubmit = () => {
        setIsFormOpen(false);
        fetchProducts();
    };

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.description.toLowerCase().includes(searchTerm.toLowerCase());

        const brandId = typeof product.brand === 'object' && product.brand !== null
            ? (product.brand as any)._id || (product.brand as Brand).id
            : product.brand;

        const matchesBrand = selectedBrand === 'all' || brandId === selectedBrand;

        const matchesStock =
            selectedStock === 'all' ||
            (selectedStock === 'gt1' && product.stock > 1) ||
            (selectedStock === 'zero' && product.stock === 0);

        return matchesSearch && matchesBrand && matchesStock;
    });

    const handleExportExcel = async () => {
        try {
            // Dynamically import libraries
            const ExcelJS = (await import('exceljs')).default;
            const { saveAs } = (await import('file-saver'));

            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Inventario');

            // Define Columns with formatting
            worksheet.columns = [
                { header: 'Marca', key: 'marca', width: 20 },
                { header: 'Nombre', key: 'nombre', width: 35 },
                { header: 'Precio', key: 'precio', width: 15 },
                { header: 'Stock', key: 'stock', width: 10 },
            ];

            // Style Header Row
            const headerRow = worksheet.getRow(1);
            headerRow.height = 25;
            headerRow.font = {
                name: 'Arial',
                size: 11,
                bold: true,
                color: { argb: 'FFFFFFFF' }
            };
            headerRow.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FF1F2937' } // Dark gray header
            };
            headerRow.alignment = { vertical: 'middle', horizontal: 'center' };

            // Prepare Data
            const dataToExport = filteredProducts.map(product => {
                let brandName = 'Sin Marca';

                if (typeof product.brand === 'object' && product.brand !== null) {
                    brandName = (product.brand as Brand).name || 'Sin Marca';
                } else if (typeof product.brand === 'string') {
                    const foundBrand = brands.find(b => b.id === product.brand);
                    if (foundBrand) brandName = foundBrand.name;
                } else if (product.brand) {
                    brandName = String(product.brand);
                }

                return {
                    marca: brandName,
                    nombre: product.name,
                    precio: product.price,
                    stock: product.stock
                };
            });

            // Sort by data
            dataToExport.sort((a, b) => a.marca.localeCompare(b.marca));

            // Add Data Rows
            dataToExport.forEach(item => {
                const row = worksheet.addRow(item);

                // Specific cell alignment
                row.getCell('precio').alignment = { vertical: 'middle', horizontal: 'right' };
                row.getCell('stock').alignment = { vertical: 'middle', horizontal: 'center' };

                // Currency format
                row.getCell('precio').numFmt = '"$"#,##0.00';
            });

            // Apply borders to all used cells
            worksheet.eachRow((row, rowNumber) => {
                row.eachCell((cell) => {
                    cell.border = {
                        top: { style: 'thin' },
                        left: { style: 'thin' },
                        bottom: { style: 'thin' },
                        right: { style: 'thin' }
                    };
                    // Default alignment if not set
                    if (!cell.alignment) {
                        cell.alignment = { vertical: 'middle', horizontal: 'left' };
                    }
                });
            });

            // Write File
            const buffer = await workbook.xlsx.writeBuffer();
            const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            saveAs(blob, "Inventario_Celulares_Detallado.xlsx");

        } catch (error) {
            console.error("Error generating Excel:", error);
            alert("No se pudo generar el Excel. Intente nuevamente.");
        }
    };

    if (loading) return <div className="text-center py-10">Cargando productos...</div>;

    return (
        <div className="space-y-6">
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

            {isFormOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between mb-4">
                            <h3 className="text-xl font-bold">{editingProduct ? 'Editar Celular' : 'Registrar Celular'}</h3>
                            <button onClick={() => setIsFormOpen(false)} className="text-gray-500 hover:text-gray-700">✕</button>
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

            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                {/* Desktop Table View */}
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
                                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <img
                                            src={product.imageUrl || '/placeholder.png'}
                                            alt={product.name}
                                            className="w-12 h-12 object-cover rounded-md bg-gray-100"
                                        />
                                    </td>
                                    <td className="px-6 py-4 font-medium text-gray-900">{product.name}</td>
                                    <td className="px-6 py-4 text-blue-600 font-semibold">
                                        ${product.price.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${product.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            {product.stock} un.
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 flex gap-2 justify-end">
                                        <Button
                                            variant="secondary"
                                            size="sm"
                                            title="Registrar Venta"
                                            onClick={() => handleSell(product)}
                                            className="bg-green-50 text-green-600 hover:bg-green-100 hover:text-green-700"
                                            disabled={product.stock <= 0}
                                        >
                                            <ShoppingBag className="w-4 h-4" />
                                        </Button>
                                        <Button variant="ghost" size="sm" onClick={() => handleShare(product)} title="Compartir">
                                            <Share2 className="w-4 h-4 text-green-500" />
                                        </Button>
                                        <Button variant="ghost" size="sm" onClick={() => handleView(product)} title="Ver detalles">
                                            <Eye className="w-4 h-4 text-gray-500" />
                                        </Button>
                                        <Button variant="ghost" size="sm" onClick={() => handleEdit(product)} title="Editar">
                                            <Edit className="w-4 h-4 text-blue-500" />
                                        </Button>
                                        <Button variant="ghost" size="sm" onClick={() => product.id && handleDelete(product.id)} title="Eliminar">
                                            <Trash2 className="w-4 h-4 text-red-500" />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Card View */}
                <div className="md:hidden divide-y divide-gray-100">
                    {filteredProducts.map((product) => (
                        <div key={product.id} className="p-4 space-y-4">
                            <div className="flex gap-4">
                                <img
                                    src={product.imageUrl || '/placeholder.png'}
                                    alt={product.name}
                                    className="w-20 h-20 object-cover rounded-lg bg-gray-50"
                                />
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-bold text-gray-900 truncate">{product.name}</h4>
                                    <p className="text-blue-600 font-bold text-lg">
                                        ${product.price.toLocaleString()}
                                    </p>
                                    <div className="mt-1">
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${product.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            Stock: {product.stock}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-50">
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    onClick={() => handleSell(product)}
                                    className="flex-1 bg-green-50 text-green-600 hover:bg-green-100 h-10"
                                    disabled={product.stock <= 0}
                                >
                                    <ShoppingBag className="w-4 h-4 mr-2" /> Venta
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => handleShare(product)} className="h-10 px-3">
                                    <Share2 className="w-4 h-4 text-green-500" />
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => handleView(product)} className="h-10 px-3 text-gray-500">
                                    <Eye className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => handleEdit(product)} className="h-10 px-3 text-blue-500">
                                    <Edit className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => product.id && handleDelete(product.id)} className="h-10 px-3 text-red-500">
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredProducts.length === 0 && (
                    <div className="px-6 py-12 text-center text-gray-500">
                        {products.length === 0 ? 'No hay celulares registrados.' : 'No se encontraron celulares con los filtros aplicados.'}
                    </div>
                )}
            </div>
        </div>
    );
}

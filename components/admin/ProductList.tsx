import { useState, useEffect } from 'react';
import { Product } from '@/core/entities/Product';
import { Button } from '@/components/ui/Button';
import { Edit, Trash2, Plus, ShoppingBag } from 'lucide-react';
import ProductForm from '@/components/admin/ProductForm';
import ProductDetailsModal from '@/components/ProductDetailsModal';
import { Eye } from 'lucide-react';

export default function ProductList() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined);
    const [viewingProduct, setViewingProduct] = useState<Product | undefined>(undefined);
    const [isViewOpen, setIsViewOpen] = useState(false);

    const fetchProducts = async () => {
        try {
            const res = await fetch('/api/products');
            const data = await res.json();
            setProducts(data);
        } catch (error) {
            console.error('Failed to fetch products', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
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

    if (loading) return <div className="text-center py-10">Cargando productos...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">Inventario de Celulares</h2>
                <Button onClick={handleCreate} className="gap-2">
                    <Plus className="w-4 h-4" /> Nuevo Celular
                </Button>
            </div>

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

            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
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
                        {products.map((product) => (
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
                        {products.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                    No hay celulares registrados.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

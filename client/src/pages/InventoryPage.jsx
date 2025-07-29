import React, { useState, useEffect } from 'react';
import api from '../services/api';
import ProductModal from '../components/ProductModal';

const InventoryPage = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [productsRes, categoriesRes] = await Promise.all([
                api.get('/products'),
                api.get('/categories')
            ]);
            setProducts(productsRes.data);
            setCategories(categoriesRes.data);
        } catch (error) {
            console.error("Failed to fetch data", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleOpenModal = (product = null) => {
        setSelectedProduct(product);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedProduct(null);
    };

    const handleSaveProduct = async (productData) => {
        try {
            if (selectedProduct) {
                const { data: updatedProduct } = await api.put(`/products/${selectedProduct._id}`, productData);
                setProducts(products.map(p => p._id === updatedProduct._id ? updatedProduct : p));
            } else {
                const { data: newProduct } = await api.post('/products', productData);
                setProducts([...products, newProduct]);
            }
            handleCloseModal();
        } catch (error) {
            console.error("Failed to save product", error);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 gap-4">
                <h1 className="text-2xl font-bold text-gray-800">Inventory Management</h1>
                <button
                    onClick={() => handleOpenModal()}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 w-full sm:w-auto"
                >
                    Add New Product
                </button>
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block bg-white p-6 rounded-lg shadow-md">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Base Price</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Selling Price</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expiry Date</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {products.map(product => (
                            <tr key={product._id}>
                                <td className="px-6 py-4 whitespace-nowrap">{product.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{product.sku}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{product.category?.name || 'N/A'}</td>
                                <td className="px-6 py-4 whitespace-nowrap">Rp{product.basePrice.toLocaleString('id-ID')}</td>
                                <td className="px-6 py-4 whitespace-nowrap">Rp{product.price.toLocaleString('id-ID')}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{product.stock}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{product.expiryDate ? new Date(product.expiryDate).toLocaleDateString() : 'N/A'}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button
                                        onClick={() => handleOpenModal(product)}
                                        className="text-indigo-600 hover:text-indigo-900"
                                    >
                                        Edit
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
                {products.map(product => (
                    <div key={product._id} className="bg-white p-4 rounded-lg shadow-md">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">{product.name}</h3>
                                <p className="text-sm text-gray-500">SKU: {product.sku}</p>
                            </div>
                            <button
                                onClick={() => handleOpenModal(product)}
                                className="text-sm bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full"
                            >
                                Edit
                            </button>
                        </div>
                        <div className="mt-4 border-t pt-4">
                             <div className="flex justify-between text-sm mb-2">
                                <span className="text-gray-600">Category:</span>
                                <span className="font-medium text-gray-800">{product.category?.name || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-gray-600">Base Price:</span>
                                <span className="font-medium text-gray-800">Rp{product.basePrice.toLocaleString('id-ID')}</span>
                            </div>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-gray-600">Selling Price:</span>
                                <span className="font-medium text-gray-800">Rp{product.price.toLocaleString('id-ID')}</span>
                            </div>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-gray-600">Stock:</span>
                                <span className="font-medium text-gray-800">{product.stock}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Expiry Date:</span>
                                <span className="font-medium text-gray-800">{product.expiryDate ? new Date(product.expiryDate).toLocaleDateString() : 'N/A'}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>


            {isModalOpen && (
                <ProductModal
                    product={selectedProduct}
                    categories={categories}
                    onClose={handleCloseModal}
                    onSave={handleSaveProduct}
                />
            )}
        </div>
    );
};

export default InventoryPage;
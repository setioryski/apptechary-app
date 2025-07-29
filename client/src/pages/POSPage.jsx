import React, { useState, useEffect } from 'react';
import api from '../services/api';
import CheckoutModal from '../components/CheckoutModal';
import InvoiceModal from '../components/InvoiceModal';
import { useToast } from '../context/ToastContext';

const POSPage = () => {
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
  const [completedSale, setCompletedSale] = useState(null);
  const { showToast } = useToast();


  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await api.get('/products');
        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch products", error);
        showToast('Error fetching products', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [showToast]);

  const addToCart = (product) => {
    if (product.stock <= 0) {
        showToast(`${product.name} is out of stock.`, 'error');
        return;
    }
    setCart(currentCart => {
      const existingItem = currentCart.find(item => item._id === product._id);
      if (existingItem) {
        if (existingItem.quantity < product.stock) {
            return currentCart.map(item =>
                item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
            );
        } else {
            showToast(`Maximum stock for ${product.name} reached.`, 'error');
            return currentCart;
        }
      }
      return [...currentCart, { ...product, quantity: 1 }];
    });
  };

  const handleConfirmCheckout = async (paymentMethod) => {
    const saleData = {
        items: cart.map(({ _id, name, price, basePrice, quantity }) => ({ 
            productId: _id, 
            name, 
            price, 
            basePrice, 
            quantity 
        })),
        totalAmount,
        paymentMethod,
    };

    try {
        const { data: populatedSale } = await api.post('/sales', saleData);
        setCompletedSale(populatedSale);
        setIsCheckoutOpen(false);
        setIsInvoiceOpen(true);
        setCart([]);
        showToast('Sale completed successfully!', 'success');
    } catch (error) {
        console.error("Failed to create sale", error);
        showToast(error.response?.data?.message || 'Failed to complete sale.', 'error');
    }
  };

  const totalAmount = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  
  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div>Loading products...</div>;

  return (
    <>
        <div className="flex flex-col lg:flex-row h-[calc(100vh-140px)] gap-6">
        {/* Products Section */}
        <div className="lg:w-2/3 flex flex-col">
            <div className="mb-4">
            <input 
                type="text"
                placeholder="🔍 Scan barcode or search product by name/SKU..."
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            </div>
            <div className="flex-grow overflow-y-auto bg-white p-4 rounded-lg shadow-sm">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {filteredProducts.map(product => (
                <div key={product._id} onClick={() => addToCart(product)} className="border rounded-lg p-3 text-center cursor-pointer hover:bg-sky-50 transition-colors">
                    <p className="font-semibold text-sm text-gray-800">{product.name}</p>
                    <p className="text-xs text-gray-500">Stock: {product.stock}</p>
                    <p className="text-md font-bold text-sky-700 mt-2">Rp{product.price.toLocaleString('id-ID')}</p>
                </div>
                ))}
            </div>
            </div>
        </div>

        {/* Cart Section */}
        <div className="lg:w-1/3 bg-white p-4 rounded-lg shadow-sm flex flex-col">
            <h2 className="text-xl font-bold border-b pb-2 mb-4">Current Order</h2>
            <div className="flex-grow overflow-y-auto">
            {cart.length === 0 ? (
                <p className="text-gray-500 text-center mt-8">Cart is empty</p>
            ) : (
                <ul className="divide-y">
                {cart.map(item => (
                    <li key={item._id} className="flex justify-between items-center py-3">
                    <div>
                        <p className="font-semibold text-sm">{item.name}</p>
                        <p className="text-xs text-gray-500">
                        {item.quantity} x Rp{item.price.toLocaleString('id-ID')}
                        </p>
                    </div>
                    <p className="font-bold text-sm">Rp{(item.quantity * item.price).toLocaleString('id-ID')}</p>
                    </li>
                ))}
                </ul>
            )}
            </div>
            <div className="border-t pt-4 mt-4">
            <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-bold">Total</span>
                <span className="text-2xl font-extrabold text-sky-700">Rp{totalAmount.toLocaleString('id-ID')}</span>
            </div>
            <button 
                onClick={() => setIsCheckoutOpen(true)}
                disabled={cart.length === 0}
                className="w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
                Checkout
            </button>
            </div>
        </div>
        </div>

        {isCheckoutOpen && (
            <CheckoutModal
                totalAmount={totalAmount}
                onClose={() => setIsCheckoutOpen(false)}
                onConfirm={handleConfirmCheckout}
            />
        )}

        {isInvoiceOpen && (
            <InvoiceModal
                sale={completedSale}
                onClose={() => setIsInvoiceOpen(false)}
            />
        )}
    </>
  );
};

export default POSPage;
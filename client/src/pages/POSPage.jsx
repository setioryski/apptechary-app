import React, { useState } from 'react';

// Placeholder data - you would fetch this from your API
const sampleProducts = [
  { id: 1, name: 'Paracetamol 500mg', price: 5000, stock: 45, sku: 'PC500' },
  { id: 2, name: 'Vitamin C 1000mg', price: 25000, stock: 120, sku: 'VC1000' },
  { id: 3, name: 'Amoxicillin 250mg', price: 15000, stock: 30, sku: 'AMX250' },
  { id: 4, name: 'Cough Syrup 60ml', price: 22000, stock: 60, sku: 'CS60' },
];

const POSPage = () => {
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const addToCart = (product) => {
    // Check if product is already in cart
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      setCart(cart.map(item =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const totalAmount = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  
  const filteredProducts = sampleProducts.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
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
              <div key={product.id} onClick={() => addToCart(product)} className="border rounded-lg p-3 text-center cursor-pointer hover:bg-sky-50 transition-colors">
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
                <li key={item.id} className="flex justify-between items-center py-3">
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
            disabled={cart.length === 0}
            className="w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default POSPage;
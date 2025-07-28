import React, { useState, useEffect } from 'react';
import api from '../services/api';
import InvoiceModal from '../components/InvoiceModal';

const SalesReportsPage = () => {
    const [sales, setSales] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedSale, setSelectedSale] = useState(null);
    const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);

    useEffect(() => {
        const fetchSales = async () => {
            try {
                const { data } = await api.get('/sales');
                setSales(data);
            } catch (error) {
                console.error("Failed to fetch sales", error);
            } finally {
                setLoading(false);
            }
        };
        fetchSales();
    }, []);

    const handlePrintClick = async (saleId) => {
        try {
            const { data } = await api.get(`/sales/${saleId}`);
            setSelectedSale(data);
            setIsInvoiceModalOpen(true);
        } catch (error) {
            console.error("Failed to fetch sale details", error);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <>
            <div>
                <h1 className="text-2xl font-bold text-gray-800 mb-4">Sales Reports</h1>
                <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cashier</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items Sold</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Amount</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Method</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {sales.map(sale => (
                                <tr key={sale._id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(sale.createdAt).toLocaleString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sale.cashierId.username}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <ul className="list-disc list-inside">
                                            {sale.items.map(item => (
                                                <li key={item._id}>{item.quantity}x {item.name}</li>
                                            ))}
                                        </ul>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Rp{sale.totalAmount.toLocaleString('id-ID')}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sale.paymentMethod}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button
                                            onClick={() => handlePrintClick(sale._id)}
                                            className="text-indigo-600 hover:text-indigo-900"
                                        >
                                            Print Invoice
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {isInvoiceModalOpen && (
                <InvoiceModal
                    sale={selectedSale}
                    onClose={() => setIsInvoiceModalOpen(false)}
                />
            )}
        </>
    );
};

export default SalesReportsPage;
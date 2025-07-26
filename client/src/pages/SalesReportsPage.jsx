import React, { useState, useEffect } from 'react';
import api from '../services/api';

const SalesReportsPage = () => {
    const [sales, setSales] = useState([]);
    const [loading, setLoading] = useState(true);

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

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Sales Reports</h1>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cashier</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Amount</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Method</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {sales.map(sale => (
                            <tr key={sale._id}>
                                <td className="px-6 py-4 whitespace-nowrap">{new Date(sale.createdAt).toLocaleString()}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{sale.cashierId.username}</td>
                                <td className="px-6 py-4 whitespace-nowrap">Rp{sale.totalAmount.toLocaleString('id-ID')}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{sale.paymentMethod}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SalesReportsPage;
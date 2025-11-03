import React, { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import InvoiceModal from '../components/InvoiceModal';
import ConfirmationModal from '../components/ConfirmationModal';
import { useToast } from '../context/ToastContext';

const SalesReportsPage = () => {
    const [sales, setSales] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedSale, setSelectedSale] = useState(null);
    const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
    
    // State for retraction confirmation
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [saleToRetractId, setSaleToRetractId] = useState(null);

    // --- ADD STATE FOR DELETE CONFIRMATION ---
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [saleToDeleteId, setSaleToDeleteId] = useState(null);

    const { showToast } = useToast();

    const fetchSales = useCallback(async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/sales');
            setSales(data);
        } catch (error) {
            console.error("Failed to fetch sales", error);
            showToast('Failed to fetch sales reports.', 'error');
        } finally {
            setLoading(false);
        }
    }, [showToast]);

    useEffect(() => {
        fetchSales();
    }, [fetchSales]);

    const handlePrintClick = async (saleId) => {
        try {
            const { data } = await api.get(`/sales/${saleId}`);
            setSelectedSale(data);
            setIsInvoiceModalOpen(true);
        } catch (error) {
            console.error("Failed to fetch sale details", error);
            showToast('Failed to fetch sale details.', 'error');
        }
    };
    
    // Opens the retraction confirmation modal
    const handleRetractClick = (saleId) => {
        setSaleToRetractId(saleId);
        setIsConfirmModalOpen(true);
    };

    // The actual retract logic
    const confirmRetraction = async () => {
        if (!saleToRetractId) return;
        try {
            await api.put(`/sales/${saleToRetractId}/retract`);
            showToast('Sale retracted successfully!', 'success');
            fetchSales(); // Refresh the sales list
        } catch (error) {
            console.error("Failed to retract sale", error);
            showToast(error.response?.data?.message || 'Failed to retract sale.', 'error');
        } finally {
            setIsConfirmModalOpen(false);
            setSaleToRetractId(null);
        }
    };

    // --- ADD HANDLERS FOR DELETION ---

    const handleDeleteClick = (saleId) => {
        setSaleToDeleteId(saleId);
        setIsDeleteConfirmOpen(true);
    };

    const confirmDeletion = async () => {
        if (!saleToDeleteId) return;
        try {
            await api.delete(`/sales/${saleToDeleteId}`);
            showToast('Sale deleted successfully!', 'success');
            fetchSales(); // Refresh the sales list
        } catch (error) {
            console.error("Failed to delete sale", error);
            showToast(error.response?.data?.message || 'Failed to delete sale.', 'error');
        } finally {
            setIsDeleteConfirmOpen(false);
            setSaleToDeleteId(null);
        }
    };

    // --- HELPER TO CLOSE ALL MODALS ---
    const handleCloseModals = () => {
        setIsInvoiceModalOpen(false);
        setIsConfirmModalOpen(false);
        setSaleToRetractId(null);
        setIsDeleteConfirmOpen(false);
        setSaleToDeleteId(null);
    };

    // ... (getStatusBadge function remains unchanged) ...
    const getStatusBadge = (status) => {
        switch (status) {
            case 'Completed':
                return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Completed</span>;
            case 'Retracted':
                return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">Retracted</span>;
            default:
                return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">{status}</span>;
        }
    };

    if (loading) return <div>Loading sales reports...</div>;

    return (
        <>
            <div>
                <h1 className="text-2xl font-bold text-gray-800 mb-4">Sales Reports</h1>
                <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        {/* ... (thead remains unchanged) ... */}
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cashier</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items Sold</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Amount</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {sales.map(sale => (
                                <tr key={sale._id} className={sale.status === 'Retracted' ? 'bg-red-50' : ''}>
                                    {/* ... (other tds remain unchanged) ... */}
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(sale.createdAt).toLocaleString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sale.cashierId.username}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sale.customerId?.name || 'N/A'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <ul className="list-disc list-inside">
                                            {sale.items.map(item => (
                                                <li key={item._id}>{item.quantity}x {item.name}</li>
                                            ))}
                                        </ul>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Rp{sale.totalAmount.toLocaleString('id-ID')}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sale.paymentMethod}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{getStatusBadge(sale.status)}</td>
                                    
                                    {/* --- MODIFY THIS ACTIONS CELL --- */}
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                        <button
                                            onClick={() => handlePrintClick(sale._id)}
                                            className="text-indigo-600 hover:text-indigo-900"
                                        >
                                            Invoice
                                        </button>
                                        <button
                                            onClick={() => handleRetractClick(sale._id)}
                                            disabled={sale.status === 'Retracted'}
                                            className="text-yellow-600 hover:text-yellow-900 disabled:text-gray-400 disabled:cursor-not-allowed"
                                        >
                                            Retract
                                        </button>
                                        {/* --- ADD THIS DELETE BUTTON --- */}
                                        <button
                                            onClick={() => handleDeleteClick(sale._id)}
                                            disabled={sale.status !== 'Retracted'}
                                            className="text-red-600 hover:text-red-900 disabled:text-gray-400 disabled:cursor-not-allowed"
                                        >
                                            Delete
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
                    onClose={handleCloseModals} // Use unified close handler
                />
            )}

            <ConfirmationModal
                isOpen={isConfirmModalOpen}
                onClose={handleCloseModals} // Use unified close handler
                onConfirm={confirmRetraction}
                title="Confirm Sale Retraction"
                message="Are you sure you want to retract this sale? This action cannot be undone and will restore the items to inventory."
            />

            {/* --- ADD THE DELETE CONFIRMATION MODAL --- */}
            <ConfirmationModal
                isOpen={isDeleteConfirmOpen}
                onClose={handleCloseModals}
                onConfirm={confirmDeletion}
                title="Confirm Sale Deletion"
                message="Are you sure you want to permanently delete this retracted sale? This action cannot be undone."
            />
        </>
    );
};

export default SalesReportsPage;
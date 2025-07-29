import React, { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';
import ConfirmationModal from '../components/ConfirmationModal';

const AccountingPage = () => {
    const [expenses, setExpenses] = useState([]);
    const [sales, setSales] = useState([]);
    const [loading, setLoading] = useState(true);
    const { showToast } = useToast();

    // Form state for new expense
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('');

    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [expenseToDeleteId, setExpenseToDeleteId] = useState(null);

    const fetchData = useCallback(async () => {
        try {
            const [expensesRes, salesRes] = await Promise.all([
                api.get('/expenses'),
                api.get('/sales')
            ]);
            setExpenses(expensesRes.data);
            setSales(salesRes.data.filter(sale => sale.status === 'Completed'));
        } catch (error) {
            console.error("Failed to fetch accounting data", error);
            showToast('Failed to load accounting data.', 'error');
        } finally {
            setLoading(false);
        }
    }, [showToast]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleAddExpense = async (e) => {
        e.preventDefault();
        if (!description || !amount || !category) {
            showToast('Please fill in all fields.', 'error');
            return;
        }
        try {
            const newExpense = { description, amount: Number(amount), category };
            await api.post('/expenses', newExpense);
            showToast('Expense added successfully!', 'success');
            // Reset form and refresh list
            setDescription('');
            setAmount('');
            setCategory('');
            fetchData();
        } catch (error) {
            console.error("Failed to add expense", error);
            showToast(error.response?.data?.message || 'Failed to add expense.', 'error');
        }
    };

    const handleDeleteClick = (expenseId) => {
        setExpenseToDeleteId(expenseId);
        setIsConfirmModalOpen(true);
    };

    const confirmDeletion = async () => {
        if (!expenseToDeleteId) return;
        try {
            await api.delete(`/expenses/${expenseToDeleteId}`);
            showToast('Expense deleted successfully!', 'success');
            fetchData(); // Refresh the data
        } catch (error) {
            console.error("Failed to delete expense", error);
            showToast(error.response?.data?.message || 'Failed to delete expense.', 'error');
        } finally {
            setIsConfirmModalOpen(false);
            setExpenseToDeleteId(null);
        }
    };

    const totalRevenue = sales.reduce((acc, sale) => acc + sale.totalAmount, 0);
    const totalCOGS = sales.reduce((acc, sale) => 
        acc + sale.items.reduce((itemAcc, item) => itemAcc + ((item.basePrice || 0) * item.quantity), 0), 
    0);
    const grossProfit = totalRevenue - totalCOGS;
    const totalExpenses = expenses.reduce((acc, expense) => acc + expense.amount, 0);
    const netIncome = grossProfit - totalExpenses;

    if (loading) return <div>Loading accounting data...</div>;

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Accounting</h1>

            {/* Financial Summary */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-green-100 p-4 rounded-lg shadow">
                    <h3 className="text-sm font-medium text-green-800">Total Revenue</h3>
                    <p className="text-2xl font-semibold text-green-900">Rp{totalRevenue.toLocaleString('id-ID')}</p>
                </div>
                <div className="bg-yellow-100 p-4 rounded-lg shadow">
                    <h3 className="text-sm font-medium text-yellow-800">Cost of Goods Sold</h3>
                    <p className="text-2xl font-semibold text-yellow-900">Rp{totalCOGS.toLocaleString('id-ID')}</p>
                </div>
                <div className="bg-red-100 p-4 rounded-lg shadow">
                    <h3 className="text-sm font-medium text-red-800">Operating Expenses</h3>
                    <p className="text-2xl font-semibold text-red-900">Rp{totalExpenses.toLocaleString('id-ID')}</p>
                </div>
                <div className="bg-sky-100 p-4 rounded-lg shadow">
                    <h3 className="text-sm font-medium text-sky-800">Net Income</h3>
                    <p className="text-2xl font-semibold text-sky-900">Rp{netIncome.toLocaleString('id-ID')}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Income (Sales List) */}
                <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-lg font-semibold mb-4">Income from Sales</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {sales.map(sale => (
                                    <tr key={sale._id}>
                                        <td className="px-6 py-4 whitespace-nowrap">{new Date(sale.createdAt).toLocaleDateString()}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{sale.items.map(i => i.name).join(', ')}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-green-600 font-semibold">Rp{sale.totalAmount.toLocaleString('id-ID')}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Expenses Section */}
                <div className="lg:col-span-1 space-y-8">
                    {/* Add Expense Form */}
                    <div className="bg-white p-6 rounded-lg shadow-md h-fit">
                        <h2 className="text-lg font-semibold mb-4">Add New Expense</h2>
                        <form onSubmit={handleAddExpense} className="space-y-4">
                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                                <input
                                    type="text"
                                    id="description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="mt-1 w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Amount (Rp)</label>
                                <input
                                    type="number"
                                    id="amount"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    className="mt-1 w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
                                <input
                                    type="text"
                                    id="category"
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    placeholder="e.g., Utilities, Supplies"
                                    className="mt-1 w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
                            >
                                Add Expense
                            </button>
                        </form>
                    </div>

                    {/* Expenses List */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-lg font-semibold mb-4">Expense History</h2>
                        <div className="overflow-y-auto max-h-96">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50 sticky top-0">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {expenses.map(expense => (
                                        <tr key={expense._id}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{expense.description}</div>
                                                <div className="text-xs text-gray-500">{expense.category} | {new Date(expense.date).toLocaleDateString()}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-red-600 font-semibold">Rp{expense.amount.toLocaleString('id-ID')}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button
                                                    onClick={() => handleDeleteClick(expense._id)}
                                                    className="text-red-600 hover:text-red-900"
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
                </div>
            </div>
            <ConfirmationModal
                isOpen={isConfirmModalOpen}
                onClose={() => {
                    setIsConfirmModalOpen(false);
                    setExpenseToDeleteId(null);
                }}
                onConfirm={confirmDeletion}
                title="Confirm Expense Deletion"
                message="Are you sure you want to delete this expense? This action cannot be undone."
            />
        </div>
    );
};

export default AccountingPage;
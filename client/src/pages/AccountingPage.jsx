import React, { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';

const AccountingPage = () => {
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const { showToast } = useToast();

    // Form state for new expense
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('');

    const fetchExpenses = useCallback(async () => {
        try {
            const { data } = await api.get('/expenses');
            setExpenses(data);
        } catch (error) {
            console.error("Failed to fetch expenses", error);
            showToast('Failed to load expenses.', 'error');
        } finally {
            setLoading(false);
        }
    }, [showToast]);

    useEffect(() => {
        fetchExpenses();
    }, [fetchExpenses]);

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
            fetchExpenses();
        } catch (error) {
            console.error("Failed to add expense", error);
            showToast(error.response?.data?.message || 'Failed to add expense.', 'error');
        }
    };

    if (loading) return <div>Loading accounting data...</div>;

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Accounting</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Add Expense Form */}
                <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-md h-fit">
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
                <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
                     <h2 className="text-lg font-semibold mb-4">Expense History</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {expenses.map(expense => (
                                    <tr key={expense._id}>
                                        <td className="px-6 py-4 whitespace-nowrap">{expense.description}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">Rp{expense.amount.toLocaleString('id-ID')}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{expense.category}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{new Date(expense.date).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AccountingPage;
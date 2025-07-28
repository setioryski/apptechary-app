import React from 'react';

const InvoiceModal = ({ sale, onClose }) => {
    if (!sale) return null;

    const handlePrint = () => {
        const printContent = document.getElementById('invoice-print-area').innerHTML;
        const originalContents = document.body.innerHTML;
        
        // Temporarily replace the body content with the invoice content for printing
        document.body.innerHTML = `
            <html>
                <head>
                    <title>Print Invoice</title>
                    <script src="https://cdn.tailwindcss.com"></script>
                    <style>
                        @media print {
                            body { -webkit-print-color-adjust: exact; }
                        }
                    </style>
                </head>
                <body>
                    ${printContent}
                </body>
            </html>
        `;
        
        window.print();
        
        // Restore the original content
        document.body.innerHTML = originalContents;
        // The component will be unmounted/remounted by the parent, but a reload ensures scripts are re-run if needed.
        window.location.reload();
    };

    return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-xl flex flex-col">
                <div id="invoice-print-area" className="p-8">
                    {/* Header */}
                    <div className="flex justify-between items-start pb-4 border-b">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">Invoice</h2>
                            <p className="text-sm text-gray-500 break-all">ID: {sale._id}</p>
                        </div>
                        <div className="text-right">
                            <h3 className="text-lg font-semibold text-sky-800">Apothecary POS</h3>
                            <p className="text-sm text-gray-500">Medan, North Sumatra</p>
                        </div>
                    </div>

                    {/* Details */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-8 gap-y-4 my-6 text-sm">
                        <div>
                            <p className="text-gray-500">Date</p>
                            <p className="font-medium text-gray-800">{new Date(sale.createdAt).toLocaleString('id-ID', { dateStyle: 'long', timeStyle: 'short' })}</p>
                        </div>
                        <div>
                            <p className="text-gray-500">Cashier</p>
                            <p className="font-medium text-gray-800">{sale.cashierId.username}</p>
                        </div>
                        <div>
                            <p className="text-gray-500">Payment Method</p>
                            <p className="font-medium text-gray-800">{sale.paymentMethod}</p>
                        </div>
                    </div>

                    {/* Items Table */}
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-4 py-2 text-left font-semibold text-gray-600 uppercase tracking-wider">Product</th>
                                    <th className="px-4 py-2 text-center font-semibold text-gray-600 uppercase tracking-wider">Qty</th>
                                    <th className="px-4 py-2 text-right font-semibold text-gray-600 uppercase tracking-wider">Price</th>
                                    <th className="px-4 py-2 text-right font-semibold text-gray-600 uppercase tracking-wider">Subtotal</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {sale.items.map(item => (
                                    <tr key={item._id}>
                                        <td className="px-4 py-3 whitespace-nowrap text-gray-800">{item.name}</td>
                                        <td className="px-4 py-3 whitespace-nowrap text-center text-gray-600">{item.quantity}</td>
                                        <td className="px-4 py-3 whitespace-nowrap text-right text-gray-600">Rp{item.price.toLocaleString('id-ID')}</td>
                                        <td className="px-4 py-3 whitespace-nowrap text-right font-medium text-gray-800">Rp{(item.price * item.quantity).toLocaleString('id-ID')}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Footer */}
                    <div className="flex justify-end mt-6 pt-4 border-t">
                        <div className="w-full max-w-xs">
                            <div className="flex justify-between items-center">
                                <span className="font-semibold text-gray-600">Total</span>
                                <span className="text-xl font-bold text-gray-900">Rp{sale.totalAmount.toLocaleString('id-ID')}</span>
                            </div>
                        </div>
                    </div>

                    <div className="text-center text-xs text-gray-500 mt-8">
                        <p>Thank you for your purchase!</p>
                    </div>
                </div>

                {/* Actions */}
                <div className="bg-gray-50 px-6 py-4 flex justify-end items-center gap-3 rounded-b-lg print:hidden">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 text-sm font-medium rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
                        Close
                    </button>
                    <button onClick={handlePrint} className="px-4 py-2 bg-sky-600 text-white text-sm font-medium rounded-md hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500">
                        Print Invoice
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InvoiceModal;
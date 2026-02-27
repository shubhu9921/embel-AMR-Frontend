import React from 'react';
import { X, CheckCircle, Smartphone, Mail, FileText, Download, Printer, Send, Clock, AlertCircle } from 'lucide-react';

export default function BillingDetailsModal({ isOpen, onClose, invoice }) {
    if (!isOpen || !invoice) return null;

    // Helper to determine status color/icon
    const getStatusConfig = (status) => {
        switch (status) {
            case 'Paid':
                return {
                    color: 'text-green-600',
                    bg: 'bg-green-100',
                    text: 'text-green-700',
                    icon: <CheckCircle className="w-5 h-5 text-green-600" />
                };
            case 'Pending':
                return {
                    color: 'text-amber-600',
                    bg: 'bg-amber-100',
                    text: 'text-amber-700',
                    icon: <Clock className="w-5 h-5 text-amber-600" />
                };
            case 'Overdue':
                return {
                    color: 'text-red-600',
                    bg: 'bg-red-100',
                    text: 'text-red-700',
                    icon: <AlertCircle className="w-5 h-5 text-red-600" />
                };
            default:
                return {
                    color: 'text-slate-600',
                    bg: 'bg-slate-100',
                    text: 'text-slate-700',
                    icon: <FileText className="w-5 h-5 text-slate-600" />
                };
        }
    };

    const statusConfig = getStatusConfig(invoice.status);

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200"
            role="presentation"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div
                className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200"
                role="dialog"
                aria-modal="true"
                aria-labelledby="billing-modal-title"
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <FileText className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <h2 id="billing-modal-title" className="text-lg font-semibold text-slate-800">{invoice.id} {invoice.customName && invoice.customName !== '-' ? `— ${invoice.customName}` : ''}</h2>
                            <p className="text-sm text-slate-500">{invoice.period || 'Consumption Period Data'}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-200 rounded-lg transition"
                        aria-label="Close"
                    >
                        <X className="w-5 h-5 text-slate-500" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 overflow-y-auto max-h-[60vh]">
                    <div className="space-y-6">
                        {/* Status Section */}
                        <div className="flex items-center gap-3">
                            {statusConfig.icon}
                            <span className={`px-3 py-1.5 rounded-full text-sm font-semibold ${statusConfig.bg} ${statusConfig.text}`}>
                                {invoice.status}
                            </span>
                            <span className="text-sm text-slate-500">
                                {invoice.status === 'Paid' ? `Paid on ${invoice.paidDate || 'Recently'}${invoice.paymentMethod ? ` via ${invoice.paymentMethod}` : ''}` : `Due by ${invoice.date || 'Scheduled Date'}`}
                            </span>
                        </div>

                        {/* Customer Details */}
                        <div className="bg-slate-50 rounded-xl p-4">
                            <h3 className="text-sm font-semibold text-slate-700 mb-3">Customer Details</h3>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-slate-500">Name</p>
                                    <p className="font-medium text-slate-800">{invoice.customer}</p>
                                </div>
                                <div>
                                    <p className="text-slate-500">Email</p>
                                    <p className="font-medium text-slate-800">{invoice.email}</p>
                                </div>
                                <div>
                                    <p className="text-slate-500">Phone</p>
                                    <p className="font-medium text-slate-800">{invoice.phone || 'No Phone provided'}</p>
                                </div>
                                <div>
                                    <p className="text-slate-500">Resource / Device</p>
                                    <p className="font-medium text-slate-800">{(invoice.resourceType || invoice.meterType || 'Utility')} ({invoice.deviceId || invoice.meter || '-'})</p>
                                </div>
                                <div className="col-span-2">
                                    <p className="text-slate-500">Address</p>
                                    <p className="font-medium text-slate-800">{invoice.address || 'Address information not available'}</p>
                                </div>
                            </div>
                        </div>

                        {/* Billing Details */}
                        <div className="bg-slate-50 rounded-xl p-4">
                            <h3 className="text-sm font-semibold text-slate-700 mb-3">Billing Details</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">Consumption</span>
                                    <span className="font-medium text-slate-800">{invoice.consumption || 'Units Data N/A'}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">Rate</span>
                                    <span className="font-medium text-slate-800">{invoice.rate || 'Base Tariff'}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">Subtotal</span>
                                    <span className="font-medium text-slate-800">{invoice.subtotal || invoice.amount}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">Tax</span>
                                    <span className="font-medium text-slate-800">{invoice.tax || '-'}</span>
                                </div>
                                <div className="flex justify-between text-sm pt-3 border-t border-slate-200">
                                    <span className="font-semibold text-slate-800">Total Amount</span>
                                    <span className="font-bold text-xl text-blue-600">{invoice.amount}</span>
                                </div>
                            </div>
                        </div>

                        {/* Footer Info */}
                        <div className="flex items-center gap-3 text-sm">
                            <Clock className="w-5 h-5 text-slate-400" />
                            <span className="text-slate-500">Due Date:</span>
                            <span className="font-semibold text-slate-800">{invoice.date}</span>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-slate-200 bg-slate-50">
                    <button className="flex items-center gap-2 px-4 py-2 border border-slate-300 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-100 transition">
                        <Mail className="w-4 h-4" />
                        Send Email
                    </button>
                    <div className="flex gap-2">
                        <button className="flex items-center gap-2 px-4 py-2 border border-slate-300 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-100 transition">
                            <Printer className="w-4 h-4" />
                            Print
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition">
                            <Download className="w-4 h-4" />
                            Download PDF
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

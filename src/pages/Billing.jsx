import React, { useState } from 'react';
import {
    FileText,
    Search,
    Filter,
    Plus,
    Download,
    Eye,
    Mail,
    CreditCard,
    Clock,
    AlertCircle,
    CheckCircle
} from 'lucide-react';
import BillingDetailsModal from './BillingDetailsModal';

const initialInvoices = [
    {
        id: 'INV-2025-001',
        customer: 'John Doe',
        email: 'john@amr.com',
        phone: '+91 98765 43210',
        meter: 'MTR-001',
        type: 'SOLAR',
        amount: '₹5,310',
        date: '2025-01-15',
        status: 'Paid',
        address: '123, Main Street, Mumbai, MH 400001',
        consumption: '450 kWh',
        rate: '₹10/kWh',
        subtotal: '₹4,500',
        tax: '₹810 (18% GST)',
        paidDate: '2025-01-10'
    },
    {
        id: 'INV-2025-002',
        customer: 'Alice Smith',
        email: 'alice@amr.com',
        phone: '+91 98765 43211',
        meter: 'MTR-003',
        type: 'WATER',
        amount: '₹1,416',
        date: '2025-01-20',
        status: 'Pending',
        address: '456, Park Avenue, Delhi, DL 110001',
        consumption: '120 kL',
        rate: '₹10/kL',
        subtotal: '₹1,200',
        tax: '₹216 (18% GST)'
    },
    { id: 'INV-2025-003', customer: 'Bob Wilson', email: 'bob@amr.com', meter: 'MTR-004', type: 'ELECTRIC', amount: '₹10,502', date: '2025-01-10', status: 'Overdue' },
    { id: 'INV-2025-004', customer: 'Charlie Brown', email: 'charlie@amr.com', meter: 'MTR-006', type: 'WATER', amount: '₹1,121', date: '2025-01-25', status: 'Pending' },
    { id: 'INV-2025-005', customer: 'David Lee', email: 'david@amr.com', meter: 'MTR-007', type: 'ELECTRIC', amount: '₹7,316', date: '2025-01-18', status: 'Paid' },
    { id: 'INV-2024-089', customer: 'Emma Wilson', email: 'emma@amr.com', meter: 'MTR-008', type: 'GAS', amount: '₹4,012', date: '2024-12-30', status: 'Paid' },
];

export default function BillingPage() {
    const [invoices] = useState(initialInvoices);
    const [searchTerm, setSearchTerm] = useState("");
    const [showFilters, setShowFilters] = useState(false);
    const [filterStatus, setFilterStatus] = useState("All");
    const [filterType, setFilterType] = useState("All");
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleViewInvoice = (invoice) => {
        setSelectedInvoice(invoice);
        setIsModalOpen(true);
    };

    const filteredInvoices = invoices.filter(inv => {
        const matchesSearch = inv.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
            inv.id.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === "All" || inv.status === filterStatus;
        const matchesType = filterType === "All" || inv.type === filterType;
        return matchesSearch && matchesStatus && matchesType;
    });

    const getTypeColor = (type) => {
        switch (type) {
            case 'SOLAR': return 'bg-amber-100 text-amber-700';
            case 'WATER': return 'bg-blue-100 text-blue-700';
            case 'ELECTRIC': return 'bg-purple-100 text-purple-700';
            case 'GAS': return 'bg-orange-100 text-orange-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Paid': return 'bg-green-100 text-green-700';
            case 'Pending': return 'bg-amber-100 text-amber-700';
            case 'Overdue': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Paid': return <CheckCircle className="w-5 h-5 text-green-600" />;
            case 'Pending': return <Clock className="w-5 h-5 text-amber-600" />;
            case 'Overdue': return <AlertCircle className="w-5 h-5 text-red-600" />;
            default: return null;
        }
    };

    return (
        <main className="flex-1 overflow-y-auto scroll-smooth bg-gray-50">
            <div className="min-h-full">
                {/* Header */}
                <div className="bg-white border-b sticky top-0 z-10 px-6 py-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-800">Billing</h1>
                            <p className="text-sm text-slate-500 mt-1">Manage invoices and payments</p>
                        </div>
                        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition shadow-sm hover:shadow active:scale-95">
                            <Plus className="w-5 h-5" /> Create Invoice
                        </button>
                    </div>
                </div>

                <div className="p-6 space-y-6">
                    {/* Summary Cards */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-5 text-white shadow-lg shadow-blue-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-blue-100 text-sm font-medium">Total Billing</p>
                                    <p className="text-2xl font-bold mt-1">₹29,677</p>
                                </div>
                                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                                    <CreditCard className="w-6 h-6" />
                                </div>
                            </div>
                        </div>
                        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-5 text-white shadow-lg shadow-green-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-green-100 text-sm font-medium">Paid</p>
                                    <p className="text-2xl font-bold mt-1">₹16,638</p>
                                </div>
                                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                                    <CheckCircle className="w-6 h-6" />
                                </div>
                            </div>
                        </div>
                        <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl p-5 text-white shadow-lg shadow-amber-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-amber-100 text-sm font-medium">Pending</p>
                                    <p className="text-2xl font-bold mt-1">₹2,537</p>
                                </div>
                                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                                    <Clock className="w-6 h-6" />
                                </div>
                            </div>
                        </div>
                        <div className="bg-gradient-to-br from-red-500 to-rose-600 rounded-2xl p-5 text-white shadow-lg shadow-red-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-red-100 text-sm font-medium">Overdue</p>
                                    <p className="text-2xl font-bold mt-1">₹10,502</p>
                                </div>
                                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                                    <AlertCircle className="w-6 h-6" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
                        <div className="flex flex-col sm:flex-row gap-4 justify-between">
                            <div className="flex flex-wrap gap-3">
                                <div className="relative w-full sm:w-auto">
                                    <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                    <input
                                        placeholder="Search invoices..."
                                        className="pl-10 pr-4 py-2.5 bg-slate-100 border-0 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all w-full sm:w-64"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                                <button
                                    onClick={() => setShowFilters(!showFilters)}
                                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition ${showFilters ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                                >
                                    <Filter className="w-5 h-5" /> Filters
                                </button>
                            </div>
                            <div className="flex items-center gap-4 text-sm">
                                <span className="text-slate-500">Total Invoices: <span className="font-semibold text-slate-800">{filteredInvoices.length}</span></span>
                            </div>
                        </div>

                        {/* Filter Dropdowns */}
                        {showFilters && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-slate-100 animate-in fade-in slide-in-from-top-2">
                                <div>
                                    <label className="block text-xs font-medium text-slate-500 mb-1.5 uppercase tracking-wider">Status</label>
                                    <select
                                        value={filterStatus}
                                        onChange={(e) => setFilterStatus(e.target.value)}
                                        className="w-full bg-white border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 outline-none font-medium"
                                    >
                                        <option value="All">All Statuses</option>
                                        <option value="Paid">Paid</option>
                                        <option value="Pending">Pending</option>
                                        <option value="Overdue">Overdue</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-500 mb-1.5 uppercase tracking-wider">Type</label>
                                    <select
                                        value={filterType}
                                        onChange={(e) => setFilterType(e.target.value)}
                                        className="w-full bg-white border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 outline-none font-medium"
                                    >
                                        <option value="All">All Types</option>
                                        <option value="SOLAR">Solar</option>
                                        <option value="WATER">Water</option>
                                        <option value="ELECTRIC">Electric</option>
                                        <option value="GAS">Gas</option>
                                    </select>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Table */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-slate-50 text-slate-600">
                                    <tr>
                                        <th className="px-5 py-4 text-left font-semibold">Invoice</th>
                                        <th className="px-5 py-4 text-left font-semibold">Customer</th>
                                        <th className="px-5 py-4 text-left font-semibold">Meter</th>
                                        <th className="px-5 py-4 text-left font-semibold">Amount</th>
                                        <th className="px-5 py-4 text-left font-semibold">Due Date</th>
                                        <th className="px-5 py-4 text-left font-semibold">Status</th>
                                        <th className="px-5 py-4 text-right font-semibold">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {filteredInvoices.length > 0 ? (
                                        filteredInvoices.map((inv) => (
                                            <tr key={inv.id} className="hover:bg-slate-50 transition cursor-pointer">
                                                <td className="px-5 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2 bg-slate-100 rounded-lg">
                                                            <FileText className="w-5 h-5 text-slate-600" />
                                                        </div>
                                                        <span className="font-medium text-slate-800">{inv.id}</span>
                                                    </div>
                                                </td>
                                                <td className="px-5 py-4">
                                                    <div>
                                                        <p className="font-medium text-slate-800">{inv.customer}</p>
                                                        <p className="text-xs text-slate-500">{inv.email}</p>
                                                    </div>
                                                </td>
                                                <td className="px-5 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${getTypeColor(inv.type)}`}>
                                                            {inv.type}
                                                        </span>
                                                        <span className="text-slate-600">{inv.meter}</span>
                                                    </div>
                                                </td>
                                                <td className="px-5 py-4 font-semibold text-slate-800">{inv.amount}</td>
                                                <td className="px-5 py-4">
                                                    <div className="flex items-center gap-2 text-slate-600">
                                                        <Clock className="w-4 h-4" /> {/* Or Calendar icon */}
                                                        {inv.date}
                                                    </div>
                                                </td>
                                                <td className="px-5 py-4">
                                                    <div className="flex items-center gap-2">
                                                        {getStatusIcon(inv.status)}
                                                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusColor(inv.status)}`}>
                                                            {inv.status}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-5 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button
                                                            onClick={() => handleViewInvoice(inv)}
                                                            className="p-2 hover:bg-blue-100 rounded-lg transition text-blue-600"
                                                            title="View"
                                                        >
                                                            <Eye className="w-4 h-4" />
                                                        </button>
                                                        <button className="p-2 hover:bg-green-100 rounded-lg transition text-green-600" title="Download">
                                                            <Download className="w-4 h-4" />
                                                        </button>
                                                        <button className="p-2 hover:bg-purple-100 rounded-lg transition text-purple-600" title="Send Email">
                                                            <Mail className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="7" className="px-5 py-8 text-center text-slate-500">
                                                No invoices found matching your criteria.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

            </div>

            <BillingDetailsModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                invoice={selectedInvoice}
            />
        </main >
    );
}

import React, { useState, useRef, useEffect } from 'react';
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
    CheckCircle,
    ChevronDown,
    Receipt
} from 'lucide-react';
import BillingDetailsModal from './BillingDetailsModal';
import { StatCard } from './StatCard';

const initialInvoices = [
    {
        id: 'INV-2025-001',
        customer: 'John Doe',
        email: 'john@amr.com',
        phone: '+91 98765 43210',
        meter: 'MTR-001',
        resourceType: 'SOLAR',
        type: 'Generation',
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
        resourceType: 'WATER',
        type: 'Usage',
        amount: '₹1,416',
        date: '2025-01-20',
        status: 'Pending',
        address: '456, Park Avenue, Delhi, DL 110001',
        consumption: '120 kL',
        rate: '₹10/kL',
        subtotal: '₹1,200',
        tax: '₹216 (18% GST)'
    },
    { id: 'INV-2025-003', customer: 'Bob Wilson', email: 'bob@amr.com', meter: 'MTR-004', resourceType: 'ELECTRIC', type: 'Consumption', amount: '₹10,502', date: '2025-01-10', status: 'Overdue' },
    { id: 'INV-2025-004', customer: 'Charlie Brown', email: 'charlie@amr.com', meter: 'MTR-006', resourceType: 'WATER', type: 'Maintenance', amount: '₹1,121', date: '2025-01-25', status: 'Pending' },
    { id: 'INV-2025-005', customer: 'David Lee', email: 'david@amr.com', meter: 'MTR-007', resourceType: 'ELECTRIC', type: 'Billing', amount: '₹7,316', date: '2025-01-18', status: 'Paid' },
    { id: 'INV-2024-089', customer: 'Emma Wilson', email: 'emma@amr.com', meter: 'MTR-008', resourceType: 'GAS', type: 'Consumption', amount: '₹4,012', date: '2024-12-30', status: 'Paid' },
];

export default function BillingPage() {
    const [invoices] = useState(initialInvoices);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("All");
    const [filterType, setFilterType] = useState("All");
    const [filterMeter, setFilterMeter] = useState("All");
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Dropdown states
    const [isStatusFilterOpen, setIsStatusFilterOpen] = useState(false);
    const [isTypeFilterOpen, setIsTypeFilterOpen] = useState(false);
    const [isMeterFilterOpen, setIsMeterFilterOpen] = useState(false);

    // Refs for click outside
    const statusFilterRef = useRef(null);
    const typeFilterRef = useRef(null);
    const meterFilterRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (statusFilterRef.current && !statusFilterRef.current.contains(event.target)) {
                setIsStatusFilterOpen(false);
            }
            if (typeFilterRef.current && !typeFilterRef.current.contains(event.target)) {
                setIsTypeFilterOpen(false);
            }
            if (meterFilterRef.current && !meterFilterRef.current.contains(event.target)) {
                setIsMeterFilterOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleViewInvoice = (invoice) => {
        setSelectedInvoice(invoice);
        setIsModalOpen(true);
    };

    const filteredInvoices = invoices.filter(inv => {
        const matchesSearch = inv.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
            inv.id.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === "All" || inv.status === filterStatus;
        const matchesType = filterType === "All" || inv.type === filterType;
        const matchesMeter = filterMeter === "All" || inv.resourceType === filterMeter;
        return matchesSearch && matchesStatus && matchesType && matchesMeter;
    });

    const getResourceTypeColor = (type) => {
        switch (type) {
            case 'SOLAR': return 'bg-amber-100 text-amber-700 border-amber-200';
            case 'WATER': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'ELECTRIC': return 'bg-purple-100 text-purple-700 border-purple-200';
            case 'GAS': return 'bg-orange-100 text-orange-700 border-orange-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Paid': return 'bg-green-50 text-green-700 border-green-200';
            case 'Pending': return 'bg-orange-50 text-orange-700 border-orange-200';
            case 'Overdue': return 'bg-red-50 text-red-700 border-red-200';
            default: return 'bg-gray-50 text-gray-700 border-gray-200';
        }
    };

    // Calculate totals
    const totalBilling = "₹" + invoices.reduce((acc, curr) => acc + parseInt(curr.amount.replace(/[^0-9]/g, '')), 0).toLocaleString();
    const totalPaid = "₹" + invoices.filter(i => i.status === 'Paid').reduce((acc, curr) => acc + parseInt(curr.amount.replace(/[^0-9]/g, '')), 0).toLocaleString();
    const totalPending = "₹" + invoices.filter(i => i.status === 'Pending').reduce((acc, curr) => acc + parseInt(curr.amount.replace(/[^0-9]/g, '')), 0).toLocaleString();
    const totalOverdue = "₹" + invoices.filter(i => i.status === 'Overdue').reduce((acc, curr) => acc + parseInt(curr.amount.replace(/[^0-9]/g, '')), 0).toLocaleString();

    return (
        <main className="w-full min-h-screen p-4 md:p-6 font-sans">

            {/* Top Header */}
            {/* Top Header */}
            <div className="sticky top-0 z-30 group bg-white/90 backdrop-blur-xl px-6 py-4 rounded-2xl shadow-md transition-all duration-300 hover:shadow-xl hover:bg-orange-50/90 mb-6">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 text-white shadow-lg transition-transform duration-300 group-hover:scale-105">
                            <Receipt size={24} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                                Billing & Invoices
                            </h1>
                            <p className="text-sm font-medium text-gray-500">
                                Manage payments & statements
                            </p>
                        </div>
                    </div>
                    <div className="h-1.5 w-24 rounded-full bg-gradient-to-r from-orange-400 to-red-500 opacity-20" />
                </div>
            </div>

            <div className="max-w-[1920px] mx-auto space-y-6">

                {/* KPI Section */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                    <StatCard
                        title="Total Billing"
                        value={totalBilling}
                        icon={<CreditCard className="w-4 h-4" />}
                        color="orange"
                        description="Cumulative invoiced amount"
                        compact
                    />
                    <StatCard
                        title="Paid Amount"
                        value={totalPaid}
                        icon={<CheckCircle className="w-4 h-4" />}
                        color="green"
                        description="Total collected revenue"
                        compact
                    />
                    <StatCard
                        title="Pending"
                        value={totalPending}
                        icon={<Clock className="w-4 h-4" />}
                        color="amber" // Using amber for pending as per plan
                        description="Awaiting payment"
                        compact
                    />
                    <StatCard
                        title="Overdue"
                        value={totalOverdue}
                        icon={<AlertCircle className="w-4 h-4" />}
                        color="red"
                        description="Payment deadline crossed"
                        compact
                    />
                </div>

                {/* Content Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col">

                    {/* Header Controls */}
                    <div className="p-5 border-b border-gray-100 flex flex-col xl:flex-row xl:items-center justify-between gap-4 bg-white/50 backdrop-blur-sm sticky top-0 z-20 rounded-t-2xl">
                        {/* Left: Title & Search */}
                        <div className="flex flex-col md:flex-row md:items-center gap-4 w-full xl:w-auto">
                            <div className="relative w-full md:w-80 group">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#ff6e00] transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Search invoices..."
                                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 placeholder-gray-400 outline-none focus:ring-2 focus:ring-[#ff6e00]/20 focus:border-[#ff6e00] transition-all shadow-md shadow-orange-100 hover:shadow-orange-200 group-hover:bg-white"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Right: Actions & Filter */}
                        <div className="flex flex-wrap items-center gap-3">
                            {/* Status Filter Dropdown */}
                            <div className="relative min-w-[140px]" ref={statusFilterRef}>
                                <button
                                    onClick={() => setIsStatusFilterOpen(!isStatusFilterOpen)}
                                    className={`w-full flex items-center justify-between pl-4 pr-3 py-2.5 bg-gray-50 border rounded-xl text-sm font-bold text-gray-700 transition-all outline-none shadow-sm shadow-orange-100 hover:shadow-md hover:shadow-orange-200 ${isStatusFilterOpen
                                        ? 'border-[#ff6e00] ring-2 ring-[#ff6e00]/20'
                                        : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    <span className="truncate">
                                        {filterStatus === 'All' ? 'All Status' : filterStatus}
                                    </span>
                                    <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isStatusFilterOpen ? 'rotate-180' : ''}`} />
                                </button>
                                <div className={`absolute top-full right-0 mt-2 w-full bg-white border border-gray-100 rounded-xl shadow-xl z-50 overflow-hidden text-sm transition-all duration-200 origin-top ${isStatusFilterOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
                                    }`}>
                                    {['All', 'Paid', 'Pending', 'Overdue'].map((option) => (
                                        <button
                                            key={option}
                                            onClick={() => {
                                                setFilterStatus(option);
                                                setIsStatusFilterOpen(false);
                                            }}
                                            className={`w-full text-left px-4 py-2.5 font-medium transition-colors hover:bg-orange-50 hover:text-[#ff6e00] ${filterStatus === option ? 'text-[#ff6e00] bg-orange-50/50' : 'text-gray-600'
                                                }`}
                                        >
                                            {option === 'All' ? 'All Status' : option}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Meter Filter Dropdown */}
                            <div className="relative min-w-[140px]" ref={meterFilterRef}>
                                <button
                                    onClick={() => setIsMeterFilterOpen(!isMeterFilterOpen)}
                                    className={`w-full flex items-center justify-between pl-4 pr-3 py-2.5 bg-gray-50 border rounded-xl text-sm font-bold text-gray-700 transition-all outline-none shadow-sm shadow-orange-100 hover:shadow-md hover:shadow-orange-200 ${isMeterFilterOpen
                                        ? 'border-[#ff6e00] ring-2 ring-[#ff6e00]/20'
                                        : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    <span className="truncate">
                                        {filterMeter === 'All' ? 'All Meters' : filterMeter}
                                    </span>
                                    <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isMeterFilterOpen ? 'rotate-180' : ''}`} />
                                </button>
                                <div className={`absolute top-full right-0 mt-2 w-full bg-white border border-gray-100 rounded-xl shadow-xl z-50 overflow-hidden text-sm transition-all duration-200 origin-top ${isMeterFilterOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
                                    }`}>
                                    {['All', 'SOLAR', 'WATER', 'ELECTRIC', 'GAS'].map((option) => (
                                        <button
                                            key={option}
                                            onClick={() => {
                                                setFilterMeter(option);
                                                setIsMeterFilterOpen(false);
                                            }}
                                            className={`w-full text-left px-4 py-2.5 font-medium transition-colors hover:bg-orange-50 hover:text-[#ff6e00] ${filterMeter === option ? 'text-[#ff6e00] bg-orange-50/50' : 'text-gray-600'
                                                }`}
                                        >
                                            {option === 'All' ? 'All Meters' : option}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Type Filter Dropdown */}
                            <div className="relative min-w-[140px]" ref={typeFilterRef}>
                                <button
                                    onClick={() => setIsTypeFilterOpen(!isTypeFilterOpen)}
                                    className={`w-full flex items-center justify-between pl-4 pr-3 py-2.5 bg-gray-50 border rounded-xl text-sm font-bold text-gray-700 transition-all outline-none shadow-sm shadow-orange-100 hover:shadow-md hover:shadow-orange-200 ${isTypeFilterOpen
                                        ? 'border-[#ff6e00] ring-2 ring-[#ff6e00]/20'
                                        : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    <span className="truncate">
                                        {filterType === 'All' ? 'All Types' : filterType}
                                    </span>
                                    <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isTypeFilterOpen ? 'rotate-180' : ''}`} />
                                </button>
                                <div className={`absolute top-full right-0 mt-2 w-full bg-white border border-gray-100 rounded-xl shadow-xl z-50 overflow-hidden text-sm transition-all duration-200 origin-top ${isTypeFilterOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
                                    }`}>
                                    {['All', 'Consumption', 'Usage', 'Generation', 'Maintenance', 'Billing'].map((option) => (
                                        <button
                                            key={option}
                                            onClick={() => {
                                                setFilterType(option);
                                                setIsTypeFilterOpen(false);
                                            }}
                                            className={`w-full text-left px-4 py-2.5 font-medium transition-colors hover:bg-orange-50 hover:text-[#ff6e00] ${filterType === option ? 'text-[#ff6e00] bg-orange-50/50' : 'text-gray-600'
                                                }`}
                                        >
                                            {option === 'All' ? 'All Types' : option}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="h-8 w-[1px] bg-gray-200 mx-1 hidden md:block"></div>

                            {/* Action Buttons */}
                            <button
                                className="flex items-center gap-2 px-4 py-2.5 bg-[#ff6e00] hover:bg-[#e66300] text-white rounded-xl text-sm font-bold shadow-lg shadow-orange-500/30 hover:shadow-orange-500/40 transition-all active:scale-95"
                            >
                                <Plus className="w-5 h-5 stroke-[2.5]" />
                                <span className="hidden sm:inline">Create Invoice</span>
                            </button>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto min-h-[400px] rounded-b-2xl">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-gray-50/50 text-gray-500 text-xs uppercase font-extrabold tracking-wider sticky top-0 z-10 backdrop-blur-md">
                                <tr>
                                    <th className="px-6 py-4 border-b border-gray-100">Invoice</th>
                                    <th className="px-6 py-4 border-b border-gray-100">Customer</th>
                                    <th className="px-6 py-4 border-b border-gray-100">Meter</th>
                                    <th className="px-6 py-4 border-b border-gray-100">Type</th>
                                    <th className="px-6 py-4 border-b border-gray-100">Amount</th>
                                    <th className="px-6 py-4 border-b border-gray-100">Due Date</th>
                                    <th className="px-6 py-4 border-b border-gray-100">Status</th>
                                    <th className="px-6 py-4 border-b border-gray-100 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filteredInvoices.length > 0 ? (
                                    filteredInvoices.map((inv) => (
                                        <tr
                                            key={inv.id}
                                            onClick={() => handleViewInvoice(inv)}
                                            className="group hover:bg-orange-50/50 transition-colors duration-200 cursor-pointer"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-white border border-gray-200 rounded-lg group-hover:border-[#ff6e00] transition-colors">
                                                        <FileText className="w-5 h-5 text-gray-400 group-hover:text-[#ff6e00]" />
                                                    </div>
                                                    <span className="font-bold text-gray-700 group-hover:text-[#ff6e00] transition-colors">{inv.id}</span>
                                                </div>
                                            </td>

                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-gray-800 text-sm">{inv.customer}</span>
                                                    <span className="text-xs text-gray-400 font-medium mt-0.5">{inv.email}</span>
                                                </div>
                                            </td>

                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-bold border ${getResourceTypeColor(inv.resourceType)}`}>
                                                    {inv.resourceType}
                                                </span>
                                            </td>

                                            <td className="px-6 py-4">
                                                <span className="text-sm font-medium text-gray-600">{inv.type}</span>
                                            </td>

                                            <td className="px-6 py-4 font-black text-gray-800 group-hover:text-[#ff6e00] transition-colors">
                                                {inv.amount}
                                            </td>

                                            <td className="px-6 py-4 text-sm text-gray-500 font-medium">
                                                <div className="flex items-center gap-1.5">
                                                    <Clock className="w-3.5 h-3.5 text-gray-400" />
                                                    {inv.date}
                                                </div>
                                            </td>

                                            <td className="px-6 py-4">
                                                <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(inv.status)}`}>
                                                    {inv.status === 'Paid' && <CheckCircle className="w-3 h-3" />}
                                                    {inv.status === 'Pending' && <Clock className="w-3 h-3" />}
                                                    {inv.status === 'Overdue' && <AlertCircle className="w-3 h-3" />}
                                                    {inv.status}
                                                </div>
                                            </td>

                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        className="p-2 bg-white border border-gray-200 text-gray-600 rounded-lg hover:border-blue-500 hover:text-blue-600 hover:shadow-md transition-all active:scale-90"
                                                        title="View Details"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            alert(`Downloading invoice ${inv.id}...`);
                                                        }}
                                                        className="p-2 bg-white border border-gray-200 text-gray-600 rounded-lg hover:border-green-500 hover:text-green-600 hover:shadow-md transition-all active:scale-90"
                                                        title="Download Invoice"
                                                    >
                                                        <Download className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        className="p-2 bg-white border border-gray-200 text-gray-600 rounded-lg hover:border-purple-500 hover:text-purple-600 hover:shadow-md transition-all active:scale-90"
                                                        title="Email Invoice"
                                                    >
                                                        <Mail className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={8} className="px-6 py-12 text-center">
                                            <div className="flex flex-col items-center justify-center text-gray-400">
                                                <div className="p-4 bg-gray-50 rounded-full mb-3">
                                                    <Search className="w-8 h-8 opacity-50" />
                                                </div>
                                                <p className="text-lg font-medium text-gray-600">No invoices found</p>
                                                <p className="text-sm">Try adjusting your search or filters</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
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

import React, { useState, useRef, useEffect } from 'react';
import {
    FileText,
    Search,
    Download,
    Eye,
    Mail,
    CreditCard,
    Clock,
    AlertCircle,
    CheckCircle,
    ChevronDown,
    Receipt,
    Plus
} from 'lucide-react';
import BillingDetailsModal from '../components/modals/BillingDetailsModal';
import { StatCard } from '../components/dashboard/StatCard';
import GenerateBillModal from '../components/modals/GenerateBillModal';
import { useTable } from '../hooks/useTable';
import { formatCurrency, getStatusColorConfig, getResourceTypeColorConfig } from '../utils/formatters';
import { apiService } from '../services/apiService';

export default function BillingPage({ userRole = 'Admin' }) {
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
    const [invoicesData, setInvoicesData] = useState([]);
    const [loading, setLoading] = useState(true);

    // Dropdown states
    const [openDropdown, setOpenDropdown] = useState(null); // 'status', 'type', 'resource'
    const dropdownRef = useRef(null);

    useEffect(() => {
        const fetchInvoices = async () => {
            try {
                const role = sessionStorage.getItem('userRole');
                const name = sessionStorage.getItem('userName');
                const isSystemAdmin = role === 'Super Admin' || role === 'Admin';
                const queryStr = isSystemAdmin ? '' : `?customer=${encodeURIComponent(name || '')}`;

                const data = await apiService.getInvoices(queryStr);
                setInvoicesData(data);
            } catch (error) {
                console.error("Failed to fetch invoices:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchInvoices();
    }, []);

    // Filter invoices based on role
    const displayInvoices = React.useMemo(() => invoicesData, [invoicesData]);

    const {
        searchTerm, setSearchTerm,
        filters, setFilters,
        currentPage, totalPages,
        filteredData: invoices,
        allFilteredData,
        handlePrevPage, handleNextPage,
    } = useTable(displayInvoices, {
        searchFields: ['customer', 'id'],
        initialFilters: { status: 'All', type: 'All', resourceType: 'All' },
        pageSize: 5
    });

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpenDropdown(null);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [setOpenDropdown]);

    const handleViewInvoice = (invoice) => {
        setSelectedInvoice(invoice);
        setIsModalOpen(true);
    };

    const getResourceTypeColor = (type) => {
        const config = getResourceTypeColorConfig(type);
        return `${config.bg} ${config.text} border ${config.border}`;
    };

    const getStatusColor = (status) => {
        const config = getStatusColorConfig(status);
        return `${config.bg} ${config.text} border ${config.border}`;
    };

    // Calculate totals based on displayed invoices
    const sumAmounts = (list) => list?.reduce((acc, curr) => acc + (parseFloat(curr?.amount?.replace(/[^0-9.-]+/g, '')) || 0), 0) || 0;
    const totalBilling = formatCurrency(sumAmounts(displayInvoices));
    const totalPaid = formatCurrency(sumAmounts(displayInvoices.filter(i => i.status === 'Paid')));
    const totalPending = formatCurrency(sumAmounts(displayInvoices.filter(i => i.status === 'Pending')));
    const totalOverdue = formatCurrency(sumAmounts(displayInvoices.filter(i => i.status === 'Overdue')));

    // Calculate Dynamic Breakdowns
    const getBreakdown = (list) => {
        const resources = ['WATER', 'ELECTRIC', 'GAS', 'SOLAR'];
        const colors = { ELECTRIC: 'text-amber-600', WATER: 'text-blue-600', GAS: 'text-purple-600', SOLAR: 'text-orange-600' };

        return resources.map(res => {
            const val = sumAmounts(list.filter(i => i.resourceType === res));
            const label = res === 'ELECTRIC' ? 'Energy' : res.charAt(0) + res.slice(1).toLowerCase();
            return { label, value: formatCurrency(val), color: colors[res] };
        });
    };

    const totalBreakdown = getBreakdown(displayInvoices);
    const paidBreakdown = getBreakdown(displayInvoices.filter(i => i.status === 'Paid'));
    const pendingBreakdown = getBreakdown(displayInvoices.filter(i => i.status === 'Pending'));
    const overdueBreakdown = getBreakdown(displayInvoices.filter(i => i.status === 'Overdue'));

    return (
        <main className="w-full min-h-screen p-4 md:p-6 font-sans flex flex-col pt-6 md:pt-8">
            <div className="p-5 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/50 backdrop-blur-sm sticky top-0 z-30 rounded-[20px] shadow-sm mb-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 w-full">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 text-white shadow-lg transition-transform duration-300 group-hover:scale-105"><Receipt size={24} /></div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Billing & Invoices</h1>
                            <p className="text-sm font-medium text-gray-500">Real-time monitoring and analytics</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-6 w-full mt-4">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                    <StatCard
                        title="Total Billing"
                        value={totalBilling}
                        icon={<CreditCard className="w-4 h-4" />}
                        color="orange"
                        description="Cumulative invoiced amount"
                        statusBreakdown={totalBreakdown}
                    />
                    <StatCard
                        title="Paid Amount"
                        value={totalPaid}
                        icon={<CheckCircle className="w-4 h-4" />}
                        color="green"
                        description="Total collected revenue"
                        statusBreakdown={paidBreakdown}
                    />
                    <StatCard
                        title="Pending"
                        value={totalPending}
                        icon={<Clock className="w-4 h-4" />}
                        color="amber"
                        description="Awaiting payment"
                        statusBreakdown={pendingBreakdown}
                    />
                    <StatCard
                        title="Overdue"
                        value={totalOverdue}
                        icon={<AlertCircle className="w-4 h-4" />}
                        color="red"
                        description="Payment deadline crossed"
                        statusBreakdown={overdueBreakdown}
                    />
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col">
                    <div className="p-5 border-b border-gray-100 flex flex-col xl:flex-row xl:items-center justify-between gap-4 bg-white/50 backdrop-blur-sm sticky top-[84px] z-20 rounded-t-2xl shadow-md">
                        <div className="relative w-full md:w-80 group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#ff6e00] transition-colors" />
                            <input type="text" placeholder="Search invoices..." className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none shadow-md shadow-orange-100 transition-all" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                        </div>

                        <div className="flex flex-wrap items-center gap-3" ref={dropdownRef}>
                            {/* Status Filter */}
                            <div className="relative min-w-[140px]">
                                <button onClick={() => setOpenDropdown(openDropdown === 'status' ? null : 'status')} className={`w-full flex items-center justify-between pl-4 pr-3 py-2.5 bg-gray-50 border rounded-xl text-sm font-bold text-gray-700 transition-all ${openDropdown === 'status' ? 'border-[#ff6e00] ring-2 ring-[#ff6e00]/20' : 'border-gray-200'}`}>
                                    <span className="truncate">{filters.status === 'All' ? 'All Status' : filters.status}</span>
                                    <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${openDropdown === 'status' ? 'rotate-180' : ''}`} />
                                </button>
                                {openDropdown === 'status' && (
                                    <div className="absolute top-full right-0 mt-2 w-full bg-white border border-gray-100 rounded-xl shadow-xl z-50 overflow-hidden text-sm">
                                        {['All', 'Paid', 'Pending', 'Overdue'].map(opt => (
                                            <button key={opt} onClick={() => { setFilters('status', opt); setOpenDropdown(null); }} className={`w-full text-left px-4 py-2.5 font-medium hover:bg-orange-50 ${filters.status === opt ? 'text-[#ff6e00] bg-orange-50/50' : 'text-gray-600'}`}>{opt === 'All' ? 'All Status' : opt}</button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Resource Filter */}
                            <div className="relative min-w-[140px]">
                                <button onClick={() => setOpenDropdown(openDropdown === 'resource' ? null : 'resource')} className={`w-full flex items-center justify-between pl-4 pr-3 py-2.5 bg-gray-50 border rounded-xl text-sm font-bold text-gray-700 transition-all ${openDropdown === 'resource' ? 'border-[#ff6e00] ring-2 ring-[#ff6e00]/20' : 'border-gray-200'}`}>
                                    <span className="truncate">{filters.resourceType === 'All' ? 'All Meters' : filters.resourceType}</span>
                                    <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${openDropdown === 'resource' ? 'rotate-180' : ''}`} />
                                </button>
                                {openDropdown === 'resource' && (
                                    <div className="absolute top-full right-0 mt-2 w-full bg-white border border-gray-100 rounded-xl shadow-xl z-50 overflow-hidden text-sm">
                                        {['All', 'SOLAR', 'WATER', 'ELECTRIC', 'GAS'].map(opt => (
                                            <button key={opt} onClick={() => { setFilters('resourceType', opt); setOpenDropdown(null); }} className={`w-full text-left px-4 py-2.5 font-medium hover:bg-orange-50 ${filters.resourceType === opt ? 'text-[#ff6e00] bg-orange-50/50' : 'text-gray-600'}`}>{opt === 'All' ? 'All Meters' : opt}</button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <button onClick={() => setIsGenerateModalOpen(true)} className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-700 hover:to-purple-800 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-lg shadow-indigo-500/20 transition-all active:scale-95 group">
                                <Receipt size={20} className="group-hover:rotate-12 transition-transform" />
                                <span className="hidden sm:inline">Generate Bill</span>
                            </button>
                        </div>
                    </div>

                    <div className="overflow-x-auto min-h-[400px]">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-gray-50/50 text-gray-500 text-xs uppercase font-extrabold tracking-wider sticky top-0 z-10 backdrop-blur-md">
                                <tr>
                                    <th className="px-6 py-4 border-b border-gray-100">Invoice</th>
                                    {userRole !== 'Domestic' && <th className="px-6 py-4 border-b border-gray-100">Customer</th>}
                                    <th className="px-6 py-4 border-b border-gray-100">Resource</th>
                                    <th className="px-6 py-4 border-b border-gray-100">Device/Meter</th>
                                    <th className="px-6 py-4 border-b border-gray-100">Name / Type</th>
                                    <th className="px-6 py-4 border-b border-gray-100">Amount</th>
                                    <th className="px-6 py-4 border-b border-gray-100">Status</th>
                                    <th className="px-6 py-4 border-b border-gray-100 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {invoices.length > 0 ? (
                                    invoices.map((inv) => (
                                        <tr key={inv.id} onClick={() => handleViewInvoice(inv)} className="group hover:bg-orange-50/50 transition-colors cursor-pointer">
                                            <td className="px-6 py-4"><div className="flex items-center gap-3"><FileText className="w-5 h-5 text-gray-400 transition-colors group-hover:text-[#ff6e00]" /><span className="font-bold text-gray-700">{inv.id}</span></div></td>
                                            {userRole !== 'Domestic' && <td className="px-6 py-4"><div><span className="font-bold text-gray-800 text-sm block">{inv.customer}</span><span className="text-xs text-gray-400">{inv.email}</span></div></td>}
                                            <td className="px-6 py-4"><span className={`inline-flex px-2 py-0.5 rounded text-xs font-bold border ${getResourceTypeColor(inv.resourceType)}`}>{inv.resourceType}</span></td>
                                            <td className="px-6 py-4 text-sm font-bold text-gray-800 font-mono tracking-tight">{inv.deviceId || '-'}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-gray-800">{inv.customName || '-'}</span>
                                                    <span className="text-xs font-medium text-gray-500">{inv.type}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 font-black text-gray-800">{inv.amount}</td>
                                            <td className="px-6 py-4"><div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(inv.status)}`}>{inv.status}</div></td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button className="p-2 bg-white border border-gray-200 rounded-lg hover:text-blue-600 transition-all"><Eye size={16} /></button>
                                                    <button className="p-2 bg-white border border-gray-200 rounded-lg hover:text-green-600 transition-all"><Download size={16} /></button>
                                                    <button className="p-2 bg-white border border-gray-200 rounded-lg hover:text-purple-600 transition-all"><Mail size={16} /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr><td colSpan={8} className="px-6 py-12 text-center text-gray-400">No invoices found matching criteria.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="border-t border-gray-100 bg-gray-50 p-4 flex items-center justify-between rounded-b-2xl">
                        <div className="text-sm text-gray-500 font-medium tracking-tight">
                            Showing <span className="font-bold text-gray-900">{allFilteredData.length > 0 ? (currentPage - 1) * 5 + 1 : 0}</span> to <span className="font-bold text-gray-900">{Math.min(currentPage * 5, allFilteredData.length)}</span> of <span className="font-bold text-gray-900">{allFilteredData.length}</span>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={handlePrevPage} disabled={currentPage === 1} className="px-3 py-1.5 border border-gray-200 bg-white rounded-lg text-sm font-bold disabled:opacity-50 hover:bg-gray-50 transition-all">Prev</button>
                            <button onClick={handleNextPage} disabled={currentPage === totalPages || totalPages === 0} className="px-3 py-1.5 border border-gray-200 bg-white rounded-lg text-sm font-bold disabled:opacity-50 hover:bg-gray-50 transition-all">Next</button>
                        </div>
                    </div>
                </div>
            </div>

            <BillingDetailsModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} invoice={selectedInvoice} />
            {isGenerateModalOpen && <GenerateBillModal onClose={() => setIsGenerateModalOpen(false)} userEmail={sessionStorage.getItem('userEmail') || 'user@example.com'} />}
        </main>
    );
}

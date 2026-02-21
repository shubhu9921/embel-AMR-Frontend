import React, { useState, useRef, useEffect } from 'react';
import {
    FileText,
    Search,
    Download,
    Eye,
    Plus,
    CheckCircle2,
    Clock,
    ChevronDown
} from 'lucide-react';
import ReportDetailsModal from "../components/modals/ReportDetailsModal";
import { StatCard } from "../components/dashboard/StatCard";
import { useTable } from '../hooks/useTable';

const initialReports = [
    { id: 1, name: "Monthly Consumption Report", type: "Consumption", meter: "ELECTRIC", period: "December 2024", generated: "2025-01-07", status: "Ready", size: "2.4 MB" },
    { id: 2, name: "Water Usage Summary", type: "Usage", meter: "WATER", period: "Q4 2024", generated: "2025-01-06", status: "Ready", size: "1.8 MB" },
    { id: 3, name: "Solar Generation Analysis", type: "Generation", meter: "SOLAR", period: "2024 Annual", generated: "2025-01-05", status: "Ready", size: "5.2 MB" },
    { id: 4, name: "Gas Consumption Trends", type: "Consumption", meter: "GAS", period: "November 2024", generated: "2025-01-04", status: "Ready", size: "1.5 MB" },
    { id: 5, name: "Device Health Report", type: "Maintenance", meter: "ALL", period: "January 2025", generated: "2025-01-03", status: "Processing", size: "-" },
    { id: 6, name: "Billing Summary Report", type: "Billing", meter: "ELECTRIC", period: "December 2024", generated: "2025-01-02", status: "Ready", size: "890 KB" },
];

export default function ReportsPage() {
    const userRole = sessionStorage.getItem('userRole') || 'Admin';
    const [selectedReport, setSelectedReport] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Role-based data isolation
    const filteredInitialReports = initialReports.filter(r => {
        if (userRole === 'Domestic') {
            return r.meter !== 'ALL' && r.type !== 'Maintenance';
        }
        return true;
    });

    // Dropdown states
    const [openDropdown, setOpenDropdown] = useState(null); // 'type', 'meter'
    const dropdownRef = useRef(null);

    const {
        searchTerm, setSearchTerm,
        filters, setFilters,
        filteredData: filteredReports,
    } = useTable(filteredInitialReports, {
        searchFields: ['name', 'type'],
        initialFilters: { type: 'All', meter: 'All' },
        pageSize: 100 // Unpaginated for now as per original UI
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

    const handleViewReport = (report) => {
        setSelectedReport(report);
        setIsModalOpen(true);
    };

    const getMeterColor = (meter) => {
        switch (meter) {
            case 'ELECTRIC': return 'bg-purple-50 text-purple-700 border-purple-200';
            case 'WATER': return 'bg-blue-50 text-blue-700 border-blue-200';
            case 'SOLAR': return 'bg-amber-50 text-amber-700 border-amber-200';
            case 'GAS': return 'bg-orange-50 text-orange-700 border-orange-200';
            default: return 'bg-gray-50 text-gray-700 border-gray-200';
        }
    };

    const getStatusColor = (status) => {
        return status === 'Ready'
            ? 'bg-green-50 text-green-700 border-green-200'
            : 'bg-orange-50 text-orange-700 border-orange-200';
    };

    // KPI Calculations
    const totalReports = filteredInitialReports.length;
    const readyReports = filteredInitialReports.filter(r => r.status === 'Ready').length;
    const processingReports = filteredInitialReports.filter(r => r.status === 'Processing').length;
    const downloadedReports = userRole === 'Domestic' ? 12 : 142;

    return (
        <div className="w-full min-h-screen p-6 md:p-8 font-sans">
            {/* Top Header */}
            <div className="p-5 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/50 backdrop-blur-sm sticky top-0 z-30 rounded-[20px] shadow-sm mb-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 w-full">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 text-white shadow-lg transition-transform duration-300 group-hover:scale-105"><FileText size={24} /></div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Reports & Analytics</h1>
                            <p className="text-sm font-medium text-gray-500">Download & manage system reports</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-[1920px] mx-auto space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                    <StatCard title="Total Reports" value={totalReports} icon={<FileText className="w-4 h-4" />} color="orange" description="Available reports" compact />
                    <StatCard title="Ready" value={readyReports} icon={<CheckCircle2 className="w-4 h-4" />} color="green" description="Completed" compact />
                    <StatCard title="Processing" value={processingReports} icon={<Clock className="w-4 h-4" />} color="amber" description="Generating" compact />
                    <StatCard title="Downloads" value={downloadedReports} icon={<Download className="w-4 h-4" />} color="blue" description="Total downloaded" compact />
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col">
                    <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/50 backdrop-blur-sm sticky top-0 z-20 rounded-t-2xl shadow-md shadow-orange-100" ref={dropdownRef}>
                        <div className="relative w-full md:w-80 group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#ff6e00] transition-colors" />
                            <input type="text" placeholder="Search reports..." className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 outline-none focus:ring-2 focus:ring-[#ff6e00]/20 transition-all shadow-md shadow-orange-100" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                            {/* Type Filter */}
                            <div className="relative min-w-[150px]">
                                <button onClick={() => setOpenDropdown(openDropdown === 'type' ? null : 'type')} className={`w-full flex items-center justify-between pl-4 pr-3 py-2.5 bg-gray-50 border rounded-xl text-sm font-bold text-gray-700 transition-all ${openDropdown === 'type' ? 'border-[#ff6e00] ring-2 ring-[#ff6e00]/20' : 'border-gray-200'}`}>
                                    <span className="truncate">{filters.type === 'All' ? 'All Types' : filters.type}</span>
                                    <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${openDropdown === 'type' ? 'rotate-180' : ''}`} />
                                </button>
                                {openDropdown === 'type' && (
                                    <div className="absolute top-full right-0 mt-2 w-full bg-white border border-gray-100 rounded-xl shadow-xl z-50 overflow-hidden text-sm">
                                        {['All', 'Consumption', 'Usage', 'Generation', 'Maintenance', 'Billing'].map(opt => (
                                            <button key={opt} onClick={() => { setFilters('type', opt); setOpenDropdown(null); }} className={`w-full text-left px-4 py-2.5 font-medium hover:bg-orange-50 ${filters.type === opt ? 'text-[#ff6e00] bg-orange-50/50' : 'text-gray-600'}`}>{opt === 'All' ? 'All Types' : opt}</button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Meter Filter */}
                            <div className="relative min-w-[140px]">
                                <button onClick={() => setOpenDropdown(openDropdown === 'meter' ? null : 'meter')} className={`w-full flex items-center justify-between pl-4 pr-3 py-2.5 bg-gray-50 border rounded-xl text-sm font-bold text-gray-700 transition-all ${openDropdown === 'meter' ? 'border-[#ff6e00] ring-2 ring-[#ff6e00]/20' : 'border-gray-200'}`}>
                                    <span className="truncate">{filters.meter === 'All' ? 'All Meters' : filters.meter}</span>
                                    <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${openDropdown === 'meter' ? 'rotate-180' : ''}`} />
                                </button>
                                {openDropdown === 'meter' && (
                                    <div className="absolute top-full right-0 mt-2 w-full bg-white border border-gray-100 rounded-xl shadow-xl z-50 overflow-hidden text-sm">
                                        {['All', 'SOLAR', 'GAS', 'WATER', 'ELECTRIC'].map(opt => (
                                            <button key={opt} onClick={() => { setFilters('meter', opt); setOpenDropdown(null); }} className={`w-full text-left px-4 py-2.5 font-medium hover:bg-orange-50 ${filters.meter === opt ? 'text-[#ff6e00] bg-orange-50/50' : 'text-gray-600'}`}>{opt === 'All' ? 'All Meters' : opt}</button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <button onClick={() => alert("Generate Report modal opening...")} className="flex items-center gap-2 px-4 py-2.5 bg-[#ff6e00] hover:bg-[#e66300] text-white rounded-xl text-sm font-bold shadow-lg shadow-orange-500/30 transition-all active:scale-95">
                                <Plus className="w-5 h-5 stroke-[2.5]" /><span className="hidden sm:inline">Generate Report</span>
                            </button>
                        </div>
                    </div>

                    <div className="overflow-x-auto min-h-[400px] rounded-b-2xl">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-gray-50/50 text-gray-500 text-xs uppercase font-extrabold tracking-wider sticky top-0 z-10 backdrop-blur-md">
                                <tr>
                                    <th className="px-6 py-4 border-b border-gray-100">Report Name</th>
                                    <th className="px-6 py-4 border-b border-gray-100">Type</th>
                                    <th className="px-6 py-4 border-b border-gray-100">Meter</th>
                                    <th className="px-6 py-4 border-b border-gray-100">Period</th>
                                    <th className="px-6 py-4 border-b border-gray-100">Status</th>
                                    <th className="px-6 py-4 border-b border-gray-100 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filteredReports.length > 0 ? (
                                    filteredReports.map((report) => (
                                        <tr key={report.id} className="group hover:bg-orange-50/50 transition-colors cursor-pointer" onClick={() => handleViewReport(report)}>
                                            <td className="px-6 py-4"><div className="flex items-center gap-3"><FileText className="w-5 h-5 text-gray-400 group-hover:text-[#ff6e00]" /><span className="font-bold text-gray-700">{report.name}</span></div></td>
                                            <td className="px-6 py-4 text-sm text-gray-600 font-medium">{report.type}</td>
                                            <td className="px-6 py-4"><span className={`inline-flex px-2.5 py-0.5 rounded text-xs font-bold border ${getMeterColor(report.meter)}`}>{report.meter}</span></td>
                                            <td className="px-6 py-4 text-sm text-gray-500">{report.period}</td>
                                            <td className="px-6 py-4"><div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(report.status)}`}>{report.status}</div></td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button className="p-2 bg-white border border-gray-200 rounded-lg hover:text-blue-600 transition-all"><Eye size={16} /></button>
                                                    <button className="p-2 bg-white border border-gray-200 rounded-lg hover:text-green-600 transition-all disabled:opacity-50" disabled={report.status !== 'Ready'}><Download size={16} /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr><td colSpan={6} className="px-6 py-12 text-center text-gray-400">No reports found</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <ReportDetailsModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} report={selectedReport} />
        </div>
    );
}

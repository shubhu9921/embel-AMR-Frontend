import React, { useState, useRef, useEffect } from 'react';
import {
    FileText,
    Search,
    Filter,
    List,
    LayoutGrid,
    Download,
    Eye,
    Plus,
    BarChart3,
    CheckCircle2,
    Clock,
    ChevronDown
} from 'lucide-react';
import ReportDetailsModal from './ReportDetailsModal';
import { StatCard } from './StatCard';

const initialReports = [
    { id: 1, name: "Monthly Consumption Report", type: "Consumption", meter: "ELECTRIC", period: "December 2024", generated: "2025-01-07", status: "Ready", size: "2.4 MB" },
    { id: 2, name: "Water Usage Summary", type: "Usage", meter: "WATER", period: "Q4 2024", generated: "2025-01-06", status: "Ready", size: "1.8 MB" },
    { id: 3, name: "Solar Generation Analysis", type: "Generation", meter: "SOLAR", period: "2024 Annual", generated: "2025-01-05", status: "Ready", size: "5.2 MB" },
    { id: 4, name: "Gas Consumption Trends", type: "Consumption", meter: "GAS", period: "November 2024", generated: "2025-01-04", status: "Ready", size: "1.5 MB" },
    { id: 5, name: "Device Health Report", type: "Maintenance", meter: "ALL", period: "January 2025", generated: "2025-01-03", status: "Processing", size: "-" },
    { id: 6, name: "Billing Summary Report", type: "Billing", meter: "ELECTRIC", period: "December 2024", generated: "2025-01-02", status: "Ready", size: "890 KB" },
];

export default function ReportsPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [filterReportType, setFilterReportType] = useState("All");
    const [filterMeterType, setFilterMeterType] = useState("All");
    const [reports] = useState(initialReports);
    const [selectedReport, setSelectedReport] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Dropdown states
    const [isTypeFilterOpen, setIsTypeFilterOpen] = useState(false);
    const [isMeterFilterOpen, setIsMeterFilterOpen] = useState(false);

    // Refs for click outside
    const typeFilterRef = useRef(null);
    const meterFilterRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
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



    const handleViewReport = (report) => {
        setSelectedReport(report);
        setIsModalOpen(true);
    };

    const filteredReports = reports.filter(r =>
        (r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            r.type.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (filterReportType === "All" || r.type === filterReportType) &&
        (filterMeterType === "All" || r.meter === filterMeterType)
    );

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
    const totalReports = reports.length;
    const readyReports = reports.filter(r => r.status === 'Ready').length;
    const processingReports = reports.filter(r => r.status === 'Processing').length;

    // Mock downloaded count
    const downloadedReports = 142;

    return (
        <main className="w-full min-h-screen p-4 md:p-6 font-sans">

            {/* Top Header */}
            {/* Top Header */}
            <div className="sticky top-0 z-30 group bg-white/90 backdrop-blur-xl px-6 py-4 rounded-2xl shadow-md transition-all duration-300 hover:shadow-xl hover:bg-orange-50/90 mb-6 mx-1">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 text-white shadow-lg transition-transform duration-300 group-hover:scale-105">
                            <FileText size={24} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                                Reports & Analytics
                            </h1>
                            <p className="text-sm font-medium text-gray-500">
                                Download & manage system reports
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
                        title="Total Reports"
                        value={totalReports}
                        icon={<FileText className="w-4 h-4" />}
                        color="orange"
                        description="Available system reports"
                        compact
                    />
                    <StatCard
                        title="Ready to Download"
                        value={readyReports}
                        icon={<CheckCircle2 className="w-4 h-4" />}
                        color="green"
                        description="Completed generations"
                        compact
                    />
                    <StatCard
                        title="Processing"
                        value={processingReports}
                        icon={<Clock className="w-4 h-4" />}
                        color="amber"
                        description="Currently generating"
                        compact
                    />
                    <StatCard
                        title="Total Downloads"
                        value={downloadedReports}
                        icon={<Download className="w-4 h-4" />}
                        color="blue"
                        description="Cumulative downloads"
                        compact
                    />
                </div>

                {/* Content Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col">

                    {/* Header Controls */}
                    <div className="p-5 border-b border-gray-100 flex flex-col xl:flex-row xl:items-center justify-between gap-4 bg-white/50 backdrop-blur-sm sticky top-0 z-20 rounded-t-2xl">
                        {/* Left: Title & Search */}
                        <div className="flex flex-col md:flex-row md:items-center gap-4 w-full md:w-auto">
                            <div className="relative w-full md:w-80 group">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#ff6e00] transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Search reports..."
                                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 placeholder-gray-400 outline-none focus:ring-2 focus:ring-[#ff6e00]/20 focus:border-[#ff6e00] transition-all shadow-md shadow-orange-100 hover:shadow-orange-200 group-hover:bg-white"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Right: Actions & Filter */}
                        <div className="flex flex-wrap items-center gap-3">
                            {/* Type Filter Dropdown */}
                            <div className="relative min-w-[150px]" ref={typeFilterRef}>
                                <button
                                    onClick={() => setIsTypeFilterOpen(!isTypeFilterOpen)}
                                    className={`w-full flex items-center justify-between pl-4 pr-3 py-2.5 bg-gray-50 border rounded-xl text-sm font-bold text-gray-700 transition-all outline-none shadow-sm shadow-orange-100 hover:shadow-md hover:shadow-orange-200 ${isTypeFilterOpen
                                        ? 'border-[#ff6e00] ring-2 ring-[#ff6e00]/20'
                                        : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    <span className="truncate">
                                        {filterReportType === 'All' ? 'All Types' : filterReportType}
                                    </span>
                                    <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isTypeFilterOpen ? 'rotate-180' : ''}`} />
                                </button>
                                <div className={`absolute top-full right-0 mt-2 w-full bg-white border border-gray-100 rounded-xl shadow-xl z-50 overflow-hidden text-sm transition-all duration-200 origin-top ${isTypeFilterOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
                                    }`}>
                                    {['All', 'Consumption', 'Usage', 'Generation', 'Maintenance', 'Billing'].map((option) => (
                                        <button
                                            key={option}
                                            onClick={() => {
                                                setFilterReportType(option);
                                                setIsTypeFilterOpen(false);
                                            }}
                                            className={`w-full text-left px-4 py-2.5 font-medium transition-colors hover:bg-orange-50 hover:text-[#ff6e00] ${filterReportType === option ? 'text-[#ff6e00] bg-orange-50/50' : 'text-gray-600'
                                                }`}
                                        >
                                            {option === 'All' ? 'All Types' : option}
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
                                        {filterMeterType === 'All' ? 'All Meters' : filterMeterType}
                                    </span>
                                    <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isMeterFilterOpen ? 'rotate-180' : ''}`} />
                                </button>
                                <div className={`absolute top-full right-0 mt-2 w-full bg-white border border-gray-100 rounded-xl shadow-xl z-50 overflow-hidden text-sm transition-all duration-200 origin-top ${isMeterFilterOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
                                    }`}>
                                    {['All', 'SOLAR', 'GAS', 'WATER', 'ELECTRIC'].map((option) => (
                                        <button
                                            key={option}
                                            onClick={() => {
                                                setFilterMeterType(option);
                                                setIsMeterFilterOpen(false);
                                            }}
                                            className={`w-full text-left px-4 py-2.5 font-medium transition-colors hover:bg-orange-50 hover:text-[#ff6e00] ${filterMeterType === option ? 'text-[#ff6e00] bg-orange-50/50' : 'text-gray-600'
                                                }`}
                                        >
                                            {option === 'All' ? 'All Meters' : option}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="h-8 w-[1px] bg-gray-200 mx-1 hidden md:block"></div>

                            {/* Action Buttons */}
                            <button className="flex items-center gap-2 px-4 py-2.5 bg-[#ff6e00] hover:bg-[#e66300] text-white rounded-xl text-sm font-bold shadow-lg shadow-orange-500/30 hover:shadow-orange-500/40 transition-all active:scale-95">
                                <Plus className="w-5 h-5 stroke-[2.5]" />
                                <span className="hidden sm:inline">Generate Report</span>
                            </button>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto min-h-[400px] rounded-b-2xl">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-gray-50/50 text-gray-500 text-xs uppercase font-extrabold tracking-wider sticky top-0 z-10 backdrop-blur-md">
                                <tr>
                                    <th className="px-6 py-4 border-b border-gray-100">Report Name</th>
                                    <th className="px-6 py-4 border-b border-gray-100">Type</th>
                                    <th className="px-6 py-4 border-b border-gray-100">Meter</th>
                                    <th className="px-6 py-4 border-b border-gray-100">Period</th>
                                    <th className="px-6 py-4 border-b border-gray-100 text-center">Generated</th>
                                    <th className="px-6 py-4 border-b border-gray-100">Status</th>
                                    <th className="px-6 py-4 border-b border-gray-100">Size</th>
                                    <th className="px-6 py-4 border-b border-gray-100 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filteredReports.length > 0 ? (
                                    filteredReports.map((report) => (
                                        <tr
                                            key={report.id}
                                            className="group hover:bg-orange-50/50 transition-colors duration-200 cursor-pointer"
                                            onClick={() => handleViewReport(report)}
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-white border border-gray-200 rounded-lg group-hover:border-[#ff6e00] transition-colors">
                                                        <FileText className="w-5 h-5 text-gray-400 group-hover:text-[#ff6e00]" />
                                                    </div>
                                                    <span className="font-bold text-gray-700 group-hover:text-[#ff6e00] transition-colors">{report.name}</span>
                                                </div>
                                            </td>

                                            <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                                                {report.type}
                                            </td>

                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-bold border ${getMeterColor(report.meter)}`}>
                                                    {report.meter}
                                                </span>
                                            </td>

                                            <td className="px-6 py-4 text-sm text-gray-500">
                                                {report.period}
                                            </td>

                                            <td className="px-6 py-4 text-center">
                                                <span className="text-xs font-mono text-gray-500 bg-gray-50 px-2 py-1 rounded border border-gray-100">
                                                    {report.generated}
                                                </span>
                                            </td>

                                            <td className="px-6 py-4">
                                                <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(report.status)}`}>
                                                    {report.status === 'Ready' && <CheckCircle2 className="w-3 h-3" />}
                                                    {report.status === 'Processing' && <Clock className="w-3 h-3 animate-spin" />}
                                                    {report.status}
                                                </div>
                                            </td>

                                            <td className="px-6 py-4 text-sm font-mono text-gray-500">
                                                {report.size}
                                            </td>

                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); handleViewReport(report); }}
                                                        className="p-2 bg-white border border-gray-200 text-gray-600 rounded-lg hover:border-blue-500 hover:text-blue-600 hover:shadow-md transition-all active:scale-90"
                                                        title="View Report"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        className="p-2 bg-white border border-gray-200 text-gray-600 rounded-lg hover:border-green-500 hover:text-green-600 hover:shadow-md transition-all active:scale-90 disabled:opacity-50 disabled:hover:border-gray-200 disabled:hover:text-gray-600 disabled:cursor-not-allowed"
                                                        title="Download"
                                                        disabled={report.status !== 'Ready'}
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        <Download className="w-4 h-4" />
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
                                                <p className="text-lg font-medium text-gray-600">No reports found</p>
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


            <ReportDetailsModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                report={selectedReport}
            />
        </main >
    );
}

import React, { useState } from 'react';
import {
    FileText,
    Search,
    Filter,
    List,
    LayoutGrid,
    Download,
    Eye,
    Plus
} from 'lucide-react';
import ReportDetailsModal from './ReportDetailsModal';

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
    const [showFilters, setShowFilters] = useState(false);
    const [filterReportType, setFilterReportType] = useState("All");
    const [filterMeterType, setFilterMeterType] = useState("All");
    const [reports] = useState(initialReports);
    const [selectedReport, setSelectedReport] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

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
            case 'ELECTRIC': return 'bg-purple-100 text-purple-700';
            case 'WATER': return 'bg-blue-100 text-blue-700';
            case 'SOLAR': return 'bg-amber-100 text-amber-700';
            case 'GAS': return 'bg-orange-100 text-orange-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const getStatusColor = (status) => {
        return status === 'Ready' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700';
    };

    return (
        <main className="flex-1 overflow-y-auto scroll-smooth bg-gray-50">
            <div className="min-h-full">
                {/* Header */}
                <div className="bg-white border-b sticky top-0 z-10 px-6 py-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-800">Reports</h1>
                            <p className="text-sm text-slate-500 mt-1">View and download system reports</p>
                        </div>
                        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition shadow-sm hover:shadow active:scale-95">
                            <Plus className="w-5 h-5" /> GENEREATE REPORT
                        </button>
                    </div>
                </div>

                <div className="p-6 space-y-6">
                    {/* Controls */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
                        <div className="flex flex-col sm:flex-row gap-4 justify-between">
                            <div className="flex flex-wrap gap-3">
                                <div className="relative w-full sm:w-auto">
                                    <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                    <input
                                        placeholder="Search reports..."
                                        className="pl-10 pr-4 py-2.5 bg-slate-100 border-0 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all w-full sm:w-64"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                                <button
                                    onClick={() => setShowFilters(!showFilters)}
                                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition ${showFilters ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                                >
                                    <Filter className="w-5 h-5" /> Filters
                                </button>
                            </div>
                            <div className="flex items-center gap-2 bg-slate-100 rounded-xl p-1">
                                <button className="p-2 rounded-lg transition bg-white shadow-sm text-blue-600">
                                    <List className="w-5 h-5" />
                                </button>
                                <button className="p-2 rounded-lg transition hover:bg-slate-200 text-slate-600">
                                    <LayoutGrid className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {showFilters && (
                            <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-slate-200 animate-in fade-in slide-in-from-top-2 duration-200">
                                <div>
                                    <label className="block text-xs font-medium text-slate-500 mb-1">Report Type</label>
                                    <select
                                        value={filterReportType}
                                        onChange={(e) => setFilterReportType(e.target.value)}
                                        className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer hover:bg-slate-50 transition-colors"
                                    >
                                        <option value="All">All</option>
                                        <option value="Consumption">Consumption</option>
                                        <option value="Usage">Usage</option>
                                        <option value="Generation">Generation</option>
                                        <option value="Maintenance">Maintenance</option>
                                        <option value="Billing">Billing</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-500 mb-1">Meter Type</label>
                                    <select
                                        value={filterMeterType}
                                        onChange={(e) => setFilterMeterType(e.target.value)}
                                        className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer hover:bg-slate-50 transition-colors"
                                    >
                                        <option value="All">All</option>
                                        <option value="SOLAR">SOLAR</option>
                                        <option value="GAS">GAS</option>
                                        <option value="WATER">WATER</option>
                                        <option value="ELECTRIC">ELECTRIC</option>
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
                                        <th className="px-5 py-4 text-left font-semibold">Report Name</th>
                                        <th className="px-5 py-4 text-left font-semibold">Type</th>
                                        <th className="px-5 py-4 text-left font-semibold">Meter</th>
                                        <th className="px-5 py-4 text-left font-semibold">Period</th>
                                        <th className="px-5 py-4 text-left font-semibold">Generated</th>
                                        <th className="px-5 py-4 text-left font-semibold">Status</th>
                                        <th className="px-5 py-4 text-left font-semibold">Size</th>
                                        <th className="px-5 py-4 text-right font-semibold">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {filteredReports.map((report) => (
                                        <tr key={report.id} className="hover:bg-slate-50 transition cursor-pointer">
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-slate-100 rounded-lg">
                                                        <FileText className="w-5 h-5 text-slate-600" />
                                                    </div>
                                                    <span className="font-medium text-slate-800">{report.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-5 py-4 text-slate-600">{report.type}</td>
                                            <td className="px-5 py-4">
                                                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getMeterColor(report.meter)}`}>
                                                    {report.meter}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4 text-slate-600">{report.period}</td>
                                            <td className="px-5 py-4 text-slate-600">{report.generated}</td>
                                            <td className="px-5 py-4">
                                                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusColor(report.status)}`}>
                                                    {report.status}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4 text-slate-600">{report.size}</td>
                                            <td className="px-5 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => handleViewReport(report)}
                                                        className="p-2 hover:bg-blue-100 rounded-lg transition text-blue-600"
                                                        title="View Report"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        className="p-2 hover:bg-green-100 rounded-lg transition text-green-600 disabled:opacity-40 disabled:cursor-not-allowed"
                                                        title="Download"
                                                        disabled={report.status !== 'Ready'}
                                                    >
                                                        <Download className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredReports.length === 0 && (
                                        <tr>
                                            <td colSpan="8" className="px-5 py-8 text-center text-slate-500">
                                                No reports found matching your search.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
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

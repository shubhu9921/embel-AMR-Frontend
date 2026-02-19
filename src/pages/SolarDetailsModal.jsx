import React, { useState } from 'react';
import { X, Calendar, Download, TrendingUp, TrendingDown, Sun, IndianRupee, Activity, FileText, ArrowUpRight, ArrowDownRight, Printer, Eye, Filter } from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend
} from 'recharts';
import { StatCard } from './StatCard';

export default function SolarDetailsModal({ onClose }) {
    // State for Filter Dates (Defaulting to user's request)
    const [startDate, setStartDate] = useState('2026-02-12');
    const [endDate, setEndDate] = useState('2026-02-19');
    const [compareStartDate, setCompareStartDate] = useState('2026-01-19');
    const [compareEndDate, setCompareEndDate] = useState('2026-01-31');
    const [isCompareOn, setIsCompareOn] = useState(true);

    // Get today's date for max validation
    const maxDate = new Date().toISOString().split('T')[0];

    // Helper to format date for display (dd-mm-yyyy)
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const d = new Date(dateString);
        return `${String(d.getDate()).padStart(2, '0')}-${String(d.getMonth() + 1).padStart(2, '0')}-${d.getFullYear()}`;
    };

    // Helper to format date range for charts/tables
    const formatDateRange = (start, end) => {
        return `${start} - ${end}`;
    };


    // Mock Data - Current Period (Matches user request)
    const currentTrendData = [
        { date: '12 Feb', val: 11.2 },
        { date: '13 Feb', val: 12.8 },
        { date: '14 Feb', val: 10.5 },
        { date: '15 Feb', val: 13.1 },
        { date: '16 Feb', val: 12.4 },
        { date: '17 Feb', val: 11.9 },
        { date: '18 Feb', val: 13.8 }, // Match Peak
        { date: '19 Feb', val: 13.0 },
    ];

    // Mock Data - Comparison Period
    const comparisonTrendData = [
        { date: '19 Jan', val: 10.1 },
        { date: '20 Jan', val: 11.2 },
        { date: '21 Jan', val: 11.5 },
        { date: '22 Jan', val: 9.8 },
        { date: '23 Jan', val: 10.4 },
        { date: '24 Jan', val: 12.1 },
        { date: '25 Jan', val: 12.8 },
        { date: '26 Jan', val: 11.9 },
        { date: '27 Jan', val: 11.5 },
        { date: '28 Jan', val: 12.2 },
        { date: '29 Jan', val: 11.8 },
        { date: '30 Jan', val: 12.5 },
        { date: '31 Jan', val: 12.9 },
    ];

    // Source Breakdown Data
    const sourceData = [
        { source: 'Roof A', current: '34.5 kWh', comparison: '58.3 kWh', variance: '-23.8 kWh', trend: '-40.8% ↓' },
        { source: 'Roof B', current: '31.8 kWh', comparison: '50.1 kWh', variance: '-18.3 kWh', trend: '-36.5% ↓' },
        { source: 'Garage', current: '21.2 kWh', comparison: '33.2 kWh', variance: '-12.0 kWh', trend: '-36.1% ↓' },
        { source: 'Backyard', current: '16.2 kWh', comparison: '25.8 kWh', variance: '-9.6 kWh', trend: '-37.2% ↓' },
        { source: 'Total Generation', current: '103.7 kWh', comparison: '167.4 kWh', variance: '-63.7 kWh', trend: '-38.1% ↓', isTotal: true },
        { source: 'Total Usage', current: '77.8 kWh', comparison: '133.9 kWh', variance: '-56.1 kWh', trend: '-41.9% ↓', isTotal: true },
    ];

    // Mock Data - Financial Breakdown
    const financialBreakdown = [
        { item: 'Energy Savings (Self-Consumption)', amount: '₹ 850.00' },
        { item: 'Net Metering Credits (Export)', amount: '₹ 375.20' },
        { item: 'Total Estimated Savings', amount: '₹ 1,225.20', isTotal: true },
    ];

    // Mock Data - Reports
    const reportsList = [
        { id: 1, name: 'Solar_Generation_Report_Jan_2026.pdf', date: '01 Feb 2026', size: '2.4 MB' },
        { id: 2, name: 'Weekly_Efficiency_Analysis_Feb_W1.pdf', date: '08 Feb 2026', size: '1.1 MB' },
        { id: 3, name: 'System_Health_Check_Q1.pdf', date: '10 Feb 2026', size: '850 KB' },
    ];

    const [activeDetail, setActiveDetail] = useState(null); // 'financial' | 'reports' | null
    const [reportFilterDate, setReportFilterDate] = useState('2026-02');
    const [financialFilterDate, setFinancialFilterDate] = useState('2026-02');

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 backdrop-blur-md p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-7xl max-h-[95vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200 border border-gray-100 font-sans relative">

                {/* Header */}
                <div className="flex items-center justify-between px-8 py-5 border-b border-gray-200 bg-white sticky top-0 z-10">
                    <div className="flex items-center gap-4">
                        <div className="p-2 bg-orange-50 text-orange-600 rounded-lg border border-orange-100">
                            <Sun size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 tracking-tight">Solar Generation Breakdown</h2>
                            <p className="text-xs text-gray-500 font-medium">Detailed analysis & comparison</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content - Scrollable */}
                <div className="flex-1 overflow-y-auto bg-gray-50 p-6 md:p-8 space-y-6 relative">

                    {/* Detail Overlay */}
                    {activeDetail && (
                        <div className="absolute inset-0 z-20 bg-gray-50/95 backdrop-blur-sm p-6 md:p-8 flex items-center justify-center animate-in fade-in duration-200">
                            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
                                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                                    <h3 className="font-bold text-gray-900 flex items-center gap-2">
                                        {activeDetail === 'financial' ? <IndianRupee size={18} className="text-emerald-600" /> : <FileText size={18} className="text-indigo-600" />}
                                        {activeDetail === 'financial' ? 'Financial Breakdown' : 'Available Reports'}
                                    </h3>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); setActiveDetail(null); }}
                                        className="p-1 hover:bg-gray-200 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        <X size={18} />
                                    </button>
                                </div>

                                {/* Filters Section */}
                                <div className="px-6 py-3 bg-gray-50 border-b border-gray-100 flex items-center gap-3">
                                    <Filter size={14} className="text-gray-400" />
                                    <span className="text-xs font-bold text-gray-500 uppercase">Filter:</span>
                                    <input
                                        type="month"
                                        max={maxDate.slice(0, 7)}
                                        value={activeDetail === 'financial' ? financialFilterDate : reportFilterDate}
                                        onChange={(e) => activeDetail === 'financial' ? setFinancialFilterDate(e.target.value) : setReportFilterDate(e.target.value)}
                                        className="text-sm border border-gray-200 rounded-lg px-2 py-1 bg-white focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-gray-700"
                                    />
                                </div>

                                <div className="p-0">
                                    {activeDetail === 'financial' && (
                                        <div className="divide-y divide-gray-100">
                                            {financialBreakdown.map((item, idx) => (
                                                <div key={idx} className={`px-6 py-4 flex justify-between items-center ${item.isTotal ? 'bg-emerald-50/50 font-bold text-emerald-900' : 'text-gray-600'}`}>
                                                    <span className="text-sm">{item.item}</span>
                                                    <span className="text-sm font-medium">{item.amount}</span>
                                                </div>
                                            ))}
                                            <div className="px-6 py-4 bg-gray-50 text-xs text-gray-400 text-center">
                                                * Estimated based on current tariff rates.
                                            </div>
                                        </div>
                                    )}

                                    {activeDetail === 'reports' && (
                                        <div className="divide-y divide-gray-100">
                                            {reportsList.map((report) => (
                                                <div key={report.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors group">
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                                                            <FileText size={16} />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-bold text-gray-900">{report.name}</p>
                                                            <p className="text-xs text-gray-400">{report.date} • {report.size}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
                                                            title="View Report"
                                                        >
                                                            <Eye size={18} />
                                                        </button>
                                                        <button
                                                            className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
                                                            title="Download Report"
                                                        >
                                                            <Download size={18} />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                            <div className="px-6 py-4 bg-gray-50 text-center">
                                                <button className="text-xs font-bold text-indigo-600 hover:text-indigo-700 hover:underline">
                                                    View All Archived Reports
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}


                    {/* 1. Date & Controls Section (Horizontal) */}
                    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex flex-col md:flex-row md:items-center gap-6">
                            {/* Current Range */}
                            <div className="flex items-center gap-3">
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Current Range:</span>
                                <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200 hover:border-blue-400 transition-colors cursor-pointer">
                                    <span className="text-sm font-bold text-gray-900">{formatDate(startDate)}</span>
                                    <Calendar size={14} className="text-gray-400" />
                                    <span className="text-gray-300 mx-1">—</span>
                                    <span className="text-sm font-bold text-gray-900">{formatDate(endDate)}</span>
                                    <Calendar size={14} className="text-gray-400" />
                                </div>
                            </div>

                            {/* Compare Range */}
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setIsCompareOn(!isCompareOn)}
                                    className={`px-3 py-0.5 rounded text-xs font-bold shadow-sm transition-colors ${isCompareOn ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-gray-200 text-gray-500 hover:bg-gray-300'}`}
                                >
                                    Compare: {isCompareOn ? 'ON' : 'OFF'}
                                </button>
                                <span className={`text-xs font-bold uppercase tracking-wider ${isCompareOn ? 'text-gray-400' : 'text-gray-300'}`}>With:</span>
                                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border border-dashed transition-colors ${isCompareOn
                                    ? 'bg-white border-gray-200 hover:border-indigo-400'
                                    : 'bg-gray-50 border-gray-100 opacity-50 cursor-not-allowed'}`}>
                                    <input
                                        type="date"
                                        value={compareStartDate}
                                        onChange={(e) => setCompareStartDate(e.target.value)}
                                        max={maxDate}
                                        disabled={!isCompareOn}
                                        className="bg-transparent border-none text-sm font-medium text-gray-600 focus:ring-0 p-0 w-[110px] disabled:cursor-not-allowed"
                                    />
                                    <span className="text-gray-300 mx-1">—</span>
                                    <input
                                        type="date"
                                        value={compareEndDate}
                                        onChange={(e) => setCompareEndDate(e.target.value)}
                                        max={maxDate}
                                        disabled={!isCompareOn}
                                        className="bg-transparent border-none text-sm font-medium text-gray-600 focus:ring-0 p-0 w-[110px] disabled:cursor-not-allowed"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 2. KPI Cards Row (5 Columns) */}
                    {/* 2. KPI Cards Row (5 Columns) */}
                    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                        {/* Card 1: Total Generation */}
                        <div className="bg-white p-5 rounded-2xl shadow-lg shadow-indigo-100/50 relative group hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                            <div className="flex items-center gap-2 mb-3">
                                <Activity size={16} className="text-gray-400" />
                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">TOTAL GENERATION</h3>
                            </div>
                            <div className="flex items-end justify-between">
                                <div>
                                    <p className="text-2xl font-bold text-gray-900">102.1 <span className="text-sm text-gray-400 font-normal">kWh</span></p>
                                </div>
                            </div>
                            <div className="mt-3">
                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-emerald-50 text-emerald-600 text-xs font-bold">
                                    <TrendingUp size={12} /> 0.7%
                                </span>
                            </div>
                        </div>

                        {/* Card 2: Avg Daily */}
                        <div className="bg-white p-5 rounded-2xl shadow-lg shadow-indigo-100/50 relative group hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                            <div className="flex items-center gap-2 mb-3">
                                <Calendar size={16} className="text-gray-400" />
                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">AVG DAILY</h3>
                            </div>
                            <div className="flex items-end justify-between">
                                <div>
                                    <p className="text-2xl font-bold text-gray-900">12.8 <span className="text-sm text-gray-400 font-normal">kWh</span></p>
                                </div>
                            </div>
                            <div className="mt-3">
                                <span className="inline-flex items-center px-2 py-1 rounded bg-gray-100 text-gray-600 text-xs font-bold">
                                    Stable
                                </span>
                            </div>
                        </div>

                        {/* Card 3: Peak Generation */}
                        <div className="bg-white p-5 rounded-2xl shadow-lg shadow-indigo-100/50 relative group hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                            <div className="flex items-center gap-2 mb-3">
                                <Sun size={16} className="text-gray-400" />
                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">PEAK GENERATION</h3>
                            </div>
                            <div className="flex items-end justify-between">
                                <div>
                                    <p className="text-2xl font-bold text-gray-900">13.8 <span className="text-sm text-gray-400 font-normal">kWh</span></p>
                                </div>
                            </div>
                            <div className="mt-3">
                                <p className="text-xs font-medium text-gray-500">18 Feb</p>
                            </div>
                        </div>

                        {/* Card 4: Financial */}
                        <div
                            onClick={() => setActiveDetail('financial')}
                            className="bg-white p-5 rounded-2xl shadow-lg shadow-indigo-100/50 relative group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer ring-1 ring-transparent hover:ring-indigo-500/20"
                        >
                            <div className="flex items-center gap-2 mb-3">
                                <IndianRupee size={16} className="text-gray-400" />
                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">FINANCIAL</h3>
                            </div>
                            <div className="flex items-end justify-between">
                                <div>
                                    <p className="text-2xl font-bold text-gray-900">₹1225.2</p>
                                </div>
                            </div>
                            <div className="mt-3">
                                <span className="inline-flex items-center px-2 py-1 rounded bg-emerald-50 text-emerald-600 text-xs font-bold">
                                    Est. Savings
                                </span>
                            </div>
                        </div>

                        {/* Card 5: Reports */}
                        <div
                            onClick={() => setActiveDetail('reports')}
                            className="bg-white p-5 rounded-2xl shadow-lg shadow-indigo-100/50 relative group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer ring-1 ring-transparent hover:ring-indigo-500/20"
                        >
                            <div className="flex items-center gap-2 mb-3">
                                <FileText size={16} className="text-gray-400" />
                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">REPORTS</h3>
                            </div>
                            <div className="flex items-end justify-between">
                                <div>
                                    <p className="text-2xl font-bold text-gray-900">3 New</p>
                                </div>
                            </div>
                            <div className="mt-3">
                                <button className="px-3 py-1 rounded bg-indigo-50 text-indigo-600 text-xs font-bold hover:bg-indigo-100 transition-colors pointer-events-none">
                                    Download
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* 3. Main Content: Charts & Tables */}
                    {/* 3. Charts Row - Side by Side */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-sm font-bold text-gray-900">Current Range Trend</h3>
                            </div>
                            <div className="h-[250px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={currentTrendData}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                        <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9ca3af', fontWeight: 500 }} dy={10} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9ca3af', fontWeight: 500 }} />
                                        <Tooltip
                                            contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', fontSize: '12px' }}
                                            cursor={{ fill: '#f9fafb' }}
                                        />
                                        <Bar dataKey="val" fill="#f59e0b" radius={[4, 4, 0, 0]} maxBarSize={40} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {isCompareOn && (
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-sm font-bold text-gray-900">Comparison Period Trend</h3>
                                </div>
                                <div className="h-[250px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={comparisonTrendData}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                            <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9ca3af', fontWeight: 500 }} dy={10} minTickGap={10} />
                                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9ca3af', fontWeight: 500 }} />
                                            <Tooltip cursor={{ fill: '#f9fafb' }} contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', fontSize: '12px' }} />
                                            <Bar dataKey="val" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={30} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* 4. Bottom Section: Table & Insights */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Detailed Table (Span 2) */}
                        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/50">
                                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wide">Source Breakdown</h3>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-white text-gray-500 font-semibold border-b border-gray-100">
                                        <tr>
                                            <th className="px-5 py-3 font-semibold text-[10px] uppercase tracking-wider">Source</th>
                                            <th className="px-5 py-3 font-semibold text-[10px] uppercase tracking-wider text-right">
                                                Current Period <br /> <span className="text-[9px] font-normal normal-case">({formatDate(startDate)} - {formatDate(endDate)})</span>
                                            </th>
                                            {isCompareOn && (
                                                <>
                                                    <th className="px-5 py-3 font-semibold text-[10px] uppercase tracking-wider text-right">
                                                        Comparison <br /> <span className="text-[9px] font-normal normal-case">({formatDate(compareStartDate)} to {formatDate(compareEndDate)})</span>
                                                    </th>
                                                    <th className="px-5 py-3 font-semibold text-[10px] uppercase tracking-wider text-right">Variance</th>
                                                    <th className="px-5 py-3 font-semibold text-[10px] uppercase tracking-wider text-right">Trend</th>
                                                </>
                                            )}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {sourceData.map((row, i) => (
                                            <tr key={i} className={`hover:bg-gray-50/50 transition-colors ${row.isTotal ? 'bg-gray-50 font-bold' : ''}`}>
                                                <td className="px-5 py-3 font-bold text-gray-900 text-xs text-nowrap">
                                                    {row.source}
                                                </td>
                                                <td className="px-5 py-3 text-right font-bold text-xs">
                                                    {row.current}
                                                </td>
                                                {isCompareOn && (
                                                    <>
                                                        <td className="px-5 py-3 text-right font-medium text-xs text-gray-500">
                                                            {row.comparison}
                                                        </td>
                                                        <td className={`px-5 py-3 text-right font-bold text-xs ${row.variance.includes('-') ? 'text-rose-500' : 'text-emerald-500'}`}>{row.variance}</td>
                                                        <td className="px-5 py-3 text-right">
                                                            <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold ${row.trend.includes('↓') ? 'text-rose-600 bg-rose-50' : 'text-emerald-600 bg-emerald-50'}`}>
                                                                {row.trend}
                                                            </span>
                                                        </td>
                                                    </>
                                                )}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Smart Insights (Span 1) */}
                        <div className="bg-gradient-to-br from-indigo-900 to-indigo-800 rounded-2xl p-6 text-white shadow-xl shadow-indigo-900/10 relative overflow-hidden h-full">
                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-5">
                                    <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                                        <Activity size={18} className="text-indigo-200" />
                                    </div>
                                    <h3 className="font-bold text-indigo-100 text-sm">AI Insights</h3>
                                </div>
                                <ul className="space-y-4">
                                    <li className="flex gap-3 text-xs text-indigo-100 leading-relaxed font-medium">
                                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
                                        <span>Roof A efficiency dropped by 12% compared to last week.</span>
                                    </li>
                                    <li className="flex gap-3 text-xs text-indigo-100 leading-relaxed font-medium">
                                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
                                        <span>Peak generation aligned with high consumption hours.</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

import React, { useState, useMemo } from 'react';
import { X, Calendar, Download, FileText, CheckCircle, BarChart2, Activity, Filter, MapPin, Gauge, CreditCard, Droplet, Zap, Sun, Flame } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { useData } from '../../context/DataContext';
import { StatCard } from '../dashboard/StatCard';

export default function DomesticConsumptionModal({ onClose, defaultView = 'Total', defaultSource = 'All' }) {
    const { devices, meters, reports, addReport } = useData();
    const [view, setView] = useState(defaultView); // 'Total' or 'Specific'
    const [selectedSource, setSelectedSource] = useState(defaultSource); // 'Water', 'Gas', 'Electric', 'All'

    const [isGeneratingBtn, setIsGeneratingBtn] = useState(false);
    const [showReportForm, setShowReportForm] = useState(false);

    // Date Range Filters
    const today = new Date().toISOString().split('T')[0];
    const [currentDateRange, setCurrentDateRange] = useState({
        start: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
        end: today
    });
    const [comparisonDateRange, setComparisonDateRange] = useState({
        start: new Date(new Date().setDate(new Date().getDate() - 60)).toISOString().split('T')[0],
        end: new Date(new Date().setDate(new Date().getDate() - 31)).toISOString().split('T')[0]
    });
    const [reportDateRange, setReportDateRange] = useState({
        start: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
        end: today
    });

    // Dynamic Isolated Data Aggregation
    const isolatedMeters = useMemo(() => {
        return meters.filter(m => selectedSource === 'All' ? true : m.sourceType?.toLowerCase() === selectedSource.toLowerCase());
    }, [meters, selectedSource]);

    // Mock Chart Data generation based on isolated data scale
    const chartData = useMemo(() => {
        const base = isolatedMeters.reduce((acc, m) => acc + (parseInt(m.consumption) || 0), 0) / 30; // Average per day roughly

        // Generate mock data points based on the difference between start and end dates
        const start = new Date(currentDateRange.start);
        const end = new Date(currentDateRange.end);
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;

        let dataPoints = [];
        const maxPoints = Math.min(diffDays, 14); // Limit to 14 points for readability
        const step = Math.max(1, Math.floor(diffDays / maxPoints));

        for (let i = 0; i < maxPoints; i++) {
            const pointDate = new Date(start);
            pointDate.setDate(start.getDate() + (i * step));

            dataPoints.push({
                name: pointDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                Current: Math.round(base * step * (1 + (Math.random() * 0.4 - 0.1))),
                Previous: Math.round(base * step * (1 + (Math.random() * 0.4 - 0.2)))
            });
        }
        return dataPoints;
    }, [isolatedMeters, currentDateRange, comparisonDateRange]);

    const handleGenerateReport = async () => {
        setIsGeneratingBtn(true);
        try {
            const userName = sessionStorage.getItem('userName') || 'Domestic User';

            const newReport = {
                name: `${selectedSource === 'All' ? 'Total' : selectedSource} Consumption Report`,
                type: "Consumption",
                meter: selectedSource === 'All' ? 'ALL' : selectedSource.toUpperCase(),
                period: `${reportDateRange.start} to ${reportDateRange.end}`,
                generated: new Date().toISOString().split('T')[0],
                status: "Ready",
                size: "1.2 MB",
                userCategory: "Domestic"
            };

            await addReport(newReport);

            setTimeout(() => {
                setIsGeneratingBtn(false);
                setShowReportForm(false);
                alert("Report generated successfully and saved to your Reports list.");
            }, 1200);
        } catch (err) {
            console.error("Failed to generate domestic report", err);
            setIsGeneratingBtn(false);
            alert("Failed to generate report. Please try again later.");
        }
    };

    const getSourceColor = (src) => {
        switch (src?.toLowerCase()) {
            case 'water': return '#3b82f6'; // blue-500
            case 'electric': return '#8b5cf6'; // purple-500
            case 'gas': return '#f97316'; // orange-500
            default: return '#10b981'; // emerald-500
        }
    };

    const sourceColor = getSourceColor(selectedSource);

    return (
        <div
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6 bg-gray-900/50 backdrop-blur-sm animate-in fade-in duration-200"
            role="presentation"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div
                className="bg-[#E3E3E3] flex flex-col rounded-3xl shadow-2xl w-full max-w-5xl h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200"
                role="dialog"
                aria-modal="true"
                aria-labelledby="drilldown-modal-title"
            >

                {/* Header Phase */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-[#E3E3E3] sticky top-0 z-10">
                    <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-2xl ${selectedSource === 'All' ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-700'}`}
                            style={selectedSource !== 'All' ? { backgroundColor: `${sourceColor}20`, color: sourceColor } : {}}
                        >
                            {view === 'Total' ? <BarChart2 size={24} /> : <Activity size={24} />}
                        </div>
                        <div>
                            <h2 id="drilldown-modal-title" className="text-xl font-bold text-gray-900">
                                {view === 'Total' ? 'Total Dashboard Overview' : `${selectedSource} Analytics`}
                            </h2>
                            <p className="text-sm font-medium text-gray-500">
                                {view === 'Total' ? 'Aggregated domestic usage' : 'Detailed consumption comparison'}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {view === 'Specific' && (
                            showReportForm ? (
                                <div className="flex items-center gap-3 bg-white p-1.5 rounded-xl border border-gray-200 shadow-sm animate-in fade-in slide-in-from-right-4 duration-300">
                                    <div className="flex items-center gap-2 px-2">
                                        <span className="text-[10px] font-black tracking-wider text-gray-400 uppercase">Range:</span>
                                        <input
                                            type="date"
                                            className="text-xs font-bold text-gray-600 p-1.5 rounded-lg border border-gray-200 outline-none focus:border-blue-500 bg-white hover:border-gray-300 transition-colors"
                                            value={reportDateRange.start}
                                            onChange={(e) => setReportDateRange(prev => ({ ...prev, start: e.target.value }))}
                                            max={reportDateRange.end || today}
                                        />
                                        <span className="text-gray-300 text-xs font-bold">to</span>
                                        <input
                                            type="date"
                                            className="text-xs font-bold text-gray-600 p-1.5 rounded-lg border border-gray-200 outline-none focus:border-blue-500 bg-white hover:border-gray-300 transition-colors"
                                            value={reportDateRange.end}
                                            onChange={(e) => setReportDateRange(prev => ({ ...prev, end: e.target.value }))}
                                            min={reportDateRange.start}
                                            max={today}
                                        />
                                    </div>
                                    <div className="w-px h-6 bg-gray-200"></div>
                                    <button
                                        onClick={() => setShowReportForm(false)}
                                        className="px-3 py-1.5 text-xs font-bold text-gray-500 hover:text-gray-800 hover:bg-gray-200 rounded-lg transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleGenerateReport}
                                        disabled={isGeneratingBtn}
                                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white shadow-sm transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed rounded-lg"
                                        style={{ backgroundColor: sourceColor }}
                                    >
                                        {isGeneratingBtn ? (
                                            <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            <Download size={14} />
                                        )}
                                        {isGeneratingBtn ? '...' : `Download`}
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <button
                                        onClick={() => setShowReportForm(true)}
                                        className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white shadow-sm hover:shadow-md hover:opacity-90 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed rounded-xl"
                                        style={{ backgroundColor: sourceColor, boxShadow: `0 2px 8px 0 ${sourceColor}40` }}
                                    >
                                        <Download size={16} />
                                        Generate {selectedSource} Report
                                    </button>
                                    <button
                                        onClick={() => { setView('Total'); setSelectedSource('All'); }}
                                        className="px-4 py-2 text-sm font-bold text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors"
                                    >
                                        Back to Total
                                    </button>
                                </>
                            )
                        )}
                        <button
                            onClick={onClose}
                            className="p-2.5 text-gray-400 hover:text-gray-600 hover:bg-gray-200/50 rounded-xl transition-colors"
                            aria-label="Close"
                        >
                            <X size={20} className="stroke-[2.5]" />
                        </button>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#E3E3E3]">

                    {view === 'Total' ? (
                        // View 1: Total Breakdown
                        <div className="space-y-6">
                            <h3 className="text-lg font-bold text-gray-800">Select a Source to Analyze</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                {['Water', 'Electric', 'Gas', 'Solar'].map(src => {
                                    const srcMeters = meters.filter(m => m.sourceType?.toLowerCase() === src.toLowerCase());
                                    const srcTotal = srcMeters.reduce((acc, m) => acc + (parseInt(m.consumption) || 0), 0);

                                    let iconCmp = <Gauge className="w-4 h-4" />;
                                    if (src === 'Water') iconCmp = <Droplet className="w-4 h-4" />;
                                    if (src === 'Electric') iconCmp = <Zap className="w-4 h-4" />;
                                    if (src === 'Gas') iconCmp = <Flame className="w-4 h-4" />;
                                    if (src === 'Solar') iconCmp = <Sun className="w-4 h-4" />;

                                    const colorCls = src === 'Water' ? 'cyan' : src === 'Electric' ? 'green' : src === 'Solar' ? 'amber' : 'orange';

                                    return (
                                        <StatCard
                                            key={src}
                                            title={`${src} Usage`}
                                            value={`${srcTotal.toLocaleString()} ${(src === 'Electric' || src === 'Solar') ? 'kWh' : src === 'Water' ? 'L' : 'm³'}`}
                                            icon={iconCmp}
                                            color={colorCls}
                                            description={`Monthly ${src.toLowerCase()} consumption`}
                                            statusBreakdown={[
                                                { label: 'Active Meters', value: srcMeters.filter(m => m.status === 'Active').length, color: 'text-emerald-500' },
                                                { label: 'Inactive Meters', value: srcMeters.filter(m => m.status !== 'Active').length, color: 'text-red-500' }
                                            ]}
                                            onClick={() => { setView('Specific'); setSelectedSource(src); }}
                                        />
                                    )
                                })}
                            </div>

                            <div className="mt-8 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                                <h4 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
                                    <MapPin className="text-gray-400" size={18} /> Asset Overview
                                </h4>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-extrabold tracking-wider">
                                            <tr>
                                                <th className="px-4 py-3 border-b-2 border-gray-100 rounded-tl-xl">Meter Name</th>
                                                <th className="px-4 py-3 border-b-2 border-gray-100">Source</th>
                                                <th className="px-4 py-3 border-b-2 border-gray-100">Location</th>
                                                <th className="px-4 py-3 border-b-2 border-gray-100 rounded-tr-xl text-right">Consumption</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50">
                                            {meters.map(m => (
                                                <tr key={m.id} className="hover:bg-gray-50/80 transition-colors">
                                                    <td className="px-4 py-3 font-bold text-gray-700 text-sm">{m.meterName}</td>
                                                    <td className="px-4 py-3 text-sm">
                                                        <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-gray-100 text-gray-600">{m.sourceType}</span>
                                                    </td>
                                                    <td className="px-4 py-3 text-sm text-gray-500">{m.meterLocation}, {m.building}</td>
                                                    <td className="px-4 py-3 text-sm font-bold text-gray-900 text-right">{m.consumption}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    ) : (
                        // View 2: Specific Source Drill-down
                        <div className="space-y-6">

                            {/* Controls */}
                            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
                                <div className="flex flex-col md:flex-row items-center gap-4 bg-gray-50 p-2 rounded-xl border border-gray-100 w-full md:w-auto overflow-x-auto">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-bold text-gray-400 whitespace-nowrap">CURRENT:</span>
                                        <input
                                            type="date"
                                            className="text-sm p-1.5 rounded-lg border border-gray-200 outline-none focus:border-blue-500 bg-white hover:border-gray-300 transition-colors"
                                            value={currentDateRange.start}
                                            onChange={(e) => setCurrentDateRange(prev => ({ ...prev, start: e.target.value }))}
                                            max={currentDateRange.end || today}
                                        />
                                        <span className="text-gray-400">to</span>
                                        <input
                                            type="date"
                                            className="text-sm p-1.5 rounded-lg border border-gray-200 outline-none focus:border-blue-500 bg-white hover:border-gray-300 transition-colors"
                                            value={currentDateRange.end}
                                            onChange={(e) => setCurrentDateRange(prev => ({ ...prev, end: e.target.value }))}
                                            min={currentDateRange.start}
                                            max={today}
                                        />
                                    </div>
                                    <div className="hidden md:block w-px h-8 bg-gray-200"></div>
                                    <div className="flex items-center gap-2 opacity-80">
                                        <span className="text-xs font-bold text-gray-400 whitespace-nowrap">COMPARE:</span>
                                        <input
                                            type="date"
                                            className="text-sm p-1.5 rounded-lg border border-gray-200 outline-none focus:border-blue-500 bg-white hover:border-gray-300 transition-colors"
                                            value={comparisonDateRange.start}
                                            onChange={(e) => setComparisonDateRange(prev => ({ ...prev, start: e.target.value }))}
                                            max={comparisonDateRange.end || currentDateRange.start}
                                        />
                                        <span className="text-gray-400">to</span>
                                        <input
                                            type="date"
                                            className="text-sm p-1.5 rounded-lg border border-gray-200 outline-none focus:border-blue-500 bg-white hover:border-gray-300 transition-colors"
                                            value={comparisonDateRange.end}
                                            onChange={(e) => setComparisonDateRange(prev => ({ ...prev, end: e.target.value }))}
                                            min={comparisonDateRange.start}
                                            max={currentDateRange.start}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Specific Source KPI Cards */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                <StatCard
                                    title="Total Consumption"
                                    value={`${isolatedMeters.reduce((acc, m) => acc + (parseInt(m.consumption) || 0), 0).toLocaleString()} ${(selectedSource === 'Electric' || selectedSource === 'Solar') ? 'kWh' : selectedSource === 'Water' ? 'L' : 'm³'}`}
                                    icon={<Activity className="w-4 h-4" />}
                                    color={selectedSource === 'Water' ? 'cyan' : selectedSource === 'Electric' ? 'green' : selectedSource === 'Solar' ? 'amber' : 'orange'}
                                    description={`Aggregate ${selectedSource.toLowerCase()} usage`}
                                    statusBreakdown={[
                                        { label: 'Active Meters', value: isolatedMeters.filter(m => m.status === 'Active').length, color: 'text-green-500' },
                                        { label: 'Inactive Meters', value: isolatedMeters.filter(m => m.status !== 'Active').length, color: 'text-red-500' }
                                    ]}
                                />
                                <StatCard
                                    title="Estimated Bill"
                                    value={`₹${(isolatedMeters.reduce((acc, m) => acc + (parseInt(m.consumption) || 0), 0) * (selectedSource === 'Electric' ? 0.12 : selectedSource === 'Gas' ? 1.4 : 0.05)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                                    icon={<CreditCard className="w-4 h-4" />}
                                    color="amber"
                                    description="Monthly estimated cost"
                                    statusBreakdown={[
                                        { label: 'Paid', value: '0', color: 'text-emerald-500' },
                                        { label: 'Pending', value: '1', color: 'text-amber-500' }
                                    ]}
                                />
                                <StatCard
                                    title="Daily Avg"
                                    value={`${Math.round(isolatedMeters.reduce((acc, m) => acc + (parseInt(m.consumption) || 0), 0) / 30).toLocaleString()} ${selectedSource === 'Water' ? 'L/d' : selectedSource === 'Electric' ? 'kWh/d' : 'm³/d'}`}
                                    icon={<BarChart2 className="w-4 h-4" />}
                                    color="blue"
                                    description="Average daily usage"
                                    statusBreakdown={[
                                        { label: 'Peak Day', value: '12%', color: 'text-blue-500' },
                                        { label: 'Low Day', value: '3%', color: 'text-emerald-500' }
                                    ]}
                                />
                                <StatCard
                                    title="Generated Reports"
                                    value={`${reports.filter(r => r.meter === (selectedSource === 'All' ? 'ALL' : selectedSource.toUpperCase())).length} Files`}
                                    icon={<FileText className="w-4 h-4" />}
                                    color="purple"
                                    description="Available analytics reports"
                                    statusBreakdown={[
                                        { label: 'Ready', value: reports.filter(r => r.meter === (selectedSource === 'All' ? 'ALL' : selectedSource.toUpperCase()) && r.status === 'Ready').length, color: 'text-emerald-500' },
                                        { label: 'Processing', value: reports.filter(r => r.meter === (selectedSource === 'All' ? 'ALL' : selectedSource.toUpperCase()) && r.status === 'Processing').length, color: 'text-amber-500' }
                                    ]}
                                />
                                <StatCard
                                    title="Active Meters"
                                    value={`${isolatedMeters.filter(m => m.status === 'Active').length} Online`}
                                    icon={<CheckCircle className="w-4 h-4" />}
                                    color="emerald"
                                    description="Current operational status"
                                    statusBreakdown={[
                                        { label: 'Online', value: isolatedMeters.filter(m => m.status === 'Active').length, color: 'text-emerald-500' },
                                        { label: 'Offline', value: isolatedMeters.filter(m => m.status !== 'Active').length, color: 'text-red-500' }
                                    ]}
                                />
                            </div>

                            {/* Chart Area */}
                            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                                <h4 className="text-base font-bold text-gray-800 mb-6 flex items-center gap-2">
                                    <BarChart2 className="text-gray-400" size={18} />
                                    Consumption Comparison (Custom)
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[300px] w-full">
                                    {/* Current Chart */}
                                    <div className="flex flex-col h-full bg-gray-50/50 rounded-xl p-4 border border-gray-100">
                                        <h5 className="text-xs font-bold text-gray-400 mb-2 flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: sourceColor }}></span> CURRENT PERIOD
                                        </h5>
                                        <div className="flex-1">
                                            <ResponsiveContainer>
                                                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                                    <defs>
                                                        <linearGradient id="colorCurrent" x1="0" y1="0" x2="0" y2="1">
                                                            <stop offset="5%" stopColor={sourceColor} stopOpacity={0.8} />
                                                            <stop offset="95%" stopColor={sourceColor} stopOpacity={0.3} />
                                                        </linearGradient>
                                                    </defs>
                                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 10, fontWeight: 600 }} dy={10} />
                                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 10, fontWeight: 600 }} dx={-10} />
                                                    <RechartsTooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontWeight: 'bold', color: '#374151' }} cursor={{ fill: '#f3f4f6' }} />
                                                    <Bar dataKey="Current" name="Current Usage" fill="url(#colorCurrent)" radius={[4, 4, 0, 0]} maxBarSize={40} />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>
                                    {/* Compare Chart */}
                                    <div className="flex flex-col h-full bg-gray-50/50 rounded-xl p-4 border border-gray-100">
                                        <h5 className="text-xs font-bold text-gray-400 mb-2 flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-gray-400"></span> COMPARISON PERIOD
                                        </h5>
                                        <div className="flex-1">
                                            <ResponsiveContainer>
                                                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                                    <defs>
                                                        <linearGradient id="colorPrev" x1="0" y1="0" x2="0" y2="1">
                                                            <stop offset="5%" stopColor="#9ca3af" stopOpacity={0.5} />
                                                            <stop offset="95%" stopColor="#9ca3af" stopOpacity={0.2} />
                                                        </linearGradient>
                                                    </defs>
                                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 10, fontWeight: 600 }} dy={10} />
                                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 10, fontWeight: 600 }} dx={-10} />
                                                    <RechartsTooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontWeight: 'bold', color: '#374151' }} cursor={{ fill: '#f3f4f6' }} />
                                                    <Bar dataKey="Previous" name="Compare Usage" fill="url(#colorPrev)" radius={[4, 4, 0, 0]} maxBarSize={40} />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Comparison Data Table */}
                            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm overflow-hidden">
                                <h4 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
                                    <FileText className="text-gray-400" size={18} /> Comparison Data
                                </h4>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-extrabold tracking-wider">
                                            <tr>
                                                <th className="px-4 py-3 border-b-2 border-gray-100 rounded-tl-xl w-1/3">Period</th>
                                                <th className="px-4 py-3 border-b-2 border-gray-100">Current</th>
                                                <th className="px-4 py-3 border-b-2 border-gray-100">Comparison</th>
                                                <th className="px-4 py-3 border-b-2 border-gray-100 rounded-tr-xl text-right">Variance</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50">
                                            {chartData.map((data, idx) => {
                                                const variance = data.Current - data.Previous;
                                                const varPercent = data.Previous ? ((variance / data.Previous) * 100).toFixed(1) : 0;
                                                const isIncrease = variance > 0;

                                                return (
                                                    <tr key={idx} className="hover:bg-gray-50/80 transition-colors">
                                                        <td className="px-4 py-3 font-bold text-gray-700 text-sm whitespace-nowrap">{data.name}</td>
                                                        <td className="px-4 py-3 text-sm font-bold text-gray-900" style={{ color: sourceColor }}>
                                                            {data.Current.toLocaleString()} <span className="text-sm font-bold text-gray-400 ml-1">{(selectedSource === 'Electric' || selectedSource === 'Solar') ? 'kWh' : selectedSource === 'Water' ? 'L' : 'm³'}</span>
                                                        </td>
                                                        <td className="px-4 py-3 text-sm font-bold text-gray-500">
                                                            {data.Previous.toLocaleString()} <span className="text-sm font-bold text-gray-300 ml-1">{(selectedSource === 'Electric' || selectedSource === 'Solar') ? 'kWh' : selectedSource === 'Water' ? 'L' : 'm³'}</span>
                                                        </td>
                                                        <td className="px-4 py-3 text-sm font-bold text-right whitespace-nowrap">
                                                            <span className={`px-2 py-1 rounded-lg text-[11px] font-black uppercase tracking-wider ${isIncrease ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
                                                                {isIncrease ? '↑' : '↓'} {Math.abs(varPercent)}%
                                                            </span>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                        <tfoot className="bg-gray-50/50">
                                            <tr>
                                                <td className="px-4 py-4 font-black text-gray-900 text-sm rounded-bl-xl">Total Aggregated</td>
                                                <td className="px-4 py-4 font-black text-gray-900 text-sm" style={{ color: sourceColor }}>
                                                    {chartData.reduce((acc, curr) => acc + curr.Current, 0).toLocaleString()}
                                                </td>
                                                <td className="px-4 py-4 font-bold text-gray-600 text-sm">
                                                    {chartData.reduce((acc, curr) => acc + curr.Previous, 0).toLocaleString()}
                                                </td>
                                                <td className="px-4 py-4 font-bold text-right rounded-br-xl">
                                                    {/* simple calc */}
                                                    {(() => {
                                                        const tCur = chartData.reduce((acc, curr) => acc + curr.Current, 0);
                                                        const tPrev = chartData.reduce((acc, curr) => acc + curr.Previous, 0);
                                                        const tVar = tCur - tPrev;
                                                        const p = tPrev ? ((tVar / tPrev) * 100).toFixed(1) : 0;
                                                        return (
                                                            <span className={`${tVar > 0 ? 'text-red-600' : 'text-emerald-600'} text-sm`}>
                                                                {tVar > 0 ? '+' : ''}{p}%
                                                            </span>
                                                        );
                                                    })()}
                                                </td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            </div>

                            {/* Detailed breakdown */}
                            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                                <div className="flex justify-between items-center mb-4">
                                    <h4 className="text-base font-bold text-gray-800 flex items-center gap-2">
                                        <Filter className="text-gray-400" size={18} /> Active {selectedSource} Meters
                                    </h4>
                                    <button
                                        onClick={() => {
                                            // Handle closing the modal and potentially navigating to support 
                                            // This requires passing a prop down from DomesticStats, let's just trigger a native alert for now if that prop isn't natively bound, or we can use the parent's nav logic if we passed it.
                                            // Since we didn't pass handleNavToSupport to this modal natively yet, let's close it and redirect via a custom event or straightforward implementation
                                            onClose();
                                            // It's cleaner to just alert or fire a custom event without breaking the modal component contract.
                                            // Real app would pass `onRaiseTicket`
                                            setTimeout(() => {
                                                const event = new CustomEvent('open-support-modal');
                                                window.dispatchEvent(event);
                                            }, 300);
                                        }}
                                        className="px-4 py-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors text-xs font-bold rounded-lg uppercase tracking-wider flex items-center gap-2"
                                    >
                                        Raise Ticket
                                    </button>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                    {isolatedMeters.map(m => (
                                        <div key={m.id} className="p-4 border border-gray-100 rounded-xl bg-gray-50/50 flex flex-col justify-between">
                                            <div className="flex justify-between items-start mb-2">
                                                <span className="font-bold text-gray-800 text-sm">{m.meterName}</span>
                                                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] uppercase font-black rounded">Online</span>
                                            </div>
                                            <div className="text-2xl font-black text-gray-900 tracking-tight mt-2">
                                                {m.consumption} <span className="text-sm font-bold text-gray-400 ml-0.5">{(selectedSource === 'Electric' || selectedSource === 'Solar') ? 'kWh' : selectedSource === 'Water' ? 'L' : 'm³'}</span>
                                            </div>
                                        </div>
                                    ))}
                                    {isolatedMeters.length === 0 && (
                                        <div className="col-span-full text-center p-8 text-gray-400 font-bold border-2 border-dashed border-gray-200 rounded-xl">
                                            No {selectedSource} meters found for your account.
                                        </div>
                                    )}
                                </div>
                            </div>

                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}

import React, { useState, useEffect } from 'react';
import { getPreviousPeriod, formatDate } from '../../utils/dateUtils';
import { X, Calendar, Download, TrendingUp, TrendingDown, Zap, IndianRupee, Activity, FileText, ArrowUpRight, ArrowDownRight, Printer, Eye, Filter } from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
    Label
} from 'recharts';

export default function EnergyDetailsModal({ onClose }) {
    // State for Filter Dates
    const maxDate = new Date().toISOString().split('T')[0];
    const today = new Date().toISOString().split('T')[0];
    // Default start date: 7 days ago
    const defaultStart = new Date();
    defaultStart.setDate(defaultStart.getDate() - 7);
    const defaultStartStr = defaultStart.toISOString().split('T')[0];

    const [startDate, setStartDate] = useState(defaultStartStr);
    const endDate = today; // End date is always current date
    const [isCompareOn, setIsCompareOn] = useState(true);

    // Comparison Date State
    const [compareStartDate, setCompareStartDate] = useState('');
    const [compareEndDate, setCompareEndDate] = useState('');



    // Auto-update comparison dates when primary dates change
    useEffect(() => {
        if (startDate && endDate) {
            const prevPeriod = getPreviousPeriod(startDate, endDate);
            setCompareStartDate(prevPeriod.start);
            setCompareEndDate(prevPeriod.end);
        }
    }, [startDate, endDate]);



    // Helper to generate mock daily data
    const generateTrendData = (start, end, fileBase = 18.2) => {
        if (!start || !end) return [];
        const data = [];
        const curr = new Date(start);
        const last = new Date(end);

        while (curr <= last) {
            const dateStr = `${curr.getDate()} ${curr.toLocaleString('default', { month: 'short' })}`;
            // Deterministic pseudo-random based on date string
            let hash = 0;
            for (let i = 0; i < dateStr.length; i++) {
                hash = Math.imul(31, hash) + dateStr.charCodeAt(i) | 0;
            }
            const pseudoRand = Math.abs(Math.sin(hash));
            // Random value around base with some variance
            const val = +(fileBase + (pseudoRand * 6 - 3)).toFixed(1);
            data.push({ date: dateStr, val });
            curr.setDate(curr.getDate() + 1);
        }
        return data;
    };

    // Generate Dynamic Data
    const currentTrendData = generateTrendData(startDate, endDate, 18.5);
    const comparisonTrendData = generateTrendData(compareStartDate, compareEndDate, 18.5);

    // Calculate KPIs dynamically
    const calculateKPIs = (data) => {
        if (!data || data.length === 0) return { total: '0.0', max: '0.0', avg: '0.0' };
        const total = data.reduce((acc, item) => acc + item.val, 0);
        const max = Math.max(...data.map(item => item.val));
        const avg = total / data.length || 0;
        return { total: total.toFixed(1), max: max.toFixed(1), avg: avg.toFixed(1) };
    };

    const currentKPIs = calculateKPIs(currentTrendData);
    const comparisonKPIs = calculateKPIs(comparisonTrendData);


    // Source Breakdown Data
    const sourceData = [
        { source: 'HVAC', current: '85.2 kWh', comparison: '78.5 kWh', variance: '+6.7 kWh', trend: '+8.5% ↑' },
        { source: 'Lighting', current: '24.5 kWh', comparison: '26.1 kWh', variance: '-1.6 kWh', trend: '-6.1% ↓' },
        { source: 'Appliances', current: '45.8 kWh', comparison: '42.3 kWh', variance: '+3.5 kWh', trend: '+8.2% ↑' },
        { source: 'EV Charger', current: '32.1 kWh', comparison: '28.4 kWh', variance: '+3.7 kWh', trend: '+13.0% ↑' },
        { source: 'Total Usage', current: `${currentKPIs.total} kWh`, comparison: `${comparisonKPIs.total} kWh`, variance: `${(currentKPIs.total - comparisonKPIs.total).toFixed(1)} kWh`, trend: `${(((currentKPIs.total - comparisonKPIs.total) / comparisonKPIs.total) * 100).toFixed(1)}%`, isTotal: true },
    ];

    // Mock Data - Financial Breakdown
    const financialBreakdown = [
        { item: 'Grid Consumption Charges', amount: '₹ 2,450.00' },
        { item: 'Fixed Charges', amount: '₹ 350.00' },
        { item: 'Taxes & Duties', amount: '₹ 120.50' },
        { item: 'Total Estimated Bill', amount: '₹ 2,920.50', isTotal: true },
    ];

    // Mock Data - Reports
    const reportsList = [
        { id: 1, name: 'Energy_Consumption_Report_Jan_2026.pdf', date: '01 Feb 2026', size: '2.1 MB' },
        { id: 2, name: 'Peak_Load_Analysis_Feb_W1.pdf', date: '08 Feb 2026', size: '1.3 MB' },
    ];

    const [activeDetail, setActiveDetail] = useState(null);
    const [reportFilterDate, setReportFilterDate] = useState('2026-02');
    const [financialFilterDate, setFinancialFilterDate] = useState('2026-02');

    // Report Generation State
    const [showReportModal, setShowReportModal] = useState(false);
    const [reportRange, setReportRange] = useState({ start: '', end: '' });

    // Preview State
    const [previewData, setPreviewData] = useState(null);

    const handleGenerateReport = () => {
        // Logic to generate report
        const reportData = {
            range: reportRange,
            generatedAt: new Date().toISOString(),
            summary: {
                totalConsumption: currentKPIs.total,
                avgDaily: currentKPIs.avg,
                peakDemand: currentKPIs.max,
                financials: financialBreakdown
            }
        };
        console.log("Generating Detailed Energy Report:", reportData);
        setShowReportModal(false);
    };

    return (
        <>
            {/* Report Modal */}
            {showReportModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-gray-900">Generate Energy Report</h3>
                            <button onClick={() => setShowReportModal(false)} className="p-1 hover:bg-gray-100 rounded-full text-gray-500 transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Start Date</label>
                                <input type="date" value={reportRange.start} onChange={(e) => setReportRange({ ...reportRange, start: e.target.value })} max={reportRange.end || maxDate} className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">End Date</label>
                                <input type="date" value={reportRange.end} onChange={(e) => setReportRange({ ...reportRange, end: e.target.value })} min={reportRange.start || undefined} max={maxDate} className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                            </div>
                            <div className="pt-4 flex gap-3">
                                <button onClick={() => setShowReportModal(false)} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors">Cancel</button>
                                <button onClick={handleGenerateReport} disabled={!reportRange.start || !reportRange.end} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"><FileText size={16} /> Generate</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Preview Modal */}
            {previewData && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl h-[85vh] flex flex-col animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                {previewData.type === 'financial' ? <IndianRupee size={20} className="text-blue-600" /> : <FileText size={20} className="text-blue-600" />}
                                {previewData.title}
                            </h3>
                            <button onClick={() => setPreviewData(null)} className="p-1 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"><X size={24} /></button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-8 bg-gray-100 flex items-center justify-center">
                            {previewData.type === 'financial' ? (
                                <div className="bg-white p-8 rounded-lg shadow-sm max-w-2xl w-full border border-gray-200">
                                    <div className="text-center mb-8 border-b border-gray-100 pb-6">
                                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600"><Zap size={32} /></div>
                                        <h2 className="text-2xl font-bold text-gray-900">Energy Bill Statement</h2>
                                        <p className="text-gray-500 text-sm">Statement Period: {formatDate(startDate)} to {formatDate(endDate)}</p>
                                    </div>
                                    <div className="space-y-4">
                                        {financialBreakdown.map((item, idx) => (
                                            <div key={idx} className={`flex justify-between items-center p-3 rounded-lg ${item.isTotal ? 'bg-blue-50 border border-blue-100 font-bold text-blue-900 text-lg' : 'border-b border-gray-50 text-gray-600'}`}>
                                                <span>{item.item}</span>
                                                <span>{item.amount}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-white p-0 rounded-lg shadow-sm max-w-3xl w-full h-full flex flex-col border border-gray-200 overflow-hidden">
                                    <div className="bg-gray-700 text-white p-2 flex items-center justify-between text-xs"><span>{previewData.title}</span><div className="flex gap-4"><span>Page 1 / 4</span><span>100%</span></div></div>
                                    <div className="flex-1 bg-white p-12 flex flex-col items-center text-center overflow-y-auto">
                                        <div className="w-full max-w-2xl text-left space-y-8 opacity-75">
                                            <div className="h-8 w-1/3 bg-gray-200 rounded animate-pulse" />
                                            <div className="h-64 w-full bg-gray-50 rounded border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-300 font-bold text-xl uppercase tracking-widest">Report Preview</div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="p-4 border-t border-gray-200 bg-white flex justify-end gap-3">
                            <button onClick={() => setPreviewData(null)} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">Close</button>
                            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"><Download size={18} /> Download</button>
                        </div>
                    </div>
                </div>
            )}

            <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 backdrop-blur-md p-4 animate-in fade-in duration-200">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-7xl max-h-[95vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200 border border-gray-100 font-sans relative">
                    {/* Header */}
                    <div className="flex items-center justify-between px-8 py-5 border-b border-gray-200 bg-white sticky top-0 z-10">
                        <div className="flex items-center gap-4">
                            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg border border-blue-100"><Zap size={24} /></div>
                            <div><h2 className="text-xl font-bold text-gray-900 tracking-tight">Energy Consumption Breakdown</h2><p className="text-xs text-gray-500 font-medium">Detailed analysis & comparison</p></div>
                        </div>
                        <div className="flex items-center gap-3">
                            <button onClick={() => setShowReportModal(true)} className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-600 text-xs font-bold rounded-lg hover:bg-blue-100 transition-colors border border-blue-100"><FileText size={14} /> Generate Report</button>
                            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors"><X size={20} /></button>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto bg-gray-50 p-6 md:p-8 space-y-6 relative">
                        {/* Detail Overlay */}
                        {activeDetail && (
                            <div className="absolute inset-0 z-20 bg-gray-50/95 backdrop-blur-sm p-6 md:p-8 flex items-center justify-center animate-in fade-in duration-200">
                                <div className="bg-white rounded-2xl shadow-xl border border-gray-200 w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
                                    <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                                        <h3 className="font-bold text-gray-900 flex items-center gap-2">
                                            {activeDetail === 'financial' ? <IndianRupee size={18} className="text-blue-600" /> : <FileText size={18} className="text-blue-600" />}
                                            {activeDetail === 'financial' ? 'Financial Breakdown' : 'Available Reports'}
                                        </h3>
                                        <div className="flex items-center gap-2">
                                            {activeDetail === 'financial' && (
                                                <><button onClick={() => setPreviewData({ type: 'financial', title: 'Financial Breakdown', data: financialBreakdown })} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="View Details"><Eye size={18} /></button><button onClick={() => setShowReportModal(true)} className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-sm"><FileText size={14} /> Generate</button></>
                                            )}
                                            {activeDetail === 'reports' && (
                                                <><button onClick={() => setPreviewData({ type: 'report', title: 'Energy Consumption Report', data: null })} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="View Details"><Eye size={18} /></button><button onClick={() => setShowReportModal(true)} className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-sm"><FileText size={14} /> Generate</button></>
                                            )}
                                            <button onClick={(e) => { e.stopPropagation(); setActiveDetail(null); }} className="p-1 hover:bg-gray-200 rounded-full text-gray-400 hover:text-gray-600 transition-colors"><X size={18} /></button>
                                        </div>
                                    </div>
                                    <div className="px-6 py-3 bg-gray-50 border-b border-gray-100 flex items-center gap-3">
                                        <Filter size={14} className="text-gray-400" />
                                        <span className="text-xs font-bold text-gray-500 uppercase">Filter:</span>
                                        <input type="month" max={maxDate.slice(0, 7)} value={activeDetail === 'financial' ? financialFilterDate : reportFilterDate} onChange={(e) => activeDetail === 'financial' ? setFinancialFilterDate(e.target.value) : setReportFilterDate(e.target.value)} className="text-sm border border-gray-200 rounded-lg px-2 py-1 bg-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-gray-700" />
                                    </div>
                                    <div className="p-0">
                                        {activeDetail === 'financial' && (
                                            <div className="divide-y divide-gray-100">
                                                {financialBreakdown.map((item, idx) => (
                                                    <div key={idx} className={`px-6 py-4 flex justify-between items-center ${item.isTotal ? 'bg-blue-50/50 font-bold text-blue-900' : 'text-gray-600'}`}>
                                                        <span className="text-sm">{item.item}</span><span className="text-sm font-medium">{item.amount}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                        {activeDetail === 'reports' && (
                                            <div className="divide-y divide-gray-100">
                                                {reportsList.map((report) => (
                                                    <div key={report.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors group">
                                                        <div className="flex items-center gap-3"><div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><FileText size={16} /></div><div><p className="text-sm font-bold text-gray-900">{report.name}</p><p className="text-xs text-gray-400">{report.date} • {report.size}</p></div></div>
                                                        <div className="flex items-center gap-2">
                                                            <button onClick={() => setPreviewData({ type: 'report', title: report.name, data: report })} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors" title="View Report"><Eye size={18} /></button>
                                                            <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors" title="Download Report"><Download size={18} /></button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Date Controls */}
                        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex flex-col md:flex-row md:items-center gap-6">
                                <div className="flex items-center gap-3">
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Current Range:</span>
                                    <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200 hover:border-blue-400 transition-colors cursor-pointer">
                                        <input
                                            type="date"
                                            value={startDate}
                                            onChange={(e) => setStartDate(e.target.value)}
                                            max={endDate}
                                            className="bg-transparent border-none text-sm font-bold text-gray-900 focus:ring-0 p-0 w-[115px]"
                                        />
                                        <span className="text-gray-300 mx-1">—</span>
                                        <input
                                            type="date"
                                            value={endDate}
                                            disabled
                                            className="bg-transparent border-none text-sm font-bold text-gray-900 focus:ring-0 p-0 w-[115px] opacity-70 cursor-not-allowed"
                                        />
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button onClick={() => setIsCompareOn(!isCompareOn)} className={`px-3 py-0.5 rounded text-xs font-bold shadow-sm transition-colors ${isCompareOn ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-200 text-gray-500 hover:bg-gray-300'}`}>Compare: {isCompareOn ? 'ON' : 'OFF'}</button>
                                    <span className={`text-xs font-bold uppercase tracking-wider ${isCompareOn ? 'text-gray-400' : 'text-gray-300'}`}>With:</span>

                                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border border-dashed transition-colors ${isCompareOn ? 'bg-white border-gray-200 hover:border-blue-400' : 'bg-gray-50 border-gray-100 opacity-50 cursor-not-allowed'}`}>
                                        <input
                                            type="date"
                                            value={compareStartDate}
                                            onChange={(e) => setCompareStartDate(e.target.value)}
                                            disabled={!isCompareOn}
                                            max={compareEndDate}
                                            className={`bg-transparent border-none text-sm font-bold focus:ring-0 p-0 w-[115px] ${isCompareOn ? 'text-gray-900' : 'text-gray-400'}`}
                                        />
                                        <span className="text-gray-300 mx-1">—</span>
                                        <input
                                            type="date"
                                            value={compareEndDate}
                                            onChange={(e) => setCompareEndDate(e.target.value)}
                                            disabled={!isCompareOn}
                                            min={compareStartDate}
                                            max={maxDate}
                                            className={`bg-transparent border-none text-sm font-bold focus:ring-0 p-0 w-[115px] ${isCompareOn ? 'text-gray-900' : 'text-gray-400'}`}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* KPI Cards */}
                        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                            <div className="bg-white p-5 rounded-2xl shadow-lg shadow-blue-100/50 relative group hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                                <div className="flex items-center gap-2 mb-3"><Activity size={16} className="text-gray-400" /><h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">TOTAL CONSUMPTION</h3></div>
                                <div className="flex items-end justify-between"><div><p className="text-2xl font-bold text-gray-900">{currentKPIs.total} <span className="text-sm text-gray-400 font-normal">kWh</span></p></div></div>
                                <div className="mt-3"><span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-rose-50 text-rose-600 text-xs font-bold"><TrendingUp size={12} /> 7.0%</span></div>
                            </div>
                            <div className="bg-white p-5 rounded-2xl shadow-lg shadow-blue-100/50 relative group hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                                <div className="flex items-center gap-2 mb-3"><Calendar size={16} className="text-gray-400" /><h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">AVG DAILY</h3></div>
                                <div className="flex items-end justify-between"><div><p className="text-2xl font-bold text-gray-900">{currentKPIs.avg} <span className="text-sm text-gray-400 font-normal">kWh</span></p></div></div>
                                <div className="mt-3"><span className="inline-flex items-center px-2 py-1 rounded bg-gray-100 text-gray-600 text-xs font-bold">Increasing</span></div>
                            </div>
                            <div className="bg-white p-5 rounded-2xl shadow-lg shadow-blue-100/50 relative group hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                                <div className="flex items-center gap-2 mb-3"><Zap size={16} className="text-gray-400" /><h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">PEAK DEMAND</h3></div>
                                <div className="flex items-end justify-between"><div><p className="text-2xl font-bold text-gray-900">{currentKPIs.max} <span className="text-sm text-gray-400 font-normal">kWh</span></p></div></div>
                                <div className="mt-3"><p className="text-xs font-medium text-gray-500">18 Feb</p></div>
                            </div>
                            <div onClick={() => setActiveDetail('financial')} className="bg-white p-5 rounded-2xl shadow-lg shadow-blue-100/50 relative group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer ring-1 ring-transparent hover:ring-blue-500/20">
                                <div className="flex items-center gap-2 mb-3"><IndianRupee size={16} className="text-gray-400" /><h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">EST. BILL</h3></div>
                                <div className="flex items-end justify-between"><div><p className="text-2xl font-bold text-gray-900">₹2920.5</p></div></div>
                                <div className="mt-3"><span className="inline-flex items-center px-2 py-1 rounded bg-blue-50 text-blue-600 text-xs font-bold">Projected</span></div>
                            </div>
                            <div onClick={() => setActiveDetail('reports')} className="bg-white p-5 rounded-2xl shadow-lg shadow-blue-100/50 relative group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer ring-1 ring-transparent hover:ring-blue-500/20">
                                <div className="flex items-center gap-2 mb-3"><FileText size={16} className="text-gray-400" /><h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">REPORTS</h3></div>
                                <div className="flex items-end justify-between"><div><p className="text-2xl font-bold text-gray-900">2 New</p></div></div>
                                <div className="mt-3"><button className="px-3 py-1 rounded bg-blue-50 text-blue-600 text-xs font-bold hover:bg-blue-100 transition-colors pointer-events-none">Download</button></div>
                            </div>
                        </div>

                        {/* Charts */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-sm font-bold text-gray-900">Current Range Trend ({formatDate(startDate)} - {formatDate(endDate)})</h3>
                                </div>
                                <div className="h-[250px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={currentTrendData}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                            <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9ca3af', fontWeight: 500 }} dy={10} angle={-45} textAnchor="end" height={60}>
                                                <Label value="Date" offset={-20} position="insideBottom" style={{ fill: '#9ca3af', fontSize: '11px', fontWeight: 500 }} />
                                            </XAxis>
                                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9ca3af', fontWeight: 500 }}>
                                                <Label value="Consumption (kWh)" angle={-90} position="insideLeft" style={{ fill: '#9ca3af', fontSize: '11px', fontWeight: 500 }} />
                                            </YAxis>
                                            <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', fontSize: '12px' }} cursor={{ fill: '#f9fafb' }} />
                                            <Bar dataKey="val" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={40} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                            {isCompareOn && (
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="text-sm font-bold text-gray-900">Comparison Period Trend ({formatDate(compareStartDate)} - {formatDate(compareEndDate)})</h3>
                                    </div>
                                    <div className="h-[250px]">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={comparisonTrendData}>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9ca3af', fontWeight: 500 }} dy={10} minTickGap={10} angle={-45} textAnchor="end" height={60}>
                                                    <Label value="Date" offset={-20} position="insideBottom" style={{ fill: '#9ca3af', fontSize: '11px', fontWeight: 500 }} />
                                                </XAxis>
                                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9ca3af', fontWeight: 500 }}>
                                                    <Label value="Consumption (kWh)" angle={-90} position="insideLeft" style={{ fill: '#9ca3af', fontSize: '11px', fontWeight: 500 }} />
                                                </YAxis>
                                                <Tooltip cursor={{ fill: '#f9fafb' }} contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', fontSize: '12px' }} />
                                                <Bar dataKey="val" fill="#94a3b8" radius={[4, 4, 0, 0]} maxBarSize={30} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Bottom Section */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/50"><h3 className="text-xs font-bold text-gray-900 uppercase tracking-wide">Device Breakdown</h3></div>
                                <div className="overflow-x-auto"><table className="w-full text-sm text-left"><thead className="bg-white text-gray-500 font-semibold border-b border-gray-100"><tr><th className="px-5 py-3 text-[10px] uppercase">Source</th><th className="px-5 py-3 text-[10px] uppercase text-right">Current<br /><span className="text-[9px] text-gray-400 normal-case">{formatDate(startDate)} to {formatDate(endDate)}</span></th>{isCompareOn && <><th className="px-5 py-3 text-[10px] uppercase text-right">Comparison<br /><span className="text-[9px] text-gray-400 normal-case">{formatDate(compareStartDate)} to {formatDate(compareEndDate)}</span></th><th className="px-5 py-3 text-[10px] uppercase text-right">Variance</th><th className="px-5 py-3 text-[10px] uppercase text-right">Trend</th></>}</tr></thead><tbody className="divide-y divide-gray-50">{sourceData.map((row, i) => (<tr key={i} className={`hover:bg-gray-50/50 ${row.isTotal ? 'bg-gray-50 font-bold' : ''}`}><td className="px-5 py-3 font-bold text-gray-900 text-xs">{row.source}</td><td className="px-5 py-3 text-right text-xs font-bold">{row.current}</td>{isCompareOn && <><td className="px-5 py-3 text-right text-xs text-gray-500">{row.comparison}</td><td className={`px-5 py-3 text-right text-xs font-bold ${row.variance.includes('+') ? 'text-rose-500' : 'text-emerald-500'}`}>{row.variance}</td><td className="px-5 py-3 text-right"><span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold ${row.trend.includes('↑') ? 'text-rose-600 bg-rose-50' : 'text-emerald-600 bg-emerald-50'}`}>{row.trend}</span></td></>}</tr>))}</tbody></table></div>
                            </div>
                            <div className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-2xl p-6 text-white shadow-xl shadow-blue-900/10">
                                <div className="flex items-center gap-3 mb-5"><div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm"><Activity size={18} className="text-blue-200" /></div><h3 className="font-bold text-blue-100 text-sm">AI Insights</h3></div>
                                <ul className="space-y-4"><li className="flex gap-3 text-xs text-blue-100 font-medium"><div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0" /><span>HVAC usage is 8.5% higher than last week.</span></li><li className="flex gap-3 text-xs text-blue-100 font-medium"><div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0" /><span>Peak demand aligns with EV charging times.</span></li></ul>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
}

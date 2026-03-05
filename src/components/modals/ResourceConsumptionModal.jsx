import React, { useState, useMemo } from 'react';
import { X, Calendar, Download, FileText, CheckCircle, BarChart2, Activity, Filter, MapPin, Gauge, CreditCard, Droplet, Zap, Sun, Flame, ChevronRight, TrendingUp, TrendingDown } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, Legend, Cell } from 'recharts';
import { useData } from '../../context/DataContext';
import { StatCard } from '../dashboard/StatCard';
import { formatCurrency } from '../../utils/formatters';

export default function ResourceConsumptionModal({ onClose, resourceType = 'Water', title = 'Resource', breakdownType = 'consumption' }) {
    const { devices, meters, reports, addReport } = useData();
    const [timeTab, setTimeTab] = useState('Date'); // 'Date', 'Month', 'Year'

    // UI Theme based on resource
    const theme = {
        Water: { color: '#06b6d4', icon: Droplet, unit: 'L' },
        Energy: { color: '#22c55e', icon: Zap, unit: 'kWh' },
        Gas: { color: '#f97316', icon: Flame, unit: 'm³' },
        Solar: { color: '#f59e0b', icon: Sun, unit: 'kWh' }
    }[resourceType] || { color: '#3b82f6', icon: Activity, unit: 'Units' };

    const today = new Date().toISOString().split('T')[0];
    const [dateRange, setDateRange] = useState({
        start: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
        end: today
    });

    // Mock Data Scaling
    const resourceMeters = useMemo(() => {
        const combined = [...devices, ...meters];
        return combined.filter(m => (m.meterType || m.sourceType || '').toLowerCase() === resourceType.toLowerCase());
    }, [devices, meters, resourceType]);

    const totalValueSafe = useMemo(() => {
        return resourceMeters.reduce((acc, m) => acc + parseFloat(m.reading || m.currentFlow || 0), 0);
    }, [resourceMeters]);

    const breakdownData = useMemo(() => {
        const aggregation = { Industrial: 0, Domestic: 0, Others: 0 };
        resourceMeters.forEach(m => {
            const app = (m.application || '').toLowerCase();
            const val = parseFloat(m.reading || m.currentFlow || 0);
            if (app === 'industrial') aggregation.Industrial += val;
            else if (app === 'domestic') aggregation.Domestic += val;
            else aggregation.Others += val;
        });
        return [
            { name: 'Industrial', value: aggregation.Industrial, color: theme.color },
            { name: 'Domestic', value: aggregation.Domestic, color: '#3b82f6' },
            { name: 'Others', value: aggregation.Others, color: '#94a3b8' }
        ];
    }, [resourceMeters, theme.color]);

    const chartData = useMemo(() => {
        const labels = timeTab === 'Date' ? ['01 Mar', '02 Mar', '03 Mar', '04 Mar', '05 Mar'] :
            timeTab === 'Month' ? ['Jan', 'Feb', 'Mar', 'Apr', 'May'] : ['2022', '2023', '2024', '2025', '2026'];

        return labels.map((label, index) => {
            // Using deterministic pseudo-random values for stable charts
            const pseudoRand1 = ((index + 1) * 7.3) % 1;
            const pseudoRand2 = ((index + 1) * 4.1) % 1;
            return {
                name: label,
                current: pseudoRand1 * (totalValueSafe / 5),
                previous: pseudoRand2 * (totalValueSafe / 6)
            };
        });
    }, [timeTab, totalValueSafe]);

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-md animate-in fade-in duration-300">
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-title"
                className="bg-white/95 backdrop-blur-xl rounded-[40px] shadow-2xl w-full max-w-5xl h-[90vh] flex flex-col overflow-hidden border border-white/40 animate-in zoom-in-95 duration-300"
            >

                {/* Header */}
                <div className="p-8 border-b border-gray-100/50 flex items-center justify-between sticky top-0 bg-white/40 backdrop-blur-xl z-20">
                    <div className="flex items-center gap-5">
                        <div className="p-4 rounded-3xl shadow-lg transition-transform hover:scale-110" style={{ background: `linear-gradient(135deg, ${theme.color}, ${theme.color}dd)`, color: 'white' }}>
                            <theme.icon size={32} />
                        </div>
                        <div>
                            <h2 id="modal-title" className="text-3xl font-black text-gray-900 tracking-tight">{resourceType} {breakdownType === 'cost' ? 'Estimated Cost' : 'Consumption'}</h2>
                            <p className="text-sm font-bold text-gray-400">Detailed analytics and breakdown</p>
                        </div>
                    </div>
                    <button onClick={onClose} aria-label="Close modal" className="p-4 hover:bg-gray-100/50 rounded-3xl transition-all active:scale-90 text-gray-400 hover:text-gray-900 shadow-sm border border-transparent hover:border-gray-100">
                        <X size={24} strokeWidth={2.5} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">

                    {/* Controls & Mini Stats */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                        <div className="lg:col-span-8 space-y-6">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                                <div className="flex items-center gap-1 p-1 bg-gray-100/50 rounded-[20px] border border-gray-200/50 w-fit">
                                    {['Date', 'Month', 'Year'].map(tab => (
                                        <button
                                            key={tab}
                                            onClick={() => setTimeTab(tab)}
                                            className={`px-8 py-2.5 rounded-[16px] text-sm font-black transition-all duration-300 ${timeTab === tab ? 'bg-white text-gray-900 shadow-md scale-[1.02]' : 'text-gray-400 hover:text-gray-600'}`}
                                        >
                                            {tab}
                                        </button>
                                    ))}
                                </div>

                                <div className="flex items-center gap-4 bg-white/50 border border-gray-100 px-6 py-3 rounded-2xl shadow-sm">
                                    <div className="flex items-center gap-3">
                                        <Calendar size={18} className="text-orange-500" />
                                        <input type="date" aria-label="Start date" value={dateRange.start} onChange={e => setDateRange(p => ({ ...p, start: e.target.value }))} className="text-sm font-black text-gray-700 outline-none bg-transparent" />
                                        <span className="text-gray-300 font-bold">→</span>
                                        <input type="date" aria-label="End date" value={dateRange.end} onChange={e => setDateRange(p => ({ ...p, end: e.target.value }))} className="text-sm font-black text-gray-700 outline-none bg-transparent" />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="bg-gradient-to-br from-white to-gray-50/50 p-8 rounded-[32px] border border-gray-100 shadow-sm flex flex-col relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                                        <theme.icon size={80} />
                                    </div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Current Total</p>
                                    <h3 className="text-4xl font-black text-gray-900 tracking-tighter mb-4">
                                        {breakdownType === 'cost' ? formatCurrency(totalValueSafe * 0.75) : `${totalValueSafe.toLocaleString()} ${theme.unit}`}
                                    </h3>
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-wider">
                                            <TrendingUp size={12} className="stroke-[3]" />
                                            +5.4%
                                        </div>
                                        <span className="text-[11px] font-bold text-gray-400 italic">vs last period</span>
                                    </div>
                                </div>

                                <div className="bg-gradient-to-br from-white to-gray-50/50 p-8 rounded-[32px] border border-gray-100 shadow-sm flex flex-col relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                                        <Activity size={80} />
                                    </div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Efficiency Score</p>
                                    <h3 className="text-4xl font-black text-gray-900 tracking-tighter mb-4">
                                        92<span className="text-2xl text-gray-300">/100</span>
                                    </h3>
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-wider">
                                            Optimal
                                        </div>
                                        <span className="text-[11px] font-bold text-gray-400 italic">High performance</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-4 bg-gray-900 rounded-[40px] p-8 text-white shadow-2xl relative overflow-hidden flex flex-col justify-between h-full min-h-[300px]">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 blur-[100px] rounded-full -mr-32 -mt-32"></div>
                            <div className="relative z-10">
                                <h4 className="text-xl font-black mb-2 tracking-tight">Quick Insights</h4>
                                <p className="text-gray-400 text-sm font-medium leading-relaxed">Your {resourceType.toLowerCase()} generation/consumption has been consistently rising over the past week, peaking on March 4th. Focus on maintaining current efficiency levels.</p>
                            </div>
                            <div className="relative z-10 space-y-4">
                                <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
                                    <span className="text-xs font-bold text-gray-400 uppercase">Peak Time</span>
                                    <span className="text-sm font-black">14:00 - 16:00</span>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
                                    <span className="text-xs font-bold text-gray-400 uppercase">Daily Average</span>
                                    <span className="text-sm font-black">{Math.round(totalValueSafe / 5).toLocaleString()} {theme.unit}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Chart & Comparison */}
                    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                        <div className="xl:col-span-8 bg-white p-10 rounded-[48px] border border-gray-100 shadow-xl relative group transition-all hover:shadow-2xl">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-10 gap-6">
                                <div>
                                    <h4 className="text-xl font-black text-gray-900 tracking-tight">Usage Analytics</h4>
                                    <p className="text-xs font-bold text-gray-400 mt-1 uppercase tracking-widest">Comparative Trends</p>
                                </div>
                                <div className="flex gap-6 px-6 py-3 bg-gray-50/50 rounded-2xl border border-gray-100">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full shadow-lg" style={{ backgroundColor: theme.color }}></div>
                                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-wider">Current Period</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full bg-gray-200"></div>
                                        <span className="text-[10px] font-black text-gray-300 uppercase tracking-wider">Previous</span>
                                    </div>
                                </div>
                            </div>
                            <div className="h-[400px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }} barGap={12}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 900 }} dy={15} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 900 }} />
                                        <RechartsTooltip
                                            cursor={{ fill: '#f8fafc', radius: 10 }}
                                            contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.15)', padding: '20px', background: 'rgba(255,255,255,0.95)', backdropBlur: '10px' }}
                                        />
                                        <Bar dataKey="previous" fill="#f1f5f9" radius={[8, 8, 8, 8]} barSize={24} />
                                        <Bar dataKey="current" fill={theme.color} radius={[8, 8, 8, 8]} barSize={24} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="xl:col-span-4 flex flex-col gap-6">
                            <h4 className="text-xl font-black text-gray-900 px-2 tracking-tight">Application Breakdown</h4>
                            <div className="grid grid-cols-1 gap-4">
                                {breakdownData.map((item, idx) => {
                                    const percentage = totalValueSafe > 0 ? (item.value / totalValueSafe * 100).toFixed(1) : '0.0';
                                    return (
                                        <div key={idx} className="group p-6 rounded-[32px] bg-white border border-gray-100 hover:border-gray-900/5 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></div>
                                                    <span className="text-xs font-black text-gray-500 uppercase tracking-[0.1em]">{item.name}</span>
                                                </div>
                                                <span className="text-sm font-black text-gray-900 bg-gray-100 px-3 py-1 rounded-full">{percentage}%</span>
                                            </div>
                                            <div className="mt-2 text-2xl font-black text-gray-900 tracking-tight">
                                                {breakdownType === 'cost' ? formatCurrency(item.value * 0.75) : `${item.value.toLocaleString()} ${theme.unit}`}
                                            </div>
                                            <div className="mt-4 h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                                <div className="h-full transition-all duration-1000 ease-out" style={{ width: `${percentage}%`, backgroundColor: item.color }}></div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Comparative Table */}
                    <div className="bg-white rounded-[48px] border border-gray-100 shadow-2xl overflow-hidden group transition-all">
                        <div className="p-10 border-b border-gray-50 flex flex-col sm:flex-row items-center justify-between gap-6 bg-white sticky top-0 z-10 transition-colors group-hover:bg-gray-50/50">
                            <div>
                                <h4 className="text-xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                                    Comparative Analytics
                                </h4>
                                <p className="text-xs font-bold text-gray-400 mt-1 uppercase tracking-widest leading-none">Tabular View</p>
                            </div>
                            <button onClick={() => console.log('Exporting Analysis...')} aria-label="Export Comparative Analysis" className="flex items-center gap-3 px-8 py-3 bg-gray-900 text-white rounded-[20px] text-xs font-black uppercase tracking-widest transition-all active:scale-95 shadow-xl hover:shadow-gray-900/40">
                                <Download size={16} className="stroke-[3]" /> Export Analysis
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-gray-50/50 text-gray-400 text-[10px] uppercase font-black tracking-[0.25em]">
                                    <tr>
                                        <th className="px-10 py-6">Comparison Period</th>
                                        <th className="px-10 py-6 text-right font-black">Performance</th>
                                        <th className="px-10 py-6 text-right font-black">Historical</th>
                                        <th className="px-10 py-6 text-right font-black">Variance Delta</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100/50">
                                    {chartData.map((row, i) => {
                                        const varP = row.previous ? ((row.current - row.previous) / row.previous * 100).toFixed(1) : 0;
                                        const isUp = row.current > row.previous;
                                        return (
                                            <tr key={i} className="group/row hover:bg-gray-50 transition-all cursor-default">
                                                <td className="px-10 py-7">
                                                    <span className="font-black text-gray-900 tracking-tight text-lg">{row.name}</span>
                                                </td>
                                                <td className="px-10 py-7 text-right">
                                                    <span className="font-black text-gray-700 text-lg tabular-nums">{row.current.toLocaleString()}</span>
                                                    <span className="text-[10px] font-bold text-gray-400 ml-1.5">{theme.unit}</span>
                                                </td>
                                                <td className="px-10 py-7 text-right">
                                                    <span className="font-bold text-gray-400 tabular-nums">{row.previous.toLocaleString()}</span>
                                                </td>
                                                <td className="px-10 py-7 text-right">
                                                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-[11px] font-black uppercase tracking-wider shadow-sm transition-transform group-hover/row:scale-110 ${isUp ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'}`}>
                                                        {isUp ? <TrendingUp size={14} className="stroke-[3]" /> : <TrendingDown size={14} className="stroke-[3]" />}
                                                        {Math.abs(varP)}%
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

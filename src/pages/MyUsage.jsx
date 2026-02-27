import React, { useState, useMemo } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
    Cell
} from "recharts";
import {
    Zap,
    Droplet,
    Flame,
    Sun,
    Calendar,
    Download,
    Activity,
    Leaf,
    ArrowUpRight,
    ArrowDownRight,
    ChevronRight,
    Clock
} from "lucide-react";
import { StatCard } from "../components/dashboard/StatCard";

// Helper to format date as YYYY-MM-DD for input
const formatDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

export default function MyUsage() {
    const today = new Date();
    const lastWeek = new Date();
    lastWeek.setDate(today.getDate() - 7);

    const [timeRange, setTimeRange] = useState('week'); // today, week, month, year, custom
    const [startDate, setStartDate] = useState(formatDate(lastWeek));
    const [endDate, setEndDate] = useState(formatDate(today));
    const [activeResource, setActiveResource] = useState('All');
    const [showComparison, setShowComparison] = useState(false);

    // Mock constants for resource styling
    const resourceConfig = {
        Energy: { icon: Zap, color: "blue", hex: "#3b82f6", unit: "kWh", bg: "bg-blue-50", text: "text-blue-600" },
        Water: { icon: Droplet, color: "cyan", hex: "#06b6d4", unit: "L", bg: "bg-cyan-50", text: "text-cyan-600" },
        Gas: { icon: Flame, color: "orange", hex: "#f97316", unit: "m³", bg: "bg-orange-50", text: "text-orange-600" },
        Solar: { icon: Sun, color: "amber", hex: "#f59e0b", unit: "kWh", bg: "bg-amber-50", text: "text-amber-600" },
    };

    // Advanced Data Generator based on filters
    // Seeded Random to satisfy purity rules
    const seedRandom = (seed) => {
        const x = Math.sin(seed++) * 10000;
        return x - Math.floor(x);
    };

    const memoToday = useMemo(() => new Date(), []);
    const todayStr = useMemo(() => formatDate(memoToday), [memoToday]);

    // Advanced Data Generator based on filters
    const usageData = useMemo(() => {
        // Use timeRange, startDate and endDate to influence seed
        const inputSeed = (timeRange.length * 100) +
            (startDate.split('-').reduce((a, b) => a + parseInt(b), 0)) +
            (endDate.split('-').reduce((a, b) => a + parseInt(b), 0));

        const data = [];
        if (timeRange === 'today' || (timeRange === 'custom' && startDate === endDate && endDate === todayStr)) {
            const intervals = ["00:00", "04:00", "08:00", "12:00", "16:00", "20:00"];
            intervals.forEach((time, idx) => {
                const s = inputSeed + idx;
                data.push({
                    time,
                    Energy: seedRandom(s) * 2,
                    Water: seedRandom(s + 1) * 15,
                    Gas: seedRandom(s + 2) * 0.5,
                    Solar: (parseInt(time) >= 8 && parseInt(time) <= 16) ? seedRandom(s + 3) * 3 : 0
                });
            });
        } else if (timeRange === 'week') {
            const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
            days.forEach((day, idx) => {
                const s = inputSeed + idx;
                data.push({
                    time: day,
                    Energy: 10 + seedRandom(s) * 10,
                    Water: 80 + seedRandom(s + 1) * 50,
                    Gas: 1 + seedRandom(s + 2) * 2,
                    Solar: 15 + seedRandom(s + 3) * 10
                });
            });
        } else if (timeRange === 'month') {
            for (let i = 1; i <= 4; i++) {
                const s = inputSeed + i;
                data.push({
                    time: `Week ${i}`,
                    Energy: 70 + seedRandom(s) * 40,
                    Water: 500 + seedRandom(s + 1) * 200,
                    Gas: 10 + seedRandom(s + 2) * 10,
                    Solar: 100 + seedRandom(s + 3) * 50
                });
            }
        } else if (timeRange === 'year') {
            const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            months.forEach((month, idx) => {
                const s = inputSeed + idx;
                data.push({
                    time: month,
                    Energy: 300 + seedRandom(s) * 200,
                    Water: 2000 + seedRandom(s + 1) * 1000,
                    Gas: 40 + seedRandom(s + 2) * 30,
                    Solar: 400 + seedRandom(s + 3) * 300
                });
            });
        } else {
            // Custom Range Selection
            const start = new Date(startDate);
            const end = new Date(endDate);
            const diffTime = Math.abs(end - start);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays <= 1) {
                // If same day or 1 day diff, show hourly-like intervals
                ["00:00", "08:00", "16:00", "23:59"].forEach((time, idx) => {
                    const s = inputSeed + idx;
                    data.push({
                        time: `${startDate} ${time}`,
                        Energy: seedRandom(s) * 5,
                        Water: seedRandom(s + 1) * 30,
                        Gas: seedRandom(s + 2) * 1,
                        Solar: seedRandom(s + 3) * 5
                    });
                });
            } else {
                // For longer ranges, show start, mid, and end points
                const middleDate = new Date(start.getTime() + (diffTime / 2));
                [start, middleDate, end].forEach((date, idx) => {
                    const s = inputSeed + idx;
                    data.push({
                        time: formatDate(date),
                        Energy: 20 + seedRandom(s) * 30,
                        Water: 150 + seedRandom(s + 1) * 100,
                        Gas: 5 + seedRandom(s + 2) * 5,
                        Solar: 25 + seedRandom(s + 3) * 20
                    });
                });
            }
        }
        return data;
    }, [timeRange, startDate, endDate, todayStr]);

    const prevUsageData = useMemo(() => {
        const inputSeed = (timeRange.length * 50) +
            (startDate.split('-').reduce((a, b) => a + parseInt(b), 0)) +
            (endDate.split('-').reduce((a, b) => a + parseInt(b), 0)) + 999;
        return usageData.map((d, idx) => {
            const s = inputSeed + idx;
            return {
                ...d,
                Energy: d.Energy * (0.8 + seedRandom(s) * 0.4),
                Water: d.Water * (0.8 + seedRandom(s + 1) * 0.4),
                Gas: d.Gas * (0.8 + seedRandom(s + 2) * 0.4),
                Solar: d.Solar * (0.8 + seedRandom(s + 3) * 0.4),
            };
        });
    }, [usageData, timeRange, startDate, endDate]);

    const totals = useMemo(() => {
        return {
            Energy: usageData.reduce((p, c) => p + c.Energy, 0),
            Water: usageData.reduce((p, c) => p + c.Water, 0),
            Gas: usageData.reduce((p, c) => p + c.Gas, 0),
            Solar: usageData.reduce((p, c) => p + c.Solar, 0),
        };
    }, [usageData]);

    const prevTotals = useMemo(() => {
        return {
            Energy: prevUsageData.reduce((p, c) => p + c.Energy, 0),
            Water: prevUsageData.reduce((p, c) => p + c.Water, 0),
            Gas: prevUsageData.reduce((p, c) => p + c.Gas, 0),
            Solar: prevUsageData.reduce((p, c) => p + c.Solar, 0),
        };
    }, [prevUsageData]);

    const handleExport = () => {
        alert(`Exporting ${timeRange} usage data...`);
    };

    return (
        <main className="w-full flex flex-col gap-6 min-h-screen mb-20 px-4 md:px-6 py-6 font-sans pt-6 md:pt-8">
            <div className="max-w-[1500px] xl:mx-auto w-full flex flex-col gap-6 lg:gap-8">
                {/* Header */}
                <header className="p-5 border-b border-gray-100 flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white/70 backdrop-blur-xl sticky top-0 z-30 rounded-3xl shadow-sm lg:shadow-xl shadow-gray-200/50 border border-white/50 mb-4">
                    <div className="flex items-center gap-4 flex-shrink-0">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg">
                            <Activity size={24} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">My Usage</h1>
                            <p className="text-sm font-medium text-gray-500">Real-time monitoring and analytics</p>
                        </div>
                    </div>

                    {/* Filters Section (Center/Middle on Large) */}
                    <div className="flex flex-wrap items-center lg:justify-center gap-4 flex-grow">
                        <div className="flex p-1 bg-gray-100 rounded-xl">
                            {['today', 'week', 'month', 'year'].map(t => (
                                <button
                                    key={t}
                                    onClick={() => { setTimeRange(t); setShowComparison(false); }}
                                    className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${timeRange === t ? 'bg-indigo-600 shadow-md text-white' : 'text-gray-500 hover:text-gray-800'}`}
                                >
                                    {t.charAt(0).toUpperCase() + t.slice(1)}
                                </button>
                            ))}
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-xl group focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
                                <span className="text-[10px] font-bold text-gray-400">From</span>
                                <input
                                    type="date"
                                    value={startDate}
                                    max={endDate}
                                    onChange={(e) => {
                                        setStartDate(e.target.value);
                                        setTimeRange('custom');
                                        setShowComparison(true);
                                    }}
                                    className="bg-transparent border-none outline-none text-xs font-bold text-gray-700 w-28"
                                />
                            </div>
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-xl group focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
                                <span className="text-[10px] font-bold text-gray-400">To</span>
                                <input
                                    type="date"
                                    value={endDate}
                                    min={startDate}
                                    max={formatDate(today)}
                                    onChange={(e) => {
                                        setEndDate(e.target.value);
                                        setTimeRange('custom');
                                        setShowComparison(true);
                                    }}
                                    className="bg-transparent border-none outline-none text-xs font-bold text-gray-700 w-28"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Export Button (Right Side on Large) */}
                    <div className="flex items-center lg:justify-end flex-shrink-0">
                        <button
                            onClick={handleExport}
                            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-200 transition-all active:scale-95 group"
                        >
                            <Download size={18} className="group-hover:translate-y-[-2px] transition-transform" />
                            <span>Export Report</span>
                        </button>
                    </div>
                </header>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.entries(resourceConfig).map(([key, config]) => (
                        <StatCard
                            key={key}
                            title={`${key} Total`}
                            value={`${totals[key].toFixed(1)} ${config.unit}`}
                            icon={<config.icon />}
                            color={config.color}
                            description={`Total for this ${timeRange}`}
                        />
                    ))}
                </div>

                {/* Main Content: Graph & Table Side by Side (50/50 Split) */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    {/* Visual Section (Graph) */}
                    <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 p-6 flex flex-col h-full">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 border-l-4 border-indigo-500 pl-3 flex items-center gap-2">
                                    <Activity className="text-indigo-500" size={20} />
                                    Consumption Trends
                                </h3>
                                <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mt-1">Resource allocation over time</p>
                            </div>
                            <div className="flex gap-2">
                                <div className="flex p-1 bg-gray-50 border border-gray-100 rounded-lg">
                                    <button
                                        onClick={() => setActiveResource('All')}
                                        className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${activeResource === 'All' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-500'}`}
                                    >
                                        All
                                    </button>
                                    {Object.keys(resourceConfig).map(res => (
                                        <button
                                            key={res}
                                            onClick={() => setActiveResource(res)}
                                            className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${activeResource === res ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-500'}`}
                                        >
                                            {res}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="h-[450px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={usageData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis
                                        dataKey="time"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 600 }}
                                        dy={10}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 600 }}
                                    />
                                    <Tooltip
                                        cursor={{ fill: '#f8fafc', radius: 4 }}
                                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
                                    />
                                    <Legend verticalAlign="top" height={36} iconType="circle" />

                                    {activeResource === 'All' ? (
                                        Object.entries(resourceConfig).map(([key, config]) => (
                                            <Bar key={key} dataKey={key} fill={config.hex} radius={[4, 4, 0, 0]} barSize={20} />
                                        ))
                                    ) : (
                                        <Bar dataKey={activeResource} fill={resourceConfig[activeResource].hex} radius={[6, 6, 0, 0]} barSize={40}>
                                            {usageData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={resourceConfig[activeResource].hex} />
                                            ))}
                                        </Bar>
                                    )}
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Comparison Mini Section (if year or custom selected) */}
                        {(timeRange === 'year' || showComparison) && (
                            <div className="mt-8 pt-6 border-t border-gray-100">
                                <div className="flex items-center justify-between mb-4">
                                    <h4 className="text-sm font-bold text-gray-800">Historical Comparison</h4>
                                    <span className="text-[10px] font-bold text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded">Previous vs Current</span>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {Object.keys(resourceConfig).map(res => {
                                        const diff = prevTotals[res] > 0
                                            ? ((totals[res] - prevTotals[res]) / prevTotals[res]) * 100
                                            : (totals[res] > 0 ? 100 : 0);
                                        const isUp = diff > 0;
                                        return (
                                            <div key={res} className="p-3 bg-gray-50 rounded-2xl border border-gray-100">
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">{res}</p>
                                                <div className="flex items-baseline gap-2">
                                                    <span className="text-lg font-bold text-gray-900">{totals[res].toFixed(1)}</span>
                                                    <span className={`flex items-center text-[10px] font-bold ${isUp ? 'text-red-500' : 'text-emerald-500'}`}>
                                                        {isUp ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                                                        {Math.abs(diff).toFixed(1)}%
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Data Section (Table) - Refactored for better alignment and no scroll */}
                    <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 flex flex-col overflow-hidden h-full">
                        <div className="p-6 border-b border-gray-50 bg-gray-50/50">
                            <h3 className="text-xl font-bold text-gray-900 border-l-4 border-indigo-500 pl-3 flex items-center gap-2">
                                <Activity className="text-indigo-500" size={20} />
                                Source Breakdown
                            </h3>
                            <p className="text-xs text-gray-500 mt-1 pl-4 uppercase tracking-wider font-medium">Consumption values for {timeRange === 'custom' ? `${startDate} to ${endDate}` : timeRange}</p>
                        </div>
                        <div className="flex-1 overflow-auto max-h-[510px] custom-scrollbar scroll-smooth">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-gray-50 sticky top-0 z-20 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
                                    <tr>
                                        <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">Interval</th>
                                        {Object.keys(resourceConfig).map(key => (
                                            <th key={key} className="px-4 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 text-right">{key}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {usageData.map((row, idx) => (
                                        <tr key={`${row.time}-${idx}`} className="group hover:bg-indigo-50/30 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <Clock size={12} className="text-indigo-500" />
                                                    <span className="text-sm font-bold text-gray-900">{row.time}</span>
                                                </div>
                                            </td>
                                            {Object.entries(resourceConfig).map(([key, config]) => (
                                                <td key={key} className="px-4 py-4 text-right">
                                                    <div className="flex flex-col items-end">
                                                        <span className="text-sm font-black text-gray-900">{row[key].toFixed(1)}</span>
                                                        <span className="text-[9px] text-gray-400 font-bold uppercase tracking-tighter">{config.unit}</span>
                                                    </div>
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {/* Final Total Row */}
                        <div className="p-6 bg-indigo-600 text-white rounded-t-3xl shadow-2xl mt-auto">
                            <div className="flex items-center justify-between mb-4">
                                <h4 className="font-bold text-indigo-100 text-xs uppercase tracking-widest">Total Period Consumption</h4>
                                <ChevronRight size={16} className="text-indigo-300" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                {Object.entries(totals).map(([key, val]) => (
                                    <div key={key}>
                                        <p className="text-[10px] font-bold text-indigo-200 uppercase">{key}</p>
                                        <p className="text-lg font-black">{val.toFixed(1)} <span className="text-[10px] opacity-70">{resourceConfig[key].unit}</span></p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Impact Section */}
                <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl shadow-2xl p-8 relative overflow-hidden group">
                    <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                        <div className="p-5 bg-white/20 rounded-3xl backdrop-blur-xl border border-white/30 shadow-inner group-hover:scale-110 transition-transform duration-500">
                            <Leaf size={48} className="text-emerald-100" />
                        </div>
                        <div className="text-center md:text-left">
                            <h3 className="text-3xl font-black text-white mb-2 tracking-tight">Environmental Contribution</h3>
                            <p className="text-emerald-100 font-bold max-w-xl text-lg leading-snug opacity-90">
                                Your commitment to solar energy and efficient resource management has significantly offset local grid demand.
                            </p>
                            <div className="flex flex-wrap gap-4 mt-8 justify-center md:justify-start">
                                <div className="bg-white text-emerald-600 px-6 py-3 rounded-2xl font-black shadow-xl hover:translate-y-[-4px] transition-all">
                                    <span className="text-2xl mr-2">45</span>
                                    <span className="text-sm uppercase tracking-wider">Trees Equiv.</span>
                                </div>
                                <div className="bg-emerald-400/30 backdrop-blur-md text-white border border-white/20 px-6 py-3 rounded-2xl font-black shadow-xl hover:translate-y-[-4px] transition-all">
                                    <span className="text-2xl mr-2">120kg</span>
                                    <span className="text-sm uppercase tracking-wider">CO₂ Saved</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Decorative Pattern */}
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Sun size={300} strokeWidth={1} />
                    </div>
                </div>
            </div>
        </main>
    );
}

import React, { useState } from 'react';
import { IndianRupee, Gauge, List, AlertTriangle, Download, CreditCard } from 'lucide-react';
import { StatCard } from '../components/dashboard/StatCard';
import { TimeFilter } from '../components/dashboard/TimeFilter';
import { DeviceCard } from '../components/dashboard/DeviceCard';
import { AlertsPanel } from '../components/dashboard/AlertsPanel';
import { MetersModal } from '../components/MetersModal';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Label,
    PieChart, Pie, Cell
} from 'recharts';

/* -------------------- SHARED HELPERS -------------------- */
const CustomPieTooltip = ({ active, payload, totalBreakdown }) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        const percent = totalBreakdown > 0 ? ((data.value / totalBreakdown) * 100).toFixed(1) : '0.0';
        return (
            <div className="bg-white p-3 rounded-lg shadow-xl border border-gray-100 text-xs z-50">
                <p className="font-bold mb-1" style={{ color: data.color }}>{data.name}</p>
                <div className="flex justify-between gap-4 text-gray-600">
                    <span>Count:</span>
                    <span className="font-mono font-medium">{data.value}</span>
                </div>
                <div className="flex justify-between gap-4 text-gray-600">
                    <span>Share:</span>
                    <span className="font-mono font-medium">{percent}%</span>
                </div>
            </div>
        );
    }
    return null;
};

/* -------------------- MAIN COMPONENT -------------------- */
export default function ResourceDashboard({
    title,
    icon,
    colorWithGradient,
    colorTheme = 'blue', // 'blue', 'green', 'orange', 'emerald', 'amber', 'cyan'
    kpiData = [],
    chartData = {},
    breakdownData = [],
    alerts = [],
    meters = [],
    systemParams = [],
    meterModalTitle = "Meters List",
    chartTitle = "Consumption Overview",
    meterSectionTitle = "Meters",
    flowUnit = "Unit",
    withGreeting = false, // New Prop
    greetingTitle = "Hello, Domestic User! 👋", // New Prop
    greetingSubtitle = "Here's your home's resource overview.", // New Prop
    onDownloadReport, // New Prop
    onPayBill, // New Prop
    children
}) {
    const [timeRange, setTimeRange] = useState('week');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const themeMap = {
        cyan: {
            light: 'bg-cyan-50',
            text: 'text-cyan-600',
            border: 'border-cyan-200',
            bar: '#06b6d4',
            iconBg: 'bg-cyan-50',
            gradientFrom: 'from-cyan-500',
            gradientTo: 'to-blue-500',
            hoverBg: 'hover:bg-cyan-50/90',
            lineStart: 'from-cyan-400',
            lineEnd: 'to-blue-500',
            systemGradient: 'from-white to-cyan-100/60',
            systemBorderHover: 'hover:border-cyan-300',
            groupHoverText: 'group-hover:text-cyan-600'
        },
        emerald: {
            light: 'bg-emerald-50',
            text: 'text-emerald-600',
            border: 'border-emerald-200',
            bar: '#10b981',
            iconBg: 'bg-emerald-50',
            gradientFrom: 'from-emerald-500',
            gradientTo: 'to-teal-500',
            hoverBg: 'hover:bg-emerald-50/90',
            lineStart: 'from-emerald-400',
            lineEnd: 'to-teal-500',
            systemGradient: 'from-white to-emerald-100/60',
            systemBorderHover: 'hover:border-emerald-300',
            groupHoverText: 'group-hover:text-emerald-600'
        },
        green: { // NEW: Added green theme definition
            light: 'bg-green-50',
            text: 'text-green-600',
            border: 'border-green-200',
            bar: '#22c55e',
            iconBg: 'bg-green-50',
            gradientFrom: 'from-green-500',
            gradientTo: 'to-emerald-500',
            hoverBg: 'hover:bg-green-50/90',
            lineStart: 'from-green-400',
            lineEnd: 'to-emerald-500',
            systemGradient: 'from-white to-green-100/60',
            systemBorderHover: 'hover:border-green-300',
            groupHoverText: 'group-hover:text-green-600'
        },
        orange: {
            light: 'bg-orange-50',
            text: 'text-orange-600',
            border: 'border-orange-200',
            bar: '#f97316',
            iconBg: 'bg-orange-50',
            gradientFrom: 'from-orange-500',
            gradientTo: 'to-red-500',
            hoverBg: 'hover:bg-orange-50/90',
            lineStart: 'from-orange-400',
            lineEnd: 'to-red-500',
            systemGradient: 'from-white to-orange-100/60',
            systemBorderHover: 'hover:border-orange-300',
            groupHoverText: 'group-hover:text-orange-600'
        },
        amber: {
            light: 'bg-amber-50',
            text: 'text-amber-600',
            border: 'border-amber-200',
            bar: '#f59e0b',
            iconBg: 'bg-amber-50',
            gradientFrom: 'from-amber-400',
            gradientTo: 'to-yellow-500',
            hoverBg: 'hover:bg-amber-50/90',
            lineStart: 'from-amber-400',
            lineEnd: 'to-yellow-500',
            systemGradient: 'from-white to-amber-100/60',
            systemBorderHover: 'hover:border-amber-300',
            groupHoverText: 'group-hover:text-amber-600'
        },
        blue: {
            light: 'bg-blue-50',
            text: 'text-blue-600',
            border: 'border-blue-200',
            bar: '#3b82f6',
            iconBg: 'bg-blue-50',
            gradientFrom: 'from-blue-500',
            gradientTo: 'to-indigo-500',
            hoverBg: 'hover:bg-blue-50/90',
            lineStart: 'from-blue-400',
            lineEnd: 'to-indigo-500',
            systemGradient: 'from-white to-blue-100/60',
            systemBorderHover: 'hover:border-blue-300',
            groupHoverText: 'group-hover:text-blue-600'
        }
    };

    const theme = themeMap[colorTheme] || themeMap.blue;

    // Data selection
    const getCurrentData = () => {
        switch (timeRange.toLowerCase()) {
            case 'day': return chartData.day || [];
            case 'week': return chartData.week || [];
            case 'month': return chartData.month || [];
            case 'year': return chartData.year || [];
            default: return chartData.week || [];
        }
    };
    const currentChartData = getCurrentData();
    const totalBreakdown = breakdownData.reduce((acc, cur) => acc + cur.value, 0);

    const dataKey = currentChartData.length > 0
        ? (currentChartData[0].usage !== undefined ? 'usage' : (currentChartData[0].generation !== undefined ? 'generation' : 'value'))
        : 'value';

    const yAxisLabel = dataKey === 'generation' ? `Generation (${flowUnit})` : `Consumption (${flowUnit === 'kW' ? 'kWh' : (flowUnit === 'm³/h' ? 'm³' : 'L')})`;


    return (
        <div className="w-full h-full flex flex-col overflow-y-auto">
            <MetersModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={meterModalTitle}
                meters={meters}
                colorClass={theme.text}
                bgClass={theme.light}
            />

            {/* Header */}
            {withGreeting ? (
                <div className="p-5 border-b border-gray-100 flex flex-col xl:flex-row xl:items-center justify-between gap-4 bg-white/50 backdrop-blur-sm sticky top-0 z-20 rounded-[20px] shadow-sm mx-4 mt-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{greetingTitle}</h1>
                        <p className="text-gray-500 font-medium mt-1">{greetingSubtitle}</p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={onDownloadReport || (() => alert("Report download started..."))}
                            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl text-sm font-bold shadow-sm hover:bg-gray-50 hover:border-gray-300 transition-all active:scale-95"
                        >
                            <Download className="w-4 h-4" />
                            <span className="hidden sm:inline">Download Report</span>
                        </button>
                        <button
                            onClick={onPayBill || (() => console.log("Navigate to Billing"))}
                            className="flex items-center gap-2 px-4 py-2.5 bg-[#ff6e00] hover:bg-[#e66300] text-white rounded-xl text-sm font-bold shadow-lg shadow-orange-500/30 hover:shadow-orange-500/40 transition-all active:scale-95"
                        >
                            <CreditCard className="w-4 h-4" />
                            <span className="hidden sm:inline">Pay Bill</span>
                        </button>
                    </div>
                </div>
            ) : (
                <div className={`sticky top-0 z-20 group bg-white/90 backdrop-blur-xl px-6 py-4 rounded-2xl shadow-md transition-all duration-300 hover:shadow-xl ${theme.hoverBg} mx-4 mt-4`}>
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${theme.gradientFrom} ${theme.gradientTo} text-white shadow-lg transition-transform duration-300 group-hover:scale-105`}>
                                {icon}
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                                    {title}
                                </h1>
                                <p className="text-sm font-medium text-gray-500">
                                    Real-time usage & status
                                </p>
                            </div>
                        </div>
                        <div className={`h-1.5 w-24 rounded-full bg-gradient-to-r ${theme.lineStart} ${theme.lineEnd} opacity-20`} />
                    </div>
                </div>
            )}

            <div className="flex-1 p-5 flex flex-col gap-5">

                {/* KPI Cards */}
                {kpiData.length > 0 && (
                    <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 shrink-0`}>
                        {kpiData.map((kpi, idx) => (
                            <StatCard key={idx} {...kpi} compact />
                        ))}
                    </div>
                )}

                {/* Row 1: Charts & Alerts */}
                <div className="grid grid-cols-12 gap-5 h-auto lg:h-[500px] shrink-0">
                    <div className="col-span-12 lg:col-span-9 bg-white rounded-xl p-5 border border-gray-100 shadow-md flex flex-col h-auto lg:h-full">
                        <div className="flex items-center justify-between mb-4 shrink-0">
                            <h3 className="text-base font-bold text-gray-800">{chartTitle}</h3>
                            <div className="flex items-center gap-3 shadow-sm shadow-orange-100 rounded-lg">
                                <TimeFilter selected={timeRange} onChange={setTimeRange} compact />
                            </div>
                        </div>

                        <div className="flex-1 min-h-0 flex flex-col lg:flex-row gap-6">
                            <div className="w-full h-[300px] lg:flex-[2] lg:h-full min-w-0">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={currentChartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                        <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} dy={10}>
                                            <Label
                                                content={({ viewBox }) => (
                                                    <text x={viewBox.x + viewBox.width / 2} y={viewBox.y + viewBox.height} fill="#94a3b8" fontSize="11px" fontWeight={500} textAnchor="middle">
                                                        <tspan dy="1em">Time</tspan>
                                                    </text>
                                                )}
                                            />
                                        </XAxis>
                                        <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false}>
                                            <Label value={yAxisLabel} angle={-90} position="insideLeft" style={{ fill: '#94a3b8', fontSize: '11px', fontWeight: 500 }} />
                                        </YAxis>
                                        <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '8px', fontSize: '11px', padding: '8px 12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                        <Bar dataKey={dataKey} fill={theme.bar} radius={[4, 4, 0, 0]} barSize={28} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                            <div className={`w-full flex flex-col relative ${theme.light}/30 rounded-xl p-4 border ${theme.border}/50 min-h-[300px] lg:min-h-0 lg:flex-1 min-w-0`}>
                                <h4 className="absolute top-4 left-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Breakdown</h4>

                                {/* Centered Total Overlay */}
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 pt-4">
                                    <div className="text-center">
                                        <span className="text-2xl font-bold text-gray-800">{totalBreakdown}</span>
                                        <p className="text-[10px] text-gray-500 uppercase font-semibold">Total</p>
                                    </div>
                                </div>

                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie data={breakdownData} innerRadius={55} outerRadius={75} paddingAngle={3} dataKey="value" stroke="none">
                                            {breakdownData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip content={<CustomPieTooltip totalBreakdown={totalBreakdown} />} />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="grid grid-cols-2 gap-2 mt-2">
                                    {breakdownData.map((item, idx) => (
                                        <div key={idx} className="flex items-center gap-2 text-[10px] text-gray-600">
                                            <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                                            <span className="truncate font-medium">{item.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-span-12 lg:col-span-3 bg-white rounded-xl border border-gray-100 shadow-md overflow-hidden flex flex-col h-full min-h-[300px]">
                        <AlertsPanel alerts={alerts} compact />
                    </div>
                </div>

                {/* Row 2: Meters/Devices (Auto Height) */}
                <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-md flex flex-col shrink-0 h-auto">
                    <div className="flex items-center justify-between mb-4 shrink-0">
                        <h3 className="text-base font-bold text-gray-800">{meterSectionTitle}</h3>
                        <div className="flex items-center gap-3">
                            <button onClick={() => setIsModalOpen(true)} className="text-xs bg-gray-50 hover:bg-gray-100 px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 font-medium flex items-center gap-1.5 transition-colors shadow-sm shadow-orange-100 hover:shadow-orange-200">
                                <List size={14} /> View All
                            </button>
                        </div>
                    </div>
                    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pr-2`}>
                        {meters.map((meter, idx) => (
                            <DeviceCard key={idx} {...meter} flowUnit={flowUnit} color={colorTheme} compact />
                        ))}
                    </div>
                </div>

                {/* Row 3: System Params (Horizontal) */}
                <div className="shrink-0 bg-white rounded-xl p-5 text-gray-900 shadow-md border border-gray-100 flex flex-col gap-6">
                    <div className={`flex items-center gap-3 ${theme.text} font-bold shrink-0 border-b border-gray-100 pb-4 w-full`}>
                        <div className={`p-2 ${theme.light} rounded-lg ${theme.text}`}>
                            <Gauge size={20} />
                        </div>
                        <span className="text-sm uppercase tracking-wide">System Status</span>
                    </div>
                    <div className="flex-1 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 w-full">
                        {systemParams.map((p, i) => (
                            <div key={i} className={`flex flex-col bg-gradient-to-br ${theme.systemGradient} p-3 rounded-xl border border-gray-200 shadow-md hover:shadow-lg hover:-translate-y-1 ${theme.systemBorderHover} transition-all duration-300 cursor-pointer group`}>
                                <div className="flex items-center justify-between mb-2">
                                    <span className={`text-[10px] text-gray-500 font-bold uppercase tracking-wider ${theme.groupHoverText} transition-colors`}>{p.label}</span>
                                    <p.icon className={`w-4 h-4 text-gray-400 ${theme.groupHoverText} transition-colors`} />
                                </div>
                                <span className="text-sm font-mono font-extrabold text-gray-900">{p.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
                {children}

            </div>
        </div>
    );
}

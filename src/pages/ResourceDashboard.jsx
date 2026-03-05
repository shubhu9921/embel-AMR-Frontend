import React, { useState } from 'react';
import {
    IndianRupee, Gauge, List, AlertTriangle, Download, CreditCard,
    Search, ChevronDown, ChevronUp, X, MapPin
} from 'lucide-react';
import { StatCard } from '../components/dashboard/StatCard';
import { TimeFilter } from '../components/dashboard/TimeFilter';
import { DeviceCard } from '../components/dashboard/DeviceCard';
import { AlertsPanel } from '../components/dashboard/AlertsPanel';
import { MetersModal } from '../components/MetersModal';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Label,
    PieChart, Pie, Cell
} from 'recharts';
import AssetDetailModal from '../components/modals/AssetDetailModal';
import ResourceConsumptionModal from '../components/modals/ResourceConsumptionModal';

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
    isAdmin = false,
    users = [],
    resourceType = "", // New Prop: 'Water', 'Energy', 'Gas', 'Solar'
    children
}) {
    const [timeRange, setTimeRange] = useState('week');
    const [isListModalOpen, setIsListModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAllMeters, setShowAllMeters] = useState(false);
    const [selectedMeter, setSelectedMeter] = useState(null);
    const [selectedBreakdown, setSelectedBreakdown] = useState(null);
    const [activeAssetTab, setActiveAssetTab] = useState('Devices');
    const [showConsumptionModal, setShowConsumptionModal] = useState(false);
    const [consumptionModalConfig, setConsumptionModalConfig] = useState({ type: 'consumption' });

    const handleKPIClick = (kpi) => {
        if (kpi.type === 'consumption' || kpi.type === 'cost') {
            setConsumptionModalConfig({ type: kpi.type });
            setShowConsumptionModal(true);
        } else if (kpi.type === 'asset_count') {
            // Cycle through tabs: Devices -> Meters -> Inverters
            const tabs = ['Devices', 'Meters', 'Inverters'];
            const currentIndex = tabs.indexOf(activeAssetTab);
            const nextIndex = (currentIndex + 1) % tabs.length;
            setActiveAssetTab(tabs[nextIndex]);
        } else if (isAdmin) {
            setSelectedBreakdown(kpi);
        }
    };

    const filteredSystemAlerts = isAdmin ? alerts.filter(a => {
        const type = (a.type || a.severity || '').toLowerCase();
        const isResourceAlert = resourceType && a.source === resourceType;
        const isSystemCritical = type === 'critical' || type === 'warning';
        return isResourceAlert || isSystemCritical;
    }) : alerts;

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

    // Categorize Assets
    const categorizedAssets = {
        Devices: meters.filter(m => (m.recordType || '').toLowerCase() === 'device' || !m.recordType),
        Meters: meters.filter(m => (m.recordType || '').toLowerCase() === 'meter' && (m.meterType || '').toLowerCase() !== 'solar'),
        Inverters: meters.filter(m => (m.recordType || '').toLowerCase() === 'meter' && (m.meterType || '').toLowerCase() === 'solar')
    };

    const currentAssetsList = categorizedAssets[activeAssetTab] || [];

    const filteredAssetsList = currentAssetsList.filter(m =>
        !searchTerm ||
        (m.deviceName || m.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (m.deviceId || m.id || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (m.location || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    const dataKey = currentChartData.length > 0
        ? (currentChartData[0].usage !== undefined ? 'usage' : (currentChartData[0].generation !== undefined ? 'generation' : 'value'))
        : 'value';

    const yAxisLabel = dataKey === 'generation' ? `Generation (${flowUnit})` : `Consumption (${flowUnit === 'kW' ? 'kWh' : (flowUnit === 'm³/h' ? 'm³' : 'L')})`;


    return (
        <main className="w-full min-h-screen p-4 md:p-6 font-sans pt-6 md:pt-8">
            <div className="flex flex-col flex-1">
                <MetersModal
                    isOpen={isListModalOpen}
                    onClose={() => setIsListModalOpen(false)}
                    title={meterModalTitle}
                    meters={meters}
                    colorClass={theme.text}
                    bgClass={theme.light}
                />

                <AssetDetailModal
                    isOpen={!!selectedMeter}
                    onClose={() => setSelectedMeter(null)}
                    meter={selectedMeter}
                    colorClass={theme.text}
                />

                {showConsumptionModal && (
                    <ResourceConsumptionModal
                        onClose={() => setShowConsumptionModal(false)}
                        resourceType={resourceType}
                        breakdownType={consumptionModalConfig.type}
                    />
                )}

                {/* KPI Breakdown Modal (Simple Implementation) */}
                {selectedBreakdown && (
                    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                        <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-bold text-gray-900">{selectedBreakdown.title} Breakdown</h3>
                                <button onClick={() => setSelectedBreakdown(null)} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X size={20} /></button>
                            </div>
                            <div className="space-y-3">
                                {selectedBreakdown.statusBreakdown ? selectedBreakdown.statusBreakdown.map((item, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-3 h-3 rounded-full ${item.color.replace('text-', 'bg-')}`} />
                                            <span className="font-bold text-gray-700">{item.label}</span>
                                        </div>
                                        <span className="font-mono font-black text-gray-900">{item.value}</span>
                                    </div>
                                )) : (
                                    <p className="text-gray-500 text-center py-4">Detailed breakdown coming soon...</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Header */}
                <div className="p-5 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/50 backdrop-blur-sm sticky top-0 z-30 rounded-[20px] shadow-sm mb-4">
                    <div className="flex items-center gap-4">
                        <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${colorWithGradient || 'from-blue-500 to-indigo-600'} text-white shadow-lg transition-transform duration-300 hover:scale-105`}>
                            {icon}
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{withGreeting ? greetingTitle : title}</h1>
                            <p className="text-sm font-medium text-gray-500">Real-time monitoring and analytics</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={onDownloadReport || (() => alert("Report download started..."))}
                            className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-700 hover:to-purple-800 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-lg shadow-indigo-500/20 transition-all active:scale-95 group"
                        >
                            <Download className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                            <span className="hidden sm:inline">Generate Report</span>
                        </button>
                        <button
                            onClick={onPayBill || (() => console.log("Navigate to Billing"))}
                            className="flex items-center gap-2 px-6 py-2.5 bg-[#ff6e00] hover:bg-[#e66300] text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-lg shadow-orange-500/30 hover:shadow-orange-500/40 transition-all active:scale-95"
                        >
                            <CreditCard className="w-4 h-4" />
                            <span className="hidden sm:inline">Pay Bill</span>
                        </button>
                    </div>
                </div>

                <div className="space-y-6 w-full mt-4">

                    {/* KPI Cards */}
                    {kpiData.length > 0 && (
                        <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 shrink-0`}>
                            {kpiData.map((kpi, idx) => (
                                <StatCard
                                    key={idx}
                                    {...kpi}
                                    onClick={() => handleKPIClick(kpi)}
                                />
                            ))}
                        </div>
                    )}

                    {/* Row 1: Charts & Alerts */}
                    <div className="grid grid-cols-12 gap-5 h-auto lg:h-[500px] shrink-0">
                        <div className="col-span-12 lg:col-span-9 bg-white rounded-3xl p-6 border border-gray-100 shadow-lg flex flex-col h-auto lg:h-full transition-all hover:shadow-xl">
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
                        <div className="col-span-12 lg:col-span-3 bg-white rounded-3xl border border-gray-100 shadow-lg overflow-hidden flex flex-col h-full min-h-[300px] transition-all hover:shadow-xl">
                            <AlertsPanel alerts={filteredSystemAlerts} compact />
                        </div>
                    </div>

                    {/* Row 2: Asset Tabs & Grid */}
                    <div className="bg-white rounded-3xl shadow-lg border border-gray-200 flex flex-col mb-6 overflow-hidden transition-all hover:shadow-xl">
                        <div className="bg-white/50 backdrop-blur-sm  border-b border-gray-100 shadow-sm">
                            <div className="p-4 md:px-5 md:py-3 flex flex-col md:flex-row md:items-center justify-between gap-4">

                                {/* Tabs */}
                                <div className="flex items-center gap-6 overflow-x-auto custom-scrollbar w-full md:w-auto">
                                    {['Devices', 'Meters', 'Inverters'].map(tab => {
                                        const count = categorizedAssets[tab].length;
                                        return (
                                            <button
                                                key={tab}
                                                onClick={() => setActiveAssetTab(tab)}
                                                className={`pb-2 pt-1 text-sm font-bold border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 ${activeAssetTab === tab
                                                    ? `border-${colorTheme}-500 text-${colorTheme}-600`
                                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                                                    }`}
                                            >
                                                {tab}
                                                <span className={`px-2 py-0.5 rounded-full text-[10px] ${activeAssetTab === tab ? `bg-${colorTheme}-50 text-${colorTheme}-600` : 'bg-gray-100 text-gray-500'}`}>
                                                    {count}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>

                                {/* Search & Controls */}
                                <div className="flex items-center gap-3 w-full md:w-auto">
                                    {isAdmin && (
                                        <div className="relative w-full md:w-64 group">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#ff6e00] transition-colors" />
                                            <input
                                                type="text"
                                                placeholder="Search assets..."
                                                className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 outline-none focus:ring-2 focus:ring-[#ff6e00]/20 transition-all shadow-sm"
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                            />
                                        </div>
                                    )}
                                    {filteredAssetsList.length > 10 && (
                                        <button
                                            onClick={() => setShowAllMeters(!showAllMeters)}
                                            className="text-xs bg-white hover:bg-gray-50 px-4 py-2 rounded-xl border border-gray-200 text-gray-700 font-bold flex items-center gap-2 transition-all shadow-sm active:scale-95 whitespace-nowrap"
                                        >
                                            {showAllMeters ? <><ChevronUp size={16} /> Less</> : <><ChevronDown size={16} /> More ({filteredAssetsList.length - 10})</>}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="p-5 min-h-[400px]">
                            {filteredAssetsList.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                                    <Search size={48} className="mb-4 opacity-20" />
                                    <p className="font-bold">No {activeAssetTab.toLowerCase()} found</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                    {filteredAssetsList
                                        .slice(0, !showAllMeters ? 10 : undefined)
                                        .map((meter, idx) => (
                                            <DeviceCard
                                                key={idx}
                                                deviceName={meter.deviceName || meter.name}
                                                deviceId={meter.deviceId || meter.id}
                                                location={meter.location || 'Not Set'}
                                                status={meter.status || 'Offline'}
                                                currentFlow={meter.reading || meter.dailyConsumption || '0'}
                                                flowUnit={flowUnit}
                                                dailyConsumption={`${(parseFloat(meter.reading || meter.dailyConsumption || 0) / 30).toFixed(1)} ${flowUnit}`}
                                                color={colorTheme}
                                                compact={false}
                                                onClick={() => setSelectedMeter(meter)}
                                            />
                                        ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Row 3: System Params (Horizontal) */}
                    <div className="shrink-0 bg-white rounded-3xl p-6 text-gray-900 shadow-lg border border-gray-100 flex flex-col gap-6 transition-all hover:shadow-xl">
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
        </main>
    );
}

import React, { useState } from 'react';
import { Sun, Battery, Zap, AlertTriangle, ArrowUpRight, List, Gauge, Thermometer, TrendingUp, BarChart as BarChartIcon, Activity } from 'lucide-react';
import { StatCard } from './StatCard';
import { TimeFilter } from './TimeFilter';
import { DeviceCard } from './DeviceCard';
import { AlertsPanel } from './AlertsPanel';
import { MetersModal } from '../components/MetersModal';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Label,
    PieChart, Pie, Cell
} from 'recharts';

/* -------------------- MOCK DATA -------------------- */
const solarDataWeek = [
    { time: 'Mon', generation: 210 }, { time: 'Tue', generation: 245 }, { time: 'Wed', generation: 180 },
    { time: 'Thu', generation: 260 }, { time: 'Fri', generation: 230 }, { time: 'Sat', generation: 280 }, { time: 'Sun', generation: 290 },
];
const solarDataDay = [
    { time: '06:00', generation: 0 }, { time: '08:00', generation: 15 }, { time: '10:00', generation: 45 },
    { time: '12:00', generation: 85 }, { time: '14:00', generation: 75 }, { time: '16:00', generation: 55 },
    { time: '18:00', generation: 20 }, { time: '20:00', generation: 0 },
];
const solarDataMonth = [
    { time: 'Week 1', generation: 1400 }, { time: 'Week 2', generation: 1650 }, { time: 'Week 3', generation: 1500 }, { time: 'Week 4', generation: 1700 },
];

const breakdownData = [
    { name: 'East', value: 35, color: '#f59e0b' },
    { name: 'West', value: 30, color: '#fbbf24' },
    { name: 'Carport', value: 25, color: '#fcd34d' },
    { name: 'Ground', value: 10, color: '#fde68a' },
];

const commonParameters = [
    { label: 'Irradiance', value: '850 W/m²', icon: Sun },
    { label: 'Pnl Temp', value: '45°C', icon: Thermometer },
    { label: 'Efficiency', value: '18.5%', icon: TrendingUp },
    { label: 'Grid Feed', value: '12.4 kW', icon: Zap },
    { label: 'DC Voltage', value: '750 V', icon: Zap },
    { label: 'AC Voltage', value: '230 V', icon: Zap },
    { label: 'DC Current', value: '18.2 A', icon: Activity },
    { label: 'AC Current', value: '16.5 A', icon: Activity },
    { label: 'Frequency', value: '50.0 Hz', icon: Activity },
    { label: 'Amb Temp', value: '32°C', icon: Thermometer },
    { label: 'Daily Yld', value: '145 kWh', icon: BarChartIcon },
    { label: 'Performance', value: '94%', icon: Gauge },
];

const CustomPieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        const total = breakdownData.reduce((acc, cur) => acc + cur.value, 0);
        const percent = ((data.value / total) * 100).toFixed(1);
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

const alerts = [
    { id: 1, type: 'critical', title: 'Inverter Err', message: 'Inv-04 comms lost.', timestamp: '10m ago' },
    { id: 2, type: 'warning', title: 'Grid Voltage', message: 'High fluctuation L1.', timestamp: '1h ago' },
    { id: 3, type: 'success', title: 'Self-Consumption', message: 'Achieved 95% today.', timestamp: '4h ago' },
];

const allSolarDevices = [
    { deviceId: 'INV-01', deviceName: 'String Inv A', location: 'Roof East', status: 'active', dailyConsumption: '45 kWh', currentFlow: '5.2' },
    { deviceId: 'INV-02', deviceName: 'String Inv B', location: 'Roof West', status: 'active', dailyConsumption: '42 kWh', currentFlow: '4.8' },
    { deviceId: 'INV-03', deviceName: 'Hybrid Inv', location: 'Garage', status: 'active', dailyConsumption: '38 kWh', currentFlow: '3.5' },
    { deviceId: 'INV-04', deviceName: 'Central Inv', location: 'Ground', status: 'warning', dailyConsumption: '12 kWh', currentFlow: '0.5' },
    { deviceId: 'INV-05', deviceName: 'Carport A', location: 'Parking', status: 'active', dailyConsumption: '28 kWh', currentFlow: '3.2' },
    { deviceId: 'INV-06', deviceName: 'Carport B', location: 'Parking', status: 'active', dailyConsumption: '25 kWh', currentFlow: '2.9' },
];

const solarDataYear = [
    { time: 'Jan', generation: 6500 }, { time: 'Feb', generation: 7200 }, { time: 'Mar', generation: 8100 },
    { time: 'Apr', generation: 9000 }, { time: 'May', generation: 10500 }, { time: 'Jun', generation: 11200 },
    { time: 'Jul', generation: 11500 }, { time: 'Aug', generation: 10800 }, { time: 'Sep', generation: 9500 },
    { time: 'Oct', generation: 8200 }, { time: 'Nov', generation: 7000 }, { time: 'Dec', generation: 6200 },
];

export default function SolarPage() {
    const [timeRange, setTimeRange] = useState('week');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const getData = () => {
        switch (timeRange.toLowerCase()) {
            case 'day': return solarDataDay;
            case 'week': return solarDataWeek;
            case 'month': return solarDataMonth;
            case 'year': return solarDataYear;
            default: return solarDataWeek;
        }
    };
    const currentData = getData();

    const totalBreakdown = breakdownData.reduce((acc, cur) => acc + cur.value, 0);

    return (
        <div className="w-full h-full flex flex-col overflow-y-auto bg-gray-100">
            <MetersModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Solar Devices"
                meters={allSolarDevices}
                colorClass="text-amber-600"
                bgClass="bg-amber-50"
            />

            {/* Header */}
            <div className="sticky top-0 z-20 group bg-white/90 backdrop-blur-xl border border-gray-200 px-6 py-4 rounded-2xl shadow-sm transition-all duration-300 hover:shadow-md hover:bg-amber-50/90 mx-4 mt-4">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-500 text-white shadow-lg transition-transform duration-300 group-hover:scale-105">
                            <Sun size={24} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                                Solar Dashboard
                            </h1>
                            <p className="text-sm font-medium text-gray-500">
                                Real-time usage & status
                            </p>
                        </div>
                    </div>
                    <div className="h-1.5 w-24 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 opacity-20" />
                </div>
            </div>

            <div className="flex-1 p-5 flex flex-col gap-5">

                {/* KPI Cards */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 shrink-0">
                    <StatCard title="Output" value="45.2 kW" icon={<Sun className="w-4 h-4" />} trend={12.5} color="orange" compact />
                    <StatCard title="Daily Yld" value="285 kWh" icon={<Zap className="w-4 h-4" />} trend={5.2} color="green" compact />
                    <StatCard title="Battery" value="92%" icon={<Battery className="w-4 h-4" />} subValue="Charging" color="blue" compact />
                    <StatCard title="CO2 Saved" value="145 kg" icon={<ArrowUpRight className="w-4 h-4" />} subValue="Today" color="purple" compact />
                    <StatCard title="Alerts" value={alerts.length} icon={<AlertTriangle className="w-4 h-4" />} subValue="Active" color="red" compact />
                </div>

                {/* Main Layout: 3 Rows (Charts -> Devices -> Params) */}
                <div className="flex-1 lg:min-h-0 flex flex-col gap-5">

                    {/* Row 1: Charts & Alerts */}
                    <div className="grid grid-cols-12 gap-5 h-auto lg:h-[500px] shrink-0">

                        {/* Charts Section */}
                        <div className="col-span-12 lg:col-span-9 bg-white rounded-xl p-5 border border-gray-100 shadow-md flex flex-col h-auto lg:h-full">
                            <div className="flex items-center justify-between mb-4 shrink-0">
                                <h3 className="text-base font-bold text-gray-800">Generation Analytics</h3>
                                <div className="flex items-center gap-3">
                                    <TimeFilter selected={timeRange} onChange={setTimeRange} compact />
                                </div>
                            </div>

                            <div className="flex-1 min-h-0 flex flex-col lg:flex-row gap-6">
                                {/* Bar Chart */}
                                <div className="w-full h-[300px] lg:flex-[2] lg:h-full min-w-0">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={currentData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
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
                                                <Label value="Generation (kWh)" angle={-90} position="insideLeft" style={{ fill: '#94a3b8', fontSize: '11px', fontWeight: 500 }} />
                                            </YAxis>
                                            <Tooltip cursor={{ fill: '#fffbeb' }} contentStyle={{ borderRadius: '8px', fontSize: '11px', padding: '8px 12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                            <Bar dataKey="generation" fill="#f59e0b" radius={[4, 4, 0, 0]} barSize={28} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                                {/* Donut */}
                                <div className="w-full flex flex-col relative bg-amber-50/30 rounded-xl p-4 border border-amber-100/50 min-h-[300px] lg:min-h-0 lg:flex-1 min-w-0">
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
                                            <Tooltip content={<CustomPieTooltip />} />
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

                        {/* Alerts Section */}
                        <div className="col-span-12 lg:col-span-3 bg-white rounded-xl border border-gray-100 shadow-md overflow-hidden flex flex-col h-full min-h-[300px]">
                            <AlertsPanel alerts={alerts} compact />
                        </div>

                    </div>

                    {/* Row 2: Devices (Auto Height) */}
                    <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-md flex flex-col shrink-0 h-auto">
                        <div className="flex items-center justify-between mb-4 shrink-0">
                            <h3 className="text-base font-bold text-gray-800">Inverters</h3>
                            <div className="flex items-center gap-3">
                                <button onClick={() => setIsModalOpen(true)} className="text-xs bg-gray-50 hover:bg-gray-100 px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 font-medium flex items-center gap-1.5 transition-colors shadow-sm shadow-orange-100 hover:shadow-orange-200">
                                    <List size={14} /> View All
                                </button>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pr-2">
                            {allSolarDevices.map((meter, idx) => (
                                <DeviceCard key={idx} {...meter} flowUnit="kW" color="amber" />
                            ))}
                        </div>
                    </div>

                    {/* Row 3: System Params (Horizontal) */}
                    <div className="shrink-0 bg-white rounded-xl p-5 text-gray-900 shadow-md border border-gray-100 flex flex-col gap-6">
                        <div className="flex items-center gap-3 text-amber-600 font-bold shrink-0 border-b border-gray-100 pb-4 w-full">
                            <div className="p-2 bg-amber-50 rounded-lg text-amber-600">
                                <Gauge size={20} />
                            </div>
                            <span className="text-sm uppercase tracking-wide">System Status</span>
                        </div>
                        <div className="flex-1 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 w-full">
                            {commonParameters.map((p, i) => (
                                <div key={i} className="flex flex-col bg-gradient-to-br from-white to-amber-100/60 p-3 rounded-xl border border-gray-200 shadow-md hover:shadow-lg hover:-translate-y-1 hover:border-amber-300 transition-all duration-300 cursor-pointer group">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider group-hover:text-amber-600 transition-colors">{p.label}</span>
                                        <p.icon className="w-4 h-4 text-gray-400 group-hover:text-amber-600 transition-colors" />
                                    </div>
                                    <span className="text-sm font-mono font-extrabold text-gray-900">{p.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

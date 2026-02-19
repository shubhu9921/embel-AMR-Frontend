
import React, { useState } from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area
} from "recharts";
import { Zap, Droplet, Flame, AlertCircle, CheckCircle, CreditCard, TrendingUp, Calendar, ArrowRight, Sun, Leaf, AlertTriangle } from "lucide-react";
import { AlertsPanel } from "./AlertsPanel";
import { StatCard } from "./StatCard";
import SolarDetailsModal from "./SolarDetailsModal";

export default function DomesticDashboard({ setActivePage = () => { } }) {
    const [timeRange, setTimeRange] = useState('week');
    const [showSolarModal, setShowSolarModal] = useState(false);

    // Mock Data for Domestic User
    // Mock Data for Domestic User
    const getUsageData = () => {
        switch (timeRange.toLowerCase()) {
            case 'day': return [
                { name: "00:00", value: 2, cost: 14 }, { name: "06:00", value: 8, cost: 56 },
                { name: "12:00", value: 15, cost: 105 }, { name: "18:00", value: 10, cost: 70 }
            ];
            case 'week': return [
                { name: "Mon", value: 12, cost: 84 }, { name: "Tue", value: 15, cost: 105 },
                { name: "Wed", value: 10, cost: 70 }, { name: "Thu", value: 18, cost: 126 },
                { name: "Fri", value: 14, cost: 98 }, { name: "Sat", value: 22, cost: 154 },
                { name: "Sun", value: 20, cost: 140 }
            ];
            case 'month': return [
                { name: "Week 1", value: 80, cost: 560 }, { name: "Week 2", value: 95, cost: 665 },
                { name: "Week 3", value: 70, cost: 490 }, { name: "Week 4", value: 110, cost: 770 }
            ];
            case 'year': return [
                { name: "Jan", value: 350, cost: 2450 }, { name: "Apr", value: 420, cost: 2940 },
                { name: "Jul", value: 500, cost: 3500 }, { name: "Oct", value: 380, cost: 2660 }
            ];
            default: return [];
        }
    };
    const usageData = getUsageData();

    const alerts = [
        { id: 1, type: "info", title: "Bill Generated", message: "Jan 2026 bill is ready.", timestamp: "2h ago" },
        { id: 2, type: "warning", title: "High Usage", message: "Unusual spike on Sat.", timestamp: "2d ago" },
    ];

    return (
        <main className="w-full flex flex-col gap-6 min-h-screen mb-20 px-4 md:px-6 py-6 font-sans">
            {showSolarModal && <SolarDetailsModal onClose={() => setShowSolarModal(false)} />}

            {/* Greeting Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Hello, Domestic User! 👋</h1>
                    <p className="text-gray-500 font-medium">Here's your home's energy overview.</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => alert("Report download started...")}
                        className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
                        Download Report
                    </button>
                    <button
                        onClick={() => setActivePage('Billing')}
                        className="px-4 py-2 bg-[#ff6e00] text-white rounded-xl text-sm font-bold shadow-lg shadow-orange-500/30 hover:bg-[#e05d00] transition-all hover:scale-105"
                    >
                        Pay Bill
                    </button>
                </div>
            </div>

            {/* Top Cards - 8 Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="Solar Generation"
                    value="12.5 kWh"
                    icon={<Sun />}
                    color="amber"
                    description="Today"
                    onClick={() => setShowSolarModal(true)}
                    className="cursor-pointer hover:shadow-lg transition-all"
                />
                <StatCard
                    title="Energy Consumption"
                    value="18.2 kWh"
                    icon={<Zap />}
                    color="blue"
                    description="Today"
                />
                <StatCard
                    title="Water Usage"
                    value="450 Liters"
                    icon={<Droplet />}
                    color="cyan"
                    description="Today"
                />
                <StatCard
                    title="Gas Consumption"
                    value="2.1 m³"
                    icon={<Flame />}
                    color="orange"
                    description="Today"
                />
                <StatCard
                    title="Est. Monthly Cost"
                    value="₹2,450"
                    icon={<CreditCard />}
                    color="purple"
                    description="This Month"
                    onClick={() => setActivePage('Billing')}
                    className="cursor-pointer hover:shadow-lg transition-all"
                />
                <StatCard
                    title="Solar Savings"
                    value="₹850"
                    icon={<TrendingUp />}
                    color="green"
                    description="This Month"
                />
                <StatCard
                    title="Active Alerts"
                    value="3 Issues"
                    icon={<AlertTriangle />}
                    color="red"
                    description="Critical Attention Needed"
                    onClick={() => setActivePage('Alerts')}
                    className="cursor-pointer hover:shadow-lg transition-all"
                />
                <StatCard
                    title="Carbon Offset"
                    value="4.2 kg"
                    icon={<Leaf />}
                    color="emerald"
                    description="Today"
                />
            </div>

            {/* Main Section: Chart & Alerts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Usage Chart */}
                <div className="lg:col-span-2 bg-white rounded-3xl shadow-lg border border-gray-100 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">Usage Trends</h3>
                            <p className="text-sm text-gray-500">Weekly consumption monitoring</p>
                        </div>
                        <div className="flex p-1 bg-gray-100 rounded-xl">
                            {['day', 'week', 'month'].map(t => (
                                <button
                                    key={t}
                                    onClick={() => setTimeRange(t)}
                                    className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${timeRange === t ? 'bg-white shadow-sm text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
                                >
                                    {t.charAt(0).toUpperCase() + t.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={usageData}>
                                <defs>
                                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#ff6e00" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#ff6e00" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 12, fill: '#94a3b8' }}
                                    dy={10}
                                />
                                <YAxis
                                    hide={false}
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 12, fill: '#94a3b8' }}
                                />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="value"
                                    stroke="#ff6e00"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorValue)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Alerts / Activity */}
                <div className="lg:col-span-1 bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
                    <AlertsPanel alerts={alerts} />
                </div>

            </div>
        </main>
    );
}

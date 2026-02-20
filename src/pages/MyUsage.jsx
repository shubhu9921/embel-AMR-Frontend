import React, { useState, useMemo } from "react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Zap, Droplet, Flame, Sun, Calendar, Download, Activity, Leaf } from "lucide-react";
import { StatCard } from "../components/dashboard/StatCard";

export default function MyUsage() {
    const [timeRange, setTimeRange] = useState('week');
    const [activeResource, setActiveResource] = useState('All');

    // Mock Usage Data
    const getUsageData = () => {
        // If "today" is selected, we want data up to current exact time
        // Just mock some dynamic "today" data based on current hour/minute
        const now = new Date();
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();

        const todayData = [];
        // Generate intervals of 4 hours up to current time
        for (let h = 0; h <= currentHour; h += 4) {
            const timeStr = `${h.toString().padStart(2, '0')}:00`;
            todayData.push({
                time: timeStr,
                Energy: Math.random() * 20,
                Water: Math.random() * 80,
                Gas: Math.random() * 3,
                Solar: h > 6 && h < 18 ? Math.random() * 20 : 0 // Mock solar only during day
            });
        }
        // Add exact current time point
        const exactTimeStr = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;
        todayData.push({
            time: exactTimeStr,
            Energy: Math.random() * 20,
            Water: Math.random() * 80,
            Gas: Math.random() * 3,
            Solar: currentHour > 6 && currentHour < 18 ? Math.random() * 20 : 0
        });

        const baseData = {
            today: todayData,
            day: [
                { time: "00:00", Energy: 2, Water: 10, Gas: 0.5, Solar: 0 },
                { time: "06:00", Energy: 8, Water: 40, Gas: 1.2, Solar: 2 },
                { time: "12:00", Energy: 15, Water: 60, Gas: 0.8, Solar: 12 },
                { time: "18:00", Energy: 18, Water: 50, Gas: 1.5, Solar: 3 },
            ],
            week: [
                { time: "Mon", Energy: 12, Water: 80, Gas: 2.1, Solar: 15 },
                { time: "Tue", Energy: 15, Water: 95, Gas: 1.8, Solar: 18 },
                { time: "Wed", Energy: 10, Water: 75, Gas: 2.5, Solar: 12 },
                { time: "Thu", Energy: 18, Water: 110, Gas: 1.5, Solar: 20 },
                { time: "Fri", Energy: 14, Water: 85, Gas: 2.2, Solar: 16 },
                { time: "Sat", Energy: 22, Water: 130, Gas: 3.0, Solar: 22 },
                { time: "Sun", Energy: 20, Water: 120, Gas: 2.8, Solar: 25 },
            ],
            month: [
                { time: "Week 1", Energy: 80, Water: 560, Gas: 12, Solar: 100 },
                { time: "Week 2", Energy: 95, Water: 665, Gas: 15, Solar: 120 },
                { time: "Week 3", Energy: 70, Water: 490, Gas: 10, Solar: 90 },
                { time: "Week 4", Energy: 110, Water: 770, Gas: 18, Solar: 140 },
            ]
        };
        return baseData[timeRange.toLowerCase()] || baseData.week;
    };

    const usageData = useMemo(() => getUsageData(), [timeRange]);

    const resourceConfig = {
        Energy: { icon: Zap, color: "blue", hex: "#3b82f6", unit: "kWh" },
        Water: { icon: Droplet, color: "cyan", hex: "#06b6d4", unit: "Liters" },
        Gas: { icon: Flame, color: "orange", hex: "#f97316", unit: "m³" },
        Solar: { icon: Sun, color: "amber", hex: "#f59e0b", unit: "kWh" },
    };

    return (
        <main className="w-full flex flex-col gap-6 min-h-screen mb-20 px-4 md:px-6 py-6 font-sans">
            {/* Header */}
            <div className="p-5 border-b border-gray-100 flex flex-col xl:flex-row xl:items-center justify-between gap-4 bg-white/50 backdrop-blur-sm sticky top-0 z-20 rounded-[20px] shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg">
                        <Activity size={24} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">My Usage</h1>
                        <p className="text-sm font-medium text-gray-500">Detailed insights into your home's consumption</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => {
                            if (activeResource === 'All') {
                                alert(`Exporting All usage data for ${timeRange}...`);
                            } else {
                                alert(`Generating and Exporting ${activeResource} specific report for ${timeRange}...`);
                            }
                        }}
                        className="flex items-center gap-2 px-4 py-2.5 bg-[#ff6e00] text-white rounded-xl text-sm font-bold shadow-md hover:bg-orange-600 transition-all active:scale-95">
                        <Download className="w-4 h-4 text-white" />
                        <span className="hidden sm:inline">
                            {activeResource === 'All' ? 'Export All Data' : `Generate ${activeResource} Report`}
                        </span>
                    </button>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {Object.entries(resourceConfig).map(([key, config]) => {
                    const Icon = config.icon;
                    const value = usageData.reduce((acc, curr) => acc + curr[key], 0).toFixed(1);
                    return (
                        <StatCard
                            key={key}
                            title={`${key} Usage`}
                            value={`${value} ${config.unit}`}
                            icon={<Icon />}
                            color={config.color}
                            description={`Current ${timeRange}`}
                            onClick={() => setActiveResource(key)}
                            className={activeResource === key ? "ring-2 ring-[#ff6e00] bg-orange-50/50 shadow-lg scale-[1.02]" : "hover:scale-[1.02]"}
                        />
                    );
                })}
            </div>

            {/* Main Chart Area */}
            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6 flex flex-col">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
                    <div>
                        <h3 className="text-xl font-bold text-gray-900 border-l-4 border-indigo-500 pl-3">
                            {activeResource === 'All' ? 'Combined Usage Trends' : `${activeResource} Usage Trends`}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1 pl-4">Historical data visualization</p>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Resource Filter */}
                        <div className="hidden md:flex p-1 bg-gray-50 border border-gray-100 rounded-xl">
                            <button
                                onClick={() => setActiveResource('All')}
                                className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${activeResource === 'All' ? 'bg-white shadow-sm text-gray-900 border border-gray-200' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                All
                            </button>
                            {Object.keys(resourceConfig).map(res => (
                                <button
                                    key={res}
                                    onClick={() => setActiveResource(res)}
                                    className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${activeResource === res ? 'bg-white shadow-sm text-gray-900 border border-gray-200' : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    {res}
                                </button>
                            ))}
                        </div>

                        {/* Time Filter */}
                        <div className="flex p-1 bg-gray-100 rounded-xl">
                            {['today', 'day', 'week', 'month'].map(t => (
                                <button
                                    key={t}
                                    onClick={() => setTimeRange(t)}
                                    className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${timeRange === t ? 'bg-indigo-600 shadow-md text-white' : 'text-gray-500 hover:text-gray-800'}`}
                                >
                                    {t.charAt(0).toUpperCase() + t.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="h-[400px] w-full mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={usageData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                            <XAxis
                                dataKey="time"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#64748B', fontSize: 12, fontWeight: 500 }}
                                dy={15}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#64748B', fontSize: 12, fontWeight: 500 }}
                                dx={-10}
                            />
                            <Tooltip
                                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', padding: '12px 16px' }}
                                cursor={{ fill: '#F1F5F9', opacity: 0.5 }}
                            />
                            <Legend wrapperStyle={{ paddingTop: '20px' }} />

                            {/* Render Bars conditionally based on activeResource */}
                            {(activeResource === 'All' || activeResource === 'Energy') && (
                                <Bar dataKey="Energy" fill={resourceConfig['Energy'].hex} radius={[4, 4, 0, 0]} maxBarSize={40} />
                            )}
                            {(activeResource === 'All' || activeResource === 'Water') && (
                                <Bar dataKey="Water" fill={resourceConfig['Water'].hex} radius={[4, 4, 0, 0]} maxBarSize={40} />
                            )}
                            {(activeResource === 'All' || activeResource === 'Gas') && (
                                <Bar dataKey="Gas" fill={resourceConfig['Gas'].hex} radius={[4, 4, 0, 0]} maxBarSize={40} />
                            )}
                            {(activeResource === 'All' || activeResource === 'Solar') && (
                                <Bar dataKey="Solar" fill={resourceConfig['Solar'].hex} radius={[4, 4, 0, 0]} maxBarSize={40} />
                            )}
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Environmental Impact Section */}
            <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-3xl shadow-lg p-6 flex flex-col md:flex-row items-center justify-between text-white overflow-hidden relative">
                <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
                    <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-md">
                        <Leaf size={40} className="text-emerald-100" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold tracking-tight mb-1">Your Environmental Impact</h3>
                        <p className="text-emerald-100 font-medium">By using solar energy and optimizing your usage, you've saved:</p>
                        <div className="flex flex-wrap gap-4 mt-4 justify-center md:justify-start">
                            <div className="bg-white/10 px-4 py-2 rounded-xl backdrop-blur-sm border border-white/20">
                                <span className="font-bold text-xl">45</span> <span className="text-emerald-100 text-sm">Trees Planted Eq.</span>
                            </div>
                            <div className="bg-white/10 px-4 py-2 rounded-xl backdrop-blur-sm border border-white/20">
                                <span className="font-bold text-xl">120 kg</span> <span className="text-emerald-100 text-sm">CO₂ Offset</span>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Decorative Elements */}
                <Leaf size={200} className="absolute -right-10 -bottom-20 text-white opacity-10 pointer-events-none" />
                <CirclePattern className="absolute right-1/4 top-0 opacity-20 pointer-events-none" />
            </div>

        </main>
    );
}

// Helper component for decorative pattern
const CirclePattern = ({ className }) => {
    return (
        <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
            <circle cx="100" cy="100" r="80" stroke="white" strokeWidth="2" strokeDasharray="4 4" />
            <circle cx="100" cy="100" r="60" stroke="white" strokeWidth="1" opacity="0.5" />
            <circle cx="100" cy="100" r="40" stroke="white" strokeWidth="1" strokeDasharray="2 2" />
        </svg>
    );
};

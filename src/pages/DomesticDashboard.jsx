
import React, { useState } from "react";
import {
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar
} from "recharts";
import { Zap, Droplet, Flame, AlertCircle, CheckCircle, CreditCard, TrendingUp, Calendar, ArrowRight, Sun, Leaf, AlertTriangle, Download, HelpCircle } from "lucide-react";
import { AlertsPanel } from "../components/dashboard/AlertsPanel";
import { StatCard } from "../components/dashboard/StatCard";
import SolarDetailsModal from "../components/modals/SolarDetailsModal";
import EnergyDetailsModal from "../components/modals/EnergyDetailsModal";
import WaterDetailsModal from "../components/modals/WaterDetailsModal";
import GasDetailsModal from "../components/modals/GasDetailsModal";
import OverallReportModal from "../components/modals/OverallReportModal";
import SupportModal from "../components/modals/SupportModal";

export default function DomesticDashboard({ setActivePage = () => { } }) {
    const userRole = sessionStorage.getItem('userName') || 'Domestic User';
    const [timeRange, setTimeRange] = useState('week');
    const [showSolarModal, setShowSolarModal] = useState(false);
    const [showEnergyModal, setShowEnergyModal] = useState(false);
    const [showWaterModal, setShowWaterModal] = useState(false);
    const [showGasModal, setShowGasModal] = useState(false);
    const [showOverallReportModal, setShowOverallReportModal] = useState(false);
    const [showSupportModal, setShowSupportModal] = useState(false);

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
            {showEnergyModal && <EnergyDetailsModal onClose={() => setShowEnergyModal(false)} />}
            {showWaterModal && <WaterDetailsModal onClose={() => setShowWaterModal(false)} />}
            {showGasModal && <GasDetailsModal onClose={() => setShowGasModal(false)} />}
            {showOverallReportModal && <OverallReportModal onClose={() => setShowOverallReportModal(false)} />}
            {showSupportModal && (
                <SupportModal
                    onClose={() => setShowSupportModal(false)}
                    userDetails={{ name: 'Domestic User', id: 'User2' }}
                />
            )}

            {/* Greeting Section */}
            <div className="p-5 border-b border-gray-100 flex flex-col xl:flex-row xl:items-center justify-between gap-4 bg-white/50 backdrop-blur-sm sticky top-0 z-20 rounded-[20px] shadow-sm">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Welcome Back, {userRole}! 👋</h1>
                    <p className="text-gray-500 font-medium mt-1">Monitor your home's resource efficiency.</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => setShowOverallReportModal(true)}
                        className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl text-sm font-bold shadow-sm hover:bg-gray-50 hover:border-gray-300 transition-all active:scale-95"
                    >
                        <Download className="w-4 h-4" />
                        <span className="hidden sm:inline">Download Report</span>
                    </button>
                    <button
                        onClick={() => setActivePage('Billing')}
                        className="flex items-center gap-2 px-4 py-2.5 bg-[#ff6e00] hover:bg-[#e66300] text-white rounded-xl text-sm font-bold shadow-lg shadow-orange-500/30 hover:shadow-orange-500/40 transition-all active:scale-95"
                    >
                        <CreditCard className="w-4 h-4" />
                        <span className="hidden sm:inline">Pay Bill</span>
                    </button>
                </div>
            </div>

            {/* Top Cards - 8 Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                <StatCard
                    title="Solar Generation"
                    value="12.5 kWh"
                    icon={<Sun />}
                    color="amber"
                    description="Today"
                    statusBreakdown={[
                        { label: 'Direct', value: '8.5', color: 'text-emerald-500' },
                        { label: 'Grid', value: '4.0', color: 'text-amber-500' }
                    ]}
                    onClick={() => setShowSolarModal(true)}
                />
                <StatCard
                    title="Energy Consumption"
                    value="18.2 kWh"
                    icon={<Zap />}
                    color="blue"
                    description="Today"
                    statusBreakdown={[
                        { label: 'Peak', value: '10.2', color: 'text-rose-500' },
                        { label: 'Off-Peak', value: '8.0', color: 'text-emerald-500' }
                    ]}
                    onClick={() => setShowEnergyModal(true)}
                />
                <StatCard
                    title="Water Usage"
                    value="450 Liters"
                    icon={<Droplet />}
                    color="cyan"
                    description="Today"
                    statusBreakdown={[
                        { label: 'Kitchen', value: '180', color: 'text-blue-500' },
                        { label: 'Bath', value: '270', color: 'text-indigo-500' }
                    ]}
                    onClick={() => setShowWaterModal(true)}
                />
                <StatCard
                    title="Gas Consumption"
                    value="2.1 m³"
                    icon={<Flame />}
                    color="orange"
                    description="Today"
                    onClick={() => setShowGasModal(true)}
                />
                <StatCard
                    title="Active Alerts"
                    value="3 Issues"
                    icon={<AlertTriangle />}
                    color="red"
                    description="Critical Attention Needed"
                    statusBreakdown={[
                        { label: 'Critical', value: 1, color: 'text-red-600' },
                        { label: 'Warning', value: 2, color: 'text-orange-600' }
                    ]}
                    onClick={() => setActivePage('Alerts')}
                />
                <StatCard
                    title="Carbon Offset"
                    value="4.2 kg"
                    icon={<Leaf />}
                    color="emerald"
                    description="Today"
                />
                <StatCard
                    title="Support Tickets"
                    value="15"
                    icon={<HelpCircle />}
                    color="indigo"
                    description="User request status"
                    statusBreakdown={[
                        { label: 'Active', value: 6, color: 'text-amber-600' },
                        { label: 'Resolved', value: 9, color: 'text-emerald-600' }
                    ]}
                    onClick={() => setShowSupportModal(true)}
                />
                <StatCard
                    title="Monthly Costing"
                    value="₹2,450"
                    icon={<CreditCard />}
                    color="purple"
                    description="Monthly consumption cost"
                    statusBreakdown={[
                        { label: 'Solar', value: '₹400', color: 'text-amber-500' },
                        { label: 'Water', value: '₹350', color: 'text-blue-500' },
                        { label: 'Energy', value: '₹1,200', color: 'text-emerald-500' },
                        { label: 'Gas', value: '₹500', color: 'text-orange-500' },
                    ]}
                    onClick={() => setActivePage('Billing')}
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

                    <div className="h-[300px] min-h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={usageData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
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
                                    cursor={{ fill: '#f8fafc' }}
                                />
                                <Bar
                                    dataKey="value"
                                    fill="#3b82f6"
                                    radius={[4, 4, 0, 0]}
                                    barSize={40}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Alerts / Activity */}
                <div className="lg:col-span-1 bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
                    <AlertsPanel alerts={alerts} userRole="Domestic" />
                </div>

            </div>
        </main>
    );
}

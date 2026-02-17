
import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import {
    PieChart, Pie, Cell, ResponsiveContainer,
    AreaChart, Area, Tooltip, CartesianGrid, XAxis, YAxis,
    BarChart, Bar, Label
} from "recharts";
import { LayoutDashboard, Flame, Droplet, Zap, Wind, AlertTriangle, Info, CheckCircle, Maximize2, X, Gauge, Sun, Activity, Users, CreditCard, FileText, Cpu, Clock, AlertCircle, MapPin } from "lucide-react";
import { TimeFilter } from "./TimeFilter";
import { AlertsPanel } from "./AlertsPanel";
import { StatCard } from "./StatCard";
import { LocationDetailsModal } from "./LocationDetailsModal";
import { sites, userDataDetailed } from "../data/mockData";



// Fix Leaflet icon issue
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

export default function Dashboard({ setActivePage = () => { }, userRole }) {
    const isAdmin = userRole === 'Admin';
    /* -------------------- STATE -------------------- */
    const [consumptionTimeRange, setConsumptionTimeRange] = useState('month');
    const [activeResource, setActiveResource] = useState('All');
    const [showMapModal, setShowMapModal] = useState(false);
    const [showLocationModal, setShowLocationModal] = useState(false);
    const [showUserDevicesModal, setShowUserDevicesModal] = useState(false);
    const [showUserMetersModal, setShowUserMetersModal] = useState(false);
    const [showUserLocationsModal, setShowUserLocationsModal] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState(null);


    /* -------------------- ADMIN METRICS (MOCK) -------------------- */
    const totalDevices = 12;
    const deviceStats = [
        { label: 'Active', value: 8, color: 'text-emerald-500' },
        { label: 'Inactive', value: 3, color: 'text-amber-500' },
        { label: 'Deactive', value: 1, color: 'text-red-500' },
    ];
    const locationStats = [
        { label: 'Mumbai', value: 5, color: 'text-blue-500' },
        { label: 'Delhi', value: 4, color: 'text-indigo-500' },
        { label: 'B\'lore', value: 3, color: 'text-purple-500' },
    ];

    const totalMeters = 120;
    const meterStats = [
        { label: 'Active', value: 95, color: 'text-emerald-500' },
        { label: 'Inactive', value: 15, color: 'text-amber-500' },
        { label: 'Deactive', value: 10, color: 'text-red-500' },
    ];

    const totalUsers = 5;
    const userStats = [
        { label: 'Active', value: 4, color: 'text-emerald-500' },
        { label: 'Inactive', value: 1, color: 'text-amber-500' },
        { label: 'Deactive', value: 0, color: 'text-red-500' },
    ];

    const billingStats = { total: "₹12,450", pending: "₹2,321", overdue: "₹5,100" };
    const revenueStats = [
        { label: 'Paid', value: 150, color: 'text-emerald-500' },
        { label: 'Unpaid', value: 45, color: 'text-red-500' },
        { label: 'Pending', value: 20, color: 'text-amber-500' },
        { label: 'Processing', value: 12, color: 'text-blue-500' },
    ];

    /* -------------------- USER METRICS (MOCK) -------------------- */
    const userAssignedDevices = 5;
    const userDeviceStats = [
        { label: 'Active', value: 3, color: 'text-emerald-500' },
        { label: 'Inactive', value: 1, color: 'text-amber-500' },
        { label: 'Deactive', value: 1, color: 'text-red-500' },
    ];

    const userAssignedLocations = 2; // Mumbai, Delhi
    const userLocationStats = [
        { label: 'Mumbai', value: 3, color: 'text-blue-500' },
        { label: 'Delhi', value: 2, color: 'text-indigo-500' },
    ];

    const userAssignedMeters = 8;
    const userMeterStats = [
        { label: 'Active', value: 6, color: 'text-emerald-500' },
        { label: 'Inactive', value: 1, color: 'text-amber-500' },
        { label: 'Deactive', value: 1, color: 'text-red-500' },
    ];



    const reportsStats = { ready: 4, processing: 1, total: 6 };

    /* -------------------- METRICS -------------------- */
    // const totalMeters = 120; // Replaced by above

    const pieData = [
        { name: "Active", value: 70, color: "#10b981" },
        { name: "Inactive", value: 35, color: "#f59e0b" },
        { name: "Deactive", value: 15, color: "#ef4444" },
    ];

    /* -------------------- SITES (MAP DATA) -------------------- */


    /* -------------------- CONSUMPTION DATA (MULTI-RESOURCE) -------------------- */
    const multiResourceDataDay = [
        { name: "00:00", Energy: 10, Water: 5, Gas: 2, Solar: 0 },
        { name: "04:00", Energy: 15, Water: 8, Gas: 3, Solar: 0 },
        { name: "08:00", Energy: 45, Water: 25, Gas: 10, Solar: 20 },
        { name: "12:00", Energy: 60, Water: 40, Gas: 15, Solar: 55 },
        { name: "16:00", Energy: 50, Water: 35, Gas: 12, Solar: 45 },
        { name: "20:00", Energy: 30, Water: 20, Gas: 8, Solar: 5 },
    ];
    const multiResourceDataWeek = [
        { name: "Mon", Energy: 400, Water: 240, Gas: 100, Solar: 300 },
        { name: "Tue", Energy: 300, Water: 139, Gas: 200, Solar: 250 },
        { name: "Wed", Energy: 200, Water: 480, Gas: 150, Solar: 320 },
        { name: "Thu", Energy: 278, Water: 390, Gas: 210, Solar: 280 },
        { name: "Fri", Energy: 189, Water: 480, Gas: 240, Solar: 310 },
        { name: "Sat", Energy: 239, Water: 380, Gas: 180, Solar: 290 },
        { name: "Sun", Energy: 349, Water: 430, Gas: 220, Solar: 350 },
    ];
    const multiResourceDataMonth = [
        { name: "W1", Energy: 2100, Water: 1200, Gas: 600, Solar: 1800 },
        { name: "W2", Energy: 2300, Water: 1400, Gas: 750, Solar: 2000 },
        { name: "W3", Energy: 1900, Water: 1100, Gas: 550, Solar: 1600 },
        { name: "W4", Energy: 2500, Water: 1600, Gas: 800, Solar: 2200 },
    ];
    const multiResourceDataYear = [
        { name: "Jan", Energy: 8500, Water: 4500, Gas: 2200, Solar: 7000 },
        { name: "Apr", Energy: 9200, Water: 5100, Gas: 2400, Solar: 8500 },
        { name: "Jul", Energy: 10500, Water: 6000, Gas: 2800, Solar: 9200 },
        { name: "Oct", Energy: 8800, Water: 4800, Gas: 2300, Solar: 7800 },
    ];

    const getChartData = () => {
        switch (consumptionTimeRange) {
            case 'day': return multiResourceDataDay;
            case 'week': return multiResourceDataWeek;
            case 'month': return multiResourceDataMonth;
            case 'year': return multiResourceDataYear;
            case 'all': return multiResourceDataYear;
            default: return multiResourceDataWeek;
        }
    };
    const multiResourceData = getChartData();

    // Helper for safe billing percentage calculation
    const calculateBillingPercentage = () => {
        try {
            const total = parseInt(billingStats.total.replace(/[^0-9]/g, '')) || 0;
            const pending = parseInt(billingStats.pending.replace(/[^0-9]/g, '')) || 0;
            const separator = total + pending;
            return separator === 0 ? 0 : (total / separator) * 100;
        } catch (e) {
            return 0;
        }
    };



    /* -------------------- ALERTS -------------------- */
    const alerts = [
        { id: 1, type: "critical", title: "Meters Offline", message: "South Hub: 5 meters offline", timestamp: "10m" },
        { id: 2, type: "warning", title: "High Usage", message: "West Plant: Usage spike detected", timestamp: "25m" },
        { id: 3, type: "info", title: "Maintenance", message: "North Branch: Scheduled maintenance", timestamp: "1h" },
    ];

    return (
        <main className="w-full flex flex-col gap-6 min-h-screen mb-20">

            {/* -------------------- HEADER (Floating Card Style) -------------------- */}
            <div className="sticky top-0 z-30 group bg-white/90 backdrop-blur-xl px-6 py-4 rounded-2xl shadow-md transition-all duration-300 hover:shadow-xl hover:bg-blue-50/90 mx-4 mt-4">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg transition-transform duration-300 group-hover:scale-105">
                            <LayoutDashboard size={24} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                                Dashboard Overview
                            </h1>
                            <p className="text-sm font-medium text-gray-500">
                                Multi-resource analytics & status
                            </p>
                        </div>
                    </div>
                    <div className="h-1.5 w-24 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 opacity-20" />
                </div>
            </div>

            <div className="px-4 md:px-6 flex flex-col gap-6">

                {/* -------------------- ROW 1: KPI CARDS -------------------- */}
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                    {isAdmin ? (
                        <>
                            <StatCard
                                title="Total Devices"
                                value={totalDevices}
                                icon={<Cpu />}
                                color="blue"
                                description="Hardware deployed"
                                subValue="Active: 8"
                                statusBreakdown={deviceStats}
                                onClick={() => {
                                    sessionStorage.setItem('devicesPageTab', 'devices');
                                    setActivePage('Devices');
                                }}
                                className="cursor-pointer hover:shadow-lg transition-all"
                            />
                            <StatCard
                                title="Devices Location"
                                value="View Details"
                                icon={<MapPin />}
                                color="cyan"
                                description="Filter by location & source"
                                onClick={() => setShowLocationModal(true)}
                                statusBreakdown={locationStats}
                            />
                            <StatCard
                                title="Total Meters"
                                value={totalMeters}
                                icon={<Gauge />}
                                color="green"
                                description="Meters monitored"
                                subValue="Active: 95"
                                statusBreakdown={meterStats}
                                onClick={() => {
                                    sessionStorage.setItem('devicesPageTab', 'meters');
                                    setActivePage('Devices');
                                }}
                                className="cursor-pointer hover:shadow-lg transition-all"
                            />
                            <StatCard
                                title="Total Users"
                                value={totalUsers}
                                icon={<Users />}
                                color="orange"
                                description="System administrators"
                                subValue="2 New this week"
                                statusBreakdown={userStats}
                                onClick={() => setActivePage('Users')}
                                className="cursor-pointer hover:shadow-lg transition-all"
                            />
                            <StatCard
                                title="Billing Overview"
                                value={billingStats.total}
                                icon={<CreditCard />}
                                color="purple"
                                description="Billed this month"
                                subValue={`Pending: ${billingStats.pending}`}
                                statusBreakdown={revenueStats}
                                onClick={() => setActivePage('Billing')}
                                className="cursor-pointer hover:shadow-lg transition-all"
                            />
                            <StatCard
                                title="Recent Reports"
                                value={reportsStats.total}
                                icon={<FileText />}
                                color="blue"
                                description="Generated reports"
                                subValue=""
                                statusBreakdown={[
                                    { label: 'Ready', value: reportsStats.ready, color: 'text-green-600' },
                                    { label: 'Processing', value: reportsStats.processing, color: 'text-amber-600' }
                                ]}
                                onClick={() => setActivePage('Reports')}
                                className="cursor-pointer hover:shadow-lg transition-all"
                            />
                            <StatCard
                                title="System Status"
                                value="98.5%"
                                icon={<Activity />}
                                color="emerald"
                                description="Operational Uptime"
                                trend={0.5}
                                trendLabel="vs last month"
                            />
                        </>
                    ) : (
                        <>
                            <StatCard
                                title="Assigned Devices"
                                value={userAssignedDevices}
                                icon={<Cpu />}
                                color="blue"
                                description="Hardware assigned to you"
                                statusBreakdown={userDeviceStats}
                                onClick={() => setShowUserDevicesModal(true)}
                            />
                            <StatCard
                                title="Assigned Locations"
                                value={userAssignedLocations}
                                icon={<MapPin />}
                                color="cyan"
                                description="Operational sites"
                                statusBreakdown={userLocationStats}
                                onClick={() => { setShowUserLocationsModal(true); setSelectedLocation(userDataDetailed.locations[0]); }}
                            />
                            <StatCard
                                title="Assigned Meters"
                                value={userAssignedMeters}
                                icon={<Gauge />}
                                color="green"
                                description="Meters under your supervision"
                                statusBreakdown={userMeterStats}
                                onClick={() => setShowUserMetersModal(true)}
                            />
                            <StatCard
                                title="Active Issues"
                                value="5"
                                icon={<AlertTriangle />}
                                color="red"
                                description="Critical alerts"
                                subValue="2 High Priority"
                            />
                            <StatCard
                                title="System Health"
                                value="98.5%"
                                icon={<Activity />}
                                color="emerald"
                                description="Operational Uptime"
                                trend={0.5}
                                trendLabel="vs last month"
                            />
                        </>
                    )}
                </div>

                {/* -------------------- ROW 2: GRAPHS & ALERTS -------------------- */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-auto lg:h-[500px]">

                    {/* SYSTEM CONSUMPTION GRAPH (Multi-Resource) */}
                    <div className="lg:col-span-2 bg-white rounded-2xl shadow-md border border-gray-100 p-6 flex flex-col min-h-[400px] lg:h-full transition-shadow hover:shadow-lg">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">System Consumption</h3>
                                <p className="text-xs text-gray-500 font-medium mt-1">
                                    {activeResource === 'All' ? 'Multi-resource usage breakdown' : `${activeResource} usage over time`}
                                </p>
                            </div>

                            <div className="flex flex-wrap items-center gap-2">
                                {/* Resource Selector */}
                                <div className="flex bg-white p-1 rounded-xl border border-gray-100 shadow-sm shadow-orange-100">
                                    {[
                                        { id: 'All', label: 'All', icon: LayoutDashboard, activeBg: 'bg-indigo-600 text-white shadow-md', inactiveBg: 'hover:bg-indigo-50 text-gray-500' },
                                        { id: 'Energy', label: 'Energy', icon: Zap, activeBg: 'bg-emerald-500 text-white shadow-md', inactiveBg: 'hover:bg-emerald-50 text-gray-500' },
                                        { id: 'Gas', label: 'Gas', icon: Flame, activeBg: 'bg-orange-500 text-white shadow-md', inactiveBg: 'hover:bg-orange-50 text-gray-500' },
                                        { id: 'Water', label: 'Water', icon: Droplet, activeBg: 'bg-cyan-500 text-white shadow-md', inactiveBg: 'hover:bg-cyan-50 text-gray-500' },
                                        { id: 'Solar', label: 'Solar', icon: Sun, activeBg: 'bg-amber-500 text-white shadow-md', inactiveBg: 'hover:bg-amber-50 text-gray-500' },
                                    ].map(res => (
                                        <button
                                            key={res.id}
                                            onClick={() => setActiveResource(res.id)}
                                            className={`
                                                flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all duration-300
                                                ${activeResource === res.id
                                                    ? res.activeBg
                                                    : res.inactiveBg
                                                }
                                            `}
                                        >
                                            {res.id !== 'All' && <res.icon size={14} strokeWidth={2.5} />}
                                            {res.label}
                                        </button>
                                    ))}
                                </div>

                                {/* Time Filter */}
                                <TimeFilter selected={consumptionTimeRange} onChange={setConsumptionTimeRange} showAll={true} />
                            </div>
                        </div>
                        <div className="flex-1 w-full min-h-0">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={multiResourceData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }} barGap={2}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis
                                        dataKey="name"
                                        tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 500 }}
                                        axisLine={false}
                                        tickLine={false}
                                        dy={10}
                                    >
                                        <Label
                                            content={({ viewBox }) => (
                                                <text x={viewBox.x + viewBox.width / 2} y={viewBox.y + viewBox.height} fill="#94a3b8" fontSize="11px" fontWeight={500} textAnchor="middle">
                                                    <tspan dy="1em">Time</tspan>
                                                </text>
                                            )}
                                        />
                                    </XAxis>
                                    <YAxis
                                        tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 500 }}
                                        axisLine={false}
                                        tickLine={false}
                                    >
                                        <Label value="Consumption" angle={-90} position="insideLeft" style={{ fill: '#94a3b8', fontSize: '11px', fontWeight: 500 }} />
                                    </YAxis>
                                    <Tooltip
                                        contentStyle={{
                                            borderRadius: '16px',
                                            border: 'none',
                                            boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                                            padding: '12px'
                                        }}
                                        cursor={{ fill: '#f8fafc', opacity: 0.8 }}
                                        itemStyle={{ fontSize: '12px', fontWeight: 600 }}
                                    />

                                    {/* Render bars based on activeResource */}
                                    {(activeResource === 'All' || activeResource === 'Energy') && (
                                        <Bar dataKey="Energy" fill="#10b981" radius={[4, 4, 0, 0]} barSize={activeResource === 'All' ? 12 : 32} />
                                    )}
                                    {(activeResource === 'All' || activeResource === 'Water') && (
                                        <Bar dataKey="Water" fill="#06b6d4" radius={[4, 4, 0, 0]} barSize={activeResource === 'All' ? 12 : 32} />
                                    )}
                                    {(activeResource === 'All' || activeResource === 'Gas') && (
                                        <Bar dataKey="Gas" fill="#f97316" radius={[4, 4, 0, 0]} barSize={activeResource === 'All' ? 12 : 32} />
                                    )}
                                    {(activeResource === 'All' || activeResource === 'Solar') && (
                                        <Bar dataKey="Solar" fill="#f59e0b" radius={[4, 4, 0, 0]} barSize={activeResource === 'All' ? 12 : 32} />
                                    )}
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* ALERTS PANEL */}
                    <div className="lg:col-span-1 h-full">
                        <div className="bg-white rounded-2xl shadow-md border border-gray-100 h-full overflow-hidden hover:shadow-lg transition-shadow">
                            <AlertsPanel alerts={alerts} />
                        </div>
                    </div>
                </div>

                {/* -------------------- ROW 3: BILLING, REPORTS & PARAMS -------------------- */}
                <div className={`grid grid-cols-1 ${isAdmin ? 'lg:grid-cols-3' : 'lg:grid-cols-1'} gap-6`}>

                    {/* BILLING ANALYSIS - ADMIN ONLY */}
                    {isAdmin && (
                        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-5 hover:shadow-lg transition-all h-full">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                                    <CreditCard size={18} className="text-purple-500" />
                                    Billing Overview
                                </h3>
                                <button
                                    onClick={() => setActivePage('Billing')}
                                    className="text-xs font-bold text-purple-600 bg-purple-50 px-2 py-1 rounded hover:bg-purple-100 transition-colors"
                                >
                                    View All
                                </button>
                            </div>
                            <div className="flex flex-col gap-3">
                                <div className="flex items-center justify-between p-4 rounded-xl bg-purple-50/50 border border-purple-100 hover:shadow-md transition-all group cursor-pointer" onClick={() => setActivePage('Billing')}>
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-purple-100 text-purple-600 rounded-lg group-hover:scale-110 transition-transform">
                                            <CreditCard size={18} />
                                        </div>
                                        <div>
                                            <p className="text-xs text-purple-600 font-bold uppercase tracking-wider">Collected</p>
                                            <p className="text-lg font-bold text-gray-900">{billingStats.total}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between p-4 rounded-xl bg-orange-50/50 border border-orange-100 hover:shadow-md transition-all group cursor-pointer" onClick={() => setActivePage('Billing')}>
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-orange-100 text-orange-600 rounded-lg group-hover:scale-110 transition-transform">
                                            <CreditCard size={18} />
                                        </div>
                                        <div>
                                            <p className="text-xs text-orange-600 font-bold uppercase tracking-wider">Pending</p>
                                            <p className="text-lg font-bold text-gray-900">{billingStats.pending}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between p-4 rounded-xl bg-red-50/50 border border-red-100 hover:shadow-md transition-all group cursor-pointer" onClick={() => setActivePage('Billing')}>
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-red-100 text-red-600 rounded-lg group-hover:scale-110 transition-transform">
                                            <AlertTriangle size={18} />
                                        </div>
                                        <div>
                                            <p className="text-xs text-red-600 font-bold uppercase tracking-wider">Overdue</p>
                                            <p className="text-lg font-bold text-gray-900">{billingStats.overdue}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* REPORTS SUMMARY - ADMIN ONLY */}
                    {isAdmin && (
                        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-5 hover:shadow-lg transition-all h-full">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                                    <FileText size={18} className="text-blue-500" />
                                    Recent Reports
                                </h3>
                                <button
                                    onClick={() => setActivePage('Reports')}
                                    className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded hover:bg-blue-100 transition-colors"
                                >
                                    View All
                                </button>
                            </div>
                            <div className="flex flex-col gap-3">
                                <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all group cursor-pointer" onClick={() => setActivePage('Reports')}>
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-blue-100 text-blue-600 rounded-lg group-hover:scale-110 transition-transform">
                                            <FileText size={18} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-800 group-hover:text-blue-600 transition-colors">Monthly Data</p>
                                            <p className="text-[10px] text-gray-500 font-medium">Dec 2024 • 2.4 MB</p>
                                        </div>
                                    </div>
                                    <span className="px-2 py-1 bg-green-100 text-green-700 text-[10px] font-bold rounded-lg">Ready</span>
                                </div>
                                <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all group cursor-pointer" onClick={() => setActivePage('Reports')}>
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-amber-100 text-amber-600 rounded-lg group-hover:scale-110 transition-transform">
                                            <FileText size={18} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-800 group-hover:text-blue-600 transition-colors">Solar Analysis</p>
                                            <p className="text-[10px] text-gray-500 font-medium">Annual 2024 • 5.2 MB</p>
                                        </div>
                                    </div>
                                    <span className="px-2 py-1 bg-green-100 text-green-700 text-[10px] font-bold rounded-lg">Ready</span>
                                </div>
                                <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all group cursor-pointer" onClick={() => setActivePage('Reports')}>
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-gray-200 text-gray-600 rounded-lg group-hover:scale-110 transition-transform">
                                            <Activity size={18} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-800 group-hover:text-blue-600 transition-colors">Device Health</p>
                                            <p className="text-[10px] text-gray-500 font-medium">Jan 2025 • Calculating...</p>
                                        </div>
                                    </div>
                                    <span className="px-2 py-1 bg-amber-100 text-amber-700 text-[10px] font-bold rounded-lg">Processing</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* SYSTEM PARAMETERS (Compact) */}
                    <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-5 hover:shadow-lg transition-all flex flex-col">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-gray-800 flex items-center gap-2">
                                <Gauge size={18} className="text-emerald-500" />
                                System Status
                            </h3>
                            <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                        </div>
                        <div className={`grid ${isAdmin ? 'grid-cols-2 lg:grid-cols-2' : 'grid-cols-2 md:grid-cols-4'} gap-3 flex-1 content-start`}>
                            {[
                                { label: 'Grid Freq', value: '50.02 Hz', icon: Activity, color: 'text-emerald-500', bg: 'bg-emerald-50' },
                                { label: 'Water Pres', value: '3.4 bar', icon: Droplet, color: 'text-cyan-500', bg: 'bg-cyan-50' },
                                { label: 'Gas PSI', value: '2.1 psi', icon: Flame, color: 'text-orange-500', bg: 'bg-orange-50' },
                                { label: 'Solar Out', value: '4.2 kW', icon: Sun, color: 'text-amber-500', bg: 'bg-amber-50' },
                            ].map((p, i) => (
                                <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl border border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition-colors">
                                    <div className={`p-2 rounded-lg ${p.bg} ${p.color}`}>
                                        <p.icon size={16} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase">{p.label}</p>
                                        <p className="text-sm font-bold text-gray-900">{p.value}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </div> {/* End of px-4 container */}

            {/* -------------------- ADMIN MAP MODAL -------------------- */}
            {showMapModal && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-5xl h-[80vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between p-6 border-b border-gray-100">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Global Site Locations</h2>
                                <p className="text-sm text-gray-500 font-medium mt-1">Live operational status map</p>
                            </div>
                            <button
                                onClick={() => setShowMapModal(false)}
                                className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>
                        <div className="flex-1 w-full bg-white relative">
                            <MapContainer
                                center={[21.7679, 78.8718]}
                                zoom={5}
                                style={{ height: "100%", width: "100%" }}
                            >
                                <TileLayer
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                                    url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                                />
                                {sites.map(site => (
                                    <Marker key={site.id} position={site.location}>
                                        <Popup>
                                            <div className="p-2 min-w-[150px]">
                                                <h3 className="font-bold text-gray-900 mb-1">{site.name}</h3>
                                                <div className="flex items-center gap-2">
                                                    <span className={`w - 2 h - 2 rounded - full ${site.status === 'Active' ? 'bg-green-500' :
                                                        site.status === 'Inactive' ? 'bg-amber-500' : 'bg-red-500'
                                                        } `} />
                                                    <span className="text-sm text-gray-600 font-medium">{site.status}</span>
                                                </div>
                                            </div>
                                        </Popup>
                                    </Marker>
                                ))}
                            </MapContainer>
                        </div>
                    </div>
                </div>
            )}
            {/* -------------------- LOCATION DETAILS MODAL -------------------- */}
            {showLocationModal && (
                <LocationDetailsModal onClose={() => setShowLocationModal(false)} />
            )}


            {/* -------------------- USER DETAILS MODALS -------------------- */}
            {/* User Devices Modal */}
            {showUserDevicesModal && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-4xl max-h-[80vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between p-6 border-b border-gray-100">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Assigned Devices</h2>
                                <p className="text-sm text-gray-500 font-medium mt-1">Detailed list of hardware assigned to you</p>
                            </div>
                            <button onClick={() => setShowUserDevicesModal(false)} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors"><X size={24} /></button>
                        </div>
                        <div className="overflow-auto p-6">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                                        <th className="py-3 px-4">Device Name</th>
                                        <th className="py-3 px-4">Type/Source</th>
                                        <th className="py-3 px-4">Parameters</th>
                                        <th className="py-3 px-4">Status</th>
                                        <th className="py-3 px-4">Location</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm">
                                    {userDataDetailed.devices.map((device, i) => (
                                        <tr key={i} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                            <td className="py-3 px-4 font-semibold text-gray-900">{device.name}</td>
                                            <td className="py-3 px-4 text-gray-600">{device.source}</td>
                                            <td className="py-3 px-4 text-gray-600">{device.params}</td>
                                            <td className="py-3 px-4">
                                                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold ${device.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : device.status === 'Inactive' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
                                                    {device.status}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 text-gray-500">{device.location}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* User Meters Modal */}
            {showUserMetersModal && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-4xl max-h-[80vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between p-6 border-b border-gray-100">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Assigned Meters</h2>
                                <p className="text-sm text-gray-500 font-medium mt-1">Detailed list of meters under your supervision</p>
                            </div>
                            <button onClick={() => setShowUserMetersModal(false)} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors"><X size={24} /></button>
                        </div>
                        <div className="overflow-auto p-6">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                                        <th className="py-3 px-4">Meter Name</th>
                                        <th className="py-3 px-4">Type/Source</th>
                                        <th className="py-3 px-4">Current Reading</th>
                                        <th className="py-3 px-4">Status</th>
                                        <th className="py-3 px-4">Location</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm">
                                    {userDataDetailed.meters.map((meter, i) => (
                                        <tr key={i} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                            <td className="py-3 px-4 font-semibold text-gray-900">{meter.name}</td>
                                            <td className="py-3 px-4 text-gray-600">{meter.source}</td>
                                            <td className="py-3 px-4 text-gray-600 font-mono">{meter.reading}</td>
                                            <td className="py-3 px-4">
                                                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold ${meter.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : meter.status === 'Inactive' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
                                                    {meter.status}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 text-gray-500">{meter.location}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* User Locations Modal */}
            {showUserLocationsModal && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-5xl max-h-[85vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between p-6 border-b border-gray-100">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Assigned Locations</h2>
                                <p className="text-sm text-gray-500 font-medium mt-1">Select a location to view assigned equipment</p>
                            </div>
                            <button onClick={() => { setShowUserLocationsModal(false); setSelectedLocation(null); }} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors"><X size={24} /></button>
                        </div>
                        <div className="flex flex-1 overflow-hidden">
                            {/* Location List Sidebar */}
                            <div className="w-1/3 border-r border-gray-100 overflow-y-auto bg-gray-50/50">
                                {userDataDetailed.locations.map((loc) => (
                                    <button
                                        key={loc.id}
                                        onClick={() => setSelectedLocation(loc)}
                                        className={`w-full text-left p-4 border-b border-gray-100 transition-colors hover:bg-white flex items-center justify-between group ${selectedLocation?.id === loc.id ? 'bg-white shadow-sm border-l-4 border-l-blue-500' : 'border-l-4 border-l-transparent'}`}
                                    >
                                        <div>
                                            <h3 className={`font-bold ${selectedLocation?.id === loc.id ? 'text-blue-600' : 'text-gray-800'}`}>{loc.name}</h3>
                                            <p className="text-xs text-gray-500 mt-1">{loc.devices.length} Devices • {loc.meters.length} Meters</p>
                                        </div>
                                        <MapPin size={18} className={`${selectedLocation?.id === loc.id ? 'text-blue-500' : 'text-gray-300 group-hover:text-gray-400'}`} />
                                    </button>
                                ))}
                            </div>
                            {/* Selected Location Details */}
                            <div className="w-2/3 overflow-y-auto p-6 bg-white">
                                {selectedLocation ? (
                                    <div className="space-y-8">
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4">
                                                <Cpu className="text-blue-500" size={20} /> Devices at {selectedLocation.name}
                                            </h3>
                                            <div className="bg-gray-50 rounded-xl border border-gray-100 overflow-hidden">
                                                <table className="w-full text-left text-sm">
                                                    <thead className="bg-gray-100/50 text-gray-500 font-bold uppercase text-xs">
                                                        <tr>
                                                            <th className="py-2 px-4">Name</th>
                                                            <th className="py-2 px-4">Source</th>
                                                            <th className="py-2 px-4">Status</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-gray-100">
                                                        {selectedLocation.devices.map((d, i) => (
                                                            <tr key={i}>
                                                                <td className="py-2 px-4 font-medium text-gray-900">{d.name}</td>
                                                                <td className="py-2 px-4 text-gray-600">{d.source}</td>
                                                                <td className="py-2 px-4">
                                                                    <span className={`text-xs font-bold ${d.status === 'Active' ? 'text-emerald-600' : 'text-red-600'}`}>{d.status}</span>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4">
                                                <Gauge className="text-indigo-500" size={20} /> Meters at {selectedLocation.name}
                                            </h3>
                                            <div className="bg-gray-50 rounded-xl border border-gray-100 overflow-hidden">
                                                <table className="w-full text-left text-sm">
                                                    <thead className="bg-gray-100/50 text-gray-500 font-bold uppercase text-xs">
                                                        <tr>
                                                            <th className="py-2 px-4">Name</th>
                                                            <th className="py-2 px-4">Reading</th>
                                                            <th className="py-2 px-4">Status</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-gray-100">
                                                        {selectedLocation.meters.map((m, i) => (
                                                            <tr key={i}>
                                                                <td className="py-2 px-4 font-medium text-gray-900">{m.name}</td>
                                                                <td className="py-2 px-4 font-mono text-gray-600">{m.reading}</td>
                                                                <td className="py-2 px-4">
                                                                    <span className={`text-xs font-bold ${m.status === 'Active' ? 'text-emerald-600' : 'text-red-600'}`}>{m.status}</span>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center text-gray-400">
                                        <MapPin size={48} className="mb-4 opacity-20" />
                                        <p className="text-lg font-medium">Select a location to view details</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </main>
    );
}

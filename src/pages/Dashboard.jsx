
import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import {
    PieChart, Pie, Cell, ResponsiveContainer,
    AreaChart, Area, Tooltip, CartesianGrid, XAxis, YAxis,
    BarChart, Bar, Label
} from "recharts";
import { LayoutDashboard, Flame, Droplet, Zap, Wind, AlertTriangle, Info, CheckCircle, Maximize2, X, Gauge, Sun, Activity, Users, CreditCard, FileText, Cpu, Clock, AlertCircle, MapPin, Eye, Filter } from "lucide-react";
import { TimeFilter } from "./TimeFilter";
import { AlertsPanel } from "./AlertsPanel";
import { StatCard } from "./StatCard";
import { LocationDetailsModal } from "./LocationDetailsModal";
import DomesticDashboard from "./DomesticDashboard";
import { sites, userDataDetailed, initialDevicesData, initialMetersData, initialUsers } from "../data/mockData";



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
    if (userRole === 'Domestic') {
        return <DomesticDashboard setActivePage={setActivePage} />;
    }
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

    // User Dashboard Enhancements State
    const [userDeviceFilter, setUserDeviceFilter] = useState('All');
    const [userMeterFilter, setUserMeterFilter] = useState('All');
    const [showDeviceDetailsModal, setShowDeviceDetailsModal] = useState(false);
    const [selectedUserDevice, setSelectedUserDevice] = useState(null);
    const [showMeterDetailsModal, setShowMeterDetailsModal] = useState(false);
    const [selectedUserMeter, setSelectedUserMeter] = useState(null);
    const [showIssuesModal, setShowIssuesModal] = useState(false);

    // Calculate Issues (Inactive/Deactive)
    const inactiveDevices = initialDevicesData.filter(d => d.status !== 'Active');
    const inactiveMeters = initialMetersData.filter(m => m.status !== 'Active');
    const inactiveUsers = initialUsers.filter(u => u.status !== 'Active');


    /* -------------------- ADMIN METRICS (MOCK) -------------------- */
    const totalDevices = 12;
    const deviceStats = [
        { label: 'Active', value: 8, color: 'text-emerald-500' },
        { label: 'Inactive', value: 3, color: 'text-amber-500' },
        { label: 'Deactivated', value: 1, color: 'text-red-500' },
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
        { label: 'Deactivated', value: 10, color: 'text-red-500' },
    ];

    const totalUsers = 5;
    const userStats = [
        { label: 'Active', value: 4, color: 'text-emerald-500' },
        { label: 'Inactive', value: 1, color: 'text-amber-500' },
        { label: 'Deactivated', value: 0, color: 'text-red-500' },
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

    /* -------------------- ALERTS DATA -------------------- */
    const adminAlerts = [
        { id: 1, type: 'critical', title: 'Start Server 03 Offline', message: 'Critical heartbeat failure detected.', timestamp: '2m ago' },
        { id: 2, type: 'warning', title: 'High Latency', message: 'Region: Mumbai-North > 400ms', timestamp: '15m ago' },
        { id: 3, type: 'info', title: 'System Update', message: 'Maintenance scheduled for tonight', timestamp: '1h ago' },
        { id: 4, type: 'critical', title: 'Database Load', message: 'CPU usage > 90% on DB-Main', timestamp: '2h ago' },
    ];

    const userAlerts = [
        { id: 1, type: 'warning', title: 'High Usage', message: 'Water usage exceeded daily limit.', timestamp: '10m ago' },
        { id: 2, type: 'info', title: 'Bill Generated', message: 'Bill for Jan 2025 is ready.', timestamp: '1d ago' },
        { id: 3, type: 'info', title: 'Device Online', message: 'Smart Meter #123 is now active.', timestamp: '2d ago' },
    ];

    const currentAlerts = isAdmin ? adminAlerts : userAlerts;

    /* -------------------- METRICS -------------------- */
    // const totalMeters = 120; // Replaced by above

    const pieData = [
        { name: "Active", value: 70, color: "#10b981" },
        { name: "Inactive", value: 35, color: "#f59e0b" },
        { name: "Deactivated", value: 15, color: "#ef4444" },
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
                            <StatCard
                                title="System Issues"
                                value={inactiveDevices.length + inactiveMeters.length + inactiveUsers.length}
                                icon={<AlertTriangle />}
                                color="red"
                                description="Actions required"
                                subValue={`${inactiveDevices.length} Dev, ${inactiveMeters.length} Met`}
                                statusBreakdown={[
                                    { label: 'Devices', value: inactiveDevices.length, color: 'text-red-600' },
                                    { label: 'Meters', value: inactiveMeters.length, color: 'text-orange-600' },
                                    { label: 'Users', value: inactiveUsers.length, color: 'text-amber-600' }
                                ]}
                                onClick={() => setShowIssuesModal(true)}
                                className="cursor-pointer hover:shadow-lg transition-all"
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


            {/* -------------------- DEVICE DETAILS MODAL -------------------- */}
            {showDeviceDetailsModal && selectedUserDevice && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between p-6 border-b border-gray-100">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">{selectedUserDevice.name}</h2>
                                <p className="text-sm text-gray-500 font-medium mt-1">Device Details & Parameters</p>
                            </div>
                            <button
                                onClick={() => {
                                    setShowDeviceDetailsModal(false);
                                    setShowUserDevicesModal(true); // Return to list
                                }}
                                className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>
                        <div className="p-6 space-y-6">
                            {/* Device Info Grid */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Status</p>
                                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold ${selectedUserDevice.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : selectedUserDevice.status === 'Inactive' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
                                        {selectedUserDevice.status}
                                    </span>
                                </div>
                                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Type</p>
                                    <p className="font-semibold text-gray-900">{selectedUserDevice.source}</p>
                                </div>
                                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Location</p>
                                    <p className="font-semibold text-gray-900">{selectedUserDevice.location}</p>
                                </div>
                                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Parameters</p>
                                    <p className="font-semibold text-gray-900">{selectedUserDevice.params}</p>
                                </div>
                            </div>

                            {/* Detailed Params (Mock) */}
                            <div>
                                <h3 className="font-bold text-gray-900 mb-3 text-sm flex items-center gap-2">
                                    <Activity size={16} className="text-blue-500" />
                                    Live Telemetry
                                </h3>
                                <div className="bg-slate-900 text-slate-300 p-4 rounded-xl font-mono text-sm space-y-2">
                                    <div className="flex justify-between">
                                        <span>Current:</span>
                                        <span className="text-emerald-400">4.2A</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Voltage:</span>
                                        <span className="text-amber-400">230.1V</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Power Factor:</span>
                                        <span className="text-blue-400">0.98</span>
                                    </div>
                                    <div className="flex justify-between border-t border-slate-700 pt-2 mt-2">
                                        <span>Last Update:</span>
                                        <span className="text-slate-500">Just now</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {/* -------------------- METER DETAILS MODAL -------------------- */}
            {showMeterDetailsModal && selectedUserMeter && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between p-6 border-b border-gray-100">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">{selectedUserMeter.name}</h2>
                                <p className="text-sm text-gray-500 font-medium mt-1">Meter Readings & Status</p>
                            </div>
                            <button
                                onClick={() => {
                                    setShowMeterDetailsModal(false);
                                    setShowUserMetersModal(true); // Return to list
                                }}
                                className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>
                        <div className="p-6 space-y-6">
                            {/* Meter Info Grid */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Status</p>
                                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold ${selectedUserMeter.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : selectedUserMeter.status === 'Inactive' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
                                        {selectedUserMeter.status}
                                    </span>
                                </div>
                                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Type</p>
                                    <p className="font-semibold text-gray-900">{selectedUserMeter.source}</p>
                                </div>
                                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Location</p>
                                    <p className="font-semibold text-gray-900">{selectedUserMeter.location}</p>
                                </div>
                                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Last Sync</p>
                                    <p className="font-semibold text-gray-900">Just now</p>
                                </div>
                            </div>

                            {/* Current Reading */}
                            <div>
                                <h3 className="font-bold text-gray-900 mb-3 text-sm flex items-center gap-2">
                                    <Gauge size={16} className="text-indigo-500" />
                                    Current Reading
                                </h3>
                                <div className="bg-indigo-50 text-indigo-900 p-6 rounded-2xl flex flex-col items-center justify-center border border-indigo-100">
                                    <span className="text-4xl font-bold font-mono tracking-tighter">{selectedUserMeter.reading}</span>
                                    <span className="text-xs font-bold uppercase tracking-widest text-indigo-400 mt-1">Kilowatt Hours</span>
                                </div>
                            </div>

                            {/* Recent Consumption (Mock) */}
                            <div>
                                <h3 className="font-bold text-gray-900 mb-3 text-sm">Recent History</h3>
                                <div className="space-y-2">
                                    {[
                                        { time: '10:00 AM', val: '45.2 kWh' },
                                        { time: '09:00 AM', val: '42.8 kWh' },
                                        { time: '08:00 AM', val: '38.5 kWh' },
                                    ].map((h, i) => (
                                        <div key={i} className="flex justify-between items-center p-2 rounded-lg bg-gray-50 text-sm">
                                            <span className="text-gray-500">{h.time}</span>
                                            <span className="font-mono font-bold text-gray-900">{h.val}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {showUserDevicesModal && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-4xl max-h-[80vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between p-6 border-b border-gray-100">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Assigned Devices</h2>
                                <p className="text-sm text-gray-500 font-medium mt-1">Detailed list of hardware assigned to you</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-1 border border-gray-200">
                                    <Filter size={16} className="text-gray-400 ml-2" />
                                    <select
                                        value={userDeviceFilter}
                                        onChange={(e) => setUserDeviceFilter(e.target.value)}
                                        className="bg-transparent text-sm font-medium text-gray-700 border-none focus:ring-0 cursor-pointer py-1 pr-8 pl-1"
                                    >
                                        <option value="All">All Status</option>
                                        <option value="Active">Active</option>
                                        <option value="Inactive">Inactive</option>
                                        <option value="Deactive">Deactive</option>
                                    </select>
                                </div>
                                <button onClick={() => setShowUserDevicesModal(false)} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors"><X size={24} /></button>
                            </div>
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
                                        <th className="py-3 px-4 text-center">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm">
                                    {userDataDetailed.devices
                                        .filter(d => userDeviceFilter === 'All' || d.status === userDeviceFilter)
                                        .map((device, i) => (
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
                                                <td className="py-3 px-4 text-center">
                                                    <button
                                                        onClick={() => {
                                                            setSelectedUserDevice(device);
                                                            setShowUserDevicesModal(false);
                                                            setShowDeviceDetailsModal(true);
                                                        }}
                                                        className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                                                        title="View Details"
                                                    >
                                                        <Eye size={18} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                            {userDataDetailed.devices.filter(d => userDeviceFilter === 'All' || d.status === userDeviceFilter).length === 0 && (
                                <div className="text-center py-8 text-gray-500 text-sm">No devices found matching this filter.</div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* -------------------- SYSTEM ISSUES MODAL -------------------- */}
            {showIssuesModal && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-4xl max-h-[80vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between p-6 border-b border-gray-100">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                    <AlertTriangle className="text-red-500" />
                                    System Issues & Alerts
                                </h2>
                                <p className="text-sm text-gray-500 font-medium mt-1">
                                    Items requiring attention ({inactiveDevices.length + inactiveMeters.length + inactiveUsers.length})
                                </p>
                            </div>
                            <button onClick={() => setShowIssuesModal(false)} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">

                            {/* Devices Section */}
                            {inactiveDevices.length > 0 && (
                                <div>
                                    <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                                        <Cpu size={18} className="text-gray-400" />
                                        Devices ({inactiveDevices.length})
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {inactiveDevices.map(d => (
                                            <div
                                                key={d.id}
                                                onClick={() => {
                                                    sessionStorage.setItem('devicesPageTab', 'devices');
                                                    setActivePage('Devices');
                                                    setShowIssuesModal(false);
                                                }}
                                                className="p-3 border border-red-100 bg-red-50/50 rounded-xl flex justify-between items-center group hover:bg-red-50 transition-colors cursor-pointer"
                                            >
                                                <div>
                                                    <p className="font-semibold text-gray-900 text-sm group-hover:text-red-700 transition-colors">{d.name}</p>
                                                    <p className="text-xs text-gray-500 mt-0.5">{d.deviceId}</p>
                                                </div>
                                                <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${d.status === 'Inactive' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
                                                    {d.status}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Meters Section */}
                            {inactiveMeters.length > 0 && (
                                <div>
                                    <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                                        <Gauge size={18} className="text-gray-400" />
                                        Meters ({inactiveMeters.length})
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {inactiveMeters.map(m => (
                                            <div
                                                key={m.id}
                                                onClick={() => {
                                                    sessionStorage.setItem('devicesPageTab', 'meters');
                                                    setActivePage('Devices');
                                                    setShowIssuesModal(false);
                                                }}
                                                className="p-3 border border-orange-100 bg-orange-50/50 rounded-xl flex justify-between items-center group hover:bg-orange-50 transition-colors cursor-pointer"
                                            >
                                                <div>
                                                    <p className="font-semibold text-gray-900 text-sm group-hover:text-orange-700 transition-colors">{m.name}</p>
                                                    <p className="text-xs text-gray-500 mt-0.5">{m.location}</p>
                                                </div>
                                                <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${m.status === 'Inactive' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
                                                    {m.status}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Users Section */}
                            {inactiveUsers.length > 0 && (
                                <div>
                                    <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                                        <Users size={18} className="text-gray-400" />
                                        Users ({inactiveUsers.length})
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {inactiveUsers.map(u => (
                                            <div
                                                key={u.id}
                                                onClick={() => {
                                                    setActivePage('Users');
                                                    setShowIssuesModal(false);
                                                }}
                                                className="p-3 border border-gray-200 bg-gray-50 rounded-xl flex justify-between items-center group hover:bg-gray-100 transition-colors cursor-pointer"
                                            >
                                                <div>
                                                    <p className="font-semibold text-gray-900 text-sm group-hover:text-blue-600 transition-colors">{u.firstName} {u.lastName}</p>
                                                    <p className="text-xs text-gray-500 mt-0.5">{u.email}</p>
                                                </div>
                                                <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-gray-200 text-gray-600">
                                                    {u.status}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {inactiveDevices.length === 0 && inactiveMeters.length === 0 && inactiveUsers.length === 0 && (
                                <div className="text-center py-12">
                                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <CheckCircle size={32} />
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900">All Systems Operational</h3>
                                    <p className="text-gray-500 mt-1">No active issues detected across devices, meters, or users.</p>
                                </div>
                            )}
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
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-1 border border-gray-200">
                                    <Filter size={16} className="text-gray-400 ml-2" />
                                    <select
                                        value={userMeterFilter}
                                        onChange={(e) => setUserMeterFilter(e.target.value)}
                                        className="bg-transparent text-sm font-medium text-gray-700 border-none focus:ring-0 cursor-pointer py-1 pr-8 pl-1"
                                    >
                                        <option value="All">All Status</option>
                                        <option value="Active">Active</option>
                                        <option value="Inactive">Inactive</option>
                                        <option value="Deactive">Deactive</option>
                                    </select>
                                </div>
                                <button onClick={() => setShowUserMetersModal(false)} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors"><X size={24} /></button>
                            </div>
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
                                        <th className="py-3 px-4 text-center">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm">
                                    {userDataDetailed.meters
                                        .filter(m => userMeterFilter === 'All' || m.status === userMeterFilter)
                                        .map((meter, i) => (
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
                                                <td className="py-3 px-4 text-center">
                                                    <button
                                                        onClick={() => {
                                                            setSelectedUserMeter(meter);
                                                            setShowUserMetersModal(false);
                                                            setShowMeterDetailsModal(true);
                                                        }}
                                                        className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                                                        title="View Details"
                                                    >
                                                        <Eye size={18} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                            {userDataDetailed.meters.filter(m => userMeterFilter === 'All' || m.status === userMeterFilter).length === 0 && (
                                <div className="text-center py-8 text-gray-500 text-sm">No meters found matching this filter.</div>
                            )}
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

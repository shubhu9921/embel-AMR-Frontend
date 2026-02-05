
import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import {
    PieChart, Pie, Cell, ResponsiveContainer,
    AreaChart, Area, Tooltip, CartesianGrid, XAxis, YAxis,
    BarChart, Bar, Label
} from "recharts";
import { LayoutDashboard, Flame, Droplet, Zap, Wind, AlertTriangle, Info, CheckCircle, Maximize2, X, Gauge, Sun } from "lucide-react";
import { TimeFilter } from "./TimeFilter";
import { AlertsPanel } from "./AlertsPanel";



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

export default function Dashboard() {
    /* -------------------- STATE -------------------- */
    const [consumptionTimeRange, setConsumptionTimeRange] = useState('1M');
    const [activeResource, setActiveResource] = useState('All');
    const [showMapModal, setShowMapModal] = useState(false);

    /* -------------------- METRICS -------------------- */
    const totalMeters = 120; // 70 Active + 35 Inactive + 15 Deactive

    const pieData = [
        { name: "Active", value: 70, color: "#10b981" },
        { name: "Inactive", value: 35, color: "#f59e0b" },
        { name: "Deactive", value: 15, color: "#ef4444" },
    ];

    /* -------------------- SITES (MAP DATA) -------------------- */
    const sites = [
        { id: 1, name: "Headquarters", location: [19.076, 72.8777], status: "Active" }, // Mumbai
        { id: 2, name: "North Branch", location: [28.6139, 77.209], status: "Active" }, // Delhi
        { id: 3, name: "South Hub", location: [12.9716, 77.5946], status: "Inactive" }, // Bangalore
        { id: 4, name: "West Plant", location: [23.0225, 72.5714], status: "Active" }, // Ahmedabad
        { id: 5, name: "East Depot", location: [22.5726, 88.3639], status: "Deactive" }, // Kolkata
        { id: 6, name: "Central Unit", location: [17.3850, 78.4867], status: "Active" }, // Hyderabad
    ];

    /* -------------------- CONSUMPTION DATA (MULTI-RESOURCE) -------------------- */
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
            case '1D': return multiResourceDataDay;
            case '1W': return multiResourceDataWeek;
            case '1M': return multiResourceDataMonth;
            case '1Y': return multiResourceDataYear;
            default: return multiResourceDataWeek;
        }
    };
    const multiResourceData = getChartData();

    // System params (Generic Main Dashboard Params)
    const systemParameters = [
        { label: 'Grid Freq', value: '50.02 Hz', status: 'optimal' },
        { label: 'Water Pres', value: '3.4 bar', status: 'optimal' },
        { label: 'Gas PSI', value: '2.1 psi', status: 'optimal' },
        { label: 'Solar Out', value: '4.2 kW', status: 'optimal' },
        { label: 'Avg Temp', value: '24°C', status: 'optimal' },
        { label: 'Humidity', value: '45%', status: 'optimal' },
    ];

    /* -------------------- ALERTS -------------------- */
    const alerts = [
        { id: 1, type: "critical", title: "Meters Offline", message: "South Hub: 5 meters offline", timestamp: "10m" },
        { id: 2, type: "warning", title: "High Usage", message: "West Plant: Usage spike detected", timestamp: "25m" },
        { id: 3, type: "info", title: "Maintenance", message: "North Branch: Scheduled maintenance", timestamp: "1h" },
    ];

    return (
        <main className="w-full flex flex-col gap-6 min-h-screen mb-20 bg-gray-100">

            {/* -------------------- HEADER (Floating Card Style) -------------------- */}
            <div className="sticky top-0 z-20 group bg-white/90 backdrop-blur-xl border border-gray-200 px-6 py-4 rounded-2xl shadow-sm transition-all duration-300 hover:shadow-md hover:bg-blue-50/90 mx-4 mt-4">
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

                    {/* KPI 1: TOTAL METERS DONUT */}
                    <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm p-5 flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group cursor-default relative overflow-hidden">
                        {/* Background Icon */}
                        <div className="absolute -bottom-6 -right-6 opacity-[0.08] group-hover:opacity-[0.40] transition-opacity duration-300 text-emerald-600 pointer-events-none z-0">
                            <Gauge size={120} strokeWidth={1} />
                        </div>

                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 relative z-10">Total Meter Status</h3>
                        <div className="flex items-center justify-between h-full relative z-10">
                            <div className="w-24 h-24 relative scale-110 group-hover:scale-115 transition-transform">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie data={pieData} innerRadius={35} outerRadius={45} paddingAngle={4} dataKey="value" stroke="none">
                                            {pieData.map((entry, index) => (
                                                <Cell key={`cell - ${index} `} fill={entry.color} />
                                            ))}
                                        </Pie>
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-xl font-bold text-gray-900">{totalMeters}</span>
                                </div>
                            </div>
                            <div className="flex flex-col gap-2.5 text-xs">
                                {pieData.map((p, i) => (
                                    <div key={i} className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full ring-2 ring-white shadow-sm" style={{ background: p.color }}></div>
                                        <span className="text-gray-600 font-semibold">{p.name}: <span className="text-gray-900">{p.value}</span></span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* KPI 2: ACTIVE ISSUES */}
                    <div className="bg-white rounded-2xl border border-red-100 shadow-sm p-5 flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
                        {/* Background Icon */}
                        <div className="absolute -bottom-6 -right-6 opacity-[0.08] group-hover:opacity-[0.40] transition-opacity duration-300 text-red-500 pointer-events-none z-0">
                            <AlertTriangle size={120} strokeWidth={1} />
                        </div>

                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 relative z-10">Active System Issues</h3>
                        <div className="flex-1 space-y-3 relative z-10">
                            <div className="flex items-center justify-between p-3 bg-red-50/50 rounded-xl border border-red-100 hover:border-red-200 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="p-1.5 bg-red-100 rounded-lg text-red-600">
                                        <AlertTriangle size={16} />
                                    </div>
                                    <span className="text-sm font-semibold text-gray-700">Offline Meters</span>
                                </div>
                                <span className="text-lg font-bold text-red-600">5</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-amber-50/50 rounded-xl border border-amber-100 hover:border-amber-200 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="p-1.5 bg-amber-100 rounded-lg text-amber-600">
                                        <Info size={16} />
                                    </div>
                                    <span className="text-sm font-semibold text-gray-700">High Usage</span>
                                </div>
                                <span className="text-lg font-bold text-amber-600">2</span>
                            </div>
                        </div>
                    </div>

                    {/* KPI 3: SITE MAP PREVIEW */}
                    <div className="bg-white rounded-2xl border border-blue-100 shadow-sm p-0 flex flex-col relative overflow-hidden group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-[200px] md:h-auto">
                        <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-gray-100 shadow-sm flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                            <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wide">Live Sites</h3>
                        </div>
                        <button
                            onClick={() => setShowMapModal(true)}
                            className="absolute top-4 right-4 z-10 p-2 bg-white/90 backdrop-blur-md rounded-xl hover:bg-blue-50 text-gray-500 hover:text-blue-600 border border-gray-100 shadow-md transition-all hover:scale-105 active:scale-95"
                            title="Enlarge Map"
                        >
                            <Maximize2 size={18} />
                        </button>
                        <div className="w-full h-full opacity-90 group-hover:opacity-100 transition-opacity">
                            <MapContainer
                                center={[20.5937, 78.9629]}
                                zoom={3}
                                zoomControl={false}
                                scrollWheelZoom={false}
                                style={{ height: "100%", width: "100%", background: '#f8fafc' }}
                            >
                                <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
                                {sites.map(site => (
                                    <Marker key={site.id} position={site.location}></Marker>
                                ))}
                            </MapContainer>
                        </div>
                    </div>

                    {/* KPI 4: QUICK STATS */}
                    <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-md shadow-emerald-200 p-5 flex flex-col justify-between hover:shadow-lg hover:shadow-emerald-300 transition-all duration-300 text-white relative overflow-hidden group">
                        {/* Background Icon */}
                        <div className="absolute -bottom-6 -right-6 opacity-[0.2] group-hover:opacity-[0.5] transition-opacity duration-300 text-white pointer-events-none z-0">
                            <CheckCircle size={120} strokeWidth={1} />
                        </div>

                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full blur-xl -ml-10 -mb-10"></div>

                        <h3 className="text-sm font-bold text-emerald-50 uppercase tracking-wide relative z-10">System Health</h3>
                        <div className="flex flex-col items-center justify-center flex-1 py-2 relative z-10">
                            <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-3 shadow-inner border border-white/20">
                                <CheckCircle size={32} className="text-white" />
                            </div>
                            <span className="text-3xl font-extrabold text-white tracking-tight">98.5%</span>
                            <span className="text-xs text-emerald-100 font-medium mt-1 bg-white/10 px-2 py-0.5 rounded-full">Operational Uptime</span>
                        </div>
                    </div>
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
                                <div className="flex bg-gray-50 p-1 rounded-xl border border-gray-100">
                                    {[
                                        { id: 'All', label: 'All', icon: LayoutDashboard, color: 'text-gray-600', activeBg: 'bg-white shadow-sm' },
                                        { id: 'Energy', label: 'Energy', icon: Zap, color: 'text-emerald-600', activeBg: 'bg-emerald-50 text-emerald-700 shadow-sm ring-1 ring-emerald-100' },
                                        { id: 'Gas', label: 'Gas', icon: Flame, color: 'text-orange-600', activeBg: 'bg-orange-50 text-orange-700 shadow-sm ring-1 ring-orange-100' },
                                        { id: 'Water', label: 'Water', icon: Droplet, color: 'text-cyan-600', activeBg: 'bg-cyan-50 text-cyan-700 shadow-sm ring-1 ring-cyan-100' },
                                        { id: 'Solar', label: 'Solar', icon: Sun, color: 'text-amber-600', activeBg: 'bg-amber-50 text-amber-700 shadow-sm ring-1 ring-amber-100' },
                                    ].map(res => (
                                        <button
                                            key={res.id}
                                            onClick={() => setActiveResource(res.id)}
                                            className={`
                                                flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all
                                                ${activeResource === res.id
                                                    ? res.activeBg
                                                    : 'text-gray-400 hover:text-gray-600 hover:bg-gray-200/50'
                                                }
                                            `}
                                        >
                                            {res.id !== 'All' && <res.icon size={12} strokeWidth={2.5} />}
                                            {res.label}
                                        </button>
                                    ))}
                                </div>

                                {/* Time Filter */}
                                <div className="flex bg-gray-50 p-1 rounded-xl border border-gray-100">
                                    {['1D', '1W', '1M', '1Y'].map(range => (
                                        <button
                                            key={range}
                                            onClick={() => setConsumptionTimeRange(range)}
                                            className={`
                                                px-3 py-1.5 text-xs font-bold rounded-lg transition-all
                                                ${consumptionTimeRange === range
                                                    ? 'bg-white text-blue-600 shadow-sm ring-1 ring-black/5'
                                                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
                                                }
                                            `}
                                        >
                                            {range}
                                        </button>
                                    ))}
                                </div>
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

                {/* -------------------- ROW 3: SYSTEM PARAMETERS (Gas Style) -------------------- */}
                <div className="shrink-0 bg-white rounded-xl p-5 text-gray-900 shadow-md border border-gray-100 flex flex-col gap-6">
                    <div className="flex items-center gap-3 text-blue-600 font-bold shrink-0 border-b border-gray-100 pb-4 w-full">
                        <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                            <Gauge size={20} />
                        </div>
                        <span className="text-sm uppercase tracking-wide">Live System Parameters</span>
                    </div>
                    <div className="flex-1 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 w-full">
                        {systemParameters.map((p, i) => (
                            <div key={i} className="flex flex-col bg-white p-3 rounded-xl border border-gray-200 shadow-md hover:shadow-xl hover:-translate-y-1 hover:border-blue-300 transition-all duration-300 cursor-pointer group">
                                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1 group-hover:text-blue-600 transition-colors">{p.label}</span>
                                <span className="text-sm font-mono font-extrabold text-gray-900">{p.value}</span>
                                <div className="hidden group-hover:flex items-center gap-1 mt-1 animate-in fade-in slide-in-from-top-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                    <span className="text-[9px] text-emerald-600 font-bold">Normal</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div> {/* End of px-4 container */}

            {/* -------------------- MAP MODAL -------------------- */}
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
        </main>
    );
}

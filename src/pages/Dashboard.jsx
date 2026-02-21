import React from "react";
import { LayoutDashboard, Activity, AlertTriangle, AlertCircle, CreditCard, FileText, MapPin, Cpu, Gauge, Users, Droplet, Flame, Sun, HelpCircle, Bell } from "lucide-react";

import { TimeFilter } from "../components/dashboard/TimeFilter";
import { AlertsPanel } from "../components/dashboard/AlertsPanel";
import { StatCard } from "../components/dashboard/StatCard";
import { PerformanceChart } from "../components/dashboard/PerformanceChart";
import DomesticDashboard from "./DomesticDashboard";

import { useDashboard } from "../hooks/useDashboard";
import { DashboardModals } from "../components/dashboard/DashboardModals";
import { RESOURCE_CONFIG, RESOURCES } from "../utils/resourceUtils";
import SupportModal from "../components/modals/SupportModal";
import { dashboardAlerts } from "../data/mockData";

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
    const {
        consumptionTimeRange, setConsumptionTimeRange,
        activeResource, setActiveResource,
        modalState, toggleModal,
        selectedLocation, setSelectedLocation,
        selectedUserDevice, setSelectedUserDevice,
        selectedUserMeter, setSelectedUserMeter,
        userFilters, setUserFilters,
        inactiveCounts,
        multiResourceData,
        calculateBillingPercentage
    } = useDashboard();
    const [showSupportModal, setShowSupportModal] = React.useState(false);

    if (userRole === 'Domestic') {
        return <DomesticDashboard setActivePage={setActivePage} />;
    }

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

    const userAssignedLocations = 2;
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

    const monthlyCostingData = [
        { label: 'Solar', value: '₹1,200', color: 'text-amber-500' },
        { label: 'Water', value: '₹850', color: 'text-blue-500' },
        { label: 'Energy', value: '₹2,300', color: 'text-emerald-500' },
        { label: 'Gas', value: '₹900', color: 'text-orange-500' },
    ];

    const colorConfig = {
        purple: { bg: 'bg-purple-50/50', border: 'border-purple-100', text: 'text-purple-600', iconBg: 'bg-purple-100' },
        orange: { bg: 'bg-orange-50/50', border: 'border-orange-100', text: 'text-orange-600', iconBg: 'bg-orange-100' },
        red: { bg: 'bg-red-50/50', border: 'border-red-100', text: 'text-red-600', iconBg: 'bg-red-100' },
        emerald: { bg: 'bg-emerald-50/50', border: 'border-emerald-100', text: 'text-emerald-600', iconBg: 'bg-emerald-100' },
        cyan: { bg: 'bg-cyan-50/50', border: 'border-cyan-100', text: 'text-cyan-600', iconBg: 'bg-cyan-100' },
        blue: { bg: 'bg-blue-50/50', border: 'border-blue-100', text: 'text-blue-600', iconBg: 'bg-blue-100' },
        amber: { bg: 'bg-amber-50/50', border: 'border-amber-100', text: 'text-amber-600', iconBg: 'bg-amber-100' },
    };

    /* -------------------- RESOURCE SPECIFIC STATS -------------------- */
    const resourceStatsMap = {
        [RESOURCES.ENERGY]: {
            total: 120, new: 5, active: 110, normal: 105, warnings: 8, attention: 4, offline: 2,
            stats: [
                { label: 'Running', value: 105, color: 'text-emerald-500' },
                { label: 'Warnings', value: 8, color: 'text-amber-500' },
                { label: 'Offline', value: 2, color: 'text-red-500' },
            ]
        },
        [RESOURCES.WATER]: {
            total: 85, new: 2, active: 78, normal: 72, warnings: 4, attention: 2, offline: 1,
            stats: [
                { label: 'Running', value: 72, color: 'text-emerald-500' },
                { label: 'Warnings', value: 4, color: 'text-amber-500' },
                { label: 'Offline', value: 1, color: 'text-red-500' },
            ]
        },
        [RESOURCES.GAS]: {
            total: 45, new: 1, active: 42, normal: 40, warnings: 1, attention: 1, offline: 0,
            stats: [
                { label: 'Running', value: 40, color: 'text-emerald-500' },
                { label: 'Warnings', value: 1, color: 'text-amber-500' },
                { label: 'Offline', value: 0, color: 'text-red-500' },
            ]
        },
        [RESOURCES.SOLAR]: {
            total: 24, new: 4, active: 22, normal: 20, warnings: 2, attention: 0, offline: 0,
            stats: [
                { label: 'Running', value: 20, color: 'text-emerald-500' },
                { label: 'Warnings', value: 2, color: 'text-amber-500' },
                { label: 'Offline', value: 0, color: 'text-red-500' },
            ]
        }
    };

    const currentResStats = resourceStatsMap[activeResource];

    /* -------------------- ALERTS DATA -------------------- */

    return (
        <main className="w-full flex flex-col gap-6 min-h-screen mb-20">
            {showSupportModal && (
                <SupportModal
                    onClose={() => setShowSupportModal(false)}
                    userDetails={{ name: isAdmin ? 'System Admin' : 'Industrial User', id: isAdmin ? 'Admin' : 'User1' }}
                />
            )}

            {/* HEADER */}
            <div className="p-5 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/50 backdrop-blur-sm sticky top-0 z-30 rounded-[20px] shadow-sm mx-4 mt-4 mb-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 w-full">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg transition-transform duration-300 group-hover:scale-105">
                            <LayoutDashboard size={24} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Welcome, {userRole || 'User'}! 👋</h1>
                            <p className="text-sm font-medium text-gray-500">System-wide resource analytics & status</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="px-4 md:px-6 flex flex-col gap-6">

                {/* KPI CARDS */}
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                    {activeResource !== RESOURCES.ALL ? (
                        <>
                            <StatCard
                                title={`Total ${activeResource} Devices`}
                                value={currentResStats.total}
                                icon={<Cpu />}
                                color="blue"
                                description="Deployed meters & sensors"
                                subValue={`${currentResStats.new} New Installed`}
                            />
                            <StatCard
                                title="Operation Status"
                                value={currentResStats.active}
                                icon={<Activity />}
                                color="emerald"
                                description="Currently active units"
                                subValue={`${currentResStats.normal} Normal`}
                                statusBreakdown={currentResStats.stats}
                            />
                            <StatCard
                                title="Device Health"
                                value={currentResStats.warnings}
                                icon={<AlertTriangle />}
                                color="amber"
                                description="Units needing attention"
                                subValue={`${currentResStats.attention} Requires Attention`}
                                statusBreakdown={[
                                    { label: 'Attention', value: currentResStats.attention, color: 'text-amber-500' },
                                    { label: 'Critical', value: 0, color: 'text-red-500' }
                                ]}
                            />
                            <StatCard
                                title="Communication"
                                value={currentResStats.offline}
                                icon={<AlertCircle />}
                                color="red"
                                description="Currently unreachable"
                                subValue="Offline Units"
                                onClick={() => setActivePage('Support')}
                            />
                        </>
                    ) : isAdmin ? (
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
                            />
                            <StatCard
                                title="Devices Location"
                                value="View Details"
                                icon={<MapPin />}
                                color="cyan"
                                description="Filter by location & source"
                                onClick={() => toggleModal('location', true)}
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
                            />
                            <StatCard
                                title="Recent Reports"
                                value={reportsStats.total}
                                icon={<FileText />}
                                color="blue"
                                description="Generated reports"
                                statusBreakdown={[
                                    { label: 'Ready', value: reportsStats.ready, color: 'text-green-600' },
                                    { label: 'Processing', value: reportsStats.processing, color: 'text-amber-600' }
                                ]}
                                onClick={() => setActivePage('Reports')}
                            />
                            <StatCard
                                title="Alert Overview"
                                value={`${dashboardAlerts.filter(a => !a.role || a.role === userRole).length} Total`}
                                icon={<Bell />}
                                color="red"
                                description="Requires immediate action"
                                statusBreakdown={[
                                    { label: 'Critical', value: dashboardAlerts.filter(a => a.type === 'critical' && (!a.role || a.role === userRole)).length, color: 'text-red-600' },
                                    { label: 'Active', value: dashboardAlerts.filter(a => a.type === 'warning' && (!a.role || a.role === userRole)).length, color: 'text-orange-600' },
                                    { label: 'Info', value: dashboardAlerts.filter(a => a.type === 'info' && (!a.role || a.role === userRole)).length, color: 'text-blue-600' }
                                ]}
                                onClick={() => setActivePage('Alerts')}
                            />
                            <StatCard
                                title="Support Management"
                                value="15"
                                icon={<HelpCircle />}
                                color="indigo"
                                description="User request status"
                                statusBreakdown={[
                                    { label: 'Total', value: 15, color: 'text-indigo-600' },
                                    { label: 'Active', value: 6, color: 'text-amber-600' },
                                    { label: 'Resolved', value: 9, color: 'text-emerald-600' }
                                ]}
                                onClick={() => setActivePage('Support')}
                            />
                            <StatCard
                                title="Active Issues"
                                value="21"
                                icon={<AlertCircle />}
                                color="orange"
                                description="System task status"
                                statusBreakdown={[
                                    { label: 'Active', value: 12, color: 'text-orange-600' },
                                    { label: 'Critical', value: 4, color: 'text-red-600' },
                                    { label: 'Resolved', value: 5, color: 'text-emerald-600' }
                                ]}
                                onClick={() => setActivePage('Support')}
                            />
                            <StatCard
                                title="Monthly Costing"
                                value="₹5,250"
                                icon={<CreditCard />}
                                color="emerald"
                                description="Monthly consumption cost"
                                statusBreakdown={monthlyCostingData}
                                onClick={() => setActivePage('Billing')}
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
                                onClick={() => toggleModal('userDevices', true)}
                            />
                            <StatCard
                                title="Assigned Locations"
                                value={userAssignedLocations}
                                icon={<MapPin />}
                                color="cyan"
                                description="Operational sites"
                                statusBreakdown={userLocationStats}
                                onClick={() => toggleModal('userLocations', true)}
                            />
                            <StatCard
                                title="Assigned Meters"
                                value={userAssignedMeters}
                                icon={<Gauge />}
                                color="green"
                                description="Meters under your supervision"
                                statusBreakdown={userMeterStats}
                                onClick={() => toggleModal('userMeters', true)}
                            />
                            <StatCard
                                title="System Health"
                                value="98.5%"
                                icon={<Activity />}
                                color="emerald"
                                description="Operational Uptime"
                            />
                            <StatCard
                                title="Active Alerts"
                                value={`${dashboardAlerts.filter(a => (a.type === 'critical' || a.type === 'warning') && (!a.role || a.role === userRole)).length}`}
                                icon={<AlertTriangle />}
                                color="red"
                                description="Requires attention"
                                statusBreakdown={[
                                    { label: 'Critical', value: dashboardAlerts.filter(a => a.type === 'critical' && (!a.role || a.role === userRole)).length, color: 'text-red-600' },
                                    { label: 'Active', value: dashboardAlerts.filter(a => (a.type === 'warning' || a.type === 'info') && (!a.role || a.role === userRole)).length, color: 'text-orange-600' }
                                ]}
                                onClick={() => setActivePage('Alerts')}
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
                                value="₹5,250"
                                icon={<CreditCard />}
                                color="emerald"
                                description="Monthly consumption cost"
                                statusBreakdown={monthlyCostingData}
                                onClick={() => setActivePage('Billing')}
                            />
                        </>
                    )}
                </div>

                {/* GRAPHS & ALERTS */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 bg-white rounded-2xl shadow-md border border-gray-100 p-6 flex flex-col min-h-[400px]">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">System Consumption</h3>
                                <p className="text-xs text-gray-500 font-medium mt-1">
                                    {activeResource === RESOURCES.ALL ? 'Multi-resource usage breakdown' : `${activeResource} usage over time`}
                                </p>
                            </div>

                            <div className="flex flex-wrap items-center gap-2">
                                <div className="flex bg-white p-1 rounded-xl border border-gray-100 shadow-sm shadow-orange-100">
                                    {RESOURCE_CONFIG.map(res => (
                                        <button
                                            key={res.id}
                                            onClick={() => setActiveResource(res.id)}
                                            className={`
                                                flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all duration-300
                                                ${activeResource === res.id ? res.activeBg : res.inactiveBg}
                                            `}
                                        >
                                            {res.id !== RESOURCES.ALL && <res.icon size={14} strokeWidth={2.5} />}
                                            {res.label}
                                        </button>
                                    ))}
                                </div>
                                <TimeFilter selected={consumptionTimeRange} onChange={setConsumptionTimeRange} />
                            </div>
                        </div>
                        <div className="flex-1 w-full min-h-0">
                            <PerformanceChart data={multiResourceData} />
                        </div>
                    </div>

                    <div className="lg:col-span-1 h-full min-h-[400px]">
                        <div className="bg-white rounded-2xl shadow-md border border-gray-100 h-full overflow-hidden">
                            <AlertsPanel alerts={dashboardAlerts} />
                        </div>
                    </div>
                </div>

                {/* BILLING & REPORTS */}
                {isAdmin && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-5">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                                    <CreditCard size={18} className="text-purple-500" /> Billing Overview
                                </h3>
                                <button onClick={() => setActivePage('Billing')} className="text-xs font-bold text-purple-600 bg-purple-50 px-2 py-1 rounded">View All</button>
                            </div>
                            <div className="grid gap-3">
                                {[
                                    { label: 'Collected', val: billingStats.total, color: 'purple', icon: CreditCard },
                                    { label: 'Pending', val: billingStats.pending, color: 'orange', icon: CreditCard },
                                    { label: 'Overdue', val: billingStats.overdue, color: 'red', icon: AlertTriangle },
                                ].map((item, i) => (
                                    <div key={i} className={`flex items-center gap-3 p-4 rounded-xl ${colorConfig[item.color].bg} border ${colorConfig[item.color].border} cursor-pointer`} onClick={() => setActivePage('Billing')}>
                                        <div className={`p-2 ${colorConfig[item.color].iconBg} ${colorConfig[item.color].text} rounded-lg`}><item.icon size={18} /></div>
                                        <div>
                                            <p className={`text-xs ${colorConfig[item.color].text} font-bold uppercase tracking-wider`}>{item.label}</p>
                                            <p className="text-lg font-bold text-gray-900">{item.val}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-5">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                                    <FileText size={18} className="text-blue-500" /> Recent Reports
                                </h3>
                                <button onClick={() => setActivePage('Reports')} className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">View All</button>
                            </div>
                            <div className="grid gap-3">
                                {[
                                    { title: 'Monthly Data', meta: 'Dec 2024 • 2.4 MB', status: 'Ready' },
                                    { title: 'Solar Analysis', meta: 'Annual 2024 • 5.2 MB', status: 'Ready' },
                                    { title: 'Device Health', meta: 'Jan 2025 • Calculating...', status: 'Processing' },
                                ].map((rep, i) => (
                                    <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-100 cursor-pointer" onClick={() => setActivePage('Reports')}>
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><FileText size={18} /></div>
                                            <div>
                                                <p className="text-sm font-bold text-gray-800">{rep.title}</p>
                                                <p className="text-[10px] text-gray-500 font-medium">{rep.meta}</p>
                                            </div>
                                        </div>
                                        <span className={`px-2 py-1 rounded-lg text-[10px] font-bold ${rep.status === 'Ready' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>{rep.status}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-5">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-bold text-gray-800 flex items-center gap-2"><Gauge size={18} className="text-emerald-500" /> System Status</h3>
                                <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                {[
                                    { label: 'Grid Freq', value: '50.02 Hz', icon: Activity, color: 'emerald' },
                                    { label: 'Water Pres', value: '3.4 bar', icon: Droplet, color: 'cyan' },
                                    { label: 'Gas PSI', value: '2.1 psi', icon: Flame, color: 'orange' },
                                    { label: 'Solar Out', value: '4.2 kW', icon: Sun, color: 'amber' },
                                ].map((p, i) => (
                                    <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl border border-gray-100">
                                        <div className={`p-2 rounded-lg bg-${p.color}-50 text-${p.color}-500`}><p.icon size={16} /></div>
                                        <div>
                                            <p className="text-[10px] text-gray-400 font-bold uppercase">{p.label}</p>
                                            <p className="text-sm font-bold text-gray-900">{p.value}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <DashboardModals
                modalState={modalState}
                toggleModal={toggleModal}
                selectedLocation={selectedLocation}
                setSelectedLocation={setSelectedLocation}
                selectedUserDevice={selectedUserDevice}
                setSelectedUserDevice={setSelectedUserDevice}
                selectedUserMeter={selectedUserMeter}
                setSelectedUserMeter={setSelectedUserMeter}
                userFilters={userFilters}
                setUserFilters={setUserFilters}
                inactiveCounts={inactiveCounts}
                setActivePage={setActivePage}
            />
        </main>
    );
}

import React from "react";
import { LayoutDashboard, Activity, AlertTriangle, AlertCircle, CreditCard, FileText, MapPin, Cpu, Gauge, Users, Droplet, Flame, Sun, HelpCircle, Bell, MessageSquare } from "lucide-react";

import { TimeFilter, AlertsPanel, StatCard, PerformanceChart, DashboardStats, DashboardBottomInfo } from "../components/dashboard";
import DomesticDashboard from "./DomesticDashboard";

import { useDashboard } from "../hooks/useDashboard";
import { DashboardModals } from "../components/dashboard/DashboardModals";
import { RESOURCE_CONFIG, RESOURCES } from "../utils/resourceUtils";
import SupportModal from "../components/modals/SupportModal";
import {
    domesticAlerts,
    industrialAlerts,
    domesticIssues,
    industrialIssues
} from "../data/mockData";

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
    const [isAlertsExpanded, setIsAlertsExpanded] = React.useState(false);

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
    const dashboardAlerts = userRole === 'Admin' ? [...domesticAlerts, ...industrialAlerts] : industrialAlerts;
    const dashboardIssues = userRole === 'Admin' ? [...domesticIssues, ...industrialIssues] : industrialIssues;

    return (
        <main className="w-full flex flex-col gap-6 min-h-screen mb-20">
            {showSupportModal && (
                <SupportModal
                    onClose={() => setShowSupportModal(false)}
                    setActivePage={setActivePage}
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
                            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Welcome, {sessionStorage.getItem('userName') || userRole || 'User'}! 👋</h1>
                            <p className="text-sm font-medium text-gray-500">System-wide resource analytics & status</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="px-4 md:px-6 flex flex-col gap-6">

                {/* KPI CARDS */}
                <DashboardStats
                    userRole={userRole}
                    isAdmin={isAdmin}
                    activeResource={activeResource}
                    currentResStats={currentResStats}
                    totalDevices={totalDevices}
                    deviceStats={deviceStats}
                    locationStats={locationStats}
                    totalMeters={totalMeters}
                    meterStats={meterStats}
                    totalUsers={totalUsers}
                    userStats={userStats}
                    billingStats={billingStats}
                    revenueStats={revenueStats}
                    reportsStats={reportsStats}
                    domesticAlerts={domesticAlerts}
                    industrialAlerts={industrialAlerts}
                    domesticIssues={domesticIssues}
                    industrialIssues={industrialIssues}
                    userAssignedDevices={userAssignedDevices}
                    userDeviceStats={userDeviceStats}
                    userAssignedLocations={userAssignedLocations}
                    userLocationStats={userLocationStats}
                    userAssignedMeters={userAssignedMeters}
                    userMeterStats={userMeterStats}
                    dashboardAlerts={dashboardAlerts}
                    dashboardIssues={dashboardIssues}
                    monthlyCostingData={monthlyCostingData}
                    toggleModal={toggleModal}
                    setActivePage={setActivePage}
                    setShowSupportModal={setShowSupportModal}
                />

                {/* GRAPHS & ALERTS */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {!isAlertsExpanded && (
                        <div className="lg:col-span-2 bg-white rounded-2xl shadow-md border border-gray-100 p-6 flex flex-col min-h-[450px]">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">Time vs Consumption</h3>
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
                    )}

                    <div className={`${isAlertsExpanded ? 'lg:col-span-3' : 'lg:col-span-1'} h-full min-h-[450px]`}>
                        <AlertsPanel
                            alerts={dashboardAlerts}
                            userRole={userRole}
                            setActivePage={setActivePage}
                            isExpanded={isAlertsExpanded}
                            setIsExpanded={setIsAlertsExpanded}
                        />
                    </div>
                </div>

                {/* BILLING & REPORTS */}
                <DashboardBottomInfo
                    isAdmin={isAdmin}
                    billingStats={billingStats}
                    colorConfig={colorConfig}
                    reportsStats={reportsStats}
                    setActivePage={setActivePage}
                />
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

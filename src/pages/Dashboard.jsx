import React, { useState, useEffect, useCallback, useMemo } from "react";
import { LayoutDashboard, Activity, AlertTriangle, AlertCircle, CreditCard, FileText, MapPin, Cpu, Gauge, Users, Droplet, Flame, Sun, HelpCircle, Bell, MessageSquare } from "lucide-react";

import { TimeFilter, AlertsPanel, StatCard, PerformanceChart, DashboardStats, DashboardBottomInfo } from "../components/dashboard";
import DomesticDashboard from "./DomesticDashboard";

import { useDashboard } from "../hooks/useDashboard";
import { DashboardModals } from "../components/dashboard/DashboardModals";
import { RESOURCE_CONFIG, RESOURCES } from "../utils/resourceUtils";
import SupportModal from "../components/modals/SupportModal";
import { useSupport } from '../context/SupportContext';
import { apiService } from "../services/apiService";
import { formatCurrency } from "../utils/formatters";

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

import { useData } from "../context/DataContext";

export default function Dashboard({ setActivePage = () => { }, userRole }) {
    const { tickets } = useSupport();
    const isAdmin = userRole === 'Admin' || userRole === 'Super Admin';
    const {
        devices: fetchedDevices,
        meters: fetchedMeters,
        users: fetchedUsers,
        reports: fetchedReports,
        invoices: fetchedInvoices,
        isLoading
    } = useData();

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
    const [showSupportModal, setShowSupportModal] = useState(false);
    const [isAlertsExpanded, setIsAlertsExpanded] = useState(false);

    // Memoize stable navigation callbacks to prevent DashboardStats re-evaluations
    const handleNavToDevices = useCallback(() => {
        sessionStorage.setItem('devicesPageTab', 'devices');
        setActivePage('Devices');
    }, [setActivePage]);

    useEffect(() => {
        const handleOpenSupport = () => setShowSupportModal(true);
        window.addEventListener('open-support-modal', handleOpenSupport);
        return () => window.removeEventListener('open-support-modal', handleOpenSupport);
    }, []);

    const handleNavToMeters = useCallback(() => {
        sessionStorage.setItem('devicesPageTab', 'meters');
        setActivePage('Devices');
    }, [setActivePage]);

    const handleNavToUsers = useCallback(() => setActivePage('Users'), [setActivePage]);
    const handleNavToBilling = useCallback(() => setActivePage('Billing'), [setActivePage]);
    const handleNavToReports = useCallback(() => setActivePage('Reports'), [setActivePage]);
    const handleNavToAlerts = useCallback(() => setActivePage('Alerts'), [setActivePage]);
    const handleNavToSupport = useCallback(() => setActivePage('Support'), [setActivePage]);
    const handleNavToIssues = useCallback(() => setActivePage('Issues'), [setActivePage]);
    const handleNavToEnergy = useCallback(() => setActivePage('Energy'), [setActivePage]);
    const handleNavToSolar = useCallback(() => setActivePage('Solar'), [setActivePage]);
    const handleNavToWater = useCallback(() => setActivePage('Water'), [setActivePage]);
    const handleNavToGas = useCallback(() => setActivePage('Gas'), [setActivePage]);
    const handleNavToLocations = useCallback(() => setActivePage('Locations'), [setActivePage]);


    if (userRole === 'Domestic User' && false) { // Disable the old DomesticDashboard for now to use the new unified one
        return <DomesticDashboard setActivePage={setActivePage} />;
    }

    const [selectedUserId, setSelectedUserId] = useState('All');
    const userIdentifier = sessionStorage.getItem('userName') || userRole || 'User1';

    const filteredInvoices = useMemo(() => {
        if (!isAdmin || selectedUserId === 'All') return fetchedInvoices;
        return fetchedInvoices.filter(i => i.userId === parseInt(selectedUserId));
    }, [fetchedInvoices, isAdmin, selectedUserId]);

    const filteredReports = useMemo(() => {
        if (!isAdmin || selectedUserId === 'All') return fetchedReports;
        return fetchedReports.filter(r => r.userId === parseInt(selectedUserId));
    }, [fetchedReports, isAdmin, selectedUserId]);

    const filteredDevices = useMemo(() => {
        if (!isAdmin || selectedUserId === 'All') return fetchedDevices;
        return fetchedDevices.filter(d => d.userId === parseInt(selectedUserId));
    }, [fetchedDevices, isAdmin, selectedUserId]);

    const filteredMeters = useMemo(() => {
        if (!isAdmin || selectedUserId === 'All') return fetchedMeters;
        return fetchedMeters.filter(m => m.userId === parseInt(selectedUserId));
    }, [fetchedMeters, isAdmin, selectedUserId]);

    /* -------------------- ADMIN METRICS (DYNAMIC) -------------------- */
    const adminDevices = filteredDevices;
    const adminMeters = filteredMeters;
    const allAdminAssets = [...adminDevices, ...adminMeters];

    const totalDevices = adminDevices.length;
    const deviceStats = [
        { label: 'Active', value: adminDevices.filter(d => d.status === 'Active').length, color: 'text-emerald-500' },
        { label: 'Warnings', value: adminDevices.filter(d => d.status === 'Warning').length, color: 'text-amber-500' },
        { label: 'Offline', value: adminDevices.filter(d => d.status === 'Offline').length, color: 'text-red-500' },
    ];

    const totalMeters = adminMeters.length;
    const meterStats = [
        { label: 'Active', value: adminMeters.filter(m => m.status === 'Active').length, color: 'text-emerald-500' },
        { label: 'Warnings', value: adminMeters.filter(m => m.status === 'Warning').length, color: 'text-amber-500' },
        { label: 'Offline', value: adminMeters.filter(m => m.status === 'Offline').length, color: 'text-red-500' },
    ];

    const citiesSet = new Set(allAdminAssets.map(d => d.city || d.location || d.meterLocation || 'Unknown'));
    const totalLocations = citiesSet.size;

    // Recalculate Top Location and Location-wise Breakdown
    const cityCounts = Array.from(citiesSet).map(city => {
        const count = allAdminAssets.filter(d => (d.city || d.location || d.meterLocation || 'Unknown') === city).length;
        return { label: city, value: count, color: 'text-blue-500' };
    }).sort((a, b) => b.value - a.value);

    const topCity = cityCounts[0]?.label || 'Unknown';

    // Show top 3 locations in the breakdown
    const locationStats = cityCounts.slice(0, 3);

    const totalUsers = fetchedUsers.length;
    const userStats = [
        { label: 'Active', value: fetchedUsers.filter(u => u.status === 'Active').length, color: 'text-green-500' },
        { label: 'Inactive', value: fetchedUsers.filter(u => u.status === 'Inactive').length, color: 'text-red-500' },
        { label: 'Deactivated', value: 0, color: 'text-gray-400' },
    ];

    const sumAmounts = (list) => list?.reduce((acc, curr) => acc + (parseFloat(curr?.amount?.replace(/[^0-9.-]+/g, '')) || 0), 0) || 0;

    // Dynamically calculate billing stats
    const billingStats = {
        total: sumAmounts(filteredInvoices),
        pending: sumAmounts(filteredInvoices.filter(i => i.status === 'Pending')),
        overdue: sumAmounts(filteredInvoices.filter(i => i.status === 'Overdue' || (i.status || '').toLowerCase() === 'unpaid'))
    };

    const revenueStats = [
        { label: 'Paid', value: filteredInvoices.filter(i => i.status === 'Paid').length, color: 'text-emerald-500' },
        { label: 'Unpaid', value: filteredInvoices.filter(i => (i.status || '').toLowerCase() === 'unpaid' || i.status === 'Overdue').length, color: 'text-red-500' },
        { label: 'Pending', value: filteredInvoices.filter(i => i.status === 'Pending').length, color: 'text-amber-500' },
        { label: 'Processing', value: filteredInvoices.filter(i => i.status === 'Processing').length, color: 'text-blue-500' },
    ];

    /* -------------------- USER METRICS (DYNAMIC) -------------------- */
    const userDevices = fetchedDevices.filter(d => d.user === userIdentifier || d.admin === userIdentifier);
    const userMeters = fetchedMeters.filter(m => m.user === userIdentifier || m.admin === userIdentifier);
    const allUserAssets = [...userDevices, ...userMeters];

    const userAssignedDevices = userDevices.length;
    const userDeviceStats = [
        { label: 'Active', value: userDevices.filter(d => d.status === 'Active').length, color: 'text-emerald-500' },
        { label: 'Inactive', value: userDevices.filter(d => d.status === 'Inactive').length, color: 'text-amber-500' },
        { label: 'Deactivated', value: userDevices.filter(d => ['Deactive', 'Deactivated'].includes(d.status)).length, color: 'text-red-500' },
    ];

    const userCitiesSet = new Set(allUserAssets.map(d => d.city || d.location || d.meterLocation || 'Unknown'));
    const userAssignedLocations = userCitiesSet.size;

    const sortedUserCities = Array.from(userCitiesSet).sort((a, b) =>
        allUserAssets.filter(d => (d.city || d.location || d.meterLocation || 'Unknown') === b).length -
        allUserAssets.filter(d => (d.city || d.location || d.meterLocation || 'Unknown') === a).length
    );
    const topUserCity = sortedUserCities[0] || 'Unknown';

    const userLocationStats = [
        { label: 'Mapped Devices & Meters', value: allUserAssets.length, color: 'text-blue-500' },
        { label: 'Top Location', value: topUserCity, color: 'text-purple-500' }
    ];

    const userAssignedMeters = userMeters.length;
    const userMeterStats = [
        { label: 'Active', value: userMeters.filter(d => d.status === 'Active').length, color: 'text-emerald-500' },
        { label: 'Inactive', value: userMeters.filter(d => d.status === 'Inactive').length, color: 'text-amber-500' },
        { label: 'Deactivated', value: userMeters.filter(d => ['Deactive', 'Deactivated'].includes(d.status)).length, color: 'text-red-500' },
    ];

    const currentInactiveCounts = React.useMemo(() => ({
        devices: (isAdmin ? filteredDevices : userDevices).filter(d => d.status !== 'Active'),
        meters: (isAdmin ? filteredMeters : userMeters).filter(m => m.status !== 'Active'),
        users: fetchedUsers.filter(u => u.status !== 'Active')
    }), [isAdmin, filteredDevices, filteredMeters, userDevices, userMeters, fetchedUsers]);

    const reportsStats = {
        ready: filteredReports.filter(r => r.status === 'Ready').length,
        processing: filteredReports.filter(r => r.status === 'Processing').length,
        total: filteredReports.length
    };

    // Dynamically calculate monthly costing data
    const monthlyCostingData = useMemo(() => {
        const resourceMap = {
            'ELECTRIC': { label: 'Energy', color: 'text-emerald-500', total: 0 },
            'WATER': { label: 'Water', color: 'text-blue-500', total: 0 },
            'GAS': { label: 'Gas', color: 'text-orange-500', total: 0 },
            'SOLAR': { label: 'Solar', color: 'text-amber-500', total: 0 },
            'OTHER': { label: 'Other', color: 'text-gray-500', total: 0 }
        };

        filteredInvoices.forEach(inv => {
            let res = (inv.resourceType || '').toUpperCase();
            if (res === 'ENERGY') res = 'ELECTRIC';

            if (resourceMap[res]) {
                resourceMap[res].total += (parseFloat(inv.amount?.replace(/[^0-9.-]+/g, '')) || 0);
            } else {
                resourceMap['OTHER'].total += (parseFloat(inv.amount?.replace(/[^0-9.-]+/g, '')) || 0);
            }
        });

        return Object.values(resourceMap)
            .filter(res => res.total > 0 || res.label !== 'Other')
            .map(res => ({
                label: res.label,
                value: formatCurrency(res.total),
                numericValue: res.total,
                color: res.color
            }));
    }, [filteredInvoices]);

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
    const dashboardAlerts = (userRole === 'Admin' || userRole === 'Super Admin'
        ? tickets.filter(t => t.type === 'alert')
        : tickets.filter(t => t.type === 'alert' && (t.username === userIdentifier || t.userName === userIdentifier))
    ).sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date)).slice(0, 10);

    return (
        <div className="flex flex-col flex-1">
            <main className="w-full min-h-screen p-4 md:p-6 font-sans pt-6 md:pt-8">
                {showSupportModal && (
                    <SupportModal
                        onClose={() => setShowSupportModal(false)}
                        setActivePage={setActivePage}
                        userDetails={{
                            name: sessionStorage.getItem('userName') || (isAdmin ? 'System Admin' : 'User'),
                            id: sessionStorage.getItem('userId') || (isAdmin ? 'Admin' : 'User1')
                        }}
                    />
                )}

                {/* HEADER */}
                <div className="p-5 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/50 backdrop-blur-sm sticky top-0 z-30 rounded-[20px] shadow-sm mb-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 w-full">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg transition-transform duration-300 group-hover:scale-105">
                                <LayoutDashboard size={24} />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Welcome, {sessionStorage.getItem('userName') || userRole || 'User'}! 👋</h1>
                                <p className="text-sm font-medium text-gray-500">Real-time monitoring and analytics</p>
                            </div>
                        </div>

                        {isAdmin && (
                            <div className="flex flex-col gap-1 min-w-[200px]">
                                <label className="text-[10px] font-black uppercase tracking-widest text-[#ff6e00] ml-1">User List (Optional)</label>
                                <select
                                    value={selectedUserId}
                                    onChange={(e) => setSelectedUserId(e.target.value)}
                                    className="w-full px-4 py-2.5 bg-white border border-gray-100 rounded-xl text-sm font-bold text-gray-700 shadow-sm outline-none focus:ring-4 focus:ring-orange-500/10 transition-all cursor-pointer hover:border-orange-300 shadow-md shadow-orange-100"
                                >
                                    <option value="All">All Users</option>
                                    {fetchedUsers.map(u => (
                                        <option key={u.id} value={u.id}>
                                            {u.firstName} {u.lastName} ({u.role === 'Industrial User' ? 'Industrial' : 'Domestic'})
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex flex-col gap-6 w-full mt-4">

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
                        userAssignedDevices={userAssignedDevices}
                        userDeviceStats={userDeviceStats}
                        userAssignedLocations={userAssignedLocations}
                        userLocationStats={userLocationStats}
                        userAssignedMeters={userAssignedMeters}
                        userMeterStats={userMeterStats}
                        dashboardAlerts={dashboardAlerts}
                        monthlyCostingData={monthlyCostingData}
                        toggleModal={toggleModal}
                        handleNavToDevices={handleNavToDevices}
                        handleNavToMeters={handleNavToMeters}
                        handleNavToUsers={handleNavToUsers}
                        handleNavToBilling={handleNavToBilling}
                        handleNavToReports={handleNavToReports}
                        handleNavToAlerts={handleNavToAlerts}
                        handleNavToSupport={handleNavToSupport}
                        handleNavToIssues={handleNavToIssues}
                        handleNavToLocations={handleNavToLocations}
                        handleNavToEnergy={handleNavToEnergy}
                        handleNavToSolar={handleNavToSolar}
                        handleNavToWater={handleNavToWater}
                        handleNavToGas={handleNavToGas}
                        totalLocations={totalLocations}
                        topCity={topCity}
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
                        reports={fetchedReports}
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
                    inactiveCounts={currentInactiveCounts}
                    setActivePage={setActivePage}
                    userDevicesList={userDevices}
                    userMetersList={userMeters}
                />
            </main>
        </div>
    );
}

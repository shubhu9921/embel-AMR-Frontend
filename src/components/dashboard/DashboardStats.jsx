import React from 'react';
import { Cpu, Activity, AlertTriangle, AlertCircle, MapPin, Gauge, Users, CreditCard, FileText, Bell, HelpCircle, MessageSquare } from 'lucide-react';
import { StatCard } from './StatCard';
import { RESOURCES } from '../../utils/resourceUtils';
import { useSupport } from '../../context/SupportContext';

export function DashboardStats({
    userRole,
    isAdmin,
    activeResource,
    currentResStats,
    totalDevices,
    deviceStats,
    locationStats,
    totalMeters,
    meterStats,
    totalUsers,
    userStats,
    billingStats,
    revenueStats,
    reportsStats,
    domesticAlerts,
    industrialAlerts,
    userAssignedDevices,
    userDeviceStats,
    userAssignedLocations,
    userLocationStats,
    userAssignedMeters,
    userMeterStats,
    dashboardAlerts,
    monthlyCostingData,
    toggleModal,
    setActivePage,
    setShowSupportModal
}) {
    const { getKPIs } = useSupport();
    const stats = getKPIs(userRole);
    if (activeResource !== RESOURCES.ALL) {
        return (
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
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
            </div>
        );
    }

    if (isAdmin) {
        return (
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
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
                    value={stats.alerts.total}
                    icon={<Bell />}
                    color="red"
                    description="Requires immediate action"
                    statusBreakdown={[
                        { label: 'Total', value: stats.alerts.total, color: 'text-red-600' },
                        { label: 'Open', value: stats.alerts.open, color: 'text-orange-600' },
                        { label: 'Assigned', value: stats.alerts.assigned, color: 'text-blue-600' },
                        { label: 'Closed', value: stats.alerts.closed, color: 'text-emerald-600' }
                    ]}
                    onClick={() => setActivePage('Alerts')}
                />
                <StatCard
                    title="Support Management"
                    value={stats.overall.total}
                    icon={<HelpCircle />}
                    color="indigo"
                    description="User request status"
                    statusBreakdown={[
                        { label: 'Total', value: stats.overall.total, color: 'text-indigo-600' },
                        { label: 'Open', value: stats.overall.pending, color: 'text-amber-600' },
                        { label: 'Assigned', value: stats.overall.assigned, color: 'text-blue-600' },
                        { label: 'Resolved', value: stats.overall.resolved, color: 'text-emerald-600' }
                    ]}
                    onClick={() => setActivePage('Support')}
                />
                <StatCard
                    title="Active Issues"
                    value={stats.issues.total}
                    icon={<AlertCircle />}
                    color="orange"
                    description="User Reported Issues"
                    statusBreakdown={[
                        { label: 'Total', value: stats.issues.total, color: 'text-gray-600' },
                        { label: 'Open', value: stats.issues.open, color: 'text-orange-600' },
                        { label: 'Assigned', value: stats.issues.assigned, color: 'text-blue-600' },
                        { label: 'Closed', value: stats.issues.closed, color: 'text-emerald-600' }
                    ]}
                    onClick={() => setActivePage('Issues')}
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
            </div>
        );
    }

    // If user is Domestic, show the specific 4-card layout requested for User2
    if (userRole === 'Domestic') {
        const currentUserIdentifier = sessionStorage.getItem('userName') || userRole;
        const userStats = getKPIs(currentUserIdentifier);

        return (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                <StatCard
                    title="Total Issues"
                    value={userStats.issues.total}
                    icon={<AlertCircle />}
                    color="orange"
                    description="Issues raised by you"
                    statusBreakdown={[
                        { label: 'Open', value: userStats.issues.open, color: 'text-orange-600' },
                        { label: 'Assigned', value: userStats.issues.assigned, color: 'text-blue-600' },
                        { label: 'Solved', value: userStats.issues.closed, color: 'text-emerald-600' }
                    ]}
                    onClick={() => setActivePage('Issues')}
                />
                <StatCard
                    title="Total Alerts"
                    value={userStats.alerts.total}
                    icon={<Bell />}
                    color="red"
                    description="System alerts for you"
                    statusBreakdown={[
                        { label: 'Open', value: userStats.alerts.open, color: 'text-red-600' },
                        { label: 'Assigned', value: userStats.alerts.assigned, color: 'text-blue-600' },
                        { label: 'Solved', value: userStats.alerts.closed, color: 'text-emerald-600' }
                    ]}
                    onClick={() => setActivePage('Alerts')}
                />
                <StatCard
                    title="Assigned Tickets"
                    value={userStats.overall.assigned}
                    icon={<Users />}
                    color="blue"
                    description="Tickets with engineer"
                    subValue="Being processed"
                    onClick={() => setActivePage('Support')}
                />
                <StatCard
                    title="Solved Tickets"
                    value={userStats.overall.resolved}
                    icon={<MessageSquare />}
                    color="emerald"
                    description="Completed requests"
                    subValue="Successfully resolved"
                    onClick={() => setActivePage('Support')}
                />
            </div>
        );
    }

    // Industrial User Layout (New 8-card layout)
    if (userRole === 'Industrial') {
        const currentUserIdentifier = sessionStorage.getItem('userName') || userRole;
        const userStats = getKPIs(currentUserIdentifier);

        return (
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
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
                    subValue="System status: Optimal"
                />
                <StatCard
                    title="System Alerts"
                    value={userStats.alerts.total}
                    icon={<Bell />}
                    color="red"
                    description="Requires attention"
                    statusBreakdown={[
                        { label: 'Critical', value: userStats?.alerts?.open ? Math.max(1, Math.floor(userStats.alerts.open * 0.4)) : 0, color: 'text-red-600' },
                        { label: 'Active', value: userStats?.alerts?.open ? userStats.alerts.open - Math.max(1, Math.floor(userStats.alerts.open * 0.4)) : 0, color: 'text-orange-600' }
                    ]}
                    onClick={() => setActivePage('Alerts')}
                />
                <StatCard
                    title="Raise Ticket for Support"
                    value={userStats.overall.total}
                    icon={<HelpCircle />}
                    color="indigo"
                    description="Total Tickets Raised"
                    onClick={() => setShowSupportModal(true)}
                />
                <StatCard
                    title="System Issues"
                    value={userStats.issues.total}
                    icon={<AlertCircle />}
                    color="orange"
                    description="View Ticket Details"
                    statusBreakdown={[
                        { label: 'Resolved', value: userStats.issues.closed, color: 'text-emerald-600' },
                        { label: 'Processing', value: userStats.issues.assigned, color: 'text-blue-600' },
                        { label: 'Active', value: userStats.issues.open, color: 'text-orange-600' }
                    ]}
                    onClick={() => setActivePage('Issues')}
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
            </div>
        );
    }

    // Default layout for other roles (preserving original KPIs)
    return (
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <StatCard
                title="Energy Summary"
                value="1,240 kWh"
                icon={<Gauge />}
                color="blue"
                description="Total consumption today"
                subValue="Active Load: 45kW"
                onClick={() => setActivePage('Energy')}
            />
            <StatCard
                title="Solar Generation"
                value="450 kWh"
                icon={<Activity />}
                color="emerald"
                description="Generated power today"
                subValue="Efficiency: 94%"
                onClick={() => setActivePage('Solar')}
            />
            <StatCard
                title="Water Usage"
                value="4,500 L"
                icon={<Gauge />}
                color="blue"
                description="Daily consumption"
                subValue="Avg Flow: 12L/m"
                onClick={() => setActivePage('Water')}
            />
            <StatCard
                title="Gas Usage"
                value="12 m³"
                icon={<Gauge />}
                color="amber"
                description="Daily consumption"
                subValue="Avg Pressure: 2bar"
                onClick={() => setActivePage('Gas')}
            />
        </div>
    );
}

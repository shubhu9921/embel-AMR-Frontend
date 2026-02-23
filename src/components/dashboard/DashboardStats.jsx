import React from 'react';
import { Cpu, Activity, AlertTriangle, AlertCircle, MapPin, Gauge, Users, CreditCard, FileText, Bell, HelpCircle, MessageSquare } from 'lucide-react';
import { StatCard } from './StatCard';
import { RESOURCES } from '../../utils/resourceUtils';

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
    domesticIssues,
    industrialIssues,
    userAssignedDevices,
    userDeviceStats,
    userAssignedLocations,
    userLocationStats,
    userAssignedMeters,
    userMeterStats,
    dashboardAlerts,
    dashboardIssues,
    monthlyCostingData,
    toggleModal,
    setActivePage,
    setShowSupportModal
}) {
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
                    value={`${(domesticAlerts || []).length + (industrialAlerts || []).length}`}
                    icon={<Bell />}
                    color="red"
                    description="Requires immediate action"
                    statusBreakdown={[
                        { label: 'Critical', value: [...(domesticAlerts || []), ...(industrialAlerts || [])].filter(a => a.type === 'critical').length, color: 'text-red-600' },
                        { label: 'Active', value: [...(domesticAlerts || []), ...(industrialAlerts || [])].filter(a => a.type === 'warning').length, color: 'text-orange-600' },
                        { label: 'Info', value: [...(domesticAlerts || []), ...(industrialAlerts || [])].filter(a => a.type === 'info').length, color: 'text-blue-600' }
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
                    value={`${(domesticIssues || []).length + (industrialIssues || []).length}`}
                    icon={<AlertCircle />}
                    color="orange"
                    description="User Reported Issues"
                    statusBreakdown={[
                        { label: 'Pending', value: [...(domesticIssues || []), ...(industrialIssues || [])].filter(i => i.status === 'Pending').length, color: 'text-orange-600' },
                        { label: 'Processing', value: [...(domesticIssues || []), ...(industrialIssues || [])].filter(i => i.status === 'Processing').length, color: 'text-blue-600' },
                        { label: 'Resolved', value: [...(domesticIssues || []), ...(industrialIssues || [])].filter(i => i.status === 'Resolved').length, color: 'text-emerald-600' }
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
            />
            <StatCard
                title="System Alerts"
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
                title="Raise Ticket for Support"
                value={dashboardIssues.length}
                icon={<HelpCircle />}
                color="indigo"
                description="Total Tickets Raised"
                onClick={() => setShowSupportModal(true)}
            />
            <StatCard
                title="System Issues"
                value={dashboardIssues.length}
                icon={<MessageSquare />}
                color="blue"
                description="View Ticket Details"
                statusBreakdown={[
                    { label: 'Resolved', value: dashboardIssues.filter(i => i.status === 'Resolved').length, color: 'text-emerald-600' },
                    { label: 'Processing', value: dashboardIssues.filter(i => i.status === 'Processing').length, color: 'text-blue-600' },
                    { label: 'Active', value: dashboardIssues.filter(i => i.status === 'Active').length, color: 'text-amber-600' }
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
        </div>
    );
}

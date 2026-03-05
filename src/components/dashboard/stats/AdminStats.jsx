import React from 'react';
import { Cpu, MapPin, Gauge, Users, CreditCard, FileText, Bell, HelpCircle, AlertCircle, AlertTriangle, Plus, MessageSquare } from 'lucide-react';
import { StatCard } from '../StatCard';
import { formatCurrency } from '../../../utils/formatters';


export const AdminStats = React.memo(({
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
    stats,
    monthlyCostingData,
    toggleModal,
    handleNavToDevices,
    handleNavToMeters,
    handleNavToUsers,
    handleNavToBilling,
    handleNavToReports,
    handleNavToAlerts,
    handleNavToSupport,
    handleNavToIssues,
    handleNavToLocations,
    totalLocations,
    topCity,
    tickets
}) => {
    const safeStats = stats || { alerts: {}, overall: {}, issues: {} };
    const safeBilling = billingStats || { total: 0, pending: 0 };
    const safeReports = reportsStats || { total: 0, ready: 0, processing: 0 };
    const activeDevices = Array.isArray(deviceStats) ? deviceStats.find(s => s.label === 'Active' || s.label === 'Online')?.value : (deviceStats?.active || 0);
    const activeMeters = Array.isArray(meterStats) ? meterStats.find(s => s.label === 'Active' || s.label === 'Online')?.value : (meterStats?.active || 0);

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <StatCard
                title="Total Devices"
                value={totalDevices}
                icon={<Cpu />}
                color="blue"
                description="Hardware deployed"
                subValue={activeDevices ? `Active: ${activeDevices}` : undefined}
                statusBreakdown={deviceStats}
                onClick={handleNavToDevices}
            />
            <StatCard
                title="Devices Location"
                value={totalDevices + totalMeters}
                icon={<MapPin />}
                color="cyan"
                subValue="Mapped Devices & Meters"
                description={`Top: ${topCity} | View Details`}
                statusBreakdown={locationStats}
                onClick={handleNavToLocations}
            />
            <StatCard
                title="Total Meters"
                value={totalMeters}
                icon={<Gauge />}
                color="green"
                description="Meters monitored"
                subValue={activeMeters ? `Active: ${activeMeters}` : undefined}
                statusBreakdown={meterStats}
                onClick={handleNavToMeters}
            />
            <StatCard
                title="Total Users"
                value={totalUsers}
                icon={<Users />}
                color="orange"
                description="Overall registered accounts"
                statusBreakdown={userStats}
                onClick={handleNavToUsers}
            />
            <StatCard
                title="Total Reports"
                value={safeReports.total}
                icon={<FileText />}
                color="blue"
                description="Available reports"
                statusBreakdown={[
                    { label: 'Ready', value: safeReports.ready, color: 'text-green-600' },
                    { label: 'Processing', value: safeReports.processing, color: 'text-amber-600' }
                ]}
                onClick={handleNavToReports}
            />
            <StatCard
                title="Raise Ticket"
                value="Support"
                icon={<Plus />}
                color="indigo"
                description="Submit a detailed report"
                statusBreakdown={[
                    { label: 'Avg. Response', value: '< 2 hrs', color: 'text-indigo-600' }
                ]}
                onClick={() => handleNavToSupport()}
            />
            <StatCard
                title="Support Tickets"
                value={tickets.length}
                icon={<MessageSquare />}
                color="indigo"
                description="Total combined requests"
                statusBreakdown={[
                    { label: 'Pending', value: tickets.filter(t => t.status === 'Pending').length, color: 'text-amber-500' },
                    { label: 'Processing', value: tickets.filter(t => t.status === 'Processing' || t.status === 'In Progress' || t.status === 'Assigned').length, color: 'text-blue-500' },
                    { label: 'Resolved', value: tickets.filter(t => t.status === 'Resolved').length, color: 'text-emerald-500' }
                ]}
                onClick={handleNavToSupport}
            />

            <StatCard
                title="Issues"
                value={tickets.filter(t => (t.type || '').toLowerCase() === 'issue').length}
                icon={<AlertTriangle />}
                color="orange"
                description="Total Issues"
                statusBreakdown={[
                    { label: 'Pending', value: tickets.filter(i => (i.type || '').toLowerCase() === 'issue' && i.status === 'Pending').length, color: 'text-amber-500' },
                    { label: 'Processing', value: tickets.filter(i => (i.type || '').toLowerCase() === 'issue' && (i.status === 'Processing' || i.status === 'In Progress')).length, color: 'text-blue-500' },
                    { label: 'Resolved', value: tickets.filter(i => (i.type || '').toLowerCase() === 'issue' && i.status === 'Resolved').length, color: 'text-emerald-500' }
                ]}
                onClick={handleNavToIssues}
            />

            <StatCard
                title="Alerts"
                value={tickets.filter(t => (t.type || '').toLowerCase() === 'alert').length}
                icon={<Bell />}
                color="red"
                description="Total Alerts"
                statusBreakdown={[
                    { label: 'Pending', value: tickets.filter(a => (a.type || '').toLowerCase() === 'alert' && a.status === 'Pending').length, color: 'text-amber-500' },
                    { label: 'Processing', value: tickets.filter(a => (a.type || '').toLowerCase() === 'alert' && (a.status === 'Processing' || a.status === 'In Progress')).length, color: 'text-blue-500' },
                    { label: 'Resolved', value: tickets.filter(a => (a.type || '').toLowerCase() === 'alert' && a.status === 'Resolved').length, color: 'text-emerald-500' }
                ]}
                onClick={handleNavToAlerts}
            />

            <StatCard
                title="Monthly Costing"
                value={formatCurrency(monthlyCostingData ? monthlyCostingData.reduce((acc, curr) => acc + (curr.numericValue || parseFloat(String(curr.value).replace(/[^0-9.-]+/g, "")) || 0), 0) : 0)}
                icon={<CreditCard />}
                color="emerald"
                description="Monthly consumption cost"
                statusBreakdown={monthlyCostingData}
                onClick={handleNavToBilling}
            />
        </div>
    );
});

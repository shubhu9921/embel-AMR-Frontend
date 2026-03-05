import React from 'react';
import { Cpu, MapPin, Gauge, Activity, Bell, HelpCircle, AlertCircle, CreditCard, AlertTriangle, Plus, FileText } from 'lucide-react';
import { StatCard } from '../StatCard';
import { formatCurrency } from '../../../utils/formatters';

export const IndustrialStats = React.memo(({
    userAssignedDevices,
    userDeviceStats,
    userAssignedLocations,
    userLocationStats,
    userAssignedMeters,
    userMeterStats,
    userStats,
    monthlyCostingData,
    toggleModal,
    handleNavToAlerts,
    handleNavToIssues,
    handleNavToBilling,
    handleNavToSupport,
    handleNavToLocations,
    tickets
}) => {
    const safeStats = userStats || { alerts: {}, issues: {}, overall: {} };
    const healthPercent = safeStats.alerts.open ? Math.max(0, 100 - safeStats.alerts.open * 1.5).toFixed(1) + '%' : '100%';

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
                description="Operational sites | View Details"
                statusBreakdown={userLocationStats}
                onClick={handleNavToLocations}
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
                title="Raise Ticket"
                value="Support"
                icon={<Plus />}
                color="indigo"
                description="Submit a detailed report"
                statusBreakdown={[
                    { label: 'Avg. Response', value: '< 2 hrs', color: 'text-indigo-600' }
                ]}
                onClick={handleNavToSupport}
            />

            <StatCard
                title="Issues"
                value={tickets.filter(t => (t.type || t.issueType || '').toLowerCase() === 'issue').length}
                icon={<AlertTriangle />}
                color="orange"
                description="Total Issues"
                statusBreakdown={[
                    { label: 'Pending', value: tickets.filter(i => (i.type || i.issueType || '').toLowerCase() === 'issue' && i.status === 'Pending').length, color: 'text-amber-500' },
                    { label: 'Processing', value: tickets.filter(i => (i.type || i.issueType || '').toLowerCase() === 'issue' && (i.status === 'Processing' || i.status === 'In Progress')).length, color: 'text-blue-500' },
                    { label: 'Resolved', value: tickets.filter(i => (i.type || i.issueType || '').toLowerCase() === 'issue' && i.status === 'Resolved').length, color: 'text-emerald-500' }
                ]}
                onClick={handleNavToIssues}
            />

            <StatCard
                title="Alerts"
                value={tickets.filter(t => (t.type || t.issueType || '').toLowerCase() === 'alert').length}
                icon={<Bell />}
                color="red"
                description="Total Alerts"
                statusBreakdown={[
                    { label: 'Pending', value: tickets.filter(a => (a.type || a.issueType || '').toLowerCase() === 'alert' && a.status === 'Pending').length, color: 'text-amber-500' },
                    { label: 'Processing', value: tickets.filter(a => (a.type || a.issueType || '').toLowerCase() === 'alert' && (a.status === 'Processing' || a.status === 'In Progress')).length, color: 'text-blue-500' },
                    { label: 'Resolved', value: tickets.filter(a => (a.type || a.issueType || '').toLowerCase() === 'alert' && a.status === 'Resolved').length, color: 'text-emerald-500' }
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

import React, { useMemo } from 'react';
import { MessageSquare, AlertCircle, Clock, CheckCircle } from 'lucide-react';
import { StatCard } from './StatCard';

export const SupportTicketsBreakdownCard = React.memo(({ tickets = [], onClick }) => {
    // Process tickets to calculate complex KPI metrics
    const stats = useMemo(() => {
        const issues = tickets.filter(t => (t.type || '').toLowerCase() === 'issue');
        const alerts = tickets.filter(t => (t.type || '').toLowerCase() === 'alert');

        const total = tickets.length;

        // Helper to extract nested counts for a given status
        const getBreakdown = (statusMatchFn) => {
            const matched = tickets.filter(statusMatchFn);

            let water = 0, energy = 0, gas = 0, solar = 0;
            matched.forEach(t => {
                const s = (t.source || '').toLowerCase();
                if (s.includes('water')) water++;
                else if (s.includes('energy')) energy++;
                else if (s.includes('gas')) gas++;
                else if (s.includes('solar')) solar++;
            });

            return [
                { label: 'Water', value: water, color: 'text-blue-500' },
                { label: 'Energy', value: energy, color: 'text-emerald-500' },
                { label: 'Gas', value: gas, color: 'text-orange-500' },
                { label: 'Solar', value: solar, color: 'text-amber-500' }
            ];
        };

        return {
            total,
            totalIssues: issues.length,
            totalAlerts: alerts.length,
            pendingCount: tickets.filter(t => t.status === 'Pending').length,
            pending: getBreakdown(t => t.status === 'Pending'),
            processingCount: tickets.filter(t => t.status === 'Processing' || t.status === 'Assigned' || t.status === 'In Progress').length,
            processing: getBreakdown(t => t.status === 'Processing' || t.status === 'Assigned' || t.status === 'In Progress'),
            resolvedCount: tickets.filter(t => t.status === 'Resolved' || t.status === 'Closed').length,
            resolved: getBreakdown(t => t.status === 'Resolved' || t.status === 'Closed')
        };
    }, [tickets]);

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
            <StatCard
                title="Total Tickets"
                value={stats.total}
                icon={<MessageSquare />}
                color="indigo"
                description="Issues & Alerts"
                onClick={() => onClick && onClick('All')}
                statusBreakdown={[
                    { label: 'Issues', value: stats.totalIssues, color: 'text-orange-500' },
                    { label: 'Alerts', value: stats.totalAlerts, color: 'text-red-500' }
                ]}
            />
            <StatCard
                title="Pending"
                value={stats.pendingCount}
                icon={<Clock />}
                color="amber"
                description="Status Breakdown"
                onClick={() => onClick && onClick('Pending')}
                statusBreakdown={stats.pending}
            />
            <StatCard
                title="Assigned"
                value={stats.processingCount}
                icon={<AlertCircle />}
                color="blue"
                description="Status Breakdown"
                onClick={() => onClick && onClick('Assigned')}
                statusBreakdown={stats.processing}
            />
            <StatCard
                title="Resolved"
                value={stats.resolvedCount}
                icon={<CheckCircle />}
                color="emerald"
                description="Status Breakdown"
                onClick={() => onClick && onClick('Resolved')}
                statusBreakdown={stats.resolved}
            />
        </div>
    );
});

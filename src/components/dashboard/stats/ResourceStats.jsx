import React from 'react';
import { Cpu, Activity, AlertTriangle, AlertCircle } from 'lucide-react';
import { StatCard } from '../StatCard';

export const ResourceStats = React.memo(({ activeResource, currentResStats, handleNavToSupport }) => {
    const stats = currentResStats || { total: 0, new: 0, active: 0, normal: 0, warnings: 0, attention: 0, critical: 0, offline: 0, stats: [] };

    return (
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <StatCard
                title={`Total ${activeResource} Devices`}
                value={stats.total}
                icon={<Cpu />}
                color="blue"
                description="Deployed meters & sensors"
                subValue={`${stats.new} New Installed`}
            />
            <StatCard
                title="Operation Status"
                value={stats.active}
                icon={<Activity />}
                color="emerald"
                description="Currently active units"
                subValue={`${stats.normal} Normal`}
                statusBreakdown={stats.stats}
            />
            <StatCard
                title="Device Health"
                value={stats.warnings}
                icon={<AlertTriangle />}
                color="amber"
                description="Units needing attention"
                subValue={`${stats.attention || 0} Requires Attention`}
                statusBreakdown={[
                    { label: 'Attention', value: stats.attention || 0, color: 'text-amber-500' },
                    { label: 'Critical', value: stats.critical || 0, color: 'text-red-500' }
                ]}
            />
            <StatCard
                title="Communication"
                value={stats.offline}
                icon={<AlertCircle />}
                color="red"
                description="Currently unreachable"
                subValue="Offline Units"
                onClick={handleNavToSupport}
            />
        </div>
    );
});

import React, { useState, useMemo } from 'react';
import { FileText, Activity, Droplet, Zap, Flame, Sun, AlertTriangle, Bell, Plus, LayoutDashboard } from 'lucide-react';
import { StatCard } from '../StatCard';
import DomesticConsumptionModal from '../../modals/DomesticConsumptionModal';
import { useData } from '../../../context/DataContext';

export const DomesticStats = React.memo(({ tickets, toggleModal, handleNavToAlerts, handleNavToIssues, handleNavToBilling, handleNavToSupport }) => {
    const { meters } = useData();
    const [isConsumptionModalOpen, setIsConsumptionModalOpen] = useState(false);
    const [modalDefaultView, setModalDefaultView] = useState('Total');
    const [modalDefaultSource, setModalDefaultSource] = useState('All');

    const userName = sessionStorage.getItem('userName') || 'User';

    // Aggregate consumption based on strictly isolated DataContext meters
    const { totalConsumption, sourceBreakdown, meterCounts } = useMemo(() => {
        let total = 0;
        const breakdown = { WATER: 0, ELECTRIC: 0, GAS: 0, SOLAR: 0 };
        const counts = {
            WATER: { active: 0, inactive: 0 },
            ELECTRIC: { active: 0, inactive: 0 },
            GAS: { active: 0, inactive: 0 },
            SOLAR: { active: 0, inactive: 0 }
        };

        meters.forEach(m => {
            const cons = parseInt(m.consumption) || 0;
            total += cons;
            const src = (m.sourceType || m.meterType || '').toUpperCase();
            if (breakdown[src] !== undefined) {
                breakdown[src] += cons;
                if (m.status === 'Active') {
                    counts[src].active += 1;
                } else {
                    counts[src].inactive += 1;
                }
            }
        });

        return { totalConsumption: total, sourceBreakdown: breakdown, meterCounts: counts };
    }, [meters]);

    const openModal = (view, source) => {
        setModalDefaultView(view);
        setModalDefaultSource(source);
        setIsConsumptionModalOpen(true);
    };

    const domesticAlerts = (tickets || []).filter(t => t.type === 'alert' && (t.username === userName || t.userName === userName));
    const domesticIssues = (tickets || []).filter(t => t.type === 'issue' && (t.username === userName || t.userName === userName));

    return (
        <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                <StatCard
                    title="Total Consumption"
                    value={totalConsumption.toLocaleString()}
                    icon={<Activity className="w-4 h-4" />}
                    color="blue"
                    description="Aggregate usage across all sources"
                    statusBreakdown={[
                        { label: 'Water', value: `${sourceBreakdown.WATER} L`, color: 'text-cyan-500' },
                        { label: 'Solar', value: `${sourceBreakdown.SOLAR} kWh`, color: 'text-amber-500' },
                        { label: 'Gas', value: `${sourceBreakdown.GAS} m³`, color: 'text-orange-500' },
                        { label: 'Energy', value: `${sourceBreakdown.ELECTRIC} kWh`, color: 'text-green-500' }
                    ]}
                    onClick={() => openModal('Total', 'All')}
                />
                <StatCard
                    title="Water Usage"
                    value={`${sourceBreakdown.WATER} L`}
                    icon={<Droplet className="w-4 h-4" />}
                    color="cyan"
                    description="Monthly water consumption"
                    statusBreakdown={[
                        { label: 'Active Meters', value: meterCounts.WATER.active, color: 'text-green-500' },
                        { label: 'Inactive Meters', value: meterCounts.WATER.inactive, color: 'text-red-500' }
                    ]}
                    onClick={() => openModal('Specific', 'Water')}
                />
                <StatCard
                    title="Solar Generation"
                    value={`${sourceBreakdown.SOLAR} kWh`}
                    icon={<Sun className="w-4 h-4" />}
                    color="amber"
                    description="Monthly solar generation"
                    statusBreakdown={[
                        { label: 'Active Inverters', value: meterCounts.SOLAR.active, color: 'text-green-500' },
                        { label: 'Inactive Inverters', value: meterCounts.SOLAR.inactive, color: 'text-red-500' }
                    ]}
                    onClick={() => openModal('Specific', 'Solar')}
                />
                <StatCard
                    title="Gas Consumption"
                    value={`${sourceBreakdown.GAS} m³`}
                    icon={<Flame className="w-4 h-4" />}
                    color="orange"
                    description="Monthly gas usage"
                    statusBreakdown={[
                        { label: 'Active Meters', value: meterCounts.GAS.active, color: 'text-green-500' },
                        { label: 'Inactive Meters', value: meterCounts.GAS.inactive, color: 'text-red-500' }
                    ]}
                    onClick={() => openModal('Specific', 'Gas')}
                />
                <StatCard
                    title="Energy Consumption"
                    value={`${sourceBreakdown.ELECTRIC} kWh`}
                    icon={<Zap className="w-4 h-4" />}
                    color="green"
                    description="Monthly energy usage"
                    statusBreakdown={[
                        { label: 'Active Meters', value: meterCounts.ELECTRIC.active, color: 'text-green-500' },
                        { label: 'Inactive Meters', value: meterCounts.ELECTRIC.inactive, color: 'text-red-500' }
                    ]}
                    onClick={() => openModal('Specific', 'Electric')}
                />
                <StatCard
                    title="Raise Ticket"
                    value="Support"
                    icon={<Plus className="w-4 h-4" />}
                    color="indigo"
                    description="Submit a detailed report"
                    statusBreakdown={[
                        { label: 'Avg. Response', value: '< 2 hrs', color: 'text-indigo-600' }
                    ]}
                    onClick={() => handleNavToSupport()}
                />
                <StatCard
                    title="Issues"
                    value={domesticIssues.length}
                    icon={<AlertTriangle className="w-4 h-4" />}
                    color="orange"
                    description="Total Issues"
                    statusBreakdown={[
                        { label: 'Pending', value: domesticIssues.filter(i => i.status === 'Pending').length, color: 'text-amber-500' },
                        { label: 'Processing', value: domesticIssues.filter(i => i.status === 'Processing').length, color: 'text-blue-500' },
                        { label: 'Resolved', value: domesticIssues.filter(i => i.status === 'Resolved').length, color: 'text-emerald-500' }
                    ]}
                    onClick={() => handleNavToIssues()}
                />
                <StatCard
                    title="Alerts"
                    value={domesticAlerts.length}
                    icon={<Bell className="w-4 h-4" />}
                    color="red"
                    description="Total Alerts"
                    statusBreakdown={[
                        { label: 'Pending', value: domesticAlerts.filter(a => a.status === 'Pending').length, color: 'text-amber-500' },
                        { label: 'Processing', value: domesticAlerts.filter(a => a.status === 'Processing').length, color: 'text-blue-500' },
                        { label: 'Resolved', value: domesticAlerts.filter(a => a.status === 'Resolved').length, color: 'text-emerald-500' }
                    ]}
                    onClick={() => handleNavToAlerts()}
                />
            </div>

            {isConsumptionModalOpen && (
                <DomesticConsumptionModal
                    onClose={() => setIsConsumptionModalOpen(false)}
                    defaultView={modalDefaultView}
                    defaultSource={modalDefaultSource}
                />
            )}
        </>
    );
});

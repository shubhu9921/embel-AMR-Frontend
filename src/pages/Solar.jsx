import React, { useState, useEffect } from 'react';
import { Sun, IndianRupee, Gauge, Zap, List, Thermometer, Battery, Activity, BarChart3, CloudSun, Leaf, ArrowUpRight } from 'lucide-react';
import ResourceDashboard from './ResourceDashboard';
import OverallReportModal from '../components/modals/OverallReportModal';
import { formatCurrency } from '../utils/formatters';
import { apiService } from '../services/apiService';
import { solarDataDay, solarDataWeek, solarDataMonth, solarDataYear } from '../data/mockData';


// Dynamic breakdown handles this now

const commonParameters = [
    { label: 'Irradiance', value: '850 W/m²', icon: Sun },
    { label: 'Panel Temp', value: '45°C', icon: Thermometer },
    { label: 'Grid Freq', value: '50.1 Hz', icon: Activity },
    { label: 'Efficiency', value: '98.5%', icon: Gauge },
    { label: 'Total Energy', value: '45.2 MWh', icon: Zap },
    { label: 'CO2 Saved', value: '12.5 T', icon: Leaf },
    { label: 'Active Strings', value: '4/4', icon: List },
    { label: 'Inverter Sts', value: 'Online', icon: Activity },
    { label: 'Battery Lvl', value: '100%', icon: Battery },
    { label: 'Weather', value: 'Sunny', icon: CloudSun },
    { label: 'Performance', value: '92%', icon: BarChart3 },
    { label: 'Export', value: '12 kWh', icon: ArrowUpRight },
];

const alerts = [
    { id: 1, type: 'success', title: 'Peak Generation', message: 'System reached 125kW peak.', timestamp: '1h ago' },
    { id: 2, type: 'info', title: 'Cleaning Due', message: 'Panel efficiency -2% from dust.', timestamp: '2d ago' },
    { id: 3, type: 'warning', title: 'Grid Sync', message: 'Minor fluctuations detected.', timestamp: '5h ago' },
];

const allSolarInverters = [
    { deviceId: 'INV-001', deviceName: 'Main Inverter', location: 'Plant Room', status: 'active', dailyConsumption: '450 kWh', currentFlow: '125' },
    { deviceId: 'INV-002', deviceName: 'String Inv A', location: 'Roof East', status: 'active', dailyConsumption: '180 kWh', currentFlow: '45' },
    { deviceId: 'INV-003', deviceName: 'String Inv B', location: 'Roof West', status: 'active', dailyConsumption: '120 kWh', currentFlow: '32' },
    { deviceId: 'INV-004', deviceName: 'Backup Unit', location: 'Basement', status: 'active', dailyConsumption: '15 kWh', currentFlow: '5' },
];

import { useData } from '../context/DataContext';

export default function SolarPage({ setActivePage }) {
    const { devices, meters, users, isLoading } = useData();
    const [showReportModal, setShowReportModal] = useState(false);

    const userRole = sessionStorage.getItem('userRole');
    const isAdmin = userRole === 'Admin' || userRole === 'Super Admin' || userRole === 'Support Engineer';

    const solarInverters = React.useMemo(() => {
        const combined = [...devices, ...meters];
        return combined.filter(d => d.meterType?.toLowerCase() === 'solar');
    }, [devices, meters]);

    const getAggregationByRole = (resourceMeters) => {
        const aggregation = {
            Industrial: { total: 0, count: 0 },
            Domestic: { total: 0, count: 0 },
            Others: { total: 0, count: 0 }
        };

        resourceMeters.forEach(m => {
            const app = m.application?.toLowerCase();
            const role = app === 'industrial' ? 'Industrial' : (app === 'domestic' ? 'Domestic' : 'Others');
            const readingValue = parseFloat(m.reading || m.currentFlow || 0);
            aggregation[role].total += isNaN(readingValue) ? 0 : readingValue;
            aggregation[role].count += 1;
        });

        return [
            { label: 'Industrial', value: aggregation.Industrial.total.toFixed(0) + ' kWh', color: 'text-emerald-500' },
            { label: 'Domestic', value: aggregation.Domestic.total.toFixed(0) + ' kWh', color: 'text-green-500' },
            { label: 'Others', value: aggregation.Others.total.toFixed(0) + ' kWh', color: 'text-slate-400' }
        ];
    };

    const roleBreakdown = getAggregationByRole(solarInverters);

    const breakdownColors = ['#10b981', '#34d399', '#6ee7b7', '#a7f3d0', '#059669', '#34d399'];
    const dynamicBreakdownData = solarInverters.map((m, idx) => {
        const val = parseFloat(m.reading || m.currentFlow || 0);
        return {
            name: m.deviceName || m.deviceId,
            value: isNaN(val) ? 0 : val,
            color: breakdownColors[idx % breakdownColors.length]
        };
    }).filter(d => d.value > 0);

    const totalGeneration = solarInverters.reduce((acc, m) => {
        const val = parseFloat(m.reading || m.currentFlow || 0);
        return acc + (isNaN(val) ? 0 : val);
    }, 0);

    const chartData = {
        day: solarDataDay,
        week: solarDataWeek,
        month: solarDataMonth,
        year: solarDataYear
    };

    const activeSolar = solarInverters.filter(m => m.status === 'Active').length;
    const inactiveSolar = solarInverters.length - activeSolar;

    const kpiData = [
        {
            title: "Total Generation",
            value: `${totalGeneration.toLocaleString()} kWh`,
            icon: <Sun />,
            color: "emerald",
            description: "Monthly cumulative energy",
            type: "consumption",
            statusBreakdown: isAdmin ? roleBreakdown : null
        },
        {
            title: "Cost Savings",
            value: formatCurrency(totalGeneration * 12.25),
            icon: <IndianRupee />,
            color: "green",
            description: "Projected billing cycle savings",
            type: "cost",
            statusBreakdown: isAdmin ? roleBreakdown.map(r => ({ ...r, value: formatCurrency(parseFloat(r.value) * 12.25) })) : null
        },
        {
            title: "Current PWR",
            value: `${(totalGeneration / 720).toFixed(1)} kW`,
            icon: <Zap />,
            color: "blue",
            description: "Real-time output",
            statusBreakdown: isAdmin ? roleBreakdown.map(r => ({ ...r, value: (parseFloat(r.value) / 720).toFixed(1) + ' kW' })) : null
        },
        {
            title: "Device Count",
            value: `${solarInverters.length} Inverters`,
            icon: <Gauge />,
            color: "orange",
            description: "Assigned devices",
            type: "asset_count",
            statusBreakdown: [
                { label: 'Active', value: activeSolar, color: 'text-green-500' },
                { label: 'Inactive', value: inactiveSolar, color: 'text-red-500' }
            ]
        },
    ];

    const enrichedAlerts = alerts.map(alert => {
        const device = solarInverters.find(m => m.deviceId === alert.device) || solarInverters[0];
        return {
            ...alert,
            user: device?.user || device?.customerName || 'Renewable Staff',
            source: 'Solar'
        };
    });

    return (
        <>
            <ResourceDashboard
                title="Solar Dashboard"
                icon={<Sun size={24} />}
                colorTheme="emerald"
                kpiData={kpiData}
                chartData={chartData}
                breakdownData={dynamicBreakdownData.length > 0 ? dynamicBreakdownData : [{ name: 'No Data', value: 1, color: '#e2e8f0' }]}
                alerts={enrichedAlerts}
                meters={solarInverters}
                systemParams={commonParameters}
                meterModalTitle="Inverters List"
                flowUnit="kW"
                chartTitle="Generation Analytics"
                meterSectionTitle="Inverters"
                withGreeting={true}
                greetingTitle="Solar Usage"
                greetingSubtitle="Real-time monitoring and analytics"
                onDownloadReport={() => setShowReportModal(true)}
                onPayBill={() => setActivePage && setActivePage('Billing')}
                isAdmin={isAdmin}
                users={users}
                resourceType="Solar"
            />

            {showReportModal && (
                <OverallReportModal
                    defaultSource="Solar"
                    onClose={() => setShowReportModal(false)}
                />
            )}
        </>
    );
}

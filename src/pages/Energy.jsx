import React, { useState, useEffect } from 'react';
import { Zap, IndianRupee, Gauge, Activity, RotateCw, Factory, Waves, Plug, Battery } from 'lucide-react';
import ResourceDashboard from './ResourceDashboard';
import OverallReportModal from '../components/modals/OverallReportModal';
import { formatCurrency } from '../utils/formatters';
import { apiService } from '../services/apiService';
import { energyDataDay, energyDataWeek, energyDataMonth, energyDataYear } from '../data/mockData';




// Dynamic breakdown handles this now

const commonParameters = [
  { label: 'Voltage (L1)', value: '230.5 V', icon: Zap },
  { label: 'Current', value: '45.2 A', icon: Activity },
  { label: 'Frequency', value: '50.0 Hz', icon: Waves },
  { label: 'Power Factor', value: '0.98', icon: Gauge },
  { label: 'Active Power', value: '125 kW', icon: Zap },
  { label: 'Reactive Pwr', value: '12 kVAR', icon: Activity },
  { label: 'Apparent Pwr', value: '128 kVA', icon: Zap },
  { label: 'Phase Angle', value: '120°', icon: RotateCw },
  { label: 'Load Factor', value: '85%', icon: Factory },
  { label: 'THD', value: '2.5%', icon: Activity },
  { label: 'Battery', value: '100%', icon: Battery },
  { label: 'Grid Status', value: 'Stable', icon: Plug },
];

const alerts = [
  { id: 1, type: 'critical', title: 'Voltage Spike', message: 'L1 Voltage exceeded 250V.', timestamp: '30m ago' },
  { id: 2, type: 'warning', title: 'High Load', message: 'Machinery load at 95% capacity.', timestamp: '2h ago' },
  { id: 3, type: 'info', title: 'Power Factor', message: 'PF improved to 0.99.', timestamp: '5h ago' },
];



import { useData } from '../context/DataContext';

export default function EnergyPage({ setActivePage }) {
  const { devices, meters, users, isLoading } = useData();
  const [showReportModal, setShowReportModal] = useState(false);

  const userRole = sessionStorage.getItem('userRole');
  const isAdmin = userRole === 'Admin' || userRole === 'Super Admin' || userRole === 'Support Engineer';

  const energyMeters = React.useMemo(() => {
    const combined = [...devices, ...meters];
    return combined.filter(d => d.meterType?.toLowerCase() === 'energy');
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
      { label: 'Industrial', value: aggregation.Industrial.total.toFixed(0) + ' kWh', color: 'text-amber-500' },
      { label: 'Domestic', value: aggregation.Domestic.total.toFixed(0) + ' kWh', color: 'text-orange-500' },
      { label: 'Others', value: aggregation.Others.total.toFixed(0) + ' kWh', color: 'text-slate-400' }
    ];
  };

  const roleBreakdown = getAggregationByRole(energyMeters);
  const totalConsumption = energyMeters.reduce((acc, m) => {
    const val = parseFloat(m.reading || m.currentFlow || 0);
    return acc + (isNaN(val) ? 0 : val);
  }, 0);

  const breakdownColors = ['#f59e0b', '#fbbf24', '#fcd34d', '#fde68a', '#d97706', '#b45309'];
  const dynamicBreakdownData = energyMeters.map((m, idx) => {
    const val = parseFloat(m.reading || m.currentFlow || 0);
    return {
      name: m.deviceName || m.deviceId,
      value: isNaN(val) ? 0 : val,
      color: breakdownColors[idx % breakdownColors.length]
    };
  }).filter(d => d.value > 0);

  const scaleData = (mockArray, total) => {
    const mockTotal = mockArray.reduce((acc, curr) => acc + curr.usage, 0) || 1;
    const factor = total / mockTotal;
    return mockArray.map(d => ({ ...d, usage: parseFloat((d.usage * factor).toFixed(1)) }));
  };

  const chartData = {
    day: scaleData(energyDataDay, totalConsumption / 30),
    week: scaleData(energyDataWeek, totalConsumption / 4),
    month: scaleData(energyDataMonth, totalConsumption),
    year: scaleData(energyDataYear, totalConsumption * 12)
  };

  const activeEnergy = energyMeters.filter(m => m.status === 'Active').length;
  const inactiveEnergy = energyMeters.length - activeEnergy;

  const kpiData = [
    {
      title: "Total Consumption",
      value: `${totalConsumption.toLocaleString(undefined, { maximumFractionDigits: 1 })} kWh`,
      icon: <Zap className="w-4 h-4" />,
      color: "amber",
      description: "Monthly cumulative energy",
      type: "consumption",
      statusBreakdown: isAdmin ? roleBreakdown : null
    },
    {
      title: "Est. Cost",
      value: formatCurrency(totalConsumption * 9.25),
      icon: <IndianRupee className="w-4 h-4" />,
      color: "green",
      description: "Projected billing cycle cost",
      type: "cost",
      statusBreakdown: isAdmin ? roleBreakdown.map(r => ({ ...r, value: formatCurrency(parseFloat(r.value.split(' ')[0]) * 9.25) })) : null
    },
    {
      title: "Avg Load",
      value: `${(totalConsumption / 720).toFixed(1)} kW`,
      icon: <Activity className="w-4 h-4" />,
      color: "blue",
      description: "Daily average load",
      statusBreakdown: isAdmin ? roleBreakdown.map(r => ({ ...r, value: (parseFloat(r.value.split(' ')[0]) / 720).toFixed(1) + ' kW' })) : null
    },
    {
      title: "Device Count",
      value: `${energyMeters.length} Meters`,
      icon: <Gauge className="w-4 h-4" />,
      color: "orange",
      description: "Assigned devices",
      type: "asset_count",
      statusBreakdown: [
        { label: 'Active', value: activeEnergy, color: 'text-green-500' },
        { label: 'Inactive', value: inactiveEnergy, color: 'text-red-500' }
      ]
    },
  ];

  const enrichedAlerts = alerts.map(alert => {
    const device = energyMeters.find(m => m.deviceId === alert.device) || energyMeters[0];
    return {
      ...alert,
      user: device?.user || device?.customerName || 'Grid Supervisor',
      source: 'Energy'
    };
  });

  return (
    <>
      <ResourceDashboard
        title="Energy Dashboard"
        icon={<Zap size={24} />}
        colorTheme="amber"
        kpiData={kpiData}
        chartData={chartData}
        breakdownData={dynamicBreakdownData.length > 0 ? dynamicBreakdownData : [{ name: 'No Data', value: 1, color: '#e2e8f0' }]}
        alerts={enrichedAlerts}
        meters={energyMeters}
        systemParams={commonParameters}
        meterModalTitle="Energy Meters List"
        flowUnit="kW"
        withGreeting={true}
        greetingTitle="Energy Usage"
        greetingSubtitle="Real-time monitoring and analytics"
        onDownloadReport={() => setShowReportModal(true)}
        onPayBill={() => setActivePage && setActivePage('Billing')}
        isAdmin={isAdmin}
        users={users}
        resourceType="Energy"
      />

      {showReportModal && (
        <OverallReportModal
          defaultSource="Energy"
          onClose={() => setShowReportModal(false)}
        />
      )}
    </>
  );
}

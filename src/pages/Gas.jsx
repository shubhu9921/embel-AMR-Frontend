import React, { useState, useEffect } from 'react';
import { Flame, IndianRupee, Gauge, Wind, Thermometer, Activity, Filter, Settings, ShieldCheck, Battery, TestTube } from 'lucide-react';
import ResourceDashboard from './ResourceDashboard';
import OverallReportModal from '../components/modals/OverallReportModal';
import { formatCurrency } from '../utils/formatters';
import { apiService } from '../services/apiService';

/* -------------------- MOCK DATA -------------------- */
const gasDataWeek = [
  { time: 'Mon', usage: 45 }, { time: 'Tue', usage: 52 }, { time: 'Wed', usage: 38 },
  { time: 'Thu', usage: 65 }, { time: 'Fri', usage: 48 }, { time: 'Sat', usage: 55 }, { time: 'Sun', usage: 38 },
];
const gasDataDay = [
  { time: '00:00', usage: 2 }, { time: '04:00', usage: 3 }, { time: '08:00', usage: 15 },
  { time: '12:00', usage: 25 }, { time: '16:00', usage: 18 }, { time: '20:00', usage: 10 },
];
const gasDataMonth = [
  { time: 'Week 1', usage: 200 }, { time: 'Week 2', usage: 250 }, { time: 'Week 3', usage: 180 }, { time: 'Week 4', usage: 300 },
];
const gasDataYear = [
  { time: 'Jan', usage: 1200 }, { time: 'Feb', usage: 1100 }, { time: 'Mar', usage: 900 },
  { time: 'Apr', usage: 800 }, { time: 'May', usage: 500 }, { time: 'Jun', usage: 300 },
  { time: 'Jul', usage: 250 }, { time: 'Aug', usage: 280 }, { time: 'Sep', usage: 350 },
  { time: 'Oct', usage: 600 }, { time: 'Nov', usage: 950 }, { time: 'Dec', usage: 1150 },
];

// Dynamic breakdown handles this now

const commonParameters = [
  { label: 'Gas Pressure', value: '2.8 bar', icon: Gauge },
  { label: 'System Temp', value: '22°C', icon: Thermometer },
  { label: 'Flow Velocity', value: '15 m/s', icon: Wind },
  { label: 'Calorific Val', value: '38.5 MJ', icon: Flame },
  { label: 'Supply Line', value: 'Active', icon: Activity },
  { label: 'Valve Pos', value: '100%', icon: Settings },
  { label: 'Methane %', value: '92%', icon: TestTube },
  { label: 'Odorant Lvl', value: 'Good', icon: Wind },
  { label: 'Filter Sts', value: 'Clean', icon: Filter },
  { label: 'Regulator', value: 'Stable', icon: Activity },
  { label: 'Leak Sensor', value: 'Safe', icon: ShieldCheck },
  { label: 'Battery', value: '98%', icon: Battery },
];

const alerts = [
  { id: 1, type: 'success', title: 'System Normal', message: 'All gas meters are functioning optimally.', timestamp: '1h ago' },
  { id: 2, type: 'info', title: 'Winter Pattern', message: 'Usage +20% due to heating.', timestamp: '3h ago' },
  { id: 3, type: 'warning', title: 'Minor Leak Check', message: 'Scheduled for Zone B tomorrow.', timestamp: '5h ago' },
];

// Redundant mock data removed


import { useData } from '../context/DataContext';

export default function GasPage({ setActivePage }) {
  const { devices, meters, users, isLoading } = useData();
  const [showReportModal, setShowReportModal] = useState(false);

  const userRole = sessionStorage.getItem('userRole');
  const isAdmin = userRole === 'Admin' || userRole === 'Super Admin' || userRole === 'Support Engineer';

  const gasMeters = React.useMemo(() => {
    const combined = [...devices, ...meters];
    return combined.filter(d => d.meterType?.toLowerCase() === 'gas');
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
      { label: 'Industrial', value: aggregation.Industrial.total.toFixed(1) + ' m³', color: 'text-orange-500' },
      { label: 'Domestic', value: aggregation.Domestic.total.toFixed(1) + ' m³', color: 'text-amber-500' },
      { label: 'Others', value: aggregation.Others.total.toFixed(1) + ' m³', color: 'text-slate-400' }
    ];
  };

  const roleBreakdown = getAggregationByRole(gasMeters);
  const totalConsumption = gasMeters.reduce((acc, m) => {
    const val = parseFloat(m.reading || m.currentFlow || 0);
    return acc + (isNaN(val) ? 0 : val);
  }, 0);

  const breakdownColors = ['#f97316', '#fb923c', '#fdba74', '#fed7aa', '#ea580c', '#c2410c'];
  const dynamicBreakdownData = gasMeters.map((m, idx) => {
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
    day: scaleData(gasDataDay, totalConsumption / 30),
    week: scaleData(gasDataWeek, totalConsumption / 4),
    month: scaleData(gasDataMonth, totalConsumption),
    year: scaleData(gasDataYear, totalConsumption * 12)
  };

  const activeGas = gasMeters.filter(m => m.status === 'Active').length;
  const inactiveGas = gasMeters.length - activeGas;

  const kpiData = [
    {
      title: "Total Consumption",
      value: `${totalConsumption.toFixed(1)} m³`,
      icon: <Flame className="w-4 h-4" />,
      trend: 5.4,
      color: "orange",
      description: "Monthly cumulative usage",
      statusBreakdown: isAdmin ? roleBreakdown : null
    },
    {
      title: "Est. Cost",
      value: formatCurrency(totalConsumption * 32.50),
      icon: <IndianRupee className="w-4 h-4" />,
      trend: 2.1,
      color: "blue",
      description: "Projected billing cycle cost",
      statusBreakdown: isAdmin ? roleBreakdown.map(r => ({ ...r, value: formatCurrency(parseFloat(r.value.split(' ')[0]) * 32.50) })) : null
    },
    {
      title: "Avg Daily",
      value: `${(totalConsumption / 30).toFixed(1)} m³`,
      icon: <Activity className="w-4 h-4" />,
      color: "emerald",
      description: "Daily average consumption",
      statusBreakdown: isAdmin ? roleBreakdown.map(r => ({ ...r, value: (parseFloat(r.value.split(' ')[0]) / 30).toFixed(1) + ' m³' })) : null
    },
    {
      title: "Device Count",
      value: gasMeters.length.toString(),
      icon: <Gauge className="w-4 h-4" />,
      color: "red",
      description: "Assigned devices",
      statusBreakdown: [
        { label: 'Active', value: activeGas, color: 'text-green-500' },
        { label: 'Inactive', value: inactiveGas, color: 'text-red-500' }
      ]
    },
  ];

  const enrichedAlerts = alerts.map(alert => {
    const device = gasMeters.find(m => m.deviceId === alert.device) || gasMeters[0];
    return {
      ...alert,
      user: device?.user || device?.customerName || 'Ops Manager',
      source: 'Gas'
    };
  });

  return (
    <>
      <ResourceDashboard
        title="Gas Dashboard"
        icon={<Flame size={24} />}
        colorTheme="orange"
        kpiData={kpiData}
        chartData={chartData}
        breakdownData={dynamicBreakdownData.length > 0 ? dynamicBreakdownData : [{ name: 'No Data', value: 1, color: '#e2e8f0' }]}
        alerts={enrichedAlerts}
        meters={gasMeters}
        systemParams={commonParameters}
        meterModalTitle="Gas Meters List"
        flowUnit="m³/h"
        withGreeting={true}
        greetingTitle="Gas Usage"
        greetingSubtitle="Real-time monitoring and analytics"
        onDownloadReport={() => setShowReportModal(true)}
        onPayBill={() => setActivePage && setActivePage('Billing')}
        isAdmin={isAdmin}
        users={users}
        resourceType="Gas"
      />

      {showReportModal && (
        <OverallReportModal
          defaultSource="Gas"
          onClose={() => setShowReportModal(false)}
        />
      )}
    </>
  );
}

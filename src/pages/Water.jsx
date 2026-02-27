import React, { useState, useEffect } from 'react';
import { IndianRupee, Gauge, Droplets, Thermometer, Waves, TestTube, FlaskConical, Diamond, Zap, Activity, ShieldCheck, Battery, Signal } from 'lucide-react';
import ResourceDashboard from './ResourceDashboard';
import OverallReportModal from '../components/modals/OverallReportModal';
import { formatCurrency } from '../utils/formatters';
import { apiService } from '../services/apiService';

/* -------------------- MOCK DATA -------------------- */
const waterDataWeek = [
  { time: 'Mon', usage: 245 }, { time: 'Tue', usage: 288 }, { time: 'Wed', usage: 210 },
  { time: 'Thu', usage: 260 }, { time: 'Fri', usage: 230 }, { time: 'Sat', usage: 190 }, { time: 'Sun', usage: 160 },
];
const waterDataDay = [
  { time: '00:00', usage: 10 }, { time: '06:00', usage: 40 }, { time: '12:00', usage: 80 }, { time: '18:00', usage: 60 },
];
const waterDataMonth = [
  { time: 'Week 1', usage: 1200 }, { time: 'Week 2', usage: 1350 }, { time: 'Week 3', usage: 1100 }, { time: 'Week 4', usage: 1400 },
];
const waterDataYear = [
  { time: 'Jan', usage: 4500 }, { time: 'Feb', usage: 4200 }, { time: 'Mar', usage: 4800 },
  { time: 'Apr', usage: 5000 }, { time: 'May', usage: 5200 }, { time: 'Jun', usage: 5800 },
  { time: 'Jul', usage: 6000 }, { time: 'Aug', usage: 5900 }, { time: 'Sep', usage: 5500 },
  { time: 'Oct', usage: 5300 }, { time: 'Nov', usage: 4900 }, { time: 'Dec', usage: 4800 },
];

// Dynamic breakdown handles this now

const commonParameters = [
  { label: 'Pressure', value: '3.2 bar', icon: Gauge },
  { label: 'Temperature', value: '18°C', icon: Thermometer },
  { label: 'Flow Rate', value: '12.5 L/m', icon: Waves },
  { label: 'pH Level', value: '7.2', icon: TestTube },
  { label: 'Turbidity', value: '0.5 NTU', icon: FlaskConical },
  { label: 'Chlorine', value: '0.8 mg/L', icon: Diamond },
  { label: 'Hardness', value: '120 mg/L', icon: Droplets },
  { label: 'Conductivity', value: '450 µS', icon: Zap },
  { label: 'Pump Status', value: 'Active', icon: Activity },
  { label: 'Leak Check', value: 'Pass', icon: ShieldCheck },
  { label: 'Battery', value: '100%', icon: Battery },
  { label: 'Signal', value: '-60 dBm', icon: Signal },
];

const alerts = [
  { id: 1, message: 'Pump Failure detected', type: 'critical', timestamp: '2h ago' },
  { id: 2, message: 'High Pressure Warning', type: 'warning', timestamp: '4h ago' },
];

// Redundant mock data removed


import { useData } from '../context/DataContext';

export default function WaterPage({ setActivePage }) {
  const { devices, meters, users, isLoading } = useData();
  const [showReportModal, setShowReportModal] = useState(false);

  const userRole = sessionStorage.getItem('userRole');
  const isAdmin = userRole === 'Admin' || userRole === 'Super Admin' || userRole === 'Support Engineer';

  const waterMeters = React.useMemo(() => {
    const combined = [...devices, ...meters];
    return combined.filter(d => d.meterType?.toLowerCase() === 'water');
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
      { label: 'Industrial', value: aggregation.Industrial.total.toFixed(0) + ' L', color: 'text-cyan-500' },
      { label: 'Domestic', value: aggregation.Domestic.total.toFixed(0) + ' L', color: 'text-blue-500' },
      { label: 'Others', value: aggregation.Others.total.toFixed(0) + ' L', color: 'text-slate-400' }
    ];
  };

  const roleBreakdown = getAggregationByRole(waterMeters);
  const totalUsage = waterMeters.reduce((acc, m) => {
    const val = parseFloat(m.reading || m.currentFlow || 0);
    return acc + (isNaN(val) ? 0 : val);
  }, 0);

  const breakdownColors = ['#06b6d4', '#22d3ee', '#67e8f9', '#a5f3fc', '#0891b2', '#164e63'];
  const dynamicBreakdownData = waterMeters.map((m, idx) => {
    const val = parseFloat(m.reading || m.currentFlow || 0);
    return {
      name: m.deviceName || m.deviceId,
      value: isNaN(val) ? 0 : val,
      color: breakdownColors[idx % breakdownColors.length]
    };
  }).filter(d => d.value > 0);

  // Scale mock data to match actual total usage for realistic graphs
  const scaleData = (mockArray, total) => {
    const mockTotal = mockArray.reduce((acc, curr) => acc + curr.usage, 0) || 1;
    const factor = total / mockTotal;
    return mockArray.map(d => ({ ...d, usage: parseFloat((d.usage * factor).toFixed(1)) }));
  };

  const chartData = {
    day: scaleData(waterDataDay, totalUsage / 30),
    week: scaleData(waterDataWeek, totalUsage / 4),
    month: scaleData(waterDataMonth, totalUsage),
    year: scaleData(waterDataYear, totalUsage * 12)
  };

  const activeWater = waterMeters.filter(m => m.status === 'Active').length;
  const inactiveWater = waterMeters.length - activeWater;

  const kpiData = [
    {
      title: "Total Usage",
      value: `${totalUsage.toFixed(0)} L`,
      icon: <Droplets className="w-4 h-4" />,
      trend: 5.4,
      color: "cyan",
      description: "Monthly cumulative usage",
      statusBreakdown: isAdmin ? roleBreakdown : null
    },
    {
      title: "Est. Cost",
      value: formatCurrency(totalUsage * 0.75),
      icon: <IndianRupee className="w-4 h-4" />,
      trend: 2.1,
      color: "blue",
      description: "Projected billing cycle cost",
      statusBreakdown: isAdmin ? roleBreakdown.map(r => ({ ...r, value: formatCurrency(parseFloat(r.value) * 0.75) })) : null
    },
    {
      title: "Avg Daily",
      value: `${(totalUsage / 30).toFixed(0)} L`,
      icon: <Activity className="w-4 h-4" />,
      color: "emerald",
      description: "Daily average consumption",
      statusBreakdown: isAdmin ? roleBreakdown.map(r => ({ ...r, value: (parseFloat(r.value) / 30).toFixed(0) + ' L' })) : null
    },
    {
      title: "Device Count",
      value: waterMeters.length.toString(),
      icon: <Gauge className="w-4 h-4" />,
      color: "orange",
      description: "Assigned devices",
      statusBreakdown: [
        { label: 'Active', value: activeWater, color: 'text-green-500' },
        { label: 'Inactive', value: inactiveWater, color: 'text-red-500' }
      ]
    },
  ];

  // Enrich alerts with user info
  const enrichedAlerts = alerts.map(alert => {
    const device = waterMeters.find(m => m.deviceId === alert.device) || waterMeters[0];
    return {
      ...alert,
      user: device?.user || device?.customerName || 'Admin System',
      source: 'Water'
    };
  });

  return (
    <>
      <ResourceDashboard
        title="Water Dashboard"
        icon={<Droplets size={24} />}
        colorTheme="cyan"
        kpiData={kpiData}
        chartData={chartData}
        breakdownData={dynamicBreakdownData.length > 0 ? dynamicBreakdownData : [{ name: 'No Data', value: 1, color: '#e2e8f0' }]}
        alerts={enrichedAlerts}
        meters={waterMeters}
        systemParams={commonParameters}
        meterModalTitle="Water Meters List"
        flowUnit="L"
        withGreeting={true}
        greetingTitle="Water Usage"
        greetingSubtitle="Real-time monitoring and analytics"
        onDownloadReport={() => setShowReportModal(true)}
        onPayBill={() => setActivePage && setActivePage('Billing')}
        isAdmin={isAdmin}
        users={users}
        resourceType="Water"
      />

      {showReportModal && (
        <OverallReportModal
          defaultSource="Water"
          onClose={() => setShowReportModal(false)}
        />
      )}
    </>
  );
}

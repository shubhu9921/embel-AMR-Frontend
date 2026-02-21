import React from 'react';
import { Flame, IndianRupee, Gauge, Wind, Thermometer, Activity, Filter, Settings, ShieldCheck, Battery, TestTube } from 'lucide-react';
import ResourceDashboard from './ResourceDashboard';

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

const breakdownData = [
  { name: 'Kitchen', value: 45, color: '#f97316' },
  { name: 'Heating', value: 30, color: '#fb923c' },
  { name: 'Boiler', value: 15, color: '#fdba74' },
  { name: 'Other', value: 10, color: '#fed7aa' },
];

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

const allGasMeters = [
  { deviceId: 'GAS-001', deviceName: 'Main Meter', location: 'Basement', status: 'active', dailyConsumption: '45 m³', currentFlow: '2.1' },
  { deviceId: 'GAS-002', deviceName: 'Kitchen Meter', location: 'Kitchen', status: 'active', dailyConsumption: '12 m³', currentFlow: '0.5' },
  { deviceId: 'GAS-003', deviceName: 'Boiler Room', location: 'Boiler', status: 'active', dailyConsumption: '22 m³', currentFlow: '1.2' },
  { deviceId: 'GAS-004', deviceName: 'Backup Line', location: 'Exterior', status: 'warning', dailyConsumption: '0 m³', currentFlow: '0.0' },
  { deviceId: 'GAS-005', deviceName: 'Annex A', location: 'Wing A', status: 'active', dailyConsumption: '15 m³', currentFlow: '0.8' },
  { deviceId: 'GAS-006', deviceName: 'Annex B', location: 'Wing B', status: 'inactive', dailyConsumption: '0 m³', currentFlow: '0.0' },
  { deviceId: 'GAS-007', deviceName: 'Lab 1', location: 'Wing C', status: 'active', dailyConsumption: '8 m³', currentFlow: '0.4' },
  { deviceId: 'GAS-008', deviceName: 'Lab 2', location: 'Wing C', status: 'active', dailyConsumption: '9 m³', currentFlow: '0.4' },
];

export default function GasPage({ setActivePage }) {
  const chartData = {
    day: gasDataDay,
    week: gasDataWeek,
    month: gasDataMonth,
    year: gasDataYear
  };

  const kpiData = [
    { title: "Total Consumption", value: "450 m³", icon: <Flame className="w-4 h-4" />, trend: 5.4, color: "orange", description: "Monthly cumulative usage" },
    { title: "Est. Cost", value: "₹ 2,450", icon: <IndianRupee className="w-4 h-4" />, trend: 2.1, color: "blue", description: "Projected billing cycle cost" },
    { title: "Avg Daily", value: "15 m³", icon: <Activity className="w-4 h-4" />, color: "emerald", description: "Daily average consumption" },
    { title: "Peak Demand", value: "2.5 m³/h", icon: <Gauge className="w-4 h-4" />, subValue: "18:45", color: "red", description: "Highest recorded flow rate" },
    { title: "Pressure", value: "Normal", icon: <Wind className="w-4 h-4" />, subValue: "2.1 psi", color: "purple", description: "System pressure status" },
  ];

  return (
    <ResourceDashboard
      title="Gas Dashboard"
      icon={<Flame size={24} />}
      colorTheme="orange"
      kpiData={kpiData}
      chartData={chartData}
      breakdownData={breakdownData}
      alerts={alerts}
      meters={allGasMeters}
      systemParams={commonParameters}
      meterModalTitle="Gas Meters List"
      flowUnit="m³/h"
      withGreeting={true}
      greetingTitle="Gas Usage"
      greetingSubtitle="Real-time monitoring and analytics"
      onDownloadReport={() => alert("Report download started...")}
      onPayBill={() => setActivePage && setActivePage('Billing')}
    />
  );
}

import React from 'react';
import { Zap, IndianRupee, Gauge, Activity, RotateCw, Factory, Waves, Plug, Battery } from 'lucide-react';
import ResourceDashboard from './ResourceDashboard';

/* -------------------- MOCK DATA -------------------- */
const energyDataWeek = [
  { time: 'Mon', usage: 145 }, { time: 'Tue', usage: 152 }, { time: 'Wed', usage: 138 },
  { time: 'Thu', usage: 165 }, { time: 'Fri', usage: 148 }, { time: 'Sat', usage: 125 }, { time: 'Sun', usage: 110 },
];
const energyDataDay = [
  { time: '00:00', usage: 5 }, { time: '04:00', usage: 8 }, { time: '08:00', usage: 25 },
  { time: '12:00', usage: 45 }, { time: '16:00', usage: 35 }, { time: '20:00', usage: 20 },
];
const energyDataMonth = [
  { time: 'Week 1', usage: 900 }, { time: 'Week 2', usage: 1100 }, { time: 'Week 3', usage: 950 }, { time: 'Week 4', usage: 1200 },
];
const energyDataYear = [
  { time: 'Jan', usage: 3800 }, { time: 'Feb', usage: 3600 }, { time: 'Mar', usage: 4000 },
  { time: 'Apr', usage: 4200 }, { time: 'May', usage: 4500 }, { time: 'Jun', usage: 5000 },
  { time: 'Jul', usage: 5200 }, { time: 'Aug', usage: 5100 }, { time: 'Sep', usage: 4800 },
  { time: 'Oct', usage: 4600 }, { time: 'Nov', usage: 4200 }, { time: 'Dec', usage: 4100 },
];

const breakdownData = [
  { name: 'HVAC', value: 45, color: '#f59e0b' },
  { name: 'Lighting', value: 20, color: '#fbbf24' },
  { name: 'Machinery', value: 25, color: '#fcd34d' },
  { name: 'Other', value: 10, color: '#fde68a' },
];

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

const allEnergyMeters = [
  { deviceId: 'EM-001', deviceName: 'Main Panel', location: 'Control Room', status: 'active', dailyConsumption: '450 kWh', currentFlow: '125' },
  { deviceId: 'EM-002', deviceName: 'HVAC Unit', location: 'Roof', status: 'active', dailyConsumption: '180 kWh', currentFlow: '45' },
  { deviceId: 'EM-003', deviceName: 'Server Room', location: 'IT Wing', status: 'active', dailyConsumption: '120 kWh', currentFlow: '32' },
  { deviceId: 'EM-004', deviceName: 'Lighting A', location: 'Floor 1', status: 'active', dailyConsumption: '45 kWh', currentFlow: '12' },
  { deviceId: 'EM-005', deviceName: 'Workshop', location: 'Basement', status: 'warning', dailyConsumption: '85 kWh', currentFlow: '28' },
];

export default function EnergyPage({ setActivePage }) {
  const chartData = {
    day: energyDataDay,
    week: energyDataWeek,
    month: energyDataMonth,
    year: energyDataYear
  };

  const kpiData = [
    { title: "Total Consumption", value: "4,150 kWh", icon: <Zap className="w-4 h-4" />, trend: 5.4, color: "amber", description: "Monthly cumulative energy" },
    { title: "Est. Cost", value: "₹ 38,250", icon: <IndianRupee className="w-4 h-4" />, trend: 2.1, color: "green", description: "Projected billing cycle cost" },
    { title: "Avg Load", value: "45.2 kW", icon: <Activity className="w-4 h-4" />, color: "blue", description: "Daily average load" },
    { title: "Peak Demand", value: "185 kW", icon: <Gauge className="w-4 h-4" />, subValue: "11:30", color: "red", description: "Highest recorded demand" },
    { title: "Power Factor", value: "0.98", icon: <RotateCw className="w-4 h-4" />, subValue: "Good", color: "purple", description: "Efficiency indicator" },
  ];

  return (
    <ResourceDashboard
      title="Energy Dashboard"
      icon={<Zap size={24} />}
      colorTheme="amber"
      kpiData={kpiData}
      chartData={chartData}
      breakdownData={breakdownData}
      alerts={alerts}
      meters={allEnergyMeters}
      systemParams={commonParameters}
      meterModalTitle="Energy Meters List"
      flowUnit="kW"
      withGreeting={true}
      greetingTitle="Hello, Domestic User! 👋"
      greetingSubtitle="Here's your home's energy overview."
      onDownloadReport={() => alert("Report download started...")}
      onPayBill={() => setActivePage && setActivePage('Billing')}
    />
  );
}

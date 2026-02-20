import React from 'react';
import { IndianRupee, Gauge, Droplets, Thermometer, Waves, TestTube, FlaskConical, Diamond, Zap, Activity, ShieldCheck, Battery, Signal } from 'lucide-react';
import ResourceDashboard from './ResourceDashboard';

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

const breakdownData = [
  { name: 'Dom', value: 40, color: '#06b6d4' },
  { name: 'HVAC', value: 25, color: '#22d3ee' },
  { name: 'Irrig', value: 20, color: '#67e8f9' },
  { name: 'Proc', value: 15, color: '#a5f3fc' },
];

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

const allWaterMeters = [
  { deviceName: 'Main Supply', deviceId: 'WM-001', location: 'Pump Room', status: 'active', currentFlow: '120.5', flowUnit: 'L/min', dailyConsumption: '450 L' },
  { deviceName: 'Cooling Tower', deviceId: 'WM-002', location: 'Roof', status: 'active', currentFlow: '85.0', flowUnit: 'L/min', dailyConsumption: '320 L' },
  { deviceName: 'Irrigation', deviceId: 'WM-003', location: 'Garden', status: 'inactive', currentFlow: '0.0', flowUnit: 'L/min', dailyConsumption: '0 L' },
  { deviceName: 'Cafeteria', deviceId: 'WM-004', location: 'Floor 1', status: 'active', currentFlow: '25.4', flowUnit: 'L/min', dailyConsumption: '150 L' },
];

export default function WaterPage({ setActivePage }) {
  const chartData = {
    day: waterDataDay,
    week: waterDataWeek,
    month: waterDataMonth,
    year: waterDataYear
  };

  const kpiData = [
    { title: "Total Usage", value: "1850 L", icon: <Droplets className="w-4 h-4" />, trend: 5.4, color: "cyan", description: "Monthly cumulative usage" },
    { title: "Est. Cost", value: "₹ 1,250", icon: <IndianRupee className="w-4 h-4" />, trend: 2.1, color: "blue", description: "Projected billing cycle cost" },
    { title: "Avg Daily", value: "450 L", icon: <Activity className="w-4 h-4" />, color: "emerald", description: "Daily average consumption" },
    { title: "Peak Flow", value: "45 L/m", icon: <Gauge className="w-4 h-4" />, subValue: "08:30", color: "orange", description: "Highest recorded flow rate" },
    { title: "Quality", value: "Good", icon: <ShieldCheck className="w-4 h-4" />, subValue: "pH 7.2", color: "purple", description: "Water quality index" },
  ];

  return (
    <ResourceDashboard
      title="Water Dashboard"
      icon={<Droplets size={24} />}
      colorTheme="cyan"
      kpiData={kpiData}
      chartData={chartData}
      breakdownData={breakdownData}
      alerts={alerts}
      meters={allWaterMeters}
      systemParams={commonParameters}
      meterModalTitle="Water Meters List"
      flowUnit="L"
      withGreeting={true}
      greetingTitle="Hello, Domestic User! 👋"
      greetingSubtitle="Here's your home's water overview."
      onDownloadReport={() => alert("Report download started...")}
      onPayBill={() => setActivePage && setActivePage('Billing')}
    />
  );
}

import React from 'react';
import { Sun, IndianRupee, Gauge, Zap, List, Thermometer, Battery, Activity, BarChart3, CloudSun, Leaf, ArrowUpRight } from 'lucide-react';
import ResourceDashboard from './ResourceDashboard';

/* -------------------- MOCK DATA -------------------- */
const solarDataWeek = [
    { time: 'Mon', generation: 145 }, { time: 'Tue', generation: 162 }, { time: 'Wed', generation: 138 },
    { time: 'Thu', generation: 45 }, { time: 'Fri', generation: 158 }, { time: 'Sat', generation: 175 }, { time: 'Sun', generation: 180 },
];
const solarDataDay = [
    { time: '06:00', generation: 5 }, { time: '09:00', generation: 45 }, { time: '12:00', generation: 125 },
    { time: '15:00', generation: 95 }, { time: '18:00', generation: 25 }, { time: '21:00', generation: 0 },
];
const solarDataMonth = [
    { time: 'Week 1', generation: 900 }, { time: 'Week 2', generation: 1100 }, { time: 'Week 3', generation: 850 }, { time: 'Week 4', generation: 1200 },
];
const solarDataYear = [
    { time: 'Jan', generation: 3800 }, { time: 'Feb', generation: 4200 }, { time: 'Mar', generation: 4800 },
    { time: 'Apr', generation: 5200 }, { time: 'May', generation: 5800 }, { time: 'Jun', generation: 6000 },
    { time: 'Jul', generation: 5900 }, { time: 'Aug', generation: 5500 }, { time: 'Sep', generation: 5100 },
    { time: 'Oct', generation: 4600 }, { time: 'Nov', generation: 4000 }, { time: 'Dec', generation: 3600 },
];

const breakdownData = [
    { name: 'String 1', value: 35, color: '#10b981' },
    { name: 'String 2', value: 30, color: '#34d399' },
    { name: 'String 3', value: 25, color: '#6ee7b7' },
    { name: 'String 4', value: 10, color: '#a7f3d0' },
];

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

export default function SolarPage({ setActivePage }) {
    const chartData = {
        day: solarDataDay,
        week: solarDataWeek,
        month: solarDataMonth,
        year: solarDataYear
    };

    const kpiData = [
        { title: "Total Generation", value: "4,150 kWh", icon: <Sun className="w-4 h-4" />, trend: 5.4, color: "emerald", description: "Monthly cumulative energy" },
        { title: "Cost Savings", value: "₹ 38,250", icon: <IndianRupee className="w-4 h-4" />, trend: 2.1, color: "green", description: "Projected billing cycle savings" },
        { title: "Current PWR", value: "85.2 kW", icon: <Zap className="w-4 h-4" />, color: "blue", description: "Real-time output" },
        { title: "Peak Output", value: "125 kW", icon: <Gauge className="w-4 h-4" />, subValue: "12:30", color: "orange", description: "Highest recorded power" },
        { title: "Grid Export", value: "120 kWh", icon: <ArrowUpRight className="w-4 h-4" />, subValue: "Active", color: "purple", description: "Energy sent to grid" },
    ];


    return (
        <ResourceDashboard
            title="Solar Dashboard"
            icon={<Sun size={24} />}
            colorTheme="emerald"
            kpiData={kpiData}
            chartData={chartData}
            breakdownData={breakdownData}
            alerts={alerts}
            meters={allSolarInverters}
            systemParams={commonParameters}
            meterModalTitle="Inverters List"
            flowUnit="kW"
            chartTitle="Generation Analytics"
            meterSectionTitle="Inverters"
            withGreeting={true}
            greetingTitle="Hello, Domestic User! 👋"
            greetingSubtitle="Here's your home's solar overview."
            onDownloadReport={() => alert("Report download started...")}
            onPayBill={() => setActivePage && setActivePage('Billing')}
        />
    );
}

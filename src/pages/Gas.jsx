import React, { useState } from 'react';
import { Flame, IndianRupee, Gauge, Wind, AlertTriangle, List, Thermometer, Activity, Percent, Filter, Settings, ShieldCheck, Battery, TestTube } from 'lucide-react';
import { StatCard } from './StatCard';
import { TimeFilter } from './TimeFilter';
import { DeviceCard } from './DeviceCard';
import { AlertsPanel } from './AlertsPanel';
import { MetersModal } from '../components/MetersModal';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Label,
  PieChart, Pie, Cell
} from 'recharts';

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

const CustomPieTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const total = breakdownData.reduce((acc, cur) => acc + cur.value, 0);
    const percent = ((data.value / total) * 100).toFixed(1);
    return (
      <div className="bg-white p-3 rounded-lg shadow-xl border border-gray-100 text-xs z-50">
        <p className="font-bold mb-1" style={{ color: data.color }}>{data.name}</p>
        <div className="flex justify-between gap-4 text-gray-600">
          <span>Count:</span>
          <span className="font-mono font-medium">{data.value}</span>
        </div>
        <div className="flex justify-between gap-4 text-gray-600">
          <span>Share:</span>
          <span className="font-mono font-medium">{percent}%</span>
        </div>
      </div>
    );
  }
  return null;
};

const gasDataYear = [
  { time: 'Jan', usage: 1200 }, { time: 'Feb', usage: 1100 }, { time: 'Mar', usage: 900 },
  { time: 'Apr', usage: 800 }, { time: 'May', usage: 500 }, { time: 'Jun', usage: 300 },
  { time: 'Jul', usage: 250 }, { time: 'Aug', usage: 280 }, { time: 'Sep', usage: 350 },
  { time: 'Oct', usage: 600 }, { time: 'Nov', usage: 950 }, { time: 'Dec', usage: 1150 },
];

export default function GasPage() {
  const [timeRange, setTimeRange] = useState('week');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getData = () => {
    switch (timeRange) {
      case 'day': return gasDataDay;
      case 'week': return gasDataWeek;
      case 'month': return gasDataMonth;
      case 'year': return gasDataYear;
      default: return gasDataWeek;
    }
  };
  const currentData = getData();

  const totalBreakdown = breakdownData.reduce((acc, cur) => acc + cur.value, 0);

  return (
    <div className="w-full h-full flex flex-col overflow-y-auto bg-gray-100">
      <MetersModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Gas Meters List"
        meters={allGasMeters}
        colorClass="text-orange-600"
      />

      {/* Header */}
      <div className="sticky top-0 z-20 group bg-white/90 backdrop-blur-xl border border-gray-200 px-6 py-4 rounded-2xl shadow-sm transition-all duration-300 hover:shadow-md hover:bg-orange-50/90 mx-4 mt-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 text-white shadow-lg transition-transform duration-300 group-hover:scale-105">
              <Flame size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                Gas Dashboard
              </h1>
              <p className="text-sm font-medium text-gray-500">
                Real-time usage & status
              </p>
            </div>
          </div>
          <div className="h-1.5 w-24 rounded-full bg-gradient-to-r from-orange-400 to-red-500 opacity-20" />
        </div>
      </div>

      <div className="flex-1 p-5 flex flex-col gap-5">

        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 shrink-0">
          <StatCard title="Total Usage" value="387 m³" icon={<Flame className="w-4 h-4" />} trend={8.2} color="orange" compact />
          <StatCard title="Est. Cost" value="₹ 15,240" icon={<IndianRupee className="w-4 h-4" />} trend={-2.4} color="green" compact />
          <StatCard title="Daily Avg" value="55.3 m³" icon={<Wind className="w-4 h-4" />} trend={6.1} color="blue" compact />
          <StatCard title="Peak Flow" value="8.2 m³/h" icon={<Gauge className="w-4 h-4" />} subValue="18:15" color="purple" compact />
          <StatCard title="Alerts" value={alerts.length} icon={<AlertTriangle className="w-4 h-4" />} subValue="Active" color="red" compact />
        </div>

        {/* Row 1: Charts & Alerts */}
        <div className="grid grid-cols-12 gap-5 h-auto lg:h-[500px] shrink-0">
          <div className="col-span-12 lg:col-span-9 bg-white rounded-xl p-5 border border-gray-100 shadow-md flex flex-col h-auto lg:h-full">
            <div className="flex items-center justify-between mb-4 shrink-0">
              <h3 className="text-base font-bold text-gray-800">Consumption Overview</h3>
              <TimeFilter selected={timeRange} onChange={setTimeRange} compact />
            </div>
            <div className="flex-1 min-h-0 flex flex-col lg:flex-row gap-6">
              <div className="w-full h-[300px] lg:flex-[2] lg:h-full min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={currentData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} dy={10}>
                      <Label
                        content={({ viewBox }) => (
                          <text x={viewBox.x + viewBox.width / 2} y={viewBox.y + viewBox.height} fill="#94a3b8" fontSize="11px" fontWeight={500} textAnchor="middle">
                            <tspan dy="1em">Time</tspan>
                          </text>
                        )}
                      />
                    </XAxis>
                    <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false}>
                      <Label value="Consumption (m³)" angle={-90} position="insideLeft" style={{ fill: '#94a3b8', fontSize: '11px', fontWeight: 500 }} />
                    </YAxis>
                    <Tooltip cursor={{ fill: '#fff7ed' }} contentStyle={{ borderRadius: '8px', fontSize: '11px', padding: '8px 12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Bar dataKey="usage" fill="#f97316" radius={[4, 4, 0, 0]} barSize={28} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="w-full flex flex-col relative bg-orange-50/30 rounded-xl p-4 border border-orange-100/50 min-h-[300px] lg:min-h-0 lg:flex-1 min-w-0">
                <h4 className="absolute top-4 left-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Breakdown</h4>

                {/* Centered Total Overlay */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 pt-4">
                  <div className="text-center">
                    <span className="text-2xl font-bold text-gray-800">{totalBreakdown}</span>
                    <p className="text-[10px] text-gray-500 uppercase font-semibold">Total</p>
                  </div>
                </div>

                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={breakdownData} innerRadius={55} outerRadius={75} paddingAngle={3} dataKey="value" stroke="none">
                      {breakdownData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomPieTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {breakdownData.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-[10px] text-gray-600">
                      <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                      <span className="truncate font-medium">{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-12 lg:col-span-3 bg-white rounded-xl border border-gray-100 shadow-md overflow-hidden flex flex-col h-full min-h-[300px]">
            <AlertsPanel alerts={alerts} compact />
          </div>
        </div>

        {/* Row 2: Devices (Auto Height - No Internal Scroll) */}
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-md flex flex-col shrink-0 h-auto">
          <div className="flex items-center justify-between mb-4 shrink-0">
            <h3 className="text-base font-bold text-gray-800">Meters</h3>
            <div className="flex items-center gap-3">
              <button onClick={() => setIsModalOpen(true)} className="text-xs bg-gray-50 hover:bg-gray-100 px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 font-medium flex items-center gap-1.5 transition-colors shadow-sm shadow-orange-100 hover:shadow-orange-200">
                <List size={14} /> View All
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {allGasMeters.map((meter, idx) => (
              <DeviceCard key={idx} {...meter} flowUnit="m³/h" compact color="orange" />
            ))}
          </div>
        </div>

        {/* Row 3: System Params */}
        <div className="shrink-0 bg-white rounded-xl p-5 text-gray-900 shadow-md border border-gray-100 flex flex-col gap-6">
          <div className="flex items-center gap-3 text-orange-600 font-bold shrink-0 border-b border-gray-100 pb-4 w-full">
            <div className="p-2 bg-orange-50 rounded-lg text-orange-600">
              <Gauge size={20} />
            </div>
            <span className="text-sm uppercase tracking-wide">System Status</span>
          </div>
          <div className="flex-1 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 w-full">
            {commonParameters.map((p, i) => (
              <div key={i} className="flex flex-col bg-gradient-to-br from-white to-orange-100/60 p-3 rounded-xl border border-gray-200 shadow-md hover:shadow-lg hover:-translate-y-1 hover:border-orange-300 transition-all duration-300 cursor-pointer group">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider group-hover:text-orange-600 transition-colors">{p.label}</span>
                  <p.icon className="w-4 h-4 text-gray-400 group-hover:text-orange-500 transition-colors" />
                </div>
                <span className="text-sm font-mono font-extrabold text-gray-900">{p.value}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

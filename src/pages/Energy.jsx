import React, { useState } from 'react';
import { Zap, IndianRupee, Calendar, Gauge, AlertTriangle, List, Activity, Triangle, Waves } from 'lucide-react';
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
const energyDataWeek = [
  { time: 'Mon', usage: 145 }, { time: 'Tue', usage: 132 }, { time: 'Wed', usage: 158 },
  { time: 'Thu', usage: 142 }, { time: 'Fri', usage: 120 }, { time: 'Sat', usage: 105 }, { time: 'Sun', usage: 95 },
];
const energyDataDay = [
  { time: '00:00', usage: 5 }, { time: '04:00', usage: 8 }, { time: '08:00', usage: 25 },
  { time: '12:00', usage: 45 }, { time: '16:00', usage: 35 }, { time: '20:00', usage: 20 },
];
const energyDataMonth = [
  { time: 'Week 1', usage: 800 }, { time: 'Week 2', usage: 950 }, { time: 'Week 3', usage: 850 }, { time: 'Week 4', usage: 1100 },
];

const breakdownData = [
  { name: 'Light', value: 30, color: '#10b981' },
  { name: 'HVAC', value: 40, color: '#34d399' },
  { name: 'Equip', value: 20, color: '#6ee7b7' },
  { name: 'Other', value: 10, color: '#a7f3d0' },
];

const commonParameters = [
  { label: 'Voltage L1', value: '230.5 V', icon: Zap },
  { label: 'Voltage L2', value: '231.2 V', icon: Zap },
  { label: 'Voltage L3', value: '229.8 V', icon: Zap },
  { label: 'Current L1', value: '45.2 A', icon: Activity },
  { label: 'Current L2', value: '44.8 A', icon: Activity },
  { label: 'Current L3', value: '46.1 A', icon: Activity },
  { label: 'Power Factor', value: '0.98', icon: Gauge },
  { label: 'Frequency', value: '50.0 Hz', icon: Waves },
  { label: 'Active Power', value: '32.5 kW', icon: Zap },
  { label: 'Apparent', value: '33.1 kVA', icon: Zap },
  { label: 'Reactive', value: '6.2 kVAR', icon: Zap },
  { label: 'THD', value: '2.5%', icon: Triangle },
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

// ... inside Layout ...

const energyDataYear = [
  { time: 'Jan', usage: 3200 }, { time: 'Feb', usage: 2800 }, { time: 'Mar', usage: 3500 },
  { time: 'Apr', usage: 3100 }, { time: 'May', usage: 4200 }, { time: 'Jun', usage: 4800 },
  { time: 'Jul', usage: 5100 }, { time: 'Aug', usage: 4900 }, { time: 'Sep', usage: 4300 },
  { time: 'Oct', usage: 3800 }, { time: 'Nov', usage: 3400 }, { time: 'Dec', usage: 3600 },
];

// ... inside component ...
export default function Energy() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [timeRange, setTimeRange] = useState('week'); // Default lowercase

  // Determine current chart data
  const getData = () => {
    switch (timeRange) {
      case 'day': return energyDataDay;
      case 'week': return energyDataWeek;
      case 'month': return energyDataMonth;
      case 'year': return energyDataYear;
      default: return energyDataWeek;
    }
  };
  const currentData = getData();

  const totalBreakdown = breakdownData.reduce((acc, cur) => acc + cur.value, 0);

  // Mock data
  const estimatedCost = 4520;

  const alerts = [
    { id: 1, message: 'Voltage Surge Detected (L1)', type: 'critical', timestamp: '10m ago' },
    { id: 2, message: 'Power Factor < 0.9', type: 'warning', timestamp: '1h ago' },
    { id: 3, message: 'Harmonic Distortion > 5%', type: 'warning', timestamp: '3h ago' },
  ];

  const allEnergyMeters = [
    { deviceName: 'Main Incomer', deviceId: 'EM-001', location: 'Substation', status: 'active', currentFlow: '450.5', dailyConsumption: '1200 kWh' },
    { deviceName: 'Production Line A', deviceId: 'EM-002', location: 'Shop Floor', status: 'active', currentFlow: '125.0', dailyConsumption: '850 kWh' },
    { deviceName: 'HVAC System', deviceId: 'EM-003', location: 'Roof', status: 'warning', currentFlow: '85.2', dailyConsumption: '420 kWh' },
    { deviceName: 'Admin Block', deviceId: 'EM-004', location: 'Office', status: 'active', currentFlow: '25.4', dailyConsumption: '150 kWh' },
    { deviceName: 'Lighting DB', deviceId: 'EM-005', location: 'Floor 1', status: 'active', currentFlow: '12.1', dailyConsumption: '65 kWh' },
  ];

  return (
    <div className="w-full h-full flex flex-col overflow-y-auto">
      <MetersModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Energy Meters List"
        meters={allEnergyMeters}
        colorClass="text-emerald-600"
      />

      {/* Header */}
      <div className="sticky top-0 z-20 group bg-white/90 backdrop-blur-xl px-6 py-4 rounded-2xl shadow-md transition-all duration-300 hover:shadow-xl hover:bg-emerald-50/90 mx-4 mt-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-lg transition-transform duration-300 group-hover:scale-105">
              <Zap size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                Energy Dashboard
              </h1>
              <p className="text-sm font-medium text-gray-500">
                Real-time usage & status
              </p>
            </div>
          </div>
          <div className="h-1.5 w-24 rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 opacity-20" />
        </div>
      </div>

      <div className="flex-1 p-5 flex flex-col gap-5">

        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 shrink-0">
          <StatCard title="Total Usage" value="12,450 kWh" icon={<Zap className="w-4 h-4" />} trend={5.4} color="purple" description="Monthly cumulative consumption" compact />
          <StatCard title="Est. Cost" value="₹ 1,24,500" icon={<IndianRupee className="w-4 h-4" />} trend={2.1} color="green" description="Projected billing cycle cost" compact />
          <StatCard title="Daily Avg" value="645 kWh" icon={<Calendar className="w-4 h-4" />} trend={-8.3} color="purple" compact />
          <StatCard title="Peak Demand" value="850 kW" icon={<Gauge className="w-4 h-4" />} subValue="11:30" color="orange" description="Highest recorded demand" compact />
          <StatCard title="Alerts" value={alerts.length} icon={<AlertTriangle className="w-4 h-4" />} subValue="Active" color="red" compact />
        </div>

        {/* Row 1: Charts & Alerts */}
        <div className="grid grid-cols-12 gap-5 h-auto lg:h-[500px] shrink-0">
          <div className="col-span-12 lg:col-span-9 bg-white rounded-xl p-5 border border-gray-100 shadow-md flex flex-col h-auto lg:h-full">
            <div className="flex items-center justify-between mb-4 shrink-0">
              <h3 className="text-base font-bold text-gray-800">Consumption Trends</h3>
              <div className="flex items-center gap-3 shadow-sm shadow-orange-100 rounded-lg">
                <TimeFilter selected={timeRange} onChange={setTimeRange} compact />
              </div>
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
                      <Label value="Consumption (kWh)" angle={-90} position="insideLeft" style={{ fill: '#94a3b8', fontSize: '11px', fontWeight: 500 }} />
                    </YAxis>
                    <Tooltip cursor={{ fill: '#ecfdf5' }} contentStyle={{ borderRadius: '8px', fontSize: '11px', padding: '8px 12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Bar dataKey="usage" fill="#10b981" radius={[4, 4, 0, 0]} barSize={28} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="w-full flex flex-col relative bg-emerald-50/30 rounded-xl p-4 border border-emerald-100/50 min-h-[300px] lg:min-h-0 lg:flex-1 min-w-0">
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

        {/* Row 2: Devices (Auto Height) */}
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
            {allEnergyMeters.map((meter, idx) => (
              <DeviceCard key={idx} {...meter} flowUnit="kW" color="emerald" />
            ))}
          </div>
        </div>

        {/* Row 3: System Params */}
        <div className="shrink-0 bg-white rounded-xl p-5 text-gray-900 shadow-md border border-gray-100 flex flex-col gap-6">
          <div className="flex items-center gap-3 text-emerald-600 font-bold shrink-0 border-b border-gray-100 pb-4 w-full">
            <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
              <Gauge size={20} />
            </div>
            <span className="text-sm uppercase tracking-wide">System Status</span>
          </div>
          <div className="flex-1 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 w-full">
            {commonParameters.map((p, i) => (
              <div key={i} className="flex flex-col bg-gradient-to-br from-white to-emerald-100/60 p-3 rounded-xl border border-gray-200 shadow-md hover:shadow-lg hover:-translate-y-1 hover:border-emerald-300 transition-all duration-300 cursor-pointer group">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider group-hover:text-emerald-600 transition-colors">{p.label}</span>
                  <p.icon className="w-4 h-4 text-gray-400 group-hover:text-emerald-600 transition-colors" />
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


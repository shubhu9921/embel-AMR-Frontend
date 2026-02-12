import React, { useState } from 'react';
import { Droplet, IndianRupee, Gauge, Droplets, AlertTriangle, List, Thermometer, Waves, TestTube, FlaskConical, Diamond, Zap, Activity, ShieldCheck, Battery, Signal } from 'lucide-react';
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

const waterDataYear = [
  { time: 'Jan', usage: 4500 }, { time: 'Feb', usage: 4200 }, { time: 'Mar', usage: 4800 },
  { time: 'Apr', usage: 5000 }, { time: 'May', usage: 5200 }, { time: 'Jun', usage: 5800 },
  { time: 'Jul', usage: 6000 }, { time: 'Aug', usage: 5900 }, { time: 'Sep', usage: 5500 },
  { time: 'Oct', usage: 5300 }, { time: 'Nov', usage: 4900 }, { time: 'Dec', usage: 4800 },
];

export default function Water() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [timeRange, setTimeRange] = useState('week'); // Default lowercase

  const getData = () => {
    switch (timeRange) {
      case 'day': return waterDataDay;
      case 'week': return waterDataWeek;
      case 'month': return waterDataMonth;
      case 'year': return waterDataYear;
      default: return waterDataWeek;
    }
  };
  const currentData = getData();

  const totalBreakdown = breakdownData.reduce((acc, cur) => acc + cur.value, 0);

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

  return (
    <div className="w-full h-full flex flex-col overflow-y-auto">
      <MetersModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Water Meters List"
        meters={allWaterMeters}
        colorClass="text-cyan-600"
      />

      {/* Header */}
      <div className="sticky top-0 z-20 group bg-white/90 backdrop-blur-xl px-6 py-4 rounded-2xl shadow-md transition-all duration-300 hover:shadow-xl hover:bg-cyan-50/90 mx-4 mt-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-500 text-white shadow-lg transition-transform duration-300 group-hover:scale-105">
              <Droplet size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                Water Dashboard
              </h1>
              <p className="text-sm font-medium text-gray-500">
                Real-time usage & status
              </p>
            </div>
          </div>
          <div className="h-1.5 w-24 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 opacity-20" />
        </div>
      </div>

      <div className="flex-1 p-5 flex flex-col gap-5">

        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 shrink-0">
          <StatCard title="Total Usage" value="2,027 L" icon={<Droplet className="w-4 h-4" />} trend={-12.5} color="blue" description="Monthly cumulative volume" compact />
          <StatCard title="Est. Cost" value="₹ 2,450" icon={<IndianRupee className="w-4 h-4" />} trend={8.2} color="green" description="Projected billing cycle cost" compact />
          <StatCard title="Daily Avg" value="289 L" icon={<Droplets className="w-4 h-4" />} trend={-5.2} color="purple" description="Based on 30-day average" compact />
          <StatCard title="Peak Flow" value="18 L/m" icon={<Gauge className="w-4 h-4" />} subValue="07:30" color="orange" description="Highest recorded flow rate" compact />
          <StatCard title="Alerts" value={alerts.length} icon={<AlertTriangle className="w-4 h-4" />} subValue="Active" color="red" description="Requires immediate attention" compact />
        </div>

        {/* Row 1: Charts & Alerts */}
        <div className="grid grid-cols-12 gap-5 h-auto lg:h-[500px] shrink-0">
          <div className="col-span-12 lg:col-span-9 bg-white rounded-xl p-5 border border-gray-100 shadow-md flex flex-col h-auto lg:h-full">
            <div className="flex items-center justify-between mb-4 shrink-0">
              <h3 className="text-base font-bold text-gray-800">Consumption Overview</h3>
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
                      <Label value="Consumption (L)" angle={-90} position="insideLeft" style={{ fill: '#94a3b8', fontSize: '11px', fontWeight: 500 }} />
                    </YAxis>
                    <Tooltip cursor={{ fill: '#ecfeff' }} contentStyle={{ borderRadius: '8px', fontSize: '11px', padding: '8px 12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Bar dataKey="usage" fill="#06b6d4" radius={[4, 4, 0, 0]} barSize={28} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="w-full flex flex-col relative bg-cyan-50/30 rounded-xl p-4 border border-cyan-100/50 min-h-[300px] lg:min-h-0 lg:flex-1 min-w-0">
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
            {allWaterMeters.map((meter, idx) => (
              <DeviceCard key={idx} {...meter} flowUnit="L/min" compact color="cyan" />
            ))}
          </div>
        </div>

        {/* Row 3: System Params */}
        <div className="shrink-0 bg-white rounded-xl p-5 text-gray-900 shadow-md border border-gray-100 flex flex-col gap-6">
          <div className="flex items-center gap-3 text-cyan-600 font-bold shrink-0 border-b border-gray-100 pb-4 w-full">
            <div className="p-2 bg-cyan-50 rounded-lg text-cyan-600">
              <Gauge size={20} />
            </div>
            <span className="text-sm uppercase tracking-wide">System Status</span>
          </div>
          <div className="flex-1 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 xl:grid-cols-6 gap-4 w-full">
            {commonParameters.map((p, i) => (
              <div key={i} className="flex flex-col bg-gradient-to-br from-white to-cyan-100/60 p-3 rounded-xl border border-gray-200 shadow-md hover:shadow-lg hover:-translate-y-1 hover:border-cyan-300 transition-all duration-300 cursor-pointer group">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider group-hover:text-cyan-600 transition-colors">{p.label}</span>
                  <p.icon className="w-4 h-4 text-gray-400 group-hover:text-cyan-600 transition-colors" />
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

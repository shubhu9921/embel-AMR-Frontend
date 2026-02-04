import React, { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { Zap, Flame, Droplet, Sun, Gauge, List, Filter, Activity, CheckCircle2, AlertCircle, XCircle, Thermometer } from 'lucide-react';
import { MetersModal } from '../components/MetersModal';
import { DeviceCard } from './DeviceCard';
import { TimeFilter } from './TimeFilter';

// Color system
const COLORS = {
  All: { light: 'bg-indigo-50', text: 'text-indigo-700', bar: '#6366f1', gradient: 'from-indigo-500 to-purple-500' },
  Energy: { light: 'bg-emerald-50', text: 'text-emerald-700', bar: '#10b981', gradient: 'from-emerald-500 to-teal-500' },
  Gas: { light: 'bg-orange-50', text: 'text-orange-700', bar: '#f97316', gradient: 'from-orange-500 to-red-500' },
  Water: { light: 'bg-cyan-50', text: 'text-cyan-700', bar: '#06b6d4', gradient: 'from-cyan-500 to-blue-500' },
  Solar: { light: 'bg-amber-50', text: 'text-amber-700', bar: '#f59e0b', gradient: 'from-amber-400 to-yellow-500' },
};

const mockDataDay = [
  { time: '00:00', Energy: 10, Gas: 5, Water: 8, Solar: 0 },
  { time: '06:00', Energy: 40, Gas: 20, Water: 35, Solar: 15 },
  { time: '12:00', Energy: 85, Gas: 45, Water: 60, Solar: 90 },
  { time: '18:00', Energy: 60, Gas: 50, Water: 55, Solar: 20 },
];

const mockDataWeek = [
  { time: 'Mon', Energy: 400, Gas: 240, Water: 300, Solar: 400 },
  { time: 'Tue', Energy: 300, Gas: 139, Water: 200, Solar: 300 },
  { time: 'Wed', Energy: 200, Gas: 180, Water: 200, Solar: 200 },
  { time: 'Thu', Energy: 278, Gas: 190, Water: 250, Solar: 278 },
  { time: 'Fri', Energy: 189, Gas: 280, Water: 190, Solar: 189 },
  { time: 'Sat', Energy: 239, Gas: 180, Water: 230, Solar: 239 },
  { time: 'Sun', Energy: 349, Gas: 230, Water: 340, Solar: 349 },
];

const mockDataMonth = [
  { time: 'Week 1', Energy: 2100, Gas: 1200, Water: 1500, Solar: 2200 },
  { time: 'Week 2', Energy: 2300, Gas: 1300, Water: 1600, Solar: 2400 },
  { time: 'Week 3', Energy: 2000, Gas: 1100, Water: 1400, Solar: 2100 },
  { time: 'Week 4', Energy: 2500, Gas: 1500, Water: 1700, Solar: 2600 },
];

const mockDataYear = [
  { time: 'Jan', Energy: 8500, Gas: 5000, Water: 6000, Solar: 7000 },
  { time: 'Apr', Energy: 9200, Gas: 5500, Water: 6500, Solar: 8000 },
  { time: 'Jul', Energy: 10500, Gas: 4800, Water: 7500, Solar: 9500 },
  { time: 'Oct', Energy: 9800, Gas: 5800, Water: 6800, Solar: 7800 },
];


const mockDevices = [
  { deviceId: 'D-001', deviceName: 'Main Pump', location: 'Basement', status: 'active', dailyConsumption: '120 kWh', currentFlow: '12.5', type: 'Water' },
  { deviceId: 'D-002', deviceName: 'Solar Inverter', location: 'Roof', status: 'warning', dailyConsumption: '85 kWh', currentFlow: '8.2', type: 'Solar' },
  { deviceId: 'D-003', deviceName: 'Meter A1', location: 'Floor 1', status: 'active', dailyConsumption: '45 kWh', currentFlow: '4.2', type: 'Energy' },
  { deviceId: 'D-004', deviceName: 'Gas Sensor', location: 'Kitchen', status: 'inactive', dailyConsumption: '0 m³', currentFlow: '0.0', type: 'Gas' },
];

const systemParameters = [
  { label: 'Grid Frequency', value: '50.02 Hz', status: 'normal', icon: Activity, color: 'emerald', theme: 'to-emerald-100/60' },
  { label: 'Avg Power Factor', value: '0.96', status: 'normal', icon: Gauge, color: 'emerald', theme: 'to-emerald-100/60' },
  { label: 'Water Pressure', value: '3.4 bar', status: 'normal', icon: Droplet, color: 'cyan', theme: 'to-cyan-100/60' },
  { label: 'Gas Line PSI', value: '2.1 psi', status: 'normal', icon: Flame, color: 'orange', theme: 'to-orange-100/60' },
];

export default function AnalysisPage() {
  const [activeTab, setActiveTab] = useState('All');
  const [timeRange, setTimeRange] = useState('week'); // 'day', 'week', 'month', 'year'
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filter data based on active tab
  const getFilteredData = () => {
    return mockDevices.filter(d => activeTab === 'All' || d.type === activeTab);
  };
  const filteredDevices = getFilteredData();

  const getChartData = () => {
    switch (timeRange) {
      case 'day': return mockDataDay;
      case 'week': return mockDataWeek;
      case 'month': return mockDataMonth;
      case 'year': return mockDataYear;
      default: return mockDataWeek;
    }
  }
  const chartData = getChartData();


  const ThemeIcon = {
    All: Filter,
    Energy: Zap,
    Gas: Flame,
    Water: Droplet,
    Solar: Sun
  }[activeTab];

  return (
    <div className="w-full flex flex-col gap-6 p-4 md:p-6 mb-20">

      <MetersModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`${activeTab} Devices Analysis`}
        meters={mockDevices} // Passing all for demo, typically filtered
        colorClass={`text-${COLORS[activeTab]?.text.split('-')[1]}-600`}
      />

      {/* Header */}
      <div className={`sticky top-0 z-20 group bg-white/90 backdrop-blur-xl border border-gray-200 px-6 py-4 rounded-2xl shadow-sm transition-all duration-300 hover:shadow-md hover:bg-indigo-50/90`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${COLORS[activeTab].gradient} text-white shadow-lg transition-transform duration-300 group-hover:scale-105`}>
              <ThemeIcon size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                Resource Analysis
              </h1>
              <p className="text-sm font-medium text-gray-500">
                Comparative insights & parameters
              </p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex bg-gray-100/80 p-1.5 rounded-xl self-start md:self-auto overflow-x-auto max-w-full">
            {['All', 'Energy', 'Gas', 'Water', 'Solar'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`
                  px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap
                  ${activeTab === tab
                    ? 'bg-white text-gray-900 shadow-sm ring-1 ring-black/5'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'}
                `}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-indigo-100 shadow-sm flex flex-col gap-1 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer group">
          <div className="flex items-center gap-2 text-indigo-600 mb-1">
            <Activity size={16} />
            <span className="text-xs font-bold uppercase tracking-wider">Total Devices</span>
          </div>
          <span className="text-2xl font-extrabold text-indigo-900">124</span>
          <span className="text-xs text-indigo-600 font-medium">+12 new installed</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-emerald-100 shadow-sm flex flex-col gap-1 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer group">
          <div className="flex items-center gap-2 text-emerald-600 mb-1">
            <Activity size={16} />
            <span className="text-xs font-bold uppercase tracking-wider">Active</span>
          </div>
          <span className="text-2xl font-extrabold text-emerald-700">98</span>
          <span className="text-xs text-emerald-600 font-medium">Running normally</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-amber-100 shadow-sm flex flex-col gap-1 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer group">
          <div className="flex items-center gap-2 text-amber-600 mb-1">
            <AlertCircle size={16} />
            <span className="text-xs font-bold uppercase tracking-wider">Warnings</span>
          </div>
          <span className="text-2xl font-extrabold text-amber-700">21</span>
          <span className="text-xs text-amber-600 font-medium">Requires attention</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-rose-100 shadow-sm flex flex-col gap-1 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer group">
          <div className="flex items-center gap-2 text-rose-600 mb-1">
            <XCircle size={16} />
            <span className="text-xs font-bold uppercase tracking-wider">Offline</span>
          </div>
          <span className="text-2xl font-extrabold text-rose-700">5</span>
          <span className="text-xs text-rose-600 font-medium">Check connectivity</span>
        </div>
      </div>

      {/* Charts Section: Bar Chart + Pie Chart Side-by-Side */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Main Graph Section (Bar Chart) - Takes 2/3 width */}
        <div className="xl:col-span-2 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm h-[400px]">
          <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
            <h3 className="text-lg font-bold text-gray-900">Consumption Trends</h3>
            <TimeFilter selected={timeRange} onChange={setTimeRange} />
          </div>

          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }} barSize={32}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} dy={10} />
              <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <Tooltip
                cursor={{ fill: '#f8fafc' }}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                itemStyle={{ fontSize: '12px', fontWeight: 600 }}
              />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />

              {(activeTab === 'All' || activeTab === 'Energy') &&
                <Bar dataKey="Energy" fill={COLORS.Energy.bar} radius={[4, 4, 0, 0]} />}
              {(activeTab === 'All' || activeTab === 'Gas') &&
                <Bar dataKey="Gas" fill={COLORS.Gas.bar} radius={[4, 4, 0, 0]} />}
              {(activeTab === 'All' || activeTab === 'Water') &&
                <Bar dataKey="Water" fill={COLORS.Water.bar} radius={[4, 4, 0, 0]} />}
              {(activeTab === 'All' || activeTab === 'Solar') &&
                <Bar dataKey="Solar" fill={COLORS.Solar.bar} radius={[4, 4, 0, 0]} />}
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Device Status Pie Chart - Takes 1/3 width */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm h-[400px] flex flex-col">
          <h3 className="text-lg font-bold text-gray-900 mb-2">Device Status</h3>
          <div className="flex-1 min-h-0 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: 'Active', value: 98, color: '#10b981' },
                    { name: 'Warnings', value: 21, color: '#f59e0b' },
                    { name: 'Offline', value: 5, color: '#ef4444' },
                  ]}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {[
                    { name: 'Active', value: 98, color: '#10b981' },
                    { name: 'Warnings', value: 21, color: '#f59e0b' },
                    { name: 'Offline', value: 5, color: '#ef4444' },
                  ].map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
            {/* Center Text */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none pb-8">
              <div className="text-center">
                <span className="text-3xl font-bold text-gray-900 block">124</span>
                <span className="text-xs text-gray-500 font-medium uppercase">Total</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: Devices & Parameters */}
      <div className="flex flex-col gap-6">

        {/* Left Col: Devices List */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col h-[400px]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">Analyzed Devices</h3>
            <button onClick={() => setIsModalOpen(true)} className="text-xs bg-gray-50 hover:bg-gray-100 px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 font-medium flex items-center gap-1.5 transition-colors shadow-sm shadow-orange-100 hover:shadow-orange-200">
              <List size={14} /> View All
            </button>
          </div>
          <div className="overflow-y-auto flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3 custom-scrollbar pr-2">
            {filteredDevices.map((device, idx) => (
              <DeviceCard
                key={idx}
                deviceName={device.deviceName}
                deviceId={device.deviceId}
                location={device.location}
                status={device.status}
                currentFlow={device.currentFlow}
                flowUnit={device.type === 'Gas' ? 'm³' : 'units'}
                dailyConsumption={device.dailyConsumption}
                color={
                  device.type === 'Energy' ? 'emerald' :
                    device.type === 'Gas' ? 'orange' :
                      device.type === 'Water' ? 'cyan' :
                        device.type === 'Solar' ? 'amber' : 'white'
                }
              />
            ))}
          </div>
        </div>

        {/* SYSTEM PARAMETERS */}
        <div className="bg-white rounded-xl p-5 text-gray-900 shadow-md border border-gray-100 flex flex-col gap-6">
          <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide border-b border-gray-100 pb-4 flex items-center gap-2">
            <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
              <Gauge size={20} />
            </div>
            Live System Parameters
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {systemParameters.map((param, index) => (
              <div key={index} className={`flex flex-col bg-gradient-to-br from-white ${param.theme} p-3 rounded-xl border border-gray-200 shadow-md hover:shadow-lg hover:-translate-y-1 hover:border-${param.color}-300 transition-all duration-300 cursor-pointer group`}>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] text-gray-500 font-bold uppercase tracking-wider group-hover:text-${param.color}-600 transition-colors`}>{param.label}</span>
                  <param.icon className={`w-4 h-4 text-gray-400 group-hover:text-${param.color}-600 transition-colors`} />
                </div>
                <span className="text-xl font-mono font-extrabold text-gray-900">{param.value}</span>
                <div className="mt-2 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
                  <span className="text-[10px] text-emerald-500 font-medium">Optimal</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}


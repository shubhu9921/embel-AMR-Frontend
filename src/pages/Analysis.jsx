import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Label,
  PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import {
  Zap, Flame, Droplet, Sun, Gauge, List, Filter, Activity,
  CheckCircle2, AlertCircle, XCircle, Thermometer, Cpu,
  Download, TrendingUp, ChevronRight
} from 'lucide-react';
import { MetersModal } from '../components/MetersModal';
import { DeviceCard } from '../components/dashboard/DeviceCard';
import { TimeFilter } from '../components/dashboard/TimeFilter';
import { StatCard } from '../components/dashboard/StatCard';
import { useFetchData } from '../hooks/useFetchData';
import { apiService } from '../services/apiService';
import OverallReportModal from '../components/modals/OverallReportModal';
import ComparisonModal from '../components/modals/ComparisonModal';

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

// Dynamic stats Map handled inside component

export default function AnalysisPage() {
  const [activeTab, setActiveTab] = useState('All');
  const [kpiFilter, setKpiFilter] = useState('All'); // 'All', 'Active', 'Warnings', 'Offline'
  const [timeRange, setTimeRange] = useState('week'); // 'day', 'week', 'month', 'year'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showCompareModal, setShowCompareModal] = useState(false);

  const [devices, setDevices] = useState([]);
  const [loadingDevices, setLoadingDevices] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const role = sessionStorage.getItem('userRole');
        const name = sessionStorage.getItem('userName');
        const isSystemAdmin = role === 'Super Admin' || role === 'Admin';
        const userQuery = isSystemAdmin ? '' : `?user=${encodeURIComponent(name || '')}`;

        const fetchedDevices = await apiService.getDevices(userQuery);

        const mapped = fetchedDevices.map(d => {
          const mType = d.meterType ? d.meterType.charAt(0).toUpperCase() + d.meterType.slice(1).toLowerCase() : 'Unknown';
          const type = ['Water', 'Energy', 'Gas', 'Solar'].includes(mType) ? mType : 'Energy';
          return {
            deviceId: d.deviceId,
            deviceName: d.deviceName || d.meterName || d.deviceId,
            location: d.location || 'Unknown',
            status: d.status || 'active',
            dailyConsumption: d.dailyConsumption || `${d.reading || d.currentFlow || 0} ${type === 'Gas' ? 'm³' : type === 'Water' ? 'L' : 'kWh'}`,
            currentFlow: d.currentFlow || d.reading || '0.0',
            type: type,
            rawConsumption: parseFloat(d.reading || d.currentFlow || 0)
          };
        });
        setDevices(mapped);
      } catch (err) {
        console.error("Failed to load devices", err);
      } finally {
        setLoadingDevices(false);
      }
    };
    loadData();
  }, []);

  const getStatsMap = (devicesList) => {
    const baseObj = () => ({ total: 0, new: 0, active: 0, warnings: 0, offline: 0, consumption: 0 });
    const stats = {
      All: baseObj(),
      Energy: baseObj(),
      Gas: baseObj(),
      Water: baseObj(),
      Solar: baseObj(),
    };

    devicesList.forEach(d => {
      if (!stats[d.type]) return;

      stats.All.total++;
      stats[d.type].total++;

      const status = (d.status || 'active').toLowerCase();
      if (status === 'active') { stats.All.active++; stats[d.type].active++; }
      else if (status === 'warning') { stats.All.warnings++; stats[d.type].warnings++; }
      else { stats.All.offline++; stats[d.type].offline++; }

      stats.All.consumption += d.rawConsumption;
      stats[d.type].consumption += d.rawConsumption;
    });
    return stats;
  };

  const dynamicStatsMap = getStatsMap(devices);

  // Filter data based on active tab and KPI filter
  const getFilteredData = () => {
    return devices.filter(d => {
      const tabMatch = activeTab === 'All' || d.type === activeTab;
      let kpiMatch = true;
      if (kpiFilter !== 'All') {
        const status = (d.status || 'active').toLowerCase();
        if (kpiFilter === 'Active') kpiMatch = status === 'active';
        if (kpiFilter === 'Warnings') kpiMatch = status === 'warning';
        if (kpiFilter === 'Offline') kpiMatch = status === 'offline';
      }
      return tabMatch && kpiMatch;
    });
  };
  const filteredDevices = getFilteredData();

  const { data: fetchedChartData, isLoading } = useFetchData(
    () => apiService.fetchChartData('bar', timeRange),
    [timeRange] // Re-fetch when timeRange changes
  );

  const chartData = fetchedChartData || []; // Fallback to empty array while loading or if data is null
  const ThemeIcon = {
    All: Filter,
    Energy: Zap,
    Gas: Flame,
    Water: Droplet,
    Solar: Sun
  }[activeTab];

  return (
    <main className="w-full min-h-screen p-4 md:p-6 font-sans pt-6 md:pt-8 flex flex-col gap-4">

      <MetersModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`${activeTab} Devices Analysis`}
        meters={filteredDevices}
        hoverClass={{
          All: 'group-hover:text-indigo-600',
          Energy: 'group-hover:text-emerald-600',
          Gas: 'group-hover:text-orange-600',
          Water: 'group-hover:text-cyan-600',
          Solar: 'group-hover:text-amber-600'
        }[activeTab] || 'group-hover:text-gray-600'}
      />

      <div className="p-5 border-b border-gray-100 bg-white/50 backdrop-blur-sm sticky top-0 z-30 rounded-[20px] shadow-sm mb-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${COLORS[activeTab]?.gradient || 'from-gray-100 to-gray-200'} text-white shadow-lg transition-transform duration-300 hover:scale-105`}>
              <ThemeIcon size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Resource Analysis</h1>
              <p className="text-sm font-medium text-gray-500">Real-time monitoring and analytics</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            {/* Buttons Group */}
            <div className="flex gap-2 shrink-0">
              <button
                onClick={() => setShowReportModal(true)}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl text-sm font-bold shadow-sm hover:bg-gray-50 hover:border-gray-300 transition-all active:scale-95"
              >
                <Download className="w-4 h-4" />
                <span>Report</span>
              </button>

              <button
                onClick={() => setShowCompareModal(true)}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-500/20 hover:bg-indigo-700 transition-all active:scale-95"
              >
                <TrendingUp className="w-4 h-4" />
                <span>Compare</span>
              </button>
            </div>

            {/* Tabs Group */}
            <div className="flex bg-gray-100 p-1 rounded-xl w-full sm:w-auto">
              {['All', 'Energy', 'Gas', 'Water', 'Solar'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`
                    flex-1 sm:flex-none px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap
                    ${activeTab === tab
                      ? 'bg-white text-indigo-600 shadow-sm'
                      : 'text-gray-500 hover:text-gray-800 hover:bg-white/50'}
                  `}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {showReportModal && (
        <OverallReportModal
          defaultSource={activeTab === 'All' ? 'Energy' : activeTab}
          onClose={() => setShowReportModal(false)}
        />
      )}

      {showCompareModal && (
        <ComparisonModal
          defaultSource={activeTab === 'All' ? 'Energy' : activeTab}
          onClose={() => setShowCompareModal(false)}
        />
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard
          title="Total Devices"
          value={dynamicStatsMap[activeTab].total}
          icon={<Cpu className="w-4 h-4" />}
          color="indigo"
          description="Deployed meters & sensors"
          subValue={`Assigned to you`}
          onClick={() => setKpiFilter('All')}
          className={`hover:shadow-xl hover:-translate-y-1 hover:bg-slate-50/50 transition-all cursor-pointer ${kpiFilter === 'All' ? 'scale-[1.02] shadow-xl bg-slate-50/50' : ''}`}
        />
        <StatCard
          title="Active"
          value={dynamicStatsMap[activeTab].active}
          icon={<Activity className="w-4 h-4" />}
          color="green"
          description="Running normally"
          subValue="Healthy connection"
          onClick={() => setKpiFilter('Active')}
          className={`hover:shadow-xl hover:-translate-y-1 hover:bg-slate-50/50 transition-all cursor-pointer ${kpiFilter === 'Active' ? 'scale-[1.02] shadow-xl bg-slate-50/50' : ''}`}
        />
        <StatCard
          title="Warnings"
          value={dynamicStatsMap[activeTab].warnings}
          icon={<AlertCircle className="w-4 h-4" />}
          color="amber"
          description="Requires attention"
          subValue="Potential Issues"
          onClick={() => setKpiFilter('Warnings')}
          className={`hover:shadow-xl hover:-translate-y-1 hover:bg-slate-50/50 transition-all cursor-pointer ${kpiFilter === 'Warnings' ? 'scale-[1.02] shadow-xl bg-slate-50/50' : ''}`}
        />
        <StatCard
          title="Offline"
          value={dynamicStatsMap[activeTab].offline}
          icon={<XCircle className="w-4 h-4" />}
          color="red"
          description="Check connectivity"
          subValue="Unreachable units"
          onClick={() => setKpiFilter('Offline')}
          className={`hover:shadow-xl hover:-translate-y-1 hover:bg-slate-50/50 transition-all cursor-pointer ${kpiFilter === 'Offline' ? 'scale-[1.02] shadow-xl bg-slate-50/50' : ''}`}
        />
      </div>

      {/* Charts Section: Bar Chart + Pie Chart Side-by-Side */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Main Graph Section (Bar Chart) - Takes 2/3 width */}
        <div className="xl:col-span-2 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm h-[450px] flex flex-col">
          <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
            <h3 className="text-lg font-bold text-gray-900">Consumption vs Time</h3>
            <TimeFilter selected={timeRange} onChange={setTimeRange} showAll={false} />
          </div>

          <div className="flex-1 min-h-[300px] w-full relative">
            {isLoading && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-xl">
                <div className="w-8 h-8 border-4 border-orange-500/30 border-t-orange-500 rounded-full animate-spin" />
              </div>
            )}
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }} barSize={32}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} dy={10}>
                  <Label
                    content={({ viewBox }) => (
                      <text x={viewBox.x + viewBox.width / 2} y={viewBox.y + viewBox.height} fill="#64748b" fontSize="11px" fontWeight={500} textAnchor="middle">
                        <tspan dy="1em">Time</tspan>
                      </text>
                    )}
                  />
                </XAxis>
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false}>
                  <Label value="Consumption" angle={-90} position="insideLeft" style={{ fill: '#64748b', fontSize: '11px', fontWeight: 500 }} />
                </YAxis>
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
        </div>

        {/* Device Status Pie Chart - Takes 1/3 width */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm h-[450px] flex flex-col">
          <h3 className="text-lg font-bold text-gray-900 mb-2">Device Status</h3>
          <div className="flex-1 min-h-0 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: 'Active', value: dynamicStatsMap.All.active, color: '#10b981' },
                    { name: 'Warnings', value: dynamicStatsMap.All.warnings, color: '#f59e0b' },
                    { name: 'Offline', value: dynamicStatsMap.All.offline, color: '#ef4444' },
                  ]}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {[
                    { name: 'Active', value: dynamicStatsMap.All.active, color: '#10b981' },
                    { name: 'Warnings', value: dynamicStatsMap.All.warnings, color: '#f59e0b' },
                    { name: 'Offline', value: dynamicStatsMap.All.offline, color: '#ef4444' },
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
                <span className="text-3xl font-bold text-gray-900 block">{dynamicStatsMap.All.total}</span>
                <span className="text-xs text-gray-600 font-medium uppercase">Total</span>
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
            {[
              { label: 'Grid Frequency', value: '50.02 Hz', status: 'normal', icon: Activity, color: 'emerald', theme: 'to-emerald-100/60', hoverText: 'group-hover:text-emerald-600', hoverBorder: 'hover:border-emerald-300' },
              { label: 'Avg Power Factor', value: '0.96', status: 'normal', icon: Gauge, color: 'emerald', theme: 'to-emerald-100/60', hoverText: 'group-hover:text-emerald-600', hoverBorder: 'hover:border-emerald-300' },
              { label: 'Water Pressure', value: '3.4 bar', status: 'normal', icon: Droplet, color: 'cyan', theme: 'to-cyan-100/60', hoverText: 'group-hover:text-cyan-600', hoverBorder: 'hover:border-cyan-300' },
              { label: 'Gas Line PSI', value: '2.1 psi', status: 'normal', icon: Flame, color: 'orange', theme: 'to-orange-100/60', hoverText: 'group-hover:text-orange-600', hoverBorder: 'hover:border-orange-300' },
            ].map((param, index) => (
              <div key={index} className={`flex flex-col bg-gradient-to-br from-white ${param.theme} p-3 rounded-xl border border-gray-200 shadow-md hover:shadow-lg hover:-translate-y-1 ${param.hoverBorder} transition-all duration-300 cursor-pointer group`}>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] text-gray-600 font-bold uppercase tracking-wider ${param.hoverText} transition-colors`}>{param.label}</span>
                  <param.icon className={`w-4 h-4 text-gray-400 ${param.hoverText} transition-colors`} />
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

    </main>
  );
}


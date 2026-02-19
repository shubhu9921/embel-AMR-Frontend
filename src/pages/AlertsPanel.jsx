import { useState } from 'react';
import { AlertTriangle, AlertCircle, CheckCircle, Info, Search, Filter, Bell } from 'lucide-react';

const alertConfig = {
  info: {
    icon: Info,
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-500', // Left border accent
    iconColor: 'text-blue-600',
    textColor: 'text-blue-900',
    badgeBg: 'bg-blue-100',
    badgeText: 'text-blue-700',
    label: 'Info'
  },
  warning: {
    icon: AlertTriangle,
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-500',
    iconColor: 'text-amber-600',
    textColor: 'text-amber-900',
    badgeBg: 'bg-amber-100',
    badgeText: 'text-amber-700',
    label: 'Warning'
  },
  critical: {
    icon: AlertCircle,
    bgColor: 'bg-red-50',
    borderColor: 'border-red-500',
    iconColor: 'text-red-600',
    textColor: 'text-red-900',
    badgeBg: 'bg-red-100',
    badgeText: 'text-red-700',
    label: 'Critical'
  },
  success: {
    icon: CheckCircle,
    bgColor: 'bg-green-50',
    borderColor: 'border-green-500',
    iconColor: 'text-green-600',
    textColor: 'text-green-900',
    badgeBg: 'bg-green-100',
    badgeText: 'text-green-700',
    label: 'Success'
  },
};

export function AlertsPanel({ alerts, compact = false }) {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  const filteredAlerts = alerts.filter(a => {
    const type = (a.type === 'error' ? 'critical' : a.type).toLowerCase();
    const matchesSearch = (a.title || "").toLowerCase().includes(search.toLowerCase()) ||
      (a.message || "").toLowerCase().includes(search.toLowerCase());
    const matchesFilter = activeFilter === 'all' || type === activeFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 ${compact ? 'p-3' : 'p-5'} transition-all duration-300 hover:shadow-md h-full overflow-hidden flex flex-col`}>
      <div className={`flex flex-col ${compact ? 'gap-3 mb-3' : 'gap-4 mb-4'}`}>
        <div className="flex justify-between items-center border-b border-gray-50 pb-3">
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-lg ${compact ? 'bg-indigo-50 text-indigo-600' : 'bg-indigo-50 text-indigo-600'} shadow-sm`}>
              <Bell size={compact ? 16 : 18} />
            </div>
            <h3 className={`${compact ? 'text-sm' : 'text-base'} font-bold text-gray-900 tracking-tight`}>Alerts</h3>
          </div>
          {/* Search */}
          <div className="relative group">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1.5 text-gray-500 group-focus-within:text-orange-500 transition-colors" />
            <input
              className="pl-8 pr-3 py-1 text-xs border border-gray-200 rounded-lg bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:bg-white w-28 transition-all shadow-sm shadow-orange-100 hover:shadow-orange-200"
              placeholder="Filter..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-1.5 flex-wrap">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-2.5 py-1 text-[11px] font-semibold rounded-full border transition-all ${activeFilter === 'all'
              ? 'bg-gray-800 text-white border-gray-800 shadow-sm'
              : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50 hover:border-gray-300'
              }`}
          >
            All
          </button>
          {Object.keys(alertConfig).map(key => {
            const hoverClass = {
              info: 'hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200',
              warning: 'hover:bg-amber-50 hover:text-amber-600 hover:border-amber-200',
              critical: 'hover:bg-red-50 hover:text-red-600 hover:border-red-200',
              success: 'hover:bg-green-50 hover:text-green-600 hover:border-green-200',
            }[key];

            return (
              <button
                key={key}
                onClick={() => setActiveFilter(key)}
                className={`px-2.5 py-1 text-[11px] font-semibold rounded-full border transition-all ${activeFilter === key
                  ? `${alertConfig[key].badgeBg} ${alertConfig[key].badgeText} border-transparent ring-1 ring-inset ring-black/5 shadow-sm`
                  : `bg-white text-gray-500 border-gray-200 ${hoverClass}`
                  }`}
              >
                {alertConfig[key].label}
              </button>
            )
          })}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 pr-1 custom-scrollbar">
        {filteredAlerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-gray-500">
            <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-2">
              <CheckCircle className="w-6 h-6 text-gray-400" />
            </div>
            <p className="text-xs font-medium">No alerts found</p>
          </div>
        ) : (
          filteredAlerts.map((alert) => {
            const type = alert.type === 'error' ? 'critical' : (alert.type || 'info');
            const config = alertConfig[type] || alertConfig.info;
            const Icon = config.icon;

            return (
              <div
                key={alert.id}
                className="group relative bg-white border border-gray-100 rounded-xl p-3 shadow-sm hover:shadow-md hover:border-orange-200 hover:bg-orange-50 transition-all duration-300 cursor-default"
              >
                {/* Left Accent Bar */}
                <div className={`absolute left-0 top-3 bottom-3 w-1 ${config.bgColor.replace('bg-', 'bg-').replace('50', '500')} rounded-r-full`}></div>

                <div className="flex gap-3 pl-2.5">
                  {/* Icon Container */}
                  <div className={`shrink-0 w-8 h-8 rounded-lg ${config.bgColor} flex items-center justify-center`}>
                    <Icon className={`w-4 h-4 ${config.iconColor}`} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-0.5">
                      <h4 className="font-bold text-gray-900 text-xs truncate pr-2">
                        {alert.title}
                      </h4>
                      <span className="text-[10px] font-medium text-gray-600 bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100">
                        {alert.timestamp}
                      </span>
                    </div>

                    <p className="text-[11px] text-gray-600 leading-snug line-clamp-2">
                      {alert.message}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

import React from 'react';
import { Activity, MapPin, Zap, Hash } from 'lucide-react';

const statusColors = {
  active: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  inactive: 'bg-gray-100 text-gray-700 border-gray-200',
  warning: 'bg-amber-100 text-amber-700 border-amber-200',
};

const statusDotColors = {
  active: 'bg-emerald-500',
  inactive: 'bg-gray-400',
  warning: 'bg-amber-500',
};

const bgGradients = {
  white: 'bg-white',
  orange: 'bg-gradient-to-br from-white to-orange-100/60 border-orange-100',
  cyan: 'bg-gradient-to-br from-white to-cyan-100/60 border-cyan-100',
  emerald: 'bg-gradient-to-br from-white to-emerald-100/60 border-emerald-100',
  amber: 'bg-gradient-to-br from-white to-amber-100/60 border-amber-100',
  blue: 'bg-gradient-to-br from-white to-blue-100/60 border-blue-100',
  purple: 'bg-gradient-to-br from-white to-purple-100/60 border-purple-100',
};

export function DeviceCard({
  deviceName,
  deviceId,
  location,
  status,
  currentFlow,
  flowUnit,
  dailyConsumption,
  compact = false,
  color = 'white',
  onClick,
}) {
  const isOnline = status === 'active';
  const normStatus = status?.toLowerCase() || 'inactive';

  return (
    <div
      onClick={onClick}
      className={`
        group relative rounded-2xl border
        ${bgGradients[color] || 'bg-white border-gray-100'}
        ${compact ? 'p-3' : 'p-4'} shadow-md
        transition-all duration-300
        hover:shadow-xl hover:-translate-y-1 hover:border-blue-200
        cursor-pointer overflow-hidden
      `}
    >
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-50 to-transparent rounded-bl-3xl -mr-4 -mt-4 opacity-50 group-hover:opacity-100 transition-opacity"></div>
      <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-gray-50 to-transparent rounded-tr-3xl -ml-4 -mb-4 opacity-50 group-hover:opacity-100 transition-opacity"></div>

      {/* Header Section */}
      <div className="relative flex justify-between items-start mb-3">
        <div className="flex items-start gap-3">
          {/* Icon Placeholder */}
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${isOnline ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-500'}`}>
            <Activity size={16} />
          </div>
          <div>
            <h3 className={`${compact ? 'text-xs' : 'text-sm'} font-bold text-gray-900 leading-tight group-hover:text-blue-600 transition-colors`}>
              {deviceName}
            </h3>
            <div className="flex items-center gap-1 mt-0.5 text-[10px] text-gray-400">
              <Hash size={10} />
              <span className="font-mono">{deviceId}</span>
            </div>
          </div>
        </div>

        {/* Status Badge */}
        <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider ${statusColors[normStatus]}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${statusDotColors[normStatus]} ${isOnline ? 'animate-pulse' : ''}`}></span>
          {status}
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="relative grid grid-cols-2 gap-2 mb-3">
        <div className="bg-gray-50/50 rounded-xl p-2.5 border border-gray-100 group-hover:border-blue-50 group-hover:bg-blue-50/10 transition-colors">
          <p className="text-[10px] text-gray-500 font-medium mb-0.5 flex items-center gap-1">
            <Zap size={10} /> Current
          </p>
          <p className="text-sm font-bold text-gray-900">
            {currentFlow} <span className="text-[10px] text-gray-400 font-normal">{flowUnit}</span>
          </p>
        </div>
        <div className="bg-gray-50/50 rounded-xl p-2.5 border border-gray-100 group-hover:border-blue-50 group-hover:bg-blue-50/10 transition-colors">
          <p className="text-[10px] text-gray-500 font-medium mb-0.5">Daily Usage</p>
          <p className="text-sm font-bold text-gray-900">{dailyConsumption}</p>
        </div>
      </div>

      {/* Footer Location */}
      <div className="relative flex items-center gap-1.5 text-[10px] text-gray-400 pt-2 border-t border-gray-50">
        <MapPin size={10} />
        <span className="font-medium text-gray-500 truncate">{location}</span>
      </div>

    </div>
  );
}

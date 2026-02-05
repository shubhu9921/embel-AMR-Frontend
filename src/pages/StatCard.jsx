import React from 'react';
import { TrendingDown, TrendingUp } from 'lucide-react';

const colorClasses = {
  blue: 'bg-gradient-to-br from-white to-blue-100/60 border-blue-200',
  green: 'bg-gradient-to-br from-white to-emerald-100/60 border-emerald-200',
  purple: 'bg-gradient-to-br from-white to-purple-100/60 border-purple-200',
  orange: 'bg-gradient-to-br from-white to-orange-100/60 border-orange-200',
  red: 'bg-gradient-to-br from-white to-red-100/60 border-red-200',
  cyan: 'bg-gradient-to-br from-white to-cyan-100/60 border-cyan-200',
  amber: 'bg-gradient-to-br from-white to-amber-100/60 border-amber-200',
};

export function StatCard({
  title,
  value,
  icon,
  trend,
  trendLabel,
  subValue,
  color,
  compact = false,
}) {
  // Negative trend = positive
  const isPositiveTrend = trend !== undefined && trend < 0;

  return (
    <div className={`rounded-2xl shadow-sm border ${colorClasses[color] || 'bg-white border-gray-100'} ${compact ? 'p-3' : 'p-4'} transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer h-full flex flex-col justify-between relative overflow-hidden group`}>

      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-white/40 to-transparent rounded-bl-3xl -mr-4 -mt-4 opacity-50 group-hover:opacity-100 transition-opacity"></div>
      <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-white/40 to-transparent rounded-tr-3xl -ml-4 -mb-4 opacity-50 group-hover:opacity-100 transition-opacity"></div>

      {/* Background Icon - No Background Color, Just Text Color */}
      <div className={`absolute bottom-2 right-2 opacity-[0.15] group-hover:opacity-[0.8] transition-opacity duration-300 ${color ? `text-${color === 'green' ? 'emerald' : color}-500` : 'text-gray-500'} pointer-events-none`}>
        {icon && React.cloneElement(icon, { size: 40, strokeWidth: 1.5, className: "" })}
      </div>

      <div className="relative z-10 flex items-center justify-between mb-1">
        <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">{title}</p>

        {trend !== undefined && (
          <div
            className={`flex items-center gap-1 text-[10px] font-medium ${isPositiveTrend ? 'text-green-600' : 'text-red-600'
              }`}
          >
            {isPositiveTrend ? <TrendingDown className="w-3 h-3" /> : <TrendingUp className="w-3 h-3" />}
            {Math.abs(trend).toFixed(1)}%
          </div>
        )}
      </div>

      <div className="relative z-10">
        <p className={`${compact ? 'text-xs' : 'text-2xl'} font-medium text-gray-900 leading-tight`}>{value}</p>

        {trendLabel && <p className="text-[10px] text-gray-500 mt-1 font-medium">{trendLabel}</p>}
        {subValue && <p className="text-[10px] text-gray-500 mt-1 font-medium">{subValue}</p>}
      </div>
    </div>
  );
}

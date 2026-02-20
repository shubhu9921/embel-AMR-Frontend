import React from 'react';
import { TrendingDown, TrendingUp } from 'lucide-react';

const colorClasses = {
  blue: 'border-transparent',
  green: 'border-transparent',
  purple: 'border-transparent',
  orange: 'border-transparent',
  red: 'border-transparent',
  cyan: 'border-transparent',
  amber: 'border-transparent',
};

export function StatCard({
  title,
  value,
  icon,
  trend,
  trendLabel,
  subValue,
  color,
  description,
  compact = false,
  onClick,
  statusBreakdown,
  className = "",
}) {
  // Negative trend = positive
  const isPositiveTrend = trend !== undefined && trend < 0;

  return (
    <div onClick={onClick} className={`rounded-2xl shadow-md border ${colorClasses[color] || 'border-transparent'} bg-white ${compact ? 'p-3' : 'p-4'} transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:bg-orange-50/50 cursor-pointer h-full flex flex-col justify-between relative overflow-hidden group ${className}`}>

      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-white/40 to-transparent rounded-bl-3xl -mr-4 -mt-4 opacity-50 group-hover:opacity-100 transition-opacity"></div>
      <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-white/40 to-transparent rounded-tr-3xl -ml-4 -mb-4 opacity-50 group-hover:opacity-100 transition-opacity"></div>

      {/* Background Icon - No Background Color, Just Text Color */}
      <div className={`absolute top-1/2 -translate-y-1/2 right-2 opacity-[0.4] group-hover:opacity-100 transition-opacity duration-300 ${color ? `text-${color === 'green' ? 'emerald' : color}-500` : 'text-gray-500'} pointer-events-none`}>
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
        {description && <p className="text-[11px] text-gray-400 mt-1 font-medium leading-tight">{description}</p>}

        {/* Status Breakdown Footer */}
        {statusBreakdown && (
          <div
            className="mt-3 pt-3 border-t border-gray-100 grid gap-1"
            style={{ gridTemplateColumns: `repeat(${statusBreakdown.length}, minmax(0, 1fr))` }}
          >
            {statusBreakdown.map((item, index) => (
              <div key={index} className="flex flex-col items-center text-center">
                <span className={`text-[10px] font-bold ${item.color}`}>{item.value}</span>
                <span className="text-[9px] text-gray-400 font-medium whitespace-nowrap">{item.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

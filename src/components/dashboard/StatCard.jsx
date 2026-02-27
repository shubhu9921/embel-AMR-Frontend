import React from 'react';



const colorMap = {
  blue: { text: 'text-blue-500', bg: 'bg-blue-50', border: 'border-blue-100', icon: 'text-blue-600' },
  green: { text: 'text-emerald-500', bg: 'bg-emerald-50', border: 'border-emerald-100', icon: 'text-emerald-600' },
  amber: { text: 'text-amber-500', bg: 'bg-amber-50', border: 'border-amber-100', icon: 'text-amber-600' },
  orange: { text: 'text-orange-500', bg: 'bg-orange-50', border: 'border-orange-100', icon: 'text-orange-600' },
  red: { text: 'text-red-500', bg: 'bg-red-50', border: 'border-red-100', icon: 'text-red-600' },
  purple: { text: 'text-purple-500', bg: 'bg-purple-50', border: 'border-purple-100', icon: 'text-purple-600' },
  cyan: { text: 'text-cyan-500', bg: 'bg-cyan-50', border: 'border-cyan-100', icon: 'text-cyan-600' },
  indigo: { text: 'text-indigo-500', bg: 'bg-indigo-50', border: 'border-indigo-100', icon: 'text-indigo-600' },
  yellow: { text: 'text-yellow-500', bg: 'bg-yellow-50', border: 'border-yellow-100', icon: 'text-yellow-600' },
};

export const StatCard = React.memo(function StatCard({
  title,
  value,
  icon,
  subValue,
  color,
  description,
  statusBreakdown,
  onClick,
  className = ""
}) {
  const selectedColor = colorMap[color] || { text: 'text-slate-500', bg: 'bg-slate-50', border: 'border-slate-100', icon: 'text-slate-600' };

  const handleKeyDown = (e) => {
    if (onClick && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <div
      onClick={onClick}
      onKeyDown={handleKeyDown}
      tabIndex={onClick ? 0 : -1}
      role={onClick ? "button" : "article"}
      className={`rounded-2xl shadow-md border border-gray-100 bg-white p-5 min-h-[120px] transition-all duration-300 h-full flex flex-col justify-between relative overflow-hidden group ${className} ${onClick ? 'hover:shadow-xl hover:-translate-y-1 hover:bg-orange-50/50 cursor-pointer active:scale-[0.98]' : ''}`}
    >
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-white/40 to-transparent rounded-bl-3xl -mr-4 -mt-4 opacity-50 group-hover:opacity-100 transition-opacity"></div>
      <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-white/40 to-transparent rounded-tr-3xl -ml-4 -mb-4 opacity-50 group-hover:opacity-100 transition-opacity"></div>

      {/* Background Icon - Using watermarked large icon style */}
      <div className={`absolute top-1/2 -translate-y-1/2 right-2 opacity-20 group-hover:opacity-100 transition-opacity duration-300 ${selectedColor.text} pointer-events-none`}>
        {icon && React.cloneElement(icon, { size: 48, strokeWidth: 1.5 })}
      </div>

      <div className="relative z-10 flex items-center justify-between mb-1">
        <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest leading-none">{title}</p>
      </div>

      <div className="relative z-10">
        <p className="text-2xl font-bold text-gray-900 leading-none tracking-tight">{value}</p>

        {/* Sub-content Area */}
        <div className="flex flex-col gap-1 mt-1.5">
          {subValue && (
            <p className="text-[11px] text-indigo-600 font-bold leading-none">
              {subValue}
            </p>
          )}
          {description && (
            <p className="text-[11px] text-gray-400 font-medium leading-none">
              {description}
            </p>
          )}
        </div>

        {/* Status Breakdown Footer */}
        {statusBreakdown && statusBreakdown.length > 0 && (
          <div
            className="mt-4 pt-4 border-t border-gray-100 grid gap-1"
            style={{ gridTemplateColumns: `repeat(${statusBreakdown.length}, minmax(0px, 1fr))` }}
          >
            {statusBreakdown.map((item, index) => (
              <div key={index} className="flex flex-col items-center text-center">
                <span className={`text-[11px] font-black ${item.color || 'text-gray-700'} leading-none`}>
                  {item.value}
                </span>
                <span className="text-[9px] text-gray-400 font-bold uppercase tracking-tighter mt-1 whitespace-nowrap">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
});

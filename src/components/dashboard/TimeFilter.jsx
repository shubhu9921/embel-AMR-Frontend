export function TimeFilter({ selected, onChange, onEnlarge, compact = false }) {
  const options = [
    { value: 'day', label: '1D' },
    { value: 'week', label: '1W' },
    { value: 'month', label: '1M' },
    { value: 'year', label: '1Y' },
  ];

  return (
    <div className="flex items-center gap-1">
      <div className="inline-flex rounded border border-gray-200 bg-white p-[1px] shadow-sm shadow-orange-100 hover:shadow-md hover:shadow-orange-200 transition-all">
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={`px-2 py-0.5 rounded ${compact ? 'text-[9px]' : 'text-[10px]'} font-bold transition-colors ${selected === option.value
              ? 'bg-white text-orange-600 shadow-sm border border-gray-100 ring-1 ring-orange-500/20'
              : 'text-slate-400 hover:text-orange-600 hover:bg-orange-50'
              }`}
          >
            {option.label}
          </button>
        ))}
      </div>
      {onEnlarge && (
        <button onClick={onEnlarge} className="text-slate-400 hover:text-blue-600 px-1">
          ⤢
        </button>
      )}
    </div>
  );
}

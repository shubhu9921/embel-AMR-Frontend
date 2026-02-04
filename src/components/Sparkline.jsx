export function Sparkline({ data = [], color = "blue" }) {
  const colorMap = {
    blue: "bg-blue-400/80",
    green: "bg-emerald-400/80",
    amber: "bg-amber-400/80",
    red: "bg-red-400/80",
  };

  const max = Math.max(...data, 1);

  return (
    <div className="flex items-end gap-[2px] h-8 overflow-hidden">
      {data.map((v, i) => {
        const height = Math.max((v / max) * 100, 8);

        return (
          <span
            key={i}
            className={`
              w-1 rounded-sm
              ${colorMap[color]}
              animate-bar-grow
            `}
            style={{ height: `${height}%` }}
          />
        );
      })}
    </div>
  );
}

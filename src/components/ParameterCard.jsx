import { Sparkline } from "./Sparkline";
import { parameterMeta } from "./parameterMeta";
import { statusStyles, iconColors } from "./parameterStyles";

function resolveMeta(label) {
  const key = Object.keys(parameterMeta).find(k => label.includes(k));
  return parameterMeta[key] || {};
}

export function ParameterCard({ param }) {
  const meta = resolveMeta(param.label);
  const Icon = meta.icon;
  const status = statusStyles[param.status] || {};
  const iconColor = iconColors[meta.color] || "text-gray-400";

  return (
    <div
      className={`
        relative rounded-xl p-3
        backdrop-blur-md bg-white/60
        border border-white/30
        ring-1 ${status.ring}
        shadow-sm hover:shadow-md
        transition-all duration-300
      `}
    >
      <div className="flex items-center gap-3">
        <div className="relative h-9 w-9 flex items-center justify-center">
          {/* Pulsing ring behind the icon */}
          {param.status === "warning" && (
            <span className="absolute inset-0 rounded-lg animate-pulse-soft shadow-[0_0_0_6px_rgba(234,179,8,0.4)]" />
          )}
          {param.status === "critical" && (
            <span className="absolute inset-0 rounded-lg animate-pulse-strong shadow-[0_0_0_10px_rgba(239,68,68,0.6)]" />
          )}

          {/* Icon container on top */}
          <div className={`${status.bg} h-9 w-9 flex items-center justify-center rounded-lg relative z-10`}>
            {Icon && <Icon className={`h-5 w-5 ${iconColor}`} />}
          </div>
        </div>

        <div className="flex-1">
          <p className="text-xs text-gray-500">{param.label}</p>
          <p className={`text-sm font-semibold ${status.text}`}>
            {param.value}
          </p>
        </div>
      </div>

      {param.trend && (
        <div className="mt-2">
          <Sparkline
            data={param.trend}
            color={
              param.status === "critical"
                ? "red"
                : param.status === "warning"
                ? "amber"
                : "blue"
            }
          />
        </div>
      )}
    </div>
  );
}

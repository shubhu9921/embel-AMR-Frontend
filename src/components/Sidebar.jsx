import {
  LayoutDashboard,
  Droplet,
  Flame,
  Zap,
  Cpu,
  Users,
  Bell,
  Sun,
  Menu,
  Settings,
  LineChart
} from "lucide-react";

const menu = [
  { name: "Dashboard", icon: LayoutDashboard },
  { name: "Gas", icon: Flame },
  { name: "Water", icon: Droplet },
  { name: "Energy", icon: Zap },
  { name: "Solar", icon: Sun },
  { name: "Analysis", icon: LineChart },
  { name: "Alerts", icon: Bell },
  { name: "Settings", icon: Settings }
];

export default function Sidebar({
  collapsed,
  setCollapsed,
  activePage,
  setActivePage
}) {
  return (
    <aside
      className={`
        bg-[#0c2b65] transition-all duration-300 shadow-xl z-50
        ${collapsed ? "w-20" : "w-64"}
        flex flex-col min-h-full
      `}
    >
      {/* Logo */}
      <div className={`h-16 flex items-center shrink-0 transition-all duration-300 overflow-hidden ${collapsed ? 'justify-center px-0' : 'justify-between px-4'}`}>
        {!collapsed && (
          <img
            src="https://www.embel.co.in/images/logos/logo-embel.png"
            alt="Embel Logo"
            className="h-8 object-contain"
          />
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`p-2 rounded-lg hover:bg-white/10 text-slate-300 transition-all ${collapsed ? 'mx-auto' : ''}`}
        >
          <Menu size={20} />
        </button>
      </div>

      {/* Menu */}
      <nav className="flex-1 px-2 py-3 overflow-visible flex flex-col gap-1">
        {menu.map((item) => (
          <button
            key={item.name}
            onClick={() => setActivePage(item.name)}
            title={collapsed ? item.name : ""}
            className={`
              flex items-center gap-3 w-full py-3 transition-all duration-200 group rounded-lg
              ${collapsed ? "justify-center" : "px-3"}
              ${activePage === item.name
                ? "bg-orange-500 text-white font-bold shadow-md shadow-orange-900/20"
                : "text-slate-300 font-medium hover:bg-white/10 hover:text-white"}
            `}
          >
            <item.icon size={20} className={activePage === item.name ? "text-white" : "text-slate-400 group-hover:text-white transition-colors"} />
            {!collapsed && (
              <span className="text-sm">{item.name}</span>
            )}
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-4 py-3 shrink-0 text-center">
        <p className="text-xs text-slate-500/60">
          {collapsed ? "©" : "© 2026 Embel Tech"}
        </p>
      </div>
    </aside>
  );
}

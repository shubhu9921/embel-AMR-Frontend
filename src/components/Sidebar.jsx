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
        bg-white transition-all duration-300 shadow-[4px_0_24px_rgba(0,0,0,0.15)] z-50 border-r border-gray-100
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
          className={`p-2 rounded-lg hover:bg-slate-100 text-slate-600 transition-all ${collapsed ? 'mx-auto' : ''}`}
        >
          <Menu size={20} />
        </button>
      </div>

      {/* Menu */}
      <nav className="flex-1 py-3 overflow-visible flex flex-col gap-1">
        {menu.map((item) => (
          <button
            key={item.name}
            onClick={() => setActivePage(item.name)}
            title={collapsed ? item.name : ""}
            className={`
              flex items-center gap-3 w-full py-3 transition-all duration-200 group
              ${collapsed ? "justify-center rounded-lg mx-2 w-auto" : "pl-3 rounded-r-full rounded-l-none mr-2"}
              ${activePage === item.name
                ? "bg-[#19325c] text-white font-bold border-l-4 border-[#ff6e00]"
                : "text-slate-600 font-medium hover:bg-[#19325c] hover:text-white hover:font-bold border-l-4 border-transparent"}
            `}
          >
            <item.icon size={20} className={activePage === item.name ? "text-[#ff6e00]" : "text-slate-700 group-hover:text-[#ff6e00] transition-colors"} />
            {!collapsed && (
              <span className="text-sm">{item.name}</span>
            )}
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-4 py-3 shrink-0 text-center bg-gray-100">
        <p className="text-xs text-slate-500/60">
          {collapsed ? "©" : "© 2026 Embel Tech"}
        </p>
      </div>
    </aside>
  );
}

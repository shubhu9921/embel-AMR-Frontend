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
  LineChart,
  FileText,
  CreditCard,
  Database,
  LogOut
} from "lucide-react";

const adminMenu = [
  { name: "Dashboard", icon: LayoutDashboard },
  { name: "Water", icon: Droplet },
  { name: "Energy", icon: Zap },
  { name: "Solar", icon: Sun },
  { name: "Devices", icon: Cpu },
  { name: "Users", icon: Users },
  { name: "Reports", icon: FileText },
  { name: "Billing", icon: CreditCard },
  { name: "Payloads", icon: Database },
  { name: "Alerts", icon: Bell },
  { name: "Settings", icon: Settings }
];

const userMenu = [
  { name: "Dashboard", icon: LayoutDashboard },
  { name: "Gas", icon: Flame },
  { name: "Water", icon: Droplet },
  { name: "Energy", icon: Zap },
  { name: "Solar", icon: Sun },
  { name: "Analysis", icon: LineChart },
  { name: "Alerts", icon: Bell },
  { name: "Settings", icon: Settings }
];

const domesticMenu = [
  { name: "Dashboard", icon: LayoutDashboard },
  { name: "My Usage", icon: LineChart },
  { name: "Billing", icon: CreditCard },
  { name: "Alerts", icon: Bell },
  { name: "Settings", icon: Settings }
];

// Menu selection logic moved inside component or uses prop

export default function Sidebar({
  collapsed,
  setCollapsed,
  activePage,
  setActivePage,
  userRole,
  onLogout
}) {
  let menu;
  if (userRole === "Admin" || userRole === "Super Admin") {
    menu = adminMenu;
  } else if (userRole === "Domestic") {
    menu = domesticMenu;
  } else {
    // Default to User/Industrial menu
    menu = userMenu;
  }

  return (
    <aside
      className={`
        bg-white/50 backdrop-blur-md transition-all duration-300 shadow-[4px_0_24px_rgba(0,0,0,0.15)] z-50 border-r border-gray-100
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



      {/* Logout Button */}
      <div className="px-2 py-2 border-t border-gray-100">
        <button
          onClick={onLogout}
          title={collapsed ? "Logout" : ""}
          className={`
            flex items-center gap-3 w-full py-3 transition-all duration-200 group rounded-lg hover:bg-red-50
            ${collapsed ? "justify-center" : "pl-3"}
          `}
        >
          <LogOut size={20} className="text-slate-600 group-hover:text-red-600 transition-colors" />
          {!collapsed && (
            <span className="text-sm font-medium text-slate-600 group-hover:text-red-600">Logout</span>
          )}
        </button>
      </div>

      {/* Footer */}
      <div className="px-4 py-3 shrink-0 text-center bg-gray-100">
        <p className="text-xs text-slate-500/60">
          {collapsed ? "©" : "© 2026 Embel Tech"}
        </p>
      </div>
    </aside >
  );
}

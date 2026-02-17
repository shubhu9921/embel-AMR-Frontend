import { useState, useRef, useEffect } from "react";
import { Search, Bell, Settings, Sun, Droplet, Flame, Zap, X, Check, LogOut, User } from "lucide-react";
import { initialDevicesData, initialUsers, sites, PAGES_DATA, PARAMS_DATA } from "../data/mockData";

export default function Header({ activePage, setActivePage, onLogout, userRole }) {
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);

  // Close dropdowns when clicking outside
  const notifRef = useRef(null);
  const profileRef = useRef(null);
  const searchRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  /* -------------------- SEARCH DATA & LOGIC -------------------- */


  const [allSearchData, setAllSearchData] = useState([]);

  useEffect(() => {
    const pages = PAGES_DATA.map(p => ({ ...p, category: 'Pages' }));

    const devices = initialDevicesData.map(d => ({
      id: `dev-${d.id}`,
      type: 'Device',
      category: 'Devices',
      label: d.name,
      value: d.deviceId, // Searchable sub-text
      status: d.status,
      target: 'Devices'
    }));

    const users = initialUsers.map(u => ({
      id: `usr-${u.id}`,
      type: 'User',
      category: 'Users',
      label: `${u.firstName} ${u.lastName}`,
      value: u.email,
      status: u.status,
      target: 'Users'
    }));

    const locations = sites.map(s => ({
      id: `loc-${s.id}`,
      type: 'Location',
      category: 'Locations',
      label: s.name,
      value: 'Site',
      status: s.status,
      target: 'Dashboard'
    }));

    const params = PARAMS_DATA.map(p => ({ ...p, category: 'Parameters' }));

    setAllSearchData([...pages, ...devices, ...users, ...locations, ...params]);
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.length > 0) {
      const lowerQuery = query.toLowerCase();
      const filtered = allSearchData.filter(item =>
        item.label.toLowerCase().includes(lowerQuery) ||
        (item.value && item.value.toLowerCase().includes(lowerQuery)) ||
        item.type.toLowerCase().includes(lowerQuery)
      );
      setSearchResults(filtered);
      setShowSearchDropdown(filtered.length > 0);
    } else {
      setSearchResults([]);
      setShowSearchDropdown(false);
    }
  };

  const handleResultClick = (result) => {
    setSearchQuery(result.label);
    setShowSearchDropdown(false);

    if (result.target) {
      setActivePage(result.target);
    }
  };

  // ... (notifications logic)
  const adminNotifications = [
    { id: 1, type: 'critical', title: 'Meters Offline', desc: '5 meters in South Hub offline.', time: '10m ago' },
    { id: 2, type: 'warning', title: 'High Usage Alert', desc: 'West Plant usage spike detected.', time: '25m ago' },
    { id: 3, type: 'info', title: 'System Maintenance', desc: 'Scheduled maintenance at 2:00 AM.', time: '1h ago' },
  ];

  const userNotifications = [
    { id: 1, type: 'info', title: 'Bill Generated', desc: 'Your monthly bill for Jan is ready.', time: '2h ago' },
    { id: 2, type: 'warning', title: 'Voltage Fluctuation', desc: 'Meter-01 reported voltage instability.', time: '5h ago' },
    { id: 3, type: 'info', title: 'Usage Update', desc: 'Weekly usage report is available.', time: '1d ago' },
  ];

  const notifications = userRole === 'Admin' ? adminNotifications : userNotifications;


  return (
    <header className="h-16 bg-white/50 backdrop-blur-xl flex items-center px-4 sm:px-6 sticky top-0 z-50 justify-between transition-all duration-300 shadow-[0_4px_24px_rgba(0,0,0,0.15)]">
      {/* Left: Search */}
      <div className="flex items-center gap-4 flex-shrink-0 relative z-50">
        {/* Desktop search */}
        <div className="relative w-full max-w-xs sm:max-w-sm md:w-64 hidden sm:block flex-shrink" ref={searchRef}>
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="text-slate-400 group-focus-within:text-orange-500 transition-colors" size={18} />
          </div>
          <input
            value={searchQuery}
            onChange={handleSearch}
            placeholder="Search (Pages, Devices, Users)..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 text-sm outline-none focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-300 placeholder:text-slate-400 shadow-md shadow-orange-100 hover:shadow-orange-200 hover:border-orange-300 hover:bg-white"
            onFocus={() => { if (searchResults.length > 0) setShowSearchDropdown(true); }}
          />

          {/* Search Results Dropdown */}
          {showSearchDropdown && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 max-h-[400px] overflow-y-auto custom-scrollbar">
              <div className="p-2">
                {['Pages', 'Devices', 'Users', 'Locations', 'Parameters'].map(category => {
                  const items = searchResults.filter(r => r.category === category);
                  if (items.length === 0) return null;
                  return (
                    <div key={category} className="mb-2 last:mb-0">
                      <div className="px-3 py-1.5 text-xs font-bold text-gray-400 uppercase tracking-wider bg-gray-50/50 rounded-lg mb-1">{category}</div>
                      {items.map(item => (
                        <button
                          key={item.id}
                          onClick={() => handleResultClick(item)}
                          className="w-full text-left px-3 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-700 flex items-center justify-between gap-3 transition-colors group"
                        >
                          <div className="flex flex-col overflow-hidden">
                            <span className="font-medium truncate">{item.label}</span>
                            {item.value && <span className="text-xs text-gray-400 group-hover:text-orange-500/80 truncate">{item.value}</span>}
                          </div>
                          {item.status && (
                            <span className={`text-[10px] px-1.5 py-0.5 rounded-full flex-shrink-0 font-bold ${item.status === 'Active' ? 'bg-emerald-100 text-emerald-700' :
                              item.status === 'Warning' ? 'bg-amber-100 text-amber-700' :
                                item.status === 'Inactive' ? 'bg-gray-100 text-gray-600' : 'bg-red-100 text-red-600'
                              }`}>
                              {item.status}
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        {/* Mobile search toggle */}
        <button
          className="p-2 rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors sm:hidden flex-shrink-0"
          onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
        >
          <Search size={20} />
        </button>
      </div>

      {/* Center: Resource shortcuts (Desktop only) */}
      <div className="hidden md:flex flex-wrap items-center gap-3 bg-white/5 p-1.5 rounded-2xl border border-white/10 max-w-full shadow-[0_4px_20px_rgba(251,146,60,0.15)] backdrop-blur-sm">
        <Resource
          icon={Sun}
          label="Solar"
          activeColor="bg-amber-100 text-amber-700 shadow-sm"
          inactiveColor="text-gray-500 hover:text-amber-600 hover:bg-amber-50"
          active={activePage === "Solar"}
          onClick={() => setActivePage("Solar")}
        />
        <Resource
          icon={Droplet}
          label="Water"
          activeColor="bg-cyan-100 text-cyan-700 shadow-sm"
          inactiveColor="text-gray-500 hover:text-cyan-600 hover:bg-cyan-50"
          active={activePage === "Water"}
          onClick={() => setActivePage("Water")}
        />
        <Resource
          icon={Flame}
          label="Gas"
          activeColor="bg-orange-100 text-orange-700 shadow-sm"
          inactiveColor="text-gray-500 hover:text-orange-600 hover:bg-orange-50"
          active={activePage === "Gas"}
          onClick={() => setActivePage("Gas")}
        />
        <Resource
          icon={Zap}
          label="Energy"
          activeColor="bg-emerald-100 text-emerald-700 shadow-sm"
          inactiveColor="text-gray-500 hover:text-emerald-600 hover:bg-emerald-50"
          active={activePage === "Energy"}
          onClick={() => setActivePage("Energy")}
        />
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4 flex-shrink-0">
        <div className="flex items-center gap-1">
          <div className="relative" ref={notifRef}>
            <button
              className="peer relative p-2 rounded-full text-slate-600 hover:bg-orange-50 hover:text-orange-600 transition"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white shadow-[0_0_8px_rgba(244,63,94,0.6)]"></span>
            </button>

            {/* Notification Dropdown */}
            {showNotifications && (
              <div className="absolute top-full right-0 mt-2 w-80 md:w-96 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="p-4 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
                  <div className="flex items-center gap-2">
                    <div className="bg-rose-100 p-1.5 rounded-lg text-rose-600">
                      <Bell size={16} />
                    </div>
                    <h3 className="font-bold text-gray-900">Notifications</h3>
                  </div>
                  <button className="text-xs text-blue-600 font-medium hover:text-blue-700 flex items-center gap-1">
                    <Check size={14} /> Mark all read
                  </button>
                </div>
                <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                  {notifications.map((notif) => (
                    <div key={notif.id} className="p-4 border-b border-gray-50 hover:bg-orange-50 transition-colors cursor-pointer group">
                      <div className="flex items-start gap-4">
                        <div className={`mt-1.5 w-2 flex-shrink-0 h-2 rounded-full ${notif.type === 'critical' ? 'bg-rose-500 shadow-rose-200 shadow-lg' :
                          notif.type === 'warning' ? 'bg-amber-500' : 'bg-blue-500'
                          }`} />
                        <div>
                          <p className="text-sm font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">{notif.title}</p>
                          <p className="text-xs text-gray-500 mt-1 leading-relaxed">{notif.desc}</p>
                          <p className="text-[10px] text-gray-400 mt-2 font-medium bg-gray-100 inline-block px-2 py-0.5 rounded-full">{notif.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-3 bg-gray-50/50 border-t border-gray-100 text-center">
                  <button className="text-xs text-gray-600 hover:text-gray-900 font-semibold py-1">View All History</button>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={() => setActivePage('Settings')}
            className="p-2 rounded-full text-slate-600 hover:bg-orange-50 hover:text-orange-600 transition-colors"
          >
            <Settings size={20} />
          </button>
        </div>

        <div className="h-6 w-px bg-slate-200 mx-1"></div>

        <div className="relative" ref={profileRef}>
          <button
            className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-full hover:bg-orange-50 transition-colors group"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            title="Profile"
          >
            <div className="hidden lg:block text-right">
              <p className="text-sm font-semibold text-slate-700 leading-none group-hover:text-orange-600 transition">Admin User</p>
              <p className="text-[11px] text-slate-500 mt-0.5 group-hover:text-slate-700">Super Admin</p>
            </div>
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-md shadow-blue-500/20 group-hover:shadow-lg group-hover:scale-105 transition-all duration-300">
              AU
            </div>
          </button>

          {/* Profile Dropdown */}
          {showProfileMenu && (
            <div className="absolute top-full right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="p-6 bg-gradient-to-br from-slate-900 to-slate-800 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mt-10 blur-2xl"></div>
                <div className="relative z-10 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-lg font-bold border-2 border-white/20">AU</div>
                  <div>
                    <p className="font-bold text-lg">Admin User</p>
                    <p className="text-xs text-slate-300">admin@embel.io</p>
                  </div>
                </div>
              </div>
              <div className="p-2">
                <button
                  onClick={() => { setShowProfileMenu(false); setActivePage('Settings'); }}
                  className="w-full text-left px-4 py-3 rounded-xl text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 flex items-center gap-3 transition-colors font-medium"
                >
                  <User size={18} className="text-slate-400" /> Account Settings
                </button>
                <button
                  onClick={() => { setShowProfileMenu(false); setActivePage('Settings'); }}
                  className="w-full text-left px-4 py-3 rounded-xl text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 flex items-center gap-3 transition-colors font-medium"
                >
                  <Settings size={18} className="text-slate-400" /> System Preferences
                </button>
              </div>
              <div className="p-2 border-t border-gray-50 mb-1">
                <button
                  className="w-full text-left px-4 py-3 rounded-xl text-sm text-rose-600 hover:bg-rose-50 flex items-center gap-3 transition-colors font-bold"
                  onClick={onLogout}
                >
                  <LogOut size={18} /> Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile search overlay */}
      {mobileSearchOpen && (
        <div className="absolute top-16 left-0 right-0 w-full bg-white p-4 sm:hidden z-20 shadow-md">
          <div className="relative">
            <input
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Search data..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm outline-none focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-300 placeholder:text-gray-400 hover:border-orange-300"
            />
            <button
              className="absolute inset-y-0 left-0 pl-3 flex items-center"
              onClick={() => setMobileSearchOpen(false)}
            >
              <X size={18} className="text-gray-400" />
            </button>

            {/* Mobile Search Results */}
            {showSearchDropdown && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 max-h-[300px] overflow-y-auto custom-scrollbar z-50">
                <div className="p-2">
                  {['Pages', 'Devices', 'Users', 'Locations', 'Parameters'].map(category => {
                    const items = searchResults.filter(r => r.category === category);
                    if (items.length === 0) return null;
                    return (
                      <div key={category} className="mb-2 last:mb-0">
                        <div className="px-3 py-1.5 text-xs font-bold text-gray-400 uppercase tracking-wider bg-gray-50/50 rounded-lg mb-1">{category}</div>
                        {items.map(item => (
                          <button
                            key={item.id}
                            onClick={() => { handleResultClick(item); setMobileSearchOpen(false); }}
                            className="w-full text-left px-3 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-700 flex items-center justify-between gap-3 transition-colors group"
                          >
                            <div className="flex flex-col overflow-hidden">
                              <span className="font-medium truncate">{item.label}</span>
                              {item.value && <span className="text-xs text-gray-400 group-hover:text-orange-500/80 truncate">{item.value}</span>}
                            </div>
                            {item.status && (
                              <span className={`text-[10px] px-1.5 py-0.5 rounded-full flex-shrink-0 font-bold ${item.status === 'Active' ? 'bg-emerald-100 text-emerald-700' :
                                item.status === 'Warning' ? 'bg-amber-100 text-amber-700' :
                                  item.status === 'Inactive' ? 'bg-gray-100 text-gray-600' : 'bg-red-100 text-red-600'
                                }`}>
                                {item.status}
                              </span>
                            )}
                          </button>
                        ))}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

function Resource({ icon: Icon, label, activeColor, inactiveColor, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-300 ${active ? activeColor : inactiveColor
        } flex-shrink-0`}
    >
      <Icon size={14} className={active ? "stroke-[2.5px]" : "stroke-[2px]"} />
      {label}
    </button>
  );
}

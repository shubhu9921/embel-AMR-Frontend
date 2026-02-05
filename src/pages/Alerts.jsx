import { useState } from 'react';
import { AlertCircle, X, CheckCircle, Info, AlertTriangle, Filter, Search, ChevronLeft, ChevronRight, CheckSquare } from 'lucide-react';
import { useAlerts } from "../context/AlertContext";

const alertStyles = {
  critical: { bg: 'bg-red-50', border: 'border-red-100', text: 'text-red-900', icon: 'text-red-500', iconBg: 'bg-red-100' },
  warning: { bg: 'bg-amber-50', border: 'border-amber-100', text: 'text-amber-900', icon: 'text-amber-500', iconBg: 'bg-amber-100' },
  success: { bg: 'bg-emerald-50', border: 'border-emerald-100', text: 'text-emerald-900', icon: 'text-emerald-500', iconBg: 'bg-emerald-100' },
  info: { bg: 'bg-blue-50', border: 'border-blue-100', text: 'text-blue-900', icon: 'text-blue-500', iconBg: 'bg-blue-100' },
};

export default function AlertsPage() {
  const { alerts, markAllAsRead, dismissAlert } = useAlerts();
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  // Unread count
  const unreadCount = alerts.filter(a => !a.read).length;

  // Filter and search
  const filteredAlerts = alerts.filter(a => {
    const matchesSearch =
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.message.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filterType === 'all' || a.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const totalPages = Math.ceil(filteredAlerts.length / pageSize);
  const paginatedAlerts = filteredAlerts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="w-full h-full flex flex-col bg-gray-100 overflow-hidden relative">

      {/* Page Header */}
      <div className="sticky top-0 z-20 group bg-white/90 backdrop-blur-xl border border-gray-200 px-6 py-4 rounded-2xl shadow-sm transition-all duration-300 hover:shadow-md hover:bg-blue-50/90 mx-6 mt-6 mb-2">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg transition-transform duration-300 group-hover:scale-105">
              <AlertTriangle size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                System Alerts
              </h1>
              <p className="text-sm font-medium text-gray-500">
                Manage and monitor system notifications
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="h-1.5 w-24 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 opacity-20 hidden sm:block" />
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg text-sm font-medium transition-colors border border-blue-100 shadow-sm"
              >
                <CheckSquare size={16} />
                Mark {unreadCount} Read
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden p-6 flex flex-col gap-6 max-w-5xl mx-auto w-full">

        {/* Controls */}
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
            {['all', 'critical', 'warning', 'info', 'success'].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`capitalize px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${filterType === type
                  ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                  : 'bg-white text-gray-500 border-gray-200 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200'
                  }`}
              >
                {type}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64 group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="text-slate-400 group-focus-within:text-orange-500 transition-colors" size={18} />
            </div>
            <input
              type="text"
              placeholder="Search alerts..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 text-sm outline-none focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-300 placeholder:text-slate-400 shadow-md shadow-orange-100 hover:shadow-orange-200 hover:border-orange-300 hover:bg-white"
            />
          </div>
        </div>

        {/* Alerts Grid */}
        <div className="flex-1 overflow-y-auto min-h-0 space-y-3 custom-scrollbar pr-2 pb-20">
          {paginatedAlerts.length > 0 ? (
            paginatedAlerts.map(alert => {
              const style = alertStyles[alert.type] || alertStyles.info;
              return (
                <div
                  key={alert.id}
                  className={`group bg-white p-4 rounded-xl border-l-4 ${style.border.replace('border', 'border-l')} border-y border-r border-gray-100 shadow-sm hover:shadow-md hover:bg-orange-50 transition-all duration-300 flex gap-4 ${alert.read ? 'opacity-75 grayscale-[0.3]' : ''}`}
                >
                  {/* Icon */}
                  <div className={`w-10 h-10 rounded-full ${style.iconBg} flex items-center justify-center shrink-0`}>
                    <AlertCircle className={`w-5 h-5 ${style.icon}`} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className={`text-sm font-bold ${style.text} mb-1 flex items-center gap-2`}>
                          {alert.title}
                          {!alert.read && <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />}
                        </h3>
                        <p className="text-sm text-gray-600 leading-relaxed">{alert.message}</p>
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); dismissAlert(alert.id); }}
                        className="text-gray-300 hover:text-gray-500 transition-colors p-1 hover:bg-gray-100 rounded-lg opacity-0 group-hover:opacity-100 focus:opacity-100"
                        title="Dismiss"
                      >
                        <X size={16} />
                      </button>
                    </div>

                    <div className="flex items-center gap-4 mt-3">
                      <span className="text-[10px] font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
                        {alert.timestamp}
                      </span>
                      <span className="text-[10px] font-medium text-gray-500 uppercase tracking-wide">
                        Source: {alert.page || 'System'}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <CheckCircle size={32} className="text-gray-300" />
              </div>
              <p className="text-sm font-medium">No alerts found</p>
              <p className="text-xs text-gray-400 mt-1">Adjust filters or search query</p>
            </div>
          )}
        </div>

        {/* Pagination in Footer */}
        {totalPages > 1 && (
          <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 flex items-center justify-center gap-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
            <button
              onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-gray-600"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-xs font-semibold text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-gray-600"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

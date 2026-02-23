import React, { useState } from 'react';
import { AlertTriangle, AlertCircle, CheckCircle, Info, Search, Bell, Eye, ChevronRight } from 'lucide-react';
import AlertIssueDetailsModal from '../modals/AlertIssueDetailsModal';

const alertConfig = {
  critical: { icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200', label: 'Critical' },
  warning: { icon: AlertTriangle, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200', label: 'Warning' },
  info: { icon: Info, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200', label: 'Info' },
  success: { icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-green-50', border: 'border-green-200', label: 'Success' },
};

export function AlertsPanel({ alerts = [], userRole = 'Admin', setActivePage, isExpanded, setIsExpanded }) {
  const [activeFilter, setActiveFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedAlert, setSelectedAlert] = useState(null);

  const getAlertsType = (a) => (a.type === 'error' ? 'critical' : (a.type || 'info')).toLowerCase();

  const counts = {
    all: alerts.length,
    critical: alerts.filter(a => getAlertsType(a) === 'critical').length,
    warning: alerts.filter(a => getAlertsType(a) === 'warning').length,
    info: alerts.filter(a => getAlertsType(a) === 'info').length,
    success: alerts.filter(a => getAlertsType(a) === 'success').length,
  };

  const getPreviewAlerts = () => {
    // 1 Critical, 2 Warning, 1 Info, 1 Success
    const critical = alerts.find(a => getAlertsType(a) === 'critical');
    const warnings = alerts.filter(a => getAlertsType(a) === 'warning').slice(0, 2);
    const info = alerts.find(a => getAlertsType(a) === 'info');
    const success = alerts.find(a => getAlertsType(a) === 'success');

    const preview = [];
    if (critical) preview.push(critical);
    preview.push(...warnings);
    if (info) preview.push(info);
    if (success) preview.push(success);

    // Filter by search if exists
    if (search) {
      return alerts.filter(a =>
        (a.name || a.title || "").toLowerCase().includes(search.toLowerCase()) ||
        (a.location || "").toLowerCase().includes(search.toLowerCase())
      ).slice(0, 5);
    }

    return preview.slice(0, 5);
  };

  const filteredAlerts = alerts.filter(a => {
    const type = getAlertsType(a);
    const matchesFilter = activeFilter === 'all' || type === activeFilter;
    const matchesSearch = !search ||
      (a.name || a.title || "").toLowerCase().includes(search.toLowerCase()) ||
      (a.location || "").toLowerCase().includes(search.toLowerCase()) ||
      (a.source || "").toLowerCase().includes(search.toLowerCase()) ||
      (a.device || "").toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const displayAlerts = isExpanded ? filteredAlerts : getPreviewAlerts();

  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-col h-full overflow-hidden transition-all duration-500`}>
      {/* Header & Search */}
      <div className="flex flex-col gap-4 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl bg-orange-50 text-orange-600 ${isExpanded ? 'animate-pulse' : ''}`}>
              <Bell size={20} />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900 tracking-tight">System Alerts</h3>
              {isExpanded && <p className="text-[10px] text-gray-400 font-medium tracking-tight">Full historical logs & management</p>}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative group">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
              <input
                className={`${isExpanded ? 'w-48' : 'w-28'} pl-8 pr-3 py-1.5 text-[10px] border border-gray-200 rounded-lg bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all`}
                placeholder="Filter..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            {isExpanded && (
              <button
                onClick={() => setIsExpanded(false)}
                className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 transition-colors"
                title="Collapse view"
              >
                <X size={18} />
              </button>
            )}
          </div>
        </div>

        {/* Counts / Tabs */}
        <div className={`grid ${isExpanded ? 'grid-cols-5' : 'grid-cols-3'} gap-1.5`}>
          <button
            onClick={() => { setActiveFilter('all'); setIsExpanded(true); }}
            className={`px-2 py-1.5 rounded-lg text-[10px] font-bold border transition-all text-center ${activeFilter === 'all' && isExpanded ? 'bg-slate-900 text-white border-slate-900 shadow-sm' : 'bg-gray-50 text-slate-600 border-gray-100 hover:bg-gray-100'
              }`}
          >
            All ({counts.all})
          </button>
          <button
            onClick={() => { setActiveFilter('critical'); setIsExpanded(true); }}
            className={`px-2 py-1.5 rounded-lg text-[10px] font-bold border transition-all text-center ${activeFilter === 'critical' && isExpanded ? 'bg-red-500 text-white border-red-500 shadow-sm' : 'bg-red-50 text-red-600 border-red-100 hover:bg-red-100'
              }`}
          >
            Critical ({counts.critical})
          </button>
          <button
            onClick={() => { setActiveFilter('warning'); setIsExpanded(true); }}
            className={`px-2 py-1.5 rounded-lg text-[10px] font-bold border transition-all text-center ${activeFilter === 'warning' && isExpanded ? 'bg-amber-500 text-white border-amber-500 shadow-sm' : 'bg-amber-50 text-amber-600 border-amber-100 hover:bg-amber-100'
              }`}
          >
            Warning ({counts.warning})
          </button>
          {isExpanded && (
            <>
              <button
                onClick={() => { setActiveFilter('info'); setIsExpanded(true); }}
                className={`px-2 py-1.5 rounded-lg text-[10px] font-bold border transition-all text-center ${activeFilter === 'info' && isExpanded ? 'bg-blue-500 text-white border-blue-500 shadow-sm' : 'bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-100'
                  }`}
              >
                Info ({counts.info})
              </button>
              <button
                onClick={() => { setActiveFilter('success'); setIsExpanded(true); }}
                className={`px-2 py-1.5 rounded-lg text-[10px] font-bold border transition-all text-center ${activeFilter === 'success' && isExpanded ? 'bg-emerald-500 text-white border-emerald-500 shadow-sm' : 'bg-green-50 text-emerald-600 border-green-100 hover:bg-green-100'
                  }`}
              >
                Success ({counts.success})
              </button>
            </>
          )}
        </div>
      </div>

      {/* Alerts Content */}
      <div className="flex-1 overflow-auto custom-scrollbar">
        {!isExpanded ? (
          <div className="space-y-2 pr-1">
            {displayAlerts.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
                <CheckCircle size={32} className="text-gray-300 mb-2" />
                <p className="text-[11px] font-bold text-gray-500">No alerts found</p>
              </div>
            ) : (
              displayAlerts.map((alert) => {
                const type = getAlertsType(alert);
                const config = alertConfig[type] || alertConfig.info;
                const Icon = config.icon;

                return (
                  <div
                    key={alert.id}
                    className="group relative bg-white border border-gray-100 rounded-xl p-3 shadow-sm hover:shadow-md hover:border-orange-200 transition-all duration-300"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`shrink-0 w-8 h-8 rounded-lg ${config.bg} flex items-center justify-center`}>
                        <Icon size={16} className={config.color} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-gray-900 text-xs truncate uppercase tracking-tight">
                          {alert.name || alert.title}
                        </h4>
                        <p className="text-[10px] text-gray-500 font-medium truncate">
                          {alert.location || 'Site Hub'} • {alert.timestamp || alert.time || alert.date}
                        </p>
                      </div>
                      <button
                        onClick={() => setSelectedAlert(alert)}
                        className="p-1.5 rounded-lg bg-gray-50 text-gray-400 opacity-0 group-hover:opacity-100 hover:bg-orange-100 hover:text-orange-600 transition-all"
                      >
                        <Eye size={14} />
                      </button>
                    </div>
                  </div>
                );
              })
            )}

            {alerts.length > 5 && (
              <button
                onClick={() => setIsExpanded(true)}
                className="w-full py-2.5 text-[11px] font-black text-indigo-600 uppercase tracking-widest bg-indigo-50/50 hover:bg-indigo-100 rounded-xl transition-all border border-indigo-100/50 flex items-center justify-center gap-2 group mt-2"
              >
                View All Alerts
                <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </button>
            )}
          </div>
        ) : (
          <div className="bg-slate-50/30 rounded-xl border border-gray-100 overflow-hidden">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead className="bg-slate-100/80 sticky top-0 z-10">
                <tr>
                  <th className="px-5 py-3 text-[10px] font-black text-slate-500 uppercase tracking-widest whitespace-nowrap">Alert Name</th>
                  <th className="px-5 py-3 text-[10px] font-black text-slate-500 uppercase tracking-widest whitespace-nowrap">Source</th>
                  <th className="px-5 py-3 text-[10px] font-black text-slate-500 uppercase tracking-widest whitespace-nowrap">Device</th>
                  <th className="px-5 py-3 text-[10px] font-black text-slate-500 uppercase tracking-widest whitespace-nowrap">Location</th>
                  <th className="px-5 py-3 text-[10px] font-black text-slate-500 uppercase tracking-widest whitespace-nowrap">Date/Time</th>
                  <th className="px-5 py-3 text-[10px] font-black text-slate-500 uppercase tracking-widest whitespace-nowrap">Severity</th>
                  <th className="px-5 py-3 text-[10px] font-black text-slate-500 uppercase tracking-widest whitespace-nowrap">Status</th>
                  <th className="px-5 py-3 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {filteredAlerts.map((alert) => {
                  const type = getAlertsType(alert);
                  const config = alertConfig[type] || alertConfig.info;
                  return (
                    <tr key={alert.id} className="hover:bg-slate-50/80 transition-colors group">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-2 h-2 rounded-full ${config.color === 'text-red-600' ? 'bg-red-500' : config.color === 'text-amber-600' ? 'bg-amber-500' : 'bg-blue-500'}`} />
                          <span className="text-xs font-bold text-gray-900 uppercase tracking-tight truncate max-w-[150px]">
                            {alert.name || alert.title}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{alert.source || 'N/A'}</span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-[10px] font-black tracking-widest">{alert.device || 'DEV-001'}</span>
                      </td>
                      <td className="px-5 py-4 text-[10px] font-medium text-gray-600">{alert.location || 'Warehouse A'}</td>
                      <td className="px-5 py-4 text-[10px] font-medium text-gray-600 whitespace-nowrap">{alert.timestamp || alert.time || alert.date}</td>
                      <td className="px-5 py-4">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-tighter ${config.bg} ${config.color} border border-current/20`}>
                          {config.label}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-50 text-amber-600 border border-amber-100 uppercase tracking-tighter">
                          {alert.status || 'Active'}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <button
                          onClick={() => setSelectedAlert(alert)}
                          className="p-1.5 rounded-lg bg-gray-50 text-gray-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-all inline-flex items-center gap-2 text-[10px] font-bold"
                        >
                          <Eye size={14} />
                          VIEW
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedAlert && (
        <AlertIssueDetailsModal
          item={selectedAlert}
          onClose={() => setSelectedAlert(null)}
          setActivePage={setActivePage}
        />
      )}
    </div>
  );
}

const X = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

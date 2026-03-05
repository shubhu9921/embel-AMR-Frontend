import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Bell, Search, Filter, ChevronLeft, ChevronRight, Eye, MessageSquare, AlertCircle, ChevronDown, CheckCircle, Info, AlertTriangle, Edit, Plus, HelpCircle, Trash2 } from 'lucide-react';
import { useSupport } from '../context/SupportContext';
import AlertIssueDetailsModal from '../components/modals/AlertIssueDetailsModal';
import SupportModal from '../components/modals/SupportModal';
import { StatCard } from '../components/dashboard/StatCard';

export default function AlertsPage({ setActivePage = () => { } }) {
  const { tickets, deleteTicket, getKPIs } = useSupport();
  const userRole = sessionStorage.getItem('userRole') || 'Industrial';
  const isAdmin = userRole === 'Admin' || userRole === 'Super Admin';
  const currentUser = sessionStorage.getItem('userName') || userRole;

  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [supportItem, setSupportItem] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(null); // 'type', 'source'
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const pageSize = 8;

  // Get alerts from centralized support state
  const allAlerts = (userRole === 'Admin' || userRole === 'Super Admin')
    ? tickets.filter(t => t.type === 'alert')
    : tickets.filter(t => t.type === 'alert' && (t.username === currentUser || t.userName === currentUser));

  const filteredAlerts = allAlerts.filter(item => {
    const matchesSearch = (item.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (item.deviceName || '').toLowerCase().includes(search.toLowerCase()) ||
      (item.location || '').toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === 'all' || (item.type || '').toLowerCase() === typeFilter.toLowerCase() || (item.severity || '').toLowerCase() === typeFilter.toLowerCase();
    const matchesSource = sourceFilter === 'all' || (item.source || '').toLowerCase() === sourceFilter.toLowerCase();
    return matchesSearch && matchesType && matchesSource;
  }).sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date));

  const totalPages = Math.ceil(filteredAlerts.length / pageSize);
  const paginatedAlerts = filteredAlerts.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleView = (item) => {
    setSelectedItem(item);
    setShowDetailsModal(true);
  };

  const handleRaiseSupport = (item = null) => {
    setSupportItem(item);
    setShowSupportModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this alert?')) {
      deleteTicket(id);
    }
  };

  // KPI Calculations (Synchronized with Dashboard)
  const alertKPIs = useMemo(() => getKPIs(currentUser), [getKPIs, currentUser]).alerts;

  const alertStats = useMemo(() => {
    return {
      total: alertKPIs.total,
      totalBreakdown: alertKPIs.statusBreakdown,
      critical: allAlerts.filter(a => (a.severity || a.type).toLowerCase() === 'critical').length,
      warning: allAlerts.filter(a => (a.severity || a.type).toLowerCase() === 'warning').length,
      info: allAlerts.filter(a => (a.severity || a.type).toLowerCase() === 'info').length,
      // Status breakdown for each severity
      criticalBreakdown: alertKPIs.statusBreakdown.map(b => ({ ...b, value: allAlerts.filter(a => a.source === b.label && (a.severity || a.type).toLowerCase() === 'critical').length })),
      warningBreakdown: alertKPIs.statusBreakdown.map(b => ({ ...b, value: allAlerts.filter(a => a.source === b.label && (a.severity || a.type).toLowerCase() === 'warning').length })),
      infoBreakdown: alertKPIs.statusBreakdown.map(b => ({ ...b, value: allAlerts.filter(a => a.source === b.label && (a.severity || a.type).toLowerCase() === 'info').length })),
    };
  }, [allAlerts, alertKPIs]);

  const typeStyles = {
    critical: 'bg-red-100 text-red-700 border-red-200',
    warning: 'bg-amber-100 text-amber-700 border-amber-200',
    info: 'bg-blue-100 text-blue-700 border-blue-200',
    alert: 'bg-red-50 text-red-600 border-red-100',
  };

  // Helper to get severity icon
  const getSeverityIcon = (severity) => {
    const lowerSeverity = (severity || '').toLowerCase();
    switch (lowerSeverity) {
      case 'critical':
        return <AlertTriangle size={16} />;
      case 'warning':
        return <AlertCircle size={16} />;
      case 'info':
        return <Info size={16} />;
      case 'success':
        return <CheckCircle size={16} />;
      default:
        return <Eye size={16} />;
    }
  };

  return (
    <div className="flex flex-col flex-1">
      <main className="w-full min-h-screen p-4 md:p-6 font-sans flex flex-col pt-6 md:pt-8 lg:overflow-visible">
        {/* Header */}
        <div className="p-5 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/50 backdrop-blur-sm sticky top-0 z-30 rounded-[20px] shadow-sm mb-4">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 text-white shadow-lg transition-transform duration-300 hover:scale-105">
              <Bell size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">System Alerts</h1>
              <p className="text-sm font-medium text-gray-500">Real-time monitoring and analytics</p>
            </div>
          </div>

          <button
            onClick={() => handleRaiseSupport()}
            className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-700 hover:to-purple-800 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-lg shadow-indigo-500/20 transition-all active:scale-95 group"
          >
            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
            Raise Support Ticket
          </button>
        </div>

        <div className="space-y-6 w-full mt-4">

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <StatCard
              title="Total Alerts"
              value={alertStats.total}
              icon={<div className="p-2 bg-orange-50 text-orange-600 rounded-lg"><Bell size={20} /></div>}
              color="orange"
              description="All active notifications"
              statusBreakdown={alertStats.totalBreakdown}
              onClick={() => { setTypeFilter('all'); setSourceFilter('all'); setSearch(''); }}
            />
            <StatCard
              title="Critical"
              value={alertStats.critical}
              icon={<div className="p-2 bg-red-50 text-red-600 rounded-lg"><AlertTriangle size={20} /></div>}
              color="red"
              description="Immediate action required"
              statusBreakdown={alertStats.criticalBreakdown}
              onClick={() => { setTypeFilter('critical'); setSourceFilter('all'); setSearch(''); }}
            />
            <StatCard
              title="Warning"
              value={alertStats.warning}
              icon={<div className="p-2 bg-amber-50 text-amber-600 rounded-lg"><AlertCircle size={20} /></div>}
              color="amber"
              description="Potential issues detected"
              statusBreakdown={alertStats.warningBreakdown}
              onClick={() => { setTypeFilter('warning'); setSourceFilter('all'); setSearch(''); }}
            />
            <StatCard
              title="System Info"
              value={alertStats.info}
              icon={<div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Info size={20} /></div>}
              color="blue"
              description="General system updates"
              statusBreakdown={alertStats.infoBreakdown}
              onClick={() => { setTypeFilter('info'); setSourceFilter('all'); setSearch(''); }}
            />
          </div>

          {/* Content Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col font-sans">
            {/* Filters & Search - Header */}
            <div className="p-5 flex flex-col xl:flex-row xl:items-center justify-between gap-4 bg-white/50 backdrop-blur-sm sticky top-[84px] z-20 rounded-t-2xl shadow-md border-b border-gray-100">
              <div className="relative w-full md:w-80 group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#ff6e00] transition-colors" />
                <input
                  type="text"
                  placeholder="Search alerts, devices, locations..."
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 placeholder-gray-400 outline-none focus:ring-2 focus:ring-[#ff6e00]/20 focus:border-[#ff6e00] transition-all shadow-md shadow-orange-100"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <div className="flex flex-wrap items-center gap-3" ref={dropdownRef}>
                {/* Type Filter */}
                <div className="relative min-w-[160px]">
                  <button
                    onClick={() => setOpenDropdown(openDropdown === 'type' ? null : 'type')}
                    className={`w-full flex items-center justify-between pl-4 pr-3 py-2.5 bg-gray-50 border rounded-xl text-sm font-bold text-gray-700 transition-all ${openDropdown === 'type' ? 'border-[#ff6e00] ring-2 ring-[#ff6e00]/20' : 'border-gray-200'}`}
                  >
                    <span className="truncate">{typeFilter === 'all' ? 'All Types' : typeFilter.charAt(0).toUpperCase() + typeFilter.slice(1)}</span>
                    <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${openDropdown === 'type' ? 'rotate-180' : ''}`} />
                  </button>
                  {openDropdown === 'type' && (
                    <div className="absolute top-full right-0 mt-2 w-full bg-white border border-gray-100 rounded-xl shadow-xl z-50 overflow-hidden text-sm animate-in fade-in zoom-in duration-200">
                      {['all', 'critical', 'warning', 'info'].map(opt => (
                        <button
                          key={opt}
                          onClick={() => { setTypeFilter(opt); setOpenDropdown(null); }}
                          className={`w-full text-left px-4 py-2.5 font-medium hover:bg-orange-50 ${typeFilter === opt ? 'text-[#ff6e00] bg-orange-50/50' : 'text-gray-600'}`}
                        >
                          {opt === 'all' ? 'All Types' : opt.charAt(0).toUpperCase() + opt.slice(1)}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Source Filter */}
                <div className="relative min-w-[160px]">
                  <button
                    onClick={() => setOpenDropdown(openDropdown === 'source' ? null : 'source')}
                    className={`w-full flex items-center justify-between pl-4 pr-3 py-2.5 bg-gray-50 border rounded-xl text-sm font-bold text-gray-700 transition-all ${openDropdown === 'source' ? 'border-[#ff6e00] ring-2 ring-[#ff6e00]/20' : 'border-gray-200'}`}
                  >
                    <span className="truncate">{sourceFilter === 'all' ? 'All Sources' : sourceFilter}</span>
                    <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${openDropdown === 'source' ? 'rotate-180' : ''}`} />
                  </button>
                  {openDropdown === 'source' && (
                    <div className="absolute top-full right-0 mt-2 w-full bg-white border border-gray-100 rounded-xl shadow-xl z-50 overflow-hidden text-sm animate-in fade-in zoom-in duration-200 max-h-60 overflow-y-auto custom-scrollbar">
                      {['all', 'Water', 'Energy', 'Gas', 'Solar', 'System', 'Billing'].map(opt => (
                        <button
                          key={opt}
                          onClick={() => { setSourceFilter(opt); setOpenDropdown(null); }}
                          className={`w-full text-left px-4 py-2.5 font-medium hover:bg-orange-50 ${sourceFilter === opt ? 'text-[#ff6e00] bg-orange-50/50' : 'text-gray-600'}`}
                        >
                          {opt === 'all' ? 'All Sources' : opt}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto min-h-[400px]">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Alert Name</th>
                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Source</th>
                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Device</th>
                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Location</th>
                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Date</th>
                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Severity</th>
                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Engineer</th>
                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {paginatedAlerts.map((item) => (
                    <tr key={item.id} className="hover:bg-orange-50/30 transition-colors group">
                      <td className="px-6 py-4 text-sm font-bold text-gray-900">{item.name}</td>
                      <td className="px-6 py-4 text-xs font-medium text-gray-600">
                        <span className="px-2 py-1 bg-gray-100 rounded-lg">{item.source}</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 font-medium">{item.deviceName}</td>
                      <td className="px-6 py-4 text-sm text-gray-600 font-medium">{item.location}</td>
                      <td className="px-6 py-4 text-sm text-gray-500 font-medium">{item.date}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase border ${typeStyles[item.type] || typeStyles[item.severity] || 'bg-gray-100'}`}>
                          {item.type || item.severity}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {(item.engineer || item.assignedEngineer) ? (
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-[10px] font-bold">
                              {(item.engineer || item.assignedEngineer || '').split(' ').filter(Boolean).map(n => n[0]).join('').toUpperCase()}
                            </div>
                            <span className="text-xs font-bold text-gray-700">{item.engineer || item.assignedEngineer}</span>
                          </div>
                        ) : (
                          <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Unassigned</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          {(item.engineer || item.assignedEngineer) && (item.status !== 'Resolved') && (
                            <button
                              onClick={() => {
                                if (window.confirm('Are you sure you want to mark this alert as resolved?')) {
                                  resolveTicket(item.id);
                                }
                              }}
                              className="p-2 hover:bg-emerald-100 text-emerald-600 rounded-lg transition-all"
                              title="Mark as Solved"
                            >
                              <CheckCircle size={16} />
                            </button>
                          )}
                          <button
                            onClick={() => handleView(item)}
                            className="p-2 hover:bg-orange-100 text-orange-600 rounded-lg transition-all"
                            title="View Details"
                          >
                            {getSeverityIcon(item.priority || item.severity || 'alert')}
                          </button>
                          <button
                            onClick={() => handleRaiseSupport(item)}
                            className="p-2 hover:bg-indigo-100 text-indigo-600 rounded-lg transition-all"
                            title="Raise Support"
                          >
                            <HelpCircle size={16} />
                          </button>
                          {isAdmin && (
                            <button
                              onClick={() => handleDelete(item.id)}
                              className="p-2 hover:bg-red-100 text-red-600 rounded-lg transition-all"
                              title="Delete Alert"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div >

            {filteredAlerts.length === 0 && (
              <div className="flex-1 flex flex-col items-center justify-center p-12 text-gray-400">
                <AlertCircle size={48} className="mb-4 opacity-20" />
                <p className="font-medium text-lg text-gray-500">No alerts found</p>
                <p className="text-sm">Try adjusting your filters or search terms</p>
              </div>
            )}
          </div >

          {/* Pagination */}
          {
            totalPages > 1 && (
              <div className="mt-6 flex items-center justify-center gap-4">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => prev - 1)}
                  className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  aria-label="Previous Page"
                >
                  <ChevronLeft size={20} />
                </button>
                <span className="text-sm font-bold text-gray-600">Page {currentPage} of {totalPages}</span>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => prev + 1)}
                  className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  aria-label="Next Page"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )
          }

          {
            showDetailsModal && selectedItem && (
              <AlertIssueDetailsModal
                item={selectedItem}
                onClose={() => setShowDetailsModal(false)}
              />
            )
          }

          {
            showSupportModal && (
              <SupportModal
                editItem={supportItem ? { ...supportItem } : { type: 'alert' }}
                onClose={() => {
                  setShowSupportModal(false);
                  setSupportItem(null);
                }}
                setActivePage={setActivePage}
                userDetails={{
                  name: currentUser,
                  id: sessionStorage.getItem('userId') || currentUser
                }}
              />
            )
          }
        </div>
      </main>
    </div>
  );
}

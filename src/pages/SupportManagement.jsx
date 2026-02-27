import React, { useState, useMemo } from 'react';
import { Search, Filter, Clock, CheckCircle, AlertCircle, AlertTriangle, User, Tag, MessageSquare, ChevronRight, MoreVertical, UserPlus, ExternalLink, Mail, Phone, MapPin, Loader2, Zap, Droplets, Flame, Sun, Trash2, Trash, Plus, Bell } from 'lucide-react';
import SupportModal from '../components/modals/SupportModal';
import EngineerAssignmentModal from '../components/modals/EngineerAssignmentModal';
import { SupportTicketsBreakdownCard } from '../components/dashboard/SupportTicketsBreakdownCard';
import { useSupport } from '../context/SupportContext';
import { SUPPORT_ENGINEERS } from '../data/supportData';

export default function SupportManagement() {
    const { tickets, isLoading, assignEngineer, resolveTicket, updateTicket, deleteTicket, getKPIs, TICKET_STATUS, TICKET_PRIORITY } = useSupport();
    const userRole = sessionStorage.getItem('userRole') || 'Admin';
    const isAdmin = userRole === 'Admin' || userRole === 'Super Admin';
    const [filter, setFilter] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');

    const handleStatusChange = (id, newStatus) => {
        if (newStatus === TICKET_STATUS.RESOLVED) {
            resolveTicket(id);
        }
    };

    const handlePriorityChange = (id, newPriority) => {
        // Context currently doesn't have a specific priority change method, 
        // using updateTicket or we can add it later.
    };

    const handleEngineerChange = (id, engineer) => {
        assignEngineer(id, engineer);
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this ticket?')) {
            deleteTicket(id);
        }
    };

    const statusColors = {
        [TICKET_STATUS.PENDING]: 'bg-amber-50 text-amber-700 border-amber-200',
        [TICKET_STATUS.ASSIGNED]: 'bg-blue-50 text-blue-700 border-blue-200',
        [TICKET_STATUS.IN_PROGRESS]: 'bg-indigo-50 text-indigo-700 border-indigo-200',
        [TICKET_STATUS.RESOLVED]: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    };

    const priorityColors = {
        [TICKET_PRIORITY.LOW]: 'text-gray-500 bg-gray-50',
        [TICKET_PRIORITY.MEDIUM]: 'text-blue-600 bg-blue-50',
        [TICKET_PRIORITY.HIGH]: 'text-rose-600 bg-rose-50',
    };

    const filteredTickets = (tickets || []).filter(t => {
        const matchesFilter = filter === 'All' || t.status === filter;
        const matchesSearch = (t.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (t.id || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (t.userName || '').toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    }).sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date));

    // KPI Calculations (Synchronized with Dashboard)
    const supportKPIs = useMemo(() => getKPIs('Admin'), [getKPIs]).overall;

    const supportStats = useMemo(() => {
        const createBreakdown = (statusValue) => {
            return supportKPIs.statusBreakdown.map(b => ({
                ...b,
                value: tickets.filter(t => (t.source || t.issueType) === b.label && t.status === statusValue).length
            }));
        };

        return {
            total: supportKPIs.total,
            totalBreakdown: supportKPIs.statusBreakdown,
            pending: tickets.filter(t => t.status === TICKET_STATUS.PENDING).length,
            pendingBreakdown: createBreakdown(TICKET_STATUS.PENDING),
            assigned: tickets.filter(t => t.status === TICKET_STATUS.ASSIGNED).length,
            assignedBreakdown: createBreakdown(TICKET_STATUS.ASSIGNED),
            inProgress: tickets.filter(t => t.status === TICKET_STATUS.IN_PROGRESS).length,
            inProgressBreakdown: createBreakdown(TICKET_STATUS.IN_PROGRESS),
            resolved: tickets.filter(t => t.status === TICKET_STATUS.RESOLVED).length,
            resolvedBreakdown: createBreakdown(TICKET_STATUS.RESOLVED),
        };
    }, [tickets, supportKPIs, TICKET_STATUS, TICKET_PRIORITY]);

    return (
        <div className="flex flex-col flex-1">
            <main className="w-full min-h-screen p-4 md:p-6 font-sans lg:overflow-visible pt-6 md:pt-8">

                {/* Header Section */}
                <div className="p-5 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/50 backdrop-blur-sm sticky top-0 z-30 rounded-[20px] shadow-sm mb-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 w-full">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 text-white shadow-lg transition-transform duration-300 hover:scale-105">
                                <MessageSquare size={24} />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Support Management</h1>
                                <p className="text-sm font-medium text-gray-500">Real-time monitoring and analytics</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="relative group">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <input
                                    type="text"
                                    placeholder="Search tickets..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none w-64 shadow-md shadow-orange-100 transition-all"
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mb-4 mt-2">
                    <SupportTicketsBreakdownCard tickets={filteredTickets} />
                </div>

                {/* Tickets Table */}
                <div className="bg-white rounded-[32px] shadow-xl border border-gray-100 flex flex-col mt-6">
                    <div className="p-6 border-b border-gray-50 flex items-center justify-between flex-wrap gap-4">
                        <div className="flex p-1 bg-gray-50 rounded-xl border border-gray-100">
                            {['All', TICKET_STATUS.PENDING, TICKET_STATUS.ASSIGNED, TICKET_STATUS.IN_PROGRESS, TICKET_STATUS.RESOLVED].map(s => (
                                <button
                                    key={s}
                                    onClick={() => setFilter(s)}
                                    className={`px-4 py-1.5 text-xs font-black rounded-lg transition-all ${filter === s ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-400 hover:text-gray-600'} `}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="overflow-x-auto px-2">
                        <table className="w-full text-left border-collapse min-w-[1000px]">
                            <thead className="bg-gray-50/50 sticky top-0 z-10">
                                <tr>
                                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Ticket ID</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">User Details</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Issue Info</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {isLoading ? (
                                    <tr>
                                        <td colSpan="5" className="p-0">
                                            <div className="px-6 py-20 text-center flex flex-col items-center">
                                                <div className="w-16 h-16 bg-gray-50 text-indigo-500 rounded-full flex items-center justify-center mb-4">
                                                    <Loader2 size={32} className="animate-spin" />
                                                </div>
                                                <h4 className="text-lg font-bold text-gray-900">Loading Tickets...</h4>
                                                <p className="text-sm text-gray-500">Please wait while we fetch support requests.</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : filteredTickets.map((ticket) => (
                                    <tr key={ticket.id} className="group hover:bg-indigo-50/20 transition-colors">
                                        <td className="px-6 py-5">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-black text-gray-900 group-hover:text-indigo-600 transition-colors">{ticket.id}</span>
                                                <span className="text-[10px] font-bold text-gray-400 uppercase mt-0.5">
                                                    {ticket.createdAt ? new Date(ticket.createdAt).toLocaleDateString() : 'N/A'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center font-black border border-indigo-100 uppercase">
                                                    {(ticket.userName || 'U').charAt(0)}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-gray-900">{ticket.userName}</span>
                                                    <div className="flex flex-col gap-0.5 mt-1">
                                                        <span className="text-[10px] font-bold text-gray-400 flex items-center gap-1 uppercase tracking-tight"><Phone size={10} /> {ticket.mobile}</span>
                                                        <span className="text-[10px] font-bold text-gray-400 flex items-center gap-1 uppercase tracking-tight"><Mail size={10} /> {ticket.email}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex flex-col gap-1.5">
                                                <div className="flex items-center gap-2">
                                                    <span className={`px - 2 py - 0.5 rounded - md text - [9px] font - black uppercase tracking - wider ${priorityColors[ticket.priority]} `}>
                                                        {ticket.priority}
                                                    </span>
                                                    <span className="text-[10px] font-black text-indigo-400 uppercase tracking-tighter opacity-70">/ {ticket.type}</span>
                                                </div>
                                                <span className="text-sm font-bold text-gray-800 line-clamp-1">{ticket.description}</span>
                                                <span className="text-[10px] font-bold text-gray-400 flex items-center gap-1 uppercase tracking-tight"><MapPin size={10} /> {ticket.location}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex flex-col gap-3">
                                                <div className={`px - 3 py - 1.5 rounded - xl border text - [10px] font - black uppercase tracking - widest inline - flex items - center gap - 2 w - max ${statusColors[ticket.status]} `}>
                                                    <span className={`w - 1.5 h - 1.5 rounded - full ${ticket.status === TICKET_STATUS.RESOLVED ? 'bg-emerald-500' : 'bg-current'} `}></span>
                                                    {ticket.status}
                                                </div>
                                                <div className="relative group/sel">
                                                    <select
                                                        value={ticket.assignedTo || ''}
                                                        onChange={(e) => handleEngineerChange(ticket.id, e.target.value)}
                                                        className="w-full pl-7 pr-3 py-2 bg-gray-50/50 border border-gray-100 rounded-xl text-[10px] font-bold text-gray-600 outline-none focus:ring-2 focus:ring-indigo-500/10 transition-all appearance-none cursor-pointer"
                                                    >
                                                        <option value="" disabled>Assign Engineer...</option>
                                                        {(SUPPORT_ENGINEERS || []).map(eng => (
                                                            <option key={eng.id} value={eng.name}>{eng.name} ({eng.specialization})</option>
                                                        ))}
                                                    </select>
                                                    <UserPlus className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                                                    <ChevronRight className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-300 pointer-events-none rotate-90" />
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {ticket.status !== TICKET_STATUS.RESOLVED && (
                                                    <button
                                                        onClick={() => handleStatusChange(ticket.id, TICKET_STATUS.RESOLVED)}
                                                        className="p-2 hover:bg-emerald-50 text-emerald-600 rounded-xl transition-all border border-transparent hover:border-emerald-100"
                                                        title="Mark Resolved"
                                                        aria-label="Mark Ticket as Resolved"
                                                    >
                                                        <CheckCircle size={16} />
                                                    </button>
                                                )}
                                                <button
                                                    className="p-2 hover:bg-indigo-50 text-indigo-600 rounded-xl transition-all border border-transparent hover:border-indigo-100"
                                                    aria-label="View Details"
                                                >
                                                    <ExternalLink size={16} />
                                                </button>
                                                {isAdmin && (
                                                    <button
                                                        onClick={() => handleDelete(ticket.id)}
                                                        className="p-2 hover:bg-red-50 text-red-600 rounded-xl transition-all border border-transparent hover:border-red-100"
                                                        title="Delete Ticket"
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
                    </div>

                    {filteredTickets.length === 0 && (
                        <div className="p-12 text-center flex flex-col items-center">
                            <div className="w-16 h-16 bg-gray-50 text-gray-300 rounded-full flex items-center justify-center mb-4">
                                <Search size={32} />
                            </div>
                            <h4 className="text-lg font-black text-gray-900">No tickets found</h4>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

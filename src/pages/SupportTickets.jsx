import React, { useState } from 'react';
import { MessageSquare, Plus, Search, Filter, AlertCircle, Clock, CheckCircle } from 'lucide-react';
import { industrialIssues, domesticIssues } from '../data/mockData';
import SupportModal from '../components/modals/SupportModal';

export default function SupportTickets({ setActivePage = () => { } }) {
    const userRole = sessionStorage.getItem('userRole') || 'Industrial';
    const allTickets = userRole === 'Domestic' ? domesticIssues : industrialIssues;

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('Active');
    const [showSupportModal, setShowSupportModal] = useState(false);
    const [editItem, setEditItem] = useState(null);

    const handleRaiseAgain = (ticket) => {
        const newTicket = {
            ...ticket,
            id: Math.floor(100 + Math.random() * 900).toString(),
            status: 'Active',
            date: new Date().toISOString().split('T')[0]
        };
        // In a real app, this would be an API call and then update state
        // For now, we simulate by adding it (locally) or logging
        console.log('Ticket Raised Again:', newTicket);
        alert(`New Ticket Raised! ID: ${newTicket.id}`);
    };

    const handleEdit = (ticket) => {
        setEditItem(ticket);
        setShowSupportModal(true);
    };

    // Filtering logic
    const filteredTickets = allTickets.filter(ticket => {
        const matchesStatus = statusFilter === 'All' || ticket.status === statusFilter;

        const searchLower = searchTerm.toLowerCase();
        const matchesSearch =
            ticket.id.toString().toLowerCase().includes(searchLower) ||
            ticket.name.toLowerCase().includes(searchLower) ||
            ticket.source.toLowerCase().includes(searchLower) ||
            ticket.deviceName.toLowerCase().includes(searchLower) ||
            ticket.location.toLowerCase().includes(searchLower) ||
            ticket.date.toLowerCase().includes(searchLower) ||
            ticket.status.toLowerCase().includes(searchLower);

        return matchesStatus && matchesSearch;
    });

    return (
        <main className="w-full h-full flex flex-col gap-6 px-4 md:px-6 py-6 font-sans overflow-y-auto">
            {showSupportModal && (
                <SupportModal
                    onClose={() => {
                        setShowSupportModal(false);
                        setEditItem(null);
                    }}
                    setActivePage={setActivePage}
                    userDetails={{
                        name: sessionStorage.getItem('userName') || (userRole === 'Domestic' ? 'Domestic User' : 'Industrial User'),
                        id: sessionStorage.getItem('userId') || 'User1'
                    }}
                    editItem={editItem}
                />
            )}

            {/* Header */}
            <div className="p-5 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/50 backdrop-blur-sm sticky top-0 z-30 rounded-[20px] shadow-sm mb-2">
                <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 text-white shadow-lg">
                        <MessageSquare size={24} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Support Ticket Details</h1>
                        <p className="text-sm font-medium text-gray-500">View and manage your support requests</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => {
                            setEditItem(null);
                            setShowSupportModal(true);
                        }}
                        className="flex items-center gap-2 px-6 py-2.5 bg-[#ff6e00] hover:bg-[#e66300] text-white rounded-xl text-sm font-bold shadow-lg shadow-orange-500/30 hover:shadow-orange-500/40 transition-all active:scale-95"
                    >
                        <Plus size={18} />
                        Raise Ticket
                    </button>
                </div>
            </div>

            {/* Filters and Search */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 hidden md:block">Status Filter:</label>
                    <div className="relative flex-1 md:flex-none">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="w-full md:w-48 pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-gray-700 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all"
                        >
                            <option value="All">All Tickets</option>
                            <option value="Active">Active</option>
                            <option value="Processing">Processing</option>
                            <option value="Resolved">Resolved</option>
                        </select>
                    </div>
                </div>

                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search by ID, Name, Device, Location..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-gray-700 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none placeholder:text-gray-400 shadow-inner"
                    />
                </div>
            </div>

            {/* Single Table Section */}
            <div className="bg-white rounded-[32px] shadow-xl border border-gray-100 overflow-hidden min-h-[400px]">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50/50">
                            <tr>
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Ticket ID</th>
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Issue Name</th>
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Source</th>
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Device</th>
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Location</th>
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Date Raised</th>
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Engineer</th>
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredTickets.length > 0 ? filteredTickets.map(ticket => (
                                <tr key={ticket.id} className="hover:bg-indigo-50/20 transition-colors group">
                                    <td className="px-6 py-4 font-black text-xs text-gray-500 group-hover:text-indigo-600 transition-colors">{ticket.id}</td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm font-bold text-gray-900 line-clamp-1">{ticket.name}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-[10px] font-black px-2 py-1 bg-gray-100 text-gray-600 rounded-lg uppercase border border-gray-200">{ticket.source}</span>
                                    </td>
                                    <td className="px-6 py-4 text-xs font-bold text-gray-600">{ticket.deviceName}</td>
                                    <td className="px-6 py-4 text-xs font-bold text-gray-600">{ticket.location}</td>
                                    <td className="px-6 py-4 text-xs font-bold text-gray-500">{ticket.date}</td>
                                    <td className="px-6 py-4">
                                        <div className={`px-2.5 py-1.5 rounded-xl border text-[10px] font-black uppercase tracking-widest inline-flex items-center gap-2
                                            ${ticket.status === 'Resolved' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                                                ticket.status === 'Processing' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                                    'bg-amber-50 text-amber-700 border-amber-100'}`}>
                                            <span className={`w-1.5 h-1.5 rounded-full
                                                ${ticket.status === 'Resolved' ? 'bg-emerald-500' :
                                                    ticket.status === 'Processing' ? 'bg-blue-500' : 'bg-amber-500'}`}></span>
                                            {ticket.status}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {ticket.assignedEngineer ? (
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-[10px] font-bold">
                                                    {(ticket.assignedEngineer || '').split(' ').filter(Boolean).map(n => n[0]).join('').toUpperCase()}
                                                </div>
                                                <span className="text-xs font-bold text-gray-700">{ticket.assignedEngineer}</span>
                                            </div>
                                        ) : (
                                            <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Unassigned</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        {ticket.status === 'Resolved' ? (
                                            <button
                                                onClick={() => handleRaiseAgain(ticket)}
                                                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-[10px] font-black uppercase tracking-widest transition-all"
                                            >
                                                Raise Again
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => handleEdit(ticket)}
                                                className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all
                                                    ${userRole === 'Super Admin'
                                                        ? 'bg-orange-500 hover:bg-orange-600 text-white'
                                                        : 'bg-amber-500 hover:bg-amber-600 text-white'}`}
                                            >
                                                {userRole === 'Super Admin' ? 'View' : 'Edit'}
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="9" className="px-6 py-20 text-center flex flex-col items-center">
                                        <div className="w-16 h-16 bg-gray-50 text-gray-200 rounded-full flex items-center justify-center mb-4">
                                            <AlertCircle size={32} />
                                        </div>
                                        <h4 className="text-lg font-bold text-gray-900">No tickets found</h4>
                                        <p className="text-sm text-gray-500">Try adjusting your filter or search terms</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </main>
    );
}

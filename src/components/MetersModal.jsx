import React, { useState } from 'react';
import { X, Search, Filter } from 'lucide-react';

export function MetersModal({ isOpen, onClose, title, meters, hoverClass = "group-hover:text-blue-600" }) {
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');

    if (!isOpen) return null;

    const filteredMeters = meters.filter(m => {
        const matchesSearch = m.name?.toLowerCase().includes(search.toLowerCase()) ||
            m.id?.toLowerCase().includes(search.toLowerCase()) ||
            m.location?.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = statusFilter === 'All' || m.status?.toLowerCase() === statusFilter.toLowerCase();
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-4xl h-[80vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden">

                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
                        <p className="text-sm text-gray-500">{filteredMeters.length} devices found</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
                        aria-label="Close Modal"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Toolbar */}
                <div className="px-6 py-3 bg-slate-50 border-b border-gray-200 flex flex-wrap gap-3 items-center justify-between">
                    <div className="relative flex-1 min-w-[200px] max-w-md">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="text-slate-400 group-focus-within:text-orange-500 transition-colors" size={18} />
                        </div>
                        <input
                            type="text"
                            placeholder="Search by ID, Name or Location..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 rounded-xl bg-white border border-gray-200 text-sm outline-none focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-300 placeholder:text-slate-400 shadow-md shadow-orange-100 hover:shadow-orange-200 hover:border-orange-300"
                        />
                    </div>
                    <div className="relative flex items-center gap-2 group">
                        <Filter size={16} className="text-gray-500 group-hover:text-orange-500 transition-colors pointer-events-none absolute left-3 z-10" />
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="bg-white border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 block pl-9 pr-3 py-2 outline-none cursor-pointer hover:border-orange-300 hover:bg-orange-50/30 transition-all shadow-md shadow-orange-100 hover:shadow-orange-200 appearance-none"
                        >
                            <option value="All">All Status</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                            <option value="warning">Warning</option>
                        </select>
                    </div>
                </div>

                {/* Table Content */}
                <div className="flex-1 overflow-auto bg-slate-50 p-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-gray-50/50">
                                <tr>
                                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Device ID</th>
                                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Location</th>
                                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Consumption</th>
                                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredMeters.length > 0 ? (
                                    filteredMeters.map((meter) => (
                                        <tr key={meter.id || meter.deviceId} className="hover:bg-slate-50/80 transition-colors group cursor-default">
                                            <td className={`px-6 py-4 text-sm font-medium text-gray-900 ${hoverClass} transition-colors`}>
                                                {meter.deviceId || meter.id}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">{meter.deviceName || meter.name}</td>
                                            <td className="px-6 py-4 text-sm text-gray-500">{meter.location}</td>
                                            <td className="px-6 py-4 text-sm text-gray-900 font-semibold font-mono">
                                                {meter.dailyConsumption}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${meter.status === 'active' ? 'bg-green-50 text-green-700 border-green-100' :
                                                    meter.status === 'warning' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                                                        'bg-red-50 text-red-700 border-red-100'
                                                    }`}>
                                                    {meter.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                                            No meters found matching your search.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Footer */}
                <div className="bg-white border-t border-gray-100 px-6 py-4 flex justify-between items-center text-xs text-gray-500">
                    <span>Showing {filteredMeters.length} of {meters.length} meters</span>
                    <div className="flex gap-2">
                        <button className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-50" disabled>Previous</button>
                        <button className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-50" disabled>Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

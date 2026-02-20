import React, { useState, useMemo } from 'react';
import { X, MapPin, Filter, Search, User, Activity, AlertCircle, CheckCircle2 } from 'lucide-react';

export function LocationDetailsModal({ onClose }) {
    const [selectedLocation, setSelectedLocation] = useState('All');
    const [selectedSource, setSelectedSource] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');

    // Mock Data
    const locations = ['North Branch', 'South Hub', 'West Plant', 'East Depot'];
    const sources = ['Energy', 'Water', 'Gas', 'Solar'];

    const allDevices = [
        { id: 'D001', name: 'Main Energy Meter', location: 'North Branch', source: 'Energy', status: 'Active', user: 'Amit Sharma' },
        { id: 'D002', name: 'Water Pump A', location: 'North Branch', source: 'Water', status: 'Active', user: 'Amit Sharma' },
        { id: 'D003', name: 'Gas Line 1', location: 'South Hub', source: 'Gas', status: 'Inactive', user: 'Priya Singh' },
        { id: 'D004', name: 'Solar Inverter 1', location: 'West Plant', source: 'Solar', status: 'Active', user: 'Rahul Verma' },
        { id: 'D005', name: 'Energy Sub-meter', location: 'East Depot', source: 'Energy', status: 'Inactive', user: 'Suresh Patil' },
        { id: 'D006', name: 'Water Tank Level', location: 'South Hub', source: 'Water', status: 'Active', user: 'Priya Singh' },
        { id: 'D007', name: 'Gas Backup', location: 'West Plant', source: 'Gas', status: 'Active', user: 'Rahul Verma' },
        { id: 'D008', name: 'Solar Battery', location: 'East Depot', source: 'Solar', status: 'Inactive', user: 'Suresh Patil' },
        { id: 'D009', name: 'HVAC Energy Meter', location: 'North Branch', source: 'Energy', status: 'Active', user: 'Amit Sharma' },
        { id: 'D010', name: 'Irrigation Pump', location: 'South Hub', source: 'Water', status: 'Inactive', user: 'Priya Singh' },
    ];

    const filteredDevices = useMemo(() => {
        return allDevices.filter(device => {
            const matchLocation = selectedLocation === 'All' || device.location === selectedLocation;
            const matchSource = selectedSource === 'All' || device.source === selectedSource;
            const matchSearch = device.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                device.user.toLowerCase().includes(searchTerm.toLowerCase());
            return matchLocation && matchSource && matchSearch;
        });
    }, [selectedLocation, selectedSource, searchTerm]);

    return (
        <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-4xl h-[85vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-white">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                            <MapPin className="text-blue-500" size={24} />
                            Device Location Details
                        </h2>
                        <p className="text-sm text-gray-500 font-medium mt-1">Filter devices by location and source</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Filters */}
                <div className="p-6 bg-gray-50 border-b border-gray-100 grid grid-cols-1 md:grid-cols-3 gap-4">

                    {/* Location Select */}
                    <div className="relative">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">Location</label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            <select
                                value={selectedLocation}
                                onChange={(e) => setSelectedLocation(e.target.value)}
                                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white border border-gray-200 text-sm font-medium text-gray-700 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 appearance-none shadow-sm"
                            >
                                <option value="All">All Locations</option>
                                {locations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
                            </select>
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                <Filter size={14} className="text-gray-400" />
                            </div>
                        </div>
                    </div>

                    {/* Source Select */}
                    <div className="relative">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">Source</label>
                        <div className="relative">
                            <Activity className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            <select
                                value={selectedSource}
                                onChange={(e) => setSelectedSource(e.target.value)}
                                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white border border-gray-200 text-sm font-medium text-gray-700 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 appearance-none shadow-sm"
                            >
                                <option value="All">All Sources</option>
                                {sources.map(src => <option key={src} value={src}>{src}</option>)}
                            </select>
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                <Filter size={14} className="text-gray-400" />
                            </div>
                        </div>
                    </div>

                    {/* Search Input */}
                    <div className="relative">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">Search</label>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            <input
                                type="text"
                                placeholder="Search device or user..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white border border-gray-200 text-sm font-medium text-gray-700 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-sm placeholder:text-gray-400"
                            />
                        </div>
                    </div>
                </div>

                {/* Table Content */}
                <div className="flex-1 overflow-auto p-6 bg-white">
                    <div className="rounded-xl border border-gray-100 overflow-hidden shadow-sm">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-gray-50/50 border-b border-gray-100">
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Device Info</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Location</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Source</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Managed By</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filteredDevices.length > 0 ? (
                                    filteredDevices.map((device) => (
                                        <tr key={device.id} className="hover:bg-blue-50/30 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{device.name}</span>
                                                    <span className="text-xs text-gray-400 font-mono">{device.id}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <MapPin size={14} className="text-gray-400" />
                                                    {device.location}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border ${device.source === 'Energy' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                                        device.source === 'Water' ? 'bg-cyan-50 text-cyan-600 border-cyan-100' :
                                                            device.source === 'Gas' ? 'bg-orange-50 text-orange-600 border-orange-100' :
                                                                'bg-amber-50 text-amber-600 border-amber-100'
                                                    }`}>
                                                    {device.source}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className={`flex items-center gap-2 text-xs font-bold px-2 py-1 rounded-full w-fit ${device.status === 'Active' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                                                    }`}>
                                                    {device.status === 'Active' ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
                                                    {device.status}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 text-xs font-bold">
                                                        {device.user.charAt(0)}
                                                    </div>
                                                    <span className="text-sm font-medium text-gray-700">{device.user}</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-12 text-center text-gray-400">
                                            <div className="flex flex-col items-center justify-center gap-2">
                                                <Search size={32} className="text-gray-200" />
                                                <p>No devices found matching your filters.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    <div className="mt-4 flex items-center justify-between text-xs text-gray-400">
                        <span>Showing {filteredDevices.length} of {allDevices.length} devices</span>
                        <span>Mock Data Display</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

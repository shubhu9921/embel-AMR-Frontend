import { X, Info, MapPin, Cpu, Calendar, Clock, User, Phone, Mail, Tag } from 'lucide-react';

export default function AlertIssueDetailsModal({ item, onClose }) {
    if (!item) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={onClose}></div>

            {/* Modal */}
            <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
                {/* Header */}
                <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                    <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-2xl ${item.type === 'critical' ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'}`}>
                            {item.source === 'System' || item.type ? <Tag size={24} /> : <Info size={24} />}
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 leading-tight">{item.name}</h2>
                            <p className="text-sm font-medium text-gray-500 mt-1 uppercase tracking-wider">{item.source} • {item.id}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-xl text-gray-400 hover:text-gray-600 transition-all"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Primary Details */}
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Description</h3>
                            <p className="text-gray-700 font-medium leading-relaxed bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                {item.message || item.description || "No additional description provided."}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            <DetailRow icon={<Cpu />} label="Device Name" value={item.deviceName} />
                            <DetailRow icon={<Tag />} label="Source Type" value={item.source} />
                            <DetailRow icon={<MapPin />} label="Location" value={item.location} />
                        </div>
                    </div>

                    {/* Meta Details */}
                    <div className="space-y-6">
                        <div className="bg-orange-50/50 p-6 rounded-3xl border border-orange-100 space-y-4">
                            <h3 className="text-[10px] font-black text-orange-400 uppercase tracking-widest ">Time & Status</h3>
                            <div className="space-y-3">
                                <DetailRow icon={<Calendar />} label="Date" value={item.date} color="text-orange-700" />
                                <DetailRow icon={<Clock />} label="Time" value={item.time} color="text-orange-700" />
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-orange-400 flex items-center gap-2 uppercase tracking-tight">Status</span>
                                    <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider
                                        ${item.status === 'Resolved' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' :
                                            item.status === 'Processing' ? 'bg-blue-100 text-blue-700 border border-blue-200' :
                                                'bg-amber-100 text-amber-700 border border-amber-200'}
                                    `}>
                                        {item.status}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {sessionStorage.getItem('userRole') === 'Super Admin' && (
                            <div className="bg-indigo-50/50 p-6 rounded-3xl border border-indigo-100 space-y-4">
                                <h3 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Reported By</h3>
                                <div className="space-y-3">
                                    <DetailRow icon={<User />} label="User Name" value={item.userName || item.name || 'N/A'} color="text-indigo-700" />
                                    <DetailRow icon={<Phone />} label="Mobile" value={item.mobile || 'N/A'} color="text-indigo-700" />
                                    <DetailRow icon={<Mail />} label="Email" value={item.email || 'N/A'} color="text-indigo-700" />
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl text-sm font-bold shadow-sm hover:bg-gray-50 transition-all active:scale-95"
                    >
                        Close Details
                    </button>
                </div>
            </div>
        </div>
    );
}

function DetailRow({ icon, label, value, color = "text-gray-700" }) {
    return (
        <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-gray-400 flex items-center gap-2 uppercase tracking-tight">
                <span className="opacity-70">{icon && React.cloneElement(icon, { size: 14 })}</span> {label}
            </span>
            <span className={`text-sm font-bold ${color}`}>{value || 'N/A'}</span>
        </div>
    );
}

import React from 'react';

import React, { useState } from 'react';
import { X, Info, MapPin, Cpu, Calendar, Clock, User, Phone, Mail, Tag, Droplet } from 'lucide-react';
import EngineerAssignmentModal from './EngineerAssignmentModal';
import SupportModal from './SupportModal';
import { useSupport } from '../../context/SupportContext';

export default function AlertIssueDetailsModal({ item, onClose, setActivePage }) {
    const { updateTicket } = useSupport();
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [showSupportModal, setShowSupportModal] = useState(false);
    const [description, setDescription] = useState(item.message || item.description || "");
    const [currentStatus, setCurrentStatus] = useState(item.status || "Active");

    const currentUserRole = sessionStorage.getItem('userRole') || 'Admin';
    const ticketUserRole = item.role || item.userRole || 'User';

    if (!item) return null;

    const handleAssign = (engineerName) => {
        setCurrentStatus("Processing");
        // updateTicket is called inside EngineerAssignmentModal now
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={onClose}></div>

            {/* Modal */}
            <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden animate-in fade-in zoom-in duration-300 flex flex-col">
                {/* Header */}
                <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
                    <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-2xl ${item.severity === 'Critical' || item.type === 'error' ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'}`}>
                            <Tag size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 leading-tight">Detailed Alert View</h2>
                            <p className="text-sm font-medium text-gray-500 mt-0.5 uppercase tracking-wider">
                                {item.name || item.title} • {item.id || 'ALT-002'}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-xl text-gray-400 hover:text-gray-600 transition-all"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar bg-slate-50/20">

                    {/* Section 1 - User Information */}
                    <section className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/30 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                        <div className="flex items-center gap-3 mb-6 border-b border-gray-50 pb-4 relative z-10">
                            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg shadow-sm">
                                <User size={18} />
                            </div>
                            <div>
                                <h3 className="text-sm font-black text-gray-800 uppercase tracking-widest">Section 1: User Information</h3>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter -mt-0.5">Contact & Location Details</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-12 relative z-10">
                            <DetailItem label="User Name" icon={<User size={14} />} value={item.userName || item.name || "Raj Sharma"} />
                            <DetailItem label="Mobile Number" icon={<Phone size={14} />} value={item.mobile || "9876543210"} />
                            <DetailItem label="Email Address" icon={<Mail size={14} />} value={item.email || "raj@email.com"} />
                            <DetailItem label="Location" icon={<MapPin size={14} />} value={item.location || "Kitchen"} />
                            <DetailItem label="User Type" icon={<Tag size={14} />} value={ticketUserRole} />
                        </div>
                    </section>

                    {/* Section 2 - Ticket Information */}
                    <section className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50/30 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                        <div className="flex items-center gap-3 mb-6 border-b border-gray-50 pb-4 relative z-10">
                            <div className="p-2 bg-orange-50 text-orange-600 rounded-lg shadow-sm">
                                <Tag size={18} />
                            </div>
                            <div>
                                <h3 className="text-sm font-black text-gray-800 uppercase tracking-widest">Section 2: Ticket Information</h3>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter -mt-0.5">Issue specifics & Device Logs</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-12 mb-8 relative z-10">
                            <DetailItem label="Ticket ID" value={item.ticketId || item.id || "da1"} />
                            <DetailItem label="Date Raised" icon={<Calendar size={14} />} value={item.date || item.timestamp || "23 Feb 2026"} />
                            <DetailItem label="Request Type" value="System Alert" />
                            <DetailItem label="Status" value={currentStatus} isStatus />
                            <DetailItem label="Source" icon={<Droplet size={14} />} value={item.source || item.category || "Water"} />
                            {!(item.role || item.userRole)?.toLowerCase()?.includes('domestic') && (
                                <DetailItem label="Device/Meter" icon={<Cpu size={14} />} value={item.device || item.deviceName || "WM-Res-01"} />
                            )}
                        </div>

                        {/* Issue Name & Description */}
                        <div className="space-y-6 pt-6 border-t border-gray-50 relative z-10">
                            <div>
                                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Issue Name</h4>
                                <div className="flex items-center gap-3 text-sm font-bold text-gray-900 bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
                                    <Info size={16} className="text-orange-500" />
                                    {item.name || item.title || "Water Leakage Detected"}
                                </div>
                            </div>
                            <div>
                                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Description</h4>
                                <textarea
                                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-medium text-gray-700 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all min-h-[140px] resize-none shadow-inner"
                                    placeholder="Update issue or alert details here"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                                <div className="flex items-center gap-2 mt-2 ml-1">
                                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                                    <p className="text-[10px] text-gray-400 font-medium">* Multi-line description is editable for management notes.</p>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Footer with Role Based Actions */}
                <div className="p-6 bg-white border-t border-gray-100 flex flex-wrap gap-4 justify-between items-center sticky bottom-0 z-10">
                    <div className="flex gap-3">
                        {currentUserRole === 'Admin' || currentUserRole === 'Super Admin' ? (
                            <button
                                onClick={() => setShowAssignModal(true)}
                                className="px-8 py-3.5 bg-indigo-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-[0.98] flex items-center gap-3 transform"
                            >
                                <User size={18} />
                                Assign Support Engineer
                            </button>
                        ) : (
                            <button
                                onClick={() => setShowSupportModal(true)}
                                className="px-8 py-3.5 bg-orange-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl shadow-orange-100 hover:bg-orange-700 transition-all active:scale-[0.98] flex items-center gap-3 transform"
                            >
                                <Tag size={18} />
                                Raise Support Ticket
                            </button>
                        )}
                    </div>
                    <button
                        onClick={onClose}
                        className="px-8 py-3.5 bg-white border border-gray-200 text-gray-700 rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-sm hover:bg-gray-50 transition-all active:scale-[0.98] transform"
                    >
                        Close Details
                    </button>
                </div>
            </div>

            {showAssignModal && (
                <EngineerAssignmentModal
                    onClose={() => setShowAssignModal(false)}
                    alertName={item.name || item.title}
                    onAssign={handleAssign}
                    ticketId={item.id}
                />
            )}

            {showSupportModal && (
                <SupportModal
                    onClose={() => setShowSupportModal(false)}
                    editItem={{ ...item, description }}
                    setActivePage={setActivePage}
                />
            )}
        </div>
    );
}

function DetailItem({ label, value, isStatus, icon }) {
    return (
        <div className="flex flex-col gap-2 group">
            <div className="flex items-center gap-1.5">
                {icon && <span className="text-gray-400 group-hover:text-indigo-500 transition-colors">{icon}</span>}
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{label}</span>
            </div>
            {isStatus ? (
                <div className="flex">
                    <span className={`px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest border shadow-sm
                        ${value === 'Resolved' || value === 'Success' ? 'bg-emerald-50 text-emerald-600 border-emerald-100 shadow-emerald-50' :
                            value === 'Processing' ? 'bg-blue-50 text-blue-600 border-blue-100 shadow-blue-50' :
                                'bg-amber-50 text-amber-600 border-amber-100 shadow-amber-50'}
                    `}>
                        {value}
                    </span>
                </div>
            ) : (
                <span className="text-sm font-bold text-gray-800 break-words tracking-tight pl-0.5">{value || 'N/A'}</span>
            )}
        </div>
    );
}

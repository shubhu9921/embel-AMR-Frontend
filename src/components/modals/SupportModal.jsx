import React, { useState, useEffect, useRef } from 'react';
import { X, Send, HelpCircle, AlertCircle, FileText, Cpu, Gauge, CreditCard, Layout, MoreHorizontal, User, Phone, Mail, MapPin, ShieldCheck, Briefcase, CheckCircle } from 'lucide-react';
import { ISSUE_TYPES } from '../../data/supportData';
import { SUPPORT_ENGINEERS } from '../../data/mockData';
import { useSupport } from '../../context/SupportContext';

export default function SupportModal({ onClose, userDetails = { name: 'User', id: 'User1' }, editItem = null, setActivePage = () => { } }) {
    const { addTicket, updateTicket, assignEngineer, TICKET_STATUS } = useSupport();
    const userRole = sessionStorage.getItem('userRole') || 'Industrial';
    const isSuperAdmin = userRole === 'Super Admin' || userRole === 'Admin';

    // Auto-detect User Type
    const getUserTypeDisplay = (item) => {
        if (!item) return userRole === 'Domestic' ? 'Domestic User' : userRole === 'Industrial' ? 'Industrial User' : 'Admin';
        if (item.role === 'Domestic') return 'Domestic User';
        if (item.role === 'Industrial') return 'Industrial User';
        return 'Admin';
    };

    const isEdit = !!editItem?.id;

    // Auto-fill logic based on role
    const userData = {
        name: isEdit ? (editItem.userName || editItem.user || 'N/A') : (sessionStorage.getItem('userName') || 'N/A'),
        mobile: isEdit ? (editItem.mobile || 'N/A') : (sessionStorage.getItem('userPhone') || '9876543210'),
        email: isEdit ? (editItem.email || 'N/A') : (sessionStorage.getItem('userEmail') || 'user@example.com'),
        location: isEdit ? (editItem.location || 'N/A') : (sessionStorage.getItem('userLocation') || 'Main Plant'),
        type: getUserTypeDisplay(isEdit ? editItem : null)
    };

    const [formData, setFormData] = useState({
        requestType: editItem?.requestType || ((editItem?.type || '').toLowerCase() === 'alert' ? 'Alert' : 'Issue'),
        issueType: editItem?.type || 'Devices',
        title: editItem?.name || '',
        description: editItem?.description || '',
        source: editItem?.source || 'Energy',
        deviceId: editItem?.deviceName || '',
    });

    const [formError, setFormError] = useState('');

    const [selectedEngineer, setSelectedEngineer] = useState(
        SUPPORT_ENGINEERS.find(e => e.name === editItem?.assignedEngineer) || null
    );
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const timersRef = useRef([]);

    useEffect(() => {
        const timers = timersRef.current;
        return () => timers.forEach(clearTimeout);
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.description.trim()) {
            setFormError('Please enter description');
            return;
        }

        if (!isEdit && (!formData.title.trim() || !formData.deviceId.trim())) {
            setFormError('Please fill all required fields');
            return;
        }

        setFormError('');
        setIsSubmitting(true);

        const timer1 = setTimeout(() => {
            const ticketData = {
                ...formData,
                name: formData.title,
                deviceName: formData.deviceId,
                username: sessionStorage.getItem('userName') || userData.name,
                userName: userData.name,
                email: userData.email,
                mobile: userData.mobile,
                location: userData.location,
                role: userRole,
                type: formData.requestType.toLowerCase(), // Save in lowercase as per new model
                status: editItem?.status || TICKET_STATUS.PENDING
            };

            if (editItem) {
                updateTicket(editItem.id, ticketData);
                if (isSuperAdmin && selectedEngineer) {
                    assignEngineer(editItem.id, selectedEngineer.name);
                }
            } else {
                addTicket(ticketData);
            }

            setIsSubmitting(false);
            setIsSuccess(true);

            const timer2 = setTimeout(() => {
                if (!isSuperAdmin) {
                    if (formData.requestType.toLowerCase() === 'alert') {
                        setActivePage('Alerts'); // Redirect to specific list
                    } else if (formData.requestType.toLowerCase() === 'issue') {
                        setActivePage('Issues');
                    } else {
                        setActivePage('Support');
                    }
                }
                onClose();
            }, 2000);
            timersRef.current.push(timer2);
        }, 1500);
        timersRef.current.push(timer1);
    };

    const StatusBadge = ({ status }) => {
        const styles = {
            'Resolved': 'bg-emerald-50 text-emerald-700 border-emerald-100',
            'Processing': 'bg-blue-50 text-blue-700 border-blue-100',
            'Active': 'bg-amber-50 text-amber-700 border-amber-100',
            'Pending': 'bg-gray-50 text-gray-700 border-gray-100'
        };
        return (
            <span className={`px-2.5 py-1 rounded-lg border text-[10px] font-black uppercase tracking-wider ${styles[status] || styles.Pending}`}>
                {status}
            </span>
        );
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-2xl overflow-hidden border border-white/20 animate-in zoom-in-95 duration-300">

                {/* Header */}
                <div className="bg-gradient-to-r from-indigo-600 to-purple-700 p-6 text-white relative">
                    <button
                        onClick={onClose}
                        className="absolute right-4 top-4 p-2 hover:bg-white/20 rounded-full transition-colors"
                    >
                        <X size={20} />
                    </button>
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
                            {isSuperAdmin ? <ShieldCheck size={28} /> : <HelpCircle size={28} />}
                        </div>
                        <div>
                            <h2 className="text-xl font-black tracking-tight">
                                {isSuperAdmin ? 'View & Assign Support Engineer' : (editItem?.id ? 'Edit Support Ticket' : 'Raise Support Request')}
                            </h2>
                            <p className="text-indigo-100 text-xs font-bold uppercase tracking-wider opacity-80">
                                {editItem?.id ? `Ticket #${editItem.id}` : "Support Management System"}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="p-8 max-h-[85vh] overflow-y-auto custom-scrollbar">
                    {isSuccess ? (
                        <div className="py-12 flex flex-col items-center text-center animate-in zoom-in-95 duration-500">
                            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-emerald-100">
                                <CheckCircle size={40} />
                            </div>
                            <h3 className="text-2xl font-black text-gray-900 mb-2">
                                {isSuperAdmin ? 'Engineer Assigned Successfully!' : (editItem?.id ? 'Ticket Updated!' : 'Ticket Raised!')}
                            </h3>
                            <p className="text-gray-500 font-medium max-w-xs">
                                {isSuperAdmin ? 'The ticket status has been updated to Processing.' : `Routing to your ${formData.requestType}s...`}
                            </p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">

                            {/* USER INFORMATION SECTION (Read-Only) */}
                            <div className="space-y-3">
                                <h3 className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] flex items-center gap-2">
                                    <User size={14} /> User Information
                                </h3>
                                <div className="bg-gray-50 p-5 rounded-3xl border border-gray-100 grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-6">
                                    <div className="space-y-1">
                                        <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">User Name</label>
                                        <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-xl border border-gray-100 text-xs font-bold text-gray-700 shadow-sm">
                                            <User size={12} className="text-gray-400" /> {userData.name}
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Mobile Number</label>
                                        <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-xl border border-gray-100 text-xs font-bold text-gray-700 shadow-sm">
                                            <Phone size={12} className="text-gray-400" /> {userData.mobile}
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                                        <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-xl border border-gray-100 text-xs font-bold text-gray-700 shadow-sm overflow-hidden">
                                            <Mail size={12} className="text-gray-400 flex-shrink-0" /> <span className="truncate">{userData.email}</span>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Location</label>
                                        <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-xl border border-gray-100 text-xs font-bold text-gray-700 shadow-sm">
                                            <MapPin size={12} className="text-gray-400" /> {userData.location}
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">User Type</label>
                                        <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-xl border border-gray-100 text-xs font-bold text-indigo-600 shadow-sm">
                                            <ShieldCheck size={12} className="text-indigo-400" /> {userData.type}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* TICKET INFORMATION SECTION */}
                            <div className="space-y-3">
                                <h3 className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] flex items-center gap-2">
                                    <FileText size={14} /> Ticket Information
                                </h3>
                                <div className="bg-gray-50 p-5 rounded-3xl border border-gray-100 space-y-4">
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Ticket ID</label>
                                            <div className="px-3 py-2 bg-gray-50 rounded-xl border border-gray-100 text-xs font-bold text-gray-500 shadow-sm opacity-70">
                                                {editItem?.id || 'New'}
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Date Raised</label>
                                            <div className="px-3 py-2 bg-gray-50 rounded-xl border border-gray-100 text-xs font-bold text-gray-500 shadow-sm opacity-70">
                                                {editItem?.date || new Date().toISOString().split('T')[0]}
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Request Type</label>
                                            {isEdit ? (
                                                <div className="px-3 py-2 bg-gray-50 rounded-xl border border-gray-100 text-xs font-black text-indigo-400 uppercase shadow-sm opacity-70">
                                                    {formData.requestType}
                                                </div>
                                            ) : (
                                                <select
                                                    value={formData.requestType}
                                                    onChange={(e) => setFormData({ ...formData, requestType: e.target.value })}
                                                    className="w-full px-3 py-2 bg-white rounded-xl border border-gray-200 text-xs font-bold text-indigo-600 outline-none focus:ring-2 focus:ring-indigo-500/20"
                                                >
                                                    <option value="Issue">Issue</option>
                                                    <option value="Alert">Alert</option>
                                                </select>
                                            )}
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Status</label>
                                            <div className="py-1">
                                                <StatusBadge status={editItem?.status || 'Pending'} />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Source</label>
                                            {isEdit ? (
                                                <div className="px-3 py-2 bg-gray-50 rounded-xl border border-gray-100 text-xs font-bold text-gray-500 shadow-sm opacity-70">
                                                    {formData.source}
                                                </div>
                                            ) : (
                                                <select
                                                    value={formData.source}
                                                    onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                                                    className="w-full px-3 py-2 bg-white rounded-xl border border-gray-200 text-xs font-bold text-gray-700 outline-none focus:ring-2 focus:ring-indigo-500/20"
                                                >
                                                    <option value="Energy">Energy</option>
                                                    <option value="Water">Water</option>
                                                    <option value="Gas">Gas</option>
                                                    <option value="Solar">Solar</option>
                                                    <option value="Other">Other</option>
                                                </select>
                                            )}
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Device/Meter</label>
                                            {isEdit ? (
                                                <div className="px-3 py-2 bg-gray-50 rounded-xl border border-gray-100 text-xs font-bold text-gray-500 shadow-sm opacity-70 truncate">
                                                    {formData.deviceId}
                                                </div>
                                            ) : (
                                                <input
                                                    type="text"
                                                    value={formData.deviceId}
                                                    onChange={(e) => setFormData({ ...formData, deviceId: e.target.value })}
                                                    placeholder="Enter Device ID"
                                                    className="w-full px-3 py-2 bg-white rounded-xl border border-gray-200 text-xs font-bold text-gray-700 outline-none focus:ring-2 focus:ring-indigo-500/20"
                                                />
                                            )}
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Issue Name</label>
                                            <input
                                                type="text"
                                                value={formData.title}
                                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                                placeholder="Enter title"
                                                disabled={isSuperAdmin}
                                                className={`w-full px-3 py-2 rounded-xl border text-xs font-bold outline-none transition-all
                                                    ${isSuperAdmin ? 'bg-gray-50 border-gray-100 text-gray-500 opacity-70' : 'bg-white border-gray-200 text-gray-700 focus:ring-2 focus:ring-indigo-500/20'}`}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <div className="flex items-center justify-between ml-1">
                                            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Description</label>
                                            {formError && formData.description.trim() === '' && <span className="text-[9px] font-bold text-red-500 animate-pulse">{formError}</span>}
                                        </div>
                                        <textarea
                                            value={formData.description}
                                            onChange={(e) => {
                                                setFormData({ ...formData, description: e.target.value });
                                                if (formError && e.target.value.trim()) setFormError('');
                                            }}
                                            disabled={isSuperAdmin}
                                            placeholder={isEdit ? "Update issue or alert details here" : "Describe the problem in detail (device behavior, errors, leakage, damage, etc.)"}
                                            rows={4}
                                            className={`w-full px-4 py-3 rounded-2xl border text-xs font-medium leading-relaxed shadow-sm transition-all outline-none focus:ring-4 placeholder:text-gray-400 resize-none custom-scrollbar
                                                ${isSuperAdmin ? 'bg-gray-50 border-gray-100 text-gray-500 opacity-70' :
                                                    formError && !formData.description.trim() ? 'bg-red-50/30 border-red-200 focus:ring-red-500/10 focus:border-red-500' :
                                                        'bg-white border-gray-100 focus:ring-indigo-500/10 focus:border-indigo-500 text-gray-700'}`}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* SUPPORT ENGINEER ASSIGNMENT SECTION */}
                            {isSuperAdmin && (
                                <div className="space-y-3 pt-2">
                                    <h3 className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] flex items-center gap-2">
                                        <Briefcase size={14} /> Assign Support Engineer
                                    </h3>

                                    <div className="bg-indigo-50/50 p-6 rounded-[32px] border-2 border-indigo-100 space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-wider ml-1">Select Engineer</label>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                {SUPPORT_ENGINEERS.map((eng) => (
                                                    <button
                                                        key={eng.id}
                                                        type="button"
                                                        onClick={() => setSelectedEngineer(eng)}
                                                        className={`flex items-center gap-3 p-3 rounded-2xl border-2 transition-all text-left ${selectedEngineer?.id === eng.id
                                                            ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg'
                                                            : 'bg-white border-gray-100 text-gray-600 hover:border-indigo-300'}`}
                                                    >
                                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold ${selectedEngineer?.id === eng.id ? 'bg-white/20' : 'bg-indigo-50 text-indigo-600'}`}>
                                                            {eng.name.split(' ').map(n => n[0]).join('')}
                                                        </div>
                                                        <div>
                                                            <div className={`text-xs font-black ${selectedEngineer?.id === eng.id ? 'text-white' : 'text-gray-900'}`}>{eng.name}</div>
                                                            <div className={`text-[10px] font-bold opacity-70`}>{eng.specialization}</div>
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {selectedEngineer && (
                                            <div className="bg-white p-4 rounded-2xl border border-indigo-100 shadow-sm space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Selected Engineer Details</span>
                                                    <StatusBadge status="Available" />
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="flex items-center gap-2 text-xs font-bold text-gray-700">
                                                        <Mail size={14} className="text-gray-400" /> {selectedEngineer.email}
                                                    </div>
                                                    <div className="flex items-center gap-2 text-xs font-bold text-gray-700">
                                                        <Phone size={14} className="text-gray-400" /> {selectedEngineer.phone}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Actions */}
                            <div className="flex gap-4 pt-4 border-t border-gray-100">
                                {isSuperAdmin ? (
                                    <>
                                        <button
                                            type="button"
                                            onClick={onClose}
                                            className="flex-1 py-4 rounded-[20px] bg-gray-100 text-gray-500 font-black uppercase tracking-widest text-xs transition-all active:scale-[0.98] hover:bg-gray-200"
                                        >
                                            Close
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isSubmitting || !selectedEngineer}
                                            className={`flex-[2] py-4 rounded-[20px] text-white font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 shadow-xl transition-all active:scale-[0.98] 
                                                ${(isSubmitting || !selectedEngineer) ? 'bg-indigo-400 cursor-not-allowed' : 'bg-gradient-to-r from-indigo-600 to-purple-700 hover:shadow-indigo-500/30'}`}
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                    Assigning...
                                                </>
                                            ) : (
                                                <>
                                                    <Briefcase size={16} />
                                                    {editItem?.assignedEngineer ? 'Reassign Engineer' : 'Assign Engineer'}
                                                </>
                                            )}
                                        </button>
                                    </>
                                ) : (
                                    <div className="w-full flex gap-4">
                                        <button
                                            type="button"
                                            onClick={onClose}
                                            className="flex-1 py-4 rounded-[20px] bg-gray-100 text-gray-500 font-black uppercase tracking-widest text-xs transition-all active:scale-[0.98] hover:bg-gray-200"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className={`flex-[2] py-4 rounded-[20px] text-white font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 shadow-xl transition-all active:scale-[0.98] ${isSubmitting ? 'bg-indigo-400 cursor-not-allowed' : 'bg-gradient-to-r from-indigo-600 to-purple-700 hover:shadow-indigo-500/30'}`}
                                        >
                                            {isSubmitting ? (
                                                <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>Processing...</>
                                            ) : (
                                                <><Send size={16} />{editItem?.id ? 'Update Ticket' : 'Submit Support Ticket'}</>
                                            )}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}

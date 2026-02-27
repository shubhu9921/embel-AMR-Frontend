import React from 'react';
import {
    X, Cpu, MapPin, Hash, Zap, Clock, Info, CheckCircle,
    XCircle, AlertCircle, Edit, Activity, Tag, Droplet, Flame, Sun
} from 'lucide-react';

export default function DeviceDetailsModal({ isOpen, onClose, item, type, onEdit }) {
    if (!isOpen || !item) return null;

    const isMeter = type === 'meter';

    // Determine icon and color based on type
    const getTheme = () => {
        if (isMeter) {
            switch (item.meterType?.toUpperCase()) {
                case 'ELECTRIC': return { icon: Zap, color: 'text-purple-600', bg: 'bg-purple-100', border: 'border-purple-200' };
                case 'WATER': return { icon: Droplet, color: 'text-blue-600', bg: 'bg-blue-100', border: 'border-blue-200' };
                case 'GAS': return { icon: Flame, color: 'text-orange-600', bg: 'bg-orange-100', border: 'border-orange-200' };
                case 'SOLAR': return { icon: Sun, color: 'text-amber-600', bg: 'bg-amber-100', border: 'border-amber-200' };
                default: return { icon: Activity, color: 'text-gray-600', bg: 'bg-gray-100', border: 'border-gray-200' };
            }
        }
        return { icon: Cpu, color: 'text-indigo-600', bg: 'bg-indigo-100', border: 'border-indigo-200' };
    };

    const statusObj = {
        Active: { text: "Active", icon: CheckCircle, class: "bg-emerald-100 text-emerald-700 border-emerald-200" },
        Inactive: { text: "Inactive", icon: XCircle, class: "bg-rose-100 text-rose-700 border-rose-200" },
        Warning: { text: "Warning", icon: AlertCircle, class: "bg-amber-100 text-amber-700 border-amber-200" },
        Default: { text: item.status || "Unknown", icon: Info, class: "bg-gray-100 text-gray-700 border-gray-200" }
    };

    const currentStatus = statusObj[item.status] || statusObj.Default;
    const StatusIcon = currentStatus.icon;
    const ThemeIcon = getTheme().icon;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div
                className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className={`p-6 border-b flex items-start justify-between relative overflow-hidden bg-gray-50/50`}>
                    <div className="flex items-center gap-4 relative z-10">
                        <div className={`p-3 rounded-2xl ${getTheme().bg} ${getTheme().color} shadow-inner`}>
                            <ThemeIcon size={28} />
                        </div>
                        <div>
                            <div className="flex items-center gap-3">
                                <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                                    {isMeter ? item.meterName : item.deviceName}
                                </h2>
                                <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${currentStatus.class}`}>
                                    <StatusIcon size={14} />
                                    {currentStatus.text}
                                </span>
                            </div>
                            <p className="text-sm font-medium text-gray-500 mt-1 flex items-center gap-2">
                                <Tag size={14} /> {isMeter ? 'Meter' : 'Device'} Details
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white rounded-xl transition-all shadow-sm relative z-10"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[60vh] custom-scrollbar">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        {/* Core Information */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest border-b pb-2">Core Info</h3>

                            <div className="bg-gray-50 rounded-2xl p-4 space-y-3 border border-gray-100">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-gray-500 flex items-center gap-2"><Hash size={16} /> ID</span>
                                    <span className="text-sm font-bold text-gray-900">{isMeter ? item.meterId : item.deviceId}</span>
                                </div>

                                {isMeter && (
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-gray-500 flex items-center gap-2"><Activity size={16} /> Type</span>
                                        <span className={`text-xs font-bold px-2 py-0.5 rounded border ${getTheme().color} ${getTheme().bg} ${getTheme().border}`}>
                                            {item.meterType?.toUpperCase()}
                                        </span>
                                    </div>
                                )}

                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-gray-500 flex items-center gap-2"><MapPin size={16} /> Location</span>
                                    <span className="text-sm font-bold text-gray-900">{isMeter ? item.meterLocation : item.location}</span>
                                </div>
                            </div>
                        </div>

                        {/* Assignment & Specs */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest border-b pb-2">Assignment</h3>

                            <div className="bg-gray-50 rounded-2xl p-4 space-y-3 border border-gray-100">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-gray-500">Admin</span>
                                    <span className="text-sm font-bold text-gray-900">{item.admin || 'Unassigned'}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-gray-500">
                                        {item.application === 'Industrial' ? 'Industrial User' : (item.application === 'Commercial' ? 'Commercial User' : 'Domestic User')}
                                    </span>
                                    <span className="text-sm font-bold text-gray-900">{item.user || item.industryUser || 'Unassigned'}</span>
                                </div>
                            </div>
                        </div>

                        {/* Extra Details / Parameters */}
                        <div className="md:col-span-2 space-y-4 pt-2">
                            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest border-b pb-2">Parameters & Configuration</h3>

                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                                {/* Iterate through specific known keys if they exist */}
                                {[
                                    { label: 'MAC ID', value: item.mac || item.macId },
                                    { label: 'Serial No', value: item.serialNumber },
                                    { label: 'Tech Type', value: item.type },
                                    { label: 'Bill Type', value: item.billType },
                                    { label: 'Wakeup Time', value: item.wakeupTime },
                                    { label: 'Sample Count', value: item.sampleCount },
                                    { label: 'Liter / Pulse', value: item.literPerPulse, show: isMeter },
                                    { label: 'Diameter', value: item.diameter, show: isMeter },
                                    { label: 'Application', value: item.application },
                                    { label: 'Device Type', value: item.typeInfo },
                                    { label: 'Customer Name', value: item.customerName },
                                    { label: 'State', value: item.state },
                                    { label: 'City', value: item.city },
                                    { label: 'Area', value: item.area },
                                    { label: 'Zone', value: item.zone },
                                    { label: 'Building/Wing', value: item.building },
                                    { label: 'Start Reading', value: item.startReading }
                                ].map((param, idx) => {
                                    if (param.show === false || !param.value) return null;
                                    return (
                                        <div key={idx} className="bg-gray-50 rounded-xl p-3 border border-gray-100 flex flex-col justify-center">
                                            <span className="block text-[11px] font-bold text-gray-500 mb-0.5 uppercase tracking-wider">{param.label}</span>
                                            <span className="block text-sm font-black text-gray-900 truncate">{param.value}</span>
                                        </div>
                                    );
                                })}

                                <div className="bg-gray-50 rounded-xl p-3 border border-gray-100 flex flex-col justify-center">
                                    <span className="block text-[11px] font-bold text-gray-500 mb-0.5 uppercase tracking-wider flex items-center gap-1"><Clock size={10} /> Added</span>
                                    <span className="block text-sm font-black text-gray-900 truncate">{item.createdAt || 'N/A'}</span>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-4 border-t bg-gray-50 flex justify-end gap-3 rounded-b-3xl">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 rounded-xl font-bold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                        Close
                    </button>
                    {onEdit && (
                        <button
                            onClick={() => {
                                onClose();
                                onEdit(item);
                            }}
                            className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-500/20 transition-all active:scale-95"
                        >
                            <Edit size={16} /> Update {isMeter ? 'Meter' : 'Device'}
                        </button>
                    )}
                </div>

            </div>
        </div>
    );
}

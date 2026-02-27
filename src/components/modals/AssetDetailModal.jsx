import React, { useState } from 'react';
import { X, Activity, Hash, MapPin, Zap, Battery, Signal, User, Droplets, Info, Calendar } from 'lucide-react';

export default function AssetDetailModal({ isOpen, onClose, meter, colorClass = "text-blue-600" }) {
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');

    if (!isOpen || !meter) return null;

    const isOnline = meter.status === 'active';
    const today = new Date().toISOString().split('T')[0];

    const handleGenerateReport = () => {
        if (!fromDate || !toDate) {
            alert("Please select both From and To dates to generate a report.");
            return;
        }
        if (fromDate > toDate) {
            alert("From Date cannot be later than To Date.");
            return;
        }
        alert(`Generating report for ${meter.deviceName || meter.name} from ${fromDate} to ${toDate}`);
        // Here you would typically trigger the report API or downloading logic
    };

    const techParams = [
        { label: 'Current Reading', value: `${meter.currentFlow || '0.0'} ${meter.flowUnit || 'Unit'}`, icon: Zap },
        { label: 'Daily Consumption', value: meter.dailyConsumption || '0', icon: Activity },
        { label: 'Battery Level', value: meter.battery || '100%', icon: Battery },
        { label: 'Signal Strength', value: meter.signal || '-65 dBm', icon: Signal },
    ];

    const customerInfo = [
        { label: 'Proprietor/User', value: meter.user || meter.customerName || 'N/A', icon: User },
        { label: 'Address', value: meter.location || meter.customerAddress || 'N/A', icon: MapPin },
        { label: 'Asset Type', value: meter.meterType || meter.type || 'N/A', icon: Droplets },
        { label: 'Meter ID', value: meter.deviceId || meter.id || 'N/A', icon: Hash },
    ];

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl flex flex-col overflow-hidden transform animate-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0">
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-xl bg-gray-50 ${colorClass}`}>
                            <Info size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">{meter.deviceName || meter.name}</h2>
                            <p className="text-xs text-gray-400 font-mono">{meter.deviceId || meter.id}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${isOnline ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-700 border-red-100'
                            }`}>
                            <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${isOnline ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></span>
                            {meter.status}
                        </span>
                        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors">
                            <X size={24} />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[70vh]">
                    {/* Technical Specs */}
                    <div className="mb-8">
                        <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Technical Parameters</h3>
                        <div className="grid grid-cols-2 gap-4">
                            {techParams.map((param, idx) => (
                                <div key={idx} className="bg-slate-50 border border-gray-100 p-4 rounded-2xl group hover:border-blue-200 hover:bg-white transition-all shadow-sm">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-[10px] text-gray-500 font-bold uppercase">{param.label}</span>
                                        <param.icon size={14} className="text-gray-400 group-hover:text-blue-500" />
                                    </div>
                                    <p className="text-lg font-mono font-bold text-gray-900">{param.value}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Customer Info */}
                    <div>
                        <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Customer & Asset Details</h3>
                        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden divide-y divide-gray-50 shadow-sm">
                            {customerInfo.map((info, idx) => (
                                <div key={idx} className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="p-1.5 bg-gray-50 text-gray-400 rounded-lg">
                                            <info.icon size={14} />
                                        </div>
                                        <span className="text-xs font-semibold text-gray-500">{info.label}</span>
                                    </div>
                                    <span className="text-sm font-bold text-gray-900 text-right max-w-[200px] truncate">{info.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer Actions with Report Generation */}
                <div className="p-4 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-b-3xl">

                    {/* Date Filters */}
                    <div className="flex items-center gap-3 w-full sm:w-auto bg-white p-2 rounded-xl border border-gray-200">
                        <div className="flex items-center gap-2">
                            <Calendar size={14} className="text-gray-400 ml-1" />
                            <input
                                type="date"
                                value={fromDate}
                                max={today}
                                onChange={(e) => setFromDate(e.target.value)}
                                className="text-xs font-medium text-gray-700 outline-none bg-transparent"
                            />
                        </div>
                        <span className="text-gray-300">to</span>
                        <div className="flex items-center gap-2">
                            <input
                                type="date"
                                value={toDate}
                                max={today}
                                onChange={(e) => setToDate(e.target.value)}
                                className="text-xs font-medium text-gray-700 outline-none bg-transparent"
                            />
                        </div>
                    </div>

                    <div className="flex gap-3 w-full sm:w-auto">
                        <button onClick={onClose} className="flex-1 sm:flex-none px-6 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl text-sm font-bold hover:bg-gray-100 transition-colors">
                            Close
                        </button>
                        <button
                            onClick={handleGenerateReport}
                            className={`flex-1 sm:flex-none px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-500/30 hover:bg-blue-700 transition-all active:scale-95`}
                        >
                            Generate Report
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

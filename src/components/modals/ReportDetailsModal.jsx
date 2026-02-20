import React from 'react';
import { X, Download, FileText, CheckCircle2, Clock, Calendar, Database, HardDrive } from 'lucide-react';

export default function ReportDetailsModal({ isOpen, onClose, report }) {
    if (!isOpen || !report) return null;

    const getStatusColor = (status) => {
        return status === 'Ready'
            ? 'bg-green-50 text-green-700 border-green-200'
            : 'bg-orange-50 text-orange-700 border-orange-200';
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200 border border-gray-100">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white border border-gray-200 rounded-lg shadow-sm">
                            <FileText className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-900 leading-tight">Report Details</h2>
                            <p className="text-xs text-gray-500 font-medium">#{report.id} • {report.type}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Main Info Card */}
                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                        <h3 className="text-sm font-bold text-gray-900 mb-1">{report.name}</h3>
                        <p className="text-xs text-gray-500 mb-3">{report.generated}</p>
                        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(report.status)}`}>
                            {report.status === 'Ready' && <CheckCircle2 className="w-3 h-3" />}
                            {report.status === 'Processing' && <Clock className="w-3 h-3 animate-spin" />}
                            {report.status}
                        </div>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2 text-gray-500 text-xs font-medium uppercase tracking-wide">
                                <Database size={12} /> Meter Type
                            </div>
                            <p className="text-sm font-bold text-gray-900">{report.meter}</p>
                        </div>
                        <div className="space-y-1">
                            <div className="flex items-center gap-2 text-gray-500 text-xs font-medium uppercase tracking-wide">
                                <Calendar size={12} /> Period
                            </div>
                            <p className="text-sm font-bold text-gray-900">{report.period}</p>
                        </div>
                        <div className="space-y-1">
                            <div className="flex items-center gap-2 text-gray-500 text-xs font-medium uppercase tracking-wide">
                                <HardDrive size={12} /> File Size
                            </div>
                            <p className="text-sm font-bold text-gray-900 font-mono">{report.size}</p>
                        </div>
                        <div className="space-y-1">
                            <div className="flex items-center gap-2 text-gray-500 text-xs font-medium uppercase tracking-wide">
                                <FileText size={12} /> Format
                            </div>
                            <p className="text-sm font-bold text-gray-900">PDF</p>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-2">
                        <button
                            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-500/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={report.status !== 'Ready'}
                        >
                            <Download size={18} />
                            Download Report
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

import React, { useState } from 'react';
import { X, Calendar, Download, Eye, FileText, CheckCircle, Loader2 } from 'lucide-react';

export default function OverallReportModal({ onClose }) {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [isGenerated, setIsGenerated] = useState(false);

    const todayStr = new Date().toISOString().split('T')[0];

    const handleGenerate = () => {
        if (!startDate || !endDate) {
            alert("Please select both start and end dates.");
            return;
        }
        setIsGenerating(true);
        setTimeout(() => {
            setIsGenerating(false);
            setIsGenerated(true);
        }, 1500);
    };

    const handleDownload = () => {
        // Mock download
        alert("Downloading Overall Report.pdf...");
    };

    const handlePreview = () => {
        // Mock preview
        alert("Opening Report Preview...");
    };

    return (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-[24px] w-full max-w-md shadow-2xl overflow-hidden flex flex-col transform transition-all animate-in fade-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gradient-to-br from-blue-50 to-indigo-50/50">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-white shadow-sm rounded-xl text-blue-600">
                            <FileText size={20} strokeWidth={2.5} />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-900 tracking-tight">Generate Report</h2>
                            <p className="text-xs text-gray-500 font-medium mt-0.5">Overall System Summary</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-black/5 rounded-full transition-colors text-gray-400 hover:text-gray-700"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    <div className="space-y-5 mb-8">
                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Start Date</label>
                            <div className="relative group">
                                <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={16} />
                                <input
                                    type="date"
                                    value={startDate}
                                    max={endDate || todayStr}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all outline-none"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">End Date</label>
                            <div className="relative group">
                                <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={16} />
                                <input
                                    type="date"
                                    value={endDate}
                                    min={startDate || undefined}
                                    max={todayStr}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Action Area */}
                    <div className="min-h-[60px] flex flex-col justify-end">
                        {!isGenerated ? (
                            <button
                                onClick={handleGenerate}
                                disabled={isGenerating || !startDate || !endDate}
                                className={`w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-300
                                    ${isGenerating || !startDate || !endDate
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg hover:-translate-y-0.5'
                                    }`}
                            >
                                {isGenerating ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
                                        <span className="text-gray-600 font-medium">Generating...</span>
                                    </>
                                ) : (
                                    "Generate Report"
                                )}
                            </button>
                        ) : (
                            <div className="space-y-4 animate-in slide-in-from-bottom-2 duration-300">
                                <div className="flex items-center justify-center gap-2 text-emerald-600 font-bold mb-4 bg-emerald-50/80 border border-emerald-100 py-2.5 rounded-xl">
                                    <CheckCircle size={18} className="text-emerald-500" />
                                    Report Generated Successfully!
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        onClick={handlePreview}
                                        className="flex items-center justify-center gap-2 py-3 bg-white border-2 border-gray-100 text-gray-700 rounded-xl text-sm font-bold hover:bg-gray-50 hover:border-gray-200 transition-all active:scale-95"
                                    >
                                        <Eye size={16} />
                                        Preview
                                    </button>
                                    <button
                                        onClick={handleDownload}
                                        className="flex items-center justify-center gap-2 py-3 bg-blue-600 text-white rounded-xl text-sm font-bold shadow-md hover:bg-blue-700 hover:shadow-lg transition-all active:scale-95 group"
                                    >
                                        <Download size={16} className="group-hover:-translate-y-0.5 transition-transform" />
                                        Download
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

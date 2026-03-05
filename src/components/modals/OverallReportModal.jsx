import React, { useState, useEffect } from 'react';
import { X, Calendar, Download, Eye, FileText, CheckCircle, Loader2, Gauge, Activity, User, AlertCircle } from 'lucide-react';
import { apiService } from '../../services/apiService';
import { useData } from '../../context/DataContext';

export default function OverallReportModal({ onClose, defaultSource = 'All', onGenerate }) {
    const { devices, meters, isLoading: isFetchingDevices } = useData();
    const availableDevices = React.useMemo(() => [...devices, ...meters], [devices, meters]);

    const [step, setStep] = useState(1); // 1: Select Period & Asset, 2: Preview
    const [reportName, setReportName] = useState('');
    const [selectedSource, setSelectedSource] = useState(defaultSource);
    const [reportType, setReportType] = useState('Overall'); // 'Overall' or 'Specific'

    const [startMonth, setStartMonth] = useState('January');
    const [startYear, setStartYear] = useState(new Date().getFullYear().toString());
    const [endMonth, setEndMonth] = useState(new Date().toLocaleString('default', { month: 'long' }));
    const [endYear, setEndYear] = useState(new Date().getFullYear().toString());

    const [selectedAssetId, setSelectedAssetId] = useState('');

    const [isGenerating, setIsGenerating] = useState(false);

    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const currentYearNum = new Date().getFullYear();
    const currentMonthIndex = new Date().getMonth();
    const years = Array.from({ length: currentYearNum - 2023 + 1 }, (_, i) => (2023 + i).toString());

    const userName = sessionStorage.getItem('userName') || 'User';
    const userRole = sessionStorage.getItem('userRole') || 'Industrial';
    const isSpecializedUser = userRole === 'Industrial' || userRole === 'Domestic' || userRole === 'Commercial';

    const [userCategory, setUserCategory] = useState(isSpecializedUser ? userRole : 'All');
    const filteredDevices = availableDevices.filter(d =>
        selectedSource === 'All' ? true : d.meterType?.toLowerCase() === selectedSource.toLowerCase()
    );

    const getDateValue = (month, year) => {
        return parseInt(year) * 12 + months.indexOf(month);
    };

    const isFutureDate = (month, year) => {
        const monthIndex = months.indexOf(month);
        const yearNum = parseInt(year);
        if (yearNum > currentYearNum) return true;
        if (yearNum === currentYearNum && monthIndex > currentMonthIndex) return true;
        return false;
    };

    const isInvalidRange = () => {
        const startVal = getDateValue(startMonth, startYear);
        const endVal = getDateValue(endMonth, endYear);
        return endVal < startVal || isFutureDate(endMonth, endYear);
    };

    const handleGenerate = () => {
        setStep(2);
    };

    const handleGenerateAction = () => {
        setIsGenerating(true);
        const reportData = {
            name: reportName || `${selectedSource} ${reportType} Report`,
            source: selectedSource,
            type: reportType,
            userCategory,
            startMonth,
            startYear,
            endMonth,
            endYear,
            asset: selectedAsset?.deviceName || selectedAssetId || 'All'
        };

        setTimeout(() => {
            if (onGenerate) onGenerate(reportData);
            setIsGenerating(false);
            alert("Report generated successfully!");
            onClose();
        }, 1500);
    };

    const selectedAsset = availableDevices.find(d => d.deviceId === selectedAssetId || d.id === selectedAssetId);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-lg overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-blue-100 text-blue-600 rounded-xl">
                            {step === 1 ? <FileText size={24} /> : <Eye size={24} />}
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">
                                {step === 1 ? 'Generate Report' : 'Report Preview'}
                            </h2>
                            <p className="text-sm font-medium text-gray-500">
                                {step === 1 ? 'Select period and parameters' : `${selectedSource} Usage Report`}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 overflow-y-auto max-h-[75vh]">
                    {step === 1 ? (
                        <div className="space-y-6">
                            {/* Report Name */}
                            <div className="animate-in slide-in-from-top-1 duration-300">
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-3">Report Name</label>
                                <div className="relative group">
                                    <FileText className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={16} />
                                    <input
                                        type="text"
                                        value={reportName}
                                        onChange={(e) => setReportName(e.target.value)}
                                        placeholder="Enter report name (e.g. Q1 Efficiency Review)"
                                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-gray-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                                    />
                                </div>
                            </div>

                            {/* Source Selection */}
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-3">Select Resource</label>
                                <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                                    {['All', 'Energy', 'Water', 'Gas', 'Solar'].filter(s => {
                                        if (userRole === 'Super Admin' || userRole === 'Admin') return true;
                                        if (defaultSource === 'All') return true;
                                        return s === defaultSource;
                                    }).map(source => (
                                        <button
                                            key={source}
                                            onClick={() => {
                                                setSelectedSource(source);
                                                setSelectedAssetId('');
                                            }}
                                            className={`py-2 px-1 flex flex-col items-center gap-1 rounded-xl border-2 transition-all duration-300 ${selectedSource === source
                                                ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-sm'
                                                : 'border-gray-100 hover:border-blue-200 hover:bg-blue-50/30 text-gray-500'
                                                }`}
                                        >
                                            <span className="text-[10px] font-black uppercase tracking-tighter">{source}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* User Category Selection */}
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-3">User Category</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {['All', 'Industrial', 'Domestic'].filter(cat => {
                                        if (userRole === 'Super Admin' || userRole === 'Admin') return true;
                                        return cat === userRole;
                                    }).map(cat => (
                                        <button
                                            key={cat}
                                            onClick={() => setUserCategory(cat)}
                                            className={`py-2 px-4 text-xs font-bold rounded-xl border-2 transition-all duration-300 ${userCategory === cat
                                                ? 'border-indigo-500 bg-indigo-50 text-indigo-700 shadow-sm'
                                                : 'border-gray-100 hover:border-indigo-200 hover:bg-indigo-50/30 text-gray-500'
                                                }`}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Report Type */}
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-3">Report Scope</label>
                                <div className="flex gap-2 p-1 bg-gray-50 border border-gray-200 rounded-2xl">
                                    {['Overall', 'Specific'].map((type) => (
                                        <button
                                            key={type}
                                            onClick={() => {
                                                setReportType(type);
                                                if (type === 'Overall') setSelectedAssetId('');
                                            }}
                                            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all duration-300 ${reportType === type ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'
                                                }`}
                                        >
                                            {type === 'Overall' ? `${selectedSource} Overall` : 'Device/Meter Specific'}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Asset Selection */}
                            {reportType === 'Specific' && (
                                <div className="animate-in slide-in-from-top-2 duration-300">
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-3">Select Asset</label>
                                    <div className="relative group">
                                        <Gauge className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={16} />
                                        <select
                                            value={selectedAssetId}
                                            onChange={(e) => setSelectedAssetId(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-gray-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                                        >
                                            <option value="">{isFetchingDevices ? 'Loading Assets...' : 'Choose Device/Meter...'}</option>
                                            {filteredDevices.map(d => (
                                                <option key={d.id} value={d.deviceId || d.id}>{d.deviceName || d.name} ({d.deviceId || d.id})</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            )}

                            {/* Date Selection */}
                            <div className="space-y-4 pt-2">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest">Start Month</label>
                                        <select
                                            value={startMonth}
                                            onChange={(e) => setStartMonth(e.target.value)}
                                            className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500/20 outline-none"
                                        >
                                            {months.map(m => (
                                                <option key={m} value={m}>{m}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest">Start Year</label>
                                        <select
                                            value={startYear}
                                            onChange={(e) => setStartYear(e.target.value)}
                                            className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500/20 outline-none"
                                        >
                                            {years.map(y => (
                                                <option key={y} value={y}>{y}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest">End Month</label>
                                        <select
                                            value={endMonth}
                                            onChange={(e) => setEndMonth(e.target.value)}
                                            className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500/20 outline-none"
                                        >
                                            {months.map(m => (
                                                <option key={m} value={m} disabled={isFutureDate(m, endYear)}>{m}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest">End Year</label>
                                        <select
                                            value={endYear}
                                            onChange={(e) => setEndYear(e.target.value)}
                                            className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500/20 outline-none"
                                        >
                                            {years.map(y => (
                                                <option key={y} value={y} disabled={parseInt(y) > currentYearNum}>{y}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {isInvalidRange() && (
                                <div className="bg-red-50 p-4 rounded-xl flex gap-3 text-red-700 border border-red-100 text-sm">
                                    <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                                    <p>
                                        {getDateValue(endMonth, endYear) < getDateValue(startMonth, startYear)
                                            ? "Ending date cannot be before starting date."
                                            : "Reports cannot be generated for future dates."}
                                    </p>
                                </div>
                            )}

                            <div className="bg-blue-50 p-4 rounded-xl space-y-2 border border-blue-100">
                                <div className="flex gap-3 text-blue-800 text-xs font-medium">
                                    <User size={14} className="shrink-0" />
                                    <span>Generating for: <strong>{userName} ({userRole})</strong> | Category: <strong>{userCategory}</strong></span>
                                </div>
                                <div className="flex gap-3 text-blue-800 text-xs font-medium">
                                    <Calendar size={14} className="shrink-0" />
                                    <span>Period: <strong>{startMonth} {startYear} - {endMonth} {endYear}</strong></span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                                <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
                                    <div>
                                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Report Name</p>
                                        <p className="font-bold text-gray-900 text-sm">
                                            {reportName || `${selectedSource} ${reportType} Report`}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Analysis Period</p>
                                        <p className="font-bold text-blue-600 text-sm">{startMonth} {startYear} - {endMonth} {endYear}</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600 font-medium">Total Usage (Est.)</span>
                                        <span className="font-bold text-gray-900">
                                            {selectedSource === 'Energy' || selectedSource === 'Solar' ? '1,245 kWh' :
                                                selectedSource === 'Water' ? '4,500 L' :
                                                    selectedSource === 'Gas' ? '45 m³' : 'Mixed Data'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600 font-medium">Peak Demand</span>
                                        <span className="font-bold text-gray-900">12.5% above avg</span>
                                    </div>
                                    <div className="pt-4 border-t border-gray-200 flex justify-between text-sm">
                                        <span className="text-gray-600 font-medium">Report Type</span>
                                        <span className="font-bold text-gray-900">Analytical Summary</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
                                        <CheckCircle size={20} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Status</p>
                                        <p className="text-sm font-bold text-emerald-600">Report Ready for Generation</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Controls */}
                <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3">
                    <button
                        onClick={step === 1 ? onClose : () => setStep(1)}
                        className="px-5 py-2.5 rounded-xl text-sm font-bold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 hover:text-gray-900 shadow-sm transition-all"
                    >
                        {step === 1 ? 'Cancel' : 'Back'}
                    </button>

                    {step === 1 ? (
                        <button
                            onClick={handleGenerate}
                            disabled={isInvalidRange() || (reportType === 'Specific' && !selectedAssetId)}
                            className="px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Preview Report
                        </button>
                    ) : (
                        <button
                            onClick={handleGenerateAction}
                            disabled={isGenerating}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isGenerating ? (
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <CheckCircle size={16} />
                            )}
                            {isGenerating ? 'Generating...' : 'Generate Report'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

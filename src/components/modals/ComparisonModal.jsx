import React, { useState, useEffect } from 'react';
import { X, Calendar, TrendingUp, Loader2, Gauge, AlertCircle, ToggleRight, ToggleLeft } from 'lucide-react';
import { apiService } from '../../services/apiService';

export default function ComparisonModal({ onClose, defaultSource = 'All' }) {
    const [step, setStep] = useState(1); // 1: Setup, 2: Result
    const [selectedSource, setSelectedSource] = useState(defaultSource);
    const [compareEnabled, setCompareEnabled] = useState(true);
    const [reportScope, setReportScope] = useState('Overall'); // 'Overall' or 'Specific'
    const [selectedAssetId, setSelectedAssetId] = useState('');
    const [availableAssets, setAvailableAssets] = useState([]);
    const [isFetchingAssets, setIsFetchingAssets] = useState(false);

    // Date Ranges (DD-MM-YYYY style inputs)
    const today = new Date().toISOString().split('T')[0];
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const fourteenDaysAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const eightDaysAgo = new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const [currentStart, setCurrentStart] = useState(sevenDaysAgo);
    const [currentEnd, setCurrentEnd] = useState(today);

    const [compStart, setCompStart] = useState(fourteenDaysAgo);
    const [compEnd, setCompEnd] = useState(eightDaysAgo);

    const [isComparing, setIsComparing] = useState(false);
    const comparisonTimeoutRef = React.useRef(null);

    useEffect(() => {
        return () => {
            if (comparisonTimeoutRef.current) clearTimeout(comparisonTimeoutRef.current);
        };
    }, []);

    useEffect(() => {
        const fetchAssets = async () => {
            setIsFetchingAssets(true);
            try {
                const name = sessionStorage.getItem('userName');
                const role = sessionStorage.getItem('userRole');
                const isSystemAdmin = role === 'Super Admin' || role === 'Admin';
                const userQuery = isSystemAdmin ? '' : `?user=${encodeURIComponent(name || '')}`;

                const [devicesRes, metersRes] = await Promise.all([
                    apiService.getDevices(userQuery),
                    apiService.getInitialMeters(userQuery)
                ]);
                setAvailableAssets([...(devicesRes || []), ...(metersRes || [])]);
            } catch (err) {
                console.error("Failed to fetch assets for comparison", err);
            } finally {
                setIsFetchingAssets(false);
            }
        };
        fetchAssets();
    }, []);

    const filteredAssets = availableAssets.filter(a =>
        selectedSource === 'All' ? true : a.meterType?.toLowerCase() === selectedSource.toLowerCase()
    );

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const [y, m, d] = dateStr.split('-');
        return `${d}-${m}-${y}`;
    };

    const isInvalid = () => {
        if (currentEnd < currentStart) return true;
        if (compareEnabled && compEnd < compStart) return true;
        if (reportScope === 'Specific' && !selectedAssetId) return true;
        return false;
    };

    const handleCompare = () => {
        setIsComparing(true);
        comparisonTimeoutRef.current = setTimeout(() => {
            setIsComparing(false);
            setStep(2);
        }, 1500);
    };

    const selectedAsset = availableAssets.find(a => a.deviceId === selectedAssetId || a.id === selectedAssetId);

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200"
            role="presentation"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div
                className="bg-white rounded-[32px] shadow-2xl w-full max-w-xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200"
                role="dialog"
                aria-modal="true"
                aria-labelledby="comparison-modal-title"
            >

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-indigo-100 text-indigo-600 rounded-xl">
                            <TrendingUp size={24} />
                        </div>
                        <div>
                            <h2 id="comparison-modal-title" className="text-xl font-bold text-gray-900">
                                {step === 1 ? 'Compare Usage Data' : 'Comparison Analysis'}
                            </h2>
                            <p className="text-sm font-medium text-gray-500">
                                {step === 1 ? 'Choose two periods to compare' : `Usage insights for ${selectedSource}`}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                        aria-label="Close"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 overflow-y-auto max-h-[80vh]">
                    {step === 1 ? (
                        <div className="space-y-6">
                            {/* Resource Selection */}
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Resource Analysis</label>
                                <div className="grid grid-cols-5 gap-2">
                                    {['All', 'Energy', 'Water', 'Gas', 'Solar'].map(source => (
                                        <button
                                            key={source}
                                            onClick={() => {
                                                setSelectedSource(source);
                                                setSelectedAssetId('');
                                            }}
                                            className={`py-2 px-1 flex flex-col items-center gap-1 rounded-xl border-2 transition-all duration-300 ${selectedSource === source
                                                ? 'border-indigo-500 bg-indigo-50 text-indigo-700 shadow-sm'
                                                : 'border-gray-100 hover:border-indigo-200 hover:bg-indigo-50/30 text-gray-500'
                                                }`}
                                        >
                                            <span className="text-[10px] font-black uppercase tracking-tighter">{source}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Range Toggle & Asset Scope */}
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-200">
                                <div className="flex items-center gap-3">
                                    <button onClick={() => setCompareEnabled(!compareEnabled)} className="text-indigo-600">
                                        {compareEnabled ? <ToggleRight size={32} /> : <ToggleLeft size={32} className="text-gray-400" />}
                                    </button>
                                    <span className="text-sm font-bold text-gray-700">Compare: {compareEnabled ? 'ON' : 'OFF'}</span>
                                </div>
                                <div className="flex gap-2">
                                    {['Overall', 'Specific'].map(scope => (
                                        <button
                                            key={scope}
                                            onClick={() => setReportScope(scope)}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${reportScope === scope ? 'bg-indigo-600 text-white shadow-md' : 'bg-white text-gray-500 border border-gray-200'}`}
                                        >
                                            {scope}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Asset Dropdown */}
                            {reportScope === 'Specific' && (
                                <div className="animate-in slide-in-from-top-2 duration-300">
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Select Asset</label>
                                    <div className="relative group">
                                        <Gauge className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                        <select
                                            value={selectedAssetId}
                                            onChange={(e) => setSelectedAssetId(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-gray-700 outline-none focus:ring-2 focus:ring-indigo-500/20"
                                        >
                                            <option value="">{isFetchingAssets ? 'Loading Assets...' : 'Choose Device/Meter...'}</option>
                                            {filteredAssets.map(a => (
                                                <option key={a.id} value={a.deviceId || a.id}>{a.deviceName || a.name} ({a.deviceId || a.id})</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            )}

                            {/* Current Range */}
                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                    <Calendar size={14} /> Current Range
                                </p>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-gray-500 uppercase">From</label>
                                        <input
                                            type="date"
                                            value={currentStart}
                                            max={today}
                                            onChange={(e) => setCurrentStart(e.target.value)}
                                            className="w-full p-2 bg-white border border-gray-200 rounded-lg text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500/20"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-gray-500 uppercase">To</label>
                                        <input
                                            type="date"
                                            value={currentEnd}
                                            max={today}
                                            onChange={(e) => setCurrentEnd(e.target.value)}
                                            className="w-full p-2 bg-white border border-gray-200 rounded-lg text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500/20"
                                        />
                                    </div>
                                </div>
                                <p className="mt-3 text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded inline-block">
                                    {formatDate(currentStart)} — {formatDate(currentEnd)}
                                </p>
                            </div>

                            {/* Comparison Range (With) */}
                            {compareEnabled && (
                                <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100 animate-in slide-in-from-top-2">
                                    <p className="text-xs font-black text-indigo-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                        <TrendingUp size={14} /> Compare With
                                    </p>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-bold text-gray-500 uppercase">From</label>
                                            <input
                                                type="date"
                                                value={compStart}
                                                max={today}
                                                onChange={(e) => setCompStart(e.target.value)}
                                                className="w-full p-2 bg-white border border-gray-200 rounded-lg text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500/20"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-bold text-gray-500 uppercase">To</label>
                                            <input
                                                type="date"
                                                value={compEnd}
                                                max={today}
                                                onChange={(e) => setCompEnd(e.target.value)}
                                                className="w-full p-2 bg-white border border-gray-200 rounded-lg text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500/20"
                                            />
                                        </div>
                                    </div>
                                    <p className="mt-3 text-[11px] font-bold text-indigo-600 bg-white border border-indigo-100 px-2 py-1 rounded inline-block">
                                        {formatDate(compStart)} — {formatDate(compEnd)}
                                    </p>
                                </div>
                            )}

                            {isInvalid() && (
                                <div className="bg-red-50 p-4 rounded-xl flex gap-3 text-red-700 border border-red-100 text-sm">
                                    <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                                    <p>Please ensure all dates are valid and the end date is not before the start date.</p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {/* Summary result */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                                    <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Current Range</p>
                                    <p className="text-xs text-slate-500 font-bold mb-2">{formatDate(currentStart)} - {formatDate(currentEnd)}</p>
                                    <p className="text-2xl font-black text-slate-900">420.5 <span className="text-xs font-normal">units</span></p>
                                </div>
                                <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-200">
                                    <p className="text-[10px] font-black text-indigo-400 uppercase mb-1">Previous Range</p>
                                    <p className="text-xs text-indigo-500 font-bold mb-2">{formatDate(compStart)} - {formatDate(compEnd)}</p>
                                    <p className="text-2xl font-black text-indigo-900">385.2 <span className="text-xs font-normal">units</span></p>
                                </div>
                            </div>

                            <div className="p-6 bg-gradient-to-br from-indigo-600 to-violet-700 rounded-[32px] text-white overflow-hidden relative shadow-xl">
                                <div className="absolute top-0 right-0 p-8 opacity-10">
                                    <TrendingUp size={120} />
                                </div>
                                <div className="relative z-10">
                                    <p className="text-xs font-black opacity-80 uppercase tracking-widest mb-1">Consumption variance</p>
                                    <h3 className="text-4xl font-black mb-4">+9.16%</h3>
                                    <p className="text-sm opacity-90 leading-relaxed font-medium">
                                        {reportScope === 'Specific' ? `Asset ${selectedAsset?.deviceName || selectedAssetId}` : `Overall ${selectedSource}`} usage has increased between the selected periods.
                                    </p>
                                </div>
                            </div>

                            <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-emerald-100 text-emerald-600 rounded-xl">
                                        <TrendingUp size={20} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-black text-emerald-800 uppercase tracking-widest">Efficiency</p>
                                        <p className="text-sm font-bold text-emerald-600">Within Optimal Threshold</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3">
                    <button onClick={step === 1 ? onClose : () => setStep(1)} className="px-6 py-2.5 rounded-xl text-sm font-bold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 transition-all">
                        {step === 1 ? 'Close' : 'Back'}
                    </button>
                    {step === 1 && (
                        <button
                            onClick={handleCompare}
                            disabled={isComparing || isInvalid()}
                            className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-500/20 transition-all active:scale-95 disabled:opacity-50"
                        >
                            {isComparing ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Compare Now'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

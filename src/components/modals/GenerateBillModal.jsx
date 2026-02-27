import React, { useState, useEffect } from 'react';
import { X, Receipt, Download, AlertCircle, Eye, User } from 'lucide-react';
import { apiService } from '../../services/apiService';

import { useData } from '../../context/DataContext';

export default function GenerateBillModal({ onClose, userEmail = 'user@example.com' }) {
    const { users, devices, meters, isLoading: loadingUsers } = useData();
    const [step, setStep] = useState(1); // 1: Select Source, 2: Preview
    const [customBillName, setCustomBillName] = useState('');
    const [selectedSource, setSelectedSource] = useState('ELECTRIC');
    const [userCategory, setUserCategory] = useState('All Categories');
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedDevice, setSelectedDevice] = useState('');
    const [startMonth, setStartMonth] = useState('January');
    const [startYear, setStartYear] = useState(new Date().getFullYear().toString());
    const [endMonth, setEndMonth] = useState(new Date().toLocaleString('default', { month: 'long' }));
    const [endYear, setEndYear] = useState(new Date().getFullYear().toString());
    const [isGenerating, setIsGenerating] = useState(false);

    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const currentYearNum = new Date().getFullYear();
    const years = Array.from({ length: currentYearNum - 2023 + 1 }, (_, i) => (2023 + i).toString());

    const currentMonthIndex = new Date().getMonth();

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

    useEffect(() => {
        let timeoutId;
        if (isGenerating) {
            timeoutId = setTimeout(() => {
                setIsGenerating(false);
                alert(`Bill for ${selectedSource} downloaded successfully.`);
                onClose();
            }, 1500);
        }
        return () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        };
    }, [isGenerating, selectedSource, onClose]);

    // Filter users based on category
    const filteredUsers = users.filter(u => {
        if (userCategory === 'All Categories') return true;
        return u.role === userCategory;
    });

    // Filter devices based on resource and user
    const filteredDevices = [...(devices || []), ...(meters || [])].filter(asset => {
        const typeMatch = asset.meterType === selectedSource || asset.type === selectedSource || (selectedSource === 'ELECTRIC' && asset.application === 'Energy');

        let userMatch = true;
        if (selectedUser) {
            userMatch = asset.user === selectedUser.name || asset.industryUser === selectedUser.name;
        }

        return typeMatch && userMatch;
    });

    // Mock calculation based on source
    const getMockBillData = (source) => {
        const baseAmount = source === 'ELECTRIC' ? 4500 : source === 'WATER' ? 1200 : source === 'GAS' ? 2100 : 800; // Solar
        const tax = baseAmount * 0.18;
        return {
            subtotal: baseAmount,
            tax: tax,
            total: baseAmount + tax,
            consumption: source === 'ELECTRIC' ? '450 kWh' : source === 'WATER' ? '120 kL' : source === 'GAS' ? '45 m³' : '150 kWh',
            rate: source === 'ELECTRIC' ? '₹10/kWh' : source === 'WATER' ? '₹10/kL' : source === 'GAS' ? '₹46/m³' : '₹5.3/kWh'
        };
    };

    const billData = getMockBillData(selectedSource);

    const handleGenerate = () => {
        setStep(2);
    };

    const handleDownload = async () => {
        setIsGenerating(true);
        try {
            const invoicePayload = {
                id: `INV-${Date.now()}`,
                name: customBillName || `${selectedSource} Bill`,
                customName: customBillName || '-',
                customer: selectedUser ? selectedUser.name : 'Overall Account',
                email: selectedUser ? selectedUser.email : userEmail,
                resourceType: selectedSource,
                deviceId: selectedDevice || '-',
                type: 'Generation',
                amount: `₹${billData.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
                status: 'Pending',
                date: new Date().toISOString().split('T')[0],
                period: `${startMonth} ${startYear} - ${endMonth} ${endYear}`,
                consumption: billData.consumption
            };

            await apiService.createInvoice(invoicePayload);
            alert(`Bill for ${selectedSource} generated and saved successfully.`);
            onClose();
        } catch (error) {
            console.error("Failed to persist generated invoice:", error);
            alert("Failed to save invoice to database.");
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-orange-100 text-orange-600 rounded-xl">
                            {step === 1 ? <Receipt size={24} /> : <Eye size={24} />}
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">
                                {step === 1 ? 'Generate New Bill' : 'Bill Preview'}
                            </h2>
                            <p className="text-sm font-medium text-gray-500">
                                {step === 1 ? 'Select a resource and period' : `${selectedSource} Billing Statement`}
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
                <div className="p-6 flex-1 overflow-y-auto max-h-[70vh]">
                    {step === 1 ? (
                        <div className="space-y-6">

                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-3">Report Name (Optional)</label>
                                <input
                                    type="text"
                                    value={customBillName}
                                    onChange={(e) => setCustomBillName(e.target.value)}
                                    placeholder="Enter custom report name"
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-gray-700 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-3">Select Resource</label>
                                <div className="grid grid-cols-2 gap-3">
                                    {['ELECTRIC', 'WATER', 'GAS', 'SOLAR'].map(source => (
                                        <button
                                            key={source}
                                            onClick={() => setSelectedSource(source)}
                                            className={`p-3 flex flex-col items-center gap-2 rounded-2xl border-2 transition-all duration-300 ${selectedSource === source
                                                ? 'border-orange-500 bg-orange-50 text-orange-700 shadow-md ring-1 ring-orange-200'
                                                : 'border-gray-100 hover:border-orange-200 hover:bg-orange-50/50 text-gray-500'
                                                }`}
                                        >
                                            <span className="text-xs font-black uppercase tracking-tighter">{source}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-3">User Category</label>
                                <div className="flex gap-2 p-1 bg-gray-50 border border-gray-200 rounded-2xl">
                                    {['All Categories', 'Industrial', 'Domestic'].map((cat) => (
                                        <button
                                            key={cat}
                                            onClick={() => {
                                                setUserCategory(cat);
                                                setSelectedUser(null);
                                            }}
                                            className={`flex-1 py-2 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all duration-300 ${userCategory === cat ? 'bg-white text-orange-600 shadow-sm ring-1 ring-orange-100' : 'text-gray-400 hover:text-gray-600'
                                                }`}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {userCategory !== 'All Categories' && (
                                <div className="animate-in slide-in-from-top-2 duration-300">
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-3">Select Customer</label>
                                    <div className="relative group">
                                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors" size={16} />
                                        <select
                                            value={selectedUser?.id || ''}
                                            onChange={(e) => setSelectedUser(users.find(u => u.id === e.target.value))}
                                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-gray-700 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all"
                                        >
                                            <option value="">{loadingUsers ? 'Loading Users...' : 'Choose User...'}</option>
                                            {filteredUsers.map(u => (
                                                <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            )}

                            <div className="animate-in slide-in-from-top-2 duration-300">
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-3">Select Device / Meter</label>
                                <div className="relative group">
                                    <select
                                        value={selectedDevice}
                                        onChange={(e) => setSelectedDevice(e.target.value)}
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-gray-700 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all"
                                    >
                                        <option value="">{filteredDevices.length ? 'Combined Asset Report' : 'No related assets found'}</option>
                                        {filteredDevices.map(asset => (
                                            <option key={asset.id} value={asset.deviceId || asset.id}>
                                                {asset.deviceName || asset.meterName || asset.name} ({asset.deviceId || asset.id})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-4 pt-2">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="block text-sm font-bold text-gray-700">Starting Month</label>
                                        <select
                                            value={startMonth}
                                            onChange={(e) => setStartMonth(e.target.value)}
                                            className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-orange-500/20 outline-none"
                                        >
                                            {months.map(m => (
                                                <option key={m} value={m}>{m}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-sm font-bold text-gray-700">Starting Year</label>
                                        <select
                                            value={startYear}
                                            onChange={(e) => setStartYear(e.target.value)}
                                            className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-orange-500/20 outline-none"
                                        >
                                            {years.map(y => (
                                                <option key={y} value={y}>{y}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="block text-sm font-bold text-gray-700">Ending Month</label>
                                        <select
                                            value={endMonth}
                                            onChange={(e) => setEndMonth(e.target.value)}
                                            className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-orange-500/20 outline-none"
                                        >
                                            {months.map(m => (
                                                <option key={m} value={m} disabled={isFutureDate(m, endYear)}>{m}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-sm font-bold text-gray-700">Ending Year</label>
                                        <select
                                            value={endYear}
                                            onChange={(e) => setEndYear(e.target.value)}
                                            className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-orange-500/20 outline-none"
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
                                            : "Billing cannot be generated for future dates."}
                                    </p>
                                </div>
                            )}

                            <div className="bg-blue-50 p-4 rounded-xl flex gap-3 text-blue-800 border border-blue-100 text-sm">
                                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                                <p>Generating a bill for <strong>{startMonth} {startYear} - {endMonth} {endYear}</strong> will fetch your consumption data for this range.</p>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                                <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
                                    <div>
                                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Category • Account</p>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <span className="px-1.5 py-0.5 bg-gray-200 text-gray-700 text-[8px] font-black uppercase rounded tracking-tighter">{userCategory}</span>
                                            <p className="font-bold text-gray-900 text-sm">
                                                {selectedUser ? `${selectedUser.name}` : 'Overall Account'}
                                            </p>
                                        </div>
                                        {selectedUser && <p className="text-[10px] text-gray-400 font-medium">{selectedUser.email}</p>}
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Billing Period</p>
                                        <p className="font-bold text-orange-600 text-sm">{startMonth} {startYear} - {endMonth} {endYear}</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600 font-medium">Total Consumption</span>
                                        <span className="font-bold text-gray-900">{billData.consumption}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600 font-medium">Applicable Rate</span>
                                        <span className="font-bold text-gray-900">{billData.rate}</span>
                                    </div>
                                    <div className="pt-4 border-t border-gray-200 flex justify-between text-sm">
                                        <span className="text-gray-600 font-medium">Subtotal</span>
                                        <span className="font-bold text-gray-900">₹{billData.subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600 font-medium">Taxes (18% GST)</span>
                                        <span className="font-bold text-gray-900">₹{billData.tax.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-orange-50 rounded-2xl p-6 border border-orange-100 flex justify-between items-center">
                                <span className="font-bold text-orange-900">Total Amount Due</span>
                                <span className="text-2xl font-black text-orange-700">₹{billData.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
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
                            disabled={isInvalidRange() || (userCategory !== 'All Categories' && !selectedUser)}
                            className="px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-orange-500 hover:bg-orange-600 shadow-md shadow-orange-500/20 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Preview Bill
                        </button>
                    ) : (
                        <button
                            onClick={handleDownload}
                            disabled={isGenerating}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-orange-500 hover:bg-orange-600 shadow-md shadow-orange-500/20 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isGenerating ? (
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <Download size={16} />
                            )}
                            {isGenerating ? 'Generating...' : 'Download Final Bill'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

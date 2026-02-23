import React from 'react';
import { CreditCard, FileText, Gauge, AlertTriangle, Activity, Droplet, Flame, Sun } from 'lucide-react';

export function DashboardBottomInfo({
    isAdmin,
    billingStats,
    colorConfig,
    reportsStats,
    setActivePage
}) {
    if (!isAdmin) return null;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-5">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-gray-800 flex items-center gap-2">
                        <CreditCard size={18} className="text-purple-500" /> Billing Overview
                    </h3>
                    <button onClick={() => setActivePage('Billing')} className="text-xs font-bold text-purple-600 bg-purple-50 px-2 py-1 rounded">View All</button>
                </div>
                <div className="grid gap-3">
                    {[
                        { label: 'Collected', val: billingStats.total, color: 'purple', icon: CreditCard },
                        { label: 'Pending', val: billingStats.pending, color: 'orange', icon: CreditCard },
                        { label: 'Overdue', val: billingStats.overdue, color: 'red', icon: AlertTriangle },
                    ].map((item, i) => (
                        <div key={i} className={`flex items-center gap-3 p-4 rounded-xl ${colorConfig[item.color].bg} border ${colorConfig[item.color].border} cursor-pointer`} onClick={() => setActivePage('Billing')}>
                            <div className={`p-2 ${colorConfig[item.color].iconBg} ${colorConfig[item.color].text} rounded-lg`}><item.icon size={18} /></div>
                            <div>
                                <p className={`text-xs ${colorConfig[item.color].text} font-bold uppercase tracking-wider`}>{item.label}</p>
                                <p className="text-lg font-bold text-gray-900">{item.val}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-5">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-gray-800 flex items-center gap-2">
                        <FileText size={18} className="text-blue-500" /> Recent Reports
                    </h3>
                    <button onClick={() => setActivePage('Reports')} className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">View All</button>
                </div>
                <div className="grid gap-3">
                    {[
                        { title: 'Monthly Data', meta: 'Dec 2024 • 2.4 MB', status: 'Ready' },
                        { title: 'Solar Analysis', meta: 'Annual 2024 • 5.2 MB', status: 'Ready' },
                        { title: 'Device Health', meta: 'Jan 2025 • Calculating...', status: 'Processing' },
                    ].map((rep, i) => (
                        <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-100 cursor-pointer" onClick={() => setActivePage('Reports')}>
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><FileText size={18} /></div>
                                <div>
                                    <p className="text-sm font-bold text-gray-800">{rep.title}</p>
                                    <p className="text-[10px] text-gray-500 font-medium">{rep.meta}</p>
                                </div>
                            </div>
                            <span className={`px-2 py-1 rounded-lg text-[10px] font-bold ${rep.status === 'Ready' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>{rep.status}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-5">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-gray-800 flex items-center gap-2"><Gauge size={18} className="text-emerald-500" /> System Status</h3>
                    <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                    {[
                        { label: 'Grid Freq', value: '50.02 Hz', icon: Activity, color: 'emerald' },
                        { label: 'Water Pres', value: '3.4 bar', icon: Droplet, color: 'cyan' },
                        { label: 'Gas PSI', value: '2.1 psi', icon: Flame, color: 'orange' },
                        { label: 'Solar Out', value: '4.2 kW', icon: Sun, color: 'amber' },
                    ].map((p, i) => (
                        <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl border border-gray-100">
                            <div className={`p-2 rounded-lg bg-${p.color}-50 text-${p.color}-500`}><p.icon size={16} /></div>
                            <div>
                                <p className="text-[10px] text-gray-400 font-bold uppercase">{p.label}</p>
                                <p className="text-sm font-bold text-gray-900">{p.value}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

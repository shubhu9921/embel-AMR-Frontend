
import React, { useState } from 'react';
import { X, Send, HelpCircle, AlertCircle, FileText, Cpu, Gauge, CreditCard, Layout, MoreHorizontal } from 'lucide-react';
import { ISSUE_TYPES, TICKET_STATUS } from '../../data/supportData';

export default function SupportModal({ onClose, userDetails = { name: 'Sarah Miller', id: 'User1' } }) {
    const [formData, setFormData] = useState({
        issueType: 'Devices',
        title: '',
        description: '',
        source: 'Energy',
        deviceId: '',
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate API call
        const timer = setTimeout(() => {
            const ticketId = `TKT-${Math.floor(1000 + Math.random() * 9000)}`;
            console.log('Ticket Created:', { ...formData, ticketId, status: TICKET_STATUS.PENDING });
            setIsSubmitting(false);
            setIsSuccess(true);
        }, 1500);

        return () => clearTimeout(timer);
    };

    React.useEffect(() => {
        let timer;
        if (isSuccess) {
            timer = setTimeout(() => onClose(), 2000);
        }
        return () => timer && clearTimeout(timer);
    }, [isSuccess, onClose]);

    const userName = userDetails?.name || 'Guest User';

    const getIssueIcon = (type) => {
        switch (type) {
            case 'Devices': return <Cpu size={18} />;
            case 'Meters': return <Gauge size={18} />;
            case 'Billing': return <CreditCard size={18} />;
            case 'Reports': return <FileText size={18} />;
            case 'Dashboard': return <Layout size={18} />;
            default: return <MoreHorizontal size={18} />;
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-lg overflow-hidden border border-white/20 animate-in zoom-in-95 duration-300">

                {/* Header */}
                <div className="bg-gradient-to-r from-indigo-600 to-purple-700 p-6 text-white relative">
                    <button
                        onClick={onClose}
                        aria-label="Close support modal"
                        className="absolute right-4 top-4 p-2 hover:bg-white/20 rounded-full transition-colors"
                    >
                        <X size={20} />
                    </button>
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
                            <HelpCircle size={28} />
                        </div>
                        <div>
                            <h2 className="text-xl font-black tracking-tight">Raise Support Request</h2>
                            <p className="text-indigo-100 text-xs font-bold uppercase tracking-wider opacity-80">We're here to help you</p>
                        </div>
                    </div>
                </div>

                <div className="p-8">
                    {isSuccess ? (
                        <div className="py-12 flex flex-col items-center text-center animate-in zoom-in-95 duration-500">
                            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-emerald-100">
                                <CheckCircle size={40} />
                            </div>
                            <h3 className="text-2xl font-black text-gray-900 mb-2">Ticket Raised Successfully!</h3>
                            <p className="text-gray-500 font-medium max-w-xs">Our support team will get back to you shortly. Redirecting...</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* User Info (Read-only) */}
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center font-black">
                                        {userName.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="text-xs font-black text-gray-400 uppercase tracking-wider">Requested By</p>
                                        <p className="text-sm font-bold text-gray-900">{userName}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs font-black text-gray-400 uppercase tracking-wider">User ID</p>
                                    <p className="text-sm font-bold text-gray-900">{userDetails.id}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label htmlFor="issueType" className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Issue Category</label>
                                    <div className="relative">
                                        <select
                                            id="issueType"
                                            value={formData.issueType}
                                            onChange={(e) => setFormData({ ...formData, issueType: e.target.value })}
                                            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-100 rounded-2xl text-sm font-bold text-gray-700 appearance-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none shadow-sm"
                                        >
                                            {ISSUE_TYPES.map(type => (
                                                <option key={type.id} value={type.id}>{type.label}</option>
                                            ))}
                                        </select>
                                        <div className="absolute left-3.5 top-3.5 text-indigo-500">
                                            {getIssueIcon(formData.issueType)}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="source" className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Context / Source</label>
                                    <select
                                        id="source"
                                        value={formData.source}
                                        onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                                        className="w-full px-4 py-3 bg-white border border-gray-100 rounded-2xl text-sm font-bold text-gray-700 appearance-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none shadow-sm"
                                    >
                                        <option value="Energy">Energy</option>
                                        <option value="Water">Water</option>
                                        <option value="Gas">Gas</option>
                                        <option value="Solar">Solar</option>
                                        <option value="Other">General</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="title" className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Summary Title</label>
                                <input
                                    id="title"
                                    required
                                    type="text"
                                    placeholder="Briefly describe the issue..."
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-4 py-3 bg-white border border-gray-100 rounded-2xl text-sm font-bold text-gray-700 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none shadow-sm placeholder:text-gray-300"
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="description" className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Detailed Description</label>
                                <textarea
                                    id="description"
                                    required
                                    rows={4}
                                    placeholder="Provide more details to help us resolve it faster..."
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-4 py-3 bg-white border border-gray-100 rounded-2xl text-sm font-bold text-gray-700 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none shadow-sm placeholder:text-gray-300 resize-none"
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`w-full py-4 rounded-2xl text-white font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 shadow-xl transition-all active:scale-[0.98] ${isSubmitting ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-100'}`}
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <Send size={16} />
                                        Submit Support Ticket
                                    </>
                                )}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}

function CheckCircle({ size, className }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
    );
}

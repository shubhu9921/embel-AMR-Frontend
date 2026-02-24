import { useState } from 'react';
import { X, Send, MessageSquare, AlertTriangle, Cpu, MapPin, ClipboardList } from 'lucide-react';
import { useSupport } from '../../context/SupportContext';

export default function RaiseSupportModal({ item, onClose }) {
    const { addTicket } = useSupport();
    const [description, setDescription] = useState('');
    const [ticketSource, setTicketSource] = useState(item?.source || 'Other');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    if (!item) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const newTicket = {
            name: item.name,
            source: ticketSource,
            deviceName: item.deviceName,
            location: item.location,
            description: description,
            category: item.type === 'critical' || item.type === 'warning' ? 'Alert' : 'Issue',
            type: item.type === 'critical' || item.type === 'warning' ? 'Alert' : 'Issue',
            role: item.role || (sessionStorage.getItem('userRole') || 'Industrial')
        };

        // Call context to add ticket
        addTicket(newTicket);

        // Simulate processing delay for UX
        setTimeout(() => {
            setIsSubmitting(false);
            setIsSuccess(true);
            setTimeout(() => {
                onClose();
            }, 2000);
        }, 1000);
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={onClose}></div>

            {/* Modal */}
            <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
                {/* Header */}
                <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
                            <MessageSquare size={20} />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-900 leading-tight">Raise Support Ticket</h2>
                            <p className="text-xs font-medium text-gray-400 mt-1">Convert issue to formal ticket</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-xl text-gray-400 hover:text-gray-600 transition-all"
                    >
                        <X size={20} />
                    </button>
                </div>

                {isSuccess ? (
                    <div className="p-12 flex flex-col items-center justify-center text-center space-y-4">
                        <div className="h-20 w-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center animate-bounce">
                            <ClipboardList size={40} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-900">Ticket Created Successfully!</h3>
                            <p className="text-sm text-gray-500 font-medium mt-1">Support team will review and respond shortly.</p>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        {/* Reference Item Summary */}
                        <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Reference Issue</span>
                                <span className="px-2 py-0.5 bg-white border border-gray-200 rounded-md text-[10px] font-bold text-gray-500">{item.id}</span>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-sm font-bold text-gray-700">
                                    <AlertTriangle size={14} className="text-amber-500" />
                                    {item.name}
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                        <Cpu size={12} />
                                        {item.deviceName}
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                        <MapPin size={12} />
                                        {item.location}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Form Fields */}
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Support Source</label>
                                <select
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm font-medium transition-all"
                                    value={ticketSource}
                                    onChange={(e) => setTicketSource(e.target.value)}
                                >
                                    <option value="Water">Water Infrastructure</option>
                                    <option value="Energy">Energy Meters</option>
                                    <option value="Gas">Gas Supply</option>
                                    <option value="Solar">Solar Panels</option>
                                    <option value="Billing">Billing & Payments</option>
                                    <option value="System">System Access</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Additional Context</label>
                                <textarea
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm font-medium min-h-[120px] transition-all"
                                    placeholder="Please provide more details about the issue..."
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    required
                                ></textarea>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-3 pt-2">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 px-4 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl text-sm font-black uppercase tracking-widest hover:bg-gray-50 transition-all active:scale-95"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex-[2] px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-black uppercase tracking-widest shadow-lg shadow-blue-500/30 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:bg-blue-400"
                            >
                                {isSubmitting ? (
                                    <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                ) : (
                                    <Send size={16} />
                                )}
                                Submit Ticket
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}

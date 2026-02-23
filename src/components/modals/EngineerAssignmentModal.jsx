import React, { useState } from 'react';
import { X, User, Mail, Phone, CheckCircle } from 'lucide-react';

const ENGINEERS = [
    { id: '1', name: 'Rahul Patil', code: 'RP', specialty: 'Energy Devices', email: 'rahul.p@embel.com', phone: '+91 98765 43210' },
    { id: '2', name: 'Sanjay Kumar', code: 'SK', specialty: 'Water Infrastructure', email: 'sanjay.k@embel.com', phone: '+91 87654 32109' },
    { id: '3', name: 'Anita Singh', code: 'AS', specialty: 'Gas Supply', email: 'anita.s@embel.com', phone: '+91 76543 21098' },
    { id: '4', name: 'Vikram Rao', code: 'VR', specialty: 'Solar Panels', email: 'vikram.r@embel.com', phone: '+91 65432 10987' },
];

export default function EngineerAssignmentModal({ onClose, alertName, onAssign }) {
    const [status, setStatus] = useState('idle'); // 'idle', 'assigning', 'success'
    const [selectedId, setSelectedId] = useState('');

    const selectedEngineer = ENGINEERS.find(e => e.id === selectedId);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!selectedId) return;

        setStatus('assigning');
        // Mock assignment
        setTimeout(() => {
            if (onAssign) {
                onAssign(selectedEngineer.name);
            }
            setStatus('success');
            setTimeout(onClose, 2000);
        }, 1500);
    };

    if (status === 'success') {
        return (
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"></div>
                <div className="relative bg-white rounded-3xl p-8 text-center max-w-sm animate-in zoom-in duration-300 shadow-2xl">
                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Engineer Assigned!</h3>
                    <p className="text-sm text-gray-500 font-medium">
                        <span className="text-indigo-600 font-bold">{selectedEngineer.name}</span> has been assigned to handle "{alertName}".
                        The alert status is now <span className="text-amber-600 font-bold italic">Processing</span>.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={onClose}></div>

            <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-indigo-50/10">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-indigo-100 text-indigo-600 rounded-xl">
                            <User size={20} />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-900 tracking-tight">Assign Engineer</h2>
                            <p className="text-[10px] text-gray-400 font-medium uppercase tracking-widest">Select relevant field expert</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Alert Reference</p>
                        <p className="text-sm font-bold text-gray-800">{alertName}</p>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-[11px] font-black text-gray-500 uppercase tracking-widest ml-1">Select Expert</label>
                            <select
                                required
                                value={selectedId}
                                onChange={(e) => setSelectedId(e.target.value)}
                                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-2xl text-sm font-medium focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all appearance-none cursor-pointer"
                                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='none' stroke='%2394a3b8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m3 5 3 3 3-3'/%3E%3C/svg%3E")`, backgroundPosition: 'right 1rem center', backgroundRepeat: 'no-repeat' }}
                            >
                                <option value="" disabled>Choose an engineer...</option>
                                {ENGINEERS.map(eng => (
                                    <option key={eng.id} value={eng.id}>
                                        {eng.code} – {eng.name} – {eng.specialty}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {selectedEngineer && (
                            <div className="bg-indigo-50/50 rounded-2xl p-5 border border-indigo-100/50 space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                                <div className="flex items-start gap-3">
                                    <Mail size={16} className="text-indigo-400 mt-0.5" />
                                    <div>
                                        <p className="text-[10px] font-black text-indigo-300 uppercase tracking-widest">Email Address</p>
                                        <p className="text-xs font-bold text-indigo-900">{selectedEngineer.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Phone size={16} className="text-indigo-400 mt-0.5" />
                                    <div>
                                        <p className="text-[10px] font-black text-indigo-300 uppercase tracking-widest">Phone Number</p>
                                        <p className="text-xs font-bold text-indigo-900">{selectedEngineer.phone}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="pt-4 flex gap-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-3.5 border border-gray-200 text-gray-600 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-gray-50 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            disabled={status === 'assigning' || !selectedId}
                            type="submit"
                            className="flex-[2] px-6 py-3.5 bg-indigo-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:shadow-none transform active:scale-[0.98]"
                        >
                            {status === 'assigning' ? 'Assigning...' : 'Assign Engineer'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

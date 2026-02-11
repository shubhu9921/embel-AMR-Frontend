import React, { useState, useEffect } from 'react';
import { X, UserPlus, UserCog } from 'lucide-react';

const initialForm = {
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    mobile: '',
    address: '',
    role: ''
};

export default function CreateUserModal({ isOpen, onClose, onSubmit, mode = 'create', initialData = null }) {
    const [formData, setFormData] = useState(initialForm);

    useEffect(() => {
        if (isOpen) {
            if (mode === 'edit' && initialData) {
                setFormData({
                    ...initialData,
                    password: '' // Keep password empty for security, optional update
                });
            } else {
                setFormData(initialForm);
            }
        }
    }, [isOpen, mode, initialData]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
        onClose();
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
            <div className="bg-white w-[450px] rounded-2xl shadow-2xl p-6 border border-slate-100 animate-in fade-in zoom-in-95 duration-200 relative z-10 w-full max-w-lg mx-4">

                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-xl ${mode === 'create' ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-600'}`}>
                            {mode === 'create' ? <UserPlus size={24} /> : <UserCog size={24} />}
                        </div>
                        <h2 className="text-xl font-black text-slate-800 tracking-tight">
                            {mode === 'create' ? 'Create New Account' : 'Edit User Details'}
                        </h2>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-400 hover:text-slate-600">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">First Name</label>
                            <input
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                                placeholder="e.g. Tejaswini"
                                required
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Last Name</label>
                            <input
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                                placeholder="e.g. Bhangare"
                                required
                            />
                        </div>
                        <div className="col-span-2 space-y-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Username</label>
                            <input
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-blue-500 transition-all outline-none disabled:opacity-50"
                                placeholder="e.g. user105"
                                required
                                disabled={mode === 'edit'} // Usually username is immutable
                            />
                        </div>
                        <div className="col-span-2 space-y-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                            <input
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                                placeholder="e.g. tejaswini@gmail.com"
                                required
                            />
                        </div>

                        {mode === 'create' && (
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
                                <input
                                    name="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                                    placeholder="••••••••"
                                    required={mode === 'create'}
                                />
                            </div>
                        )}

                        <div className={mode === 'create' ? "space-y-1" : "col-span-2 space-y-1"}>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Mobile No</label>
                            <input
                                name="mobile"
                                value={formData.mobile}
                                onChange={handleChange}
                                className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                                placeholder="e.g. 9871753211"
                                required
                            />
                        </div>
                        <div className="col-span-2 space-y-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Address</label>
                            <input
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                                placeholder="e.g. Pune, Maharashtra"
                            />
                        </div>
                        <div className="col-span-2 space-y-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Account Role</label>
                            <div className="relative">
                                <select
                                    name="role"
                                    value={formData.role}
                                    onChange={handleChange}
                                    className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-blue-500 transition-all outline-none appearance-none disabled:opacity-70"
                                    required
                                >
                                    <option value="" disabled>Select Role</option>
                                    <option value="USER">USER (General access)</option>
                                    <option value="ADMIN">ADMIN (Manager access)</option>
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 mt-8">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2.5 text-sm font-black text-slate-400 hover:text-slate-600 transition-colors uppercase tracking-widest"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={!formData.firstName || !formData.email || !formData.role}
                            className={`px-8 py-2.5 text-white rounded-xl text-sm font-black shadow-lg transition-all active:scale-95 uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 ${mode === 'create'
                                    ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-200'
                                    : 'bg-orange-500 hover:bg-orange-600 shadow-orange-200'
                                }`}
                        >
                            {mode === 'create' ? 'Create Account' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

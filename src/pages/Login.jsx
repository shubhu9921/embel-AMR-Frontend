import React, { useState } from 'react';
import { Eye, EyeOff, Lock, Mail, ArrowRight } from 'lucide-react';

export default function LoginPage({ onLogin }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // Mock authentication
        setTimeout(() => {
            // Demo Credentials Logic
            if (email === 'superadmin' && (password === 'superadmin' || password === 'superadmin')) {
                sessionStorage.setItem('isAuthenticated', 'true');
                sessionStorage.setItem('userRole', 'Admin');
                onLogin('Admin');
            } else if (email === 'user1' && password === 'user1') {
                sessionStorage.setItem('isAuthenticated', 'true');
                sessionStorage.setItem('userRole', 'User');
                onLogin('User');
            } else {
                setError('Invalid username or password. Try superadmin/superadmin or user1/user1');
                setLoading(false);
            }
        }, 800);
    };
    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-[#002D5E] to-[#112240] p-4">
            <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 sm:p-12 border border-white/10 relative overflow-hidden">

                {/* Decorative background blur within the card */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -ml-16 -mb-16 pointer-events-none"></div>

                <div className="text-center mb-10 relative z-10">
                    <img
                        src="https://www.embel.co.in/images/logos/logo-embel.png"
                        alt="Embel Logo"
                        className="h-12 mx-auto mb-6 object-contain"
                    />
                    <h2 className="text-3xl font-bold text-slate-800 mb-2">Welcome Back</h2>
                    <p className="text-slate-500">Please sign in to your dashboard</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700 ml-1">Username or Email</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                            </div>
                            <input
                                type="text"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="block w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-orange-100 focus:border-[#ff6e00] transition-all outline-none text-sm font-medium"
                                placeholder="Enter username or email"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between ml-1">
                            <label className="text-sm font-medium text-slate-700">Password</label>
                            <a href="#" className="text-sm font-semibold text-[#ff6e00] hover:text-[#e05d00]">Forgot password?</a>
                        </div>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                            </div>
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="block w-full pl-11 pr-12 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-orange-100 focus:border-[#ff6e00] transition-all outline-none text-sm font-medium"
                                placeholder="Enter your password"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                            >
                                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm flex items-center gap-2 animate-in fade-in slide-in-from-top-1">
                            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-2 py-3.5 px-4 border border-transparent rounded-xl shadow-lg shadow-orange-500/20 text-sm font-bold text-white bg-[#ff6e00] hover:bg-[#e05d00] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ff6e00] disabled:opacity-70 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : (
                            <>Sign In <ArrowRight className="w-4 h-4 stroke-[3]" /></>
                        )}
                    </button>
                </form>

                <div className="mt-8 text-center text-sm text-gray-500 relative z-10">
                    Don't have an account? <a href="#" className="font-semibold text-[#ff6e00] hover:text-[#e05d00]">Contact Support</a>
                </div>
            </div>
        </div>
    );
}

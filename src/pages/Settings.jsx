import React from 'react';
import { Settings } from 'lucide-react';

export default function SettingsPage() {
    return (
        <div className="flex flex-col flex-1">
            <main className="w-full min-h-screen p-4 md:p-6 font-sans pt-6 md:pt-8 flex flex-col">
                {/* Page Header */}
                <div className="p-5 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/50 backdrop-blur-sm sticky top-0 z-20 rounded-[20px] shadow-sm mb-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 w-full">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-gray-500 to-slate-600 text-white shadow-lg transition-transform duration-300 group-hover:scale-105">
                                <Settings size={24} />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                                    Settings Page
                                </h1>
                                <p className="text-sm font-medium text-gray-500">
                                    Real-time monitoring and analytics
                                </p>
                            </div>
                        </div>
                        <div className="h-1.5 w-24 rounded-full bg-gradient-to-r from-gray-400 to-slate-500 opacity-20" />
                    </div>
                </div>

                <div className="space-y-6 w-full">
                    {/* Content will go here */}
                </div>
            </main>
        </div>
    );
}

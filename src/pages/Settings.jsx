import React from 'react';
import { Settings } from 'lucide-react';

export default function SettingsPage() {
    return (
        <div className="w-full h-full flex flex-col overflow-hidden relative">
            {/* Page Header */}
            <div className="p-5 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/50 backdrop-blur-sm sticky top-0 z-20 rounded-[20px] shadow-sm mx-6 mt-6 mb-2">
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
                                Manage your preferences and system configurations
                            </p>
                        </div>
                    </div>
                    <div className="h-1.5 w-24 rounded-full bg-gradient-to-r from-gray-400 to-slate-500 opacity-20" />
                </div>
            </div>

            <div className="p-6 max-w-4xl mx-auto mb-20">
                {/* Content will go here */}
            </div>
        </div>
    );
}

import React from 'react';
import { Settings } from 'lucide-react';

export default function SettingsPage() {
    return (
        <div className="w-full h-full flex flex-col bg-gray-100 overflow-hidden relative">
            {/* Page Header */}
            <div className="sticky top-0 z-20 group bg-white/90 backdrop-blur-xl border border-gray-200 px-6 py-4 rounded-2xl shadow-sm transition-all duration-300 hover:shadow-md hover:bg-gray-50/90 mx-6 mt-6 mb-2">
                <div className="flex items-center justify-between gap-4">
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

            <div className="flex-1 overflow-auto p-6">
                {/* Content will go here */}
            </div>
        </div>
    );
}

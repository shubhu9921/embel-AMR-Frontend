import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

export const DeviceStatusChart = ({ data, totalItems, label }) => {
    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-[400px]">
            <div className="flex items-center justify-between mb-2">
                <div>
                    <h2 className="text-lg font-bold text-gray-900">{label} Status</h2>
                    <p className="text-sm font-medium text-gray-500">Distribution overview</p>
                </div>
            </div>

            <div className="flex-1 relative min-h-0 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <defs>
                            <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                                <feDropShadow dx="0" dy="8" stdDeviation="12" floodOpacity="0.15" />
                            </filter>
                        </defs>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={70}
                            outerRadius={110}
                            paddingAngle={8}
                            dataKey="value"
                            stroke="none"
                            cornerRadius={8}
                            style={{ filter: 'url(#shadow)' }}
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
                {/* Center Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-4xl font-black text-gray-900 tracking-tight">{totalItems}</span>
                    <span className="text-sm font-bold text-gray-400 uppercase tracking-widest mt-1">Total</span>
                </div>
            </div>

            {/* Custom Legend */}
            <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-gray-50">
                {data.map((entry, index) => (
                    <div key={index} className="flex flex-col items-center p-2 rounded-xl bg-gray-50/50">
                        <div className="flex items-center gap-1.5 mb-1">
                            <div className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ backgroundColor: entry.color }} />
                            <span className="text-xs font-bold text-gray-600">{entry.name}</span>
                        </div>
                        <span className="text-sm font-black text-gray-900">{entry.value}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

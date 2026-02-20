import React, { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const PerformanceChart = ({ data }) => {
    const memoizedData = useMemo(() => data, [data]);

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-[400px]">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-lg font-bold text-gray-900">System Performance</h2>
                    <p className="text-sm font-medium text-gray-500">Resource consumption overview</p>
                </div>
                <div className="flex items-center gap-4 text-xs font-bold">
                    <div className="flex items-center gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-blue-500" />
                        <span className="text-gray-600">Energy</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-cyan-500" />
                        <span className="text-gray-600">Water</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-orange-500" />
                        <span className="text-gray-600">Gas</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-amber-500" />
                        <span className="text-gray-600">Solar</span>
                    </div>
                </div>
            </div>

            <div className="flex-1 min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={memoizedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorEnergy" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorWater" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorGas" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorSolar" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }}
                        />
                        <Tooltip
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                            labelStyle={{ fontWeight: 'bold', color: '#1e293b', marginBottom: '8px' }}
                            itemStyle={{ fontWeight: 600, fontSize: '13px' }}
                        />
                        <Area type="monotone" dataKey="Energy" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorEnergy)" />
                        <Area type="monotone" dataKey="Water" stroke="#06b6d4" strokeWidth={3} fillOpacity={1} fill="url(#colorWater)" />
                        <Area type="monotone" dataKey="Gas" stroke="#f97316" strokeWidth={3} fillOpacity={1} fill="url(#colorGas)" />
                        <Area type="monotone" dataKey="Solar" stroke="#f59e0b" strokeWidth={3} fillOpacity={1} fill="url(#colorSolar)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Label } from 'recharts';

export const PerformanceChart = ({ data }) => {
    const memoizedData = useMemo(() => data, [data]);

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-[400px]">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-lg font-bold text-gray-900">Consumption vs Time</h2>
                    <p className="text-sm font-medium text-gray-500">Resource consumption overview</p>
                </div>
                <div className="flex items-center gap-4 text-xs font-bold">
                    <div className="flex items-center gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-emerald-500" />
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

            <div className="flex-1 min-h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={memoizedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }}
                            dy={10}
                        >
                            <Label
                                content={({ viewBox }) => (
                                    <text x={viewBox.x + viewBox.width / 2} y={viewBox.y + viewBox.height} fill="#94a3b8" fontSize="11px" fontWeight={500} textAnchor="middle">
                                        <tspan dy="1em">Time</tspan>
                                    </text>
                                )}
                            />
                        </XAxis>
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }}
                        >
                            <Label value="Consumption" angle={-90} position="insideLeft" style={{ fill: '#94a3b8', fontSize: '11px', fontWeight: 500 }} />
                        </YAxis>
                        <Tooltip
                            cursor={{ fill: '#f8fafc' }}
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                            labelStyle={{ fontWeight: 'bold', color: '#1e293b', marginBottom: '8px' }}
                            itemStyle={{ fontWeight: 600, fontSize: '13px' }}
                        />
                        <Bar dataKey="Energy" fill="#10b981" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="Water" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="Gas" fill="#f97316" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="Solar" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

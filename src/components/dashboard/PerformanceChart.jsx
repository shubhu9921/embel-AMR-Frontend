import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Label } from 'recharts';

export const PerformanceChart = ({ data }) => {
    const memoizedData = useMemo(() => data, [data]);

    return (
        <div className="w-full h-full min-h-0 min-w-0" style={{ position: 'relative' }}>
            <ResponsiveContainer width="99%" height="100%" minWidth={0}>
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
    );
};

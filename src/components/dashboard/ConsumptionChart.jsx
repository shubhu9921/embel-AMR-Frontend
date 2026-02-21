import React from "react";
import {
    BarChart, Bar, ResponsiveContainer, CartesianGrid, XAxis, YAxis, Tooltip, Label
} from "recharts";
import { LayoutDashboard, Zap, Flame, Droplet, Sun } from "lucide-react";
import { TimeFilter } from "./TimeFilter";

export function ConsumptionChart({
    activeResource,
    setActiveResource,
    consumptionTimeRange,
    setConsumptionTimeRange,
    data
}) {
    return (
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-md border border-gray-100 p-6 flex flex-col min-h-[400px] lg:h-full transition-shadow hover:shadow-lg">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
                <div>
                    <h3 className="text-lg font-bold text-gray-900">Consumption vs Time</h3>
                    <p className="text-xs text-gray-500 font-medium mt-1">
                        {activeResource === 'All' ? 'Multi-resource usage breakdown' : `${activeResource} usage over time`}
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    {/* Resource Selector */}
                    <div className="flex bg-white p-1 rounded-xl border border-gray-100 shadow-sm shadow-orange-100">
                        {[
                            { id: 'All', label: 'All', icon: LayoutDashboard, activeBg: 'bg-indigo-600 text-white shadow-md', inactiveBg: 'hover:bg-indigo-50 text-gray-500' },
                            { id: 'Energy', label: 'Energy', icon: Zap, activeBg: 'bg-emerald-500 text-white shadow-md', inactiveBg: 'hover:bg-emerald-50 text-gray-500' },
                            { id: 'Gas', label: 'Gas', icon: Flame, activeBg: 'bg-orange-500 text-white shadow-md', inactiveBg: 'hover:bg-orange-50 text-gray-500' },
                            { id: 'Water', label: 'Water', icon: Droplet, activeBg: 'bg-cyan-500 text-white shadow-md', inactiveBg: 'hover:bg-cyan-50 text-gray-500' },
                            { id: 'Solar', label: 'Solar', icon: Sun, activeBg: 'bg-amber-500 text-white shadow-md', inactiveBg: 'hover:bg-amber-50 text-gray-500' },
                        ].map(res => (
                            <button
                                key={res.id}
                                onClick={() => setActiveResource(res.id)}
                                className={`
                                    flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all duration-300
                                    ${activeResource === res.id
                                        ? res.activeBg
                                        : res.inactiveBg
                                    }
                                `}
                            >
                                {res.id !== 'All' && <res.icon size={14} strokeWidth={2.5} />}
                                {res.label}
                            </button>
                        ))}
                    </div>

                    {/* Time Filter */}
                    <TimeFilter selected={consumptionTimeRange} onChange={setConsumptionTimeRange} showAll={true} />
                </div>
            </div>
            <div className="flex-1 w-full min-h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }} barGap={2}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis
                            dataKey="name"
                            tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 500 }}
                            axisLine={false}
                            tickLine={false}
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
                            tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 500 }}
                            axisLine={false}
                            tickLine={false}
                        >
                            <Label value="Consumption" angle={-90} position="insideLeft" style={{ fill: '#94a3b8', fontSize: '11px', fontWeight: 500 }} />
                        </YAxis>
                        <Tooltip
                            contentStyle={{
                                borderRadius: '16px',
                                border: 'none',
                                boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                                padding: '12px'
                            }}
                            cursor={{ fill: '#f8fafc', opacity: 0.8 }}
                            itemStyle={{ fontSize: '12px', fontWeight: 600 }}
                        />

                        {/* Render bars based on activeResource */}
                        {(activeResource === 'All' || activeResource === 'Energy') && (
                            <Bar dataKey="Energy" fill="#10b981" radius={[4, 4, 0, 0]} barSize={activeResource === 'All' ? 12 : 32} />
                        )}
                        {(activeResource === 'All' || activeResource === 'Water') && (
                            <Bar dataKey="Water" fill="#06b6d4" radius={[4, 4, 0, 0]} barSize={activeResource === 'All' ? 12 : 32} />
                        )}
                        {(activeResource === 'All' || activeResource === 'Gas') && (
                            <Bar dataKey="Gas" fill="#f97316" radius={[4, 4, 0, 0]} barSize={activeResource === 'All' ? 12 : 32} />
                        )}
                        {(activeResource === 'All' || activeResource === 'Solar') && (
                            <Bar dataKey="Solar" fill="#f59e0b" radius={[4, 4, 0, 0]} barSize={activeResource === 'All' ? 12 : 32} />
                        )}
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

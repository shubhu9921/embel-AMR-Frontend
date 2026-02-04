import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const generateData = (timeRange) => {
  switch (timeRange) {
    case 'day':
      return [
        { time: '12 AM', usage: 45, cost: 5.4 },
        { time: '2 AM', usage: 38, cost: 4.56 },
        { time: '4 AM', usage: 42, cost: 5.04 },
        { time: '6 AM', usage: 78, cost: 9.36 },
        { time: '8 AM', usage: 125, cost: 15 },
        { time: '10 AM', usage: 156, cost: 18.72 },
        { time: '12 PM', usage: 189, cost: 22.68 },
        { time: '2 PM', usage: 203, cost: 24.36 },
        { time: '4 PM', usage: 234, cost: 28.08 },
        { time: '6 PM', usage: 324, cost: 38.88 },
        { time: '8 PM', usage: 267, cost: 32.04 },
        { time: '10 PM', usage: 145, cost: 17.4 },
      ];
    case 'week':
      return [
        { time: 'Mon', usage: 165, cost: 19.8 },
        { time: 'Tue', usage: 178, cost: 21.36 },
        { time: 'Wed', usage: 192, cost: 23.04 },
        { time: 'Thu', usage: 156, cost: 18.72 },
        { time: 'Fri', usage: 203, cost: 24.36 },
        { time: 'Sat', usage: 187, cost: 22.44 },
        { time: 'Sun', usage: 166, cost: 19.92 },
      ];
    case 'month':
      return [
        { time: 'Week 1', usage: 1120, cost: 134.4 },
        { time: 'Week 2', usage: 1340, cost: 160.8 },
        { time: 'Week 3', usage: 1250, cost: 150 },
        { time: 'Week 4', usage: 1180, cost: 141.6 },
      ];
    case 'year':
      return [
        { time: 'Jan', usage: 4890, cost: 586.8 },
        { time: 'Feb', usage: 4520, cost: 542.4 },
        { time: 'Mar', usage: 4120, cost: 494.4 },
        { time: 'Apr', usage: 3780, cost: 453.6 },
        { time: 'May', usage: 3450, cost: 414 },
        { time: 'Jun', usage: 4200, cost: 504 },
        { time: 'Jul', usage: 5100, cost: 612 },
        { time: 'Aug', usage: 5340, cost: 640.8 },
        { time: 'Sep', usage: 4560, cost: 547.2 },
        { time: 'Oct', usage: 3980, cost: 477.6 },
        { time: 'Nov', usage: 4320, cost: 518.4 },
        { time: 'Dec', usage: 4980, cost: 597.6 },
      ];
    default:
      return [];
  }
};

export function EnergyChart({ timeRange }) {
  const data = generateData(timeRange);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data}>
        <defs>
          <linearGradient id="colorUsage" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="time" stroke="#6b7280" style={{ fontSize: '12px' }} />
        <YAxis
          stroke="#6b7280"
          style={{ fontSize: '12px' }}
          label={{ value: 'kWh', angle: -90, position: 'insideLeft', style: { fontSize: '12px' } }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            fontSize: '12px',
          }}
        />
        <Legend />
        <Area
          type="monotone"
          dataKey="usage"
          stroke="#3b82f6"
          strokeWidth={2}
          fill="url(#colorUsage)"
          name="Usage (kWh)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

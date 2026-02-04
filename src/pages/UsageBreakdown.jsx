import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const data = [
  { name: 'Heating/Cooling', value: 412, color: '#3b82f6' },
  { name: 'Appliances', value: 298, color: '#8b5cf6' },
  { name: 'Lighting', value: 187, color: '#f59e0b' },
  { name: 'Electronics', value: 234, color: '#10b981' },
  { name: 'Other', value: 116, color: '#6b7280' },
];

export function UsageBreakdown() {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-2 transition-all duration-300 hover:shadow-lg hover:border-blue-300 h-full flex flex-col">
      <h3 className="text-xs font-semibold text-gray-900 mb-2">Usage Breakdown</h3>

      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '12px'
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-2 space-y-1 overflow-y-auto max-h-[100px] pr-1 custom-scrollbar">
        {data.map((item, index) => (
          <div key={index} className="flex items-center justify-between transition-all duration-300 hover:bg-gray-50 p-1 rounded-lg cursor-pointer hover:scale-102">
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color }}
              ></div>
              <span className="text-[10px] text-gray-700">{item.name}</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-medium text-gray-900">{item.value}</span>
              <span className="text-[8px] text-gray-500 ml-1">
                ({((item.value / total) * 100).toFixed(1)}%)
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
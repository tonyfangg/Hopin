'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts'

const data = [
  { name: 'Mar 6', value: 650 },
  { name: 'Mar 7', value: 680 },
  { name: 'Mar 8', value: 720 },
  { name: 'Mar 9', value: 710 },
  { name: 'Mar 10', value: 740 },
  { name: 'Mar 11', value: 745 },
  { name: 'Mar 12', value: 750 },
]

export function PerformanceChart() {
  return (
    <div className="bg-white rounded-xl p-6 border border-slate-200 mb-8">
      <h3 className="text-lg font-semibold text-slate-900 mb-6">Performance Trends</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis 
              dataKey="name" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#64748b' }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#64748b' }}
            />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke="#3b82f6" 
              strokeWidth={3}
              dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2, fill: '#fff' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
} 
'use client'

import React from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'

interface ContentTypeData {
  name: string
  value: number
  type: string
}

interface ContentTypeChartProps {
  data: ContentTypeData[]
}

const COLORS = {
  styling_tip: '#1890ff',
  trend_fashion: '#722ed1',
  user_showcase: '#52c41a',
}

const TYPE_NAMES = {
  styling_tip: '穿搭小技巧',
  trend_fashion: '潮流趋势',
  user_showcase: '用户作品',
}

export function ContentTypeChart({ data }: ContentTypeChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        暂无数据
      </div>
    )
  }

  const total = data.reduce((sum, item) => sum + item.value, 0)

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium">{data.name}</p>
          <p className="text-blue-600">
            数量: {data.value}
          </p>
          <p className="text-gray-600">
            占比: {total ? Math.round((data.value / total) * 100) : 0}%
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={COLORS[entry.type as keyof typeof COLORS] || '#8884d8'} 
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
      
      {/* 图例 */}
      <div className="flex justify-center mt-4 space-x-6">
        {data.map((item) => (
          <div key={item.type} className="flex items-center">
            <div 
              className="w-3 h-3 rounded-full mr-2"
              style={{ 
                backgroundColor: COLORS[item.type as keyof typeof COLORS] || '#8884d8' 
              }}
            />
            <span className="text-sm text-gray-600">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
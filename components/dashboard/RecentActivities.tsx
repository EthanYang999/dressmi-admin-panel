'use client'

import React from 'react'
import { Timeline, Avatar, Tag } from 'antd'
import { 
  FileImageOutlined, 
  EditOutlined, 
  DeleteOutlined,
  EyeOutlined,
  HeartOutlined
} from '@ant-design/icons'
import { useQuery } from 'react-query'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'

dayjs.extend(relativeTime)
dayjs.locale('zh-cn')

// 模拟最近活动数据
const generateRecentActivities = () => {
  const activities = [
    {
      id: '1',
      type: 'create',
      title: '添加了新的穿搭小技巧',
      content: '色彩搭配黄金法则',
      time: dayjs().subtract(10, 'minute'),
      icon: <FileImageOutlined />,
      color: 'blue'
    },
    {
      id: '2',
      type: 'update',
      title: '更新了潮流趋势内容',
      content: '2024春夏流行色趋势',
      time: dayjs().subtract(1, 'hour'),
      icon: <EditOutlined />,
      color: 'orange'
    },
    {
      id: '3',
      type: 'view',
      title: '用户浏览了内容',
      content: '法式优雅穿搭 - 浏览量 +15',
      time: dayjs().subtract(2, 'hour'),
      icon: <EyeOutlined />,
      color: 'green'
    },
    {
      id: '4',
      type: 'like',
      title: '内容获得点赞',
      content: '街头潮流混搭 - 点赞 +8',
      time: dayjs().subtract(3, 'hour'),
      icon: <HeartOutlined />,
      color: 'red'
    },
    {
      id: '5',
      type: 'delete',
      title: '删除了过期内容',
      content: '旧版配饰技巧',
      time: dayjs().subtract(5, 'hour'),
      icon: <DeleteOutlined />,
      color: 'gray'
    }
  ]
  
  return activities
}

export function RecentActivities() {
  const activities = generateRecentActivities()

  const getActivityTypeTag = (type: string) => {
    const typeConfig = {
      create: { color: 'blue', text: '新增' },
      update: { color: 'orange', text: '更新' },
      view: { color: 'green', text: '浏览' },
      like: { color: 'red', text: '点赞' },
      delete: { color: 'default', text: '删除' }
    }
    
    const config = typeConfig[type as keyof typeof typeConfig]
    
    return (
      <Tag color={config.color} className="text-xs">
        {config.text}
      </Tag>
    )
  }

  const timelineItems = activities.map(activity => ({
    dot: (
      <Avatar 
        size="small" 
        icon={activity.icon}
        className={`bg-${activity.color}-500`}
        style={{ 
          backgroundColor: activity.color === 'blue' ? '#1890ff' :
                           activity.color === 'orange' ? '#fa8c16' :
                           activity.color === 'green' ? '#52c41a' :
                           activity.color === 'red' ? '#f5222d' :
                           '#8c8c8c'
        }}
      />
    ),
    children: (
      <div className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <span className="font-medium text-gray-900">
                {activity.title}
              </span>
              {getActivityTypeTag(activity.type)}
            </div>
            <p className="text-sm text-gray-600 mb-1">
              {activity.content}
            </p>
            <p className="text-xs text-gray-400">
              {activity.time.fromNow()}
            </p>
          </div>
        </div>
      </div>
    )
  }))

  return (
    <div className="max-h-96 overflow-y-auto">
      <Timeline
        items={timelineItems}
        className="pt-4"
      />
      
      {/* 查看更多链接 */}
      <div className="text-center pt-4 border-t border-gray-100">
        <a 
          href="/activities" 
          className="text-blue-500 hover:text-blue-600 text-sm"
        >
          查看所有活动记录 →
        </a>
      </div>
    </div>
  )
}
'use client'

import React from 'react'
import { List, Avatar, Tag } from 'antd'
import { EyeOutlined, HeartOutlined, ShareAltOutlined } from '@ant-design/icons'

interface PopularContent {
  id: string
  title: string
  content_type: 'styling_tip' | 'trend_fashion' | 'user_showcase'
  view_count: number
  like_count: number
  share_count: number
}

interface PopularContentsListProps {
  data: PopularContent[]
}

const CONTENT_TYPE_CONFIG = {
  styling_tip: { color: 'blue', label: '穿搭技巧' },
  trend_fashion: { color: 'purple', label: '潮流趋势' },
  user_showcase: { color: 'green', label: '用户作品' },
}

export function PopularContentsList({ data }: PopularContentsListProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 text-gray-500">
        暂无数据
      </div>
    )
  }

  return (
    <List
      itemLayout="horizontal"
      dataSource={data}
      renderItem={(item, index) => (
        <List.Item>
          <List.Item.Meta
            avatar={
              <Avatar className="bg-blue-500">
                {index + 1}
              </Avatar>
            }
            title={
              <div className="flex items-center justify-between">
                <span className="font-medium truncate mr-2">{item.title}</span>
                <Tag 
                  color={CONTENT_TYPE_CONFIG[item.content_type]?.color || 'default'}
                  className="text-xs"
                >
                  {CONTENT_TYPE_CONFIG[item.content_type]?.label || item.content_type}
                </Tag>
              </div>
            }
            description={
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span className="flex items-center">
                  <EyeOutlined className="mr-1" />
                  {item.view_count.toLocaleString()}
                </span>
                <span className="flex items-center">
                  <HeartOutlined className="mr-1" />
                  {item.like_count.toLocaleString()}
                </span>
                <span className="flex items-center">
                  <ShareAltOutlined className="mr-1" />
                  {item.share_count.toLocaleString()}
                </span>
              </div>
            }
          />
        </List.Item>
      )}
    />
  )
}
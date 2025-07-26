'use client'

import React from 'react'
import { Modal, Image, Descriptions, Tag, Badge } from 'antd'
import { WaitingContent } from '@/lib/supabase'
import dayjs from 'dayjs'

interface ContentPreviewModalProps {
  visible: boolean
  content: WaitingContent | null
  onCancel: () => void
}

export function ContentPreviewModal({ 
  visible, 
  content, 
  onCancel 
}: ContentPreviewModalProps) {
  if (!content) return null

  const getContentTypeInfo = (type: string) => {
    const typeConfig = {
      styling_tip: { color: 'blue', text: '穿搭小技巧' },
      trend_fashion: { color: 'purple', text: '潮流趋势' },
      user_showcase: { color: 'green', text: '用户作品' }
    }
    return typeConfig[type as keyof typeof typeConfig] || { color: 'default', text: '未知类型' }
  }

  const typeInfo = getContentTypeInfo(content.content_type)

  return (
    <Modal
      title="内容预览"
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={700}
    >
      <div className="space-y-6">
        {/* 图片预览 */}
        <div className="text-center">
          <Image
            src={content.image_url}
            alt={content.title}
            width="100%"
            height={300}
            className="rounded-lg object-cover"
            fallback="https://via.placeholder.com/400x300?text=图片加载失败"
          />
        </div>

        {/* 基础信息 */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            {content.title}
          </h2>
          
          <Descriptions bordered column={2}>
            <Descriptions.Item label="内容类型">
              <Tag color={typeInfo.color}>{typeInfo.text}</Tag>
            </Descriptions.Item>
            
            <Descriptions.Item label="状态">
              <Badge 
                status={content.is_active ? 'success' : 'error'} 
                text={content.is_active ? '启用' : '禁用'} 
              />
            </Descriptions.Item>
            
            <Descriptions.Item label="显示顺序">
              {content.display_order}
            </Descriptions.Item>
            
            <Descriptions.Item label="质量评分">
              <span className="font-medium">{content.quality_score}</span>
              <span className="text-gray-500 text-sm">/100</span>
            </Descriptions.Item>
            
            <Descriptions.Item label="浏览量">
              <span className="text-green-600 font-medium">
                {content.view_count.toLocaleString()}
              </span>
            </Descriptions.Item>
            
            <Descriptions.Item label="点赞数">
              <span className="text-red-600 font-medium">
                {content.like_count.toLocaleString()}
              </span>
            </Descriptions.Item>
            
            <Descriptions.Item label="分享数">
              <span className="text-blue-600 font-medium">
                {content.share_count.toLocaleString()}
              </span>
            </Descriptions.Item>
            
            <Descriptions.Item label="创建时间">
              {dayjs(content.created_at).format('YYYY-MM-DD HH:mm:ss')}
            </Descriptions.Item>
          </Descriptions>
        </div>

        {/* 描述内容 */}
        {content.description && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">描述</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-700 leading-relaxed">
                {content.description}
              </p>
            </div>
          </div>
        )}

        {/* 统计信息图表 */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-green-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">
              {content.view_count.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">浏览量</div>
          </div>
          
          <div className="bg-red-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-red-600 mb-1">
              {content.like_count.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">点赞数</div>
          </div>
          
          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-600 mb-1">
              {content.share_count.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">分享数</div>
          </div>
        </div>

        {/* 质量评分进度条 */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">质量评分</h3>
          <div className="bg-gray-200 rounded-full h-4 relative">
            <div 
              className="bg-blue-500 h-4 rounded-full flex items-center justify-center text-white text-xs font-medium"
              style={{ width: `${content.quality_score}%` }}
            >
              {content.quality_score}/100
            </div>
          </div>
        </div>

        {/* 参与度分析 */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">参与度分析</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">点赞率</span>
              <span className="font-medium">
                {content.view_count > 0 
                  ? `${((content.like_count / content.view_count) * 100).toFixed(2)}%`
                  : '0%'
                }
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">分享率</span>
              <span className="font-medium">
                {content.view_count > 0 
                  ? `${((content.share_count / content.view_count) * 100).toFixed(2)}%`
                  : '0%'
                }
              </span>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  )
}
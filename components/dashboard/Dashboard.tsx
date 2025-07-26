'use client'

import React from 'react'
import { Row, Col, Card, Statistic, Table, Progress, Tag } from 'antd'
import { 
  EyeOutlined, 
  HeartOutlined, 
  ShareAltOutlined, 
  FileImageOutlined,
  TrendingUpOutlined,
  UserOutlined
} from '@ant-design/icons'
import { useQuery } from 'react-query'
import { AnalyticsAPI, WaitingContentAPI } from '@/lib/api'
import { RecentActivities } from './RecentActivities'
import { ContentTypeChart } from './ContentTypeChart'
import { PopularContentsList } from './PopularContentsList'

export function Dashboard() {
  // 获取统计数据
  const { data: stats, isLoading: statsLoading } = useQuery(
    'contentStats',
    AnalyticsAPI.getContentStats
  )

  const { data: contentTypeData } = useQuery(
    'contentTypeDistribution',
    AnalyticsAPI.getContentTypeDistribution
  )

  const { data: popularContents } = useQuery(
    'popularContents',
    () => AnalyticsAPI.getPopularContents(5)
  )

  const { data: recentContents } = useQuery(
    'recentContents',
    () => WaitingContentAPI.getAll()
  )

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">仪表盘</h1>
        <p className="text-gray-600">等待内容管理系统概览</p>
      </div>

      {/* 统计卡片 */}
      <Row gutter={[16, 16]}>
        <Col xs={12} sm={12} md={6}>
          <Card>
            <Statistic
              title="总内容数"
              value={stats?.totalContents || 0}
              prefix={<FileImageOutlined className="text-blue-500" />}
              loading={statsLoading}
            />
          </Card>
        </Col>
        <Col xs={12} sm={12} md={6}>
          <Card>
            <Statistic
              title="总浏览量"
              value={stats?.totalViews || 0}
              prefix={<EyeOutlined className="text-green-500" />}
              loading={statsLoading}
            />
          </Card>
        </Col>
        <Col xs={12} sm={12} md={6}>
          <Card>
            <Statistic
              title="总点赞数"
              value={stats?.totalLikes || 0}
              prefix={<HeartOutlined className="text-red-500" />}
              loading={statsLoading}
            />
          </Card>
        </Col>
        <Col xs={12} sm={12} md={6}>
          <Card>
            <Statistic
              title="总分享数"
              value={stats?.totalShares || 0}
              prefix={<ShareAltOutlined className="text-purple-500" />}
              loading={statsLoading}
            />
          </Card>
        </Col>
      </Row>

      {/* 图表和列表 */}
      <Row gutter={[16, 16]}>
        {/* 内容类型分布 */}
        <Col xs={24} lg={12}>
          <Card title="内容类型分布" className="h-full">
            <ContentTypeChart data={contentTypeData || []} />
          </Card>
        </Col>

        {/* 热门内容 */}
        <Col xs={24} lg={12}>
          <Card title="热门内容 TOP 5" className="h-full">
            <PopularContentsList data={popularContents?.data || []} />
          </Card>
        </Col>
      </Row>

      {/* 最近活动和内容管理快捷操作 */}
      <Row gutter={[16, 16]}>
        {/* 最近活动 */}
        <Col xs={24} lg={16}>
          <Card title="最近活动">
            <RecentActivities />
          </Card>
        </Col>

        {/* 快捷操作 */}
        <Col xs={24} lg={8}>
          <Card title="快捷操作">
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">活跃内容</span>
                  <span className="text-2xl font-bold text-blue-600">
                    {stats?.activeContents || 0}
                  </span>
                </div>
                <Progress
                  percent={stats?.totalContents ? 
                    Math.round((stats.activeContents / stats.totalContents) * 100) : 0
                  }
                  size="small"
                  strokeColor="#1890ff"
                />
              </div>

              <div className="p-4 bg-green-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">平均点赞率</span>
                  <span className="text-2xl font-bold text-green-600">
                    {stats?.totalViews && stats?.totalLikes ? 
                      `${Math.round((stats.totalLikes / stats.totalViews) * 100)}%` : '0%'
                    }
                  </span>
                </div>
                <Progress
                  percent={stats?.totalViews && stats?.totalLikes ? 
                    Math.round((stats.totalLikes / stats.totalViews) * 100) : 0
                  }
                  size="small"
                  strokeColor="#52c41a"
                />
              </div>

              <div className="text-center pt-4">
                <a 
                  href="/contents/new"
                  className="inline-block w-full py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  添加新内容
                </a>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  )
}
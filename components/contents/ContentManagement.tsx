'use client'

import React, { useState } from 'react'
import { 
  Table, 
  Button, 
  Space, 
  Input, 
  Select, 
  Tag, 
  Image, 
  Switch,
  Modal,
  Popconfirm,
  Tooltip,
  Card,
  Row,
  Col
} from 'antd'
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  EyeOutlined,
  HeartOutlined,
  ShareAltOutlined,
  DragOutlined,
  SearchOutlined
} from '@ant-design/icons'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { WaitingContentAPI } from '@/lib/api'
import { WaitingContent } from '@/lib/supabase'
import { ContentFormModal } from './ContentFormModal'
import { ContentPreviewModal } from './ContentPreviewModal'
import toast from 'react-hot-toast'
import dayjs from 'dayjs'

const { Search } = Input
const { Option } = Select

export function ContentManagement() {
  const [filters, setFilters] = useState({
    content_type: '',
    is_active: undefined as boolean | undefined,
    search: ''
  })
  const [selectedContent, setSelectedContent] = useState<WaitingContent | null>(null)
  const [showFormModal, setShowFormModal] = useState(false)
  const [showPreviewModal, setShowPreviewModal] = useState(false)
  const [editingContent, setEditingContent] = useState<WaitingContent | null>(null)

  const queryClient = useQueryClient()

  // 获取内容列表
  const { data: contentsData, isLoading } = useQuery(
    ['waitingContents', filters],
    () => WaitingContentAPI.getAll(filters),
    {
      keepPreviousData: true
    }
  )

  // 删除内容
  const deleteMutation = useMutation(WaitingContentAPI.delete, {
    onSuccess: () => {
      queryClient.invalidateQueries('waitingContents')
      toast.success('删除成功')
    },
    onError: (error: any) => {
      toast.error(`删除失败: ${error.message}`)
    }
  })

  // 切换激活状态
  const toggleActiveMutation = useMutation(WaitingContentAPI.toggleActive, {
    onSuccess: () => {
      queryClient.invalidateQueries('waitingContents')
      toast.success('状态更新成功')
    },
    onError: (error: any) => {
      toast.error(`更新失败: ${error.message}`)
    }
  })

  const contents = contentsData?.data || []

  // 表格列配置
  const columns = [
    {
      title: '排序',
      dataIndex: 'display_order',
      width: 80,
      render: (order: number) => (
        <div className="flex items-center justify-center">
          <DragOutlined className="text-gray-400 mr-1" />
          <span className="text-sm font-mono">{order}</span>
        </div>
      )
    },
    {
      title: '预览',
      dataIndex: 'image_url',
      width: 100,
      render: (url: string) => (
        <Image
          src={url}
          width={60}
          height={60}
          className="rounded object-cover"
          fallback="https://via.placeholder.com/60x60?text=暂无图片"
        />
      )
    },
    {
      title: '标题',
      dataIndex: 'title',
      render: (title: string, record: WaitingContent) => (
        <div>
          <div className="font-medium text-gray-900 mb-1">{title}</div>
          <div className="text-xs text-gray-500 line-clamp-2">
            {record.description}
          </div>
        </div>
      )
    },
    {
      title: '类型',
      dataIndex: 'content_type',
      width: 120,
      render: (type: string) => {
        const typeConfig = {
          styling_tip: { color: 'blue', text: '穿搭技巧' },
          trend_fashion: { color: 'purple', text: '潮流趋势' },
          user_showcase: { color: 'green', text: '用户作品' }
        }
        const config = typeConfig[type as keyof typeof typeConfig]
        return <Tag color={config.color}>{config.text}</Tag>
      }
    },
    {
      title: '统计数据',
      width: 180,
      render: (record: WaitingContent) => (
        <div className="space-y-1">
          <div className="flex items-center text-xs text-gray-600">
            <EyeOutlined className="mr-1" />
            <span className="mr-3">{record.view_count.toLocaleString()}</span>
            <HeartOutlined className="mr-1" />
            <span className="mr-3">{record.like_count.toLocaleString()}</span>
            <ShareAltOutlined className="mr-1" />
            <span>{record.share_count.toLocaleString()}</span>
          </div>
          <div className="text-xs text-gray-500">
            质量评分: {record.quality_score}/100
          </div>
        </div>
      )
    },
    {
      title: '状态',
      dataIndex: 'is_active',
      width: 100,
      render: (isActive: boolean, record: WaitingContent) => (
        <Switch
          checked={isActive}
          onChange={() => toggleActiveMutation.mutate(record.id)}
          loading={toggleActiveMutation.isLoading}
          size="small"
        />
      )
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      width: 120,
      render: (date: string) => (
        <div className="text-xs text-gray-600">
          {dayjs(date).format('MM-DD HH:mm')}
        </div>
      )
    },
    {
      title: '操作',
      width: 160,
      render: (record: WaitingContent) => (
        <Space size="small">
          <Tooltip title="预览">
            <Button
              type="text"
              size="small"
              icon={<EyeOutlined />}
              onClick={() => {
                setSelectedContent(record)
                setShowPreviewModal(true)
              }}
            />
          </Tooltip>
          <Tooltip title="编辑">
            <Button
              type="text"
              size="small"
              icon={<EditOutlined />}
              onClick={() => {
                setEditingContent(record)
                setShowFormModal(true)
              }}
            />
          </Tooltip>
          <Tooltip title="删除">
            <Popconfirm
              title="确定要删除这个内容吗？"
              description="删除后将无法恢复"
              onConfirm={() => deleteMutation.mutate(record.id)}
              okText="确定"
              cancelText="取消"
            >
              <Button
                type="text"
                size="small"
                icon={<DeleteOutlined />}
                danger
                loading={deleteMutation.isLoading}
              />
            </Popconfirm>
          </Tooltip>
        </Space>
      )
    }
  ]

  return (
    <div className="space-y-6">
      {/* 页面标题和操作 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">内容管理</h1>
          <p className="text-gray-600">管理等待页面展示的所有内容</p>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingContent(null)
            setShowFormModal(true)
          }}
        >
          添加内容
        </Button>
      </div>

      {/* 统计卡片 */}
      <Row gutter={16}>
        <Col span={6}>
          <Card className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {contents.length}
            </div>
            <div className="text-gray-600">总内容数</div>
          </Card>
        </Col>
        <Col span={6}>
          <Card className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {contents.filter(c => c.is_active).length}
            </div>
            <div className="text-gray-600">活跃内容</div>
          </Card>
        </Col>
        <Col span={6}>
          <Card className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {contents.reduce((sum, c) => sum + c.view_count, 0).toLocaleString()}
            </div>
            <div className="text-gray-600">总浏览量</div>
          </Card>
        </Col>
        <Col span={6}>
          <Card className="text-center">
            <div className="text-2xl font-bold text-red-600">
              {contents.reduce((sum, c) => sum + c.like_count, 0).toLocaleString()}
            </div>
            <div className="text-gray-600">总点赞数</div>
          </Card>
        </Col>
      </Row>

      {/* 筛选器 */}
      <Card>
        <div className="flex items-center space-x-4">
          <Search
            placeholder="搜索标题或描述"
            allowClear
            value={filters.search}
            onChange={e => setFilters({...filters, search: e.target.value})}
            style={{ width: 200 }}
            prefix={<SearchOutlined />}
          />
          <Select
            placeholder="内容类型"
            allowClear
            value={filters.content_type || undefined}
            onChange={value => setFilters({...filters, content_type: value || ''})}
            style={{ width: 120 }}
          >
            <Option value="styling_tip">穿搭技巧</Option>
            <Option value="trend_fashion">潮流趋势</Option>
            <Option value="user_showcase">用户作品</Option>
          </Select>
          <Select
            placeholder="状态"
            allowClear
            value={filters.is_active}
            onChange={value => setFilters({...filters, is_active: value})}
            style={{ width: 100 }}
          >
            <Option value={true}>启用</Option>
            <Option value={false}>禁用</Option>
          </Select>
        </div>
      </Card>

      {/* 内容表格 */}
      <Card>
        <Table
          columns={columns}
          dataSource={contents}
          loading={isLoading}
          rowKey="id"
          pagination={{
            total: contents.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`
          }}
          scroll={{ x: 1200 }}
        />
      </Card>

      {/* 内容表单弹窗 */}
      <ContentFormModal
        visible={showFormModal}
        editingContent={editingContent}
        onCancel={() => {
          setShowFormModal(false)
          setEditingContent(null)
        }}
        onSuccess={() => {
          setShowFormModal(false)
          setEditingContent(null)
          queryClient.invalidateQueries('waitingContents')
        }}
      />

      {/* 内容预览弹窗 */}
      <ContentPreviewModal
        visible={showPreviewModal}
        content={selectedContent}
        onCancel={() => {
          setShowPreviewModal(false)
          setSelectedContent(null)
        }}
      />
    </div>
  )
}
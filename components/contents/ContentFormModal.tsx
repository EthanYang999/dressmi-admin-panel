'use client'

import React, { useState, useEffect } from 'react'
import { 
  Modal, 
  Form, 
  Input, 
  Select, 
  Upload, 
  Button, 
  InputNumber,
  Switch,
  Tabs,
  Tag,
  Space
} from 'antd'
import { 
  UploadOutlined, 
  PlusOutlined, 
  DeleteOutlined 
} from '@ant-design/icons'
import { useMutation } from 'react-query'
import { WaitingContentAPI, StylingTipAPI, FashionTrendAPI, UserShowcaseAPI, FileUploadAPI } from '@/lib/api'
import { WaitingContent } from '@/lib/supabase'
import { ImageUploadArea } from './ImageUploadArea'
import toast from 'react-hot-toast'

const { TextArea } = Input
const { Option } = Select
const { TabPane } = Tabs

interface ContentFormModalProps {
  visible: boolean
  editingContent: WaitingContent | null
  onCancel: () => void
  onSuccess: () => void
}

interface FormData {
  // 基础信息
  title: string
  description: string
  content_type: 'styling_tip' | 'trend_fashion' | 'user_showcase'
  display_order: number
  is_active: boolean
  quality_score: number
  image_url: string
  
  // 穿搭小技巧特有字段
  tip_category?: string
  tip_content?: string
  applicable_seasons?: string[]
  applicable_occasions?: string[]
  body_types?: string[]
  difficulty_level?: number
  color_keywords?: string[]
  style_keywords?: string[]
  
  // 潮流趋势特有字段
  trend_name?: string
  trend_season?: string
  trend_year?: number
  color_palette?: string[]
  style_tags?: string[]
  popularity_score?: number
  trend_description?: string
  brand_examples?: string[]
  celebrity_examples?: string[]
  
  // 用户作品特有字段
  style_category?: string
  color_scheme?: string[]
  garment_types?: string[]
  is_featured?: boolean
  feature_reason?: string
  user_rating?: number
}

export function ContentFormModal({ 
  visible, 
  editingContent, 
  onCancel, 
  onSuccess 
}: ContentFormModalProps) {
  const [form] = Form.useForm()
  const [uploading, setUploading] = useState(false)
  const [imageUrl, setImageUrl] = useState('')
  const [contentType, setContentType] = useState<string>('')
  
  // 创建/更新内容
  const createMutation = useMutation(WaitingContentAPI.create, {
    onSuccess: () => {
      // 成功提示在handleSubmit中处理，避免重复
      onSuccess()
    },
    onError: (error: any) => {
      toast.error(`创建失败: ${error.message}`)
    }
  })

  const updateMutation = useMutation(
    ({ id, data }: { id: string; data: Partial<WaitingContent> }) => 
      WaitingContentAPI.update(id, data),
    {
      onSuccess: () => {
        toast.success('更新成功')
        onSuccess()
      },
      onError: (error: any) => {
        toast.error(`更新失败: ${error.message}`)
      }
    }
  )

  // 初始化表单数据
  useEffect(() => {
    if (visible) {
      if (editingContent) {
        // 编辑模式：填充现有数据
        form.setFieldsValue({
          title: editingContent.title,
          description: editingContent.description,
          content_type: editingContent.content_type,
          display_order: editingContent.display_order,
          is_active: editingContent.is_active,
          quality_score: editingContent.quality_score,
        })
        setImageUrl(editingContent.image_url)
        setContentType(editingContent.content_type)
      } else {
        // 新建模式：重置表单
        form.resetFields()
        setImageUrl('')
        setContentType('')
      }
    }
  }, [visible, editingContent, form])

  const handleSubmit = async (values: FormData) => {
    if (!imageUrl) {
      toast.error('请上传图片')
      return
    }

    const baseData = {
      title: values.title,
      description: values.description,
      content_type: values.content_type,
      display_order: values.display_order,
      is_active: values.is_active,
      quality_score: values.quality_score,
      image_url: imageUrl,
    }

    try {
      if (editingContent) {
        // 更新现有内容
        await updateMutation.mutateAsync({ 
          id: editingContent.id, 
          data: baseData 
        })
      } else {
        // 创建新内容
        const createData = {
          ...baseData,
          view_count: 0,
          like_count: 0,
          share_count: 0,
        }
        
        const { data: newContent } = await createMutation.mutateAsync(createData)
        
        // 根据内容类型创建详细信息
        if (values.content_type === 'styling_tip' && values.tip_content) {
          await StylingTipAPI.create({
            waiting_content_id: newContent.id,
            tip_category: values.tip_category || null,
            tip_content: values.tip_content,
            applicable_seasons: values.applicable_seasons || null,
            applicable_occasions: values.applicable_occasions || null,
            body_types: values.body_types || null,
            difficulty_level: values.difficulty_level || 1,
            color_keywords: values.color_keywords || null,
            style_keywords: values.style_keywords || null,
          })
          toast.success('穿搭小技巧已保存到 waiting_contents 和 styling_tips 表')
        } else if (values.content_type === 'trend_fashion' && values.trend_name) {
          await FashionTrendAPI.create({
            waiting_content_id: newContent.id,
            trend_name: values.trend_name,
            trend_season: values.trend_season || null,
            trend_year: values.trend_year || null,
            color_palette: values.color_palette || null,
            style_tags: values.style_tags || null,
            popularity_score: values.popularity_score || 50,
            trend_description: values.trend_description || null,
            brand_examples: values.brand_examples || null,
            celebrity_examples: values.celebrity_examples || null,
          })
          toast.success('潮流趋势已保存到 waiting_contents 和 fashion_trends 表')
        } else if (values.content_type === 'user_showcase') {
          await UserShowcaseAPI.create({
            waiting_content_id: newContent.id,
            original_look_id: null,
            user_id: null,
            generation_prompt: null,
            style_category: values.style_category || null,
            color_scheme: values.color_scheme || null,
            garment_types: values.garment_types || null,
            is_featured: values.is_featured || false,
            feature_reason: values.feature_reason || null,
            user_rating: values.user_rating || null,
          })
          toast.success('用户作品已保存到 waiting_contents 和 user_showcases 表')
        } else {
          toast.success('基础信息已保存到 waiting_contents 表')
        }
      }
    } catch (error) {
      console.error('提交失败:', error)
    }
  }

  const handleImageUpload = async (file: File) => {
    setUploading(true)
    try {
      const url = await FileUploadAPI.uploadImage(file)
      setImageUrl(url)
      toast.success('图片上传成功')
    } catch (error: any) {
      toast.error(`图片上传失败: ${error.message}`)
    } finally {
      setUploading(false)
    }
  }

  const renderContentTypeSpecificFields = () => {
    const contentType = form.getFieldValue('content_type')
    
    if (contentType === 'styling_tip') {
      return (
        <div className="space-y-4">
          <Form.Item name="tip_category" label="技巧分类">
            <Select placeholder="选择分类">
              <Option value="色彩搭配">色彩搭配</Option>
              <Option value="身材修饰">身材修饰</Option>
              <Option value="配饰技巧">配饰技巧</Option>
              <Option value="场合穿搭">场合穿搭</Option>
              <Option value="季节搭配">季节搭配</Option>
            </Select>
          </Form.Item>
          
          <Form.Item name="tip_content" label="技巧内容" rules={[{ required: true }]}>
            <TextArea rows={4} placeholder="详细描述穿搭技巧..." />
          </Form.Item>
          
          <Form.Item name="difficulty_level" label="难度等级">
            <InputNumber min={1} max={5} placeholder="1-5" />
          </Form.Item>
          
          <Form.Item name="applicable_seasons" label="适用季节">
            <Select mode="multiple" placeholder="选择适用季节">
              <Option value="春季">春季</Option>
              <Option value="夏季">夏季</Option>
              <Option value="秋季">秋季</Option>
              <Option value="冬季">冬季</Option>
            </Select>
          </Form.Item>
          
          <Form.Item name="applicable_occasions" label="适用场合">
            <Select mode="multiple" placeholder="选择适用场合">
              <Option value="日常">日常</Option>
              <Option value="工作">工作</Option>
              <Option value="约会">约会</Option>
              <Option value="聚会">聚会</Option>
              <Option value="旅行">旅行</Option>
            </Select>
          </Form.Item>
        </div>
      )
    }
    
    if (contentType === 'trend_fashion') {
      return (
        <div className="space-y-4">
          <Form.Item name="trend_name" label="趋势名称" rules={[{ required: true }]}>
            <Input placeholder="输入趋势名称" />
          </Form.Item>
          
          <Form.Item name="trend_description" label="趋势描述">
            <TextArea rows={4} placeholder="详细描述流行趋势..." />
          </Form.Item>
          
          <Form.Item name="trend_season" label="流行季节">
            <Select placeholder="选择季节">
              <Option value="春夏">春夏</Option>
              <Option value="秋冬">秋冬</Option>
              <Option value="全年">全年</Option>
            </Select>
          </Form.Item>
          
          <Form.Item name="trend_year" label="流行年份">
            <InputNumber min={2020} max={2030} placeholder="2024" />
          </Form.Item>
          
          <Form.Item name="popularity_score" label="流行度评分">
            <InputNumber min={0} max={100} placeholder="0-100" />
          </Form.Item>
          
          <Form.Item name="color_palette" label="主要色彩">
            <Select mode="tags" placeholder="输入颜色关键词">
              <Option value="红色">红色</Option>
              <Option value="蓝色">蓝色</Option>
              <Option value="绿色">绿色</Option>
              <Option value="黄色">黄色</Option>
              <Option value="紫色">紫色</Option>
            </Select>
          </Form.Item>
          
          <Form.Item name="style_tags" label="风格标签">
            <Select mode="tags" placeholder="输入风格关键词">
              <Option value="简约">简约</Option>
              <Option value="复古">复古</Option>
              <Option value="街头">街头</Option>
              <Option value="优雅">优雅</Option>
              <Option value="休闲">休闲</Option>
            </Select>
          </Form.Item>
        </div>
      )
    }
    
    if (contentType === 'user_showcase') {
      return (
        <div className="space-y-4">
          <Form.Item name="style_category" label="风格分类">
            <Select placeholder="选择风格分类">
              <Option value="法式优雅">法式优雅</Option>
              <Option value="街头潮流">街头潮流</Option>
              <Option value="职场干练">职场干练</Option>
              <Option value="休闲随性">休闲随性</Option>
              <Option value="甜美可爱">甜美可爱</Option>
            </Select>
          </Form.Item>
          
          <Form.Item name="is_featured" label="是否精选" valuePropName="checked">
            <Switch />
          </Form.Item>
          
          <Form.Item name="feature_reason" label="精选理由">
            <TextArea rows={2} placeholder="为什么选择这个作品..." />
          </Form.Item>
          
          <Form.Item name="user_rating" label="用户评分">
            <InputNumber min={1} max={5} placeholder="1-5星" />
          </Form.Item>
          
          <Form.Item name="color_scheme" label="配色方案">
            <Select mode="tags" placeholder="输入主要颜色">
              <Option value="黑白灰">黑白灰</Option>
              <Option value="大地色">大地色</Option>
              <Option value="莫兰迪色">莫兰迪色</Option>
            </Select>
          </Form.Item>
          
          <Form.Item name="garment_types" label="服装类型">
            <Select mode="tags" placeholder="输入服装类型">
              <Option value="风衣">风衣</Option>
              <Option value="毛衣">毛衣</Option>
              <Option value="连衣裙">连衣裙</Option>
              <Option value="牛仔裤">牛仔裤</Option>
            </Select>
          </Form.Item>
        </div>
      )
    }
    
    return null
  }

  const getModalTitle = () => {
    if (editingContent) return '编辑内容'
    
    switch (contentType) {
      case 'styling_tip': return '添加穿搭小技巧到 styling_tips 表'
      case 'trend_fashion': return '添加潮流趋势到 fashion_trends 表'
      case 'user_showcase': return '添加用户作品到 user_showcases 表'
      default: return '添加新内容'
    }
  }

  return (
    <Modal
      title={getModalTitle()}
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={800}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          display_order: 0,
          is_active: true,
          quality_score: 50,
          difficulty_level: 1,
          popularity_score: 50,
          user_rating: 5,
        }}
      >
        <Tabs defaultActiveKey="basic">
          <TabPane tab="基础信息" key="basic">
            <div className="space-y-4">
              {contentType && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="text-sm text-blue-600">
                    <strong>数据存储位置：</strong>
                    <div className="mt-1">
                      • 基础信息 → waiting_contents 表
                      {contentType === 'styling_tip' && ' • 详细信息 → styling_tips 表'}
                      {contentType === 'trend_fashion' && ' • 详细信息 → fashion_trends 表'}
                      {contentType === 'user_showcase' && ' • 详细信息 → user_showcases 表'}
                    </div>
                  </div>
                </div>
              )}
              
              <Form.Item name="title" label="标题" rules={[{ required: true }]}>
                <Input placeholder="输入内容标题" />
              </Form.Item>
              
              <Form.Item name="description" label="描述">
                <TextArea rows={3} placeholder="输入内容描述" />
              </Form.Item>
              
              <Form.Item name="content_type" label="内容类型" rules={[{ required: true }]}>
                <Select 
                  placeholder="选择内容类型"
                  onChange={(value) => setContentType(value)}
                >
                  <Option value="styling_tip">穿搭小技巧 → styling_tips 表</Option>
                  <Option value="trend_fashion">潮流趋势 → fashion_trends 表</Option>
                  <Option value="user_showcase">用户作品 → user_showcases 表</Option>
                </Select>
              </Form.Item>
              
              <div className="grid grid-cols-3 gap-4">
                <Form.Item name="display_order" label="显示顺序">
                  <InputNumber min={0} placeholder="排序" className="w-full" />
                </Form.Item>
                
                <Form.Item name="quality_score" label="质量评分">
                  <InputNumber min={0} max={100} placeholder="0-100" className="w-full" />
                </Form.Item>
                
                <Form.Item name="is_active" label="是否启用" valuePropName="checked">
                  <Switch />
                </Form.Item>
              </div>
              
              <Form.Item label="图片" rules={[{ required: true }]}>
                <ImageUploadArea
                  imageUrl={imageUrl}
                  uploading={uploading}
                  onUpload={handleImageUpload}
                  onRemove={() => setImageUrl('')}
                />
              </Form.Item>
            </div>
          </TabPane>
          
          <TabPane tab="详细信息" key="details">
            {renderContentTypeSpecificFields()}
          </TabPane>
        </Tabs>
        
        <div className="flex justify-end space-x-2 mt-6 pt-4 border-t">
          <Button onClick={onCancel}>取消</Button>
          <Button 
            type="primary" 
            htmlType="submit"
            loading={createMutation.isLoading || updateMutation.isLoading}
          >
            {editingContent ? '更新' : '创建'}
          </Button>
        </div>
      </Form>
    </Modal>
  )
}
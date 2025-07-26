import { supabase, supabaseAdmin, WaitingContent, StylingTip, FashionTrend, UserShowcase } from './supabase'

// 等待内容 CRUD 操作
export class WaitingContentAPI {
  // 获取所有等待内容
  static async getAll(filters?: {
    content_type?: string
    is_active?: boolean
    search?: string
  }) {
    let query = supabaseAdmin
      .from('waiting_contents')
      .select(`
        *,
        styling_tips(*),
        fashion_trends(*),
        user_showcases(*),
        waiting_content_tags(
          content_tags(*)
        )
      `)
      .order('display_order')

    if (filters?.content_type) {
      query = query.eq('content_type', filters.content_type)
    }
    if (filters?.is_active !== undefined) {
      query = query.eq('is_active', filters.is_active)
    }
    if (filters?.search) {
      query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
    }

    return query
  }

  // 获取单个内容
  static async getById(id: string) {
    return supabaseAdmin
      .from('waiting_contents')
      .select(`
        *,
        styling_tips(*),
        fashion_trends(*),
        user_showcases(*),
        waiting_content_tags(
          content_tags(*)
        )
      `)
      .eq('id', id)
      .single()
  }

  // 创建新内容
  static async create(data: Omit<WaitingContent, 'id' | 'created_at' | 'updated_at'>) {
    return supabaseAdmin
      .from('waiting_contents')
      .insert(data)
      .select()
      .single()
  }

  // 更新内容
  static async update(id: string, data: Partial<WaitingContent>) {
    return supabaseAdmin
      .from('waiting_contents')
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
  }

  // 删除内容
  static async delete(id: string) {
    return supabaseAdmin
      .from('waiting_contents')
      .delete()
      .eq('id', id)
  }

  // 批量更新排序
  static async updateOrder(items: { id: string; display_order: number }[]) {
    const promises = items.map(item =>
      supabaseAdmin
        .from('waiting_contents')
        .update({ display_order: item.display_order })
        .eq('id', item.id)
    )
    return Promise.all(promises)
  }

  // 切换激活状态
  static async toggleActive(id: string) {
    const { data: current } = await supabaseAdmin
      .from('waiting_contents')
      .select('is_active')
      .eq('id', id)
      .single()

    if (!current) throw new Error('内容不存在')

    return supabaseAdmin
      .from('waiting_contents')
      .update({ is_active: !current.is_active })
      .eq('id', id)
      .select()
      .single()
  }
}

// 穿搭小技巧 API
export class StylingTipAPI {
  static async create(data: Omit<StylingTip, 'id' | 'created_at'>) {
    return supabaseAdmin
      .from('styling_tips')
      .insert(data)
      .select()
      .single()
  }

  static async update(id: string, data: Partial<StylingTip>) {
    return supabaseAdmin
      .from('styling_tips')
      .update(data)
      .eq('id', id)
      .select()
      .single()
  }

  static async delete(id: string) {
    return supabaseAdmin
      .from('styling_tips')
      .delete()
      .eq('id', id)
  }
}

// 潮流趋势 API
export class FashionTrendAPI {
  static async create(data: Omit<FashionTrend, 'id' | 'created_at'>) {
    return supabaseAdmin
      .from('fashion_trends')
      .insert(data)
      .select()
      .single()
  }

  static async update(id: string, data: Partial<FashionTrend>) {
    return supabaseAdmin
      .from('fashion_trends')
      .update(data)
      .eq('id', id)
      .select()
      .single()
  }

  static async delete(id: string) {
    return supabaseAdmin
      .from('fashion_trends')
      .delete()
      .eq('id', id)
  }
}

// 用户作品 API
export class UserShowcaseAPI {
  static async create(data: Omit<UserShowcase, 'id' | 'created_at'>) {
    return supabaseAdmin
      .from('user_showcases')
      .insert(data)
      .select()
      .single()
  }

  static async update(id: string, data: Partial<UserShowcase>) {
    return supabaseAdmin
      .from('user_showcases')
      .update(data)
      .eq('id', id)
      .select()
      .single()
  }

  static async delete(id: string) {
    return supabaseAdmin
      .from('user_showcases')
      .delete()
      .eq('id', id)
  }
}

// 文件上传 API
export class FileUploadAPI {
  static async uploadImage(file: File, bucket: string = 'waiting-content-images'): Promise<string> {
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
    const filePath = `${fileName}`

    const { error: uploadError } = await supabaseAdmin.storage
      .from(bucket)
      .upload(filePath, file)

    if (uploadError) {
      throw new Error(`上传失败: ${uploadError.message}`)
    }

    const { data } = supabaseAdmin.storage
      .from(bucket)
      .getPublicUrl(filePath)

    return data.publicUrl
  }

  static async deleteImage(url: string, bucket: string = 'waiting-content-images') {
    // 从URL中提取文件路径
    const urlParts = url.split('/')
    const fileName = urlParts[urlParts.length - 1]

    const { error } = await supabaseAdmin.storage
      .from(bucket)
      .remove([fileName])

    if (error) {
      throw new Error(`删除失败: ${error.message}`)
    }
  }
}

// 统计数据 API
export class AnalyticsAPI {
  // 获取内容统计
  static async getContentStats() {
    const { data: totalContents } = await supabaseAdmin
      .from('waiting_contents')
      .select('id', { count: 'exact' })

    const { data: activeContents } = await supabaseAdmin
      .from('waiting_contents')
      .select('id', { count: 'exact' })
      .eq('is_active', true)

    const { data: viewStats } = await supabaseAdmin
      .from('waiting_contents')
      .select('view_count, like_count, share_count')

    const totalViews = viewStats?.reduce((sum, item) => sum + (item.view_count || 0), 0) || 0
    const totalLikes = viewStats?.reduce((sum, item) => sum + (item.like_count || 0), 0) || 0
    const totalShares = viewStats?.reduce((sum, item) => sum + (item.share_count || 0), 0) || 0

    return {
      totalContents: totalContents?.length || 0,
      activeContents: activeContents?.length || 0,
      totalViews,
      totalLikes,
      totalShares
    }
  }

  // 获取内容类型分布
  static async getContentTypeDistribution() {
    const { data } = await supabaseAdmin
      .from('waiting_contents')
      .select('content_type')

    const distribution = data?.reduce((acc, item) => {
      acc[item.content_type] = (acc[item.content_type] || 0) + 1
      return acc
    }, {} as Record<string, number>) || {}

    return [
      { name: '穿搭小技巧', value: distribution.styling_tip || 0, type: 'styling_tip' },
      { name: '潮流趋势', value: distribution.trend_fashion || 0, type: 'trend_fashion' },
      { name: '用户作品', value: distribution.user_showcase || 0, type: 'user_showcase' }
    ]
  }

  // 获取热门内容
  static async getPopularContents(limit: number = 10) {
    return supabaseAdmin
      .from('waiting_contents')
      .select('id, title, content_type, view_count, like_count, share_count')
      .order('view_count', { ascending: false })
      .limit(limit)
  }

  // 获取展示日志统计
  static async getDisplayLogStats(days: number = 7) {
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    const { data } = await supabaseAdmin
      .from('content_display_logs')
      .select('display_time, interaction_type')
      .gte('display_time', startDate.toISOString())

    // 按天分组统计
    const dailyStats = data?.reduce((acc, log) => {
      const date = new Date(log.display_time).toISOString().split('T')[0]
      if (!acc[date]) {
        acc[date] = { date, views: 0, likes: 0, shares: 0, skips: 0 }
      }
      
      if (log.interaction_type === 'view') acc[date].views++
      else if (log.interaction_type === 'like') acc[date].likes++
      else if (log.interaction_type === 'share') acc[date].shares++
      else if (log.interaction_type === 'skip') acc[date].skips++
      
      return acc
    }, {} as Record<string, any>) || {}

    return Object.values(dailyStats)
  }
}
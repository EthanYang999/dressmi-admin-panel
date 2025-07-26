import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// 客户端 - 用于前端操作
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// 服务端客户端 - 用于管理员操作，绕过RLS
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

// 数据库类型定义
export interface WaitingContent {
  id: string
  title: string
  description: string | null
  image_url: string
  content_type: 'styling_tip' | 'trend_fashion' | 'user_showcase'
  display_order: number
  is_active: boolean
  view_count: number
  like_count: number
  share_count: number
  quality_score: number
  created_at: string
  updated_at: string
}

export interface StylingTip {
  id: string
  waiting_content_id: string
  tip_category: string | null
  tip_content: string
  applicable_seasons: string[] | null
  applicable_occasions: string[] | null
  body_types: string[] | null
  difficulty_level: number
  color_keywords: string[] | null
  style_keywords: string[] | null
  created_at: string
}

export interface FashionTrend {
  id: string
  waiting_content_id: string
  trend_name: string
  trend_season: string | null
  trend_year: number | null
  color_palette: string[] | null
  style_tags: string[] | null
  popularity_score: number
  trend_description: string | null
  brand_examples: string[] | null
  celebrity_examples: string[] | null
  created_at: string
}

export interface UserShowcase {
  id: string
  waiting_content_id: string
  original_look_id: string | null
  user_id: string | null
  generation_prompt: string | null
  style_category: string | null
  color_scheme: string[] | null
  garment_types: string[] | null
  is_featured: boolean
  feature_reason: string | null
  user_rating: number | null
  created_at: string
}

export interface ContentTag {
  id: string
  name: string
  category: string | null
  color: string | null
  usage_count: number
  is_active: boolean
  created_at: string
}

export interface ContentDisplayLog {
  id: string
  user_id: string | null
  waiting_content_id: string
  session_id: string | null
  display_time: string
  interaction_type: 'view' | 'like' | 'skip' | 'share' | null
  display_duration: number | null
  device_info: any
  created_at: string
}
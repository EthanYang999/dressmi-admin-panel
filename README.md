# DressMi 管理后台

等待内容管理系统 - 专门用于管理AI换装生成等待期间展示的精美内容

## 🎯 功能特性

### 📊 仪表盘
- 实时统计数据展示
- 内容类型分布图表
- 热门内容排行榜
- 最近活动时间线
- 快捷操作面板

### 🖼️ 内容管理
- **全面的内容CRUD操作**
  - 创建、编辑、删除内容
  - 批量操作和状态切换
  - 拖拽排序功能

- **多类型内容支持**
  - 穿搭小技巧 (Styling Tips)
  - 潮流趋势 (Fashion Trends) 
  - 用户作品展示 (User Showcases)

- **智能图片管理**
  - 拖拽上传图片
  - 自动压缩和优化
  - CDN加速访问

### 📈 数据分析
- 浏览量、点赞数、分享数统计
- 内容质量评分系统
- 用户参与度分析
- 趋势数据可视化

### ⚙️ 系统设置
- 内容显示顺序管理
- 质量阈值配置
- 缓存策略设置

## 🚀 快速开始

### 环境要求
- Node.js 18+
- npm 或 yarn
- Supabase 账户

### 安装步骤

1. **克隆项目**
```bash
cd /Users/mikeliu/Desktop/dressmi_1/admin-panel
```

2. **安装依赖**
```bash
npm install
# 或
yarn install
```

3. **环境配置**
```bash
cp .env.local.example .env.local
```

编辑 `.env.local` 文件，填入你的配置：
```env
# Supabase配置
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# 管理员认证
ADMIN_EMAIL=admin@dressmi.com
ADMIN_PASSWORD=your_secure_password
```

4. **数据库初始化**
在 Supabase SQL Editor 中执行 `waiting_content_database.sql` 脚本

5. **创建存储桶**
在 Supabase Storage 中创建：
- `waiting-content-images` (公共访问)

6. **启动开发服务器**
```bash
npm run dev
# 或
yarn dev
```

访问 http://localhost:3001

## 📁 项目结构

```
admin-panel/
├── app/                    # Next.js 13+ App Router
│   ├── contents/          # 内容管理页面
│   ├── analytics/         # 数据分析页面
│   ├── globals.css        # 全局样式
│   ├── layout.tsx         # 根布局
│   ├── page.tsx          # 首页
│   └── providers.tsx      # 全局Provider
├── components/            # React组件
│   ├── layout/           # 布局组件
│   │   └── AdminLayout.tsx
│   ├── dashboard/        # 仪表盘组件
│   │   ├── Dashboard.tsx
│   │   ├── ContentTypeChart.tsx
│   │   ├── PopularContentsList.tsx
│   │   └── RecentActivities.tsx
│   └── contents/         # 内容管理组件
│       ├── ContentManagement.tsx
│       ├── ContentFormModal.tsx
│       ├── ContentPreviewModal.tsx
│       └── ImageUploadArea.tsx
├── lib/                  # 工具库
│   ├── supabase.ts      # Supabase客户端配置
│   └── api.ts           # API接口封装
├── public/              # 静态资源
└── package.json         # 项目配置
```

## 🔧 核心技术栈

- **前端框架**: Next.js 14 (App Router)
- **UI组件库**: Ant Design 5.x
- **样式方案**: Tailwind CSS
- **状态管理**: React Query
- **数据库**: Supabase (PostgreSQL)
- **文件存储**: Supabase Storage
- **图表库**: Recharts
- **类型检查**: TypeScript

## 📊 数据库设计

### 核心表结构
- `waiting_contents` - 等待内容主表
- `styling_tips` - 穿搭小技巧详细表
- `fashion_trends` - 潮流趋势详细表
- `user_showcases` - 用户作品展示表
- `content_tags` - 内容标签表
- `user_content_preferences` - 用户偏好表
- `content_display_logs` - 展示记录表

### API函数
- `get_personalized_waiting_content()` - 个性化内容推荐
- `log_content_display()` - 记录展示日志
- `update_user_preferences()` - 更新用户偏好

## 🎨 使用指南

### 添加新内容
1. 点击"添加内容"按钮
2. 选择内容类型（穿搭技巧/潮流趋势/用户作品）
3. 填写基础信息和详细信息
4. 上传高质量图片
5. 设置显示顺序和质量评分
6. 保存发布

### 内容管理最佳实践
- **图片要求**: 建议 16:9 或 3:4 比例，分辨率至少 800x600
- **标题长度**: 建议 10-30 字符
- **描述内容**: 50-200 字符，简洁有吸引力
- **质量评分**: 根据内容质量、图片清晰度、文案质量综合评定
- **显示顺序**: 数字越小越靠前，建议间隔10进行排序

### 数据分析使用
- 查看内容表现数据
- 识别热门内容特征
- 优化内容策略
- 监控用户参与度

## 🔒 安全注意事项

- 管理后台仅限内部使用
- 定期更新管理员密码
- 图片上传有大小和格式限制
- 所有API调用都有权限验证
- 敏感操作有二次确认

## 🚀 部署指南

### Vercel部署
1. 连接GitHub仓库
2. 设置环境变量
3. 自动构建部署

### 自定义服务器
```bash
npm run build
npm run start
```

## 📞 技术支持

如有问题，请联系：
- 技术支持: tech@dressmi.com
- 功能建议: feedback@dressmi.com

## 📜 更新日志

### v1.0.0 (2024-01-20)
- ✨ 初始版本发布
- 📊 仪表盘功能
- 🖼️ 内容管理系统
- 📈 数据分析功能
- 🔧 系统设置面板
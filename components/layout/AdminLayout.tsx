'use client'

import React, { useState } from 'react'
import { Layout, Menu, Button, Avatar, Dropdown, Typography, Space } from 'antd'
import { 
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DashboardOutlined,
  FileImageOutlined,
  BarChartOutlined,
  SettingOutlined,
  UserOutlined,
  LogoutOutlined
} from '@ant-design/icons'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const { Header, Sider, Content } = Layout
const { Title } = Typography

interface AdminLayoutProps {
  children: React.ReactNode
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()

  // 菜单项配置
  const menuItems = [
    {
      key: '/',
      icon: <DashboardOutlined />,
      label: <Link href="/">仪表盘</Link>,
    },
    {
      key: '/contents',
      icon: <FileImageOutlined />,
      label: <Link href="/contents">内容管理</Link>,
    },
    {
      key: '/analytics',
      icon: <BarChartOutlined />,
      label: <Link href="/analytics">数据分析</Link>,
    },
    {
      key: '/settings',
      icon: <SettingOutlined />,
      label: <Link href="/settings">系统设置</Link>,
    },
  ]

  // 用户菜单
  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人资料',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      danger: true,
    },
  ]

  const handleUserMenuClick = ({ key }: { key: string }) => {
    if (key === 'logout') {
      // 处理退出登录
      console.log('退出登录')
    }
  }

  return (
    <Layout className="min-h-screen">
      {/* 侧边栏 */}
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={collapsed}
        theme="dark"
        width={260}
      >
        <div className="flex items-center justify-center h-16 border-b border-gray-700">
          <Title 
            level={4} 
            className="text-white m-0"
            style={{ color: 'white' }}
          >
            {collapsed ? 'DM' : 'DressMi 管理'}
          </Title>
        </div>
        
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[pathname]}
          items={menuItems}
          className="border-r-0"
        />
      </Sider>

      {/* 主体布局 */}
      <Layout>
        {/* 顶部导航 */}
        <Header className="bg-white px-4 flex items-center justify-between shadow-sm">
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            className="text-lg w-16 h-16"
          />

          <Space>
            <Dropdown 
              menu={{ 
                items: userMenuItems,
                onClick: handleUserMenuClick 
              }}
              placement="bottomRight"
            >
              <Button type="text" className="flex items-center">
                <Avatar icon={<UserOutlined />} size="small" />
                <span className="ml-2">管理员</span>
              </Button>
            </Dropdown>
          </Space>
        </Header>

        {/* 内容区域 */}
        <Content className="m-6 p-6 bg-white rounded-lg shadow-sm min-h-[calc(100vh-112px)]">
          {children}
        </Content>
      </Layout>
    </Layout>
  )
}
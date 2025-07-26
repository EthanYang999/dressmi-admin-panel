'use client'

import { Layout } from 'antd'
import { AdminLayout } from '@/components/layout/AdminLayout'
import { Dashboard } from '@/components/dashboard/Dashboard'

export default function HomePage() {
  return (
    <AdminLayout>
      <Dashboard />
    </AdminLayout>
  )
}
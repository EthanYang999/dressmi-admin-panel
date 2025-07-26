'use client'

import React from 'react'
import { AdminLayout } from '@/components/layout/AdminLayout'
import { ContentManagement } from '@/components/contents/ContentManagement'

export default function ContentsPage() {
  return (
    <AdminLayout>
      <ContentManagement />
    </AdminLayout>
  )
}
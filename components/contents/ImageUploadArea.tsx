'use client'

import React, { useCallback } from 'react'
import { Button, Image, Spin } from 'antd'
import { UploadOutlined, DeleteOutlined, LoadingOutlined } from '@ant-design/icons'
import { useDropzone } from 'react-dropzone'
import toast from 'react-hot-toast'

interface ImageUploadAreaProps {
  imageUrl: string
  uploading: boolean
  onUpload: (file: File) => void
  onRemove: () => void
}

export function ImageUploadArea({ 
  imageUrl, 
  uploading, 
  onUpload, 
  onRemove 
}: ImageUploadAreaProps) {
  
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file) return

    // 检查文件类型
    if (!file.type.startsWith('image/')) {
      toast.error('请选择图片文件')
      return
    }

    // 检查文件大小 (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('图片大小不能超过 5MB')
      return
    }

    onUpload(file)
  }, [onUpload])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    multiple: false,
    disabled: uploading
  })

  if (imageUrl && !uploading) {
    return (
      <div className="relative inline-block">
        <Image
          src={imageUrl}
          alt="上传的图片"
          width={200}
          height={150}
          className="rounded-lg border object-cover"
          fallback="https://via.placeholder.com/200x150?text=加载失败"
        />
        <Button
          type="primary"
          danger
          size="small"
          icon={<DeleteOutlined />}
          className="absolute -top-2 -right-2"
          onClick={onRemove}
        >
          删除
        </Button>
      </div>
    )
  }

  return (
    <div
      {...getRootProps()}
      className={`
        border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all
        ${isDragActive 
          ? 'border-blue-400 bg-blue-50' 
          : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
        }
        ${uploading ? 'pointer-events-none opacity-60' : ''}
      `}
    >
      <input {...getInputProps()} />
      
      {uploading ? (
        <div className="space-y-2">
          <Spin 
            indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} 
          />
          <p className="text-gray-600">上传中...</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="text-4xl text-gray-400">
            <UploadOutlined />
          </div>
          <div>
            <p className="text-lg font-medium text-gray-700 mb-1">
              {isDragActive ? '放开以上传图片' : '点击或拖拽图片到此处'}
            </p>
            <p className="text-sm text-gray-500">
              支持 JPG、PNG、GIF、WebP 格式，最大 5MB
            </p>
          </div>
          <Button type="primary" icon={<UploadOutlined />}>
            选择图片
          </Button>
        </div>
      )}
    </div>
  )
}
"use client"

import type React from "react"
import { useQuery } from "@tanstack/react-query"

import { MainLayout } from "@/components/main-layout"
import { ContentDetailSection } from "@/components/content-detail-section"
import { ChatSection } from "@/components/chat-section"
import { ViewerListSection } from "@/components/viewer-list-section"
import { contentService } from "@/services/contentService"

interface WatchPageProps {
  contentId: string
}

export default function WatchPage({ contentId }: WatchPageProps) {
  // 콘텐츠 상세 정보 조회
  const { data: content, isLoading, error } = useQuery({
    queryKey: ['content', contentId],
    queryFn: () => contentService.getContentById(parseInt(contentId))
  })

  // 로딩 상태
  if (isLoading) {
    return (
      <MainLayout activeRoute="/contents">
        <div className="flex items-center justify-center min-h-64">
          <div className="text-gray-500">콘텐츠 정보를 불러오는 중...</div>
        </div>
      </MainLayout>
    )
  }

  // 에러 상태
  if (error || !content) {
    return (
      <MainLayout activeRoute="/contents">
        <div className="flex items-center justify-center min-h-64">
          <div className="text-red-500">콘텐츠를 불러오는데 실패했습니다.</div>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout activeRoute="/contents">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-7rem)]">
        {/* Left Column - Main Content Area */}
        <div className="lg:col-span-3 space-y-6">
          {/* Content Detail Section */}
          <ContentDetailSection content={content} />
          
          {/* Real-time Chat Section */}
          <ChatSection roomId={contentId} roomType="content" />
        </div>

        {/* Right Column - Viewer List */}
        <div className="lg:col-span-1">
          <ViewerListSection roomId={contentId} roomType="content" />
        </div>
      </div>
    </MainLayout>
  )
}
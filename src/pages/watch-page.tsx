"use client"

import type React from "react"
import { useQuery } from "@tanstack/react-query"
import { useEffect } from "react"

import { MainLayout } from "@/components/main-layout"
import { ContentDetailSection } from "@/components/content-detail-section"
import { ChatSection } from "@/components/chat-section"
import { ViewerListSection } from "@/components/viewer-list-section"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent } from "@/components/ui/card"
import { AlertCircle, Users, MessageCircle } from "lucide-react"
import { contentService } from "@/services/contentService"
import { useLiveWatch } from "@/hooks/useLiveWatch"
import { QUERY_KEYS } from "@/lib/constants"

interface WatchPageProps {
  contentId: string
}

export default function WatchPage({ contentId }: WatchPageProps) {
  const contentIdNum = parseInt(contentId)
  
  // 콘텐츠 상세 정보 조회
  const { data: content, isLoading, error } = useQuery({
    queryKey: QUERY_KEYS.CONTENT(contentIdNum),
    queryFn: () => contentService.getContentById(contentIdNum)
  })

  // LiveWatch 실시간 채팅 훅
  const {
    connectionState,
    isConnected,
    roomInfo,
    roomId,
    messages,
    sendMessage,
    loadMoreMessages,
    hasMoreMessages,
    isLoadingMessages,
    participants,
    participantCount,
    joinRoom,
    leaveRoom,
    isJoining,
    isLeaving,
    error: liveWatchError,
    clearError
  } = useLiveWatch({ 
    contentId: contentIdNum, 
    autoConnect: true 
  })

  // 콘텐츠가 로드되면 자동으로 방 참여
  useEffect(() => {
    if (content && isConnected && !roomInfo && !isJoining) {
      joinRoom()
    }
  }, [content, isConnected, roomInfo, isJoining]) // joinRoom 의존성 제거

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
      <div className="space-y-6">
        {/* LiveWatch Error Alert */}
        {liveWatchError && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              <span>{liveWatchError}</span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={clearError}
              >
                닫기
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Connection Status */}
        {!isConnected && (
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-3 w-3 bg-yellow-500 rounded-full animate-pulse" />
                  <span className="text-sm text-gray-600">
                    실시간 채팅에 연결하는 중...
                  </span>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={joinRoom}
                  disabled={isJoining || !isConnected}
                >
                  {isJoining ? "참여 중..." : "다시 시도"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Room Info */}
        {roomInfo && (
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <MessageCircle className="h-4 w-4 text-purple-600" />
                    <span className="text-sm font-medium">{roomInfo.title}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-gray-600">
                      {participantCount}명 참여 중
                    </span>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={leaveRoom}
                  disabled={isLeaving}
                >
                  {isLeaving ? "나가는 중..." : "방 나가기"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-12rem)]">
          {/* Left Column - Main Content Area */}
          <div className="lg:col-span-3 space-y-6">
            {/* Content Detail Section */}
            <ContentDetailSection content={content} />
            
            {/* Real-time Chat Section */}
            <ChatSection 
              contentId={contentIdNum}
              roomType="content"
              messages={messages}
              isConnected={isConnected}
              connectionError={liveWatchError}
              onSendMessage={sendMessage}
              onLoadMore={loadMoreMessages}
              hasMoreMessages={hasMoreMessages}
              isLoadingMessages={isLoadingMessages}
            />
          </div>

          {/* Right Column - Viewer List */}
          <div className="lg:col-span-1">
            <ViewerListSection 
              contentId={contentIdNum}
              roomType="content"
              participants={participants}
              participantCount={participantCount}
              isConnected={isConnected}
              isLoading={isJoining}
            />
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { format } from "date-fns"
import { ko } from "date-fns/locale"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Send, User, Wifi, WifiOff, AlertCircle, MoreVertical } from "lucide-react"
import { ChatMessage, MessageType } from "@/types/livewatch"

interface ChatSectionProps {
  contentId: number
  roomType: "content" | "youtube"
  className?: string
  messages: ChatMessage[]
  isConnected: boolean
  connectionError: string | null
  onSendMessage: (content: string) => void
  onLoadMore?: () => void
  hasMoreMessages?: boolean
  isLoadingMessages?: boolean
}

export function ChatSection({ 
  contentId, 
  roomType, 
  className = "",
  messages,
  isConnected,
  connectionError,
  onSendMessage,
  onLoadMore,
  hasMoreMessages = false,
  isLoadingMessages = false
}: ChatSectionProps) {
  const [chatMessage, setChatMessage] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  // 새 메시지가 도착하면 스크롤을 맨 아래로
  useEffect(() => {
    if (messagesEndRef.current && messages.length > 0) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages.length])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (chatMessage.trim() && isConnected) {
      onSendMessage(chatMessage.trim())
      setChatMessage("")
    }
  }

  const formatMessageTime = (sentAt: string) => {
    try {
      return format(new Date(sentAt), "HH:mm:ss", { locale: ko })
    } catch {
      return ""
    }
  }

  const getMessageTypeDisplay = (message: ChatMessage) => {
    switch (message.messageType) {
      case MessageType.JOIN:
        return (
          <div className="flex justify-center my-2">
            <Badge variant="secondary" className="text-xs">
              {message.userName}님이 입장했습니다
            </Badge>
          </div>
        )
      case MessageType.LEAVE:
        return (
          <div className="flex justify-center my-2">
            <Badge variant="outline" className="text-xs">
              {message.userName}님이 나갔습니다
            </Badge>
          </div>
        )
      default:
        return (
          <div className="flex items-start gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/placeholder.svg" alt={message.userName} />
              <AvatarFallback className="bg-purple-100">
                <User className="h-4 w-4 text-purple-600" />
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-medium text-gray-900 truncate">
                  {message.userName}
                </span>
                <span className="text-xs text-gray-500">
                  {formatMessageTime(message.sentAt)}
                </span>
              </div>
              <p className="text-sm text-gray-700 break-words">{message.content}</p>
            </div>
          </div>
        )
    }
  }

  return (
    <Card className={`flex-1 ${className}`} style={{ minHeight: '600px' }}>
      <CardContent className="p-6 flex flex-col" style={{ height: '600px' }}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">실시간 채팅</h3>
          <div className="flex items-center gap-2">
            {isConnected ? (
              <div className="flex items-center gap-1 text-green-600">
                <Wifi className="h-4 w-4" />
                <span className="text-xs">연결됨</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 text-red-600">
                <WifiOff className="h-4 w-4" />
                <span className="text-xs">연결 안됨</span>
              </div>
            )}
          </div>
        </div>

        {/* Connection Error */}
        {connectionError && (
          <Alert className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{connectionError}</AlertDescription>
          </Alert>
        )}

        {/* Chat Messages */}
        <ScrollArea ref={scrollAreaRef} className="flex-1 mb-4 pr-4">
          <div className="space-y-3">
            {/* Load More Button */}
            {hasMoreMessages && (
              <div className="flex justify-center py-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onLoadMore}
                  disabled={isLoadingMessages}
                  className="text-purple-600 hover:text-purple-700"
                >
                  {isLoadingMessages ? (
                    <>
                      <MoreVertical className="h-4 w-4 mr-2 animate-spin" />
                      로딩 중...
                    </>
                  ) : (
                    "이전 메시지 보기"
                  )}
                </Button>
              </div>
            )}
            
            {/* Messages */}
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-32 text-gray-500">
                <div className="text-center">
                  <div className="text-sm">아직 메시지가 없습니다.</div>
                  <div className="text-xs mt-1">첫 번째 메시지를 보내보세요!</div>
                </div>
              </div>
            ) : (
              messages.map((message) => (
                <div key={`${message.id}-${message.sentAt}`}>
                  {getMessageTypeDisplay(message)}
                </div>
              ))
            )}
            
            {/* Scroll anchor */}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Chat Input */}
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <Input
            value={chatMessage}
            onChange={(e) => setChatMessage(e.target.value)}
            placeholder={isConnected ? "메시지를 입력해주세요." : "연결을 기다리는 중..."}
            className="flex-1"
            disabled={!isConnected}
            maxLength={500}
          />
          <Button 
            type="submit" 
            size="icon" 
            className="bg-purple-600 hover:bg-purple-700"
            disabled={!isConnected || !chatMessage.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
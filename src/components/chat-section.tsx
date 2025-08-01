"use client"

import type React from "react"
import { useState } from "react"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Send, User } from "lucide-react"

// Mock Data for Chat (will be replaced with real-time data later)
const mockChatMessages = [
  { user: { name: "woody", avatar: "/avatars/woody.png" }, message: "전개가 흥미롭네요." },
  { user: { name: "buzz", avatar: "/avatars/buzz.png" }, message: "완전 동의합니다!" },
  { user: { name: "jessie", avatar: "/avatars/jessie.png" }, message: "이 장면 정말 인상적이에요" },
  { user: { name: "woody", avatar: "/avatars/woody.png" }, message: "음악도 정말 좋네요" },
  { user: { name: "rex", avatar: "/avatars/rex.png" }, message: "과학적 고증이 대단해요" },
]

interface ChatSectionProps {
  roomId: string
  roomType: "content" | "youtube"
  className?: string
}

export function ChatSection({ roomId, roomType, className = "" }: ChatSectionProps) {
  const [chatMessage, setChatMessage] = useState("")

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (chatMessage.trim()) {
      // TODO: 실시간 채팅 WebSocket 구현 시 실제 메시지 전송
      console.log(`Sending message to ${roomType} room ${roomId}:`, chatMessage)
      setChatMessage("")
    }
  }

  return (
    <Card className={`flex-1 ${className}`} style={{ minHeight: '600px' }}>
      <CardContent className="p-6 flex flex-col" style={{ height: '600px' }}>
        <h3 className="text-lg font-semibold mb-4">실시간 채팅</h3>

        {/* Chat Messages */}
        <ScrollArea className="flex-1 mb-4 pr-4">
          <div className="space-y-3">
            {mockChatMessages.map((chat, index) => (
              <div key={index} className="flex items-start gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={chat.user.avatar || "/placeholder.svg"} alt={chat.user.name} />
                  <AvatarFallback className="bg-purple-100">
                    <User className="h-4 w-4 text-purple-600" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-gray-900">{chat.user.name}</span>
                  </div>
                  <p className="text-sm text-gray-700">{chat.message}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Chat Input */}
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <Input
            value={chatMessage}
            onChange={(e) => setChatMessage(e.target.value)}
            placeholder="메시지를 입력해주세요."
            className="flex-1"
          />
          <Button type="submit" size="icon" className="bg-purple-600 hover:bg-purple-700">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
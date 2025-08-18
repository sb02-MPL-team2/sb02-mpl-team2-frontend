"use client"

import type React from "react"
import { useState } from "react"

import { MainLayout } from "@/components/main-layout"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send } from "lucide-react"

// Mock Data
const mockChatHistory = [
  { sender: "them", text: "안녕하세요! woody님 플레이리스트 잘 보고 있습니다.", timestamp: "오후 2:30" },
  { sender: "me", text: "아, 안녕하세요! 좋게 봐주셔서 감사합니다.", timestamp: "오후 2:31" },
  { sender: "them", text: "혹시 영화 추천 하나만 해주실 수 있나요?", timestamp: "오후 2:31" },
  { sender: "me", text: "물론이죠! 최근에 본 영화 중에서는 '인터스텔라'를 추천드려요.", timestamp: "오후 2:32" },
  {
    sender: "them",
    text: "오, 인터스텔라! 저도 정말 좋아하는 영화예요. 시간 여행 관련 다른 영화도 있나요?",
    timestamp: "오후 2:33",
  },
  {
    sender: "me",
    text: "네! '어바웃 타임'이나 '그라운드호그 데이'도 정말 좋아요. 제 플레이리스트에 있으니 한번 보세요!",
    timestamp: "오후 2:34",
  },
]

const otherUserName = "woody" // This would come from props or API in real implementation

interface ChatPageProps {
  userId: string
}

export default function ChatPage({ userId }: ChatPageProps) {
  const [message, setMessage] = useState("")
  const [chatHistory, setChatHistory] = useState(mockChatHistory)

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim()) {
      const newMessage = {
        sender: "me" as const,
        text: message.trim(),
        timestamp: new Date().toLocaleTimeString("ko-KR", {
          hour: "numeric",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        }),
      }
      setChatHistory([...chatHistory, newMessage])
      setMessage("")
    }
  }

  return (
    <MainLayout activeRoute="/profiles">
      <div className="max-w-4xl mx-auto h-[calc(100vh-8rem)] flex flex-col">
        {/* Chat Header */}
        <div className="border-b border-gray-200 pb-4 mb-4">
          <h2 className="text-2xl font-bold text-gray-900">{otherUserName}님과의 대화</h2>
        </div>

        {/* Message Display Area */}
        <ScrollArea className="flex-1 pr-4 mb-4">
          <div className="space-y-4">
            {chatHistory.map((msg, index) => (
              <div key={index} className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    msg.sender === "me"
                      ? "bg-purple-600 text-white"
                      : "bg-gray-200 text-gray-900 border border-gray-300"
                  }`}
                >
                  <p className="text-sm leading-relaxed">{msg.text}</p>
                  <p className={`text-xs mt-1 ${msg.sender === "me" ? "text-purple-100" : "text-gray-500"}`}>
                    {msg.timestamp}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Message Input Form */}
        <form onSubmit={handleSendMessage} className="flex gap-2 items-end">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="메시지를 입력하세요..."
            className="flex-1 min-h-[60px] max-h-[120px] resize-none"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleSendMessage(e)
              }
            }}
          />
          <Button
            type="submit"
            size="icon"
            className="h-[60px] w-[60px] bg-purple-600 hover:bg-purple-700"
            disabled={!message.trim()}
          >
            <Send className="h-5 w-5" />
          </Button>
        </form>
      </div>
    </MainLayout>
  )
}
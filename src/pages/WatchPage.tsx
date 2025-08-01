"use client"

import type React from "react"
import { useState } from "react"
import { Link } from "react-router-dom"

import { MainLayout } from "@/components/main-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, ImageIcon, Send, Search, User } from "lucide-react"

// Mock Data
const contentDetail = {
  id: 1,
  title: "인터스텔라",
  category: "영화",
  rating: 4.9,
  reviewCount: "987",
  description:
    "인류의 새로운 보금자리를 찾아 떠나는 우주 탐험 서사시. 지구의 종말이 다가오는 가운데, 전직 NASA 조종사 쿠퍼는 인류를 구하기 위한 비밀 임무에 참여하게 됩니다. 시간과 공간을 초월한 감동적인 이야기가 펼쳐집니다.",
}

const chatMessages = [
  { user: { name: "woody", avatar: "/avatars/woody.png" }, message: "전개가 흥미롭네요." },
  { user: { name: "buzz", avatar: "/avatars/buzz.png" }, message: "완전 동의합니다!" },
  { user: { name: "jessie", avatar: "/avatars/jessie.png" }, message: "이 장면 정말 인상적이에요" },
  { user: { name: "woody", avatar: "/avatars/woody.png" }, message: "음악도 정말 좋네요" },
  { user: { name: "rex", avatar: "/avatars/rex.png" }, message: "과학적 고증이 대단해요" },
]

const viewers = [
  { name: "woody", avatar: "/avatars/woody.png" },
  { name: "buzz", avatar: "/avatars/buzz.png" },
  { name: "jessie", avatar: "/avatars/jessie.png" },
  { name: "rex", avatar: "/avatars/rex.png" },
  { name: "slinky", avatar: "/avatars/slinky.png" },
  { name: "hamm", avatar: "/avatars/hamm.png" },
]

interface WatchPageProps {
  contentId: string
}

export default function WatchPage({ contentId }: WatchPageProps) {
  const [chatMessage, setChatMessage] = useState("")
  const [searchQuery, setSearchQuery] = useState("")

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (chatMessage.trim()) {
      console.log("Sending message:", chatMessage)
      setChatMessage("")
    }
  }

  const handleAddToPlaylist = () => {
    console.log("Adding to playlist:", contentDetail.title)
    alert("플레이리스트에 추가되었습니다!")
  }

  const filteredViewers = viewers.filter((viewer) => viewer.name.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <MainLayout activeRoute="/contents">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-7rem)]">
        {/* Left Column - Main Content Area */}
        <div className="lg:col-span-3 space-y-6">
          {/* Content Info Section */}
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Video/Image Placeholder */}
                <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
                  <ImageIcon className="h-16 w-16 text-gray-400" />
                </div>

                {/* Content Details */}
                <div className="space-y-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{contentDetail.title}</h2>
                    <p className="text-purple-600 font-medium">{contentDetail.category}</p>
                  </div>

                  <Link
                    to={`/review/${contentDetail.id}`}
                    className="inline-flex items-center gap-1 hover:opacity-80 transition-opacity"
                  >
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="font-medium">{contentDetail.rating}</span>
                    <span className="text-gray-500">({contentDetail.reviewCount})</span>
                  </Link>

                  <Button onClick={handleAddToPlaylist} className="bg-purple-600 hover:bg-purple-700">
                    내 플레이리스트에 추가하기
                  </Button>

                  <p className="text-gray-600 text-sm leading-relaxed">{contentDetail.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Real-time Chat Section */}
          <Card className="flex-1">
            <CardContent className="p-6 h-full flex flex-col">
              <h3 className="text-lg font-semibold mb-4">실시간 채팅</h3>

              {/* Chat Messages */}
              <ScrollArea className="flex-1 mb-4 pr-4">
                <div className="space-y-3">
                  {chatMessages.map((chat, index) => (
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
        </div>

        {/* Right Column - Viewer List */}
        <div className="lg:col-span-1">
          <Card className="h-full">
            <CardContent className="p-6 h-full flex flex-col">
              <div className="space-y-4 mb-4">
                <h3 className="text-lg font-semibold">{viewers.length}명 시청 중</h3>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="사용자 검색"
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Viewers List */}
              <ScrollArea className="flex-1">
                <div className="space-y-2">
                  {filteredViewers.map((viewer, index) => (
                    <div key={index} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={viewer.avatar || "/placeholder.svg"} alt={viewer.name} />
                        <AvatarFallback className="bg-purple-100">
                          <User className="h-4 w-4 text-purple-600" />
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium text-gray-900">{viewer.name}</span>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  )
}
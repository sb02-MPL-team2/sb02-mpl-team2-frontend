"use client"

import type React from "react"
import { useState } from "react"

import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, User } from "lucide-react"

// Mock Data for Viewers (will be replaced with real-time data later)
const mockViewers = [
  { name: "woody", avatar: "/avatars/woody.png" },
  { name: "buzz", avatar: "/avatars/buzz.png" },
  { name: "jessie", avatar: "/avatars/jessie.png" },
  { name: "rex", avatar: "/avatars/rex.png" },
  { name: "slinky", avatar: "/avatars/slinky.png" },
  { name: "hamm", avatar: "/avatars/hamm.png" },
]

interface ViewerListSectionProps {
  roomId: string
  roomType: "content" | "youtube"
  className?: string
}

export function ViewerListSection({ roomId, roomType, className = "" }: ViewerListSectionProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredViewers = mockViewers.filter((viewer) => 
    viewer.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <Card className={`h-full ${className}`}>
      <CardContent className="p-6 h-full flex flex-col">
        <div className="space-y-4 mb-4">
          <h3 className="text-lg font-semibold">{filteredViewers.length}명 시청 중</h3>
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
  )
}
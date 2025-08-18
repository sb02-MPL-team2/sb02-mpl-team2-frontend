"use client"

import type React from "react"
import { useState, useMemo } from "react"
import { format } from "date-fns"
import { ko } from "date-fns/locale"

import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Search, User, Clock } from "lucide-react"
import { Participant } from "@/types/livewatch"

interface ViewerListSectionProps {
  contentId: number
  roomType: "content" | "youtube"
  className?: string
  participants: Participant[]
  participantCount: number
  isConnected: boolean
  isLoading?: boolean
}

export function ViewerListSection({ 
  contentId, 
  roomType, 
  className = "",
  participants,
  participantCount,
  isConnected,
  isLoading = false
}: ViewerListSectionProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredParticipants = useMemo(() => {
    if (!searchQuery.trim()) return participants
    
    return participants.filter((participant) => 
      participant.userName.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [participants, searchQuery])

  const formatJoinTime = (participatedAt: string) => {
    try {
      return format(new Date(participatedAt), "HH:mm", { locale: ko })
    } catch {
      return ""
    }
  }

  const renderParticipantSkeleton = () => (
    <div className="space-y-2">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="flex items-center gap-3 p-2">
          <Skeleton className="h-8 w-8 rounded-full" />
          <div className="flex-1">
            <Skeleton className="h-4 w-20 mb-1" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
      ))}
    </div>
  )

  return (
    <Card className={`h-full ${className}`}>
      <CardContent className="p-6 h-full flex flex-col">
        <div className="space-y-4 mb-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">
              {participantCount}명 시청 중
            </h3>
            <Badge 
              variant={isConnected ? "default" : "secondary"}
              className={isConnected ? "bg-green-600" : ""}
            >
              {isConnected ? "온라인" : "오프라인"}
            </Badge>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="사용자 검색"
              className="pl-10"
              disabled={!isConnected}
            />
          </div>
          
          {searchQuery && (
            <div className="text-sm text-gray-600">
              {filteredParticipants.length}명 검색됨
            </div>
          )}
        </div>

        {/* Participants List */}
        <ScrollArea className="flex-1">
          {isLoading ? (
            renderParticipantSkeleton()
          ) : filteredParticipants.length === 0 ? (
            <div className="flex items-center justify-center h-32 text-gray-500">
              <div className="text-center">
                {searchQuery ? (
                  <>
                    <div className="text-sm">검색 결과가 없습니다.</div>
                    <div className="text-xs mt-1">다른 키워드로 검색해보세요.</div>
                  </>
                ) : (
                  <>
                    <div className="text-sm">아직 참여자가 없습니다.</div>
                    <div className="text-xs mt-1">첫 번째 시청자가 되어보세요!</div>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredParticipants.map((participant) => (
                <div 
                  key={participant.userId} 
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage 
                      src={participant.profileUrl || "/placeholder.svg"} 
                      alt={participant.userName} 
                    />
                    <AvatarFallback className="bg-purple-100">
                      <User className="h-4 w-4 text-purple-600" />
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-900 truncate">
                        {participant.userName}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Clock className="h-3 w-3" />
                      <span>
                        {formatJoinTime(participant.participatedAt)} 입장
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
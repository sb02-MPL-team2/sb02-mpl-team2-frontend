"use client"

import { Link } from "react-router-dom"
import { Card, CardContent } from "@/components/ui/card"
import { PlaylistDto } from "@/types"

interface PlaylistCardProps {
  playlist: PlaylistDto & {
    isSubscribed?: boolean
  }
}

export function PlaylistCard({ playlist }: PlaylistCardProps) {
  return (
    <Link to={`/playlist/${playlist.id}`} className="block">
      <Card className="h-full hover:shadow-lg transition-shadow duration-200 cursor-pointer">
        <CardContent className="p-6 space-y-4 h-full flex flex-col">
          {/* Title */}
          <h3 className="text-xl font-bold text-gray-900 line-clamp-2 flex-shrink-0">{playlist.title}</h3>

          {/* Content Summary */}
          <p className="text-gray-700 line-clamp-2 flex-1">{playlist.description}</p>

          {/* Meta Information */}
          <div className="space-y-1 flex-shrink-0">
            <p className="text-sm text-gray-500">
              {new Date(playlist.updatedAt).toLocaleDateString('ko-KR')} 업데이트
            </p>
            <p className="text-sm text-gray-500">
              {playlist.subscriberCount}명이 구독중
            </p>
            <p className="text-sm text-gray-500">
              {playlist.trackCount || playlist.items.length}개의 콘텐츠
            </p>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

"use client"

import { Link } from "react-router-dom"
import { Card, CardContent } from "@/components/ui/card"

interface PlaylistCardProps {
  playlist: {
    id: string
    title: string
    contentSummary: string
    lastUpdated: string
    subscriberCount: string
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
          <p className="text-gray-700 line-clamp-2 flex-1">{playlist.contentSummary}</p>

          {/* Meta Information */}
          <div className="space-y-1 flex-shrink-0">
            <p className="text-sm text-gray-500">{playlist.lastUpdated}</p>
            <p className="text-sm text-gray-500">{playlist.subscriberCount}</p>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

"use client"

import type React from "react"
import { useState } from "react"
import { Link } from "react-router-dom"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Star, ImageIcon } from "lucide-react"
import { AddToPlaylistDialog } from "@/components/add-to-playlist-dialog"
import type { Content } from "@/types"

interface ContentDetailSectionProps {
  content: Content
}

export function ContentDetailSection({ content }: ContentDetailSectionProps) {
  const [isPlaylistDialogOpen, setIsPlaylistDialogOpen] = useState(false)

  const handleAddToPlaylist = () => {
    setIsPlaylistDialogOpen(true)
  }

  return (
    <>
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Content Image */}
            <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
              {content.imageUrl ? (
                <img 
                  src={content.imageUrl} 
                  alt={content.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <ImageIcon className="h-16 w-16 text-gray-400" />
              )}
            </div>

            {/* Content Details */}
            <div className="space-y-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{content.title}</h2>
                <p className="text-purple-600 font-medium">{content.category}</p>
              </div>

              <Link
                to={`/review/${content.id}`}
                className="inline-flex items-center gap-1 hover:opacity-80 transition-opacity"
              >
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <span className="font-medium">{content.totalRating?.toFixed(1) || '0.0'}</span>
                <span className="text-gray-500">({content.reviewCount || 0})</span>
              </Link>

              <div className="mt-2">
                <Button onClick={handleAddToPlaylist} className="bg-purple-600 hover:bg-purple-700">
                  내 플레이리스트에 추가하기
                </Button>
              </div>

              <p className="text-gray-600 text-sm leading-relaxed">{content.description}</p>
              
              <div className="text-sm text-gray-500">
                <span>조회수: {(content.watchCount || 0).toLocaleString()}회</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AddToPlaylistDialog */}
      <AddToPlaylistDialog
        content={content}
        open={isPlaylistDialogOpen}
        onOpenChange={setIsPlaylistDialogOpen}
      />
    </>
  )
}
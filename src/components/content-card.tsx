"use client"
import { useState } from "react"
import { Link } from "react-router-dom"
import { Card, CardContent } from "@/components/ui/card"
import { Star, ImageIcon, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AddToPlaylistDialog } from "@/components/add-to-playlist-dialog"
import { Content } from "@/types"

interface ContentCardProps {
  content: Content
}

export function ContentCard({ content }: ContentCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-200 cursor-pointer relative">
      <Link to={`/watch/${content.id}`} className="block">
        {/* Image */}
        <div className="aspect-video bg-gray-200 flex items-center justify-center">
          {content.imageUrl ? (
            <img 
              src={content.imageUrl} 
              alt={content.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <ImageIcon className="h-12 w-12 text-gray-400" />
          )}
        </div>

        <CardContent className="p-4 space-y-3">
          {/* Category */}
          <div className="text-sm font-medium text-purple-600">{content.category}</div>

          {/* Title */}
          <h3 className="text-lg font-bold text-gray-900 line-clamp-1">{content.title}</h3>

          {/* Description */}
          <p className="text-sm text-gray-600 line-clamp-2">{content.description}</p>

          {/* Rating Section */}
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="text-sm font-medium text-gray-900">{content.totalRating}</span>
            <span className="text-sm text-gray-500">({content.reviewCount})</span>
          </div>

          {/* Viewer Count */}
          <p className="text-xs text-gray-500">지금 {content.watchCount}명이 보고 있어요.</p>
        </CardContent>
      </Link>

      {/* Add to Playlist Button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute bottom-2 right-2 h-8 w-8 bg-white/80 hover:bg-white shadow-sm"
        onClick={(e) => {
          e.stopPropagation() // Prevent navigation when clicking the button
          e.preventDefault() // Prevent default link behavior
          setIsDialogOpen(true)
        }}
      >
        <ShoppingCart className="h-4 w-4 text-gray-600" />
      </Button>

      {/* Add to Playlist Dialog */}
      <AddToPlaylistDialog
        content={content}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </Card>
  )
}

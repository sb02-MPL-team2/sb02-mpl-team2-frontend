"use client"
import { useState } from "react"
import { Link } from "react-router-dom"
import { Card, CardContent } from "@/components/ui/card"
import { Star, ImageIcon, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ContentCardProps {
  content: {
    id: number
    category: string
    title: string
    description: string
    rating: number
    reviewCount: string
    viewerCount: string
  }
}

// Mock data for user's playlists
const mockMyPlaylists = [
  { id: "pl1", title: "시간을 다룬 영화" },
  { id: "pl2", title: "인생 명작선" },
  { id: "pl3", title: "가볍게 볼만한 코미디" },
]

export function ContentCard({ content }: ContentCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(null)

  const handleAddToPlaylist = () => {
    if (selectedPlaylistId) {
      const playlist = mockMyPlaylists.find((p) => p.id === selectedPlaylistId)
      console.log(`Adding content "${content.title}" to playlist: "${playlist?.title}" (ID: ${selectedPlaylistId})`)
      alert(`"${content.title}" 콘텐츠가 "${playlist?.title}" 플레이리스트에 추가되었습니다!`)
      setIsDialogOpen(false)
      setSelectedPlaylistId(null) // Reset selected playlist
    } else {
      alert("플레이리스트를 선택해주세요.")
    }
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-200 cursor-pointer relative">
      <Link to={`/watch/${content.id}`} className="block">
        {/* Image Placeholder */}
        <div className="aspect-video bg-gray-200 flex items-center justify-center">
          <ImageIcon className="h-12 w-12 text-gray-400" />
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
            <span className="text-sm font-medium text-gray-900">{content.rating}</span>
            <span className="text-sm text-gray-500">({content.reviewCount})</span>
          </div>

          {/* Viewer Count */}
          <p className="text-xs text-gray-500">지금 {content.viewerCount}명이 보고 있어요.</p>
        </CardContent>
      </Link>

      {/* Add to Playlist Button (Trigger) */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
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
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>플레이리스트에 추가</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Select onValueChange={setSelectedPlaylistId} value={selectedPlaylistId || ""}>
              <SelectTrigger>
                <SelectValue placeholder="추가할 플레이리스트를 선택하세요..." />
              </SelectTrigger>
              <SelectContent>
                {mockMyPlaylists.length > 0 ? (
                  mockMyPlaylists.map((playlist) => (
                    <SelectItem key={playlist.id} value={playlist.id}>
                      {playlist.title}
                    </SelectItem>
                  ))
                ) : (
                  <div className="p-2 text-center text-gray-500">생성된 플레이리스트가 없습니다.</div>
                )}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              취소
            </Button>
            <Button onClick={handleAddToPlaylist} className="bg-purple-600 hover:bg-purple-700">
              추가
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}

"use client"

import { useState } from "react"
import { MainLayout } from "@/components/main-layout"
import { ContentCard } from "@/components/content-card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { X, User, Clipboard } from "lucide-react" // Added Clipboard icon
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog" // Dialog components
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select" // Select components
import { Input } from "@/components/ui/input" // Input component
import { Label } from "@/components/ui/label" // Label component

// Mock Data
const playlistDetails = {
  id: "pl1",
  title: "시간을 다룬 영화",
  curator: { name: "woody", avatar: "/avatars/woody.png" },
  subscriberCount: 102,
  description: "시간 여행, 타임루프 등 시간을 흥미롭게 다룬 영화들을 모았습니다.",
  contents: [
    {
      id: 1,
      category: "영화",
      title: "인터스텔라",
      description: "인류의 새로운 보금자리를 찾아 떠나는...",
      rating: 4.9,
      reviewCount: "987",
      viewerCount: "123",
    },
    {
      id: 2,
      category: "영화",
      title: "테넷",
      description: "시간의 흐름을 뒤집는 작전",
      rating: 4.7,
      reviewCount: "854",
      viewerCount: "256",
    },
    {
      id: 3,
      category: "영화",
      title: "인셉션",
      description: "타인의 꿈에 들어가 생각을 훔치는...",
      rating: 4.9,
      reviewCount: "1.5k",
      viewerCount: "312",
    },
    {
      id: 4,
      category: "영화",
      title: "어바웃 타임",
      description: "시간을 되돌릴 수 있는 능력을 가진 남자의 이야기",
      rating: 4.8,
      reviewCount: "1.2k",
      viewerCount: "189",
    },
    {
      id: 5,
      category: "영화",
      title: "그라운드호그 데이",
      description: "같은 하루를 반복해서 살게 된 남자",
      rating: 4.6,
      reviewCount: "743",
      viewerCount: "98",
    },
    {
      id: 6,
      category: "영화",
      title: "루퍼",
      description: "미래에서 온 자신을 죽여야 하는 킬러",
      rating: 4.5,
      reviewCount: "621",
      viewerCount: "145",
    },
  ],
}

// Mock data for followers
const mockMyFollowers = [
  { id: "user2", name: "buzz" },
  { id: "user3", name: "jessie" },
]

interface PlaylistDetailPageProps {
  playlistId: string
}

export default function PlaylistDetailPage({ playlistId }: PlaylistDetailPageProps) {
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false)
  const [selectedFollowerId, setSelectedFollowerId] = useState<string | null>(null)

  const handleSubscribe = () => {
    console.log("Subscribing to playlist:", playlistDetails.title)
    alert("플레이리스트를 구독했습니다!")
  }

  const handleRemoveContent = (contentId: number) => {
    console.log("Removing content from playlist:", contentId)
    alert(`콘텐츠가 플레이리스트에서 제거되었습니다.`)
  }

  const handleShareToFollower = () => {
    if (selectedFollowerId) {
      const follower = mockMyFollowers.find((f) => f.id === selectedFollowerId)
      console.log(`Sharing playlist to follower: ${follower?.name} (ID: ${selectedFollowerId})`)
      alert(`${follower?.name}님에게 플레이리스트를 공유했습니다!`)
      setIsShareDialogOpen(false)
      setSelectedFollowerId(null)
    } else {
      alert("공유할 팔로워를 선택해주세요.")
    }
  }

  const handleCopyLink = () => {
    const playlistShareLink = window.location.href // Get current URL
    navigator.clipboard.writeText(playlistShareLink)
    alert("플레이리스트 링크가 클립보드에 복사되었습니다!")
  }

  // Construct the share link dynamically
  const playlistShareLink = typeof window !== "undefined" ? `${window.location.origin}/playlist/${playlistId}` : ""

  return (
    <MainLayout activeRoute="/playlists">
      <div className="space-y-8 max-w-6xl mx-auto">
        {/* Top Section - Playlist Information */}
        <div className="space-y-6">
          {/* Title and Action Buttons */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h1 className="text-4xl font-bold text-gray-900">{playlistDetails.title}</h1>
            <div className="flex items-center gap-3">
              {" "}
              {/* Group for action buttons */}
              <Button onClick={handleSubscribe} className="bg-purple-600 hover:bg-purple-700">
                구독하기
              </Button>
              <Dialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-purple-600 hover:bg-purple-700">공유하기</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>플레이리스트 공유</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    {/* Section 1: Share to Followers */}
                    <div className="space-y-2">
                      <Label htmlFor="share-follower">팔로워에게 공유하기</Label>
                      <div className="flex gap-2">
                        <Select onValueChange={setSelectedFollowerId} value={selectedFollowerId || ""}>
                          <SelectTrigger id="share-follower">
                            <SelectValue placeholder="팔로워를 선택하세요..." />
                          </SelectTrigger>
                          <SelectContent>
                            {mockMyFollowers.length > 0 ? (
                              mockMyFollowers.map((follower) => (
                                <SelectItem key={follower.id} value={follower.id}>
                                  {follower.name}
                                </SelectItem>
                              ))
                            ) : (
                              <div className="p-2 text-center text-gray-500">팔로워가 없습니다.</div>
                            )}
                          </SelectContent>
                        </Select>
                        <Button onClick={handleShareToFollower}>보내기</Button>
                      </div>
                    </div>

                    {/* Section 2: Share with Link */}
                    <div className="space-y-2">
                      <Label htmlFor="share-link">링크로 공유하기</Label>
                      <div className="flex gap-2">
                        <Input id="share-link" readOnly value={playlistShareLink} className="flex-1" />
                        <Button size="icon" onClick={handleCopyLink}>
                          <Clipboard className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsShareDialogOpen(false)}>
                      닫기
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Curator Info */}
          <div className="flex items-center gap-3">
            <span className="text-gray-700 font-medium">큐레이터</span>
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={playlistDetails.curator.avatar || "/placeholder.svg"}
                alt={playlistDetails.curator.name}
              />
              <AvatarFallback className="bg-purple-100">
                <User className="h-4 w-4 text-purple-600" />
              </AvatarFallback>
            </Avatar>
            <span className="text-gray-900 font-medium">{playlistDetails.curator.name}</span>
          </div>

          {/* Subscriber Count */}
          <span className="text-gray-600">구독자: {playlistDetails.subscriberCount}명</span>

          {/* Description */}
          <div className="space-y-2">
            <span className="text-gray-700 font-medium">설명</span>
            <p className="text-gray-600 leading-relaxed">{playlistDetails.description}</p>
          </div>
        </div>

        {/* Bottom Section - Content List */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">콘텐츠 목록</h2>

          {/* Content Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {playlistDetails.contents.map((content) => (
              <div key={content.id} className="relative group">
                <ContentCard content={content} />
                {/* Remove Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 h-8 w-8 bg-white/80 hover:bg-white shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  onClick={(e) => {
                    e.preventDefault() // Prevent navigation when clicking the X button
                    handleRemoveContent(content.id)
                  }}
                >
                  <X className="h-4 w-4 text-gray-600" />
                </Button>
              </div>
            ))}
          </div>

          {/* Empty State (when no contents) */}
          {playlistDetails.contents.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">이 플레이리스트에는 아직 콘텐츠가 없습니다.</p>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  )
}
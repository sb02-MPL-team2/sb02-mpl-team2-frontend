"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Link } from "react-router-dom"
import { MainLayout } from "@/components/main-layout"
import { ContentCard } from "@/components/content-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { X, User, Clipboard } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { playlistService } from "@/services/playlistService"
import { userService } from "@/services/userService"
import { followService } from "@/services/followService"
import { useAuthStore } from "@/stores/authStore"
import { QUERY_KEYS } from "@/lib/constants"


interface PlaylistDetailPageProps {
  playlistId: string
}

export default function PlaylistDetailPage({ playlistId }: PlaylistDetailPageProps) {
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false)
  const [selectedFollowerId, setSelectedFollowerId] = useState<string | null>(null)
  const { user } = useAuthStore()
  const queryClient = useQueryClient()

  // 플레이리스트 상세 정보 조회
  const { data: playlist, isLoading: isLoadingPlaylist, error: playlistError } = useQuery({
    queryKey: QUERY_KEYS.PLAYLIST(parseInt(playlistId)),
    queryFn: () => playlistService.getPlaylistById(parseInt(playlistId))
  })

  // 구독한 플레이리스트 목록 조회
  const { data: subscribedPlaylists = [] } = useQuery({
    queryKey: QUERY_KEYS.SUBSCRIBED_PLAYLISTS,
    queryFn: () => playlistService.getSubscribedPlaylists(),
    enabled: !!user // 사용자가 로그인된 경우에만 조회
  })

  // 플레이리스트 생성자 정보는 playlist.profile에서 가져옴
  const creator = playlist?.profile

  // 내 팔로워 목록 조회 (공유용)
  const { data: myFollowersResponse } = useQuery({
    queryKey: QUERY_KEYS.FOLLOWERS(user?.id || 0),
    queryFn: () => user ? followService.getFollowers(user.id, undefined, 100) : Promise.resolve({ userList: [], nextCursor: null, hasNext: false }),
    enabled: !!user?.id && isShareDialogOpen // 공유 다이얼로그가 열릴 때만 조회
  })

  const myFollowers = myFollowersResponse?.userList || []

  // 플레이리스트 구독/구독해제 mutation
  const subscribeMutation = useMutation({
    mutationFn: playlistService.subscribePlaylist,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SUBSCRIBED_PLAYLISTS })
      alert('플레이리스트를 구독했습니다!')
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || '구독에 실패했습니다.')
    }
  })

  const unsubscribeMutation = useMutation({
    mutationFn: playlistService.unsubscribePlaylist,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SUBSCRIBED_PLAYLISTS })
      alert('플레이리스트 구독을 해제했습니다!')
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || '구독 해제에 실패했습니다.')
    }
  })

  // 콘텐츠 제거 mutation
  const removeContentMutation = useMutation({
    mutationFn: ({ playlistId, contentId }: { playlistId: number, contentId: number }) => 
      playlistService.removeContentFromPlaylist(playlistId, contentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PLAYLIST(parseInt(playlistId)) })
      alert('콘텐츠가 플레이리스트에서 제거되었습니다.')
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || '콘텐츠 제거에 실패했습니다.')
    }
  })

  const isSubscribed = subscribedPlaylists.some(sp => sp.id === parseInt(playlistId))
  const isOwner = user?.id === playlist?.userId

  const handleSubscribe = () => {
    if (!user) {
      alert('로그인이 필요합니다.')
      return
    }
    
    if (isSubscribed) {
      unsubscribeMutation.mutate(parseInt(playlistId))
    } else {
      subscribeMutation.mutate(parseInt(playlistId))
    }
  }

  const handleRemoveContent = (contentId: number) => {
    if (!isOwner && user?.id !== creator?.id) {
      alert('플레이리스트 소유자만 콘텐츠를 제거할 수 있습니다.')
      return
    }
    
    removeContentMutation.mutate({ 
      playlistId: parseInt(playlistId), 
      contentId 
    })
  }

  const handleShareToFollower = () => {
    if (selectedFollowerId) {
      const follower = myFollowers.find((f) => f.id.toString() === selectedFollowerId)
      console.log(`Sharing playlist to follower: ${follower?.username} (ID: ${selectedFollowerId})`)
      alert(`${follower?.username}님에게 플레이리스트를 공유했습니다!`)
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

  // 로딩 상태
  if (isLoadingPlaylist) {
    return (
      <MainLayout activeRoute="/playlists">
        <div className="flex items-center justify-center min-h-64">
          <div className="text-gray-500">플레이리스트 정보를 불러오는 중...</div>
        </div>
      </MainLayout>
    )
  }

  // 에러 상태
  if (playlistError || !playlist) {
    return (
      <MainLayout activeRoute="/playlists">
        <div className="flex items-center justify-center min-h-64">
          <div className="text-red-500">플레이리스트를 찾을 수 없습니다.</div>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout activeRoute="/playlists">
      <div className="space-y-8 max-w-6xl mx-auto">
        {/* Top Section - Playlist Information */}
        <div className="space-y-6">
          {/* Title and Action Buttons */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h1 className="text-4xl font-bold text-gray-900">{playlist.title}</h1>
            <div className="flex items-center gap-3">
              {/* 구독 버튼 - 소유자는 비표시 */}
              {!isOwner && (
                <Button 
                  onClick={handleSubscribe} 
                  disabled={subscribeMutation.isPending || unsubscribeMutation.isPending}
                  className={isSubscribed ? "bg-gray-600 hover:bg-gray-700" : "bg-purple-600 hover:bg-purple-700"}
                >
                  {subscribeMutation.isPending || unsubscribeMutation.isPending 
                    ? "처리 중..." 
                    : isSubscribed ? "구독 해제" : "구독하기"}
                </Button>
              )}
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
                            {myFollowers.length > 0 ? (
                              myFollowers.map((follower) => (
                                <SelectItem key={follower.id} value={follower.id.toString()}>
                                  {follower.username}
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

          {/* Curator Info and Description Card */}
          <Card>
            <CardContent className="p-6">
              <div className="space-y-6">
                {/* Curator Info */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="text-gray-700 font-medium">큐레이터</span>
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={creator?.profileUrl || "/placeholder.svg"}
                        alt={creator?.username || 'Unknown'}
                      />
                      <AvatarFallback className="bg-purple-100">
                        <User className="h-4 w-4 text-purple-600" />
                      </AvatarFallback>
                    </Avatar>
                    {creator ? (
                      <Link 
                        to={`/profile/${creator.id}`}
                        className="text-gray-900 font-medium hover:text-purple-600 hover:underline transition-colors cursor-pointer"
                      >
                        {creator.username}
                      </Link>
                    ) : (
                      <span className="text-gray-900 font-medium">로딩 중...</span>
                    )}
                  </div>
                  
                  <div className="text-gray-600">구독자: {playlist.subscriberCount}명</div>
                </div>

                {/* Description */}
                <div className="space-y-3">
                  <h3 className="text-gray-700 font-medium">설명</h3>
                  <p className="text-gray-600 leading-relaxed">{playlist.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Section - Content List */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">콘텐츠 목록</h2>

          {/* Content Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {playlist.contentResponseDtoList.map((content, index) => {
              const item = playlist.items[index]; // 해당 인덱스의 아이템 정보
              return (
                <div key={content.id} className="relative group">
                  <ContentCard content={content} />
                  {/* Remove Button - 소유자이거나 큐레이터가 본인일 때만 표시 */}
                  {(isOwner || user?.id === creator?.id) && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 h-8 w-8 bg-white/80 hover:bg-white shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      onClick={(e) => {
                        e.preventDefault() // Prevent navigation when clicking the X button
                        handleRemoveContent(content.id)
                      }}
                      disabled={removeContentMutation.isPending}
                    >
                      <X className="h-4 w-4 text-gray-600" />
                    </Button>
                  )}
                </div>
              )
            })}
          </div>

          {/* Empty State (when no contents) */}
          {playlist.contentResponseDtoList.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">이 플레이리스트에는 아직 콘텐츠가 없습니다.</p>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  )
}
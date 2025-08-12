"use client"

import { useState } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { MainLayout } from "@/components/main-layout"
import { PlaylistCard } from "@/components/playlist-card"
import { CreatePlaylistDialog } from "@/components/create-playlist-dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Plus } from "lucide-react"
import { playlistService } from "@/services/playlistService"
import { useAuthStore } from "@/stores/authStore"
import { QUERY_KEYS } from "@/lib/constants"
import { PlaylistDto } from "@/types"


export default function PlaylistsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [subscriptionFilter, setSubscriptionFilter] = useState("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const { user } = useAuthStore()
  const queryClient = useQueryClient()

  // 모든 공개 플레이리스트 조회 (기본)
  const { data: allPlaylistsResponse, isLoading: isLoadingAllPlaylists, error: allPlaylistsError } = useQuery({
    queryKey: QUERY_KEYS.ALL_PLAYLISTS,
    queryFn: () => playlistService.getAllPlaylists(),
    enabled: subscriptionFilter === "all" || subscriptionFilter === "unsubscribed"
  })

  // 구독한 플레이리스트 조회는 임시로 비활성화 (백엔드 구현 필요)
  const { data: subscribedPlaylists = [], isLoading: isLoadingSubscribed, error: subscribedError } = useQuery({
    queryKey: QUERY_KEYS.SUBSCRIBED_PLAYLISTS,
    queryFn: () => Promise.resolve([]), // 임시로 빈 배열 반환
    enabled: false, // 현재 비활성화
    retry: 1
  })

  // 현재 표시할 플레이리스트 결정
  const allPlaylists = allPlaylistsResponse?.content || []
  const currentPlaylists = subscriptionFilter === "subscribed" ? subscribedPlaylists : allPlaylists
  
  // 직접 필터링 (검색어만 적용)
  const filteredPlaylists = currentPlaylists.filter((playlist) => {
    const matchesSearch =
      playlist.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      playlist.description.toLowerCase().includes(searchQuery.toLowerCase())

    // TODO: "구독 안 한 플레이리스트" 필터는 추후 구현 
    // 현재는 전체 공개 플레이리스트를 보여줌
    
    return matchesSearch
  })

  const isLoading = isLoadingAllPlaylists || isLoadingSubscribed
  const error = allPlaylistsError || subscribedError

  const handlePlaylistCreated = (newPlaylist: PlaylistDto) => {
    // 관련 쿼리 무효화하여 새로 생성된 플레이리스트가 목록에 나타나도록 함
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ALL_PLAYLISTS })
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USER_PLAYLISTS(user?.id || 0) })
    
    alert(`새 플레이리스트 "${newPlaylist.title}"가 생성되었습니다!`)
  }

  return (
    <MainLayout activeRoute="/playlists">
      <div className="space-y-6">
        {/* Page Title */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">플레이리스트</h1>
            <p className="text-gray-600 mt-2">다양한 주제의 플레이리스트를 탐색해보세요.</p>
          </div>
          <Button
            onClick={() => setIsCreateDialogOpen(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            새 플레이리스트 만들기
          </Button>
        </div>

        {/* Filters Section */}
        <div className="flex flex-col md:flex-row gap-4">
          {" "}
          {/* Flex container for filters */}
          {/* Search Bar */}
          <div className="flex-1 space-y-2">
            <Label htmlFor="search" className="text-sm font-medium text-gray-700">
              검색
            </Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="search"
                type="text"
                placeholder="검색어를 입력하세요."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          {/* New Subscription Filter */}
          <div className="flex-1 space-y-2">
            <Label htmlFor="subscription-filter" className="text-sm font-medium text-gray-700">
              구독 상태
            </Label>
            <Select value={subscriptionFilter} onValueChange={setSubscriptionFilter}>
              <SelectTrigger id="subscription-filter">
                <SelectValue placeholder="필터 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체</SelectItem>
                <SelectItem value="subscribed">구독한 플레이리스트</SelectItem>
                <SelectItem value="unsubscribed">구독 안 한 플레이리스트</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center min-h-64">
            <div className="text-gray-500">플레이리스트를 불러오는 중...</div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="flex items-center justify-center min-h-64">
            <div className="text-red-500">플레이리스트를 불러오는데 실패했습니다.</div>
          </div>
        )}

        {/* Playlist Grid */}
        {!isLoading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPlaylists.map((playlist) => {
              // 구독 상태는 현재 필터에 따라 결정
              const isSubscribed = subscriptionFilter === "subscribed" ? true : false
              return (
                <PlaylistCard 
                  key={playlist.id} 
                  playlist={{
                    ...playlist,
                    isSubscribed
                  }} 
                />
              )
            })}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && filteredPlaylists.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">
              {searchQuery || subscriptionFilter !== "all" 
                ? "검색 조건에 맞는 플레이리스트가 없습니다." 
                : "아직 생성된 플레이리스트가 없습니다."}
            </p>
          </div>
        )}
      </div>

      {/* Create Playlist Dialog */}
      <CreatePlaylistDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSuccess={handlePlaylistCreated}
      />
    </MainLayout>
  )
}
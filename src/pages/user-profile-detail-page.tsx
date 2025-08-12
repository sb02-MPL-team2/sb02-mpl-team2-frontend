"use client"

import { Link } from "react-router-dom"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { MainLayout } from "@/components/main-layout"
import { PlaylistCard } from "@/components/playlist-card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { UserRoleBadge } from "@/components/user-role-badge"
import { User, MessageCircle, Users, Heart } from "lucide-react"
import { userService } from "@/services/userService"
import { followService } from "@/services/followService"
import { playlistService } from "@/services/playlistService"
import { useAuthStore } from "@/stores/authStore"
import { QUERY_KEYS } from "@/lib/constants"
import { useState, useMemo } from "react"

interface UserProfileDetailPageProps {
  userId: string
}

export default function UserProfileDetailPage({ userId }: UserProfileDetailPageProps) {
  const { user: currentUser } = useAuthStore()
  const queryClient = useQueryClient()
  const [isFollowingState, setIsFollowingState] = useState(false)

  const userIdNumber = parseInt(userId)
  const isOwnProfile = currentUser?.id === userIdNumber

  // 특정 사용자 정보 조회
  const { data: profileUser, isLoading: isLoadingUser, error: userError } = useQuery({
    queryKey: QUERY_KEYS.USER(userIdNumber),
    queryFn: () => userService.getUserById(userIdNumber),
    enabled: !!userId && userIdNumber > 0,
    retry: 1
  })

  // 해당 사용자의 플레이리스트 조회
  const { data: userPlaylistsResponse, isLoading: isLoadingPlaylists } = useQuery({
    queryKey: ['playlists', 'user', userIdNumber],
    queryFn: () => playlistService.getUserPlaylists(userIdNumber, undefined, 50), // 첫 페이지, 50개
    enabled: !!userId && userIdNumber > 0,
    retry: 1
  })

  const userPlaylists = userPlaylistsResponse?.content || []

  // 해당 사용자가 구독한 플레이리스트 조회 (구독한 플레이리스트는 공개적으로 보이도록)
  const { data: subscribedPlaylists = [], isLoading: isLoadingSubscribed } = useQuery({
    queryKey: QUERY_KEYS.USER_SUBSCRIBED_PLAYLISTS(userIdNumber),
    queryFn: () => playlistService.getSubscribedPlaylistsByUser(userIdNumber),
    enabled: !!userId && userIdNumber > 0,
    retry: 1
  })

  // 특정 사용자에 대한 팔로우 상태 확인 (올바른 API 사용)
  const { data: followStatusResponse } = useQuery({
    queryKey: QUERY_KEYS.FOLLOW_STATUS(userIdNumber),
    queryFn: () => followService.getFollowStatus(userIdNumber),
    enabled: !!currentUser?.id && !isOwnProfile && !!userIdNumber,
    retry: 1
  })

  // 팔로우 상태 계산
  const isFollowing = useMemo(() => {
    if (isOwnProfile) return false
    return followStatusResponse?.isFollowing || false
  }, [followStatusResponse, isOwnProfile])

  // 팔로우/언팔로우 mutation
  const followMutation = useMutation({
    mutationFn: (userId: number) => followService.followUser(userId),
    onSuccess: () => {
      setIsFollowingState(true)
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.FOLLOW_STATUS(userIdNumber) })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USER(userIdNumber) })
    },
    onError: () => {
      alert('팔로우에 실패했습니다.')
    }
  })

  const unfollowMutation = useMutation({
    mutationFn: (userId: number) => followService.unfollowUser(userId),
    onSuccess: () => {
      setIsFollowingState(false)
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.FOLLOW_STATUS(userIdNumber) })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USER(userIdNumber) })
    },
    onError: () => {
      alert('언팔로우에 실패했습니다.')
    }
  })

  const handleFollowClick = () => {
    if (isFollowing || isFollowingState) {
      unfollowMutation.mutate(userIdNumber)
    } else {
      followMutation.mutate(userIdNumber)
    }
  }

  const isFollowLoading = followMutation.isPending || unfollowMutation.isPending
  const finalIsFollowing = isFollowingState || isFollowing

  if (isLoadingUser) {
    return (
      <MainLayout activeRoute="/profiles">
        <div className="text-center py-12">
          <p className="text-gray-500">사용자 정보를 불러오는 중...</p>
        </div>
      </MainLayout>
    )
  }

  if (userError || !profileUser) {
    return (
      <MainLayout activeRoute="/profiles">
        <div className="text-center py-12">
          <p className="text-red-500">사용자를 찾을 수 없습니다.</p>
          <Link to="/profiles" className="text-purple-600 hover:underline mt-4 inline-block">
            사용자 목록으로 돌아가기
          </Link>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout activeRoute="/profiles">
      <div className="space-y-8">
        {/* Profile Header */}
        <Card>
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              {/* Avatar */}
              <Avatar className="h-32 w-32">
                <AvatarImage src={profileUser.profileUrl || "/placeholder.svg"} alt={profileUser.username} />
                <AvatarFallback className="bg-purple-100 text-4xl">
                  <User className="h-16 w-16 text-purple-600" />
                </AvatarFallback>
              </Avatar>

              {/* User Info */}
              <div className="flex-1 text-center md:text-left space-y-4">
                <div>
                  <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                    <h1 className="text-3xl font-bold text-gray-900">{profileUser.username}</h1>
                    {profileUser.role && <UserRoleBadge role={profileUser.role} />}
                  </div>
                  <div className="flex items-center justify-center md:justify-start gap-4 mt-2">
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      팔로워 {profileUser.followerCount}명
                    </Badge>
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Heart className="h-3 w-3" />
                      팔로잉 {profileUser.followingCount}명
                    </Badge>
                  </div>
                </div>

                {/* Action Buttons */}
                {!isOwnProfile && (
                  <div className="flex gap-3 justify-center md:justify-start">
                    <Button
                      onClick={handleFollowClick}
                      variant={finalIsFollowing ? "outline" : "default"}
                      disabled={isFollowLoading}
                      className="flex items-center gap-2"
                    >
                      {isFollowLoading ? "처리 중..." : (finalIsFollowing ? "언팔로우" : "팔로우")}
                    </Button>
                    <Button variant="outline" asChild className="flex items-center gap-2">
                      <Link to={`/chat/${profileUser.id}`}>
                        <MessageCircle className="h-4 w-4" />
                        메시지 보내기
                      </Link>
                    </Button>
                  </div>
                )}

                {isOwnProfile && (
                  <div className="flex gap-3 justify-center md:justify-start">
                    <Button variant="outline" asChild>
                      <Link to="/profile/edit">프로필 수정</Link>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* User's Playlists */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              {isOwnProfile ? "내" : `${profileUser.username}님의`} 플레이리스트
            </h2>
          </div>

          {isLoadingPlaylists && (
            <div className="text-center py-8">
              <p className="text-gray-500">플레이리스트를 불러오는 중...</p>
            </div>
          )}

          {!isLoadingPlaylists && userPlaylists.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">
                {isOwnProfile ? "아직 생성한 플레이리스트가 없습니다." : "아직 공개된 플레이리스트가 없습니다."}
              </p>
            </div>
          )}

          {!isLoadingPlaylists && userPlaylists.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userPlaylists.map((playlist) => (
                <PlaylistCard key={playlist.id} playlist={playlist} />
              ))}
            </div>
          )}
        </div>

        {/* Subscribed Playlists */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              {isOwnProfile ? "구독한" : `${profileUser.username}님이 구독한`} 플레이리스트
            </h2>
          </div>

          {isLoadingSubscribed && (
            <div className="text-center py-8">
              <p className="text-gray-500">구독한 플레이리스트를 불러오는 중...</p>
            </div>
          )}

          {!isLoadingSubscribed && subscribedPlaylists.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">
                {isOwnProfile ? "아직 구독한 플레이리스트가 없습니다." : "아직 구독한 플레이리스트가 없습니다."}
              </p>
            </div>
          )}

          {!isLoadingSubscribed && subscribedPlaylists.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {subscribedPlaylists.map((playlist) => (
                <PlaylistCard key={playlist.id} playlist={playlist} />
              ))}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  )
}
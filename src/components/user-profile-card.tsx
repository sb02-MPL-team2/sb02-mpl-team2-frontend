"use client"

import type React from "react"
import { useState } from "react"
import { Link } from "react-router-dom"
import { useMutation, useQueryClient } from "@tanstack/react-query"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { UserRoleBadge } from "@/components/user-role-badge"
import { User } from "lucide-react"
import { followService } from "@/services/followService"
import { QUERY_KEYS } from "@/lib/constants"
import { useAuthStore } from "@/stores/authStore"

interface UserProfileCardProps {
  user: {
    id: string
    username: string
    avatar: string
    followerCount: number
    role?: 'ADMIN' | 'USER'
    isFollowing: boolean // Add isFollowing to props
  }
}

export function UserProfileCard({ user }: UserProfileCardProps) {
  const [isFollowingState, setIsFollowingState] = useState(user.isFollowing)
  const queryClient = useQueryClient()
  const { user: currentUser } = useAuthStore()

  // 팔로우/언팔로우 mutation
  const followMutation = useMutation({
    mutationFn: (userId: number) => followService.followUser(userId),
    onSuccess: () => {
      setIsFollowingState(true)
      // 팔로잉 목록과 사용자 목록 갱신
      queryClient.invalidateQueries({ queryKey: ['following', currentUser?.id] })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USERS })
    },
    onError: () => {
      alert('팔로우에 실패했습니다.')
    }
  })

  const unfollowMutation = useMutation({
    mutationFn: (userId: number) => followService.unfollowUser(userId),
    onSuccess: () => {
      setIsFollowingState(false)
      // 팔로잉 목록과 사용자 목록 갱신
      queryClient.invalidateQueries({ queryKey: ['following', currentUser?.id] })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USERS })
    },
    onError: () => {
      alert('언팔로우에 실패했습니다.')
    }
  })

  const handleFollowClick = (e: React.MouseEvent) => {
    e.preventDefault() // Prevent navigation when clicking the follow button
    
    const userId = parseInt(user.id)
    if (isFollowingState) {
      unfollowMutation.mutate(userId)
    } else {
      followMutation.mutate(userId)
    }
  }

  const isLoading = followMutation.isPending || unfollowMutation.isPending

  return (
    <Link to={`/profile/${user.id}`} className="block">
      <Card className="h-full hover:shadow-lg transition-shadow duration-200 cursor-pointer">
        <CardContent className="p-6 text-center space-y-4">
          {/* User Avatar */}
          <div className="flex justify-center">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.username} />
              <AvatarFallback className="bg-purple-100 text-lg">
                <User className="h-10 w-10 text-purple-600" />
              </AvatarFallback>
            </Avatar>
          </div>

          {/* Username */}
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-gray-900">{user.username}</h3>
            {user.role && (
              <div className="flex justify-center">
                <UserRoleBadge role={user.role} />
              </div>
            )}
          </div>

          {/* Follower Count */}
          <p className="text-sm text-gray-500">팔로워: {user.followerCount}명</p>

          {/* Follow/Unfollow Button */}
          <Button
            onClick={handleFollowClick}
            className="w-full"
            variant={isFollowingState ? "outline" : "default"}
            disabled={isLoading}
          >
            {isLoading ? "처리 중..." : (isFollowingState ? "언팔로우" : "팔로우")}
          </Button>
        </CardContent>
      </Card>
    </Link>
  )
}

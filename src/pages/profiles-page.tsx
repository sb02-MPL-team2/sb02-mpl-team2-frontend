"use client"

import { MainLayout } from "@/components/main-layout"
import { UserProfileCard } from "@/components/user-profile-card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"
import { useState, useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import { userService } from "@/services/userService"
import { followService } from "@/services/followService"
import { useAuthStore } from "@/stores/authStore"
import { QUERY_KEYS } from "@/lib/constants"
import { UserDto } from "@/types"

// 사용자 + 팔로우 상태 정보를 합친 타입
interface UserWithFollowStatus extends UserDto {
  isFollowing: boolean;
}

export default function ProfilesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [followFilter, setFollowFilter] = useState("all")
  const { user: currentUser } = useAuthStore()

  // 모든 사용자 조회
  const { data: users = [], isLoading, error } = useQuery({
    queryKey: QUERY_KEYS.USERS,
    queryFn: userService.getUsers,
    retry: 1
  })

  // 현재 유저가 팔로우하는 사용자들의 ID 목록 조회
  const { data: followingUsers = [] } = useQuery({
    queryKey: ['following', currentUser?.id],
    queryFn: () => currentUser ? followService.getFollowing(currentUser.id) : Promise.resolve([]),
    enabled: !!currentUser?.id,
    retry: 1
  })

  // 사용자 목록에 팔로우 상태 정보 추가
  const usersWithFollowStatus: UserWithFollowStatus[] = useMemo(() => {
    const followingIds = new Set(followingUsers.map(user => user.id))
    return users
      .filter(user => user.id !== currentUser?.id) // 자기 자신 제외
      .map(user => ({
        ...user,
        isFollowing: followingIds.has(user.id)
      }))
  }, [users, followingUsers, currentUser?.id])

  // 필터링된 사용자 목록
  const filteredUsers = usersWithFollowStatus.filter((user) => {
    const matchesSearch = user.username.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesFollowFilter =
      followFilter === "all" ||
      (followFilter === "followed" && user.isFollowing) ||
      (followFilter === "unfollowed" && !user.isFollowing)

    return matchesSearch && matchesFollowFilter
  })

  return (
    <MainLayout activeRoute="/profiles">
      <div className="space-y-6">
        {/* Page Title */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">사용자 프로필</h1>
          <p className="text-gray-600 mt-2">다른 사용자들을 찾아보고 팔로우해보세요.</p>
        </div>

        {/* Filters Section */}
        <div className="flex flex-col md:flex-row gap-4">
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
                placeholder="사용자명을 입력하세요."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* New Follow Status Filter */}
          <div className="flex-1 space-y-2">
            <Label htmlFor="follow-filter" className="text-sm font-medium text-gray-700">
              팔로우 상태
            </Label>
            <Select value={followFilter} onValueChange={setFollowFilter}>
              <SelectTrigger id="follow-filter">
                <SelectValue placeholder="필터 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체</SelectItem>
                <SelectItem value="followed">팔로우한 사용자</SelectItem>
                <SelectItem value="unfollowed">팔로우 안 한 사용자</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <p className="text-gray-500">사용자 목록을 불러오는 중...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <p className="text-red-500">사용자 목록을 불러오는데 실패했습니다.</p>
          </div>
        )}

        {/* User Profile Grid */}
        {!isLoading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredUsers.map((user) => (
              <UserProfileCard 
                key={user.id} 
                user={{
                  id: user.id.toString(),
                  username: user.username,
                  avatar: user.profileUrl,
                  followerCount: user.followerCount,
                  isFollowing: user.isFollowing
                }} 
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">검색 결과가 없습니다.</p>
          </div>
        )}
      </div>
    </MainLayout>
  )
}
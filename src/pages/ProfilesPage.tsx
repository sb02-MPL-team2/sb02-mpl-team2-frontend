"use client"

import { MainLayout } from "@/components/main-layout"
import { UserProfileCard } from "@/components/user-profile-card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"
import { useState } from "react"

const mockUsers = [
  { id: "user1", username: "woody", avatar: "/avatars/woody.png", followerCount: 152, isFollowing: true },
  { id: "user2", username: "buzz", avatar: "/avatars/buzz.png", followerCount: 98, isFollowing: false },
  { id: "user3", username: "jessie", avatar: "/avatars/jessie.png", followerCount: 210, isFollowing: false },
  { id: "user4", username: "rex", avatar: "/avatars/rex.png", followerCount: 50, isFollowing: true },
  { id: "user5", username: "slinky", avatar: "/avatars/slinky.png", followerCount: 87, isFollowing: false },
  { id: "user6", username: "hamm", avatar: "/avatars/hamm.png", followerCount: 134, isFollowing: true },
  { id: "user7", username: "potato", avatar: "/avatars/potato.png", followerCount: 76, isFollowing: false },
  { id: "user8", username: "bullseye", avatar: "/avatars/bullseye.png", followerCount: 189, isFollowing: true },
  { id: "user9", username: "molly", avatar: "/avatars/molly.png", followerCount: 245, isFollowing: false },
  { id: "user10", username: "andy", avatar: "/avatars/andy.png", followerCount: 312, isFollowing: true },
  { id: "user11", username: "bonnie", avatar: "/avatars/bonnie.png", followerCount: 167, isFollowing: false },
  { id: "user12", username: "lotso", avatar: "/avatars/lotso.png", followerCount: 43, isFollowing: true },
]

export default function ProfilesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [followFilter, setFollowFilter] = useState("all") // New state for follow filter

  const filteredUsers = mockUsers.filter((user) => {
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

        {/* User Profile Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredUsers.map((user) => (
            <UserProfileCard key={user.id} user={user} />
          ))}
        </div>

        {/* Empty State */}
        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">검색 결과가 없습니다.</p>
          </div>
        )}
      </div>
    </MainLayout>
  )
}
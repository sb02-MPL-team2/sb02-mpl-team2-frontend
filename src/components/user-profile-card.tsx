"use client"

import type React from "react"
import { useState } from "react"
import { Link } from "react-router-dom"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User } from "lucide-react"

interface UserProfileCardProps {
  user: {
    id: string
    username: string
    avatar: string
    followerCount: number
    isFollowing: boolean // Add isFollowing to props
  }
}

export function UserProfileCard({ user }: UserProfileCardProps) {
  // Use local state for demonstration, in a real app this would come from a global state or API
  const [isFollowingState, setIsFollowingState] = useState(user.isFollowing)

  const handleFollowClick = (e: React.MouseEvent) => {
    e.preventDefault() // Prevent navigation when clicking the follow button
    setIsFollowingState((prev) => !prev) // Toggle follow state
    if (isFollowingState) {
      console.log("Unfollowing user:", user.username)
      alert(`${user.username}님을 언팔로우했습니다.`)
    } else {
      console.log("Following user:", user.username)
      alert(`${user.username}님을 팔로우했습니다!`)
    }
  }

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
          <h3 className="text-lg font-bold text-gray-900">{user.username}</h3>

          {/* Follower Count */}
          <p className="text-sm text-gray-500">팔로워: {user.followerCount}명</p>

          {/* Follow/Unfollow Button */}
          <Button
            onClick={handleFollowClick}
            className="w-full"
            variant={isFollowingState ? "outline" : "default"} // Conditional variant
          >
            {isFollowingState ? "언팔로우" : "팔로우"} {/* Conditional text */}
          </Button>
        </CardContent>
      </Card>
    </Link>
  )
}

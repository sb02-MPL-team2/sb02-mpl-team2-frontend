"use client"

import { Link } from "react-router-dom"
import { MainLayout } from "@/components/main-layout"
import { PlaylistCard } from "@/components/playlist-card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { User } from "lucide-react"
import { useState } from "react"

// Mock Data
const userProfile = {
  id: "user1",
  username: "woody",
  avatar: "/avatars/woody.png",
  followerCount: 152,
  followingCount: 89,
  status: "지금 인터스텔라를 보고 있습니다.",
  isFollowing: false, // Add this property
  myPlaylists: [
    {
      id: "pl1",
      title: "시간을 다룬 영화",
      contentSummary: "인터스텔라, 인셉션, 테넷 등 13개의 콘텐츠",
      lastUpdated: "2시간 전 업데이트 됨",
      subscriberCount: "102명이 구독중",
    },
    {
      id: "pl2",
      title: "인생 명작선",
      contentSummary: "쇼생크 탈출, 포레스트 검프 등 10개의 콘텐츠",
      lastUpdated: "3일 전 업데이트 됨",
      subscriberCount: "88명이 구독중",
    },
    {
      id: "pl3",
      title: "액션 영화 모음",
      contentSummary: "매드맥스, 존 윅, 미션 임파서블 등 15개의 콘텐츠",
      lastUpdated: "1일 전 업데이트 됨",
      subscriberCount: "67명이 구독중",
    },
    {
      id: "pl4",
      title: "감동 드라마",
      contentSummary: "그린 북, 어바웃 타임 등 8개의 콘텐츠",
      lastUpdated: "4일 전 업데이트 됨",
      subscriberCount: "45명이 구독중",
    },
  ],
  subscribedPlaylists: [
    {
      id: "pl5",
      title: "크리스토퍼 놀란 감독 특집",
      contentSummary: "다크나이트, 프레스티지 등 8개의 콘텐츠",
      lastUpdated: "5시간 전 업데이트 됨",
      subscriberCount: "231명이 구독중",
    },
    {
      id: "pl6",
      title: "마블 시네마틱 유니버스",
      contentSummary: "아이언맨, 어벤져스 등 23개의 콘텐츠",
      lastUpdated: "1일 전 업데이트 됨",
      subscriberCount: "456명이 구독중",
    },
    {
      id: "pl7",
      title: "한국 영화 걸작선",
      contentSummary: "기생충, 올드보이 등 12개의 콘텐츠",
      lastUpdated: "2일 전 업데이트 됨",
      subscriberCount: "189명이 구독중",
    },
  ],
}

interface UserProfileDetailPageProps {
  userId: string
}

export default function UserProfileDetailPage({ userId }: UserProfileDetailPageProps) {
  const [isFollowingState, setIsFollowingState] = useState(userProfile.isFollowing)

  const handleFollow = () => {
    setIsFollowingState((prev) => !prev) // Toggle follow state
    if (isFollowingState) {
      console.log("Unfollowing user:", userProfile.username)
      alert(`${userProfile.username}님을 언팔로우했습니다.`)
    } else {
      console.log("Following user:", userProfile.username)
      alert(`${userProfile.username}님을 팔로우했습니다!`)
    }
  }

  return (
    <MainLayout activeRoute="/profiles">
      <div className="space-y-8 max-w-6xl mx-auto">
        {/* Top Section - Profile Header */}
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
          {/* Avatar */}
          <Avatar className="h-32 w-32 mx-auto md:mx-0">
            <AvatarImage src={userProfile.avatar || "/placeholder.svg"} alt={userProfile.username} />
            <AvatarFallback className="bg-purple-100 text-2xl">
              <User className="h-16 w-16 text-purple-600" />
            </AvatarFallback>
          </Avatar>

          {/* User Info */}
          <div className="flex-1 text-center md:text-left space-y-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{userProfile.username}</h1>
              <div className="flex justify-center md:justify-start gap-6 mt-2 text-gray-600">
                <span>팔로워 {userProfile.followerCount}명</span>
                <span>팔로잉 {userProfile.followingCount}명</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center md:justify-start gap-3">
              <Button
                onClick={handleFollow}
                variant={isFollowingState ? "outline" : "default"} // Conditional variant
                className={isFollowingState ? "" : "bg-purple-600 hover:bg-purple-700"} // Conditional class for primary button
              >
                {isFollowingState ? "언팔로우" : "팔로우"} {/* Conditional text */}
              </Button>
              <Link to={`/chat/${userProfile.id}`}>
                <Button variant="outline">메시지 보내기</Button>
              </Link>
            </div>

            {/* Status */}
            <p className="text-gray-600 italic">{userProfile.status}</p>
          </div>
        </div>

        {/* Middle Section - User's Own Playlists */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">플레이리스트 ({userProfile.myPlaylists.length})</h2>

          {userProfile.myPlaylists.length > 0 ? (
            <Carousel className="w-full">
              <CarouselContent className="-ml-2 md:-ml-4">
                {userProfile.myPlaylists.map((playlist) => (
                  <CarouselItem key={playlist.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                    <PlaylistCard playlist={playlist} />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">아직 생성한 플레이리스트가 없습니다.</p>
            </div>
          )}
        </div>

        {/* Bottom Section - Subscribed Playlists */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">
            구독 중인 플레이리스트 ({userProfile.subscribedPlaylists.length})
          </h2>

          {userProfile.subscribedPlaylists.length > 0 ? (
            <Carousel className="w-full">
              <CarouselContent className="-ml-2 md:-ml-4">
                {userProfile.subscribedPlaylists.map((playlist) => (
                  <CarouselItem key={playlist.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                    <PlaylistCard playlist={playlist} />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">구독 중인 플레이리스트가 없습니다.</p>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  )
}
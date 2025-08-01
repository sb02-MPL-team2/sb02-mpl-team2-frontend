"use client"

import { MainLayout } from "@/components/main-layout"
import { PlaylistCard } from "@/components/playlist-card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select" // Select components import
import { Search } from "lucide-react"
import { useState } from "react" // useState import

const mockPlaylists = [
  {
    id: "pl1",
    title: "시간을 다룬 영화",
    contentSummary: "인터스텔라, 인셉션, 테넷 등 13개의 콘텐츠",
    lastUpdated: "2시간 전 업데이트 됨",
    subscriberCount: "102명이 구독중",
    isSubscribed: true, // Mock data update
  },
  {
    id: "pl2",
    title: "크리스토퍼 놀란 감독 특집",
    contentSummary: "다크나이트, 프레스티지 등 8개의 콘텐츠",
    lastUpdated: "5시간 전 업데이트 됨",
    subscriberCount: "231명이 구독중",
    isSubscribed: false, // Mock data update
  },
  {
    id: "pl3",
    title: "주말에 몰아볼만한 드라마",
    contentSummary: "종이의 집, 기묘한 이야기 등 5개의 콘텐츠",
    lastUpdated: "1일 전 업데이트 됨",
    subscriberCount: "54명이 구독중",
    isSubscribed: true, // Mock data update
  },
  {
    id: "pl4",
    title: "눈물 쏙 빼는 애니메이션",
    contentSummary: "코코, 너의 이름은. 등 10개의 콘텐츠",
    lastUpdated: "3일 전 업데이트 됨",
    subscriberCount: "178명이 구독중",
    isSubscribed: false, // Mock data update
  },
  {
    id: "pl5",
    title: "MCU 정주행 리스트",
    contentSummary: "아이언맨, 캡틴 아메리카 등 23개의 콘텐츠",
    lastUpdated: "1주 전 업데이트 됨",
    subscriberCount: "305명이 구독중",
    isSubscribed: true, // Mock data update
  },
  {
    id: "pl6",
    title: "한국 영화 명작 모음",
    contentSummary: "기생충, 올드보이, 아가씨 등 15개의 콘텐츠",
    lastUpdated: "3일 전 업데이트 됨",
    subscriberCount: "89명이 구독중",
    isSubscribed: false, // Mock data update
  },
  {
    id: "pl7",
    title: "스릴러 장르 베스트",
    contentSummary: "조커, 샤이닝, 사이코 등 12개의 콘텐츠",
    lastUpdated: "1주 전 업데이트 됨",
    subscriberCount: "156명이 구독중",
    isSubscribed: true, // Mock data update
  },
  {
    id: "pl8",
    title: "가족과 함께 보기 좋은 영화",
    contentSummary: "토이 스토리, 겨울왕국 등 18개의 콘텐츠",
    lastUpdated: "4일 전 업데이트 됨",
    subscriberCount: "267명이 구독중",
    isSubscribed: false, // Mock data update
  },
]

export default function PlaylistsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [subscriptionFilter, setSubscriptionFilter] = useState("all") // New state for subscription filter

  const filteredPlaylists = mockPlaylists.filter((playlist) => {
    const matchesSearch =
      playlist.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      playlist.contentSummary.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesSubscriptionFilter =
      subscriptionFilter === "all" ||
      (subscriptionFilter === "subscribed" && playlist.isSubscribed) ||
      (subscriptionFilter === "unsubscribed" && !playlist.isSubscribed)

    return matchesSearch && matchesSubscriptionFilter
  })

  return (
    <MainLayout activeRoute="/playlists">
      <div className="space-y-6">
        {/* Page Title */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">플레이리스트</h1>
          <p className="text-gray-600 mt-2">다양한 주제의 플레이리스트를 탐색해보세요.</p>
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

        {/* Playlist Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPlaylists.map((playlist) => (
            <PlaylistCard key={playlist.id} playlist={playlist} />
          ))}
        </div>

        {/* Empty State */}
        {filteredPlaylists.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">검색 조건에 맞는 플레이리스트가 없습니다.</p>
          </div>
        )}
      </div>
    </MainLayout>
  )
}
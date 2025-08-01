"use client"

import { MainLayout } from "@/components/main-layout"
import { ContentCard } from "@/components/content-card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Search } from "lucide-react"

const mockContents = [
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
    category: "드라마",
    title: "기묘한 이야기",
    description: "실종된 소년, 기이한 힘을 가진 소녀...",
    rating: 4.8,
    reviewCount: "1.2k",
    viewerCount: "456",
  },
  {
    id: 3,
    category: "애니메이션",
    title: "너의 이름은.",
    description: "꿈 속에서 몸이 뒤바뀐 도시 소년과 시골 소녀...",
    rating: 4.9,
    reviewCount: "2.1k",
    viewerCount: "789",
  },
  {
    id: 4,
    category: "다큐멘터리",
    title: "우리의 지구",
    description: "경이로운 자연의 모습을 담은 다큐멘터리",
    rating: 4.9,
    reviewCount: "876",
    viewerCount: "101",
  },
  {
    id: 5,
    category: "영화",
    title: "어벤져스: 엔드게임",
    description: "타노스와의 마지막 전투",
    rating: 4.8,
    reviewCount: "5.5k",
    viewerCount: "1.2k",
  },
  {
    id: 6,
    category: "드라마",
    title: "종이의 집",
    description: "교수라 불리는 한 남자가...",
    rating: 4.7,
    reviewCount: "3.4k",
    viewerCount: "987",
  },
  {
    id: 7,
    category: "애니메이션",
    title: "스파이더맨: 뉴 유니버스",
    description: "새로운 차원의 스파이더맨",
    rating: 4.9,
    reviewCount: "4.1k",
    viewerCount: "1.5k",
  },
  {
    id: 8,
    category: "영화",
    title: "매드맥스: 분노의 도로",
    description: "핵전쟁으로 멸망한 22세기...",
    rating: 4.8,
    reviewCount: "2.9k",
    viewerCount: "876",
  },
]

export default function DashboardPage() {
  return (
    <MainLayout activeRoute="/contents">
      <div className="space-y-6">
        {/* Page Title */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">콘텐츠 같이 보기</h1>
          <p className="text-gray-600 mt-2">다른 사람들과 함께 콘텐츠를 시청해보세요.</p>
        </div>

        {/* Search Bar */}
        <div className="space-y-2">
          <Label htmlFor="search" className="text-sm font-medium text-gray-700">
            검색
          </Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input id="search" type="text" placeholder="검색어를 입력하세요." className="pl-10" />
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {mockContents.map((content) => (
            <ContentCard key={content.id} content={content} />
          ))}
        </div>
      </div>
    </MainLayout>
  )
}
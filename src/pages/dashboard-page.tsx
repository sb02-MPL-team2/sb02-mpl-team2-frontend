"use client"

import { useState, useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import { MainLayout } from "@/components/main-layout"
import { ContentCard } from "@/components/content-card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Search } from "lucide-react"
import { contentService } from "@/services/contentService"
import { Content } from "@/types"

export default function DashboardPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredContents, setFilteredContents] = useState<Content[]>([])

  const { data: contents = [], isLoading, error } = useQuery({
    queryKey: ['contents'],
    queryFn: contentService.getContents
  })

  // 검색 필터링
  useEffect(() => {
    if (!contents) return
    
    const filtered = contents.filter((content) =>
      content.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      content.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      content.category.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredContents(filtered)
  }, [contents, searchTerm])

  if (isLoading) {
    return (
      <MainLayout activeRoute="/contents">
        <div className="flex items-center justify-center min-h-64">
          <div className="text-gray-500">콘텐츠를 불러오는 중...</div>
        </div>
      </MainLayout>
    )
  }

  if (error) {
    return (
      <MainLayout activeRoute="/contents">
        <div className="flex items-center justify-center min-h-64">
          <div className="text-red-500">콘텐츠를 불러오는데 실패했습니다.</div>
        </div>
      </MainLayout>
    )
  }

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
            <Input 
              id="search" 
              type="text" 
              placeholder="검색어를 입력하세요." 
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredContents.length > 0 ? (
            filteredContents.map((content) => (
              <ContentCard key={content.id} content={content} />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="text-gray-500">
                {searchTerm ? "검색 결과가 없습니다." : "콘텐츠가 없습니다."}
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  )
}
"use client"

import type React from "react"
import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

import { MainLayout } from "@/components/main-layout"
import { ContentDetailSection } from "@/components/content-detail-section"
import { ReviewItem } from "@/components/review-item"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { contentService } from "@/services/contentService"
import { reviewService } from "@/services/reviewService"
import { useAuthStore } from "@/stores/authStore"
import { QUERY_KEYS } from "@/lib/constants"
import type { ReviewDto } from "@/types"

interface ReviewPageProps {
  contentId: string
}

export default function ReviewPage({ contentId }: ReviewPageProps) {
  const [rating, setRating] = useState("5")
  const [comment, setComment] = useState("")
  const queryClient = useQueryClient()
  const { user } = useAuthStore()

  // 콘텐츠 상세 정보 조회
  const { data: content, isLoading: isContentLoading } = useQuery({
    queryKey: QUERY_KEYS.CONTENT(parseInt(contentId)),
    queryFn: () => contentService.getContentById(parseInt(contentId))
  })

  // 리뷰 목록 조회
  const { data: reviews = [], isLoading: isReviewsLoading } = useQuery({
    queryKey: QUERY_KEYS.CONTENT_REVIEWS(parseInt(contentId)),
    queryFn: () => reviewService.getReviewsByContentId(parseInt(contentId))
  })

  // 리뷰 작성 mutation
  const createReviewMutation = useMutation({
    mutationFn: reviewService.createReview,
    onSuccess: () => {
      // 리뷰 목록과 콘텐츠 정보 새로고침
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CONTENT_REVIEWS(parseInt(contentId)) })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CONTENT(parseInt(contentId)) })
      // 폼 초기화
      setRating("5")
      setComment("")
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || "리뷰 작성에 실패했습니다.")
    }
  })

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) {
      alert("로그인이 필요합니다.")
      return
    }

    if (!comment.trim()) {
      alert("리뷰 내용을 입력해주세요.")
      return
    }

    createReviewMutation.mutate({
      userId: user.id,
      contentId: parseInt(contentId),
      rating: parseInt(rating),
      comment: comment.trim()
    })
  }

  // 로딩 상태
  if (isContentLoading || isReviewsLoading) {
    return (
      <MainLayout activeRoute="/contents">
        <div className="flex items-center justify-center min-h-64">
          <div className="text-gray-500">리뷰 정보를 불러오는 중...</div>
        </div>
      </MainLayout>
    )
  }

  // 에러 상태
  if (!content) {
    return (
      <MainLayout activeRoute="/contents">
        <div className="flex items-center justify-center min-h-64">
          <div className="text-red-500">콘텐츠를 찾을 수 없습니다.</div>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout activeRoute="/contents">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* 콘텐츠 상세 정보 섹션 - 재사용 */}
        <ContentDetailSection content={content} />

        {/* 리뷰 작성 섹션 */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">리뷰 작성</h3>
            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div className="flex items-center gap-4">
                <label className="font-medium">평점:</label>
                <Select value={rating} onValueChange={setRating}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">⭐⭐⭐⭐⭐ 5</SelectItem>
                    <SelectItem value="4">⭐⭐⭐⭐ 4</SelectItem>
                    <SelectItem value="3">⭐⭐⭐ 3</SelectItem>
                    <SelectItem value="2">⭐⭐ 2</SelectItem>
                    <SelectItem value="1">⭐ 1</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="이 콘텐츠에 대한 생각을 공유해주세요..."
                className="min-h-[100px]"
              />
              
              <div className="flex justify-end">
                <Button 
                  type="submit" 
                  className="bg-purple-600 hover:bg-purple-700"
                  disabled={createReviewMutation.isPending}
                >
                  {createReviewMutation.isPending ? "등록 중..." : "리뷰 등록"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* 리뷰 목록 섹션 */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">
              리뷰 ({reviews.length}개)
            </h3>
            
            <ScrollArea className="h-[600px] pr-4">
              <div className="space-y-4">
                {reviews.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">
                    아직 작성된 리뷰가 없습니다. 첫 번째 리뷰를 작성해보세요!
                  </p>
                ) : (
                  reviews.map((review: ReviewDto) => (
                    <ReviewItem key={review.id} review={review} />
                  ))
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}
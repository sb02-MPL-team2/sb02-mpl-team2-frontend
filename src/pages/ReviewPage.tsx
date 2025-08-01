"use client"

import type React from "react"
import { useState } from "react"

import { MainLayout } from "@/components/main-layout"
import { ReviewItem } from "@/components/review-item"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Star, ImageIcon } from "lucide-react"

// Mock Data - Same content detail as the watch page
const contentDetail = {
  id: 1,
  title: "인터스텔라",
  category: "영화",
  rating: 4.9,
  reviewCount: "987",
  description:
    "인류의 새로운 보금자리를 찾아 떠나는 우주 탐험 서사시. 지구의 종말이 다가오는 가운데, 전직 NASA 조종사 쿠퍼는 인류를 구하기 위한 비밀 임무에 참여하게 됩니다. 시간과 공간을 초월한 감동적인 이야기가 펼쳐집니다.",
}

const mockReviews = [
  {
    id: "r1",
    user: { name: "woody", avatar: "/avatars/woody.png" },
    rating: 4.7,
    text: "최고의 작품입니다. 여러 번 봐도 재미있네요.",
  },
  {
    id: "r2",
    user: { name: "buzz", avatar: "/avatars/buzz.png" },
    rating: 4.5,
    text: "시간 가는 줄 모르고 봤습니다.",
  },
  {
    id: "r3",
    user: { name: "jessie", avatar: "/avatars/jessie.png" },
    rating: 4.8,
    text: "인생 영화 등극!",
  },
  {
    id: "r4",
    user: { name: "rex", avatar: "/avatars/rex.png" },
    rating: 4.9,
    text: "과학적 고증과 감동이 완벽하게 조화된 작품입니다. 특히 블랙홀 장면은 정말 압도적이었어요.",
  },
  {
    id: "r5",
    user: { name: "slinky", avatar: "/avatars/slinky.png" },
    rating: 4.6,
    text: "가족의 사랑과 희생을 다룬 부분이 특히 인상깊었습니다.",
  },
]

interface ReviewPageProps {
  contentId: string
}

export default function ReviewPage({ contentId }: ReviewPageProps) {
  const [reviewText, setReviewText] = useState("")

  const handleAddToPlaylist = () => {
    console.log("Adding to playlist:", contentDetail.title)
    alert("플레이리스트에 추가되었습니다!")
  }

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault()
    if (reviewText.trim()) {
      console.log("Submitting review:", reviewText)
      alert("리뷰가 등록되었습니다!")
      setReviewText("")
    }
  }

  return (
    <MainLayout activeRoute="/contents">
      <div className="space-y-6 max-w-4xl mx-auto">
        {/* Top Section - Content Info (Identical to Content Detail Page) */}
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Video/Image Placeholder */}
              <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
                <ImageIcon className="h-16 w-16 text-gray-400" />
              </div>

              {/* Content Details */}
              <div className="space-y-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{contentDetail.title}</h2>
                  <p className="text-purple-600 font-medium">{contentDetail.category}</p>
                </div>

                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="font-medium">{contentDetail.rating}</span>
                  <span className="text-gray-500">({contentDetail.reviewCount})</span>
                </div>

                <Button onClick={handleAddToPlaylist} className="bg-purple-600 hover:bg-purple-700">
                  내 플레이리스트에 추가하기
                </Button>

                <p className="text-gray-600 text-sm leading-relaxed">{contentDetail.description}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bottom Section - Review Area */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">리뷰</h2>

          {/* Reviews List */}
          <ScrollArea className="h-96">
            <div className="space-y-4">
              {mockReviews.map((review) => (
                <ReviewItem key={review.id} review={review} />
              ))}
            </div>
          </ScrollArea>

          {/* Review Submission Form */}
          <Card>
            <CardContent className="p-6">
              <form onSubmit={handleSubmitReview} className="space-y-4">
                <Textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="리뷰를 등록해주세요."
                  className="min-h-[100px] resize-none"
                  required
                />
                <div className="flex justify-end">
                  <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
                    등록
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  )
}